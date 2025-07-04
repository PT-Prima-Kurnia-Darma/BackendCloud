'use strict';

const db = require('../../../utils/firestore');
// Nama koleksi yang benar sesuai kesepakatan kita
const auditCollection = db.collection('elevatorEskalator');

const elevatorServices = {
  /**
   * =================================
   * KUMPULAN FUNGSI UNTUK LAPORAN ELEVATOR
   * =================================
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
};

module.exports = {
  elevatorServices,
};