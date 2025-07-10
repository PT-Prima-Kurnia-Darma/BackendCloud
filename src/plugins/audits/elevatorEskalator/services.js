'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('elevatorEskalator');

const elevatorServices = {
    /**
     * FUNGSI BANTUAN INTERNAL: Memfilter data untuk sinkronisasi.
     * @param {object} payload - Data yang diterima.
     * @returns {object} - Objek berisi data yang akan disinkronkan.
     */
    _getSharedData: (payload) => {
        const sharedData = {};
        const syncedFields = [
            'inspectionDate', 'examinationType', 'equipmentType',
            'generalData', 'technicalData'
        ];

        for (const key of syncedFields) {
            if (payload[key] !== undefined) {
                sharedData[key] = payload[key];
            }
        }
        return sharedData;
    },

    /**
     * KUMPULAN FUNGSI UNTUK LAPORAN ELEVATOR
     */
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Elevator", documentType: "Laporan", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Elevator').where('documentType', '==', 'Laporan').orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Elevator') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Elevator') {
                return null;
            }
            
            await docRef.update(payload);

            const bapQuery = await auditCollection
                .where('laporanId', '==', id)
                .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
                .limit(1)
                .get();

            if (!bapQuery.empty) {
                const bapDocRef = bapQuery.docs[0].ref;
                
                const dataForBap = {};
                if (payload.generalData?.ownerName) dataForBap['generalData.ownerName'] = payload.generalData.ownerName;
                if (payload.generalData?.ownerAddress) dataForBap['generalData.ownerAddress'] = payload.generalData.ownerAddress;
                
                if (payload.generalData?.inspectionDate) {
                    dataForBap.inspectionDate = payload.generalData.inspectionDate;
                }
                if (payload.examinationType) dataForBap.examinationType = payload.examinationType;
                if (payload.equipmentType) dataForBap.equipmentType = payload.equipmentType;
                
                if (Object.keys(dataForBap).length > 0) {
                    await bapDocRef.update(dataForBap);
                }
            }

            const updatedDoc = await docRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Elevator') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    },

    /**
     * KUMPULAN FUNGSI UNTUK BAP ELEVATOR
     */
    bap: {
        getDataForPrefill: async (laporanId) => {
            const laporanDoc = await auditCollection.doc(laporanId).get();
            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
                return null;
            }
            const d = laporanDoc.data();
            const inspectionDate = d.inspectionDate || d.generalData?.inspectionDate || "";
            const cleanGeneralData = { ...d.generalData };
            delete cleanGeneralData.inspectionDate;

            return {
                laporanId: laporanId,
                inspectionDate: inspectionDate,
                examinationType: d.examinationType || "",
                equipmentType: d.equipmentType || "",
                generalData: cleanGeneralData,
                technicalData: d.technicalData || {},
                visualInspection: {},
                testing: {}
            };
        },

        create: async (payload) => {
            const { laporanId } = payload;
            const laporanDocRef = auditCollection.doc(laporanId);
            const laporanDoc = await laporanDocRef.get();

            if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
                throw Boom.notFound('Laporan dengan ID yang diberikan tidak ditemukan.');
            }
            
            const cleanPayload = { ...payload };
            if (cleanPayload.generalData && cleanPayload.generalData.inspectionDate) {
                if (!cleanPayload.inspectionDate) {
                    cleanPayload.inspectionDate = cleanPayload.generalData.inspectionDate;
                }
                delete cleanPayload.generalData.inspectionDate;
            }
            
            // Menggunakan fungsi bantuan internal
            const dataToSync = elevatorServices._getSharedData(cleanPayload);
            if (Object.keys(dataToSync).length > 0) {
                await laporanDocRef.update(dataToSync);
            }
            
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...cleanPayload, subInspectionType: "Elevator", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Elevator').where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian').orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Elevator') return null;
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Elevator') return null;
            
            await docRef.update(payload);
            
            const updatedBap = (await docRef.get()).data();
            const { laporanId } = updatedBap;

            if (laporanId) {
                const laporanDocRef = auditCollection.doc(laporanId);
                const laporanDoc = await laporanDocRef.get();
                if(laporanDoc.exists){
                    const dataForLaporan = {};
                    if (payload.generalData?.ownerName) dataForLaporan['generalData.ownerName'] = payload.generalData.ownerName;
                    if (payload.generalData?.ownerAddress) dataForLaporan['generalData.ownerAddress'] = payload.generalData.ownerAddress;
                    
                    if (payload.inspectionDate) {
                        dataForLaporan['generalData.inspectionDate'] = payload.inspectionDate;
                    }
                    if (payload.examinationType) dataForLaporan.examinationType = payload.examinationType;
                    if (payload.equipmentType) dataForLaporan.equipmentType = payload.equipmentType;

                    if (Object.keys(dataForLaporan).length > 0) {
                        await laporanDocRef.update(dataForLaporan);
                    }
                }
            }
            
            const updatedDoc = await docRef.get();
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
    /**
     * KUMPULAN FUNGSI UNTUK LAPORAN ESKALATOR
     */
    laporan: {
        /**
         * Membuat dokumen laporan Eskalator baru.
         */
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, subInspectionType: "Eskalator", documentType: "Laporan", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        /**
         * Mengambil semua dokumen laporan Eskalator.
         */
        getAll: async () => {
            const snapshot = await auditCollection.where('subInspectionType', '==', 'Eskalator').where('documentType', '==', 'Laporan').orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        /**
         * Mengambil satu dokumen laporan Eskalator berdasarkan ID.
         */
        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Eskalator') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        /**
         * Memperbarui dokumen laporan Eskalator berdasarkan ID dan sinkronisasi ke BAP.
         */
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

        /**
         * Menghapus dokumen laporan Eskalator berdasarkan ID.
         */
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

    /**
     * KUMPULAN FUNGSI UNTUK BAP ESKALATOR
     */
    bap: {
        /**
         * Mengambil data dari Laporan Eskalator untuk prefill form BAP.
         */
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
            technicalData: technicalDataForBap, // Gunakan technicalData yang sudah aman
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

            if (!laporanDoc.exists) throw Boom.notFound('Laporan Eskalator dengan ID tersebut tidak ditemukan.');
            
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

        /**
         * Menghapus dokumen BAP Eskalator berdasarkan ID.
         */
        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            if (!(await docRef.get()).exists) return null;
            await docRef.delete();
            return id;
        },
    }
};


module.exports = {
  elevatorServices,
  eskalatorServices
};