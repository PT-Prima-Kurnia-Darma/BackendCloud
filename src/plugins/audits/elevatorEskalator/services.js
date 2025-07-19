'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('elevatorEskalator');

const elevatorServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
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
            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
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

            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
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
            
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
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
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
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
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();

            // 1. Pastikan dokumen laporan yang benar yang akan diupdate
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Eskalator') {
                return null;
            }

            // 2. Update dokumen Laporan itu sendiri
            await docRef.update(payload);

            // 3. Cari BAP yang terhubung untuk disinkronkan
            const bapQuery = await auditCollection
                .where('laporanId', '==', id)
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .where('subInspectionType', '==', 'Eskalator')
                .limit(1)
                .get();

            // 4. Jika BAP yang terhubung ditemukan, lakukan sinkronisasi
            if (!bapQuery.empty) {
                const bapDocRef = bapQuery.docs[0].ref;
                const dataToSyncForBap = {};

                // Mapping data dari struktur Laporan ke struktur BAP
                if (payload.generalData?.examinationType !== undefined) {
                    dataToSyncForBap.examinationType = payload.generalData.examinationType;
                }
                if (payload.generalData?.inspectionDate !== undefined) {
                    dataToSyncForBap.inspectionDate = payload.generalData.inspectionDate;
                }
                if (payload.generalData?.ownerName !== undefined) {
                    dataToSyncForBap['generalData.ownerName'] = payload.generalData.ownerName;
                }
                // Sinkronisasi data teknis jika ada
                if (payload.technicalData !== undefined) {
                    dataToSyncForBap.technicalData = payload.technicalData;
                }

                // Hanya jalankan update jika ada data untuk disinkronkan
                if (Object.keys(dataToSyncForBap).length > 0) {
                    await bapDocRef.update(dataToSyncForBap);
                }
            }

            const updatedDoc = await docRef.get();
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

        // Buat salinan technicalData dari laporan DENGAN AMAN.
        // Jika d.technicalData tidak ada, ia akan menggunakan objek kosong {}.
        const technicalDataForBap = { ...(d.technicalData || {}) };

        // Secara eksplisit, ambil 'equipmentType' dari root laporan
        // dan masukkan ke dalam technicalData untuk BAP.
        if (d.equipmentType) {
            technicalDataForBap.equipmentType = d.equipmentType;
        }
        
        return {
            laporanId,
            examinationType: d.generalData?.examinationType || "",
            inspectionType: d.inspectionType || "",
            inspectionDate: d.generalData?.inspectionDate || "",
            generalData: d.generalData || {},
            technicalData: technicalDataForBap,
            visualInspection: {},
            testing: {}
        };
        },


        /**
         * Membuat BAP Eskalator baru dan menyinkronkan data kembali ke Laporan.
         */
        create: async (payload) => {
            const { laporanId } = payload;
            const laporanDocRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanDocRef.get();

            if (!laporanDoc.exists) throw Boom.notFound('Laporan Eskalator tidak ditemukan.');
            
            const dataToSync = {
                'generalData.examinationType': payload.examinationType,
                'generalData.inspectionDate': payload.inspectionDate,
            };
            await laporanDocRef.update(dataToSync);
            
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Eskalator", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            
            return { id: docRef.id, ...dataToSave };
        },
        
        /**
         * Mengambil semua dokumen BAP Eskalator.
         */
        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Eskalator').where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian').orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        /**
         * Mengambil satu dokumen BAP Eskalator berdasarkan ID.
         */
        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Eskalator') return null;
            return { id: doc.id, ...doc.data() };
        },

        /**
         * Memperbarui dokumen BAP Eskalator berdasarkan ID dan sinkronisasi ke Laporan.
         */
        updateById: async (id, payload) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();

            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Eskalator') {
                return null;
            }

            await docRef.update(payload);

            const existingBapData = doc.data();
            const { laporanId } = existingBapData;

            if (laporanId) {
                const dataToSync = {};
                if (payload.examinationType !== undefined) {
                    dataToSync['generalData.examinationType'] = payload.examinationType;
                }
                if (payload.inspectionDate !== undefined) {
                    dataToSync['generalData.inspectionDate'] = payload.inspectionDate;
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