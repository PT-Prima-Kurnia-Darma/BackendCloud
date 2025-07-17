'use strict';

const Joi = require('joi');

const bapGantryCranePayload = Joi.object({
  // ID dari laporan utama untuk sinkronisasi data (jika ada)
  laporanId: Joi.string().optional(),
  
  examinationType: Joi.string().allow('').optional(),
  inspectionType: Joi.string().allow('').optional(),
  subInspectionType: Joi.string().allow('').optional(),
  inspectionDate: Joi.string().allow('').optional(),
  createdAt: Joi.string().allow('').optional(),
  extraId: Joi.number().allow('').optional(),

  generalData: Joi.object({
    companyName: Joi.string().allow('').optional(),
    companyLocation: Joi.string().allow('').optional(),
    usageLocation: Joi.string().allow('').optional(),
    location: Joi.string().allow('').optional(),
  }).optional(),

  technicalData: Joi.object({
    brandOrType: Joi.string().allow('').optional(),
    manufacturerHoist: Joi.string().allow('').optional(),
    manufactureStructure: Joi.string().allow('').optional(),
    manufactureYear: Joi.string().allow('').optional(),
    manufactureCountry: Joi.string().allow('').optional(),
    serialNumber: Joi.string().allow('').optional(),
    maxLiftingCapacityKg: Joi.string().allow('').optional(),
    liftingSpeedMpm: Joi.string().allow('').optional(),
  }).optional(),

  inspectionResult: Joi.object({
    visualCheck: Joi.object({
      isMainStructureGood: Joi.boolean().required(),
      areBoltsAndNutsSecure: Joi.boolean().required(),
      isWireRopeGoodCondition: Joi.boolean().required(),
      isHookGoodCondition: Joi.boolean().required(),
      isGearboxGoodCondition: Joi.boolean().required(),
      hasGearboxOilLeak: Joi.boolean().required(),
      isWarningLampGoodCondition: Joi.boolean().required(),
      isCapacityMarkingDisplayed: Joi.boolean().required(),
    }).optional(),
    functionalTest: Joi.object({
      isForwardReverseFunctionOk: Joi.boolean().required(),
      isHoistingFunctionOk: Joi.boolean().required(),
      isLimitSwitchFunctional: Joi.boolean().required(),
    }).optional(),
    ndtTest: Joi.object({
      method: Joi.string().allow('').optional(),
      isNdtResultGood: Joi.boolean().required(),
    }).optional(),
    loadTest: Joi.object({
      loadKg: Joi.string().allow('').optional(),
      liftHeightMeters: Joi.string().allow('').optional(),
      holdTimeSeconds: Joi.string().allow('').optional(),
      isLoadTestResultGood: Joi.boolean().required(),
    }).optional(),
  }).optional(),
}).min(1).unknown(false);

module.exports = {
    bapGantryCranePayload,
};