'use strict';

const Boom = require('@hapi/boom');
const { forkliftServices, mobileCraneServices, gantryCraneServices } = require('./services');
const { createLaporanForklift: generateLaporanDoc } = require('../../../services/documentGenerator/paa/forklift/laporan/generator');
const { createBapForklift: generateBapDoc } = require('../../../services/documentGenerator/paa/forklift/bap/generator');
const { createLaporanMobileCrane: generateMobileCraneLaporanDoc } = require('../../../services/documentGenerator/paa/mobileCrane/laporan/generator')
const { createBapMobileCrane: generateMobileCraneBapDoc } = require('../../../services/documentGenerator/paa/mobileCrane/bap/generator');
const { createLaporanGantryCrane: generateGantryCraneLaporanDoc } = require('../../../services/documentGenerator/paa/gantryCrane/laporan/generator');
const { createBapGantryCrane: generateGantryCraneBapDoc } = require('../../../services/documentGenerator/paa/gantryCrane/bap/generator');

// ---FORKLIFT ---
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
                return { status: 'success', message: 'Laporan Forklift berhasil didapat', data: { laporan: allLaporan } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar Laporan Forklift.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await forkliftServices.laporan.getById(request.params.id);
                if (!laporan) return Boom.notFound('Laporan Forklift tidak ditemukan.');
                return { status: 'success', message: 'Laporan Forklift berhasil didapat', data: { laporan } };
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
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'Laporan Forklift berhasil diunduh');
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
                    return Boom.notFound('Data Laporan Forklift tidak ditemukan.');
                }
                return h.response({ status: 'success', message: 'Data BAP Forklift berhasil didapat', data: prefilledData });
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
                return { status: 'success', message: 'BAP Forklift berhasil didapat', data: { bap: allBap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar BAP Forklift.');
            }
        },

        getById: async (request, h) => {
            try {
                const bap = await forkliftServices.bap.getById(request.params.id);
                if (!bap) return Boom.notFound('BAP Forklift tidak ditemukan.');
                return { status: 'success', message: 'BAP Forklift berhasil didapat', data: { bap } };
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

// ---MOBILE CRANE ---
const mobileCraneHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await mobileCraneServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan Mobile Crane berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                console.error("Create Error:", error);
                return Boom.badImplementation('Gagal membuat Laporan Mobile Crane.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await mobileCraneServices.laporan.getAll();
                return { status: 'success', message: 'Laporan Mobile Crane berhasil didapat', data: { laporan: allLaporan } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar Laporan Mobile Crane.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await mobileCraneServices.laporan.getById(request.params.id);
                if (!laporan) return Boom.notFound('Laporan Mobile Crane tidak ditemukan.');
                return { status: 'success', message: 'Laporan Mobile Crane berhasil didapat', data: { laporan } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil Laporan Mobile Crane.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await mobileCraneServices.laporan.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, Laporan Mobile Crane tidak ditemukan.');
                return { status: 'success', message: 'Laporan Mobile Crane berhasil diperbarui', data: { laporan: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui Laporan Mobile Crane.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await mobileCraneServices.laporan.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, Laporan Mobile Crane tidak ditemukan.');
                return { status: 'success', message: 'Laporan Mobile Crane berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus Laporan Mobile Crane.');
            }
        },
        download: async (request, h) => {
            try {
                const laporanData = await mobileCraneServices.laporan.getById(request.params.id);
                if (!laporanData) return Boom.notFound('Gagal membuat dokumen, Laporan Mobile Crane tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateMobileCraneLaporanDoc(laporanData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'Laporan Mobile Crane berhasil diunduh');
            } catch (error) {
                console.error("Download Error:", error);
                return Boom.badImplementation('Gagal memproses dokumen Laporan Mobile Crane.');
            }
        },
    },

    bap: {
        prefill: async (request, h) => {
            try {
                const { laporanId } = request.params;
                const prefilledData = await mobileCraneServices.bap.getDataForPrefill(laporanId);
                if (!prefilledData) {
                    return Boom.notFound('Data Laporan Mobile Crane tidak ditemukan.');
                }
                return h.response({ status: 'success', message: 'BAP Mobile Crane berhasil dibuat', data: prefilledData });
            } catch (error) {
                console.error('Error in BAP prefill handler:', error);
                return Boom.badImplementation('Gagal mengambil data untuk BAP.');
            }
        },
        create: async (request, h) => {
            try {
                const newBap = await mobileCraneServices.bap.create(request.payload);
                return h.response({ status: 'success', message: 'BAP Mobile Crane berhasil dibuat', data: { bap: newBap } }).code(201);
            } catch (error) {
                if(error.isBoom) return error;
                return Boom.badImplementation('Gagal membuat BAP Mobile Crane.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allBap = await mobileCraneServices.bap.getAll();
                return { status: 'success', message: 'BAP Mobile Crane berhasil didapatkan ', data: { bap: allBap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar BAP Mobile Crane.');
            }
        },
        getById: async (request, h) => {
            try {
                const bap = await mobileCraneServices.bap.getById(request.params.id);
                if (!bap) return Boom.notFound('BAP Mobile Crane tidak ditemukan.');
                return { status: 'success', message: 'BAP Mobile Crane berhasil didapatkan ', data: { bap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil BAP Mobile Crane.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await mobileCraneServices.bap.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, BAP Mobile Crane tidak ditemukan.');
                return { status: 'success', message: 'BAP Mobile Crane berhasil diperbarui', data: { bap: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui BAP Mobile Crane.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await mobileCraneServices.bap.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, BAP Mobile Crane tidak ditemukan.');
                return { status: 'success', message: 'BAP Mobile Crane berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus BAP Mobile Crane.');
            }
        },
        download: async (request, h) => {
            try {
                const bapData = await mobileCraneServices.bap.getById(request.params.id);
                if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP Mobile Crane tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateMobileCraneBapDoc(bapData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'BAP Mobile Crane berhasil diunduh');
            } catch (error) {
                console.error('Error in BAP download handler:', error);
                return Boom.badImplementation('Gagal memproses dokumen BAP Mobile Crane.');
            }
        },
    }
};

// -- gantry crane
const gantryCraneHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await gantryCraneServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan Gantry Crane berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                console.error("Create Gantry Crane Laporan Error:", error);
                return Boom.badImplementation('Gagal membuat Laporan Gantry Crane.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await gantryCraneServices.laporan.getAll();
                return { status: 'success', message: 'Laporan Gantry Crane berhasil didapat', data: { laporan: allLaporan } };
            } catch (error) {
                console.error("Get All Gantry Crane Laporan Error:", error);
                return Boom.badImplementation('Gagal mengambil daftar Laporan Gantry Crane.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await gantryCraneServices.laporan.getById(request.params.id);
                if (!laporan) return Boom.notFound('Laporan Gantry Crane tidak ditemukan.');
                return { status: 'success', message: 'Laporan Gantry Crane berhasil didapat', data: { laporan } };
            } catch (error) {
                console.error("Get Gantry Crane Laporan By ID Error:", error);
                return Boom.badImplementation('Gagal mengambil Laporan Gantry Crane.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await gantryCraneServices.laporan.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, Laporan Gantry Crane tidak ditemukan.');
                return { status: 'success', message: 'Laporan Gantry Crane berhasil diperbarui', data: { laporan: updated } };
            } catch (error) {
                console.error("Update Gantry Crane Laporan Error:", error);
                return Boom.badImplementation('Gagal memperbarui Laporan Gantry Crane.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await gantryCraneServices.laporan.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, Laporan Gantry Crane tidak ditemukan.');
                return { status: 'success', message: 'Laporan Gantry Crane berhasil dihapus' };
            } catch (error) {
                console.error("Delete Gantry Crane Laporan Error:", error);
                return Boom.badImplementation('Gagal menghapus Laporan Gantry Crane.');
            }
        },
        download: async (request, h) => {
            try {
                const laporanData = await gantryCraneServices.laporan.getById(request.params.id);
                if (!laporanData) return Boom.notFound('Gagal membuat dokumen, Laporan Gantry Crane tidak ditemukan.');
                const { docxBuffer, fileName } = await generateGantryCraneLaporanDoc(laporanData);
                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'Laporan Gantry Crane berhasil diunduh');
            } catch (error) {
                console.error("Download Gantry Crane Laporan Error:", error);
                return Boom.badImplementation('Gagal memproses dokumen Laporan Gantry Crane.');
            }
        },
    },
    bap: {
        prefill: async (request, h) => {
            try {
                const { laporanId } = request.params;
                const prefilledData = await gantryCraneServices.bap.getDataForPrefill(laporanId);
                if (!prefilledData) return Boom.notFound('Data Laporan Gantry Crane tidak ditemukan.');
                return h.response({ status: 'success', message: 'Data BAP Gantry Crane berhasil didapat', data: prefilledData });
            } catch (error) {
                console.error('Error in Gantry Crane BAP prefill handler:', error);
                return Boom.badImplementation('Gagal mengambil data untuk BAP Gantry Crane.');
            }
        },
        create: async (request, h) => {
            try {
                const newBap = await gantryCraneServices.bap.create(request.payload);
                return h.response({ status: 'success', message: 'BAP Gantry Crane berhasil dibuat', data: { bap: newBap } }).code(201);
            } catch (error) {
                console.error("Create Gantry Crane BAP Error:", error);
                if (error.isBoom) return error;
                return Boom.badImplementation('Gagal membuat BAP Gantry Crane.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allBap = await gantryCraneServices.bap.getAll();
                return { status: 'success', message: 'BAP Gantry Crane berhasil didapat', data: { bap: allBap } };
            } catch (error) {
                console.error("Get All Gantry Crane BAP Error:", error);
                return Boom.badImplementation('Gagal mengambil daftar BAP Gantry Crane.');
            }
        },
        getById: async (request, h) => {
            try {
                const bap = await gantryCraneServices.bap.getById(request.params.id);
                if (!bap) return Boom.notFound('BAP Gantry Crane tidak ditemukan.');
                return { status: 'success', message: 'BAP Gantry Crane berhasil didapat', data: { bap } };
            } catch (error) {
                console.error("Get Gantry Crane BAP By ID Error:", error);
                return Boom.badImplementation('Gagal mengambil BAP Gantry Crane.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await gantryCraneServices.bap.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, BAP Gantry Crane tidak ditemukan.');
                return { status: 'success', message: 'BAP Gantry Crane berhasil diperbarui', data: { bap: updated } };
            } catch (error) {
                console.error("Update Gantry Crane BAP Error:", error);
                return Boom.badImplementation('Gagal memperbarui BAP Gantry Crane.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await gantryCraneServices.bap.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, BAP Gantry Crane tidak ditemukan.');
                return { status: 'success', message: 'BAP Gantry Crane berhasil dihapus' };
            } catch (error) {
                console.error("Delete Gantry Crane BAP Error:", error);
                return Boom.badImplementation('Gagal menghapus BAP Gantry Crane.');
            }
        },
        download: async (request, h) => {
            try {
                const bapData = await gantryCraneServices.bap.getById(request.params.id);
                if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP Gantry Crane tidak ditemukan.');
                const { docxBuffer, fileName } = await generateGantryCraneBapDoc(bapData);
                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'BAP Gantry Crane berhasil diunduh');
            } catch (error) {
                console.error('Error in Gantry Crane BAP download handler:', error);
                return Boom.badImplementation('Gagal memproses dokumen BAP Gantry Crane.');
            }
        },
    }
};


module.exports = {
    forkliftHandlers,
    mobileCraneHandlers,
    gantryCraneHandlers
};