'use strict';

const Joi = require('joi');

const bapElevatorPayload = Joi.object({
    // Menyimpan ID laporan asal untuk keterhubungan data
    laporanId: Joi.string().required(),
    
    // Field-field utama dari BAP
    inspectionDate: Joi.string().allow('').required(),
    examinationType: Joi.string().allow('').required(),
    equipmentType: Joi.string().allow('').required(),
    createdAt: Joi.string().required(),
    extraId: Joi.number().required(),
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
        isMachineRoomConditionAcceptable: Joi.boolean().allow(true, false).allow(true, false).required(),
        isPanelGoodCondition: Joi.boolean().allow(true, false).required(),
        isAparAvailableInPanelRoom: Joi.boolean().allow(true, false).required(),
        lightingCondition: Joi.boolean().allow(true, false).required(),
        isPitLadderAvailable: Joi.boolean().allow(true, false).required(),
    }).required(),

    testing: Joi.object({
        isNdtThermographPanelOk: Joi.boolean().allow(true, false).required(),
        isArdFunctional: Joi.boolean().allow(true, false).required(),
        isGovernorFunctional: Joi.boolean().allow(true, false).required(),
        isSlingConditionOkByTester: Joi.boolean().allow(true, false).required(),
        limitSwitchTest: Joi.boolean().allow(true, false).required(),
        isDoorSwitchFunctional: Joi.boolean().allow(true, false).required(),
        pitEmergencyStopStatus: Joi.boolean().allow(true, false).required(),
        isIntercomFunctional: Joi.boolean().allow(true, false).required(),
        isFiremanSwitchFunctional: Joi.boolean().allow(true, false).required(),
    }).required()
});

module.exports = {
    bapElevatorPayload,
};