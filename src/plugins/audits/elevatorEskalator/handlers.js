'use strict';

const Boom = require('@hapi/boom');
const elevatorService = require('./services');
const { createLaporanElevator: generateDoc } = require('../../../services/documentGenerator/elevatorEskalator/elevator/laporan/generator');

// ... (semua handler lain dari 'create' hingga 'delete' tetap sama)

const createLaporanElevatorHandler = async (request, h) => {
    try {
        const laporanId = await elevatorService.createLaporanElevator(request.payload);
        return h.response({
            status: 'success',
            message: 'Laporan elevator berhasil dibuat',
            data: { laporanId },
        }).code(201);
    } catch (error) {
        console.error('Error in createLaporanElevatorHandler:', error);
        return Boom.badImplementation('Gagal membuat laporan elevator');
    }
};

const getAllLaporanElevatorHandler = async (request, h) => {
    try {
        const allLaporan = await elevatorService.getAllLaporanElevator();
        return { status: 'success', data: { laporan: allLaporan } };
    } catch (error) {
        console.error('Error in getAllLaporanElevatorHandler:', error);
        return Boom.badImplementation('Gagal mengambil semua laporan elevator');
    }
};

const getLaporanElevatorByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const laporan = await elevatorService.getLaporanElevatorById(id);
        if (!laporan) {
            return Boom.notFound('Laporan elevator tidak ditemukan');
        }
        return { status: 'success', data: { laporan } };
    } catch (error) {
        console.error('Error in getLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Gagal mengambil laporan elevator by ID');
    }
};

const updateLaporanElevatorByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const updatedId = await elevatorService.updateLaporanElevatorById(id, request.payload);
        if (!updatedId) {
            return Boom.notFound('Gagal memperbarui. Laporan elevator tidak ditemukan.');
        }
        return { status: 'success', message: 'Laporan elevator berhasil diperbarui' };
    } catch (error) {
        console.error('Error in updateLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Gagal memperbarui laporan elevator');
    }
};

const deleteLaporanElevatorByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const deletedId = await elevatorService.deleteLaporanElevatorById(id);
        if (!deletedId) {
            return Boom.notFound('Gagal menghapus. Laporan elevator tidak ditemukan.');
        }
        return { status: 'success', message: 'Laporan elevator berhasil dihapus' };
    } catch (error) {
        console.error('Error in deleteLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Gagal menghapus laporan elevator');
    }
};


// --- PERUBAHAN UTAMA ADA DI SINI ---
const downloadLaporanElevatorHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const laporanData = await elevatorService.getLaporanElevatorById(id);
        if (!laporanData) {
            return Boom.notFound('Data laporan elevator tidak ditemukan untuk ID ini');
        }

        laporanData.id = id;
        const { docxBuffer, fileName } = await generateDoc(laporanData);

        return h.response(docxBuffer)
            .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            // Menambahkan tanda kutip (") di sekitar nama file
            .header('Content-Disposition', `attachment; filename="${fileName}"`);

    } catch (error) {
        console.error('Error in downloadLaporanElevatorHandler:', error);
        return Boom.badImplementation('Gagal membuat dokumen untuk diunduh');
    }
};
// --- BATAS AKHIR PERUBAHAN ---


module.exports = {
    createLaporanElevatorHandler,
    getAllLaporanElevatorHandler,
    getLaporanElevatorByIdHandler,
    updateLaporanElevatorByIdHandler,
    deleteLaporanElevatorByIdHandler,
    downloadLaporanElevatorHandler,
};