'use strict';

const Joi = require('joi');

const bapGantryCranePayload = Joi.object({

  laporanId: Joi.string().required(),
  
  examinationType: Joi.string().allow('').required(),
  inspectionType: Joi.string().allow('').required(),
  inspectionDate: Joi.string().allow('').required(),
  equipmentType: Joi.string().allow('').required(),
  createdAt: Joi.string().allow('').required(),
  extraId: Joi.number().required(),

  generalData: Joi.object({
    companyName: Joi.string().allow('').required(),
    companyLocation: Joi.string().allow('').required(),
    usageLocation: Joi.string().allow('').required(),
    location: Joi.string().allow('').required(),
  }).required(),

  technicalData: Joi.object({
    brandOrType: Joi.string().allow('').required(),
    manufacturerHoist: Joi.string().allow('').required(),
    manufactureStructure: Joi.string().allow('').required(),
    manufactureYear: Joi.string().allow('').required(),
    manufactureCountry: Joi.string().allow('').required(),
    serialNumber: Joi.string().allow('').required(),
    maxLiftingCapacityKg: Joi.string().allow('').required(),
    liftingSpeedMpm: Joi.string().allow('').required(),
  }).required(),

  inspectionResult: Joi.object({
    visualCheck: Joi.object({
      isMainStructureGood: Joi.boolean().allow(true, false).required(),
      areBoltsAndNutsSecure: Joi.boolean().allow(true, false).required(),
      isWireRopeGoodCondition: Joi.boolean().allow(true, false).required(),
      isHookGoodCondition: Joi.boolean().allow(true, false).required(),
      isGearboxGoodCondition: Joi.boolean().allow(true, false).required(),
      hasGearboxOilLeak: Joi.boolean().allow(true, false).required(),
      isWarningLampGoodCondition: Joi.boolean().allow(true, false).required(),
      isCapacityMarkingDisplayed: Joi.boolean().allow(true, false).required(),
    }).required(),
    functionalTest: Joi.object({
      isForwardReverseFunctionOk: Joi.boolean().allow(true, false).required(),
      isHoistingFunctionOk: Joi.boolean().allow(true, false).required(),
      isLimitSwitchFunctional: Joi.boolean().allow(true, false).required(),
    }).required(),
    ndtTest: Joi.object({
      method: Joi.string().allow('').required(),
      isNdtResultGood: Joi.boolean().allow(true, false).required(),
    }).required(),
    loadTest: Joi.object({
      loadKg: Joi.string().allow('').required(),
      liftHeightMeters: Joi.string().allow('').required(),
      holdTimeSeconds: Joi.string().allow('').required(),
      isLoadTestResultGood: Joi.boolean().allow(true, false).required(),
    }).required(),
  }).required(),
});

module.exports = {
    bapGantryCranePayload,
};