'use strict';

const Boom = require('@hapi/boom');
const { pubtServices } = require('./services');
const { createLaporanPubt: generateLaporanDoc } = require('../../../services/documentGenerator/pubt/laporan/generator');

const pubtHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await pubtServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan PUBT berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                console.error('Error in createLaporanPubtHandler:', error);
                return Boom.badImplementation('Gagal membuat Laporan PUBT.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await pubtServices.laporan.getAll();
                return { status: 'success', message: 'Laporan PUBT berhasil didapatkan', data: { laporan: allLaporan } };
            } catch (error) {
                console.error('Error in getAllLaporanPubtHandler:', error);
                return Boom.badImplementation('Gagal mengambil daftar Laporan PUBT.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await pubtServices.laporan.getById(request.params.id);
                if (!laporan) {
                    return Boom.notFound('Laporan PUBT tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan PUBT berhasil didapatkan', data: { laporan } };
            } catch (error) {
                console.error('Error in getLaporanPubtByIdHandler:', error);
                return Boom.badImplementation('Gagal mengambil Laporan PUBT.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await pubtServices.laporan.updateById(request.params.id, request.payload);
                if (!updated) {
                    return Boom.notFound('Gagal memperbarui, Laporan PUBT tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan PUBT berhasil diperbarui', data: { laporan: updated } };
            } catch (error) {
                console.error('Error in updateLaporanPubtHandler:', error);
                return Boom.badImplementation('Gagal memperbarui Laporan PUBT.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await pubtServices.laporan.deleteById(request.params.id);
                if (!deletedId) {
                    return Boom.notFound('Gagal menghapus, Laporan PUBT tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan PUBT berhasil dihapus' };
            } catch (error) {
                console.error('Error in deleteLaporanPubtHandler:', error);
                return Boom.badImplementation('Gagal menghapus Laporan PUBT.');
            }
        },
        download: async (request, h) => {
            try {
                const laporanData = await pubtServices.laporan.getById(request.params.id);
                if (!laporanData) {
                    return Boom.notFound('Gagal membuat dokumen, Laporan PUBT tidak ditemukan.');
                }
                
                const { docxBuffer, fileName } = await generateLaporanDoc(laporanData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'Laporan PUBT berhasil diunduh');
            } catch (error) {
                console.error('Error in downloadLaporanPubtHandler:', error);
                return Boom.badImplementation('Gagal memproses dokumen Laporan PUBT.');
            }
        },
    }
};

module.exports = {
    pubtHandlers,
};