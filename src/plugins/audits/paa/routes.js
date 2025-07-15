'use strict';

const Joi = require('joi');
const { forkliftHandlers, mobileCraneHandlers } = require('./handlers');
const { laporanForkliftPayload } = require('./schemas/forklift/laporan');
const { bapForkliftPayload } = require('./schemas/forklift/bap');
const { laporanMobileCranePayload } = require('./schemas/mobileCrane/laporan');
const { bapMobileCranePayload } = require('./schemas/mobileCrane/bap');

// forlift
const FORKLIFT_LAPORAN_PREFIX = '/paa/forklift/laporan';
const FORKLIFT_BAP_PREFIX = '/paa/forklift/bap';
const MOBILE_CRANE_LAPORAN_PREFIX = '/paa/mobileCrane/laporan';
const MOBILE_CRANE_BAP_PREFIX = '/paa/mobileCrane/bap';


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
    
    
    // --- RUTE BAP FORKLIFT ---
    {
        method: 'GET',
        path: `${FORKLIFT_BAP_PREFIX}/prefill/{laporanId}`,
        handler: forkliftHandlers.bap.prefill,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Forklift BAP'],
            validate: { params: Joi.object({ laporanId: Joi.string().required() }) }
        },
    },
    {
        method: 'POST',
        path: FORKLIFT_BAP_PREFIX,
        handler: forkliftHandlers.bap.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Forklift BAP'],
            validate: { payload: bapForkliftPayload }
        },
    },
    {
        method: 'GET',
        path: FORKLIFT_BAP_PREFIX,
        handler: forkliftHandlers.bap.getAll,
        options: { auth: 'jwt', tags: ['api', 'PAA - Forklift BAP'] },
    },
    {
        method: 'GET',
        path: `${FORKLIFT_BAP_PREFIX}/{id}`,
        handler: forkliftHandlers.bap.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Forklift BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${FORKLIFT_BAP_PREFIX}/{id}`,
        handler: forkliftHandlers.bap.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Forklift BAP'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: bapForkliftPayload 
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${FORKLIFT_BAP_PREFIX}/{id}`,
        handler: forkliftHandlers.bap.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Forklift BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${FORKLIFT_BAP_PREFIX}/download/{id}`,
        handler: forkliftHandlers.bap.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Forklift BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },

      // --- RUTE BARU UNTUK MOBILE CRANE ---
    {
        method: 'POST',
        path: MOBILE_CRANE_LAPORAN_PREFIX,
        handler: mobileCraneHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Mobile Crane Laporan'],
            validate: { payload: laporanMobileCranePayload } // Menggunakan skema yang baru dibuat
        },
    },
    {
        method: 'GET',
        path: MOBILE_CRANE_LAPORAN_PREFIX,
        handler: mobileCraneHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'PAA - Mobile Crane Laporan'] },
    },
    {
        method: 'GET',
        path: `${MOBILE_CRANE_LAPORAN_PREFIX}/{id}`,
        handler: mobileCraneHandlers.laporan.getById,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Mobile Crane Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${MOBILE_CRANE_LAPORAN_PREFIX}/{id}`,
        handler: mobileCraneHandlers.laporan.update,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Mobile Crane Laporan'],
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: laporanMobileCranePayload
            }
        },
    },
    {
        method: 'DELETE',
        path: `${MOBILE_CRANE_LAPORAN_PREFIX}/{id}`,
        handler: mobileCraneHandlers.laporan.delete,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Mobile Crane Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'GET',
        path: `${MOBILE_CRANE_LAPORAN_PREFIX}/download/{id}`,
        handler: mobileCraneHandlers.laporan.download,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Mobile Crane Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },

    //--- RUTE UNTUK BAP MOBILE CRANE ---
    {
        method: 'GET',
        path: `${MOBILE_CRANE_BAP_PREFIX}/prefill/{laporanId}`,
        handler: mobileCraneHandlers.bap.prefill,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Mobile Crane BAP'],
            validate: { params: Joi.object({ laporanId: Joi.string().required() }) }
        },
    },
    {
        method: 'POST',
        path: MOBILE_CRANE_BAP_PREFIX,
        handler: mobileCraneHandlers.bap.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Mobile Crane BAP'],
            validate: { payload: bapMobileCranePayload }
        },
    },
    {
        method: 'GET',
        path: MOBILE_CRANE_BAP_PREFIX,
        handler: mobileCraneHandlers.bap.getAll,
        options: { auth: 'jwt', tags: ['api', 'PAA - Mobile Crane BAP'] },
    },
    {
        method: 'GET',
        path: `${MOBILE_CRANE_BAP_PREFIX}/{id}`,
        handler: mobileCraneHandlers.bap.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Mobile Crane BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${MOBILE_CRANE_BAP_PREFIX}/{id}`,
        handler: mobileCraneHandlers.bap.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Mobile Crane BAP'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: bapMobileCranePayload 
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${MOBILE_CRANE_BAP_PREFIX}/{id}`,
        handler: mobileCraneHandlers.bap.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Mobile Crane BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${MOBILE_CRANE_BAP_PREFIX}/download/{id}`,
        handler: mobileCraneHandlers.bap.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Mobile Crane BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
];