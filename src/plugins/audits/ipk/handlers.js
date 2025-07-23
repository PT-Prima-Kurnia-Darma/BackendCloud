'use strict';

const Boom = require('@hapi/boom');
const { proteksiKebakaranServices } = require('./services');
const { createLaporanProteksiKebakaran: generateLaporanDoc } = require('../../../services/documentGenerator/ipk/laporan/generator');

const proteksiKebakaranHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await proteksiKebakaranServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan Instalasi Proteksi Kebakaran berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                console.error('Error in createLaporanProteksiKebakaranHandler:', error);
                return Boom.badImplementation('Gagal membuat Laporan Instalasi Proteksi Kebakaran.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await proteksiKebakaranServices.laporan.getAll();
                return { status: 'success', message: 'Laporan Instalasi Proteksi Kebakaran berhasil didapatkan', data: { laporan: allLaporan } };
            } catch (error) {
                console.error('Error in getAllLaporanProteksiKebakaranHandler:', error);
                return Boom.badImplementation('Gagal mengambil daftar Laporan Instalasi Proteksi Kebakaran.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await proteksiKebakaranServices.laporan.getById(request.params.id);
                if (!laporan) {
                    return Boom.notFound('Laporan Instalasi Proteksi Kebakaran tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Instalasi Proteksi Kebakaran berhasil didapatkan', data: { laporan } };
            } catch (error) {
                console.error('Error in getLaporanProteksiKebakaranByIdHandler:', error);
                return Boom.badImplementation('Gagal mengambil Laporan Instalasi Proteksi Kebakaran.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await proteksiKebakaranServices.laporan.updateById(request.params.id, request.payload);
                if (!updated) {
                    return Boom.notFound('Gagal memperbarui, Laporan Instalasi Proteksi Kebakaran tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Instalasi Proteksi Kebakaran berhasil diperbarui', data: { laporan: updated } };
            } catch (error) {
                console.error('Error in updateLaporanProteksiKebakaranHandler:', error);
                return Boom.badImplementation('Gagal memperbarui Laporan Instalasi Proteksi Kebakaran.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await proteksiKebakaranServices.laporan.deleteById(request.params.id);
                if (!deletedId) {
                    return Boom.notFound('Gagal menghapus, Laporan Instalasi Proteksi Kebakaran tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Instalasi Proteksi Kebakaran berhasil dihapus' };
            } catch (error) {
                console.error('Error in deleteLaporanProteksiKebakaranHandler:', error);
                return Boom.badImplementation('Gagal menghapus Laporan Instalasi Proteksi Kebakaran.');
            }
        },
        download: async (request, h) => {
            try {
                const laporanData = await proteksiKebakaranServices.laporan.getById(request.params.id);
                if (!laporanData) {
                    return Boom.notFound('Gagal membuat dokumen, Laporan Instalasi Proteksi Kebakaran tidak ditemukan.');
                }
                
                const { docxBuffer, fileName } = await generateLaporanDoc(laporanData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'Laporan Instalasi Proteksi Kebakaran berhasil diunduh');
            } catch (error) {
                console.error('Error in downloadLaporanProteksiKebakaranHandler:', error);
                return Boom.badImplementation('Gagal memproses dokumen Laporan Instalasi Proteksi Kebakaran.');
            }
        },
    }
};

module.exports = {
    proteksiKebakaranHandlers,
};