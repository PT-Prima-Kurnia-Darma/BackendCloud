'use strict';

const Joi = require('joi');

// Skema untuk data Laporan Penyaluran Petir (Struktur Datar Terbaru)
const laporanPetirPayload = Joi.object({
    // Data Utama
    typeInspection: Joi.string().required(),
    inspectionSchedule: Joi.date().required(),
    companyName: Joi.string().required(),
    companyLocation: Joi.string().required(),
    owner: Joi.string().required(),
    user: Joi.string().required(),
    usageLocation: Joi.string().required(),
    operatorName: Joi.string().required(),
    qualificationType: Joi.string().required(),
    instalatir: Joi.string().required(),
    type: Joi.string().required(),
    yearManufacture: Joi.number().required(),
    model: Joi.string().required(),
    protectionZone: Joi.string().required(),
    numberUsageAuthorization: Joi.string().required(),

    // Properti dari 'terminal_water'
    typeTerminalWater: Joi.string().required(),
    height: Joi.number().required(),
    size: Joi.number().required(),
    total: Joi.number().required(), // <-- Tambahan baru
    visualConditionWaterTerminal: Joi.string().required(), // <-- Tambahan baru
    heightReceiver: Joi.number().required(), // <-- Tambahan baru

    // Properti dari 'down_conductor'
    typeDownConductor: Joi.string().required(),
    totalDownConductor: Joi.string().required(),
    sizeDownConductor: Joi.number().required(),

    // Properti dari 'earth_electrode'
    typeEarthElectrode: Joi.string().required(),
    sizeEarthElectrode: Joi.number().required(),

    // Opsional, untuk diisi oleh LLM
    conclusion: Joi.string().allow('').optional(),
    recomendation: Joi.string().allow('').optional()
});

module.exports = {
    laporanPetirPayload,
};