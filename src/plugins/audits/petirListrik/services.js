'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('petirListrik');

const petirListrikServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { 
                ...payload, 
                subInspectionType: "Instalasi Petir", 
                documentType: "Laporan", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Instalasi Petir')
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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Petir') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Petir') {
                return null;
            }
            await docRef.update(payload);
            const updatedDoc = await docRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Petir') {
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
            
            // Prefill data dari Laporan ke BAP
            return {
                laporanId: laporanId,
                examinationType: d.examinationType || "",
                inspectionDate: d.ownerData?.inspectionDate || "",
                generalData: {
                    companyName: d.ownerData?.companyName || "",
                    companyLocation: d.ownerData?.companyLocation || "",
                    usageLocation: d.ownerData?.usageLocation || "",
                    addressUsageLocation: d.ownerData?.companyLocation || "" // Asumsi sama
                },
                technicalData: {
                    conductorType: d.technicalData?.conductorType || "",
                    buildingHeight: d.technicalData?.buildingHeight || "",
                    buildingArea: d.technicalData?.buildingArea || "",
                    receiverHeight: d.technicalData?.receiverHeight || "",
                    receiverCount: d.technicalData?.receiverCount || "",
                    conductorDescription: d.technicalData?.conductorDescription || "",
                    installer: d.technicalData?.installer || "",
                    groundingResistance: d.technicalData?.groundingResistance || ""
                },
                testResults: {
                    visualInspection: {},
                    measurement: {}
                }
            };
        },

        create: async (payload) => {
            const { laporanId } = payload;
            const laporanRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanRef.get();

            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
                throw Boom.notFound('Laporan Instalasi Petir tidak ditemukan.');
            }
            
            // Sinkronisasi dari BAP ke Laporan saat BAP dibuat
            const dataToSync = {};
            const p = payload; 

            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.inspectionDate !== undefined) dataToSync['ownerData.inspectionDate'] = p.inspectionDate;
            if (p.generalData?.companyName !== undefined) dataToSync['ownerData.companyName'] = p.generalData.companyName;
            
            if (Object.keys(dataToSync).length > 0) {
                await laporanRef.update(dataToSync);
            }
            
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Instalasi Petir", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },
        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Instalasi Petir')
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian') return null;
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const bapRef = auditCollection.doc(id);
            const bapDoc = await bapRef.get();

            if (!bapDoc.exists || bapDoc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian') {
                return null; 
            }
            
            const { laporanId } = bapDoc.data();

            if (laporanId) {
                const laporanRef = auditCollection.doc(laporanId);
                 if ((await laporanRef.get()).exists) {
                    const dataToSync = {};
                    const p = payload;

                    if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                    if (p.inspectionDate !== undefined) dataToSync['ownerData.inspectionDate'] = p.inspectionDate;
                    if (p.generalData?.companyName !== undefined) dataToSync['ownerData.companyName'] = p.generalData.companyName;
                    
                    if (Object.keys(dataToSync).length > 0) {
                        await laporanRef.update(dataToSync);
                    }
                }
            }
            
            await bapRef.update(payload);
            const updatedDoc = await bapRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian') return null;
            await docRef.delete();
            return id;
        },
    }

};

module.exports = {
    petirListrikServices
};