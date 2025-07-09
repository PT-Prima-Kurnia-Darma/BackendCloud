'use strict';

const Joi = require('joi');

const bapElevatorPayload = Joi.object({
    // Menyimpan ID laporan asal untuk keterhubungan data
    laporanId: Joi.string().allow('').required(),
    
    // Field-field utama dari BAP
    inspectionDate: Joi.string().allow('').optional(),
    examinationType: Joi.string().allow('').optional(),
    equipmentType: Joi.string().allow('').optional(),

    generalData: Joi.object({
        ownerName: Joi.string().allow('').optional(),
        ownerAddress: Joi.string().allow('').optional(),
        nameUsageLocation: Joi.string().allow('').optional(),
        addressUsageLocation: Joi.string().allow('').optional(),
    }).optional(),

    technicalData: Joi.object({
        elevatorType: Joi.string().allow('').optional(),
        manufacturerOrInstaller: Joi.string().allow('').optional(),
        brandOrType: Joi.string().allow('').optional(),
        countryAndYear: Joi.string().allow('').optional(),
        serialNumber: Joi.string().allow('').optional(),
        capacity: Joi.string().allow('').optional(),
        speed: Joi.string().allow('').optional(),
        floorsServed: Joi.string().allow('').optional(),
    }).optional(),

    visualInspection: Joi.object({
        isMachineRoomConditionAcceptable: Joi.boolean().optional(),
        isPanelGoodCondition: Joi.boolean().optional(),
        isAparAvailableInPanelRoom: Joi.boolean().optional(),
        lightingCondition: Joi.boolean().optional(), // Merepresentasikan kondisi baik/tidak baik
        isPitLadderAvailable: Joi.boolean().optional(),
    }).optional(),

    testing: Joi.object({
        isNdtThermographPanelOk: Joi.boolean().optional(),
        isArdFunctional: Joi.boolean().optional(),
        isGovernorFunctional: Joi.boolean().optional(),
        isSlingConditionOkByTester: Joi.boolean().optional(),
        limitSwitchTest: Joi.boolean().optional(), // Merepresentasikan berfungsi/tidak berfungsi
        isDoorSwitchFunctional: Joi.boolean().optional(),
        pitEmergencyStopStatus: Joi.boolean().optional(), // Merepresentasikan tersedia & berfungsi / tidak
        isIntercomFunctional: Joi.boolean().optional(),
        isFiremanSwitchFunctional: Joi.boolean().optional(),
    }).optional()
}).unknown(false).min(1);

module.exports = {
    bapElevatorPayload,
};