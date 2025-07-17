'use strict';

const Boom = require('@hapi/boom');
const { elevatorServices, eskalatorServices } = require('./services');
const { createLaporanElevator: generateLaporanElevatorDoc } = require('../../../services/documentGenerator/elevatorEskalator/elevator/laporan/generator');
const { createBapElevator: generateBapElevatorDoc } = require('../../../services/documentGenerator/elevatorEskalator/elevator/bap/generator')
const { createLaporanEskalator: generateLaporanEskalatorDoc} = require('../../../services/documentGenerator/elevatorEskalator/eskalator/laporan/generator')
const { createBapEskalator: generateBapEskalatorDoc } = require('../../../services/documentGenerator/elevatorEskalator/eskalator/bap/generator');

const elevatorHandlers = {
  /**
   * HANDLER UNTUK LAPORAN ELEVATOR
   */
  laporan: {
    create: async (request, h) => {
      try {
        const newLaporan = await elevatorServices.laporan.create(request.payload);
        return h.response({ status: 'success', message: 'laporan elevator berhasil dibuat', data: { laporan: newLaporan } }).code(201);
      } catch (error) {
        console.error('Error in createLaporanElevatorHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat menyimpan laporan.');
      }
    },

    getAll: async (request, h) => {
      try {
        const allLaporan = await elevatorServices.laporan.getAll();
        return { status: 'success', message:'Data laporan berhasil didapatkan', data: { laporan: allLaporan } };
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
          return Boom.notFound('laporan elevator tidak ditemukan.');
        }
        return { status: 'success',message: 'Data Laporan berhasil didapatkan', data: { laporan } };
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
          return Boom.notFound('Gagal memperbarui. laporan elevator tidak ditemukan.');
        }
        return h.response({ status: 'success', message: 'laporan elevator berhasil diperbarui', data: { laporan: updatedLaporan } });
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
          return Boom.notFound('Gagal menghapus. laporan elevator tidak ditemukan.');
        }
        return { status: 'success', message: 'laporan elevator berhasil dihapus' };
      } catch (error) {
        console.error('Error in deleteLaporanElevatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat menghapus laporan.');
      }
    },

    download: async (request, h) => {
      try {
        const { id } = request.params;
        const LaporanData = await elevatorServices.laporan.getById(id);
        if (!LaporanData) {
          return Boom.notFound('Gagal membuat dokumen. laporan Elevator tidak ditemukan.');
        }
        const { docxBuffer, fileName } = await generateLaporanElevatorDoc(LaporanData);

        // DIUBAH: Menambahkan custom header untuk status download
        return h.response(docxBuffer)
          .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          .header('Content-Disposition', `attachment; filename="${fileName}"`)
          .header('message', 'Laporan berhasil diunduh'); 

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
            if (!prefilledData) return Boom.notFound('Data laporan Elevator tidak ditemukan.');
            return h.response({ status: 'success', message: 'Data BAP berhasil didapatkan', data: prefilledData });
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

          if (error.isBoom) {
            return error;
          }

          console.error('Error in create BAP handler:', error);
          return h.response({
            status: 'error',
            message: 'An internal server error occurred',
          }).code(500);
        }
        },

        getAll: async (request, h) => {
        try {
            const allBap = await elevatorServices.bap.getAll();
            return { status: 'success', message: 'Data BAP berhasil didapatkan', data: { bap: allBap } };
        } catch (error) {
            console.error('Error in getAll BAP handler:', error);
            return Boom.badImplementation('Gagal mengambil semua BAP elevator.');
        }
        },

        getById: async (request, h) => {
        try {
            const bap = await elevatorServices.bap.getById(request.params.id);
            if (!bap) return Boom.notFound('BAP elevator tidak ditemukan.');
            return { status: 'success', message: 'Data BAP berhasil didapatkan', data: { bap } };
        } catch (error) {
            console.error('Error in get BAP by ID handler:', error);
            return Boom.badImplementation('Gagal mengambil BAP elevator.');
        }
        },

        update: async (request, h) => {
        try {
            const updatedBap = await elevatorServices.bap.updateById(request.params.id, request.payload);
            if (!updatedBap) return Boom.notFound('Gagal memperbarui, BAP Elevator tidak ditemukan.');
            return { status: 'success', message: 'BAP elevator berhasil diperbarui', data: { bap: updatedBap } };
        } catch (error) {
            console.error('Error in update BAP handler:', error);
            return Boom.badImplementation('Gagal memperbarui BAP elevator.');
        }
        },

        delete: async (request, h) => {
        try {
            const deletedId = await elevatorServices.bap.deleteById(request.params.id);
            if (!deletedId) return Boom.notFound('Gagal menghapus, BAP Elevator tidak ditemukan.');
            return { status: 'success', message: 'BAP elevator berhasil dihapus' };
        } catch (error) {
            console.error('Error in delete BAP handler:', error);
            return Boom.badImplementation('Gagal menghapus BAP elevator.');
        }
        },

        download: async (request, h) => {
        try {
            const bapData = await elevatorServices.bap.getById(request.params.id);
            if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP Elevator tidak ditemukan.');
            const { docxBuffer, fileName } = await generateBapElevatorDoc(bapData);
            return h.response(docxBuffer)
            .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            .header('Content-Disposition', `attachment; filename="${fileName}"`)
            .header('message', 'Pemeriksaan dan Pengujian Berkala berhasil diunduh');
        } catch (error) {
            console.error('Error in download BAP handler:', error);
            return Boom.badImplementation('Gagal membuat dokumen BAP untuk diunduh.');
        }
        },
    }
};

