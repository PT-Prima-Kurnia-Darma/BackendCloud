'use strict';

const Joi = require('joi');

const bapElevatorPayload = Joi.object({
    // Menyimpan ID laporan asal untuk keterhubungan data
    laporanId: Joi.string().allow('').required(),
    
    // Field-field utama dari BAP
    inspectionDate: Joi.string().allow('').optional(),
    examinationType: Joi.string().allow('').optional(),
    equipmentType: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),
    extraId: Joi.number().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),

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
        isMachineRoomConditionAcceptable: Joi.boolean().allow(null).optional(),
        isPanelGoodCondition: Joi.boolean().allow(null).optional(),
        isAparAvailableInPanelRoom: Joi.boolean().allow(null).optional(),
        lightingCondition: Joi.boolean().allow(null).optional(),
        isPitLadderAvailable: Joi.boolean().allow(null).optional(),
    }).optional(),

    testing: Joi.object({
        isNdtThermographPanelOk: Joi.boolean().allow(null).optional(),
        isArdFunctional: Joi.boolean().allow(null).optional(),
        isGovernorFunctional: Joi.boolean().allow(null).optional(),
        isSlingConditionOkByTester: Joi.boolean().allow(null).optional(),
        limitSwitchTest: Joi.boolean().allow(null).optional(),
        isDoorSwitchFunctional: Joi.boolean().allow(null).optional(),
        pitEmergencyStopStatus: Joi.boolean().allow(null).optional(),
        isIntercomFunctional: Joi.boolean().allow(null).optional(),
        isFiremanSwitchFunctional: Joi.boolean().allow(null).optional(),
    }).optional()
}).unknown(false).min(1);

module.exports = {
    bapElevatorPayload,
};