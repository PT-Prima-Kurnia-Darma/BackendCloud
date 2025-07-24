'use strict';

const Joi = require('joi');

const bapPubtPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),
    inspectionDate: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),
    equipmentType: Joi.string().allow('').optional(),
    extraId: Joi.number().allow(null, '').optional(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        userUsage: Joi.string().allow('').optional(),
        userAddress: Joi.string().allow('').optional()
    }).optional(),

    technicalData: Joi.object({
        brandType: Joi.string().allow('').optional(),
        manufacturer: Joi.string().allow('').optional(),
        countryAndYearOfManufacture: Joi.string().allow('').optional(),
        serialNumberUnitNumber: Joi.string().allow('').optional(),
        fuelType: Joi.string().allow('').optional(),
        operatingPressure: Joi.string().allow('').optional(),
        designPressureKgCm2: Joi.number().allow(null).optional(),
        maxAllowableWorkingPressure: Joi.number().allow(null).optional(),
        technicalDataShellMaterial: Joi.string().allow('').optional(),
        safetyValveType: Joi.string().allow('').optional(),
        volumeLiters: Joi.number().allow(null).optional()
    }).optional(),

    visualInspection: Joi.object({
        foundationCondition: Joi.boolean().allow(null).optional(),
        safetyValveIsInstalled: Joi.boolean().allow(null).optional(),
        safetyValveCondition: Joi.boolean().allow(null).optional(),
        aparAvailable: Joi.boolean().allow(null).optional(),
        aparCondition: Joi.boolean().allow(null).optional(),
        wheelCondition: Joi.boolean().allow(null).optional(),
        pipeCondition: Joi.boolean().allow(null).optional()
    }).optional(),

    testing: Joi.object({
        ndtTestingFulfilled: Joi.boolean().allow(null).optional(),
        thicknessTestingComply: Joi.boolean().allow(null).optional(),
        pneumaticTestingCondition: Joi.boolean().allow(null).optional(),
        hydroTestingFullFilled: Joi.boolean().allow(null).optional(),
        safetyValveTestingCondition: Joi.boolean().allow(null).optional()
    }).optional()

}).min(1).unknown(false);

module.exports = {
    bapPubtPayload,
};