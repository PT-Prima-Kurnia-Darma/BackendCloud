'use strict';

const Joi = require('joi');

const bapOverheadCranePayload = Joi.object({
    laporanId: Joi.string().required(),
    reportHeader: Joi.object({
        examinationType: Joi.string().allow('').optional(),
        inspectionDate: Joi.string().allow('').optional(),
        extraId: Joi.number().allow(null).optional(),
        inspectionType: Joi.string().allow('').optional(),
        createdAt: Joi.string().allow('').optional(),
        equipmentType: Joi.string().allow('').optional()
    }).optional(),
    generalData: Joi.object({
        ownerName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        userInCharge: Joi.string().allow('').optional(),
        ownerAddress: Joi.string().allow('').optional(),
        unitLocation: Joi.string().allow('').optional()
    }).optional(),
    technicalData: Joi.object({
        brandType: Joi.string().allow('').optional(),
        manufacturer: Joi.string().allow('').optional(),
        locationAndYearOfManufacture: Joi.string().allow('').optional(),
        serialNumberUnitNumber: Joi.string().allow('').optional(),
        capacityWorkingLoad: Joi.string().allow('').optional(),
        liftingSpeedMpm: Joi.string().allow('').optional()
    }).optional(),
    visualInspection: Joi.object({
        hasConstructionDefects: Joi.boolean().allow(null).optional(),
        hookHasSafetyLatch: Joi.boolean().allow(null).optional(),
        isEmergencyStopInstalled: Joi.boolean().allow(null).optional(),
        isWireropeGoodCondition: Joi.boolean().allow(null).optional(),
        operatorHasK3License: Joi.boolean().allow(null).optional()
    }).optional(),
    testing: Joi.object({
        functionTest: Joi.boolean().allow(null).optional(),
        loadTest: Joi.object({
            loadTon: Joi.number().allow(null).optional(),
            isAbleToLift: Joi.boolean().allow(null).optional(),
            hasLoadDrop: Joi.boolean().allow(null).optional()
        }).optional(),
        ndtTest: Joi.object({
            isNdtResultGood: Joi.boolean().allow(null).optional(),
            hasCrackIndication: Joi.boolean().allow(null).optional()
        }).optional()
    }).optional()
}).min(1).unknown(false);

module.exports = {
    bapOverheadCranePayload,
};