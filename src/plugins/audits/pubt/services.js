'use strict';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('pubt');

const pubtServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = dayjs().tz("Asia/Jakarta").format();
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

            payload.createdAt = dayjs().tz("Asia/Jakarta").format()

            await laporanRef.update(payload);

            // --- SINKRONISASI DARI LAPORAN KE BAP (LENGKAP) ---
            const bapQuery = await auditCollection
                .where('laporanId', '==', id)
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .limit(1)
                .get();

            if (!bapQuery.empty) {
                const bapRef = bapQuery.docs[0].ref;
                const dataToSync = {};
                const p = payload; 

                // Data Umum Laporan -> Data Umum BAP
                if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
                if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                if (p.generalData?.userUsage !== undefined) dataToSync['generalData.userUsage'] = p.generalData.userUsage;
                if (p.generalData?.userAddress !== undefined) dataToSync['generalData.userAddress'] = p.generalData.userAddress;

                // Data Umum Laporan -> Data Teknis BAP
                if (p.generalData?.brandType !== undefined) dataToSync['technicalData.brandType'] = p.generalData.brandType;
                if (p.generalData?.manufacturer !== undefined) dataToSync['technicalData.manufacturer'] = p.generalData.manufacturer;
                if (p.generalData?.countryAndYearOfManufacture !== undefined) dataToSync['technicalData.countryAndYearOfManufacture'] = p.generalData.countryAndYearOfManufacture;
                if (p.generalData?.serialNumberUnitNumber !== undefined) dataToSync['technicalData.serialNumberUnitNumber'] = p.generalData.serialNumberUnitNumber;
                if (p.generalData?.fuelType !== undefined) dataToSync['technicalData.fuelType'] = p.generalData.fuelType;
                if (p.generalData?.operatingPressure !== undefined) dataToSync['technicalData.operatingPressure'] = String(p.generalData.operatingPressure);
                if (p.generalData?.maxAllowableWorkingPressure !== undefined) dataToSync['technicalData.maxAllowableWorkingPressure'] = p.generalData.maxAllowableWorkingPressure;
                
                // Data level atas
                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
                if (p.generalData?.inspectionDate !== undefined) dataToSync.inspectionDate = p.generalData.inspectionDate;


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
            const g = d.generalData || {};

            return {
                laporanId,
                examinationType: d.examinationType || "",
                inspectionType: d.inspectionType || "",
                inspectionDate: g.inspectionDate || "",
                generalData: {
                    companyName: g.companyName || "",
                    companyLocation: g.companyLocation || "",
                    userUsage: g.userUsage || "",
                    userAddress: g.userAddress || "",
                },
                technicalData: {
                    brandType: g.brandType || "",
                    manufacturer: g.manufacturer || "",
                    countryAndYearOfManufacture: g.countryAndYearOfManufacture || "",
                    serialNumberUnitNumber: g.serialNumberUnitNumber || "",
                    fuelType: g.fuelType || "",
                    operatingPressure: g.operatingPressure ? String(g.operatingPressure) : "",
                    designPressureKgCm2: d.generalData?.designPressure || null, // Tetap dari designPressure laporan
                    maxAllowableWorkingPressure: g.maxAllowableWorkingPressure || null,
                    technicalDataShellMaterial: d.technicalData?.shell?.material || "",
                    safetyValveType: "",
                    volumeLiters: null
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

            // --- SINKRONISASI DARI BAP KE LAPORAN (LENGKAP) ---
            const dataToSync = {};
            const p = payload; // Payload dari BAP yang baru dibuat

            // Data Umum BAP -> Data Umum Laporan
            if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
            if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
            if (p.generalData?.userUsage !== undefined) dataToSync['generalData.userUsage'] = p.generalData.userUsage;
            if (p.generalData?.userAddress !== undefined) dataToSync['generalData.userAddress'] = p.generalData.userAddress;

            // Data Teknis BAP -> Data Umum Laporan
            if (p.technicalData?.brandType !== undefined) dataToSync['generalData.brandType'] = p.technicalData.brandType;
            if (p.technicalData?.manufacturer !== undefined) dataToSync['generalData.manufacturer'] = p.technicalData.manufacturer;
            if (p.technicalData?.countryAndYearOfManufacture !== undefined) dataToSync['generalData.countryAndYearOfManufacture'] = p.technicalData.countryAndYearOfManufacture;
            if (p.technicalData?.serialNumberUnitNumber !== undefined) dataToSync['generalData.serialNumberUnitNumber'] = p.technicalData.serialNumberUnitNumber;
            if (p.technicalData?.fuelType !== undefined) dataToSync['generalData.fuelType'] = p.technicalData.fuelType;
            if (p.technicalData?.operatingPressure !== undefined) dataToSync['generalData.operatingPressure'] = Number(p.technicalData.operatingPressure) || 0;
            if (p.technicalData?.maxAllowableWorkingPressure !== undefined) dataToSync['generalData.maxAllowableWorkingPressure'] = p.technicalData.maxAllowableWorkingPressure;

            // Data level atas
            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
            if (p.inspectionDate !== undefined) dataToSync['generalData.inspectionDate'] = p.inspectionDate;

            if (Object.keys(dataToSync).length > 0) {
                await laporanRef.update(dataToSync);
            }

            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = {
                ...payload,
                subInspectionType: "Pesawat Uap dan Bejana Tekan",
                documentType: "Berita Acara dan Pemeriksaan Pengujian",
                createdAt
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },
        
        updateById: async (id, payload) => {
            const bapRef = auditCollection.doc(id);
            const bapDoc = await bapRef.get();
            if (!bapDoc.exists || bapDoc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || bapDoc.data().subInspectionType !== 'Pesawat Uap dan Bejana Tekan') {
                return null;
            }

            await bapRef.update(payload);

            const { laporanId } = bapDoc.data();
            if (laporanId) {
                const laporanRef = auditCollection.doc(laporanId);
                // --- SINKRONISASI DARI BAP KE LAPORAN (LENGKAP) ---
                const dataToSync = {};
                const p = payload; 

                // Data Umum BAP -> Data Umum Laporan
                if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
                if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                if (p.generalData?.userUsage !== undefined) dataToSync['generalData.userUsage'] = p.generalData.userUsage;
                if (p.generalData?.userAddress !== undefined) dataToSync['generalData.userAddress'] = p.generalData.userAddress;
    
                // Data Teknis BAP -> Data Umum Laporan
                if (p.technicalData?.brandType !== undefined) dataToSync['generalData.brandType'] = p.technicalData.brandType;
                if (p.technicalData?.manufacturer !== undefined) dataToSync['generalData.manufacturer'] = p.technicalData.manufacturer;
                if (p.technicalData?.countryAndYearOfManufacture !== undefined) dataToSync['generalData.countryAndYearOfManufacture'] = p.technicalData.countryAndYearOfManufacture;
                if (p.technicalData?.serialNumberUnitNumber !== undefined) dataToSync['generalData.serialNumberUnitNumber'] = p.technicalData.serialNumberUnitNumber;
                if (p.technicalData?.fuelType !== undefined) dataToSync['generalData.fuelType'] = p.technicalData.fuelType;
                if (p.technicalData?.operatingPressure !== undefined) dataToSync['generalData.operatingPressure'] = Number(p.technicalData.operatingPressure) || 0;
                if (p.technicalData?.maxAllowableWorkingPressure !== undefined) dataToSync['generalData.maxAllowableWorkingPressure'] = p.technicalData.maxAllowableWorkingPressure;
    
                // Data level atas
                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
                if (p.inspectionDate !== undefined) dataToSync['generalData.inspectionDate'] = p.inspectionDate;

                if (Object.keys(dataToSync).length > 0) {
                    await laporanRef.update(dataToSync);
                }
            }

            const updatedDoc = await bapRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
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
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Pesawat Uap dan Bejana Tekan') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Pesawat Uap dan Bejana Tekan') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    }
};

module.exports = {
    pubtServices,
};
