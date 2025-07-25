'use strict';

const Boom = require('@hapi/boom');
const { petirServices, listrikServices } = require('./services');
const { createLaporanPetir: generateLaporanPetirDoc } = require('../../../services/documentGenerator/petirListrik/petir/laporan/generator');
const { createBapPetir: generateBapPetirDoc } = require('../../../services/documentGenerator/petirListrik/petir/bap/generator');
const { createLaporanListrik: generateLaporanListrikDoc } = require('../../../services/documentGenerator/petirListrik/listrik/laporan/generator');
const { createBapListrik: generateBapListrikDoc } = require('../../../services/documentGenerator/petirListrik/listrik/bap/generator');

const petirHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await petirServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan Instalasi Petir berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                console.error('Error in createLaporanPetirHandler:', error);
                return Boom.badImplementation('Gagal membuat Laporan Instalasi Petir.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await petirServices.laporan.getAll();
                return { status: 'success', message: 'Semua Laporan Instalasi Petir berhasil didapatkan', data: { laporan: allLaporan } };
            } catch (error) {
                console.error('Error in getAllLaporanPetirHandler:', error);
                return Boom.badImplementation('Gagal mengambil daftar Laporan Instalasi Petir.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await petirServices.laporan.getById(request.params.id);
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
                const updated = await petirServices.laporan.updateById(request.params.id, request.payload);
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
                const deletedId = await petirServices.laporan.deleteById(request.params.id);
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
                const laporanData = await petirServices.laporan.getById(request.params.id);
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
    },

    bap: {
        prefill: async (request, h) => {
            try {
                const { laporanId } = request.params;
                const prefilledData = await petirServices.bap.getDataForPrefill(laporanId);
                if (!prefilledData) {
                    return Boom.notFound('Data Laporan Instalasi Petir tidak ditemukan.');
                }
                return h.response({ status: 'success', message: 'Data BAP berhasil didapatkan', data: prefilledData });
            } catch (error) {
                console.error('Error in BAP prefill handler:', error);
                return Boom.badImplementation('Gagal mengambil data untuk BAP.');
            }
        },
        create: async (request, h) => {
            try {
                const newBap = await petirServices.bap.create(request.payload);
                return h.response({ status: 'success', message: 'BAP Instalasi Petir berhasil dibuat', data: { bap: newBap } }).code(201);
            } catch (error) {
                if(error.isBoom) return error;
                return Boom.badImplementation('Gagal membuat BAP Instalasi Petir.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allBap = await petirServices.bap.getAll();
                return { status: 'success', message: 'Semua BAP Instalasi Petir berhasil didapatkan', data: { bap: allBap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar BAP Instalasi Petir.');
            }
        },
        getById: async (request, h) => {
            try {
                const bap = await petirServices.bap.getById(request.params.id);
                if (!bap) return Boom.notFound('BAP Instalasi Petir tidak ditemukan.');
                return { status: 'success', message: 'BAP Instalasi Petir berhasil didapatkan', data: { bap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil BAP Instalasi Petir.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await petirServices.bap.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, BAP Instalasi Petir tidak ditemukan.');
                return { status: 'success', message: 'BAP Instalasi Petir berhasil diperbarui', data: { bap: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui BAP Instalasi Petir.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await petirServices.bap.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, BAP Instalasi Petir tidak ditemukan.');
                return { status: 'success', message: 'BAP Instalasi Petir berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus BAP Instalasi Petir.');
            }
        },
        download: async (request, h) => {
            try {
                const bapData = await petirServices.bap.getById(request.params.id);
                if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP Instalasi Petir tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateBapPetirDoc(bapData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'BAP Instalasi Petir berhasil diunduh');
            } catch (error) {
                console.error('Error in BAP download handler:', error);
                return Boom.badImplementation('Gagal memproses dokumen BAP Instalasi Petir.');
            }
        },
    }
};

const listrikHandlers = {
    laporan: {
        create: async (request, h) => {
            try {
                const newLaporan = await listrikServices.laporan.create(request.payload);
                return h.response({ status: 'success', message: 'Laporan Instalasi Listrik berhasil dibuat', data: { laporan: newLaporan } }).code(201);
            } catch (error) {
                console.error('Error in createLaporanListrikHandler:', error);
                return Boom.badImplementation('Gagal membuat Laporan Instalasi Listrik.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allLaporan = await listrikServices.laporan.getAll();
                return { status: 'success', message: 'Semua Laporan Instalasi Listrik berhasil didapatkan', data: { laporan: allLaporan } };
            } catch (error) {
                console.error('Error in getAllLaporanListrikHandler:', error);
                return Boom.badImplementation('Gagal mengambil daftar Laporan Instalasi Listrik.');
            }
        },
        getById: async (request, h) => {
            try {
                const laporan = await listrikServices.laporan.getById(request.params.id);
                if (!laporan) {
                    return Boom.notFound('Laporan Instalasi Listrik tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Instalasi Listrik berhasil didapatkan', data: { laporan } };
            } catch (error) {
                console.error('Error in getLaporanListrikByIdHandler:', error);
                return Boom.badImplementation('Gagal mengambil Laporan Instalasi Listrik.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await listrikServices.laporan.updateById(request.params.id, request.payload);
                if (!updated) {
                    return Boom.notFound('Gagal memperbarui, Laporan Instalasi Listrik tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Instalasi Listrik berhasil diperbarui', data: { laporan: updated } };
            } catch (error) {
                console.error('Error in updateLaporanListrikHandler:', error);
                return Boom.badImplementation('Gagal memperbarui Laporan Instalasi Listrik.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await listrikServices.laporan.deleteById(request.params.id);
                if (!deletedId) {
                    return Boom.notFound('Gagal menghapus, Laporan Instalasi Listrik tidak ditemukan.');
                }
                return { status: 'success', message: 'Laporan Instalasi Listrik berhasil dihapus' };
            } catch (error) {
                console.error('Error in deleteLaporanListrikHandler:', error);
                return Boom.badImplementation('Gagal menghapus Laporan Instalasi Listrik.');
            }
        },
        download: async (request, h) => {
            try {
                const laporanData = await listrikServices.laporan.getById(request.params.id);
                if (!laporanData) {
                    return Boom.notFound('Gagal membuat dokumen, Laporan Instalasi Listrik tidak ditemukan.');
                }
                
                const { docxBuffer, fileName } = await generateLaporanListrikDoc(laporanData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'Laporan Instalasi Listrik berhasil diunduh');
            } catch (error) {
                console.error('Error in downloadLaporanListrikHandler:', error);
                return Boom.badImplementation('Gagal memproses dokumen Laporan Instalasi Listrik.');
            }
        },
    },

    bap: {
        prefill: async (request, h) => {
            try {
                const { laporanId } = request.params;
                const prefilledData = await listrikServices.bap.getDataForPrefill(laporanId);
                if (!prefilledData) {
                    return Boom.notFound('Data Laporan Instalasi Listrik tidak ditemukan.');
                }
                return h.response({ status: 'success', message: 'Data BAP berhasil didapatkan', data: prefilledData });
            } catch (error) {
                console.error('Error in BAP prefill handler:', error);
                return Boom.badImplementation('Gagal mengambil data untuk BAP.');
            }
        },
        create: async (request, h) => {
            try {
                const newBap = await listrikServices.bap.create(request.payload);
                return h.response({ status: 'success', message: 'BAP Instalasi Listrik berhasil dibuat', data: { bap: newBap } }).code(201);
            } catch (error) {
                if(error.isBoom) return error;
                return Boom.badImplementation('Gagal membuat BAP Instalasi Listrik.');
            }
        },
        getAll: async (request, h) => {
            try {
                const allBap = await listrikServices.bap.getAll();
                return { status: 'success', message: 'Semua BAP Instalasi Listrik berhasil didapatkan', data: { bap: allBap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil daftar BAP Instalasi Listrik.');
            }
        },
        getById: async (request, h) => {
            try {
                const bap = await listrikServices.bap.getById(request.params.id);
                if (!bap) return Boom.notFound('BAP Instalasi Listrik tidak ditemukan.');
                return { status: 'success', message: 'BAP Instalasi Listrik berhasil didapatkan', data: { bap } };
            } catch (error) {
                return Boom.badImplementation('Gagal mengambil BAP Instalasi Listrik.');
            }
        },
        update: async (request, h) => {
            try {
                const updated = await listrikServices.bap.updateById(request.params.id, request.payload);
                if (!updated) return Boom.notFound('Gagal memperbarui, BAP Instalasi Listrik tidak ditemukan.');
                return { status: 'success', message: 'BAP Instalasi Listrik berhasil diperbarui', data: { bap: updated } };
            } catch (error) {
                return Boom.badImplementation('Gagal memperbarui BAP Instalasi Listrik.');
            }
        },
        delete: async (request, h) => {
            try {
                const deletedId = await listrikServices.bap.deleteById(request.params.id);
                if (!deletedId) return Boom.notFound('Gagal menghapus, BAP Instalasi Listrik tidak ditemukan.');
                return { status: 'success', message: 'BAP Instalasi Listrik berhasil dihapus' };
            } catch (error) {
                return Boom.badImplementation('Gagal menghapus BAP Instalasi Listrik.');
            }
        },
        download: async (request, h) => {
            try {
                const bapData = await listrikServices.bap.getById(request.params.id);
                if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP Instalasi Listrik tidak ditemukan.');
                
                const { docxBuffer, fileName } = await generateBapListrikDoc(bapData);

                return h.response(docxBuffer)
                    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    .header('Content-Disposition', `attachment; filename="${fileName}"`)
                    .header('message', 'BAP Instalasi Listrik berhasil diunduh');
            } catch (error) {
                console.error('Error in BAP download handler:', error);
                return Boom.badImplementation('Gagal memproses dokumen BAP Instalasi Listrik.');
            }
        },
    }
};


module.exports = {
    petirHandlers,
    listrikHandlers
};