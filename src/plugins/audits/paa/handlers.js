'use strict';

const Boom = require('@hapi/boom');
const { forkliftServices } = require('./services');
const { createLaporanForklift: generateLaporanDoc } = require('../../../services/documentGenerator/paa/forklift/laporan/generator');
const { createBapForklift: generateBapDoc } = require('../../../services/documentGenerator/paa/forklift/bap/generator');

const forkliftHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await forkliftServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan Forklift berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                return Boom.badImplementation('Gagal membuat Laporan Forklift.');
            }   
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await forkliftServices.laporan.getAll();
                return { status: 'success', data: { laporan: allLaporan } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar Laporan Forklift.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await forkliftServices.laporan.getById(request.params.id);
                if (!laporan) return Boom.notFound('Laporan Forklift tidak ditemukan.');
                return { status: 'success', data: { laporan } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil Laporan Forklift.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await forkliftServices.laporan.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, Laporan Forklift tidak ditemukan.');
                return { status: 'success', message: 'Laporan Forklift berhasil diperbarui', data: { laporan: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui Laporan Forklift.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await forkliftServices.laporan.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, Laporan Forklift tidak ditemukan.');
                return { status: 'success', message: 'Laporan Forklift berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus Laporan Forklift.');
            }
        },
        download: async (request, h) => {
            try {
                const laporanData = await forkliftServices.laporan.getById(request.params.id);
                if (!laporanData) return Boom.notFound('Gagal membuat dokumen, Laporan Forklift tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateLaporanDoc(laporanData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`);
            } catch (error) {
                return Boom.badImplementation('Gagal memproses dokumen Laporan Forklift.');
            }
        },
    },

    bap: {
        prefill: async (request, h) => {
            try {
                const { laporanId } = request.params;
                const prefilledData = await forkliftServices.bap.getDataForPrefill(laporanId);
                if (!prefilledData) {
                    return Boom.notFound('Data Laporan Forklift dengan ID tersebut tidak ditemukan.');
                }
                return h.response({ status: 'success', data: prefilledData });
            } catch (error) {
                console.error('Error in BAP prefill handler:', error);
                return Boom.badImplementation('Gagal mengambil data untuk BAP.');
            }
        },
        create: async (request, h) => {
            try {
                const newBap = await forkliftServices.bap.create(request.payload);
                return h.response({ status: 'success', message: 'BAP Forklift berhasil dibuat', data: { bap: newBap } }).code(201);
            } catch (error) {
                if(error.isBoom) return error;
                return Boom.badImplementation('Gagal membuat BAP Forklift.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allBap = await forkliftServices.bap.getAll();
                return { status: 'success', data: { bap: allBap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar BAP Forklift.');
            }
        },
        getById: async (request, h) => {
            try {
                const bap = await forkliftServices.bap.getById(request.params.id);
                if (!bap) return Boom.notFound('BAP Forklift tidak ditemukan.');
                return { status: 'success', data: { bap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil BAP Forklift.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await forkliftServices.bap.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, BAP Forklift tidak ditemukan.');
                return { status: 'success', message: 'BAP Forklift berhasil diperbarui', data: { bap: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui BAP Forklift.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await forkliftServices.bap.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, BAP Forklift tidak ditemukan.');
                return { status: 'success', message: 'BAP Forklift berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus BAP Forklift.');
            }
        },
        download: async (request, h) => {
            try {
                const bapData = await forkliftServices.bap.getById(request.params.id);
                if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP Forklift tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateBapDoc(bapData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'BAP Forklift berhasil diunduh');
            } catch (error) {
                console.error('Error in BAP download handler:', error);
                return Boom.badImplementation('Gagal memproses dokumen BAP Forklift.');
            }
        },
    }
};

module.exports = {
    forkliftHandlers,
};