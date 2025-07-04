'use strict';

const Boom = require('@hapi/boom');
const { elevatorServices } = require('./services');
const { createLaporanElevator: generateDoc } = require('../../../services/documentGenerator/elevatorEskalator/elevator/laporan/generator');

const elevatorHandlers = {
  /**
   * =================================
   * HANDLER UNTUK LAPORAN ELEVATOR
   * =================================
   */
  laporan: {
    create: async (request, h) => {
      try {
        const newLaporan = await elevatorServices.laporan.create(request.payload);
        return h.response({ status: 'success', message: 'Laporan elevator berhasil dibuat', data: { laporan: newLaporan } }).code(201);
      } catch (error) {
        console.error('Error in createLaporanElevatorHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat menyimpan laporan.');
      }
    },

    getAll: async (request, h) => {
      try {
        const allLaporan = await elevatorServices.laporan.getAll();
        return { status: 'success', data: { laporan: allLaporan } };
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
        const laporan = await elevatorServices.laporan.getById(id);
        if (!laporan) {
          return Boom.notFound('Laporan elevator dengan ID tersebut tidak ditemukan.');
        }
        return { status: 'success', data: { laporan } };
      } catch (error) {
        console.error('Error in getLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat mengambil laporan.');
      }
    },

    update: async (request, h) => {
      try {
        const { id } = request.params;
        const updatedLaporan = await elevatorServices.laporan.updateById(id, request.payload);
        if (!updatedLaporan) {
          return Boom.notFound('Gagal memperbarui. Laporan elevator dengan ID tersebut tidak ditemukan.');
        }
        return h.response({ status: 'success', message: 'Laporan elevator berhasil diperbarui', data: { laporan: updatedLaporan } });
      } catch (error) {
        console.error('Error in updateLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat memperbarui laporan.');
      }
    },

    delete: async (request, h) => {
      try {
        const { id } = request.params;
        const deletedId = await elevatorServices.laporan.deleteById(id);
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
        const laporanData = await elevatorServices.laporan.getById(id);
        if (!laporanData) {
          return Boom.notFound('Gagal membuat dokumen. Laporan dengan ID tersebut tidak ditemukan.');
        }
        const { docxBuffer, fileName } = await generateDoc(laporanData);
        return h.response(docxBuffer)
          .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          .header('Content-Disposition', `attachment; filename="${fileName}"`);
      } catch (error) {
        console.error('Error in downloadLaporanElevatorHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat membuat dokumen untuk diunduh.');
      }
    },
  },
};

module.exports = {
  elevatorHandlers,
};