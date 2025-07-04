'use strict';

const Joi = require('joi');
const handlers = require('./handlers');
const { laporanElevatorPayload } = require('./schemas/elevator/laporan');

const API_PREFIX = '/elevatorEskalator/elevator/laporan';

module.exports = [
    // [POST] /elevator-eskalator/elevator/laporan
    {
        method: 'POST',
        path: API_PREFIX,
        handler: handlers.createLaporanElevatorHandler,
        options: {
            auth: 'jwt',
            description: 'Membuat data laporan elevator baru',
            tags: ['api', 'Laporan Elevator'],
            validate: { payload: laporanElevatorPayload, failAction: (r,h,e) => { throw e; }}
        },
    },
    // [GET] /elevator-eskalator/elevator/laporan
    {
        method: 'GET',
        path: API_PREFIX,
        handler: handlers.getAllLaporanElevatorHandler,
        options: {
            auth: 'jwt',
            description: 'Mengambil semua data laporan elevator',
            tags: ['api', 'Laporan Elevator'],
        },
    },
    // [GET] /elevator-eskalator/elevator/laporan/{id}
    {
        method: 'GET',
        path: `${API_PREFIX}/{id}`,
        handler: handlers.getLaporanElevatorByIdHandler,
        options: {
            auth: 'jwt',
            description: 'Mengambil data laporan elevator berdasarkan ID',
            tags: ['api', 'Laporan Elevator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
    // [PUT] /elevator-eskalator/elevator/laporan/{id}
    {
        method: 'PUT',
        path: `${API_PREFIX}/{id}`,
        handler: handlers.updateLaporanElevatorByIdHandler,
        options: {
            auth: 'jwt',
            description: 'Memperbarui data laporan elevator berdasarkan ID',
            tags: ['api', 'Laporan Elevator'],
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: laporanElevatorPayload,
                failAction: (r, h, e) => { throw e; }
            },
        },
    },
    // [DELETE] /elevator-eskalator/elevator/laporan/{id}
    {
        method: 'DELETE',
        path: `${API_PREFIX}/{id}`,
        handler: handlers.deleteLaporanElevatorByIdHandler,
        options: {
            auth: 'jwt',
            description: 'Menghapus data laporan elevator berdasarkan ID',
            tags: ['api', 'Laporan Elevator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
    // [GET] /elevator-eskalator/elevator/laporan/{id}/download
    {
        method: 'GET',
        path: `${API_PREFIX}/{id}/download`,
        handler: handlers.downloadLaporanElevatorHandler,
        options: {
            auth: false, // Download bisa diakses tanpa login (sesuaikan jika perlu)
            description: 'Download dokumen laporan elevator berdasarkan ID',
            tags: ['api', 'Laporan Elevator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
];