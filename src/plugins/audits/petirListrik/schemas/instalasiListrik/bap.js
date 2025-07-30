'use strict';

const Joi = require('joi');

const bapListrikPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').required(),
    equipmentType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    createdAt: Joi.string().required(),
    extraId: Joi.number().required(),
    inspectionType: Joi.string().allow('').required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        usageLocation: Joi.string().allow('').required(),
        addressUsageLocation: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        technicalDataPlnPower: Joi.string().allow('').required(),
        technicalDataGeneratorPower: Joi.string().allow('').required(),
        technicalDataLightingPower: Joi.string().allow('').required(),
        technicalDataPowerLoad: Joi.string().allow('').required(),
        serialNumber: Joi.string().allow('').required()
    }).required(),

    visualInspection: Joi.object({
        isRoomClean: Joi.boolean().allow(true, false).required(),
        isRoomClearItems: Joi.boolean().allow(true, false).required(),
        hasSingleLineDiagram: Joi.boolean().allow(true, false).required(),
        hasProtectiveCover: Joi.boolean().allow(true, false).required(),
        isLabelingComplete: Joi.boolean().allow(true, false).required(),
        isFireExtinguisherAvailable: Joi.boolean().allow(true, false).required()
    }).required(),

    testing: Joi.object({
        isThermographTestOk: Joi.boolean().allow(true, false).required(),
        areSafetyDevicesFunctional: Joi.boolean().allow(true, false).required(),
        isVoltageBetweenPhasesNormal: Joi.boolean().allow(true, false).required(),
        isPhaseLoadBalanced: Joi.boolean().allow(true, false).required()
    }).required()
});

module.exports = {
    bapListrikPayload,
};