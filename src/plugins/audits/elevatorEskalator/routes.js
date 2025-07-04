'use strict';

const Joi = require('joi');
const handlers = require('./handlers');
const { laporanElevatorPayload } = require('./schemas/elevator/laporan');

const API_PREFIX = '/elevatorEskalator/elevator/laporan';

module.exports = [
    // [POST]
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
    // [GET]
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
    // [GET]
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
    // [PUT]
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
    // [DELETE]
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
    // [GET]
    {
        method: 'GET',
        path: `${API_PREFIX}/download/{id}`,
        handler: handlers.downloadLaporanElevatorHandler,
        options: {
            auth: 'jwt',
            description: 'Download dokumen laporan elevator berdasarkan ID',
            tags: ['api', 'Laporan Elevator'],
            validate: { params: Joi.object({ id: Joi.string().required() }) },
        },
    },
];