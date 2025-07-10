'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('paa'); // Koleksi baru untuk PAA

const forkliftServices = {
    /**
     * KUMPULAN FUNGSI UNTUK LAPORAN FORKLIFT
     */
    laporan: {
        /**
         * Membuat dokumen laporan Forklift baru.
         */
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { ...payload, documentType: "Laporan", createdAt };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        /**
         * Mengambil semua dokumen laporan Forklift.
         */
        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Forklift')
                .where('documentType', '==', 'Laporan')
                .orderBy('createdAt', 'desc')
                .get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        /**
         * Mengambil satu dokumen laporan Forklift berdasarkan ID.
         */
        getById: async (id) => {
            const doc = await auditCollection.doc(id).get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Forklift') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        /**
         * Memperbarui dokumen laporan Forklift berdasarkan ID.
         * (Logika sinkronisasi BAP akan ditambahkan di sini nanti)
         */
        updateById: async (id, payload) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Forklift') {
                return null;
            }
            
            await docRef.update(payload);
            
            // TODO: Tambahkan logika sinkronisasi ke BAP Forklift di sini
            
            const updatedDoc = await docRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        /**
         * Menghapus dokumen laporan Forklift berdasarkan ID.
         */
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
    // Objek 'bap' untuk Forklift akan ditambahkan di sini nanti
};

module.exports = {
    forkliftServices,
    // Service untuk jenis PAA lain akan ditambahkan di sini
};