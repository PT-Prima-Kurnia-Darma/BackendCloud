'use strict';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const db = require('../../../utils/firestore');
const auditCollection = db.collection('ptp');

const motorDieselServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = {
                ...payload,
                subInspectionType: "Motor Diesel",
                documentType: "Laporan",
                createdAt
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Motor Diesel')
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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Motor Diesel') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const doc = await laporanRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Motor Diesel') {
                return null;
            }

            payload.createdAt = dayjs().tz("Asia/Jakarta").format()

            await laporanRef.update(payload);

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
                if (p.inspectionDate !== undefined) dataToSync.inspectionDate = p.inspectionDate;
                if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
                if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                if (p.generalData?.unitLocation !== undefined) dataToSync['generalData.unitLocation'] = p.generalData.unitLocation;
                if (p.generalData?.userAddressInCharge !== undefined) dataToSync['generalData.userAddressInCharge'] = p.generalData.userAddressInCharge;
                if (p.generalData?.brandType !== undefined) dataToSync['technicalData.brandType'] = p.generalData.brandType;
                if (p.generalData?.manufacturer !== undefined) dataToSync['technicalData.manufacturer'] = p.generalData.manufacturer;
                if (p.generalData?.locationAndYearOfManufacture !== undefined) dataToSync['technicalData.locationAndYearOfManufacture'] = p.generalData.locationAndYearOfManufacture;
                if (p.generalData?.serialNumberUnitNumber !== undefined) dataToSync['technicalData.serialNumberUnitNumber'] = p.generalData.serialNumberUnitNumber;
                if (p.generalData?.capacityWorkingLoad !== undefined) dataToSync['technicalData.capacityWorkingLoad'] = p.generalData.capacityWorkingLoad;
                if (p.technicalData?.dieselMotor?.powerRpm !== undefined) {
                    const powerOnly = String(p.technicalData.dieselMotor.powerRpm).split('/')[0].trim();
                    dataToSync['technicalData.technicalDataDieselMotorPowerRpm'] = powerOnly.replace('kW', '').trim();
                }
                if (p.technicalData?.generator?.frequency !== undefined) dataToSync['technicalData.technicalDataGeneratorFrequency'] = p.technicalData.generator.frequency;
                if (p.technicalData?.generator?.current !== undefined) dataToSync['technicalData.technicalDataGeneratorCurrent'] = p.technicalData.generator.current;
                
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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Motor Diesel') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        getDataForPrefill: async (laporanId) => {
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan' || laporanDoc.data().subInspectionType !== 'Motor Diesel') {
                return null;
            }
            const d = laporanDoc.data();
            const powerRpm = d.technicalData?.dieselMotor?.powerRpm || '';
            const powerOnly = String(powerRpm).split('/')[0].trim().replace('kW', '').trim();

            return {
                laporanId,
                examinationType: d.examinationType || "",
                inspectionDate: d.inspectionDate || "",
                generalData: {
                    companyName: d.generalData?.companyName || "",
                    companyLocation: d.generalData?.companyLocation || "",
                    unitLocation: d.generalData?.unitLocation || "",
                    userAddressInCharge: d.generalData?.userAddressInCharge || "",
                },
                technicalData: {
                    brandType: d.generalData?.brandType || "",
                    manufacturer: d.generalData?.manufacturer || "",
                    locationAndYearOfManufacture: d.generalData?.locationAndYearOfManufacture || "",
                    serialNumberUnitNumber: d.generalData?.serialNumberUnitNumber || "",
                    capacityWorkingLoad: d.generalData?.capacityWorkingLoad || "",
                    technicalDataDieselMotorPowerRpm: powerOnly,
                    technicalDataGeneratorFrequency: d.technicalData?.generator?.frequency || "",
                    technicalDataGeneratorCurrent: d.technicalData?.generator?.current || "",
                },
                visualChecks: {},
                functionalTests: {}
            };
        },

        create: async (payload) => {
            const { laporanId } = payload;
            const laporanRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanRef.get();

            if (!laporanDoc.exists) {
                throw Boom.notFound('Laporan Motor Diesel tidak ditemukan.');
            }

            const dataToSync = {};
            const p = payload;

            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.inspectionDate !== undefined) dataToSync.inspectionDate = p.inspectionDate;
            if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
            if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
            if (p.generalData?.unitLocation !== undefined) dataToSync['generalData.unitLocation'] = p.generalData.unitLocation;
            if (p.generalData?.userAddressInCharge !== undefined) dataToSync['generalData.userAddressInCharge'] = p.generalData.userAddressInCharge;
            if (p.technicalData?.brandType !== undefined) dataToSync['generalData.brandType'] = p.technicalData.brandType;
            if (p.technicalData?.manufacturer !== undefined) dataToSync['generalData.manufacturer'] = p.technicalData.manufacturer;
            if (p.technicalData?.locationAndYearOfManufacture !== undefined) dataToSync['generalData.locationAndYearOfManufacture'] = p.technicalData.locationAndYearOfManufacture;
            if (p.technicalData?.serialNumberUnitNumber !== undefined) dataToSync['generalData.serialNumberUnitNumber'] = p.technicalData.serialNumberUnitNumber;
            if (p.technicalData?.capacityWorkingLoad !== undefined) dataToSync['generalData.capacityWorkingLoad'] = p.technicalData.capacityWorkingLoad;
            if (p.technicalData?.technicalDataGeneratorFrequency !== undefined) dataToSync['technicalData.generator.frequency'] = p.technicalData.technicalDataGeneratorFrequency;
            if (p.technicalData?.technicalDataGeneratorCurrent !== undefined) dataToSync['technicalData.generator.current'] = p.technicalData.technicalDataGeneratorCurrent;

            if (Object.keys(dataToSync).length > 0) {
                await laporanRef.update(dataToSync);
            }

            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = { ...payload, subInspectionType: "Motor Diesel", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },
        
        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Motor Diesel')
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Motor Diesel') return null;
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const bapRef = auditCollection.doc(id);
            const bapDoc = await bapRef.get();
            if (!bapDoc.exists || bapDoc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || bapDoc.data().subInspectionType !== 'Motor Diesel') {
                return null;
            }

            payload.createdAt = dayjs().tz("Asia/Jakarta").format();

            await bapRef.update(payload);

            const { laporanId } = bapDoc.data();
            if (laporanId) {
                const laporanRef = auditCollection.doc(laporanId);
                 if ((await laporanRef.get()).exists) {
                    const dataToSync = {};
                    const p = payload;

                    if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                    if (p.inspectionDate !== undefined) dataToSync.inspectionDate = p.inspectionDate;
                    if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
                    if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                    if (p.generalData?.unitLocation !== undefined) dataToSync['generalData.unitLocation'] = p.generalData.unitLocation;
                    if (p.generalData?.userAddressInCharge !== undefined) dataToSync['generalData.userAddressInCharge'] = p.generalData.userAddressInCharge;
                    if (p.technicalData?.brandType !== undefined) dataToSync['generalData.brandType'] = p.technicalData.brandType;
                    if (p.technicalData?.manufacturer !== undefined) dataToSync['generalData.manufacturer'] = p.technicalData.manufacturer;
                    if (p.technicalData?.locationAndYearOfManufacture !== undefined) dataToSync['generalData.locationAndYearOfManufacture'] = p.technicalData.locationAndYearOfManufacture;
                    if (p.technicalData?.serialNumberUnitNumber !== undefined) dataToSync['generalData.serialNumberUnitNumber'] = p.technicalData.serialNumberUnitNumber;
                    if (p.technicalData?.capacityWorkingLoad !== undefined) dataToSync['generalData.capacityWorkingLoad'] = p.technicalData.capacityWorkingLoad;
                    if (p.technicalData?.technicalDataGeneratorFrequency !== undefined) dataToSync['technicalData.generator.frequency'] = p.technicalData.technicalDataGeneratorFrequency;
                    if (p.technicalData?.technicalDataGeneratorCurrent !== undefined) dataToSync['technicalData.generator.current'] = p.technicalData.technicalDataGeneratorCurrent;

                    if (Object.keys(dataToSync).length > 0) {
                        await laporanRef.update(dataToSync);
                    }
                }
            }

            const updatedDoc = await bapRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },
        
        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Motor Diesel') {
                return null;
            }
            await docRef.delete();
            return id;
        }
    }
};

const mesinServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = {
                ...payload,
                subInspectionType: "Mesin",
                documentType: "Laporan",
                createdAt
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Mesin')
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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Mesin') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const doc = await laporanRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Mesin') {
                return null;
            }

            payload.createdAt = dayjs().tz("Asia/Jakarta").format()
            // 1. Update Laporan
            await laporanRef.update(payload);

            // 2. Sinkronisasi ke BAP terkait
            const bapSnapshot = await auditCollection
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .where('subInspectionType', '==', 'Mesin')
                .where('laporanId', '==', id)
                .get();
            
            if (!bapSnapshot.empty) {
                const dataToSync = {};
                const p = payload;

                // Memetakan data dari payload laporan ke field BAP
                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.administration?.inspectionDate !== undefined) dataToSync.inspectionDate = p.administration.inspectionDate;
                if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
                if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                if (p.generalData?.unitLocation !== undefined) dataToSync['generalData.unitLocation'] = p.generalData.unitLocation;
                if (p.generalData?.userAddressInCharge !== undefined) dataToSync['generalData.userAddressInCharge'] = p.generalData.userAddressInCharge;
                if (p.generalData?.brandType !== undefined) dataToSync['technicalData.brandType'] = p.generalData.brandType;
                if (p.generalData?.manufacturer !== undefined) dataToSync['technicalData.manufacturer'] = p.generalData.manufacturer;
                if (p.generalData?.locationAndYearOfManufacture !== undefined) dataToSync['technicalData.locationAndYearOfManufacture'] = p.generalData.locationAndYearOfManufacture;
                if (p.generalData?.serialNumberUnitNumber !== undefined) dataToSync['technicalData.serialNumberUnitNumber'] = p.generalData.serialNumberUnitNumber;
                if (p.generalData?.technicalDataDieselMotorPowerRpm !== undefined) {
                     const powerRpmString = String(p.generalData.technicalDataDieselMotorPowerRpm);
                     dataToSync['technicalData.technicalDataDieselMotorPowerRpm'] = powerRpmString.split('/')[0].trim();
                }

                if (Object.keys(dataToSync).length > 0) {
                    const batch = db.batch();
                    bapSnapshot.docs.forEach(bapDoc => {
                        const bapRef = auditCollection.doc(bapDoc.id);
                        batch.update(bapRef, dataToSync);
                    });
                    await batch.commit();
                }
            }

            const updatedDoc = await laporanRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Mesin') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        getDataForPrefill: async (laporanId) => {
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan' || laporanDoc.data().subInspectionType !== 'Mesin') {
                return null;
            }
            const d = laporanDoc.data();

            return {
                laporanId,
                examinationType: d.examinationType || "",
                inspectionDate: d.administration?.inspectionDate || "",
                generalData: {
                    companyName: d.generalData?.companyName || "",
                    companyLocation: d.generalData?.companyLocation || "",
                    unitLocation: d.generalData?.unitLocation || "",
                    userAddressInCharge: d.generalData?.userAddressInCharge || "",
                },
                technicalData: {
                    brandType: d.generalData?.brandType || "",
                    manufacturer: d.generalData?.manufacturer || "",
                    locationAndYearOfManufacture: d.generalData?.locationAndYearOfManufacture || "",
                    serialNumberUnitNumber: d.generalData?.serialNumberUnitNumber || "",
                    technicalDataDieselMotorPowerRpm: d.generalData?.technicalDataDieselMotorPowerRpm ? String(d.generalData.technicalDataDieselMotorPowerRpm).split('/')[0].trim() : "",
                },
                visualChecks: {},
                functionalTests: {}
            };
        },

        create: async (payload) => {
            const { laporanId } = payload;
            const laporanRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanRef.get();

            if (!laporanDoc.exists) {
                throw Boom.notFound('Laporan PTP Mesin tidak ditemukan.');
            }

            const dataToSync = {};
            const p = payload;

            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.inspectionDate !== undefined) dataToSync['administration.inspectionDate'] = p.inspectionDate;
            if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
            if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
            if (p.generalData?.unitLocation !== undefined) dataToSync['generalData.unitLocation'] = p.generalData.unitLocation;
            if (p.generalData?.userAddressInCharge !== undefined) dataToSync['generalData.userAddressInCharge'] = p.generalData.userAddressInCharge;
            if (p.technicalData?.brandType !== undefined) dataToSync['generalData.brandType'] = p.technicalData.brandType;
            if (p.technicalData?.manufacturer !== undefined) dataToSync['generalData.manufacturer'] = p.technicalData.manufacturer;
            if (p.technicalData?.locationAndYearOfManufacture !== undefined) dataToSync['generalData.locationAndYearOfManufacture'] = p.technicalData.locationAndYearOfManufacture;
            if (p.technicalData?.serialNumberUnitNumber !== undefined) dataToSync['generalData.serialNumberUnitNumber'] = p.technicalData.serialNumberUnitNumber;
            
            if (Object.keys(dataToSync).length > 0) {
                await laporanRef.update(dataToSync);
            }

            const createdAt = dayjs().tz("Asia/Jakarta").format();
            const dataToSave = { ...payload, subInspectionType: "Mesin", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },
        
        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Mesin')
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Mesin') return null;
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const bapRef = auditCollection.doc(id);
            const bapDoc = await bapRef.get();
            if (!bapDoc.exists || bapDoc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || bapDoc.data().subInspectionType !== 'Mesin') {
                return null;
            }

            payload.createdAt = dayjs().tz("Asia/Jakarta").format();

            await bapRef.update(payload);

            const { laporanId } = bapDoc.data();
            if (laporanId) {
                const laporanRef = auditCollection.doc(laporanId);
                 if ((await laporanRef.get()).exists) {
                    const dataToSync = {};
                    const p = payload;

                    if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                    if (p.inspectionDate !== undefined) dataToSync['administration.inspectionDate'] = p.inspectionDate;
                    if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
                    if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                    if (p.generalData?.unitLocation !== undefined) dataToSync['generalData.unitLocation'] = p.generalData.unitLocation;
                    if (p.generalData?.userAddressInCharge !== undefined) dataToSync['generalData.userAddressInCharge'] = p.generalData.userAddressInCharge;
                    if (p.technicalData?.brandType !== undefined) dataToSync['generalData.brandType'] = p.technicalData.brandType;
                    if (p.technicalData?.manufacturer !== undefined) dataToSync['generalData.manufacturer'] = p.technicalData.manufacturer;
                    if (p.technicalData?.locationAndYearOfManufacture !== undefined) dataToSync['generalData.locationAndYearOfManufacture'] = p.technicalData.locationAndYearOfManufacture;
                    if (p.technicalData?.serialNumberUnitNumber !== undefined) dataToSync['generalData.serialNumberUnitNumber'] = p.technicalData.serialNumberUnitNumber;
                    
                    if (Object.keys(dataToSync).length > 0) {
                        await laporanRef.update(dataToSync);
                    }
                }
            }

            const updatedDoc = await bapRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },
        
        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Mesin') {
                return null;
            }
            await docRef.delete();
            return id;
        }
    }
    
};

module.exports = {
    motorDieselServices,
    mesinServices
};