'use strict';

const Boom = require('@hapi/boom');
const { proteksiKebakaranServices } = require('./services');
const { createLaporanProteksiKebakaran: generateLaporanDoc } = require('../../../services/documentGenerator/ipk/laporan/generator');
const { createBapProteksiKebakaran: generateBapDoc } = require('../../../services/documentGenerator/ipk/bap/generator');

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
    },

    bap: {
        prefill: async (request, h) => {
            try {
                const { laporanId } = request.params;
                const prefilledData = await proteksiKebakaranServices.bap.getDataForPrefill(laporanId);
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
                const newBap = await proteksiKebakaranServices.bap.create(request.payload);
                return h.response({ status: 'success', message: 'BAP Proteksi Kebakaran berhasil dibuat', data: { bap: newBap } }).code(201);
            } catch (error) {
                if(error.isBoom) return error;
                console.error('Error creating BAP:', error);
                return Boom.badImplementation('Gagal membuat BAP Proteksi Kebakaran.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allBap = await proteksiKebakaranServices.bap.getAll();
                return { status: 'success', message: 'Semua BAP Proteksi Kebakaran berhasil didapatkan', data: { bap: allBap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar BAP Proteksi Kebakaran.');
            }
        },
        getById: async (request, h) => {
            try {
                const bap = await proteksiKebakaranServices.bap.getById(request.params.id);
                if (!bap) return Boom.notFound('BAP Proteksi Kebakaran tidak ditemukan.');
                return { status: 'success', message: 'BAP Proteksi Kebakaran berhasil didapatkan', data: { bap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil BAP Proteksi Kebakaran.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await proteksiKebakaranServices.bap.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, BAP Proteksi Kebakaran tidak ditemukan.');
                return { status: 'success', message: 'BAP Proteksi Kebakaran berhasil diperbarui', data: { bap: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui BAP Proteksi Kebakaran.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await proteksiKebakaranServices.bap.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, BAP Proteksi Kebakaran tidak ditemukan.');
                return { status: 'success', message: 'BAP Proteksi Kebakaran berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus BAP Proteksi Kebakaran.');
            }
        },
        download: async (request, h) => {
            try {
                const bapData = await proteksiKebakaranServices.bap.getById(request.params.id);
                if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP Proteksi Kebakaran tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateBapDoc(bapData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'BAP Proteksi Kebakaran berhasil diunduh');
            } catch (error) {
                console.error('Error in BAP download handler:', error);
                return Boom.badImplementation('Gagal memproses dokumen BAP Proteksi Kebakaran.');
            }
        },
    }
};

module.exports = {
    proteksiKebakaranHandlers,
};