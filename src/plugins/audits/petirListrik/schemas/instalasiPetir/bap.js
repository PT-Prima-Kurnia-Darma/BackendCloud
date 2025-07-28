'use strict';

const Joi = require('joi');

const bapPetirPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').required(),
    inspectionType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    createdAt: Joi.string().allow('').required(),
    extraId: Joi.number().required(),
    equipmentType: Joi.string().allow('').required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        usageLocation: Joi.string().allow('').required(),
        addressUsageLocation: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        conductorType: Joi.string().allow('').required(),
        serialNumber: Joi.string().allow('').required(),
        buildingHeight: Joi.string().allow('').required(),
        buildingArea: Joi.string().allow('').required(),
        receiverHeight: Joi.string().allow('').required(),
        receiverCount: Joi.string().allow('').required(),
        groundElectrodeCount: Joi.string().allow('').required(),
        conductorDescription: Joi.string().allow('').required(),
        installer: Joi.string().allow('').required(),
        groundingResistance: Joi.string().allow('').required()
    }).required(),

    testResults: Joi.object({
        visualInspection: Joi.object({
            isSystemOverallGood: Joi.boolean().allow(true, false).required(),
            isReceiverConditionGood: Joi.boolean().allow(true, false).required(),
            isReceiverPoleConditionGood: Joi.boolean().allow(true, false).required(),
            isConductorInsulated: Joi.boolean().allow(true, false).required(),
            isControlBoxAvailable: Joi.boolean().allow(true, false).required(),
            isControlBoxConditionGood: Joi.boolean().allow(true, false).required()
        }).required(),
        measurement: Joi.object({
            conductorContinuityResult: Joi.string().allow('').required(),
            measuredGroundingResistance: Joi.string().allow('').required(),
            measuredGroundingResistanceResult: Joi.boolean().allow(true, false).required()
        }).required()
    }).required()
});

module.exports = {
    bapPetirPayload,
};