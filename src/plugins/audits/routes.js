'use strict';

const Joi = require('joi');
const handlers = require('./handlers');
const { laporanPetirPayload } = require('../documents/validations/listrikPetirSchemas');
const { laporanElevatorPayload } = require('../documents/validations/elevatorEskalatorSchemas');

module.exports = [
    {
        method: 'POST',
        path: '/audits/sendData',
        handler: handlers.createAuditHandler,
        options: {
            description: 'Create a new audit data entry',
            tags: ['api', 'audits'],
            validate: {
                payload: Joi.alternatives().try(
                    laporanPetirPayload,
                    laporanElevatorPayload
                ),
                failAction: (request, h, err) => {
                    console.error(err);
                    throw err;
                }
            },
        },
    },
    {
        method: 'GET',
        path: '/audits/getData',
        handler: handlers.getAllAuditsHandler,
        options: {
            description: 'Get all audit data entries',
            tags: ['api', 'audits'],
        },
    },
    {
        method: 'GET',
        path: '/audits/getDataById/{id}',
        handler: handlers.getAuditByIdHandler,
        options: {
            description: 'Get a specific audit data entry by ID',
            tags: ['api', 'audits'],
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
            },
        },
    },
    {
        method: 'PUT',
        path: '/audits/edit/{id}',
        handler: handlers.updateAuditByIdHandler,
        options: {
            description: 'Update an audit data entry by ID',
            tags: ['api', 'audits'],
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: Joi.alternatives().try(
                    laporanPetirPayload,
                    laporanElevatorPayload
                ),
                failAction: (request, h, err) => {
                    console.error(err);
                    throw err;
                }
            },
        },
    },
    {
        method: 'DELETE',
        path: '/audits/delete/{id}',
        // INI YANG DIPERBAIKI
        handler: handlers.deleteAuditByIdHandler,
        options: {
            description: 'Delete an audit data entry by ID',
            tags: ['api', 'audits'],
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
            },
        },
    },
];