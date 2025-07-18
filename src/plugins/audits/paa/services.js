'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('paa');



const forkliftServices = {
    laporan: {

        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
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
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
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
                throw Boom.notFound('Laporan Forklift tidak ditemukan.');
            }
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { 
                ...payload,
                subInspectionType: "Forklift",
                documentType: "Berita Acara dan Pemeriksaan Pengujian", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },
        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Forklift')
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Forklift') {
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
            if (!bapDoc.exists || bapDoc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian') {
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
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Forklift') {
                return null;
            }
            await docRef.delete();
            return id;
        }
    }
};

const mobileCraneServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Mobile Crane", documentType: "Laporan", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Mobile Crane').where('documentType', '==', 'Laporan').orderBy('createdAt', 'desc').get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Laporan') return null;
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const laporanDoc = await laporanRef.get();
            if (!laporanDoc.exists) return null;

            await laporanRef.update(payload);

            const bapQuery = await auditCollection.where('laporanId', '==', id).limit(1).get();
            if (!bapQuery.empty) {
                const bapRef = bapQuery.docs[0].ref;
                const dataToSync = {};
                const p = payload;

                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.subInspectionType !== undefined) dataToSync.subInspectionType = p.subInspectionType;
                
                if (p.generalData) {
                    if (p.generalData.generalDataInspectionDate !== undefined) dataToSync.inspectionDate = p.generalData.generalDataInspectionDate;
                    if (p.generalData.generalDataOwnerName !== undefined) dataToSync['generalData.ownerName'] = p.generalData.generalDataOwnerName;
                    if (p.generalData.generalDataOwnerAddress !== undefined) dataToSync['generalData.ownerAddress'] = p.generalData.generalDataOwnerAddress;
                    if (p.generalData.generalDataUserAddress !== undefined) dataToSync['generalData.userAddress'] = p.generalData.generalDataUserAddress;
                    if (p.generalData.generalDataManufacturer !== undefined) dataToSync['technicalData.manufacturer'] = p.generalData.generalDataManufacturer;
                    if (p.generalData.generalDataLocationAndYearOfManufacture !== undefined) dataToSync['technicalData.locationAndYearOfManufacture'] = p.generalData.generalDataLocationAndYearOfManufacture;
                    if (p.generalData.generalDataSerialNumberUnitNumber !== undefined) dataToSync['technicalData.serialNumberUnitNumber'] = p.generalData.generalDataSerialNumberUnitNumber;
                    if (p.generalData.generalDataCapacityWorkingLoad !== undefined) dataToSync['technicalData.capacityWorkingLoad'] = p.generalData.generalDataCapacityWorkingLoad;
                }
                
                if (p.technicalData) {
                    if (p.technicalData.technicalDataMaxLiftingHeight !== undefined) dataToSync['technicalData.maxLiftingHeight'] = p.technicalData.technicalDataMaxLiftingHeight;
                }
                
                if (Object.keys(dataToSync).length > 0) {
                    await bapRef.update(dataToSync);
                }
            }

            const updatedDoc = await laporanRef.get();
            const data = updatedDoc.data();

            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
                data.createdAt = data.createdAt.toDate().toISOString();
            }

            return { id: updatedDoc.id, ...data };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Mobile Crane') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        getDataForPrefill: async (laporanId) => {
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists) return null;
            const d = laporanDoc.data();
            return {
                laporanId,
                examinationType: d.examinationType || "",
                subInspectionType: d.subInspectionType || "",
                inspectionDate: d.generalData?.generalDataInspectionDate || "",
                generalData: {
                    ownerName: d.generalData?.generalDataOwnerName || "",
                    ownerAddress: d.generalData?.generalDataOwnerAddress || "",
                    userAddress: d.generalData?.generalDataUserAddress || "",
                },
                technicalData: {
                    manufacturer: d.generalData?.generalDataManufacturer || "",
                    locationAndYearOfManufacture: d.generalData?.generalDataLocationAndYearOfManufacture || "",
                    serialNumberUnitNumber: d.generalData?.generalDataSerialNumberUnitNumber || "",
                    capacityWorkingLoad: d.generalData?.generalDataCapacityWorkingLoad || "",
                    maxLiftingHeight: d.technicalData?.technicalDataMaxLiftingHeight || "",
                    materialCertificateNumber: "",
                    liftingSpeedMpm: "",
                },
                inspectionResult: { visualCheck: {}, functionalTest: { loadTest: {}, ndtTest: {} } },
                signature: { companyName: d.generalData?.generalDataOwnerName || "" },
            };
        },

        create: async (payload) => {
            const { laporanId } = payload;
            const laporanRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanRef.get();
            if (!laporanDoc.exists) {
                throw Boom.notFound('Laporan Mobile Crane tidak ditemukan.');
            }

            const p = payload;
            const dataToSync = {};
            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.subInspectionType !== undefined) dataToSync.subInspectionType = p.subInspectionType;
            if (p.inspectionDate !== undefined) dataToSync['generalData.generalDataInspectionDate'] = p.inspectionDate;
            
            if (p.generalData) {
                if (p.generalData.ownerName !== undefined) dataToSync['generalData.generalDataOwnerName'] = p.generalData.ownerName;
                if (p.generalData.ownerAddress !== undefined) dataToSync['generalData.generalDataOwnerAddress'] = p.generalData.ownerAddress;
                if (p.generalData.userAddress !== undefined) dataToSync['generalData.generalDataUserAddress'] = p.generalData.userAddress;
            }

            if (p.technicalData) {
                if (p.technicalData.manufacturer !== undefined) dataToSync['generalData.generalDataManufacturer'] = p.technicalData.manufacturer;
                if (p.technicalData.locationAndYearOfManufacture !== undefined) dataToSync['generalData.generalDataLocationAndYearOfManufacture'] = p.technicalData.locationAndYearOfManufacture;
                if (p.technicalData.serialNumberUnitNumber !== undefined) dataToSync['generalData.generalDataSerialNumberUnitNumber'] = p.technicalData.serialNumberUnitNumber;
                if (p.technicalData.capacityWorkingLoad !== undefined) dataToSync['generalData.generalDataCapacityWorkingLoad'] = p.technicalData.capacityWorkingLoad;
                if (p.technicalData.maxLiftingHeight !== undefined) dataToSync['technicalData.technicalDataMaxLiftingHeight'] = p.technicalData.maxLiftingHeight;
            }

            if (Object.keys(dataToSync).length > 0) {
                await laporanRef.update(dataToSync);
            }
            
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Mobile Crane", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Mobile Crane').where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian').orderBy('createdAt', 'desc').get();
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
            if (!bapDoc.exists) return null;
            
            await bapRef.update(payload);

            const { laporanId } = bapDoc.data();
            if (laporanId) {
                const laporanRef = auditCollection.doc(laporanId);
                const p = payload;
                const dataToSync = {};

                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.subInspectionType !== undefined) dataToSync.subInspectionType = p.subInspectionType;
                if (p.inspectionDate !== undefined) dataToSync['generalData.generalDataInspectionDate'] = p.inspectionDate;
                
                if (p.generalData) {
                    if (p.generalData.ownerName !== undefined) dataToSync['generalData.generalDataOwnerName'] = p.generalData.ownerName;
                    if (p.generalData.ownerAddress !== undefined) dataToSync['generalData.generalDataOwnerAddress'] = p.generalData.ownerAddress;
                    if (p.generalData.userAddress !== undefined) dataToSync['generalData.generalDataUserAddress'] = p.generalData.userAddress;
                }

                if (p.technicalData) {
                    if (p.technicalData.manufacturer !== undefined) dataToSync['generalData.generalDataManufacturer'] = p.technicalData.manufacturer;
                    if (p.technicalData.locationAndYearOfManufacture !== undefined) dataToSync['generalData.generalDataLocationAndYearOfManufacture'] = p.technicalData.locationAndYearOfManufacture;
                    if (p.technicalData.serialNumberUnitNumber !== undefined) dataToSync['generalData.generalDataSerialNumberUnitNumber'] = p.technicalData.serialNumberUnitNumber;
                    if (p.technicalData.capacityWorkingLoad !== undefined) dataToSync['generalData.generalDataCapacityWorkingLoad'] = p.technicalData.capacityWorkingLoad;
                    if (p.technicalData.maxLiftingHeight !== undefined) dataToSync['technicalData.technicalDataMaxLiftingHeight'] = p.technicalData.maxLiftingHeight;
                }

                if (Object.keys(dataToSync).length > 0) {
                    await laporanRef.update(dataToSync);
                }
            }
            const updatedDoc = await bapRef.get();
            const data = updatedDoc.data();

            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
                data.createdAt = data.createdAt.toDate().toISOString();
            }

            return { id: updatedDoc.id, ...data };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Mobile Crane') {
                return null;
            }
            await docRef.delete();
            return id;
        }
    }
};

const gantryCraneServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Gantry Crane", documentType: "Laporan", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Gantry Crane').where('documentType', '==', 'Laporan').orderBy('createdAt', 'desc').get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Laporan') return null;
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            if (!(await laporanRef.get()).exists) return null;
            await laporanRef.update(payload);
            const bapQuery = await auditCollection.where('laporanId', '==', id).limit(1).get();
            if (!bapQuery.empty) {
                const bapRef = bapQuery.docs[0].ref;
                const dataToSync = {};
                const p = payload;
                if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
                if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
                if (p.generalData?.inspectionDate !== undefined) dataToSync.inspectionDate = p.generalData.inspectionDate;
                if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
                if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                if (p.generalData?.usageLocation !== undefined) dataToSync['generalData.usageLocation'] = p.generalData.usageLocation;
                if (p.generalData?.location !== undefined) dataToSync['generalData.location'] = p.generalData.location;
                if (p.generalData?.manufacturerHoist !== undefined) dataToSync['technicalData.manufacturerHoist'] = p.generalData.manufacturerHoist;
                if (p.generalData?.manufacturerStructure !== undefined) dataToSync['technicalData.manufactureStructure'] = p.generalData.manufacturerStructure;
                if (p.generalData?.brandOrType !== undefined) dataToSync['technicalData.brandOrType'] = p.generalData.brandOrType;
                if (p.generalData?.manufactureYear !== undefined) dataToSync['technicalData.manufactureYear'] = p.generalData.manufactureYear;
                if (p.generalData?.serialNumber !== undefined) dataToSync['technicalData.serialNumber'] = p.generalData.serialNumber;
                if (p.generalData?.maxLiftingCapacityKg !== undefined) dataToSync['technicalData.maxLiftingCapacityKg'] = p.generalData.maxLiftingCapacityKg;
                if (p.technicalData?.hoistingSpeed !== undefined) dataToSync['technicalData.liftingSpeedMpm'] = p.technicalData.hoistingSpeed;
                if (Object.keys(dataToSync).length > 0) await bapRef.update(dataToSync);
            }
            const updatedDoc = await laporanRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Gantry Crane') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        getDataForPrefill: async (laporanId) => {
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists) return null;
            const d = laporanDoc.data();
            return {
                laporanId,
                examinationType: d.examinationType || "",
                inspectionType: d.inspectionType || "",
                subInspectionType: "Gantry Crane",
                inspectionDate: d.generalData?.inspectionDate || "",
                generalData: { companyName: d.generalData?.companyName || "", companyLocation: d.generalData?.companyLocation || "", usageLocation: d.generalData?.usageLocation || "", location: d.generalData?.location || "" },
                technicalData: { brandOrType: d.generalData?.brandOrType || "", manufacturerHoist: d.generalData?.manufacturerHoist || "", manufactureStructure: d.generalData?.manufacturerStructure || "", manufactureYear: d.generalData?.manufactureYear || "", manufactureCountry: d.technicalData?.manufactureCountry || "", serialNumber: d.generalData?.serialNumber || "", maxLiftingCapacityKg: d.generalData?.maxLiftingCapacityKg || "", liftingSpeedMpm: d.technicalData?.hoistingSpeed || "" },
                inspectionResult: { visualCheck: {}, functionalTest: {}, ndtTest: {}, loadTest: {} }
            };
        },
        create: async (payload) => {
            const { laporanId } = payload;
            const laporanRef = auditCollection.doc(laporanId);
            if (!(await laporanRef.get()).exists) throw Boom.notFound('Laporan Gantry Crane tidak ditemukan.');
            const p = payload;
            const dataToSync = {};
            if (p.examinationType !== undefined) dataToSync.examinationType = p.examinationType;
            if (p.inspectionType !== undefined) dataToSync.inspectionType = p.inspectionType;
            if (p.inspectionDate !== undefined) dataToSync['generalData.inspectionDate'] = p.inspectionDate;
            if (p.generalData?.companyName !== undefined) dataToSync['generalData.companyName'] = p.generalData.companyName;
            if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
            if (p.generalData?.usageLocation !== undefined) dataToSync['generalData.usageLocation'] = p.generalData.usageLocation;
            if (p.generalData?.location !== undefined) dataToSync['generalData.location'] = p.generalData.location;
            if (p.technicalData?.manufacturerHoist !== undefined) dataToSync['generalData.manufacturerHoist'] = p.technicalData.manufacturerHoist;
            if (p.technicalData?.manufactureStructure !== undefined) dataToSync['generalData.manufactureStructure'] = p.technicalData.manufactureStructure;
            if (p.technicalData?.brandOrType !== undefined) dataToSync['generalData.brandOrType'] = p.technicalData.brandOrType;
            if (p.technicalData?.manufactureYear !== undefined) dataToSync['generalData.manufactureYear'] = p.technicalData.manufactureYear;
            if (p.technicalData?.serialNumber !== undefined) dataToSync['generalData.serialNumber'] = p.technicalData.serialNumber;
            if (p.technicalData?.maxLiftingCapacityKg !== undefined) dataToSync['generalData.maxLiftingCapacityKg'] = p.technicalData.maxLiftingCapacityKg;
            if (p.technicalData?.liftingSpeedMpm !== undefined) dataToSync['technicalData.hoistingSpeed'] = p.technicalData.liftingSpeedMpm;
            if (Object.keys(dataToSync).length > 0) await laporanRef.update(dataToSync);
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Gantry Crane", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },
        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Gantry Crane').where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian').orderBy('createdAt', 'desc').get();
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
            if (!bapDoc.exists) return null;
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
                if (p.generalData?.companyLocation !== undefined) dataToSync['generalData.companyLocation'] = p.generalData.companyLocation;
                if (p.generalData?.usageLocation !== undefined) dataToSync['generalData.usageLocation'] = p.generalData.usageLocation;
                if (p.generalData?.location !== undefined) dataToSync['generalData.location'] = p.generalData.location;
                if (p.technicalData?.manufacturerHoist !== undefined) dataToSync['generalData.manufacturerHoist'] = p.technicalData.manufacturerHoist;
                if (p.technicalData?.manufactureStructure !== undefined) dataToSync['generalData.manufactureStructure'] = p.technicalData.manufactureStructure;
                if (p.technicalData?.brandOrType !== undefined) dataToSync['generalData.brandOrType'] = p.technicalData.brandOrType;
                if (p.technicalData?.manufactureYear !== undefined) dataToSync['generalData.manufactureYear'] = p.technicalData.manufactureYear;
                if (p.technicalData?.serialNumber !== undefined) dataToSync['generalData.serialNumber'] = p.technicalData.serialNumber;
                if (p.technicalData?.maxLiftingCapacityKg !== undefined) dataToSync['generalData.maxLiftingCapacityKg'] = p.technicalData.maxLiftingCapacityKg;
                if (p.technicalData?.liftingSpeedMpm !== undefined) dataToSync['technicalData.hoistingSpeed'] = p.technicalData.liftingSpeedMpm;
                if (Object.keys(dataToSync).length > 0) await laporanRef.update(dataToSync);
            }
            const updatedDoc = await bapRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },
        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Gantry Crane') {
                return null;
            }
            await docRef.delete();
            return id;
        }
    }
};

const gondolaServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Gondola", documentType: "Laporan", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Gondola').where('documentType', '==', 'Laporan').orderBy('createdAt', 'desc').get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Gondola') {
             return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const laporanRef = auditCollection.doc(id);
            const laporanDoc = await laporanRef.get();
            if (!laporanDoc.exists) {
                // Menggunakan Boom untuk error yang lebih informatif
                throw Boom.notFound('Laporan Gondola tidak ditemukan');
            }

            // 1. Update Laporan utama
            await laporanRef.update(payload);

            // --- LOGIKA SINKRONISASI (Laporan -> BAP) ---
            const bapQuery = await auditCollection
                .where('laporanId', '==', id)
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .where('subInspectionType', '==', 'Gondola')
                .limit(1)
                .get();

            // 2. Jika BAP terhubung ditemukan, siapkan data untuk disinkronkan dengan aman
            if (!bapQuery.empty) {
                const bapRef = bapQuery.docs[0].ref;
                const dataToSyncWithBap = {};
                const p = payload;

                // Memeriksa setiap field sebelum menambahkannya ke objek sinkronisasi
                // Menggunakan Optional Chaining (?.) untuk mencegah crash
                if (p.inspectionDate !== undefined) dataToSyncWithBap.inspectionDate = p.inspectionDate;
                if (p.generalData?.ownerName !== undefined) dataToSyncWithBap['generalData.companyName'] = p.generalData.ownerName;
                if (p.generalData?.ownerAddress !== undefined) dataToSyncWithBap['generalData.companyLocation'] = p.generalData.ownerAddress;
                if (p.generalData?.userInCharge !== undefined) dataToSyncWithBap['generalData.userInCharge'] = p.generalData.userInCharge;
                if (p.generalData?.unitLocation !== undefined) dataToSyncWithBap['generalData.ownerAddress'] = p.generalData.unitLocation; // Perhatikan pemetaan ini
                if (p.technicalData?.manufacturer !== undefined) dataToSyncWithBap['technicalData.manufacturer'] = p.technicalData.manufacturer;
                if (p.technicalData?.locationAndYearOfManufacture !== undefined) dataToSyncWithBap['technicalData.locationAndYearOfManufacture'] = p.technicalData.locationAndYearOfManufacture;
                if (p.technicalData?.serialNumberUnitNumber !== undefined) dataToSyncWithBap['technicalData.serialNumberUnitNumber'] = p.technicalData.serialNumberUnitNumber;
                if (p.technicalData?.intendedUse !== undefined) dataToSyncWithBap['technicalData.intendedUse'] = p.technicalData.intendedUse;
                if (p.technicalData?.capacityWorkingLoad !== undefined) dataToSyncWithBap['technicalData.capacityWorkingLoad'] = p.technicalData.capacityWorkingLoad;
                // Penambahan pengecekan untuk 'speed' yang mungkin juga tidak ada
                if (p.technicalData?.gondolaSpecification?.speed !== undefined) {
                    const speedValue = p.technicalData.gondolaSpecification.speed;
                    // Ekstrak angka dari string kecepatan, contoh: "9-11 m / menit" -> "9-11"
                    const match = String(speedValue).match(/[\d.-]+/);
                    if (match) {
                        dataToSyncWithBap['technicalData.maxLiftingHeightMeters'] = match[0];
                    }
                }

                // Hanya update BAP jika ada data yang perlu disinkronkan
                if (Object.keys(dataToSyncWithBap).length > 0) {
                    await bapRef.update(dataToSyncWithBap);
                }
            }
            // --- AKHIR LOGIKA SINKRONISASI ---

            const updatedDoc = await laporanRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Gondola') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    bap: {
        getDataForPrefill: async (laporanId) => {
            const laporanRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanRef.get();

            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
                const error = new Error('Laporan dengan ID yang diberikan tidak ditemukan.');
                error.isBoom = true;
                error.output = { statusCode: 404 };
                throw error;
            }

            const laporanData = laporanDoc.data();

            return {
                laporanId: laporanId,
                examinationType: laporanData.examinationType,
                inspectionType: laporanData.inspectionType,
                inspectionDate: laporanData.inspectionDate,
                equipmentType: laporanData.equipmentType,
                generalData: {
                    companyName: laporanData.generalData.ownerName,
                    companyLocation: laporanData.generalData.ownerAddress,
                    userInCharge: laporanData.generalData.userInCharge,
                    ownerAddress: laporanData.generalData.ownerAddress
                },
                technicalData: {
                    manufacturer: laporanData.technicalData.manufacturer,
                    locationAndYearOfManufacture: laporanData.technicalData.locationAndYearOfManufacture,
                    serialNumberUnitNumber: laporanData.technicalData.serialNumberUnitNumber,
                    intendedUse: laporanData.generalData.intendedUse,
                    capacityWorkingLoad: laporanData.generalData.capacityWorkingLoad,
                    maxLiftingHeightMeters: laporanData.technicalData.gondolaSpecification.speed
                },
                inspectionResult: { visualCheck: {}, functionalTest: {} }
            };
        },
       create: async (payload) => {
            const laporanRef = auditCollection.doc(payload.laporanId);
            const laporanDoc = await laporanRef.get();
            if (!laporanDoc.exists) {
                const error = new Error('Laporan dengan ID yang diberikan tidak ditemukan.');
                error.isBoom = true;
                error.output = { statusCode: 404 };
                throw error;
            }

            // --- LOGIKA SINKRONISASI (BAP -> Laporan) ---
            const dataToSyncWithLaporan = {
        inspectionDate: payload.inspectionDate,
            'generalData.ownerName': payload.generalData.companyName,
            'generalData.ownerAddress': payload.generalData.companyLocation,
            'generalData.userInCharge': payload.generalData.userInCharge,
            'generalData.unitLocation': payload.generalData.ownerAddress,
            'technicalData.manufacturer': payload.technicalData.manufacturer,
            'technicalData.locationAndYearOfManufacture': payload.technicalData.locationAndYearOfManufacture,
            'technicalData.serialNumberUnitNumber': payload.technicalData.serialNumberUnitNumber,
            'technicalData.intendedUse': payload.technicalData.intendedUse,
            'technicalData.capacityWorkingLoad': payload.technicalData.capacityWorkingLoad,
            'technicalData.gondolaSpecification.capacity': payload.technicalData.capacityWorkingLoad,
            };
            await laporanRef.update(dataToSyncWithLaporan);
            // --- AKHIR LOGIKA SINKRONISASI ---

            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Gondola", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Gondola')
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .orderBy('createdAt', 'desc')
                .get();
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Gondola') {
             return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
        const bapRef = auditCollection.doc(id);
        const bapDoc = await bapRef.get();
        if (!bapDoc.exists) {
            throw new NotFoundError('BAP Gondola tidak ditemukan');
        }

        const laporanRef = auditCollection.doc(payload.laporanId);
        const laporanDoc = await laporanRef.get();
        if (!laporanDoc.exists) {
            throw new InvariantError('BAP gagal diupdate. Laporan Induk tidak ditemukan');
        }

        await bapRef.update(payload);

        // --- LOGIKA SINKRONISASI (BAP -> Laporan) ---
        const dataToSyncWithLaporan = {
            inspectionDate: payload.inspectionDate,
            'generalData.ownerName': payload.generalData.companyName,
            'generalData.ownerAddress': payload.generalData.companyLocation,
            'generalData.userInCharge': payload.generalData.userInCharge,
            'generalData.unitLocation': payload.generalData.ownerAddress,
            'technicalData.manufacturer': payload.technicalData.manufacturer,
            'technicalData.locationAndYearOfManufacture': payload.technicalData.locationAndYearOfManufacture,
            'technicalData.serialNumberUnitNumber': payload.technicalData.serialNumberUnitNumber,
            'technicalData.intendedUse': payload.technicalData.intendedUse,
            'technicalData.capacityWorkingLoad': payload.technicalData.capacityWorkingLoad,
            'technicalData.gondolaSpecification.capacity': payload.technicalData.capacityWorkingLoad,
        };
        await laporanRef.update(dataToSyncWithLaporan);
        // --- AKHIR LOGIKA SINKRONISASI ---

        const updatedDoc = await bapRef.get();
        return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Gondola') {
             return null;
            }
            await docRef.delete();
            return id;
        }
    }
};

module.exports = {
    forkliftServices,
    mobileCraneServices,
    gantryCraneServices,
    gondolaServices
};