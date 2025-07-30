'use strict';

const Joi = require('joi');

const bapPtpMotorDieselPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    createdAt: Joi.string().required(),
    extraId: Joi.number().required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        unitLocation: Joi.string().allow('').required(),
        userAddressInCharge: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        brandType: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        locationAndYearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        capacityWorkingLoad: Joi.string().allow('').required(),
        technicalDataDieselMotorPowerRpm: Joi.string().allow('').required(),
        specialSpecification: Joi.string().allow('').required(),
        dimensionsDescription: Joi.string().allow('').required(),
        rotationRpm: Joi.string().allow('').required(),
        technicalDataGeneratorFrequency: Joi.string().allow('').required(),
        technicalDataGeneratorCurrent: Joi.string().allow('').required(),
        machineWeightKg: Joi.string().allow('').required(),
        areSafetyFeaturesInstalled: Joi.boolean().allow(true, false).required()
    }).required(),

    visualChecks: Joi.object({
        isMachineGoodCondition: Joi.boolean().allow(true, false).required(),
        areElectricalIndicatorsGood: Joi.boolean().allow(true, false).required(),
        isAparAvailable: Joi.boolean().allow(true, false).required(),
        isPpeAvailable: Joi.boolean().allow(true, false).required(),
        isGroundingInstalled: Joi.boolean().allow(true, false).required(),
        isBatteryGoodCondition: Joi.boolean().allow(true, false).required(),
        hasLubricationLeak: Joi.boolean().allow(true, false).required(),
        isFoundationGoodCondition: Joi.boolean().allow(true, false).required(),
        hasHydraulicLeak: Joi.boolean().allow(true, false).required()
    }).required(),

    functionalTests: Joi.object({
        isLightingCompliant: Joi.boolean().allow(true, false).required(),
        isNoiseLevelCompliant: Joi.boolean().allow(true, false).required(),
        isEmergencyStopFunctional: Joi.boolean().allow(true, false).required(),
        isMachineFunctional: Joi.boolean().allow(true, false).required(),
        isVibrationLevelCompliant: Joi.boolean().allow(true, false).required(),
        isInsulationResistanceOk: Joi.boolean().allow(true, false).required(),
        isShaftRotationCompliant: Joi.boolean().allow(true, false).required(),
        isGroundingResistanceCompliant: Joi.boolean().allow(true, false).required(),
        isNdtWeldTestOk: Joi.boolean().allow(true, false).required(),
        isVoltageBetweenPhasesNormal: Joi.boolean().allow(true, false).required(),
        isPhaseLoadBalanced: Joi.boolean().allow(true, false).required()
    }).required()

});

module.exports = {
    bapPtpMotorDieselPayload,
};