'use strict';

const Joi = require('joi');

const bapElevatorPayload = Joi.object({
    // Menyimpan ID laporan asal untuk keterhubungan data
    laporanId: Joi.string().allow('').required(),
    
    // Field-field utama dari BAP
    inspectionDate: Joi.string().allow('').required(),
    examinationType: Joi.string().allow('').required(),
    equipmentType: Joi.string().allow('').required(),
    createdAt: Joi.string().allow('').required(),
    extraId: Joi.number().allow('').required(),
    inspectionType: Joi.string().allow('').required(),

    generalData: Joi.object({
        ownerName: Joi.string().allow('').required(),
        ownerAddress: Joi.string().allow('').required(),
        nameUsageLocation: Joi.string().allow('').required(),
        addressUsageLocation: Joi.string().allow('').required(),
    }).required(),

    technicalData: Joi.object({
        elevatorType: Joi.string().allow('').required(),
        manufacturerOrInstaller: Joi.string().allow('').required(),
        brandOrType: Joi.string().allow('').required(),
        countryAndYear: Joi.string().allow('').required(),
        serialNumber: Joi.string().allow('').required(),
        capacity: Joi.string().allow('').required(),
        speed: Joi.string().allow('').required(),
        floorsServed: Joi.string().allow('').required(),
    }).required(),

    visualInspection: Joi.object({
        isMachineRoomConditionAcceptable: Joi.boolean().allow(null).required(),
        isPanelGoodCondition: Joi.boolean().allow(null).required(),
        isAparAvailableInPanelRoom: Joi.boolean().allow(null).required(),
        lightingCondition: Joi.boolean().allow(null).required(),
        isPitLadderAvailable: Joi.boolean().allow(null).required(),
    }).required(),

    testing: Joi.object({
        isNdtThermographPanelOk: Joi.boolean().allow(null).required(),
        isArdFunctional: Joi.boolean().allow(null).required(),
        isGovernorFunctional: Joi.boolean().allow(null).required(),
        isSlingConditionOkByTester: Joi.boolean().allow(null).required(),
        limitSwitchTest: Joi.boolean().allow(null).required(),
        isDoorSwitchFunctional: Joi.boolean().allow(null).required(),
        pitEmergencyStopStatus: Joi.boolean().allow(null).required(),
        isIntercomFunctional: Joi.boolean().allow(null).required(),
        isFiremanSwitchFunctional: Joi.boolean().allow(null).required(),
    }).required()
}).unknown(false).min(1);

module.exports = {
    bapElevatorPayload,
};