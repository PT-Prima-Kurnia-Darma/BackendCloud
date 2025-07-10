'use strict';

const Joi = require('joi');
const { forkliftHandlers } = require('./handlers');
const { laporanForkliftPayload } = require('./schemas/forklift/laporan');

const FORKLIFT_LAPORAN_PREFIX = '/paa/forklift/laporan';

module.exports = [
    // --- FORKLIFT LAPORAN ROUTES ---
    {
        method: 'POST',
        path: FORKLIFT_LAPORAN_PREFIX,
        handler: forkliftHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Forklift Laporan'],
            validate: { payload: laporanForkliftPayload }
        },
    },
    {
        method: 'GET',
        path: FORKLIFT_LAPORAN_PREFIX,
        handler: forkliftHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'PAA - Forklift Laporan'] },
    },
    {
        method: 'GET',
        path: `${FORKLIFT_LAPORAN_PREFIX}/{id}`,
        handler: forkliftHandlers.laporan.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Forklift Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${FORKLIFT_LAPORAN_PREFIX}/{id}`,
        handler: forkliftHandlers.laporan.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Forklift Laporan'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: laporanForkliftPayload 
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${FORKLIFT_LAPORAN_PREFIX}/{id}`,
        handler: forkliftHandlers.laporan.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Forklift Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${FORKLIFT_LAPORAN_PREFIX}/download/{id}`,
        handler: forkliftHandlers.laporan.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Forklift Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    // Routes untuk BAP Forklift akan ditambahkan di sini nanti
];