'use strict';

const Joi = require('joi');
const { petirHandlers } = require('./handlers');
const { laporanPetirPayload } = require('./schemas/instalasiPetir/laporan');

const LAPORAN_PETIR_PREFIX = '/petirListrik/instalasiPetir/laporan';

module.exports = [
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
];