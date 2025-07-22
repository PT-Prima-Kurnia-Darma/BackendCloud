'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('petirListrik');

const petirServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { 
                ...payload, 
                subInspectionType: "Instalasi Penyalur Petir", 
                documentType: "Laporan", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Instalasi Penyalur Petir')
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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Penyalur Petir') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const doc = await laporanRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Penyalur Petir') {
                return null;
            }
            // 1. Update Laporan
            await laporanRef.update(payload);

            // --- IMPLEMENTASI SINKRONISASI DARI LAPORAN KE BAP ---
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

                if (p.ownerData) {
                    if (p.ownerData.inspectionDate !== undefined) dataToSync.inspectionDate = p.ownerData.inspectionDate;
                    if (p.ownerData.companyName !== undefined) dataToSync['generalData.companyName'] = p.ownerData.companyName;
                    if (p.ownerData.companyLocation !== undefined) {
                        dataToSync['generalData.companyLocation'] = p.ownerData.companyLocation;
                        dataToSync['generalData.addressUsageLocation'] = p.ownerData.companyLocation; // Asumsi sama
                    }
                    if (p.ownerData.usageLocation !== undefined) dataToSync['generalData.usageLocation'] = p.ownerData.usageLocation;
                }

                if (p.technicalData) {
                    if (p.technicalData.conductorType !== undefined) dataToSync['technicalData.conductorType'] = p.technicalData.conductorType;
                    if (p.technicalData.buildingHeight !== undefined) dataToSync['technicalData.buildingHeight'] = p.technicalData.buildingHeight;
                    if (p.technicalData.buildingArea !== undefined) dataToSync['technicalData.buildingArea'] = p.technicalData.buildingArea;
                    if (p.technicalData.receiverHeight !== undefined) dataToSync['technicalData.receiverHeight'] = p.technicalData.receiverHeight;
                    if (p.technicalData.receiverCount !== undefined) dataToSync['technicalData.receiverCount'] = p.technicalData.receiverCount;
                    if (p.technicalData.conductorDescription !== undefined) dataToSync['technicalData.conductorDescription'] = p.technicalData.conductorDescription;
                    if (p.technicalData.installer !== undefined) dataToSync['technicalData.installer'] = p.technicalData.installer;
                    if (p.technicalData.groundingResistance !== undefined) dataToSync['technicalData.groundingResistance'] = p.technicalData.groundingResistance;
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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Penyalur Petir') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        getDataForPrefill: async (laporanId) => {
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan' || laporanDoc.data().subInspectionType !== 'Instalasi Penyalur Petir') {
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

            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan' || laporanDoc.data().subInspectionType !== 'Instalasi Penyalur Petir') {
                throw Boom.notFound('Laporan Instalasi Penyalur Petir tidak ditemukan.');
            }
            
            // --- SINKRONISASI DARI BAP KE LAPORAN (DIPERLUAS) ---
            const dataToSync = {};
            const p = payload; 

            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.inspectionDate !== undefined) dataToSync['ownerData.inspectionDate'] = p.inspectionDate;

            if (p.generalData) {
                if (p.generalData.companyName !== undefined) dataToSync['ownerData.companyName'] = p.generalData.companyName;
                if (p.generalData.companyLocation !== undefined) dataToSync['ownerData.companyLocation'] = p.generalData.companyLocation;
                if (p.generalData.usageLocation !== undefined) dataToSync['ownerData.usageLocation'] = p.generalData.usageLocation;
            }

            if (p.technicalData) {
                if (p.technicalData.conductorType !== undefined) dataToSync['technicalData.conductorType'] = p.technicalData.conductorType;
                if (p.technicalData.buildingHeight !== undefined) dataToSync['technicalData.buildingHeight'] = p.technicalData.buildingHeight;
                if (p.technicalData.buildingArea !== undefined) dataToSync['technicalData.buildingArea'] = p.technicalData.buildingArea;
                if (p.technicalData.receiverHeight !== undefined) dataToSync['technicalData.receiverHeight'] = p.technicalData.receiverHeight;
                if (p.technicalData.receiverCount !== undefined) dataToSync['technicalData.receiverCount'] = p.technicalData.receiverCount;
                if (p.technicalData.conductorDescription !== undefined) dataToSync['technicalData.conductorDescription'] = p.technicalData.conductorDescription;
                if (p.technicalData.installer !== undefined) dataToSync['technicalData.installer'] = p.technicalData.installer;
                if (p.technicalData.groundingResistance !== undefined) dataToSync['technicalData.groundingResistance'] = p.technicalData.groundingResistance;
            }
            
            if (Object.keys(dataToSync).length > 0) {
                await laporanRef.update(dataToSync);
            }
            
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Instalasi Penyalur Petir", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },
        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Instalasi Penyalur Petir')
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Instalasi Penyalur Petir') return null;
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const bapRef = auditCollection.doc(id);
            const bapDoc = await bapRef.get();

            if (!bapDoc.exists || bapDoc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || bapDoc.data().subInspectionType !== 'Instalasi Penyalur Petir') {
                return null; 
            }
            
            const { laporanId } = bapDoc.data();

            if (laporanId) {
                const laporanRef = auditCollection.doc(laporanId);
                 if ((await laporanRef.get()).exists) {
                    // --- SINKRONISASI DARI BAP KE LAPORAN (DIPERLUAS) ---
                    const dataToSync = {};
                    const p = payload;

                    if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                    if (p.inspectionDate !== undefined) dataToSync['ownerData.inspectionDate'] = p.inspectionDate;

                    if (p.generalData) {
                        if (p.generalData.companyName !== undefined) dataToSync['ownerData.companyName'] = p.generalData.companyName;
                        if (p.generalData.companyLocation !== undefined) dataToSync['ownerData.companyLocation'] = p.generalData.companyLocation;
                        if (p.generalData.usageLocation !== undefined) dataToSync['ownerData.usageLocation'] = p.generalData.usageLocation;
                    }

                    if (p.technicalData) {
                        if (p.technicalData.conductorType !== undefined) dataToSync['technicalData.conductorType'] = p.technicalData.conductorType;
                        if (p.technicalData.buildingHeight !== undefined) dataToSync['technicalData.buildingHeight'] = p.technicalData.buildingHeight;
                        if (p.technicalData.buildingArea !== undefined) dataToSync['technicalData.buildingArea'] = p.technicalData.buildingArea;
                        if (p.technicalData.receiverHeight !== undefined) dataToSync['technicalData.receiverHeight'] = p.technicalData.receiverHeight;
                        if (p.technicalData.receiverCount !== undefined) dataToSync['technicalData.receiverCount'] = p.technicalData.receiverCount;
                        if (p.technicalData.conductorDescription !== undefined) dataToSync['technicalData.conductorDescription'] = p.technicalData.conductorDescription;
                        if (p.technicalData.installer !== undefined) dataToSync['technicalData.installer'] = p.technicalData.installer;
                        if (p.technicalData.groundingResistance !== undefined) dataToSync['technicalData.groundingResistance'] = p.technicalData.groundingResistance;
                    }
                    
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
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Instalasi Penyalur Petir') return null;
            await docRef.delete();
            return id;
        },
    }

};

const listrikServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { 
                ...payload, 
                subInspectionType: "Instalasi Listrik", 
                documentType: "Laporan", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Instalasi Listrik')
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
            if (!doc.exists || doc.data().subInspectionType !== 'Instalasi Listrik' || doc.data().documentType !== 'Laporan') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const doc = await laporanRef.get();
            if (!doc.exists || doc.data().subInspectionType !== 'Instalasi Listrik' || doc.data().documentType !== 'Laporan') {
                return null;
            }
            await laporanRef.update(payload);
            const updatedDoc = await laporanRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().subInspectionType !== 'Instalasi Listrik' || doc.data().documentType !== 'Laporan') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    }
};

module.exports = {
    petirServices,
    listrikServices
};