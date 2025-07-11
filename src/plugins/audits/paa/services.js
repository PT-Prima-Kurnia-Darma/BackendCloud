'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('paa');

const forkliftServices = {
    laporan: {
        // Fungsi create, getAll, getById tidak berubah...

        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { 
                ...payload, 
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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Forklift') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        /**
         * FUNGSI UPDATE LAPORAN YANG TELAH DISINKRONISASI
         */
        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const laporanDoc = await laporanRef.get();
            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
                return null;
            }

            // 1. Update Laporan utama
            await laporanRef.update(payload);

            // 2. Cari BAP yang terhubung
            const bapQuery = await auditCollection
                .where('laporanId', '==', id)
                .where('documentType', '==', 'Berita Acara Pemeriksaan')
                .limit(1)
                .get();
            
            // 3. Jika BAP terhubung ditemukan, siapkan data untuk disinkronkan
            if (!bapQuery.empty) {
                const bapRef = bapQuery.docs[0].ref;
                const dataToSync = {};
                const p = payload;

                // Memeriksa setiap field sebelum menambahkannya ke objek sinkronisasi
                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.subInspectionType !== undefined) dataToSync.subInspectionType = p.subInspectionType;
                if (p.inspectionDate !== undefined) dataToSync.inspectionDate = p.inspectionDate;
                if (p.generalData?.ownerName !== undefined) dataToSync['generalData.ownerName'] = p.generalData.ownerName;
                if (p.generalData?.ownerAddress !== undefined) dataToSync['generalData.ownerAddress'] = p.generalData.ownerAddress;
                if (p.generalData?.userInCharge !== undefined) dataToSync['generalData.userInCharge'] = p.generalData.userInCharge;
                if (p.generalData?.brandType !== undefined) dataToSync['technicalData.brandType'] = p.generalData.brandType;
                if (p.generalData?.manufacturer !== undefined) dataToSync['technicalData.manufacturer'] = p.generalData.manufacturer;
                if (p.generalData?.locationAndYearOfManufacture !== undefined) dataToSync['technicalData.locationAndYearOfManufacture'] = p.generalData.locationAndYearOfManufacture;
                if (p.generalData?.serialNumberUnitNumber !== undefined) dataToSync['technicalData.serialNumberUnitNumber'] = p.generalData.serialNumberUnitNumber;
                if (p.generalData?.capacityWorkingLoad !== undefined) dataToSync['technicalData.capacityWorkingLoad'] = p.generalData.capacityWorkingLoad;
                if (p.technicalData?.dimensionForkLiftingHeight !== undefined) dataToSync['technicalData.liftingHeightMeters'] = p.technicalData.dimensionForkLiftingHeight;

                // Hanya update jika ada data yang perlu disinkronkan
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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Forklift') {
                return null;
            }
            const bapQuery = await auditCollection.where('laporanId', '==', id).get();
            if (!bapQuery.empty) {
                const batch = db.batch();
                bapQuery.docs.forEach(bapDoc => {
                    batch.delete(bapDoc.ref);
                });
                await batch.commit();
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        // Fungsi getDataForPrefill, create, getAll, getById tidak berubah...
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
                    ownerName: d.generalData?.ownerNamwe || d.generalData?.ownerName || "",
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
                inspectionResult: { visualCheck: {}, functionalTest: {} },
                signature: { companyName: d.generalData?.ownerNamwe || d.generalData?.ownerName || "" }
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
        
        /**
         * FUNGSI UPDATE BAP YANG TELAH DISINKRONISASI
         */
        updateById: async (id, payload) => {
            const bapRef = auditCollection.doc(id);
            const bapDoc = await bapRef.get();
            if (!bapDoc.exists || bapDoc.data().documentType !== 'Berita Acara Pemeriksaan') {
                return null;
            }
            
            // 1. Update BAP utama
            await bapRef.update(payload);

            // 2. Ambil ID Laporan dari BAP
            const { laporanId } = bapDoc.data();
            if (laporanId) {
                const laporanRef = auditCollection.doc(laporanId);
                const dataToSync = {};
                const p = payload;

                // Memeriksa setiap field sebelum menambahkannya ke objek sinkronisasi
                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.subInspectionType !== undefined) dataToSync.subInspectionType = p.subInspectionType;
                if (p.inspectionDate !== undefined) dataToSync.inspectionDate = p.inspectionDate;
                if (p.generalData?.ownerName !== undefined) dataToSync['generalData.ownerName'] = p.generalData.ownerName;
                if (p.generalData?.ownerAddress !== undefined) dataToSync['generalData.ownerAddress'] = p.generalData.ownerAddress;
                if (p.generalData?.userInCharge !== undefined) dataToSync['generalData.userInCharge'] = p.generalData.userInCharge;
                if (p.technicalData?.brandType !== undefined) dataToSync['generalData.brandType'] = p.technicalData.brandType;
                if (p.technicalData?.manufacturer !== undefined) dataToSync['generalData.manufacturer'] = p.technicalData.manufacturer;
                if (p.technicalData?.locationAndYearOfManufacture !== undefined) dataToSync['generalData.locationAndYearOfManufacture'] = p.technicalData.locationAndYearOfManufacture;
                if (p.technicalData?.serialNumberUnitNumber !== undefined) dataToSync['generalData.serialNumberUnitNumber'] = p.technicalData.serialNumberUnitNumber;
                if (p.technicalData?.capacityWorkingLoad !== undefined) dataToSync['generalData.capacityWorkingLoad'] = p.technicalData.capacityWorkingLoad;
                if (p.technicalData?.liftingHeightMeters !== undefined) dataToSync['technicalData.dimensionForkLiftingHeight'] = p.technicalData.liftingHeightMeters;

                // Hanya update jika ada data yang perlu disinkronkan
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