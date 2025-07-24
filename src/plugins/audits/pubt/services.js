'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('pubt'); 

const pubtServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { 
                ...payload, 
                subInspectionType: "Pesawat Uap dan Bejana Tekan", 
                documentType: "Laporan", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Pesawat Uap dan Bejana Tekan')
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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Pesawat Uap dan Bejana Tekan') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const doc = await laporanRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Pesawat Uap dan Bejana Tekan') {
                return null;
            }
            
            await laporanRef.update(payload);

            // Sinkronisasi dari Laporan ke BAP
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
                if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
                if (p.generalData?.inspectionDate !== undefined) dataToSync.inspectionDate = p.generalData.inspectionDate;
                if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
                if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                if (p.generalData?.userUsage !== undefined) dataToSync['generalData.userUsage'] = p.generalData.userUsage;
                if (p.generalData?.userAddress !== undefined) dataToSync['generalData.userAddress'] = p.generalData.userAddress;

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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Pesawat Uap dan Bejana Tekan') {
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
                inspectionType: d.inspectionType || "",
                inspectionDate: d.generalData?.inspectionDate || "",
                generalData: {
                    companyName: d.generalData?.companyName || "",
                    companyLocation: d.generalData?.companyLocation || "",
                    userUsage: d.generalData?.userUsage || "",
                    userAddress: d.generalData?.userAddress || "",
                },
                technicalData: {
                    brandType: d.generalData?.brandType || "",
                    manufacturer: d.generalData?.manufacturer || "",
                    countryAndYearOfManufacture: d.generalData?.countryAndYearOfManufacture || "",
                    serialNumberUnitNumber: d.generalData?.serialNumberUnitNumber || "",
                    fuelType: d.generalData?.fuelType || "",
                    operatingPressure: d.generalData?.operatingPressure ? String(d.generalData.operatingPressure) : "",
                    designPressureKgCm2: d.generalData?.designPressure || null,
                    maxAllowableWorkingPressure: d.generalData?.maxAllowableWorkingPressure || null,
                    technicalDataShellMaterial: d.technicalData?.shell?.material || "",
                    safetyValveType: "", // Tidak ada di laporan
                    volumeLiters: null // Tidak ada di laporan
                },
                visualInspection: {},
                testing: {}
            };
        },

        create: async (payload) => {
            const { laporanId } = payload;
            if (!laporanId) throw Boom.badRequest('laporanId diperlukan untuk membuat BAP.');

            const laporanRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanRef.get();
            if (!laporanDoc.exists) throw Boom.notFound('Laporan PUBT tidak ditemukan.');

            // Sinkronisasi dari BAP ke Laporan
            const dataToSync = {};
            const p = payload;

            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
            if (p.inspectionDate !== undefined) dataToSync['generalData.inspectionDate'] = p.inspectionDate;
            if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
            
            if (Object.keys(dataToSync).length > 0) {
                await laporanRef.update(dataToSync);
            }

            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { 
                ...payload,
                subInspectionType: "Pesawat Uap dan Bejana Tekan",
                documentType: "Berita Acara dan Pemeriksaan Pengujian", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Pesawat Uap dan Bejana Tekan')
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
                if (p.inspectionDate !== undefined) dataToSync['generalData.inspectionDate'] = p.inspectionDate;
                if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;

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
    pubtServices,
};