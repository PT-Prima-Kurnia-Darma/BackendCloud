'use strict';

const Joi = require('joi');

const bapPetirPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),
    inspectionDate: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),
    extraId: Joi.number().allow('').optional(),
    equipmentType: Joi.string().allow('').optional(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        usageLocation: Joi.string().allow('').optional(),
        addressUsageLocation: Joi.string().allow('').optional()
    }).optional(),

    technicalData: Joi.object({
        conductorType: Joi.string().allow('').optional(),
        serialNumber: Joi.string().allow('').optional(),
        buildingHeight: Joi.number().allow('').optional(),
        buildingArea: Joi.number().allow('').optional(),
        receiverHeight: Joi.number().allow('').optional(),
        receiverCount: Joi.number().allow('').optional(),
        groundElectrodeCount: Joi.number().allow('').optional(),
        conductorDescription: Joi.string().allow('').optional(),
        installer: Joi.string().allow('').optional(),
        groundingResistance: Joi.number().allow('').optional()
    }).optional(),

    testResults: Joi.object({
        visualInspection: Joi.object({
            isSystemOverallGood: Joi.boolean().allow(null).optional(),
            isReceiverConditionGood: Joi.boolean().allow(null).optional(),
            isReceiverPoleConditionGood: Joi.boolean().allow(null).optional(),
            isConductorInsulated: Joi.boolean().allow(null).optional(),
            isControlBoxAvailable: Joi.boolean().allow(null).optional(),
            isControlBoxConditionGood: Joi.boolean().allow(null).optional()
        }).optional(),
        measurement: Joi.object({
            conductorContinuityResult: Joi.string().allow('').optional(),
            measuredGroundingResistance: Joi.string().allow('').optional(),
            measuredGroundingResistanceResult: Joi.boolean().allow(null).optional()
        }).optional()
    }).optional()
}).min(1).unknown(false);

module.exports = {
    bapPetirPayload,
};