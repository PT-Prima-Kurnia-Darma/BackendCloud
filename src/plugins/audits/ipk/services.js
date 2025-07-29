'use strict';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('proteksiKebakaran');

const proteksiKebakaranServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = { 
                ...payload, 
                subInspectionType: "Instalasi Proteksi Kebakaran", 
                documentType: "Laporan", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Instalasi Proteksi Kebakaran')
                .where('documentType', '==', 'Laporan')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) {
                return [];
            }
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Proteksi Kebakaran') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const doc = await laporanRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Proteksi Kebakaran') {
                return null;
            }
            
            // 1. Update Laporan
            await laporanRef.update(payload);

            // 2. Sinkronisasi dari Laporan ke BAP
            const bapQuery = await auditCollection
                .where('laporanId', '==', id)
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .limit(1)
                .get();
            
            if (!bapQuery.empty) {
                const bapRef = bapQuery.docs[0].ref;
                const dataToSync = {};
                const p = payload;

                // Mapping data dari Laporan ke BAP
                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
                if (p.equipmentType !== undefined) dataToSync.equipmentType = p.equipmentType;
                if (p.generalData?.inspectionDate !== undefined) dataToSync.inspectionDate = p.generalData.inspectionDate;
                if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
                if (p.generalData?.companyLocation !== undefined) {
                    dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                    dataToSync['generalData.addressUsageLocation'] = p.generalData.companyLocation;
                }
                if (p.generalData?.usageLocation !== undefined) dataToSync['generalData.usageLocation'] = p.generalData.usageLocation;

                if (p.buildingData) {
                    if (p.buildingData.landArea !== undefined) dataToSync['technicalData.landArea'] = p.buildingData.landArea;
                    if (p.buildingData.buildingArea !== undefined) dataToSync['technicalData.buildingArea'] = p.buildingData.buildingArea;
                    if (p.buildingData.buildingHeight !== undefined) dataToSync['technicalData.buildingHeight'] = p.buildingData.buildingHeight;
                    if (p.buildingData.floorCount !== undefined) dataToSync['technicalData.floorCount'] = p.buildingData.floorCount;
                    if (p.buildingData.fireProtectionEquipment?.pillarAndOutdoorHydrant !== undefined) dataToSync['technicalData.pillarAndOutdoorHydrant'] = p.buildingData.fireProtectionEquipment.pillarAndOutdoorHydrant;
                }
                if (p.technicalSpecifications?.apar?.count !== undefined) dataToSync['technicalData.aparCount'] = p.technicalSpecifications.apar.count;


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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Proteksi Kebakaran') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        getDataForPrefill: async (laporanId) => {
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
                return null;
            }
            const d = laporanDoc.data();

            return {
                laporanId,
                examinationType: d.examinationType || "",
                inspectionDate: d.generalData?.inspectionDate || "",
                inspectionType: d.inspectionType || "",
                equipmentType: d.equipmentType || "",
                generalData: {
                    companyName: d.generalData?.companyName || "",
                    companyLocation: d.generalData?.companyLocation || "",
                    usageLocation: d.generalData?.usageLocation || "",
                    addressUsageLocation: d.generalData?.companyLocation || "", // Asumsi sama
                },
                technicalData: {
                    landArea: d.buildingData?.landArea || "",
                    buildingArea: d.buildingData?.buildingArea || "",
                    buildingHeight: d.buildingData?.buildingHeight || "",
                    floorCount: d.buildingData?.floorCount || "",
                    pillarAndOutdoorHydrant: d.buildingData?.fireProtectionEquipment?.pillarAndOutdoorHydrant || "",
                    aparCount: d.technicalSpecifications?.apar?.count || "",
                },
                testResults: {
                    visualInspection: {},
                    functionalTests: {}
                }
            };
        },

        create: async (payload) => {
            const { laporanId } = payload;
            if (!laporanId) throw Boom.badRequest('laporanId diperlukan untuk membuat BAP.');

            const laporanRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanRef.get();
            if (!laporanDoc.exists) throw Boom.notFound('Laporan Proteksi Kebakaran tidak ditemukan.');
            
            // Sinkronisasi dari BAP ke Laporan saat BAP dibuat
            const dataToSync = {};
            const p = payload;
            
            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
            if (p.equipmentType !== undefined) dataToSync.equipmentType = p.equipmentType;
            if (p.inspectionDate !== undefined) dataToSync['generalData.inspectionDate'] = p.inspectionDate;
            if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
            if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
            if (p.generalData?.usageLocation !== undefined) dataToSync['generalData.usageLocation'] = p.generalData.usageLocation;

            if(p.technicalData) {
                if(p.technicalData.landArea !== undefined) dataToSync['buildingData.landArea'] = p.technicalData.landArea;
                if(p.technicalData.buildingArea !== undefined) dataToSync['buildingData.buildingArea'] = p.technicalData.buildingArea;
                if(p.technicalData.buildingHeight !== undefined) dataToSync['buildingData.buildingHeight'] = p.technicalData.buildingHeight;
                if(p.technicalData.floorCount !== undefined) dataToSync['buildingData.floorCount'] = p.technicalData.floorCount;
                if(p.technicalData.pillarAndOutdoorHydrant !== undefined) dataToSync['buildingData.fireProtectionEquipment.pillarAndOutdoorHydrant'] = p.technicalData.pillarAndOutdoorHydrant;
                if(p.technicalData.aparCount !== undefined) dataToSync['technicalSpecifications.apar.count'] = p.technicalData.aparCount;
            }

            if (Object.keys(dataToSync).length > 0) {
                await laporanRef.update(dataToSync);
            }

            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = { 
                ...payload,
                subInspectionType: "Instalasi Proteksi Kebakaran",
                documentType: "Berita Acara dan Pemeriksaan Pengujian", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Instalasi Proteksi Kebakaran')
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },
        
        updateById: async (id, payload) => {
            const bapRef = auditCollection.doc(id);
            const bapDoc = await bapRef.get();
            if (!bapDoc.exists || bapDoc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian') {
                return null;
            }
            
            await bapRef.update(payload);

            const { laporanId } = bapDoc.data();
            if (laporanId) {
                const laporanRef = auditCollection.doc(laporanId);
                const dataToSync = {};
                const p = payload;

                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
                if (p.equipmentType !== undefined) dataToSync.equipmentType = p.equipmentType;
                if (p.inspectionDate !== undefined) dataToSync['generalData.inspectionDate'] = p.inspectionDate;
                if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
                if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                if (p.generalData?.usageLocation !== undefined) dataToSync['generalData.usageLocation'] = p.generalData.usageLocation;

                if(p.technicalData) {
                    if(p.technicalData.landArea !== undefined) dataToSync['buildingData.landArea'] = p.technicalData.landArea;
                    if(p.technicalData.buildingArea !== undefined) dataToSync['buildingData.buildingArea'] = p.technicalData.buildingArea;
                    if(p.technicalData.buildingHeight !== undefined) dataToSync['buildingData.buildingHeight'] = p.technicalData.buildingHeight;
                    if(p.technicalData.floorCount !== undefined) dataToSync['buildingData.floorCount'] = p.technicalData.floorCount;
                    if(p.technicalData.pillarAndOutdoorHydrant !== undefined) dataToSync['buildingData.fireProtectionEquipment.pillarAndOutdoorHydrant'] = p.technicalData.pillarAndOutdoorHydrant;
                    if(p.technicalData.aparCount !== undefined) dataToSync['technicalSpecifications.apar.count'] = p.technicalData.aparCount;
                }

                if (Object.keys(dataToSync).length > 0) {
                    await laporanRef.update(dataToSync);
                }
            }

            const updatedDoc = await bapRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian') {
                return null;
            }
            await docRef.delete();
            return id;
        }
    }
};

module.exports = {
    proteksiKebakaranServices,
};