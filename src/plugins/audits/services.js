'use strict';

const db = require('../../utils/firestore');
const auditCollection = db.collection('audits')

const createAudit = async (payload) => {
    const docRef = await auditCollection.add(payload);
    return docRef.id;
};

const getAllAudits = async () => {
    const snapshot = await auditCollection.get();
    const audits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return audits;
};

const getAuditById = async (id) => {
    const doc = await auditCollection.doc(id).get();
    if (!doc.exists) {
        return null; // Mengembalikan null jika tidak ditemukan
    }
    return { id: doc.id, ...doc.data() };
};

const updateAuditById = async (id, payload) => {
    await auditCollection.doc(id).update(payload);
    return id;
};

const deleteAuditById = async (id) => {
    await auditCollection.doc(id).delete();
    return id;
};

module.exports = {
    createAudit,
    getAllAudits,
    getAuditById,
    updateAuditById,
    deleteAuditById,
};