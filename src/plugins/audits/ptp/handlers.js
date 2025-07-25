'use strict';

const Boom = require('@hapi/boom');
const { motorDieselServices, mesinServices } = require('./services');
const { createLaporanPtpDiesel: generateLaporanMotorDieselDoc } = require('../../../services/documentGenerator/ptp/motorDiesel/laporan/generator');
const { createBapPtpDiesel: generateBapMotorDieselDoc } = require('../../../services/documentGenerator/ptp/motorDiesel/bap/generator');
const { createLaporanPtpMesin: generateLaporanMesinDoc } = require('../../../services/documentGenerator/ptp/mesin/laporan/generator');
const { createBapPtpMesin: generateBapMesinDoc } = require('../../../services/documentGenerator/ptp/mesin/bap/generator');


const motorDieselHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await motorDieselServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan Motor Diesel berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                console.error('Error creating Laporan:', error);
                return Boom.badImplementation('Gagal membuat Laporan Motor Diesel.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await motorDieselServices.laporan.getAll();
                return { status: 'success', message: 'Laporan Motor Diesel berhasil didapatkan', data: { laporan: allLaporan } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar Laporan Motor Diesel.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await motorDieselServices.laporan.getById(request.params.id);
                if (!laporan) return Boom.notFound('Laporan Motor Diesel tidak ditemukan.');
                return { status: 'success', message: 'Laporan Motor Diesel berhasil didapatkan', data: { laporan } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil Laporan Motor Diesel.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await motorDieselServices.laporan.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, Laporan Motor Diesel tidak ditemukan.');
                return { status: 'success', message: 'Laporan Motor Diesel berhasil diperbarui', data: { laporan: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui Laporan Motor Diesel.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await motorDieselServices.laporan.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, Laporan Motor Diesel tidak ditemukan.');
                return { status: 'success', message: 'Laporan Motor Diesel berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus Laporan Motor Diesel.');
            }
        },
        download: async (request, h) => {
            try {
                const laporanData = await motorDieselServices.laporan.getById(request.params.id);
                if (!laporanData) return Boom.notFound('Gagal membuat dokumen, Laporan Motor Diesel tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateLaporanMotorDieselDoc(laporanData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'Laporan Motor Diesel berhasil diunduh');
            } catch (error) {
                return Boom.badImplementation('Gagal memproses dokumen Laporan Motor Diesel.');
            }
        },
    },

    bap: {
        prefill: async (request, h) => {
            try {
                const { laporanId } = request.params;
                const prefilledData = await motorDieselServices.bap.getDataForPrefill(laporanId);
                if (!prefilledData) {
                    return Boom.notFound('Data Laporan asal tidak ditemukan untuk prefill BAP.');
                }
                return h.response({ status: 'success', message: 'Data untuk BAP berhasil disiapkan', data: prefilledData });
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil data untuk BAP.');
            }
        },
        create: async (request, h) => {
            try {
                const newBap = await motorDieselServices.bap.create(request.payload);
                return h.response({ status: 'success', message: 'BAP Motor Diesel berhasil dibuat', data: { bap: newBap } }).code(201);
            } catch (error) {
                if(error.isBoom) return error;
                return Boom.badImplementation('Gagal membuat BAP Motor Diesel.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allBap = await motorDieselServices.bap.getAll();
                return { status: 'success', message: 'Semua BAP Motor Diesel berhasil didapatkan', data: { bap: allBap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar BAP Motor Diesel.');
            }
        },
        getById: async (request, h) => {
            try {
                const bap = await motorDieselServices.bap.getById(request.params.id);
                if (!bap) return Boom.notFound('BAP Motor Diesel tidak ditemukan.');
                return { status: 'success', message: 'BAP Motor Diesel berhasil didapatkan', data: { bap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil BAP Motor Diesel.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await motorDieselServices.bap.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, BAP Motor Diesel tidak ditemukan.');
                return { status: 'success', message: 'BAP Motor Diesel berhasil diperbarui', data: { bap: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui BAP Motor Diesel.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await motorDieselServices.bap.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, BAP Motor Diesel tidak ditemukan.');
                return { status: 'success', message: 'BAP Motor Diesel berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus BAP Motor Diesel.');
            }
        },
        download: async (request, h) => {
            try {
                const bapData = await motorDieselServices.bap.getById(request.params.id);
                if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP Motor Diesel tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateBapMotorDieselDoc(bapData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'BAP Motor Diesel berhasil diunduh');
            } catch (error) {
                return Boom.badImplementation('Gagal memproses dokumen BAP Motor Diesel.');
            }
        },
    }
};

const mesinHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await mesinServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan PTP Mesin berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                console.error('Error creating Laporan PTP Mesin:', error);
                return Boom.badImplementation('Gagal membuat Laporan PTP Mesin.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await mesinServices.laporan.getAll();
                return { status: 'success', message: 'Laporan PTP Mesin berhasil didapatkan', data: { laporan: allLaporan } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar Laporan PTP Mesin.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await mesinServices.laporan.getById(request.params.id);
                if (!laporan) return Boom.notFound('Laporan PTP Mesin tidak ditemukan.');
                return { status: 'success', message: 'Laporan PTP Mesin berhasil didapatkan', data: { laporan } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil Laporan PTP Mesin.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await mesinServices.laporan.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, Laporan PTP Mesin tidak ditemukan.');
                return { status: 'success', message: 'Laporan PTP Mesin berhasil diperbarui', data: { laporan: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui Laporan PTP Mesin.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await mesinServices.laporan.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, Laporan PTP Mesin tidak ditemukan.');
                return { status: 'success', message: 'Laporan PTP Mesin berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus Laporan PTP Mesin.');
            }
        },
        download: async (request, h) => {
            try {
                const laporanData = await mesinServices.laporan.getById(request.params.id);
                if (!laporanData) return Boom.notFound('Gagal membuat dokumen, Laporan PTP Mesin tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateLaporanMesinDoc(laporanData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'Laporan PTP Mesin berhasil diunduh');
            } catch (error) {
                console.error('Download error:', error);
                return Boom.badImplementation('Gagal memproses dokumen Laporan PTP Mesin.');
            }
        },
    },

    bap: {
        prefill: async (request, h) => {
            try {
                const { laporanId } = request.params;
                const prefilledData = await mesinServices.bap.getDataForPrefill(laporanId);
                if (!prefilledData) {
                    return Boom.notFound('Data Laporan PTP Mesin tidak ditemukan.');
                }
                return h.response({ status: 'success', message: 'Data BAP PTP Mesin berhasil didapat', data: prefilledData });
            } catch (error) {
                console.error('Error in BAP prefill handler:', error);
                return Boom.badImplementation('Gagal mengambil data untuk BAP PTP Mesin.');
            }
        },
        create: async (request, h) => {
            try {
                const newBap = await mesinServices.bap.create(request.payload);
                return h.response({ status: 'success', message: 'BAP PTP Mesin berhasil dibuat', data: { bap: newBap } }).code(201);
            } catch (error) {
                if(error.isBoom) return error;
                return Boom.badImplementation('Gagal membuat BAP PTP Mesin.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allBap = await mesinServices.bap.getAll();
                return { status: 'success', message: 'BAP PTP Mesin berhasil didapatkan', data: { bap: allBap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar BAP PTP Mesin.');
            }
        },
        getById: async (request, h) => {
            try {
                const bap = await mesinServices.bap.getById(request.params.id);
                if (!bap) return Boom.notFound('BAP PTP Mesin tidak ditemukan.');
                return { status: 'success', message: 'BAP PTP Mesin berhasil didapatkan', data: { bap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil BAP PTP Mesin.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await mesinServices.bap.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, BAP PTP Mesin tidak ditemukan.');
                return { status: 'success', message: 'BAP PTP Mesin berhasil diperbarui', data: { bap: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui BAP PTP Mesin.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await mesinServices.bap.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, BAP PTP Mesin tidak ditemukan.');
                return { status: 'success', message: 'BAP PTP Mesin berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus BAP PTP Mesin.');
            }
        },
        download: async (request, h) => {
            try {
                const bapData = await mesinServices.bap.getById(request.params.id);
                if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP PTP Mesin tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateBapMesinDoc(bapData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'BAP PTP Mesin berhasil diunduh');
            } catch (error) {
                return Boom.badImplementation('Gagal memproses dokumen BAP PTP Mesin.');
            }
        },
    }
};

module.exports = {
    motorDieselHandlers,
    mesinHandlers
};