'use strict';

const db = require('../../../utils/firestore');
// Nama koleksi yang benar sesuai kesepakatan kita
const auditCollection = db.collection('elevatorEskalator');

const elevatorServices = {
  /**
   * KUMPULAN FUNGSI UNTUK LAPORAN ELEVATOR
   */
  laporan: {
    /**
     * Membuat dokumen Laporan Elevator baru.
     */
    create: async (payload) => {
      const dataToSave = { ...payload, subBidang: "elevator", jenisDokumen: "laporan", createdAt: new Date().toISOString() };
      const docRef = await auditCollection.add(dataToSave);
      return { id: docRef.id, ...dataToSave };
    },

    /**
     * Mengambil semua dokumen Laporan Elevator.
     */
    getAll: async () => {
      const snapshot = await auditCollection.where('subBidang', '==', 'elevator').where('jenisDokumen', '==', 'laporan').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Mengambil satu dokumen Laporan Elevator berdasarkan ID.
     */
    getById: async (id) => {
      const doc = await auditCollection.doc(id).get();
      if (!doc.exists || doc.data().jenisDokumen !== 'laporan' || doc.data().subBidang !== 'elevator') {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    },

    /**
     * Memperbarui dokumen Laporan Elevator berdasarkan ID.
     */
    updateById: async (id, payload) => {
      const docRef = auditCollection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists || doc.data().jenisDokumen !== 'laporan' || doc.data().subBidang !== 'elevator') {
        return null;
      }
      await docRef.update(payload);
      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    },

    /**
     * Menghapus dokumen Laporan Elevator berdasarkan ID.
     */
    deleteById: async (id) => {
      const docRef = auditCollection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists || doc.data().jenisDokumen !== 'laporan' || doc.data().subBidang !== 'elevator') {
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
      if (!laporanDoc.exists || laporanDoc.data().jenisDokumen !== 'laporan') {
        return null;
      }
      const d = laporanDoc.data();
      return {
        laporanId: laporanId,
        day: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        typeInspection: d.typeInspection || "",
        EskOrElevType: d.EskOrElevType || "",
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
      const dataToSave = { ...payload, subBidang: "elevator", jenisDokumen: "bap", createdAt: new Date().toISOString() };
      const docRef = await auditCollection.add(dataToSave);
      return { id: docRef.id, ...dataToSave };
    },
    getAll: async () => {
      const snapshot = await auditCollection.where('subBidang', '==', 'elevator').where('jenisDokumen', '==', 'bap').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    getById: async (id) => {
      const doc = await auditCollection.doc(id).get();
      if (!doc.exists || doc.data().jenisDokumen !== 'bap' || doc.data().subBidang !== 'elevator') return null;
      return { id: doc.id, ...doc.data() };
    },
    updateById: async (id, payload) => {
      const docRef = auditCollection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists || doc.data().jenisDokumen !== 'bap' || doc.data().subBidang !== 'elevator') return null;
      await docRef.update(payload);
      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    },
    deleteById: async (id) => {
      const docRef = auditCollection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists || doc.data().jenisDokumen !== 'bap' || doc.data().subBidang !== 'elevator') return null;
      await docRef.delete();
      return id;
    },
  }
};

module.exports = {
  elevatorServices,
};