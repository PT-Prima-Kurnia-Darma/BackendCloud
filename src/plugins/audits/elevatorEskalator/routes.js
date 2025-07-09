'use strict';

const Joi = require('joi');
const { elevatorHandlers } = require('./handlers'); 
const { eskalatorHandlers } = require('./handlers')

// DIUBAH: Nama variabel disesuaikan dengan nama yang diekspor (laporanElevatorPayload)
const { laporanElevatorPayload } = require('./schemas/elevator/laporan'); 
const { bapElevatorPayload } = require('./schemas/elevator/bap');
const { laporanEskalatorPayload } = require('./schemas/eskalator/laporan');

// Definisikan semua prefix API
const LAPORAN_ELEVATOR_PREFIX = '/elevatorEskalator/elevator/laporan';
const BAP_ELEVATOR_PREFIX = '/elevatorEskalator/elevator/bap';
const LAPORAN_ESKALATOR_PREFIX = '/elevatorEskalator/eskalator/laporan'

module.exports = [
    /**
     * ENDPOINTS UNTUK LAPORAN ELEVATOR
     */
    {
        method: 'POST',
        path: LAPORAN_ELEVATOR_PREFIX,
        handler: elevatorHandlers.laporan.create,
        options: {
            auth: 'jwt',
            description: 'Membuat data laporan elevator baru',
            tags: ['api', 'laporan Elevator'],
            // DIUBAH: Menggunakan variabel yang benar (laporanElevatorPayload)
            validate: { payload: laporanElevatorPayload } 
        },
    },
    {
        method: 'GET',
        path: LAPORAN_ELEVATOR_PREFIX,
        handler: elevatorHandlers.laporan.getAll,
        options: {
            auth: 'jwt',
            description: 'Mengambil semua data laporan elevator',
            tags: ['api', 'laporan Elevator'],
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_ELEVATOR_PREFIX}/{id}`,
        handler: elevatorHandlers.laporan.getById,
        options: {
            auth: 'jwt',
            description: 'Mengambil data laporan elevator berdasarkan ID',
            tags: ['api', 'laporan Elevator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
    {
        method: 'PUT',
        path: `${LAPORAN_ELEVATOR_PREFIX}/{id}`,
        handler: elevatorHandlers.laporan.update,
        options: {
            auth: 'jwt',
            description: 'Memperbarui data laporan elevator berdasarkan ID',
            tags: ['api', 'laporan Elevator'],
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                // DIUBAH: Menggunakan variabel yang benar (laporanElevatorPayload)
                payload: laporanElevatorPayload, 
            },
        },
    },
    {
        method: 'DELETE',
        path: `${LAPORAN_ELEVATOR_PREFIX}/{id}`,
        handler: elevatorHandlers.laporan.delete,
        options: {
            auth: 'jwt',
            description: 'Menghapus data laporan elevator berdasarkan ID',
            tags: ['api', 'laporan Elevator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_ELEVATOR_PREFIX}/download/{id}`,
        handler: elevatorHandlers.laporan.download,
        options: {
            auth: 'jwt',
            description: 'Download dokumen laporan elevator berdasarkan ID',
            tags: ['api', 'laporan Elevator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },

     /**
     * ENDPOINTS UNTUK BAP ELEVATOR
     */
    {
        method: 'GET',
        path: `${BAP_ELEVATOR_PREFIX}/prefill/{LaporanId}`,
        handler: elevatorHandlers.bap.prefill,
        options: {
            auth: 'jwt',
            description: 'Mengambil data dari laporan untuk mengisi form BAP',
            tags: ['api', 'BAP Elevator'],
            validate: { params: Joi.object({ LaporanId: Joi.string().required() }) },
        },
    },
    {
        method: 'POST',
        path: BAP_ELEVATOR_PREFIX,
        handler: elevatorHandlers.bap.create,
        options: { 
            auth: 'jwt', 
            description: 'Membuat BAP elevator baru', 
            tags: ['api', 'BAP Elevator'], 
            validate: { payload: bapElevatorPayload } 
        },
    },
    {
        method: 'GET',
        path: BAP_ELEVATOR_PREFIX,
        handler: elevatorHandlers.bap.getAll,
        options: { auth: 'jwt', description: 'Mengambil semua data BAP elevator', tags: ['api', 'BAP Elevator'] },
    },
    {
        method: 'GET',
        path: `${BAP_ELEVATOR_PREFIX}/{id}`,
        handler: elevatorHandlers.bap.getById,
        options: { 
            auth: 'jwt', 
            description: 'Mengambil data BAP elevator berdasarkan ID', 
            tags: ['api', 'BAP Elevator'], 
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'PUT',
        path: `${BAP_ELEVATOR_PREFIX}/{id}`,
        handler: elevatorHandlers.bap.update,
        options: { 
            auth: 'jwt', 
            description: 'Memperbarui data BAP elevator berdasarkan ID', 
            tags: ['api', 'BAP Elevator'], 
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: bapElevatorPayload 
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${BAP_ELEVATOR_PREFIX}/{id}`,
        handler: elevatorHandlers.bap.delete,
        options: { 
            auth: 'jwt', 
            description: 'Menghapus data BAP elevator berdasarkan ID', 
            tags: ['api', 'BAP Elevator'], 
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${BAP_ELEVATOR_PREFIX}/download/{id}`,
        handler: elevatorHandlers.bap.download,
        options: { 
            auth: 'jwt', 
            description: 'Download dokumen BAP elevator berdasarkan ID', 
            tags: ['api', 'BAP Elevator'], 
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },

    /**
     * ENDPOINTS UNTUK LAPORAN ESKALATOR
     */
    {
        method: 'POST',
        path: LAPORAN_ESKALATOR_PREFIX,
        handler: eskalatorHandlers.laporan.create,
        options: {
            auth: 'jwt',
            description: 'Membuat data laporan eskalator baru',
            tags: ['api', 'laporan Eskalator'],
            validate: { payload: laporanEskalatorPayload }
        },
    },
    {
        method: 'GET',
        path: LAPORAN_ESKALATOR_PREFIX,
        handler: eskalatorHandlers.laporan.getAll,
        options: {
            auth: 'jwt',
            description: 'Mengambil semua data laporan eskalator',
            tags: ['api', 'laporan Eskalator'],
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_ESKALATOR_PREFIX}/{id}`,
        handler: eskalatorHandlers.laporan.getById,
        options: {
            auth: 'jwt',
            description: 'Mengambil data laporan eskalator berdasarkan ID',
            tags: ['api', 'laporan Eskalator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
    {
        method: 'PUT',
        path: `${LAPORAN_ESKALATOR_PREFIX}/{id}`,
        handler: eskalatorHandlers.laporan.update,
        options: {
            auth: 'jwt',
            description: 'Memperbarui data laporan eskalator berdasarkan ID',
            tags: ['api', 'laporan Eskalator'],
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: laporanEskalatorPayload,
            },
        },
    },
    {
        method: 'DELETE',
        path: `${LAPORAN_ESKALATOR_PREFIX}/{id}`,
        handler: eskalatorHandlers.laporan.delete,
        options: {
            auth: 'jwt',
            description: 'Menghapus data laporan eskalator berdasarkan ID',
            tags: ['api', 'laporan Eskalator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_ESKALATOR_PREFIX}/download/{id}`,
        handler: eskalatorHandlers.laporan.download,
        options: {
            auth: 'jwt',
            description: 'Download dokumen laporan eskalator berdasarkan ID',
            tags: ['api', 'laporan Eskalator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
    
    /**
     * ENDPOINTS UNTUK BAP ELEVATOR
     */
    // ... (routing BAP elevator yang sudah ada)
];
