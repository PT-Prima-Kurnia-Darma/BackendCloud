'use strict';

const Joi = require('joi');
const { motorDieselHandlers } = require('./handlers');
const { laporanPtpDieselPayload } = require('./schemas/motorDiesel/laporan');
const { bapPtpMotorDieselPayload } = require('./schemas/motorDiesel/bap');
const { laporanPtpMesinPayload } = require('./schemas/mesin/laporan');

const LAPORAN_PTP_DIESEL_PREFIX = '/ptp/motorDiesel/laporan';
const BAP_PTP_DIESEL_PREFIX = '/ptp/motorDiesel/bap';
const LAPORAN_PTP_MESIN_PREFIX = '/ptp/mesin/laporan'; 

module.exports = [
    // ENDPOINT LAPORAN MOTOR DIESEL
    {
        method: 'POST',
        path: LAPORAN_PTP_DIESEL_PREFIX,
        handler: motorDieselHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { payload: laporanPtpDieselPayload }
        },
    },
    {
        method: 'GET',
        path: LAPORAN_PTP_DIESEL_PREFIX,
        handler: motorDieselHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'PTP - Laporan Motor Diesel'] },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/{id}`,
        handler: motorDieselHandlers.laporan.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/{id}`,
        handler: motorDieselHandlers.laporan.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: laporanPtpDieselPayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/{id}`,
        handler: motorDieselHandlers.laporan.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/download/{id}`,
        handler: motorDieselHandlers.laporan.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },

        // --- BAP MOTOR DIESEL ROUTES ---
    {
        method: 'GET',
        path: `${BAP_PTP_DIESEL_PREFIX}/prefill/{laporanId}`,
        handler: motorDieselHandlers.bap.prefill,
        options: {
            auth: 'jwt',
            tags: ['api', 'PTP - BAP Motor Diesel'],
            validate: { params: Joi.object({ laporanId: Joi.string().required() }) }
        },
    },
    {
        method: 'POST',
        path: BAP_PTP_DIESEL_PREFIX,
        handler: motorDieselHandlers.bap.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PTP - BAP Motor Diesel'],
            validate: { payload: bapPtpMotorDieselPayload }
        },
    },
    {
        method: 'GET',
        path: BAP_PTP_DIESEL_PREFIX,
        handler: motorDieselHandlers.bap.getAll,
        options: { auth: 'jwt', tags: ['api', 'PTP - BAP Motor Diesel'] },
    },
    {
        method: 'GET',
        path: `${BAP_PTP_DIESEL_PREFIX}/{id}`,
        handler: motorDieselHandlers.bap.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - BAP Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${BAP_PTP_DIESEL_PREFIX}/{id}`,
        handler: motorDieselHandlers.bap.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - BAP Motor Diesel'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: bapPtpMotorDieselPayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${BAP_PTP_DIESEL_PREFIX}/{id}`,
        handler: motorDieselHandlers.bap.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - BAP Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${BAP_PTP_DIESEL_PREFIX}/download/{id}`,
        handler: motorDieselHandlers.bap.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - BAP Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },

        // ENDPOINT LAPORAN MESIN
    {
        method: 'POST',
        path: LAPORAN_PTP_MESIN_PREFIX,
        handler: mesinHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PTP - Laporan Mesin'],
            validate: { payload: laporanPtpMesinPayload }
        },
    },
    {
        method: 'GET',
        path: LAPORAN_PTP_MESIN_PREFIX,
        handler: mesinHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'PTP - Laporan Mesin'] },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PTP_MESIN_PREFIX}/{id}`,
        handler: mesinHandlers.laporan.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Mesin'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${LAPORAN_PTP_MESIN_PREFIX}/{id}`,
        handler: mesinHandlers.laporan.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Mesin'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: laporanPtpMesinPayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${LAPORAN_PTP_MESIN_PREFIX}/{id}`,
        handler: mesinHandlers.laporan.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Mesin'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PTP_MESIN_PREFIX}/download/{id}`,
        handler: mesinHandlers.laporan.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Mesin'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
];