'use strict';

const db = require('../../../utils/firestore');
const auditCollection = db.collection('elevatorDanEskalator');

/**
 * Menyimpan data yang diterima dari frontend sebagai Laporan Elevator.
 * Secara otomatis menambahkan field subBidang, jenisDokumen, dan createdAt.
 */
const createLaporanElevator = async (payloadFromFrontend) => {
    const dataToSave = {
        ...payloadFromFrontend,
        subBidang: "elevator",
        jenisDokumen: "laporan",
        createdAt: new Date().toISOString(),
    };
    const docRef = await auditCollection.add(dataToSave);
    return docRef.id;
};

/**
 * Mengambil semua dokumen yang merupakan Laporan Elevator.
 */
const getAllLaporanElevator = async () => {
    const snapshot = await auditCollection
        .where('subBidang', '==', 'elevator')
        .where('jenisDokumen', '==', 'laporan')
        .orderBy('createdAt', 'desc')
        .get();
    const allLaporan = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return allLaporan;
};

/**
 * Mengambil satu dokumen Laporan Elevator berdasarkan ID.
 */
const getLaporanElevatorById = async (id) => {
    const doc = await auditCollection.doc(id).get();
    if (!doc.exists) {
        return null;
    }
    const data = doc.data();
    // Verifikasi untuk memastikan ini adalah dokumen yang benar
    if (data.subBidang !== 'elevator' || data.jenisDokumen !== 'laporan') {
        return null;
    }
    return { id: doc.id, ...data };
};

/**
 * Memperbarui satu dokumen Laporan Elevator berdasarkan ID.
 */
const updateLaporanElevatorById = async (id, payload) => {
    const docRef = auditCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().jenisDokumen !== 'laporan' || doc.data().subBidang !== 'elevator') {
        return null;
    }
    await docRef.update(payload);
    return id;
};

/**
 * Menghapus satu dokumen Laporan Elevator berdasarkan ID.
 */
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