'use strict';

const Joi = require('joi');
const { elevatorHandlers } = require('./handlers'); // <-- Mengimpor objek utama
const { laporanElevatorPayload } = require('./schemas/elevator/laporan');

// Definisikan semua prefix API agar rapi
const LAPORAN_ELEVATOR_PREFIX = '/elevatorEskalator/elevator/laporan';

module.exports = [
    {
        method: 'POST',
        path: LAPORAN_ELEVATOR_PREFIX,
        handler: elevatorHandlers.laporan.create, // <-- Pemanggilan yang sudah dibungkus
        options: {
            auth: 'jwt',
            description: 'Membuat data laporan elevator baru',
            tags: ['api', 'Laporan Elevator'],
            validate: { payload: laporanElevatorPayload }
        },
    },
    {
        method: 'GET',
        path: LAPORAN_ELEVATOR_PREFIX,
        handler: elevatorHandlers.laporan.getAll, // <-- Pemanggilan yang sudah dibungkus
        options: {
            auth: 'jwt',
            description: 'Mengambil semua data laporan elevator',
            tags: ['api', 'Laporan Elevator'],
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_ELEVATOR_PREFIX}/{id}`,
        handler: elevatorHandlers.laporan.getById, // <-- Pemanggilan yang sudah dibungkus
        options: {
            auth: 'jwt',
            description: 'Mengambil data laporan elevator berdasarkan ID',
            tags: ['api', 'Laporan Elevator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
    {
        method: 'PUT',
        path: `${LAPORAN_ELEVATOR_PREFIX}/{id}`,
        handler: elevatorHandlers.laporan.update, // <-- Pemanggilan yang sudah dibungkus
        options: {
            auth: 'jwt',
            description: 'Memperbarui data laporan elevator berdasarkan ID',
            tags: ['api', 'Laporan Elevator'],
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: laporanElevatorPayload,
            },
        },
    },
    {
        method: 'DELETE',
        path: `${LAPORAN_ELEVATOR_PREFIX}/{id}`,
        handler: elevatorHandlers.laporan.delete, // <-- Pemanggilan yang sudah dibungkus
        options: {
            auth: 'jwt',
            description: 'Menghapus data laporan elevator berdasarkan ID',
            tags: ['api', 'Laporan Elevator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_ELEVATOR_PREFIX}/download/{id}`,
        handler: elevatorHandlers.laporan.download, // <-- Pemanggilan yang sudah dibungkus
        options: {
            auth: 'jwt',
            description: 'Download dokumen laporan elevator berdasarkan ID',
            tags: ['api', 'Laporan Elevator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
];