'use strict';

const Boom = require('@hapi/boom');
const { elevatorServices } = require('./services');
const { createLaporanElevator: generateDoc } = require('../../../services/documentGenerator/elevatorEskalator/elevator/laporan/generator');
const { createBapElevator: generateBapDoc } = require('../../../services/documentGenerator/elevatorEskalator/elevator/bap/generator')

const elevatorHandlers = {
  /**
   * HANDLER UNTUK LAPORAN ELEVATOR
   */
  Laporan: {
    create: async (request, h) => {
      try {
        const newLaporan = await elevatorServices.Laporan.create(request.payload);
        return h.response({ status: 'success', message: 'Laporan elevator berhasil dibuat', data: { Laporan: newLaporan } }).code(201);
      } catch (error) {
        console.error('Error in createLaporanElevatorHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat menyimpan Laporan.');
      }
    },

    getAll: async (request, h) => {
      try {
        const allLaporan = await elevatorServices.Laporan.getAll();
        return { status: 'success', data: { Laporan: allLaporan } };
      } catch (error) {
        console.error('Error in getAllLaporanElevatorHandler:', error);
        if (error.code === 9) {
          return Boom.badImplementation('Gagal mengambil data. Pastikan index Firestore sudah dibuat. Periksa log server untuk link pembuatan index.');
        }
        return Boom.badImplementation('Terjadi kesalahan pada server saat mengambil daftar laporan.');
      }
    },

    getById: async (request, h) => {
      try {
        const { id } = request.params;
        const Laporan = await elevatorServices.Laporan.getById(id);
        if (!Laporan) {
          return Boom.notFound('Laporan elevator dengan ID tersebut tidak ditemukan.');
        }
        return { status: 'success', data: { Laporan } };
      } catch (error) {
        console.error('Error in getLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat mengambil laporan.');
      }
    },

    update: async (request, h) => {
      try {
        const { id } = request.params;
        const updatedLaporan = await elevatorServices.Laporan.updateById(id, request.payload);
        if (!updatedLaporan) {
          return Boom.notFound('Gagal memperbarui. Laporan elevator dengan ID tersebut tidak ditemukan.');
        }
        return h.response({ status: 'success', message: 'Laporan elevator berhasil diperbarui', data: { Laporan: updatedLaporan } });
      } catch (error) {
        console.error('Error in updateLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat memperbarui laporan.');
      }
    },

    delete: async (request, h) => {
      try {
        const { id } = request.params;
        const deletedId = await elevatorServices.Laporan.deleteById(id);
        if (!deletedId) {
          return Boom.notFound('Gagal menghapus. Laporan elevator dengan ID tersebut tidak ditemukan.');
        }
        return { status: 'success', message: 'Laporan elevator berhasil dihapus' };
      } catch (error) {
        console.error('Error in deleteLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat menghapus laporan.');
      }
    },

    download: async (request, h) => {
      try {
        const { id } = request.params;
        const LaporanData = await elevatorServices.Laporan.getById(id);
        if (!LaporanData) {
          return Boom.notFound('Gagal membuat dokumen. Laporan dengan ID tersebut tidak ditemukan.');
        }
        const { docxBuffer, fileName } = await generateDoc(LaporanData);
        return h.response(docxBuffer)
          .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          .header('Content-Disposition', `attachment; filename="${fileName}"`);
      } catch (error) {
        console.error('Error in downloadLaporanElevatorHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat membuat dokumen untuk diunduh.');
      }
    },
  },

    /**
   * HANDLER UNTUK BAP ELEVATOR
   */
  bap: {
        prefill: async (request, h) => {
        try {
            const { LaporanId } = request.params;
            const prefilledData = await elevatorServices.bap.getDataForPrefill(LaporanId);
            if (!prefilledData) return Boom.notFound('Data Laporan dengan ID tersebut tidak ditemukan.');
            return h.response({ status: 'success', data: prefilledData });
        } catch (error) {
            console.error('Error in BAP prefill handler:', error);
            return Boom.badImplementation('Gagal mengambil data untuk BAP.');
        }
        },
        create: async (request, h) => {
        try {
            const newBap = await elevatorServices.bap.create(request.payload);
            return h.response({ status: 'success', message: 'BAP elevator berhasil dibuat', data: { bap: newBap } }).code(201);
        } catch (error) {
            console.error('Error in create BAP handler:', error);
            return Boom.badImplementation('Gagal menyimpan BAP elevator.');
        }
        },
        getAll: async (request, h) => {
        try {
            const allBap = await elevatorServices.bap.getAll();
            return { status: 'success', data: { bap: allBap } };
        } catch (error) {
            console.error('Error in getAll BAP handler:', error);
            return Boom.badImplementation('Gagal mengambil semua BAP elevator.');
        }
        },
        getById: async (request, h) => {
        try {
            const bap = await elevatorServices.bap.getById(request.params.id);
            if (!bap) return Boom.notFound('BAP elevator dengan ID tersebut tidak ditemukan.');
            return { status: 'success', data: { bap } };
        } catch (error) {
            console.error('Error in get BAP by ID handler:', error);
            return Boom.badImplementation('Gagal mengambil BAP elevator.');
        }
        },
        update: async (request, h) => {
        try {
            const updatedBap = await elevatorServices.bap.updateById(request.params.id, request.payload);
            if (!updatedBap) return Boom.notFound('Gagal memperbarui, BAP tidak ditemukan.');
            return { status: 'success', message: 'BAP elevator berhasil diperbarui', data: { bap: updatedBap } };
        } catch (error) {
            console.error('Error in update BAP handler:', error);
            return Boom.badImplementation('Gagal memperbarui BAP elevator.');
        }
        },
        delete: async (request, h) => {
        try {
            const deletedId = await elevatorServices.bap.deleteById(request.params.id);
            if (!deletedId) return Boom.notFound('Gagal menghapus, BAP tidak ditemukan.');
            return { status: 'success', message: 'BAP elevator berhasil dihapus' };
        } catch (error) {
            console.error('Error in delete BAP handler:', error);
            return Boom.badImplementation('Gagal menghapus BAP elevator.');
        }
        },
        download: async (request, h) => {
        try {
            const bapData = await elevatorServices.bap.getById(request.params.id);
            if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP tidak ditemukan.');
            const { docxBuffer, fileName } = await generateBapDoc(bapData);
            return h.response(docxBuffer)
            .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            .header('Content-Disposition', `attachment; filename="${fileName}"`);
        } catch (error) {
            console.error('Error in download BAP handler:', error);
            return Boom.badImplementation('Gagal membuat dokumen BAP untuk diunduh.');
        }
        },
    }
};

module.exports = {
  elevatorHandlers,
};