const eskalatorHandlers = {
  /**
   * HANDLER UNTUK LAPORAN ESKALATOR
   */
  laporan: {
    create: async (request, h) => {
      try {
        const newLaporan = await eskalatorServices.laporan.create(request.payload);
        return h.response({ status: 'success', message: 'Laporan eskalator berhasil dibuat', data: { laporan: newLaporan } }).code(201);
      } catch (error) {
        console.error('Error in createLaporanEskalatorHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat menyimpan laporan eskalator.');
      }
    },

    getAll: async (request, h) => {
      try {
        const allLaporan = await eskalatorServices.laporan.getAll();
        return { status: 'success', message:'Data laporan eskalator berhasil didapatkan', data: { laporan: allLaporan } };
      } catch (error) {
        console.error('Error in getAllLaporanEskalatorHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat mengambil daftar laporan eskalator.');
      }
    },

    getById: async (request, h) => {
      try {
        const { id } = request.params;
        const laporan = await eskalatorServices.laporan.getById(id);
        if (!laporan) {
          return Boom.notFound('Laporan eskalator tidak ditemukan.');
        }
        return { status: 'success',message: 'Data Laporan eskalator berhasil didapatkan', data: { laporan } };
      } catch (error) {
        console.error('Error in getLaporanEskalatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat mengambil laporan eskalator.');
      }
    },

    update: async (request, h) => {
      try {
        const { id } = request.params;
        const updatedLaporan = await eskalatorServices.laporan.updateById(id, request.payload);
        if (!updatedLaporan) {
          return Boom.notFound('Gagal memperbarui. Laporan eskalator tidak ditemukan.');
        }
        return h.response({ status: 'success', message: 'Laporan eskalator berhasil diperbarui', data: { laporan: updatedLaporan } });
      } catch (error) {
        console.error('Error in updateLaporanEskalatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat memperbarui laporan eskalator.');
      }
    },

    delete: async (request, h) => {
      try {
        const { id } = request.params;
        const deletedId = await eskalatorServices.laporan.deleteById(id);
        if (!deletedId) {
          return Boom.notFound('Gagal menghapus. Laporan eskalator tidak ditemukan.');
        }
        return { status: 'success', message: 'Laporan eskalator berhasil dihapus' };
      } catch (error) {
        console.error('Error in deleteLaporanEskalatorByIdHandler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat menghapus laporan eskalator.');
      }
    },

    download: async (request, h) => {
      try {
        const { id } = request.params;
        const laporanData = await eskalatorServices.laporan.getById(id);

        if (!laporanData) {
          return Boom.notFound('Gagal membuat dokumen. Laporan Eskalator tidak ditemukan.');
        }

        // Panggil fungsi generator dengan data dari Firestore
        const { docxBuffer, fileName } = await generateLaporanEskalatorDoc(laporanData);

        // Kirim buffer sebagai file download
        return h.response(docxBuffer)
          .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          .header('Content-Disposition', `attachment; filename="${fileName}"`)
          .header('message', 'Laporan berhasil diunduh');

      } catch (error) {
        console.error('Error in downloadLaporanEskalatorHandler:', error);
        // Cek apakah error berasal dari generator atau error server lain
        if (error.message.includes('Gagal membuat dokumen')) {
            return Boom.badImplementation(error.message);
        }
        return Boom.badImplementation('Terjadi kesalahan pada server saat memproses dokumen.');
      }
    },
  },
 
    /**
   * HANDLER UNTUK BAP ESKALATOR
   */
  bap: {
    prefill: async (request, h) => {
        try {
            const { LaporanId } = request.params;
            const prefilledData = await eskalatorServices.bap.getDataForPrefill(LaporanId);
            if (!prefilledData) return Boom.notFound('Data laporan eskalator tidak ditemukan untuk prefill.');
            return h.response({ status: 'success', message: 'Data BAP berhasil didapatkan', data: prefilledData });
        } catch (error) {
            console.error('Error in BAP eskalator prefill handler:', error);
            return Boom.badImplementation('Gagal mengambil data untuk BAP eskalator.');
        }
    },

    create: async (request, h) => {
      try {
        const newBap = await eskalatorServices.bap.create(request.payload);
        return h.response({ status: 'success', message: 'BAP eskalator berhasil dibuat', data: { bap: newBap } }).code(201);
      } catch (error) {
        if (error.isBoom) return error;
        console.error('Error in create BAP eskalator handler:', error);
        return Boom.badImplementation('Terjadi kesalahan pada server saat membuat BAP eskalator.');
      }
    },

    getAll: async (request, h) => {
        try {
            const allBap = await eskalatorServices.bap.getAll();
            return { status: 'success', message: 'Semua data BAP eskalator berhasil didapatkan', data: { bap: allBap } };
        } catch (error) {
            console.error('Error in getAll BAP eskalator handler:', error);
            return Boom.badImplementation('Gagal mengambil semua BAP eskalator.');
        }
    },

    getById: async (request, h) => {
        try {
            const bap = await eskalatorServices.bap.getById(request.params.id);
            if (!bap) return Boom.notFound('BAP Eskalator tidak ditemukan.');
            return { status: 'success', message: 'Data BAP eskalator berhasil didapatkan', data: { bap } };
        } catch (error) {
            console.error('Error in get BAP eskalator by ID handler:', error);
            return Boom.badImplementation('Gagal mengambil BAP eskalator.');
        }
    },

    update: async (request, h) => {
        try {
            const updatedBap = await eskalatorServices.bap.updateById(request.params.id, request.payload);
            if (!updatedBap) return Boom.notFound('Gagal memperbarui, BAP eskalator tidak ditemukan.');
            return { status: 'success', message: 'BAP eskalator berhasil diperbarui', data: { bap: updatedBap } };
        } catch (error) {
            console.error('Error in update BAP eskalator handler:', error);
            return Boom.badImplementation('Gagal memperbarui BAP eskalator.');
        }
    },

    delete: async (request, h) => {
        try {
            const deletedId = await eskalatorServices.bap.deleteById(request.params.id);
            if (!deletedId) return Boom.notFound('Gagal menghapus, BAP Eskalator tidak ditemukan.');
            return { status: 'success', message: 'BAP eskalator berhasil dihapus' };
        } catch (error) {
            console.error('Error in delete BAP eskalator handler:', error);
            return Boom.badImplementation('Gagal menghapus BAP eskalator.');
        }
    },

    download: async (request, h) => {
      try {
          const bapData = await eskalatorServices.bap.getById(request.params.id);
          if (!bapData) return Boom.notFound('Gagal membuat dokumen, BAP Eskalator tidak ditemukan.');
          
          const { docxBuffer, fileName } = await generateBapEskalatorDoc(bapData);

          return h.response(docxBuffer)
          .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          .header('Content-Disposition', `attachment; filename="${fileName}"`)
          .header('message', 'BAP Eskalator berhasil diunduh');
      } catch (error) {
          console.error('Error in download BAP eskalator handler:', error);
          return Boom.badImplementation('Gagal membuat dokumen BAP eskalator untuk diunduh.');
      }
    },
  }
};
  

module.exports = {
  elevatorHandlers,
  eskalatorHandlers
};