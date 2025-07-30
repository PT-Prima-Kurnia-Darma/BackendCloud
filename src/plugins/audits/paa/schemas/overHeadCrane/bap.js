'use strict';

const Joi = require('joi');

const bapOverheadCranePayload = Joi.object({
    laporanId: Joi.string().required(),
    reportHeader: Joi.object({
        examinationType: Joi.string().allow('').required(),
        inspectionDate: Joi.string().allow('').required(),
        extraId: Joi.number().required(),
        inspectionType: Joi.string().allow('').required(),
        createdAt: Joi.string().required(),
        equipmentType: Joi.string().allow('').required()
    }).required(),
    generalData: Joi.object({
        ownerName: Joi.string().allow('').required(),
        userInCharge: Joi.string().allow('').required(),
        ownerAddress: Joi.string().allow('').required(),
        unitLocation: Joi.string().allow('').required()
    }).required(),
    technicalData: Joi.object({
        brandType: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        locationAndYearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        capacityWorkingLoad: Joi.string().allow('').required(),
        liftingSpeedMpm: Joi.string().allow('').required()
    }).required(),
    visualInspection: Joi.object({
        hasConstructionDefects: Joi.boolean().allow(true, false).required(),
        hookHasSafetyLatch: Joi.boolean().allow(true, false).required(),
        isEmergencyStopInstalled: Joi.boolean().allow(true, false).required(),
        isWireropeGoodCondition: Joi.boolean().allow(true, false).required(),
        operatorHasK3License: Joi.boolean().allow(true, false).required()
    }).required(),
    testing: Joi.object({
        functionTest: Joi.boolean().allow(true, false).required(),
        loadTest: Joi.object({
            loadTon: Joi.string().allow('').required(),
            isAbleToLift: Joi.boolean().allow(true, false).required(),
            hasLoadDrop: Joi.boolean().allow(true, false).required()
        }).required(),
        ndtTest: Joi.object({
            isNdtResultGood: Joi.boolean().allow(true, false).required(),
            hasCrackIndication: Joi.boolean().allow(true, false).required()
        }).required()
    }).required()
});

module.exports = {
    bapOverheadCranePayload,
};