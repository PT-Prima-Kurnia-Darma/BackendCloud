'use strict';

const Joi = require('joi');

// Skema untuk data Laporan Penyaluran Petir dengan struktur NESTED
const laporanPetirPayload = Joi.object({
    // Data Utama
    typeInspection: Joi.string().required(),
    inspectionSchedule: Joi.string().required(), // Menggunakan string untuk fleksibilitas tanggal
    companyName: Joi.string().required(),
    companyLocation: Joi.string().required(),
    owner: Joi.string().required(),
    user: Joi.string().required(),
    usageLocation: Joi.string().required(),
    operatorName: Joi.string().required(),
    qualificationType: Joi.string().required(),
    instalatir: Joi.string().required(),
    type: Joi.string().required(),
    yearManufacture: Joi.string().required(), // Diubah ke string untuk konsistensi
    model: Joi.string().required(),
    protectionZone: Joi.string().required(),
    numberUsageAuthorization: Joi.string().required(),

    // Objek Nested untuk Terminal Air
    terminal_water: Joi.object({
        typeTerminalWater: Joi.string().required(),
        protectedBuilding: Joi.object({
            height: Joi.number().required(),
            size: Joi.number().required()
        }).required(),
        total: Joi.number().required(),
        visualConditionWaterTerminal: Joi.string().required(),
        heightReceiver: Joi.number().required()
    }).required(),

    // Objek Nested untuk Down Conductor
    down_conductor: Joi.object({
        typeDownConductor: Joi.string().required(),
        totalDownConductor: Joi.string().required(),
        sizeDownConductor: Joi.number().required()
    }).required(),

    // Objek Nested untuk Earth Electrode
    earth_electrode: Joi.object({
        typeEarthElectrode: Joi.string().required(),
        sizeEarthElectrode: Joi.number().required()
    }).required(),

    // Kesimpulan dan Rekomendasi
    conclusion: Joi.string().allow('').optional(),
    recomendation: Joi.string().allow('').optional()
});

module.exports = {
    laporanPetirPayload,
};