'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('elevatorEskalator');

// FUNGSI BANTUAN: Untuk memfilter data yang akan disinkronkan
const getSharedData = (payload) => {
  const sharedData = {};
  
  // Daftar field-field yang akan disinkronkan secara otomatis
  const syncedFields = [
    'inspectionDate', 'examinationType', 'equipmentType',
    'generalData', 'technicalData'
  ];

  for (const key of syncedFields) {
    // Jika field ada di dalam payload, tambahkan ke objek untuk sinkronisasi
    if (payload[key] !== undefined) {
      sharedData[key] = payload[key];
    }
  }
  return sharedData;
};


const elevatorServices = {
  /**
   * KUMPULAN FUNGSI UNTUK LAPORAN ELEVATOR
   */
  laporan: {
    /**
     * Membuat dokumen laporan Elevator baru.
     */
    create: async (payload) => {
      // ✅ Diubah ke WIB dengan format 'Z'
      const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
      const dataToSave = { ...payload, subInspectionType: "Elevator", documentType: "Laporan", createdAt };
      const docRef = await auditCollection.add(dataToSave);
      return { id: docRef.id, ...dataToSave };
    },

    /**
     * Mengambil semua dokumen laporan Elevator.
     */
    getAll: async () => {
      const snapshot = await auditCollection.where('subInspectionType', '==', 'Elevator').where('documentType', '==', 'Laporan').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Mengambil satu dokumen laporan Elevator berdasarkan ID.
     */
    getById: async (id) => {
      const doc = await auditCollection.doc(id).get();
      if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Elevator') {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    },

    /**
     * Memperbarui dokumen laporan Elevator berdasarkan ID.
     */
    updateById: async (id, payload) => {
      const docRef = auditCollection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Elevator') {
        return null;
      }
      
      // 1. Update dokumen Laporan dengan payload aslinya.
      await docRef.update(payload);

      // 2. Cari BAP yang terhubung untuk disinkronkan.
      const bapQuery = await auditCollection
        .where('laporanId', '==', id)
        .where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian')
        .limit(1)
        .get();

      if (!bapQuery.empty) {
        const bapDocRef = bapQuery.docs[0].ref;
        
        // --- Terjemahkan data untuk BAP ---
        const dataForBap = {};
        if (payload.generalData?.ownerName) dataForBap['generalData.ownerName'] = payload.generalData.ownerName;
        if (payload.generalData?.ownerAddress) dataForBap['generalData.ownerAddress'] = payload.generalData.ownerAddress;
        // ...tambahkan field generalData lainnya jika ada...

        // Inilah bagian pentingnya:
        if (payload.generalData?.inspectionDate) {
          dataForBap.inspectionDate = payload.generalData.inspectionDate; // Pindahkan ke level atas untuk BAP
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

    /**
     * Menghapus dokumen laporan Elevator berdasarkan ID.
     */
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
    /**
     * Mengambil data dari Laporan untuk prefill form BAP.
     * Logika diperbaiki untuk mencegah duplikasi 'inspectionDate'.
     */
    getDataForPrefill: async (laporanId) => {
      const laporanDoc = await auditCollection.doc(laporanId).get();
      if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
        return null;
      }
      const d = laporanDoc.data();

      // Ambil inspectionDate dari sumber yang paling mungkin benar (level atas, atau dari dalam generalData).
      const inspectionDate = d.inspectionDate || d.generalData?.inspectionDate || "";

      // Buat salinan generalData yang bersih tanpa duplikasi.
      const cleanGeneralData = { ...d.generalData };
      delete cleanGeneralData.inspectionDate;

      return {
        laporanId: laporanId,
        inspectionDate: inspectionDate, // Pastikan inspectionDate hanya ada di level atas.
        examinationType: d.examinationType || "",
        equipmentType: d.equipmentType || "",
        generalData: cleanGeneralData, // Gunakan generalData yang sudah bersih.
        technicalData: d.technicalData || {},
        visualInspection: {},
        testing: {}
      };
    },

    /**
     * Membuat BAP baru dan menyinkronkan data kembali ke Laporan.
     * Logika diperbaiki untuk membersihkan data sebelum disimpan.
     */
    create: async (payload) => {
      const { laporanId } = payload;
      const laporanDocRef = auditCollection.doc(laporanId);
      const laporanDoc = await laporanDocRef.get();

      if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
        throw Boom.notFound('Laporan dengan ID yang diberikan tidak ditemukan.');
      }
      
      // --- Langkah Pembersihan Data ---
      const cleanPayload = { ...payload };
      if (cleanPayload.generalData && cleanPayload.generalData.inspectionDate) {
        // Jika inspectionDate ada di dalam generalData, pindahkan ke level atas dan hapus dari dalam.
        if (!cleanPayload.inspectionDate) {
            cleanPayload.inspectionDate = cleanPayload.generalData.inspectionDate;
        }
        delete cleanPayload.generalData.inspectionDate;
      }
      // --- Selesai Pembersihan ---

      // 2. Update data laporan dengan data yang sudah bersih.
      const dataToSync = getSharedData(cleanPayload);
      if (Object.keys(dataToSync).length > 0) {
          await laporanDocRef.update(dataToSync);
      }
      
      // 3. Buat BAP baru dengan data yang sudah bersih.
      const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
      const dataToSave = { ...cleanPayload, subInspectionType: "Elevator", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
      const docRef = await auditCollection.add(dataToSave);
      return { id: docRef.id, ...dataToSave };
    },

    /**
     * Mengambil semua dokumen BAP Elevator.
     */
    getAll: async () => {
      const snapshot = await auditCollection.where('subInspectionType', '==', 'Elevator').where('documentType', '==', 'Berita Acara dan Pemeriksaan Pengujian').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Mengambil satu dokumen BAP Elevator berdasarkan ID.
     */
    getById: async (id) => {
      const doc = await auditCollection.doc(id).get();
      if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Elevator') return null;
      return { id: doc.id, ...doc.data() };
    },

    updateById: async (id, payload) => {
      const docRef = auditCollection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Elevator') return null;
      
      // 1. Update dokumen BAP dengan payload aslinya.
      await docRef.update(payload);
      
      const updatedBap = (await docRef.get()).data();
      const { laporanId } = updatedBap;

      // 2. Jika BAP punya laporanId, update juga Laporan yang terhubung.
      if (laporanId) {
        const laporanDocRef = auditCollection.doc(laporanId);
        const laporanDoc = await laporanDocRef.get();
        if(laporanDoc.exists){
            // --- Terjemahkan data untuk Laporan ---
            const dataForLaporan = {};
            // Firestore menggunakan "dot notation" untuk update nested object
            if (payload.generalData?.ownerName) dataForLaporan['generalData.ownerName'] = payload.generalData.ownerName;
            if (payload.generalData?.ownerAddress) dataForLaporan['generalData.ownerAddress'] = payload.generalData.ownerAddress;
            // ...tambahkan field generalData lainnya jika ada...

            // Inilah bagian pentingnya:
            if (payload.inspectionDate) {
              dataForLaporan['generalData.inspectionDate'] = payload.inspectionDate; // Masukkan ke dalam generalData untuk Laporan
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

    /**
     * Menghapus dokumen BAP Elevator berdasarkan ID.
     */
    deleteById: async (id) => {
      const docRef = auditCollection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists || doc.data().documentType !== 'Berita Acara dan Pemeriksaan Pengujian' || doc.data().subInspectionType !== 'Elevator') return null;
      await docRef.delete();
      return id;
    },
  }
};

module.exports = {
  elevatorServices,
};