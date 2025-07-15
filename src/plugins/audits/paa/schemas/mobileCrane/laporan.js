'use strict';

const Joi = require('joi');

// Skema dasar untuk item inspeksi (status dan hasil)
const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(null).required(),
    result: Joi.string().allow('', null).optional()
});

// Skema untuk setiap baris pada tabel NDT Boom (dinamis)
const ndtBoomInspectionItemSchema = Joi.object({
    part: Joi.string().allow('').optional(),
    location: Joi.string().allow('').optional(),
    result: inspectionItemSchema.optional()
});

// Skema untuk setiap baris pada tabel Uji Beban (dinamis)
const loadTestItemSchema = Joi.object({
    boomLength: Joi.string().allow('').optional(),
    radius: Joi.string().allow('').optional(),
    boomAngle: Joi.string().allow('').optional(),
    testLoad: Joi.string().allow('').optional(),
    safeWorkingLoad: Joi.string().allow('').optional(),
    result: Joi.string().allow('').optional()
});

// === SKEMA UTAMA LAPORAN MOBILE CRANE ===
const laporanMobileCranePayload = Joi.object({
    inspectionType: Joi.string().required(),
    equipmentType: Joi.string().required(),
    examinationType: Joi.string().required(),
    subInspectionType: Joi.string().allow('').optional(),
    createdAt: Joi.date().optional(),
    extraId: Joi.number().allow('').optional(),

    generalData: Joi.object({
        generalDataOwnerName: Joi.string().required(),
        generalDataOwnerAddress: Joi.string().allow('').optional(),
        generalDataUserSubcontractorPersonInCharge: Joi.string().allow('').optional(),
        generalDataUserAddress: Joi.string().allow('').optional(),
        generalDataUnitLocation: Joi.string().allow('').optional(),
        generalDataOperatorName: Joi.string().allow('').optional(),
        generalDataManufacturer: Joi.string().allow('').optional(),
        generalDataBrandType: Joi.string().allow('').optional(),
        generalDataLocationAndYearOfManufacture: Joi.string().allow('').optional(),
        generalDataSerialNumberUnitNumber: Joi.string().allow('').optional(),
        generalDataCapacityWorkingLoad: Joi.string().allow('').optional(),
        generalDataIntendedUse: Joi.string().allow('').optional(),
        generalDataUsagePermitNumber: Joi.string().allow('').optional(),
        generalDataOperatorCertificate: Joi.string().allow('').optional(),
        generalDataEquipmentHistory: Joi.string().allow('').optional(),
        generalDataInspectionDate: Joi.string().required()
    }).required(),

    technicalData: Joi.object({
        technicalDataMaximumWorkingLoadCapacity: Joi.string().allow('').optional(),
        technicalDataBoomLength: Joi.string().allow('').optional(),
        technicalDataMaximumJibLength: Joi.string().allow('').optional(),
        technicalDataMaximumJibWorkingLoad: Joi.string().allow('').optional(),
        technicalDataMaxBoomJibLength: Joi.string().allow('').optional(),
        technicalDataCraneWeight: Joi.string().allow('').optional(),
        technicalDataMaxLiftingHeight: Joi.string().allow('').optional(),
        technicalDataBoomWorkingAngle: Joi.string().allow('').optional(),
        technicalDataEngineNumber: Joi.string().allow('').optional(),
        technicalDataType: Joi.string().allow('').optional(),
        technicalDataNumberOfCylinders: Joi.string().allow('').optional(),
        technicalDataNetPower: Joi.string().allow('').optional(),
        technicalDataBrandYearOfManufacture: Joi.string().allow('').optional(),
        technicalDataHookManufacturer: Joi.string().allow('').optional(),
        technicalDataMainHookType: Joi.string().allow('').optional(),
        technicalDataMainHookCapacity: Joi.string().allow('').optional(),
        technicalDataMainHookMaterial: Joi.string().allow('').optional(),
        technicalDataMainHookSerialNumber: Joi.string().allow('').optional(),
        technicalDataAuxiliaryHookType: Joi.string().allow('').optional(),
        technicalDataAuxiliaryHookCapacity: Joi.string().allow('').optional(),
        technicalDataAuxiliaryHookMaterial: Joi.string().allow('').optional(),
        technicalDataAuxiliaryHookSerialNumber: Joi.string().allow('').optional(),
        technicalDataWireRopeMainLoadHoistDrumDiameter: Joi.string().allow('').optional(),
        technicalDataWireRopeMainLoadHoistDrumType: Joi.string().allow('').optional(),
        technicalDataWireRopeMainLoadHoistDrumConstruction: Joi.string().allow('').optional(),
        technicalDataWireRopeMainLoadHoistDrumBreakingStrength: Joi.string().allow('').optional(),
        technicalDataWireRopeMainLoadHoistDrumLength: Joi.string().allow('').optional(),
        technicalDataWireRopeAuxiliaryLoadHoistDrumDiameter: Joi.string().allow('').optional(),
        technicalDataWireRopeAuxiliaryLoadHoistDrumType: Joi.string().allow('').optional(),
        technicalDataWireRopeAuxiliaryLoadHoistDrumConstruction: Joi.string().allow('').optional(),
        technicalDataWireRopeAuxiliaryLoadHoistDrumLength: Joi.string().allow('').optional(),
        technicalDataWireRopeAuxiliaryLoadHoistDrumBreakingStrength: Joi.string().allow('').optional(),
        technicalDataWireRopeBoomHoistDrumDiameter: Joi.string().allow('').optional(),
        technicalDataWireRopeBoomHoistDrumType: Joi.string().allow('').optional(),
        technicalDataWireRopeBoomHoistDrumConstruction: Joi.string().allow('').optional(),
        technicalDataWireRopeBoomHoistDrumLength: Joi.string().allow('').optional(),
        technicalDataWireRopeBoomHoistDrumBreakingStrength: Joi.string().allow('').optional()
    }).optional(),

    inspectionAndTesting: Joi.object().pattern(
        Joi.string(), Joi.any() // Memperbolehkan kunci apa pun di dalam objek ini
    ).optional(),

    conclusion: Joi.string().allow('').optional(),
    recommendation: Joi.string().allow('').optional()

}).unknown(true); // Memperbolehkan kunci lain yang tidak didefinisikan secara eksplisit

module.exports = {
    laporanMobileCranePayload,
};