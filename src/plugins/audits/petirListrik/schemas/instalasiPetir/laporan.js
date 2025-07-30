'use strict';

const Joi = require('joi');

const dynamicTestItemSchema = Joi.object({
    ecResult: Joi.string().allow('').required(),
    epResult: Joi.string().allow('').required(),
    rValue: Joi.string().allow('').required(),
    result: Joi.string().allow('').required()
});

const dynamicItemSchema = Joi.object({
    materialConditionsItems: Joi.string().allow('').required(),
    outcomeBaik: Joi.boolean().allow(true, false).required(),
    outcomeBuruk: Joi.boolean().allow(true, false).required(),
    rGradeItems: Joi.string().allow('').required(),
    result: Joi.string().allow('').required()
});

const laporanPetirPayload = Joi.object({
    createdAt: Joi.string().required(), 
    examinationType: Joi.string().allow('').required(),
    equipmentType: Joi.string().allow('').required(),
    inspectionType: Joi.string().allow('').required(),
    extraId: Joi.number().required(),

    pjk3Data: Joi.object({
        companyNameandaddres: Joi.string().allow('').required(),
        companyPermitNo: Joi.string().allow('').required(),
        expertPermitNo: Joi.string().allow('').required(),
        expertName: Joi.string().allow('').required(),
        riksaujiTools: Joi.string().allow('').required()
    }).required(),

    ownerData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        usageLocation: Joi.string().allow('').required(),
        objectType: Joi.string().allow('').required(),
        typeInspection: Joi.string().allow('').required(),
        certificateNo: Joi.string().allow('').required(),
        inspectionDate: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        conductorType: Joi.string().allow('').required(),
        buildingHeight: Joi.string().allow('').required(),
        buildingArea: Joi.string().allow('').required(),
        receiverHeight: Joi.string().allow('').required(),
        receiverCount: Joi.string().allow('').required(),
        testJointCount: Joi.string().allow('').required(),
        conductorDescription: Joi.string().allow('').required(),
        groundingResistance: Joi.string().allow('').required(),
        spreadingResistance: Joi.string().allow('').required(),
        installer: Joi.string().allow('').required()
    }).required(),

    physicalInspection: Joi.object({
        installationSystem: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        receiverHead: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        receiverPole: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        poleReinforcement: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        downConductor: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        conductorClamps: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        jointConnections: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        groundingTerminalBox: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        controlBox: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        groundingSystem: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        conductorToGroundConnection: Joi.object({ good: Joi.boolean().allow(true, false), fair: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false) }).required(),
        notes: Joi.string().allow('').required()
    }).required(),

    visualInspection: Joi.object({
        airTerminal: Joi.string().allow('').required(),
        downConductorCheck: Joi.string().allow('').required(),
        groundingAndTestJoint: Joi.string().allow('').required()
    }).required(),

    standardCompliance: Joi.object({
        asBuiltDrawing: Joi.object({ good: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false), notes: Joi.string().allow('') }).required(),
        terminalToConductorConnection: Joi.object({ good: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false), notes: Joi.string().allow('') }).required(),
        downConductorJoints: Joi.object({ good: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false), notes: Joi.string().allow('') }).required(),
        testJointBoxInstallation: Joi.object({ good: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false), notes: Joi.string().allow('') }).required(),
        conductorMaterialStandard: Joi.object({ good: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false), notes: Joi.string().allow('') }).required(),
        lightningCounter: Joi.object({ good: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false), notes: Joi.string().allow('') }).required(),
        radioactiveTerminal: Joi.object({ good: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false), notes: Joi.string().allow('') }).required(),
        groundingRodMaterial: Joi.object({ good: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false), notes: Joi.string().allow('') }).required(),
        arresterInstallation: Joi.object({ good: Joi.boolean().allow(true, false), poor: Joi.boolean().allow(true, false), notes: Joi.string().allow('') }).required()
    }).required(),

    dynamicTestItems: Joi.array().items(dynamicTestItemSchema).required(),
    dynamicItems: Joi.array().items(dynamicItemSchema).required(),

    conclusion: Joi.string().allow('').required(),
    recomendations: Joi.string().allow('').required()

});

module.exports = {
    laporanPetirPayload,
};