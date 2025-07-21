'use strict';

const Boom = require('@hapi/boom');
const { petirListrikServices } = require('./services');
const { createLaporanPetir: generateLaporanPetirDoc } = require('../../../services/documentGenerator/petirListrik/petir/laporan/generator');

const petirHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await petirListrikServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan Instalasi Petir berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                console.error('Error in createLaporanPetirHandler:', error);
                return Boom.badImplementation('Gagal membuat Laporan Instalasi Petir.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await petirListrikServices.laporan.getAll();
                return { status: 'success', message: 'Semua Laporan Instalasi Petir berhasil didapatkan', data: { laporan: allLaporan } };
            } catch (error) {
                console.error('Error in getAllLaporanPetirHandler:', error);
                return Boom.badImplementation('Gagal mengambil daftar Laporan Instalasi Petir.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await petirListrikServices.laporan.getById(request.params.id);
                if (!laporan) {
                    return Boom.notFound('Laporan Instalasi Petir tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Instalasi Petir berhasil didapatkan', data: { laporan } };
            } catch (error) {
                console.error('Error in getLaporanPetirByIdHandler:', error);
                return Boom.badImplementation('Gagal mengambil Laporan Instalasi Petir.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await petirListrikServices.laporan.updateById(request.params.id, request.payload);
                if (!updated) {
                    return Boom.notFound('Gagal memperbarui, Laporan Instalasi Petir tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Instalasi Petir berhasil diperbarui', data: { laporan: updated } };
            } catch (error) {
                console.error('Error in updateLaporanPetirHandler:', error);
                return Boom.badImplementation('Gagal memperbarui Laporan Instalasi Petir.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await petirListrikServices.laporan.deleteById(request.params.id);
                if (!deletedId) {
                    return Boom.notFound('Gagal menghapus, Laporan Instalasi Petir tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Instalasi Petir berhasil dihapus' };
            } catch (error) {
                console.error('Error in deleteLaporanPetirHandler:', error);
                return Boom.badImplementation('Gagal menghapus Laporan Instalasi Petir.');
            }
        },
        download: async (request, h) => {
            try {
                const laporanData = await petirListrikServices.laporan.getById(request.params.id);
                if (!laporanData) {
                    return Boom.notFound('Gagal membuat dokumen, Laporan Instalasi Petir tidak ditemukan.');
                }
                
                const { docxBuffer, fileName } = await generateLaporanPetirDoc(laporanData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'Laporan Instalasi Petir berhasil diunduh');
            } catch (error) {
                console.error('Error in downloadLaporanPetirHandler:', error);
                return Boom.badImplementation('Gagal memproses dokumen Laporan Instalasi Petir.');
            }
        },
    }
};

module.exports = {
    petirHandlers,
};