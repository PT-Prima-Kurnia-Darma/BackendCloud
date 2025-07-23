'use strict';

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');
const auditCollection = db.collection('proteksiKebakaran');

const proteksiKebakaranServices = {
    laporan: {
        create: async (payload) => {
            const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
            const dataToSave = { 
                ...payload, 
                subInspectionType: "Instalasi Proteksi Kebakaran", 
                documentType: "Laporan", 
                createdAt 
            };
            const docRef = await auditCollection.add(dataToSave);
            return { id: docRef.id, ...dataToSave };
        },

        getAll: async () => {
            const snapshot = await auditCollection
                .where('subInspectionType', '==', 'Instalasi Proteksi Kebakaran')
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
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Proteksi Kebakaran') {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        },

        updateById: async (id, payload) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Proteksi Kebakaran') {
                return null;
            }
            await docRef.update(payload);
            const updatedDoc = await docRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        },

        deleteById: async (id) => {
            const docRef = auditCollection.doc(id);
            const doc = await docRef.get();
            if (!doc.exists || doc.data().documentType !== 'Laporan' || doc.data().subInspectionType !== 'Instalasi Proteksi Kebakaran') {
                return null;
            }
            await docRef.delete();
            return id;
        },
    }
};

module.exports = {
    proteksiKebakaranServices,
};