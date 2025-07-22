'use strict';

const Joi = require('joi');

const bapListrikPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').optional(),
    equipmentType: Joi.string().allow('').optional(),
    inspectionDate: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),
    extraId: Joi.number().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        usageLocation: Joi.string().allow('').optional(),
        addressUsageLocation: Joi.string().allow('').optional()
    }).optional(),

    technicalData: Joi.object({
        technicalDataPlnPower: Joi.string().allow('').optional(),
        technicalDataGeneratorPower: Joi.string().allow('').optional(),
        technicalDataLightingPower: Joi.string().allow('').optional(),
        technicalDataPowerLoad: Joi.string().allow('').optional(),
        serialNumber: Joi.string().allow('').optional()
    }).optional(),

    visualInspection: Joi.object({
        isRoomClean: Joi.boolean().allow(null).optional(),
        isRoomClearItems: Joi.boolean().allow(null).optional(),
        hasSingleLineDiagram: Joi.boolean().allow(null).optional(),
        hasProtectiveCover: Joi.boolean().allow(null).optional(),
        isLabelingComplete: Joi.boolean().allow(null).optional(),
        isFireExtinguisherAvailable: Joi.boolean().allow(null).optional()
    }).optional(),

    testing: Joi.object({
        isThermographTestOk: Joi.boolean().allow(null).optional(),
        areSafetyDevicesFunctional: Joi.boolean().allow(null).optional(),
        isVoltageBetweenPhasesNormal: Joi.boolean().allow(null).optional(),
        isPhaseLoadBalanced: Joi.boolean().allow(null).optional()
    }).optional()

}).min(1).unknown(false);

module.exports = {
    bapListrikPayload,
};