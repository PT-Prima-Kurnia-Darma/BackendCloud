'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('elevatorEskalator');

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
      await docRef.update(payload);
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
   * KUMPULAN FUNGSI UNTUK LAPORAN ELEVATOR
   */
    bap: {
    getDataForPrefill: async (laporanId) => {
      const laporanDoc = await auditCollection.doc(laporanId).get();
      if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
        return null;
      }
      const d = laporanDoc.data();
      return {
        laporanId: laporanId,
        inspectionDate: d.generalData?.inspectionDate || "",
        examinationType: d.examinationType || "",
        equipmentType: d.equipmentType || "",
        generalData: {
          ownerName: d.generalData?.ownerName || "",
          ownerAddress: d.generalData?.ownerAddress || "",
          nameUsageLocation: d.generalData?.nameUsageLocation || "",
          addressUsageLocation: d.generalData?.addressUsageLocation || "",
        },
        technicalData: {
          elevatorType: d.generalData?.elevatorType || "",
          manufacturerOrInstaller: d.generalData?.manufacturerOrInstaller || "",
          brandOrType: d.generalData?.brandOrType || "",
          countryAndYear: d.generalData?.countryAndYear || "",
          serialNumber: d.generalData?.serialNumber || "",
          capacity: d.generalData?.capacity || "",
          speed: d.generalData?.speed || "",
          floorsServed: d.generalData?.floorsServed || "",
        },
        visualInspection: {},
        testing: {}
      };
    },

    create: async (payload) => {
      const { laporanId } = payload;
      // 1. Validasi LaporanId
      const laporanDocRef = auditCollection.doc(laporanId);
      const laporanDoc = await laporanDocRef.get();

      if (!laporanDoc.exists || laporanDoc.data().documentType !== 'Laporan') {
        throw Boom.notFound('Laporan dengan ID yang diberikan tidak ditemukan.');
      }
      // 2. Update data laporan jika ada perubahan dari prefill
      const laporanData = laporanDoc.data();
      const updatedLaporanData = {
        ...laporanData,
        generalData: {
          ...laporanData.generalData,
          ...payload.generalData,
        },
        technicalData: {
            ...laporanData.technicalData,
            ...payload.technicalData,
        }
      };
      await laporanDocRef.update(updatedLaporanData);
      // 3. Buat BAP baru
      const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
      const dataToSave = { ...payload, subInspectionType: "Elevator", documentType: "Berita Acara dan Pemeriksaan Pengujian", createdAt };
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

module.exports = {
  elevatorServices,
};