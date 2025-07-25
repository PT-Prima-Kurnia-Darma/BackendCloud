'use strict';

const Joi = require('joi');

const bapPtpMotorDieselPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').optional(),
    inspectionDate: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),
    extraId: Joi.number().allow(null, '').optional(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        unitLocation: Joi.string().allow('').optional(),
        userAddressInCharge: Joi.string().allow('').optional()
    }).optional(),

    technicalData: Joi.object({
        brandType: Joi.string().allow('').optional(),
        manufacturer: Joi.string().allow('').optional(),
        locationAndYearOfManufacture: Joi.string().allow('').optional(),
        serialNumberUnitNumber: Joi.string().allow('').optional(),
        capacityWorkingLoad: Joi.string().allow('').optional(),
        technicalDataDieselMotorPowerRpm: Joi.string().allow('').optional(),
        specialSpecification: Joi.string().allow('').optional(),
        dimensionsDescription: Joi.string().allow('').optional(),
        rotationRpm: Joi.string().allow('').optional(),
        technicalDataGeneratorFrequency: Joi.string().allow('').optional(),
        technicalDataGeneratorCurrent: Joi.string().allow('').optional(),
        machineWeightKg: Joi.string().allow('').optional(),
        areSafetyFeaturesInstalled: Joi.string().allow('').optional()
    }).optional(),

    visualChecks: Joi.object({
        isMachineGoodCondition: Joi.boolean().allow(null).optional(),
        areElectricalIndicatorsGood: Joi.boolean().allow(null).optional(),
        isAparAvailable: Joi.boolean().allow(null).optional(),
        isPpeAvailable: Joi.boolean().allow(null).optional(),
        isGroundingInstalled: Joi.boolean().allow(null).optional(),
        isBatteryGoodCondition: Joi.boolean().allow(null).optional(),
        hasLubricationLeak: Joi.boolean().allow(null).optional(),
        isFoundationGoodCondition: Joi.boolean().allow(null).optional(),
        hasHydraulicLeak: Joi.boolean().allow(null).optional()
    }).optional(),

    functionalTests: Joi.object({
        isLightingCompliant: Joi.boolean().allow(null).optional(),
        isNoiseLevelCompliant: Joi.boolean().allow(null).optional(),
        isEmergencyStopFunctional: Joi.boolean().allow(null).optional(),
        isMachineFunctional: Joi.boolean().allow(null).optional(),
        isVibrationLevelCompliant: Joi.boolean().allow(null).optional(),
        isInsulationResistanceOk: Joi.boolean().allow(null).optional(),
        isShaftRotationCompliant: Joi.boolean().allow(null).optional(),
        isGroundingResistanceCompliant: Joi.boolean().allow(null).optional(),
        isNdtWeldTestOk: Joi.boolean().allow(null).optional(),
        isVoltageBetweenPhasesNormal: Joi.boolean().allow(null).optional(),
        isPhaseLoadBalanced: Joi.boolean().allow(null).optional()
    }).optional()

}).min(1).unknown(false);

module.exports = {
    bapPtpMotorDieselPayload,
};