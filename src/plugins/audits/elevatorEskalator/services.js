'use strict';
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('elevatorEskalator');

const elevatorServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = { ...payload, subInspectionType: "Elevator", documentType: "Laporan", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Elevator')
                .where('documentType', '==', 'Laporan')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().subInspectionType !== 'Elevator' || doc.data().documentType !== 'Laporan') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const doc = await laporanRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Elevator') {
                return null;
            }
            
            payload.createdAt = dayjs().tz("Asia/Jakarta").format()

            await laporanRef.update(payload);

            // --- SINKRONISASI DARI LAPORAN KE BAP ---
            const bapQuery = await auditCollection
                .where('laporanId', '==', id)
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .limit(1)
                .get();

            if (!bapQuery.empty) {
                const bapRef = bapQuery.docs[0].ref;
                const dataToSync = {};
                const p = payload;

                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.equipmentType !== undefined) dataToSync.equipmentType = p.equipmentType;

                if (p.generalData) {
                    if (p.generalData.inspectionDate !== undefined) dataToSync.inspectionDate = p.generalData.inspectionDate;
                    if (p.generalData.ownerName !== undefined) dataToSync['generalData.ownerName'] = p.generalData.ownerName;
                    if (p.generalData.ownerAddress !== undefined) dataToSync['generalData.ownerAddress'] = p.generalData.ownerAddress;
                    if (p.generalData.nameUsageLocation !== undefined) dataToSync['generalData.nameUsageLocation'] = p.generalData.nameUsageLocation;
                    if (p.generalData.addressUsageLocation !== undefined) dataToSync['generalData.addressUsageLocation'] = p.generalData.addressUsageLocation;
                    
                    if (p.generalData.elevatorType !== undefined) dataToSync['technicalData.elevatorType'] = p.generalData.elevatorType;
                    if (p.generalData.manufacturerOrInstaller !== undefined) dataToSync['technicalData.manufacturerOrInstaller'] = p.generalData.manufacturerOrInstaller;
                    if (p.generalData.brandOrType !== undefined) dataToSync['technicalData.brandOrType'] = p.generalData.brandOrType;
                    if (p.generalData.countryAndYear !== undefined) dataToSync['technicalData.countryAndYear'] = p.generalData.countryAndYear;
                    if (p.generalData.serialNumber !== undefined) dataToSync['technicalData.serialNumber'] = p.generalData.serialNumber;
                    if (p.generalData.capacity !== undefined) dataToSync['technicalData.capacity'] = p.generalData.capacity;
                    if (p.generalData.speed !== undefined) dataToSync['technicalData.speed'] = p.generalData.speed;
                    if (p.generalData.floorsServed !== undefined) dataToSync['technicalData.floorsServed'] = p.generalData.floorsServed;
                }

                if (Object.keys(dataToSync).length > 0) {
                    await bapRef.update(dataToSync);
                }
            }

            const updatedDoc = await laporanRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().subInspectionType !== 'Elevator' || doc.data().documentType !== 'Laporan') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        getDataForPrefill: async (laporanId) => {
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan'  || laporanDoc.data().subInspectionType !== 'Elevator') {
                return null;
            }
            const d = laporanDoc.data();
            
            return {
                laporanId: laporanId,
                inspectionDate: d.generalData?.inspectionDate || "",
                examinationType: d.examinationType || "",
                equipmentType: d.equipmentType || "",
                generalData: {
                    ownerName: d.generalData?.ownerName || "",
                    ownerAddress: d.generalData?.ownerAddress || "",
                    nameUsageLocation: d.generalData?.nameUsageLocation || "",
                    addressUsageLocation: d.generalData?.addressUsageLocation || ""
                },
                technicalData: {
                    elevatorType: d.generalData?.elevatorType || "",
                    manufacturerOrInstaller: d.generalData?.manufacturerOrInstaller || "",
                    brandOrType: d.generalData?.brandOrType || "",
                    countryAndYear: d.generalData?.countryAndYear || "",
                    serialNumber: d.generalData?.serialNumber || "",
                    capacity: d.generalData?.capacity || "",
                    speed: d.generalData?.speed || "",
                    floorsServed: d.generalData?.floorsServed || ""
                },
                visualInspection: {},
                testing: {}
            };
        },

        create: async (payload) => {
            const { laporanId } = payload;
            const laporanRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanRef.get();

            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan' || laporanDoc.data().subInspectionType !== 'Elevator') {
                throw Boom.notFound('Laporan Elevator tidak ditemukan.');
            }
            
            const dataToSync = {};
            const p = payload; 

            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.equipmentType !== undefined) dataToSync.equipmentType = p.equipmentType;
            if (p.inspectionDate !== undefined) dataToSync['generalData.inspectionDate'] = p.inspectionDate;

            if (p.generalData) {
                if (p.generalData.ownerName !== undefined) dataToSync['generalData.ownerName'] = p.generalData.ownerName;
                if (p.generalData.ownerAddress !== undefined) dataToSync['generalData.ownerAddress'] = p.generalData.ownerAddress;
                if (p.generalData.nameUsageLocation !== undefined) dataToSync['generalData.nameUsageLocation'] = p.generalData.nameUsageLocation;
                if (p.generalData.addressUsageLocation !== undefined) dataToSync['generalData.addressUsageLocation'] = p.generalData.addressUsageLocation;
            }

            if (p.technicalData) {
                if (p.technicalData.elevatorType !== undefined) dataToSync['generalData.elevatorType'] = p.technicalData.elevatorType;
                if (p.technicalData.manufacturerOrInstaller !== undefined) dataToSync['generalData.manufacturerOrInstaller'] = p.technicalData.manufacturerOrInstaller;
                if (p.technicalData.brandOrType !== undefined) dataToSync['generalData.brandOrType'] = p.technicalData.brandOrType;
                if (p.technicalData.countryAndYear !== undefined) dataToSync['generalData.countryAndYear'] = p.technicalData.countryAndYear;
                if (p.technicalData.serialNumber !== undefined) dataToSync['generalData.serialNumber'] = p.technicalData.serialNumber;
                if (p.technicalData.capacity !== undefined) dataToSync['generalData.capacity'] = p.technicalData.capacity;
                if (p.technicalData.speed !== undefined) dataToSync['generalData.speed'] = p.technicalData.speed;
                if (p.technicalData.floorsServed !== undefined) dataToSync['generalData.floorsServed'] = p.technicalData.floorsServed;
            }

            if (Object.keys(dataToSync).length > 0) {
                await laporanRef.update(dataToSync);
            }
            
            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = { ...payload, subInspectionType: "Elevator", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Elevator')
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Elevator') return null;
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const bapRef = auditCollection.doc(id);
            const bapDoc = await bapRef.get();

            if (!bapDoc.exists || bapDoc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || bapDoc.data().subInspectionType !== 'Elevator') {
                return null; 
            }
            
            
            const { laporanId } = bapDoc.data();

            if (!laporanId) {
                throw Boom.badRequest('Update gagal. BAP tidak terhubung dengan Laporan (laporanId tidak ditemukan).');
            }

            const laporanRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanRef.get();

            if (!laporanDoc.exists) {
                throw Boom.notFound('Update gagal. Laporan yang terhubung dengan BAP tidak ditemukan.');
            }

            payload.createdAt = dayjs().tz("Asia/Jakarta").format();

            await bapRef.update(payload);
            
            // --- SINKRONISASI DARI BAP KE LAPORAN ---
            const dataToSync = {};
            const p = payload; // payload from the updated BAP

            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.equipmentType !== undefined) dataToSync.equipmentType = p.equipmentType;
            if (p.inspectionDate !== undefined) dataToSync['generalData.inspectionDate'] = p.inspectionDate;

            if (p.generalData) {
                if (p.generalData.ownerName !== undefined) dataToSync['generalData.ownerName'] = p.generalData.ownerName;
                if (p.generalData.ownerAddress !== undefined) dataToSync['generalData.ownerAddress'] = p.generalData.ownerAddress;
                if (p.generalData.nameUsageLocation !== undefined) dataToSync['generalData.nameUsageLocation'] = p.generalData.nameUsageLocation;
                if (p.generalData.addressUsageLocation !== undefined) dataToSync['generalData.addressUsageLocation'] = p.generalData.addressUsageLocation;
            }

            if (p.technicalData) {
                if (p.technicalData.elevatorType !== undefined) dataToSync['generalData.elevatorType'] = p.technicalData.elevatorType;
                if (p.technicalData.manufacturerOrInstaller !== undefined) dataToSync['generalData.manufacturerOrInstaller'] = p.technicalData.manufacturerOrInstaller;
                if (p.technicalData.brandOrType !== undefined) dataToSync['generalData.brandOrType'] = p.technicalData.brandOrType;
                if (p.technicalData.countryAndYear !== undefined) dataToSync['generalData.countryAndYear'] = p.technicalData.countryAndYear;
                if (p.technicalData.serialNumber !== undefined) dataToSync['generalData.serialNumber'] = p.technicalData.serialNumber;
                if (p.technicalData.capacity !== undefined) dataToSync['generalData.capacity'] = p.technicalData.capacity;
                if (p.technicalData.speed !== undefined) dataToSync['generalData.speed'] = p.technicalData.speed;
                if (p.technicalData.floorsServed !== undefined) dataToSync['generalData.floorsServed'] = p.technicalData.floorsServed;
            }

            if (Object.keys(dataToSync).length > 0) {
                await laporanRef.update(dataToSync);
            }
            
            const updatedDoc = await bapRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Elevator') return null;
            await docRef.delete();
            return id;
        },
    }
};

const eskalatorServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = { ...payload, subInspectionType: "Eskalator", documentType: "Laporan", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Eskalator').where('documentType', '==', 'Laporan').orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Eskalator') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const doc = await laporanRef.get();

            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Eskalator') {
                return null;
            }

             payload.createdAt = dayjs().tz("Asia/Jakarta").format()

            await laporanRef.update(payload);

            const bapQuery = await auditCollection
                .where('laporanId', '==', id)
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .where('subInspectionType', '==', 'Eskalator')
                .limit(1)
                .get();

            if (!bapQuery.empty) {
                const bapDocRef = bapQuery.docs[0].ref;
                const dataToSyncForBap = {};
                const p = payload;

                if (p.generalData?.examinationType !== undefined) dataToSyncForBap.examinationType = p.generalData.examinationType;
                if (p.inspectionType !== undefined) dataToSyncForBap.inspectionType = p.inspectionType;
                if (p.generalData?.inspectionDate !== undefined) dataToSyncForBap.inspectionDate = p.generalData.inspectionDate;
                if (p.generalData?.ownerName !== undefined) dataToSyncForBap['generalData.ownerName'] = p.generalData.ownerName;
                
                if (p.technicalData) {
                    const { technicalData } = p;
                    if (technicalData.technicalDatamanufacturer !== undefined) dataToSyncForBap['technicalData.technicalDatamanufacturer'] = technicalData.technicalDatamanufacturer;
                    if (technicalData.technicalDatabrand !== undefined) dataToSyncForBap['technicalData.technicalDatabrand'] = technicalData.technicalDatabrand;
                    if (technicalData.technicalDatacountryAndYear !== undefined) dataToSyncForBap['technicalData.technicalDatacountryAndYear'] = technicalData.technicalDatacountryAndYear;
                    if (technicalData.technicalDataserialNumber !== undefined) dataToSyncForBap['technicalData.technicalDataserialNumber'] = technicalData.technicalDataserialNumber;
                    if (technicalData.technicalDatacapacity !== undefined) dataToSyncForBap['technicalData.technicalDatacapacity'] = technicalData.technicalDatacapacity;
                    if (technicalData.technicalDataspeed !== undefined) dataToSyncForBap['technicalData.technicalDataspeed'] = technicalData.technicalDataspeed;
                    if (technicalData.technicalDatatransports !== undefined) dataToSyncForBap['technicalData.technicalDatatransports'] = technicalData.technicalDatatransports;
                }
                
                if (p.equipmentType !== undefined) dataToSyncForBap['technicalData.equipmentType'] = p.equipmentType;

                if (Object.keys(dataToSyncForBap).length > 0) {
                    await bapDocRef.update(dataToSyncForBap);
                }
            }

            const updatedDoc = await laporanRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Eskalator') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        getDataForPrefill: async (laporanId) => {
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan' || laporanDoc.data().subInspectionType !== 'Eskalator') {
                return null;
            }
            const d = laporanDoc.data();
            
            return {
                laporanId,
                examinationType: d.generalData?.examinationType || "",
                inspectionType: d.inspectionType || "",
                inspectionDate: d.generalData?.inspectionDate || "",
                generalData: {
                    ownerName: d.generalData?.ownerName || "",
                    companyLocation: d.generalData?.ownerAddress || "",
                    nameUsageLocation: d.generalData?.nameUsageLocation || "",
                    locationUsageLocation: d.generalData?.addressUsageLocation || ""
                },
                technicalData: {
                    equipmentType: d.equipmentType || "",
                    technicalDatamanufacturer: d.technicalData?.technicalDatamanufacturer || "",
                    technicalDatabrand: d.technicalData?.technicalDatabrand || "",
                    technicalDatacountryAndYear: d.technicalData?.technicalDatacountryAndYear || "",
                    technicalDataserialNumber: d.technicalData?.technicalDataserialNumber || "",
                    technicalDatacapacity: d.technicalData?.technicalDatacapacity || "",
                    technicalDataspeed: d.technicalData?.technicalDataspeed || "",
                    technicalDatatransports: d.technicalData?.technicalDatatransports || ""
                },
                visualInspection: {},
                testing: {}
            };
        },

        create: async (payload) => {
            const { laporanId } = payload;
            const laporanDocRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanDocRef.get();

            if (!laporanDoc.exists) throw Boom.notFound('Laporan Eskalator tidak ditemukan.');
            
            const dataToSync = {
                'generalData.examinationType': payload.examinationType,
                'generalData.inspectionDate': payload.inspectionDate,
                'generalData.ownerName': payload.generalData?.ownerName,
                'equipmentType': payload.technicalData?.equipmentType
            };

            const { technicalData } = payload;
            if (technicalData) {
                dataToSync['technicalData.technicalDatamanufacturer'] = technicalData.technicalDatamanufacturer;
                dataToSync['technicalData.technicalDatabrand'] = technicalData.technicalDatabrand;
                dataToSync['technicalData.technicalDatacountryAndYear'] = technicalData.technicalDatacountryAndYear;
                dataToSync['technicalData.technicalDataserialNumber'] = technicalData.technicalDataserialNumber;
                dataToSync['technicalData.technicalDatacapacity'] = technicalData.technicalDatacapacity;
                dataToSync['technicalData.technicalDataspeed'] = technicalData.technicalDataspeed;
                dataToSync['technicalData.technicalDatatransports'] = technicalData.technicalDatatransports;
            }
            
            await laporanDocRef.update(dataToSync);
            
            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = { ...payload, subInspectionType: "Eskalator", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            
            return { id: docRef.id, ...dataToSave };
        },
        
        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Eskalator').where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian').orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Eskalator') return null;
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();

            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Eskalator') {
                return null;
            }

            payload.createdAt = dayjs().tz("Asia/Jakarta").format();

            await docRef.update(payload);

            const { laporanId } = doc.data();

            if (laporanId) {
                const dataToSync = {};
                const p = payload;

                if (p.examinationType !== undefined) dataToSync['generalData.examinationType'] = p.examinationType;
                if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
                if (p.inspectionDate !== undefined) dataToSync['generalData.inspectionDate'] = p.inspectionDate;
                if (p.generalData?.ownerName !== undefined) dataToSync['generalData.ownerName'] = p.generalData.ownerName;
                
                if (p.technicalData) {
                    const { technicalData } = p;
                    if (technicalData.equipmentType !== undefined) dataToSync.equipmentType = technicalData.equipmentType;
                    if (technicalData.technicalDatamanufacturer !== undefined) dataToSync['technicalData.technicalDatamanufacturer'] = technicalData.technicalDatamanufacturer;
                    if (technicalData.technicalDatabrand !== undefined) dataToSync['technicalData.technicalDatabrand'] = technicalData.technicalDatabrand;
                    if (technicalData.technicalDatacountryAndYear !== undefined) dataToSync['technicalData.technicalDatacountryAndYear'] = technicalData.technicalDatacountryAndYear;
                    if (technicalData.technicalDataserialNumber !== undefined) dataToSync['technicalData.technicalDataserialNumber'] = technicalData.technicalDataserialNumber;
                    if (technicalData.technicalDatacapacity !== undefined) dataToSync['technicalData.technicalDatacapacity'] = technicalData.technicalDatacapacity;
                    if (technicalData.technicalDataspeed !== undefined) dataToSync['technicalData.technicalDataspeed'] = technicalData.technicalDataspeed;
                    if (technicalData.technicalDatatransports !== undefined) dataToSync['technicalData.technicalDatatransports'] = technicalData.technicalDatatransports;
                }
                
                if (Object.keys(dataToSync).length > 0) {
                    const laporanDocRef = auditCollection.doc(laporanId);
                    if ((await laporanDocRef.get()).exists) {
                        await laporanDocRef.update(dataToSync);
                    }
                }
            }

            const updatedDoc = await docRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

       deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Eskalator') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    }
};

module.exports = {
  elevatorServices,
  eskalatorServices
};