'use strict';

const db = require('../../../utils/firestore');
const auditCollection = db.collection('paa');

const forkliftServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            // Menambahkan subInspectionType secara eksplisit untuk query
            const dataToSave = { 
                ...payload, 
                subInspectionType: "Forklift", 
                documentType: "Laporan", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Forklift')
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
            if (!doc.exists || doc.data().subInspectionType !== 'Forklift' || doc.data().documentType !== 'Laporan') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().subInspectionType !== 'Forklift' || doc.data().documentType !== 'Laporan') {
                return null;
            }
            
            await docRef.update(payload);
            const updatedDoc = await docRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().subInspectionType !== 'Forklift' || doc.data().documentType !== 'Laporan') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        /**
         * Mengambil data dari Laporan untuk mengisi form BAP secara otomatis.
         */
        getDataForPrefill: async (laporanId) => {
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
                return null;
            }
            const d = laporanDoc.data();

            return {
                laporanId,
                examinationType: d.examinationType || "",
                subInspectionType: d.subInspectionType || "",
                inspectionDate: d.inspectionDate || "",
                generalData: {
                    ownerName: d.generalData?.ownerName || "", 
                    ownerAddress: d.generalData?.ownerAddress || "",
                    userInCharge: d.generalData?.userInCharge || ""
                },
                technicalData: {
                    brandType: d.generalData?.brandType || "",
                    manufacturer: d.generalData?.manufacturer || "",
                    locationAndYearOfManufacture: d.generalData?.locationAndYearOfManufacture || "",
                    serialNumberUnitNumber: d.generalData?.serialNumberUnitNumber || "",
                    capacityWorkingLoad: d.generalData?.capacityWorkingLoad || "",
                    liftingHeightMeters: d.technicalData?.dimensionForkLiftingHeight || ""
                },
                inspectionResult: { // Dikosongkan untuk diisi manual
                    visualCheck: {},
                    functionalTest: {}
                }
            };
        },

        create: async (payload) => {
            const { laporanId } = payload;
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists) {
                throw Boom.notFound('Laporan Forklift dengan ID tersebut tidak ditemukan.');
            }

            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { 
                ...payload, 
                subInspectionType: "Forklift", 
                documentType: "Berita Acara Pemeriksaan", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Forklift')
                .where('documentType', '==', 'Berita Acara Pemeriksaan')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara Pemeriksaan' || doc.data().subInspectionType !== 'Forklift') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara Pemeriksaan' || doc.data().subInspectionType !== 'Forklift') {
                return null;
            }
            await docRef.update(payload);
            const updatedDoc = await docRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara Pemeriksaan' || doc.data().subInspectionType !== 'Forklift') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    }
};

module.exports = {
    forkliftServices,
};