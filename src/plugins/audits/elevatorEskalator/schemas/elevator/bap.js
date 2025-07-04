'use strict';

const Joi = require('joi');

const bapElevatorPayload = Joi.object({
    // Menyimpan ID laporan asal untuk keterhubungan data
    laporanId: Joi.string().allow('').optional(),
    
    // Field-field utama dari BAP
    day: Joi.string().allow('').optional(),
    typeInspection: Joi.string().allow('').optional(),
    EskOrElevType: Joi.string().allow('').optional(),

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
        isMachineRoomConditionAcceptable: Joi.string().allow('').optional(),
        isPanelGoodCondition: Joi.string().allow('').optional(),
        isAparAvailableInPanelRoom: Joi.string().allow('').optional(),
        lightingCondition: Joi.string().allow('').optional(),
        isPitLadderAvailable: Joi.string().allow('').optional(),
    }).optional(),

    testing: Joi.object({
        isNdtThermographPanelOk: Joi.string().allow('').optional(),
        isArdFunctional: Joi.string().allow('').optional(),
        isGovernorFunctional: Joi.string().allow('').optional(),
        isSlingConditionOkByTester: Joi.string().allow('').optional(),
        limitSwitchTest: Joi.string().allow('').optional(),
        isDoorSwitchFunctional: Joi.string().allow('').optional(),
        pitEmergencyStopStatus: Joi.string().allow('').optional(),
        isIntercomFunctional: Joi.string().allow('').optional(),
        isFiremanSwitchFunctional: Joi.string().allow('').optional(),
    }).optional(),
});

module.exports = {
    bapElevatorPayload,
};