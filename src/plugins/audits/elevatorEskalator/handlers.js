'use strict';

const Boom = require('@hapi/boom');
const elevatorService = require('./services');
const { createLaporanElevator: generateDoc } = require('../../../services/documentGenerator/elevatorEskalator/elevator/laporan/generator');

/**
 * [CREATE] Membuat laporan baru
 */
const createLaporanElevatorHandler = async (request, h) => {
    try {
        const newLaporan = await elevatorService.createLaporanElevator(request.payload);
        return h.response({
            status: 'success',
            message: 'Laporan elevator berhasil dibuat',
            data: { laporan: newLaporan },
        }).code(201);
    } catch (error) {
        // Error Sistem: Gagal saat mencoba menyimpan ke database
        console.error('Error in createLaporanElevatorHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat menyimpan laporan.');
    }
};

/**
 * [READ] Mengambil semua laporan
 */
const getAllLaporanElevatorHandler = async (request, h) => {
    try {
        const allLaporan = await elevatorService.getAllLaporanElevator();
        return { status: 'success', data: { laporan: allLaporan } };
    } catch (error) {
        // Error Sistem: Kemungkinan besar karena index Firestore belum dibuat
        console.error('Error in getAllLaporanElevatorHandler:', error);
        if (error.code === 9) { // 9 adalah kode untuk FAILED_PRECONDITION
             return Boom.badImplementation('Gagal mengambil data. Pastikan index Firestore sudah dibuat. Periksa log server untuk link pembuatan index.');
        }
        return Boom.badImplementation('Terjadi kesalahan pada server saat mengambil daftar laporan.');
    }
};

/**
 * [READ] Mengambil satu laporan berdasarkan ID
 */
const getLaporanElevatorByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const laporan = await elevatorService.getLaporanElevatorById(id);

        // Error User: ID yang diberikan tidak ditemukan atau bukan laporan elevator
        if (!laporan) {
            return Boom.notFound('Laporan elevator dengan ID tersebut tidak ditemukan.');
        }
        return { status: 'success', data: { laporan } };
    } catch (error) {
        // Error Sistem: Gagal saat query ke database
        console.error('Error in getLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat mengambil laporan.');
    }
};

/**
 * [UPDATE] Memperbarui laporan berdasarkan ID
 */
const updateLaporanElevatorByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const updatedLaporan = await elevatorService.updateLaporanElevatorById(id, request.payload);

        // Error User: ID yang diberikan tidak ada
        if (!updatedLaporan) {
            return Boom.notFound('Gagal memperbarui. Laporan elevator dengan ID tersebut tidak ditemukan.');
        }
        return h.response({
            status: 'success',
            message: 'Laporan elevator berhasil diperbarui',
            data: { laporan: updatedLaporan }
        });
    } catch (error) {
        // Error Sistem: Gagal saat proses update di database
        console.error('Error in updateLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat memperbarui laporan.');
    }
};

/**
 * [DELETE] Menghapus laporan berdasarkan ID
 */
const deleteLaporanElevatorByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const deletedId = await elevatorService.deleteLaporanElevatorById(id);

        // Error User: ID yang diberikan tidak ada
        if (!deletedId) {
            return Boom.notFound('Gagal menghapus. Laporan elevator dengan ID tersebut tidak ditemukan.');
        }
        return { status: 'success', message: 'Laporan elevator berhasil dihapus' };
    } catch (error) {
        // Error Sistem: Gagal saat proses delete di database
        console.error('Error in deleteLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat menghapus laporan.');
    }
};

/**
 * [DOWNLOAD] Mengunduh dokumen laporan
 */
const downloadLaporanElevatorHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const laporanData = await elevatorService.getLaporanElevatorById(id);
        
        // Error User: ID laporan tidak ditemukan
        if (!laporanData) {
            return Boom.notFound('Gagal membuat dokumen. Laporan dengan ID tersebut tidak ditemukan.');
        }

        laporanData.id = id;
        const { docxBuffer, fileName } = await generateDoc(laporanData);

        return h.response(docxBuffer)
            .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            .header('Content-Disposition', `attachment; filename="${fileName}"`);
    } catch (error) {
        // Error Sistem: Bisa jadi karena template tidak ditemukan di GCS atau error saat render dokumen
        console.error('Error in downloadLaporanElevatorHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat membuat dokumen untuk diunduh.');
    }
};

module.exports = {
    createLaporanElevatorHandler,
    getAllLaporanElevatorHandler,
    getLaporanElevatorByIdHandler,
    updateLaporanElevatorByIdHandler,
    deleteLaporanElevatorByIdHandler,
    downloadLaporanElevatorHandler,
};