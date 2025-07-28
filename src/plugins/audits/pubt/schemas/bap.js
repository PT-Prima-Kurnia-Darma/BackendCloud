'use strict';

const Joi = require('joi');

const bapPubtPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').required(),
    inspectionType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    createdAt: Joi.string().allow('').required(),
    equipmentType: Joi.string().allow('').required(),
    extraId: Joi.number().required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        userUsage: Joi.string().allow('').required(),
        userAddress: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        brandType: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        countryAndYearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        fuelType: Joi.string().allow('').required(),
        operatingPressure: Joi.string().allow('').required(),
        designPressureKgCm2: Joi.string().allow('').required(),
        maxAllowableWorkingPressure: Joi.string().allow('').required(),
        technicalDataShellMaterial: Joi.string().allow('').required(),
        safetyValveType: Joi.string().allow('').required(),
        volumeLiters: Joi.string().allow('').required()
    }).required(),

    visualInspection: Joi.object({
        foundationCondition: Joi.boolean().allow(true, false).required(),
        safetyValveIsInstalled: Joi.boolean().allow(true, false).required(),
        safetyValveCondition: Joi.boolean().allow(true, false).required(),
        aparAvailable: Joi.boolean().allow(true, false).required(),
        aparCondition: Joi.boolean().allow(true, false).required(),
        wheelCondition: Joi.boolean().allow(true, false).required(),
        pipeCondition: Joi.boolean().allow(true, false).required()
    }).required(),

    testing: Joi.object({
        ndtTestingFulfilled: Joi.boolean().allow(true, false).required(),
        thicknessTestingComply: Joi.boolean().allow(true, false).required(),
        pneumaticTestingCondition: Joi.boolean().allow(true, false).required(),
        hydroTestingFullFilled: Joi.boolean().allow(true, false).required(),
        safetyValveTestingCondition: Joi.boolean().allow(true, false).required()
    }).required()

});

module.exports = {
    bapPubtPayload,
};