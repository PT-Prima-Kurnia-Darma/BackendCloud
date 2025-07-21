'use strict';

const Joi = require('joi');
const { petirHandlers } = require('./handlers');
const { laporanPetirPayload } = require('./schemas/instalasiPetir/laporan');
const { bapPetirPayload } = require('./schemas/instalasiPetir/bap');

const LAPORAN_PETIR_PREFIX = '/petirListrik/instalasiPetir/laporan';
const BAP_PETIR_PREFIX = '/petirListrik/instalasiPetir/bap';

module.exports = [
    // ENDPOINT LAPORAN PETIR
    {
        method: 'POST',
        path: LAPORAN_PETIR_PREFIX,
        handler: petirHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'Petir Listrik - Laporan'],
            validate: { payload: laporanPetirPayload }
        },
    },
    {
        method: 'GET',
        path: LAPORAN_PETIR_PREFIX,
        handler: petirHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'Petir Listrik - Laporan'] },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PETIR_PREFIX}/{id}`,
        handler: petirHandlers.laporan.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Petir Listrik - Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${LAPORAN_PETIR_PREFIX}/{id}`,
        handler: petirHandlers.laporan.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Petir Listrik - Laporan'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: laporanPetirPayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${LAPORAN_PETIR_PREFIX}/{id}`,
        handler: petirHandlers.laporan.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Petir Listrik - Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PETIR_PREFIX}/download/{id}`,
        handler: petirHandlers.laporan.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Petir Listrik - Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },

    //ENDPOINT BAP PETIR
    {
        method: 'GET',
        path: `${BAP_PETIR_PREFIX}/prefill/{laporanId}`,
        handler: petirHandlers.bap.prefill,
        options: {
            auth: 'jwt',
            tags: ['api', 'Petir Listrik - BAP'],
            validate: { params: Joi.object({ laporanId: Joi.string().required() }) }
        },
    },
    {
        method: 'POST',
        path: BAP_PETIR_PREFIX,
        handler: petirHandlers.bap.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'Petir Listrik - BAP'],
            validate: { payload: bapPetirPayload }
        },
    },
    {
        method: 'GET',
        path: BAP_PETIR_PREFIX,
        handler: petirHandlers.bap.getAll,
        options: { auth: 'jwt', tags: ['api', 'Petir Listrik - BAP'] },
    },
    {
        method: 'GET',
        path: `${BAP_PETIR_PREFIX}/{id}`,
        handler: petirHandlers.bap.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Petir Listrik - BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${BAP_PETIR_PREFIX}/{id}`,
        handler: petirHandlers.bap.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Petir Listrik - BAP'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: bapPetirPayload 
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${BAP_PETIR_PREFIX}/{id}`,
        handler: petirHandlers.bap.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Petir Listrik - BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${BAP_PETIR_PREFIX}/download/{id}`,
        handler: petirHandlers.bap.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Petir Listrik - BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
];