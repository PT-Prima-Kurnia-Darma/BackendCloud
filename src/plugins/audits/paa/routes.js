'use strict';

const Joi = require('joi');
const { forkliftHandlers, mobileCraneHandlers, gantryCraneHandlers, gondolaHandlers, overheadCraneHandlers  } = require('./handlers');
const { laporanForkliftPayload } = require('./schemas/forklift/laporan');
const { bapForkliftPayload } = require('./schemas/forklift/bap');
const { laporanMobileCranePayload } = require('./schemas/mobileCrane/laporan');
const { bapMobileCranePayload } = require('./schemas/mobileCrane/bap');
const { laporanGantryCranePayload } = require('./schemas/gantryCrane/laporan');
const { bapGantryCranePayload } = require('./schemas/gantryCrane/bap');
const { laporanGondolaPayload } = require('./schemas/gondola/laporan');
const { bapGondolaPayload } = require('./schemas/gondola/bap');
const { laporanOverheadCranePayload } = require('./schemas/overHeadCrane/laporan');

// prefix
const FORKLIFT_LAPORAN_PREFIX = '/paa/forklift/laporan';
const FORKLIFT_BAP_PREFIX = '/paa/forklift/bap';
const MOBILE_CRANE_LAPORAN_PREFIX = '/paa/mobileCrane/laporan';
const MOBILE_CRANE_BAP_PREFIX = '/paa/mobileCrane/bap';
const GANTRY_CRANE_LAPORAN_PREFIX = '/paa/gantryCrane/laporan';
const GANTRY_CRANE_BAP_PREFIX = '/paa/gantryCrane/bap';
const GONDOLA_LAPORAN_PREFIX = '/paa/gondola/laporan';
const GONDOLA_BAP_PREFIX = '/paa/gondola/bap';
const OVERHEAD_CRANE_LAPORAN_PREFIX = '/paa/overHeadCrane/laporan';


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

    // --- RUTE GANTRY CRANE LAPORAN ---
    {
        method: 'POST',
        path: GANTRY_CRANE_LAPORAN_PREFIX,
        handler: gantryCraneHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gantry Crane Laporan'],
            validate: { payload: laporanGantryCranePayload } // Menggunakan skema yang baru dibuat
        },
    },
    {
        method: 'GET',
        path: GANTRY_CRANE_LAPORAN_PREFIX,
        handler: gantryCraneHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'PAA - Gantry Crane Laporan'] },
    },
    {
        method: 'GET',
        path: `${GANTRY_CRANE_LAPORAN_PREFIX}/{id}`,
        handler: gantryCraneHandlers.laporan.getById,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gantry Crane Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${GANTRY_CRANE_LAPORAN_PREFIX}/{id}`,
        handler: gantryCraneHandlers.laporan.update,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gantry Crane Laporan'],
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: laporanGantryCranePayload
            }
        },
    },
    {
        method: 'DELETE',
        path: `${GANTRY_CRANE_LAPORAN_PREFIX}/{id}`,
        handler: gantryCraneHandlers.laporan.delete,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gantry Crane Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'GET',
        path: `${GANTRY_CRANE_LAPORAN_PREFIX}/download/{id}`,
        handler: gantryCraneHandlers.laporan.download,
        options: {
            auth: 'jwt',
            description: 'Download dokumen laporan Gantry Crane berdasarkan ID',
            tags: ['api', 'PAA - Gantry Crane Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },

    // --- RUTE BARU UNTUK BAP GANTRY CRANE ---
    {
        method: 'GET',
        path: `${GANTRY_CRANE_BAP_PREFIX}/prefill/{laporanId}`,
        handler: gantryCraneHandlers.bap.prefill,
        options: {
            auth: 'jwt',
            description: 'Get prefilled BAP data from a Laporan for Gantry Crane',
            tags: ['api', 'PAA - Gantry Crane BAP'],
            validate: { params: Joi.object({ laporanId: Joi.string().required() }) }
        },
    },
    {
        method: 'POST',
        path: GANTRY_CRANE_BAP_PREFIX,
        handler: gantryCraneHandlers.bap.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gantry Crane BAP'],
            validate: { payload: bapGantryCranePayload }
        },
    },
    {
        method: 'GET',
        path: GANTRY_CRANE_BAP_PREFIX,
        handler: gantryCraneHandlers.bap.getAll,
        options: { auth: 'jwt', tags: ['api', 'PAA - Gantry Crane BAP'] },
    },
    {
        method: 'GET',
        path: `${GANTRY_CRANE_BAP_PREFIX}/{id}`,
        handler: gantryCraneHandlers.bap.getById,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gantry Crane BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${GANTRY_CRANE_BAP_PREFIX}/{id}`,
        handler: gantryCraneHandlers.bap.update,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gantry Crane BAP'],
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: bapGantryCranePayload
            }
        },
    },
    {
        method: 'DELETE',
        path: `${GANTRY_CRANE_BAP_PREFIX}/{id}`,
        handler: gantryCraneHandlers.bap.delete,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gantry Crane BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'GET',
        path: `${GANTRY_CRANE_BAP_PREFIX}/download/{id}`,
        handler: gantryCraneHandlers.bap.download,
        options: {
            auth: 'jwt',
            description: 'Download dokumen BAP Gantry Crane berdasarkan ID',
            tags: ['api', 'PAA - Gantry Crane BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },

    // --- RUTE LAPORAN GONDOLA ---
    {
        method: 'POST',
        path: GONDOLA_LAPORAN_PREFIX,
        handler: gondolaHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gondola Laporan'],
            validate: { payload: laporanGondolaPayload }
        },
    },
    {
        method: 'GET',
        path: GONDOLA_LAPORAN_PREFIX,
        handler: gondolaHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'PAA - Gondola Laporan'] },
    },
    {
        method: 'GET',
        path: `${GONDOLA_LAPORAN_PREFIX}/{id}`,
        handler: gondolaHandlers.laporan.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Gondola Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${GONDOLA_LAPORAN_PREFIX}/{id}`,
        handler: gondolaHandlers.laporan.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Gondola Laporan'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: laporanGondolaPayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${GONDOLA_LAPORAN_PREFIX}/{id}`,
        handler: gondolaHandlers.laporan.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Gondola Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${GONDOLA_LAPORAN_PREFIX}/download/{id}`,
        handler: gondolaHandlers.laporan.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Gondola Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },

    // -- RUTE BAP GONDOLA ---
    {
        method: 'GET',
        path: `${GONDOLA_BAP_PREFIX}/prefill/{laporanId}`, // Rute baru untuk pre-fill
        handler: gondolaHandlers.bap.getPrefill,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gondola BAP'],
            validate: {
                params: Joi.object({
                    laporanId: Joi.string().required()
                })
            }
        },
    },
    {
        method: 'POST',
        path: GONDOLA_BAP_PREFIX,
        handler: gondolaHandlers.bap.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Gondola BAP'],
            validate: { payload: bapGondolaPayload }
        },
    },
    {
        method: 'GET',
        path: GONDOLA_BAP_PREFIX,
        handler: gondolaHandlers.bap.getAll,
        options: { auth: 'jwt', tags: ['api', 'PAA - Gondola BAP'] },
    },
    {
        method: 'GET',
        path: `${GONDOLA_BAP_PREFIX}/{id}`,
        handler: gondolaHandlers.bap.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Gondola BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${GONDOLA_BAP_PREFIX}/{id}`,
        handler: gondolaHandlers.bap.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Gondola BAP'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: bapGondolaPayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${GONDOLA_BAP_PREFIX}/{id}`,
        handler: gondolaHandlers.bap.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Gondola BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${GONDOLA_BAP_PREFIX}/download/{id}`,
        handler: gondolaHandlers.bap.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Gondola BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },

    // --- RUTE LAPORAN OVERHEAD CRANE ---
    {
        method: 'POST',
        path: OVERHEAD_CRANE_LAPORAN_PREFIX,
        handler: overheadCraneHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PAA - Overhead Crane Laporan'],
            validate: { payload: laporanOverheadCranePayload }
        },
    },
    {
        method: 'GET',
        path: OVERHEAD_CRANE_LAPORAN_PREFIX,
        handler: overheadCraneHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'PAA - Overhead Crane Laporan'] },
    },
    {
        method: 'GET',
        path: `${OVERHEAD_CRANE_LAPORAN_PREFIX}/{id}`,
        handler: overheadCraneHandlers.laporan.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Overhead Crane Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${OVERHEAD_CRANE_LAPORAN_PREFIX}/{id}`,
        handler: overheadCraneHandlers.laporan.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Overhead Crane Laporan'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: laporanOverheadCranePayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${OVERHEAD_CRANE_LAPORAN_PREFIX}/{id}`,
        handler: overheadCraneHandlers.laporan.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Overhead Crane Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${OVERHEAD_CRANE_LAPORAN_PREFIX}/download/{id}`,
        handler: overheadCraneHandlers.laporan.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PAA - Overhead Crane Laporan'],
            description: 'Download dokumen laporan Overhead Crane berdasarkan ID',
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
];