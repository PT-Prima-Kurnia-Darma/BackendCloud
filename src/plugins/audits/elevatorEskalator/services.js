'use strict';

const db = require('../../../utils/firestore');
const auditCollection = db.collection('elevatorEskalator');

/**
 * [MODIFIED]
 * Menyimpan data dan mengembalikan data lengkap yang telah disimpan.
 */
const createLaporanElevator = async (payloadFromFrontend) => {
    const dataToSave = {
        ...payloadFromFrontend,
        subBidang: "elevator",
        jenisDokumen: "laporan",
        createdAt: new Date().toISOString(),
    };
    const docRef = await auditCollection.add(dataToSave);
    return {
        id: docRef.id,
        ...dataToSave
    };
};

/**
 * [MODIFIED]
 * Memperbarui dokumen dan mengembalikan data lengkap setelah diubah.
 */
const updateLaporanElevatorById = async (id, payload) => {
    const docRef = auditCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().jenisDokumen !== 'laporan' || doc.data().subBidang !== 'elevator') {
        return null;
    }
    // Lakukan pembaruan
    await docRef.update(payload);
    
    // Ambil kembali data yang sudah terupdate
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
};


// --- FUNGSI LAINNYA TIDAK PERLU DIUBAH ---

const getAllLaporanElevator = async () => {
    const snapshot = await auditCollection
        .where('subBidang', '==', 'elevator')
        .where('jenisDokumen', '==', 'laporan')
        .orderBy('createdAt', 'desc')
        .get();
    const allLaporan = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return allLaporan;
};

const getLaporanElevatorById = async (id) => {
    const doc = await auditCollection.doc(id).get();
    if (!doc.exists) {
        return null;
    }
    const data = doc.data();
    if (data.subBidang !== 'elevator' || data.jenisDokumen !== 'laporan') {
        return null;
    }
    return { id: doc.id, ...data };
};

const deleteLaporanElevatorById = async (id) => {
    const docRef = auditCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().jenisDokumen !== 'laporan' || doc.data().subBidang !== 'elevator') {
        return null;
    }
    await docRef.delete();
    return id;
};

module.exports = {
    createLaporanElevator,
    getAllLaporanElevator,
    getLaporanElevatorById,
    updateLaporanElevatorById,
    deleteLaporanElevatorById,
};