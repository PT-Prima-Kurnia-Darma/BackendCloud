'use strict';

const Boom = require('@hapi/boom');
const { motorDieselServices } = require('./services');
const { createLaporanPtpDiesel: generateLaporanDoc } = require('../../../services/documentGenerator/ptp/laporan/generator');

const motorDieselHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await motorDieselServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan Motor Diesel berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                console.error('Error in createLaporanPtpDieselHandler:', error);
                return Boom.badImplementation('Gagal membuat Laporan Motor Diesel.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await motorDieselServices.laporan.getAll();
                return { status: 'success', message: 'Laporan Motor Diesel berhasil didapatkan', data: { laporan: allLaporan } };
            } catch (error) {
                console.error('Error in getAllLaporanPtpDieselHandler:', error);
                return Boom.badImplementation('Gagal mengambil daftar Laporan Motor Diesel.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await motorDieselServices.laporan.getById(request.params.id);
                if (!laporan) {
                    return Boom.notFound('Laporan Motor Diesel tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Motor Diesel berhasil didapatkan', data: { laporan } };
            } catch (error) {
                console.error('Error in getLaporanPtpDieselByIdHandler:', error);
                return Boom.badImplementation('Gagal mengambil Laporan Motor Diesel.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await motorDieselServices.laporan.updateById(request.params.id, request.payload);
                if (!updated) {
                    return Boom.notFound('Gagal memperbarui, Laporan Motor Diesel tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Motor Diesel berhasil diperbarui', data: { laporan: updated } };
            } catch (error) {
                console.error('Error in updateLaporanPtpDieselHandler:', error);
                return Boom.badImplementation('Gagal memperbarui Laporan Motor Diesel.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await motorDieselServices.laporan.deleteById(request.params.id);
                if (!deletedId) {
                    return Boom.notFound('Gagal menghapus, Laporan Motor Diesel tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Motor Diesel berhasil dihapus' };
            } catch (error) {
                console.error('Error in deleteLaporanPtpDieselHandler:', error);
                return Boom.badImplementation('Gagal menghapus Laporan Motor Diesel.');
            }
        },
        download: async (request, h) => {
            try {
                const laporanData = await motorDieselServices.laporan.getById(request.params.id);
                if (!laporanData) {
                    return Boom.notFound('Gagal membuat dokumen, Laporan Motor Diesel tidak ditemukan.');
                }
                
                const { docxBuffer, fileName } = await generateLaporanDoc(laporanData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'Laporan Motor Diesel berhasil diunduh');
            } catch (error) {
                console.error('Error in downloadLaporanPtpDieselHandler:', error);
                return Boom.badImplementation('Gagal memproses dokumen Laporan Motor Diesel.');
            }
        },
    }
};

module.exports = {
    motorDieselHandlers,
};