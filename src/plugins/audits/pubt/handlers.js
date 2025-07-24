'use strict';

const Boom = require('@hapi/boom');
const { pubtServices } = require('./services');
const { createLaporanPubt: generateLaporanDoc } = require('../../../services/documentGenerator/pubt/laporan/generator');
const { createBapPubt: generateBapDoc } = require('../../../services/documentGenerator/pubt/bap/generator');

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
    },

    bap: {
        prefill: async (request, h) => {
            try {
                const { laporanId } = request.params;
                const prefilledData = await pubtServices.bap.getDataForPrefill(laporanId);
                if (!prefilledData) {
                    return Boom.notFound('Data Laporan asal tidak ditemukan untuk prefill BAP.');
                }
                return h.response({ status: 'success', message: 'Data untuk BAP berhasil disiapkan', data: prefilledData });
            } catch (error) {
                console.error('Error in BAP prefill handler:', error);
                return Boom.badImplementation('Gagal mengambil data untuk BAP.');
            }
        },
        create: async (request, h) => {
            try {
                const newBap = await pubtServices.bap.create(request.payload);
                return h.response({ status: 'success', message: 'BAP PUBT berhasil dibuat', data: { bap: newBap } }).code(201);
            } catch (error) {
                if(error.isBoom) return error;
                console.error('Error creating BAP:', error);
                return Boom.badImplementation('Gagal membuat BAP PUBT.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allBap = await pubtServices.bap.getAll();
                return { status: 'success', message: 'Semua BAP PUBT berhasil didapatkan', data: { bap: allBap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar BAP PUBT.');
            }
        },
        getById: async (request, h) => {
            try {
                const bap = await pubtServices.bap.getById(request.params.id);
                if (!bap) return Boom.notFound('BAP PUBT tidak ditemukan.');
                return { status: 'success', message: 'BAP PUBT berhasil didapatkan', data: { bap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil BAP PUBT.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await pubtServices.bap.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, BAP PUBT tidak ditemukan.');
                return { status: 'success', message: 'BAP PUBT berhasil diperbarui', data: { bap: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui BAP PUBT.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await pubtServices.bap.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, BAP PUBT tidak ditemukan.');
                return { status: 'success', message: 'BAP PUBT berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus BAP PUBT.');
            }
        },
        download: async (request, h) => {
            try {
                const bapData = await pubtServices.bap.getById(request.params.id);
                if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP PUBT tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateBapDoc(bapData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'BAP PUBT berhasil diunduh');
            } catch (error) {
                console.error('Error in BAP download handler:', error);
                return Boom.badImplementation('Gagal memproses dokumen BAP PUBT.');
            }
        },
    }
};

module.exports = {
    pubtHandlers,
};