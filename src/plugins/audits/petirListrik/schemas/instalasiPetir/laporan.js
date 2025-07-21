'use strict';

const Joi = require('joi');

const dynamicTestItemSchema = Joi.object({
    ecResult: Joi.string().allow('').optional(),
    epResult: Joi.string().allow('').optional(),
    rValue: Joi.number().allow(null).optional(),
    result: Joi.string().allow('').optional()
});

const dynamicItemSchema = Joi.object({
    materialConditionsItems: Joi.string().allow('').optional(),
    outcomeBaik: Joi.boolean().allow(null).optional(),
    outcomeBuruk: Joi.boolean().allow(null).optional(),
    rGradeItems: Joi.string().allow('').optional(),
    result: Joi.string().allow('').optional()
});

const laporanPetirPayload = Joi.object({
    createdAt: Joi.string().allow('').optional(), 
    examinationType: Joi.string().allow('').optional(),
    equipmentType: Joi.string().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),
    extraId: Joi.alternatives().try(Joi.number(), Joi.string().valid('')).optional(),

    pjk3Data: Joi.object({
        companyNameandaddres: Joi.string().allow('').optional(),
        companyPermitNo: Joi.string().allow('').optional(),
        expertPermitNo: Joi.string().allow('').optional(),
        expertName: Joi.string().allow('').optional(),
        riksaujiTools: Joi.string().allow('').optional()
    }).optional(),

    ownerData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        usageLocation: Joi.string().allow('').optional(),
        objectType: Joi.string().allow('').optional(),
        typeInspection: Joi.string().allow('').optional(),
        certificateNo: Joi.string().allow('').optional(),
        inspectionDate: Joi.string().allow('').optional()
    }).optional(),

    technicalData: Joi.object({
        conductorType: Joi.string().allow('').optional(),
        buildingHeight: Joi.string().allow('').optional(),
        buildingArea: Joi.string().allow('').optional(),
        receiverHeight: Joi.string().allow('').optional(),
        receiverCount: Joi.number().allow('').optional(),
        testJointCount: Joi.number().allow('').optional(),
        conductorDescription: Joi.string().allow('').optional(),
        groundingResistance: Joi.string().allow('').optional(),
        installationYear: Joi.string().allow('').optional(),
        installer: Joi.string().allow('').optional()
    }).optional(),

    physicalInspection: Joi.object({
        installationSystem: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        receiverHead: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        receiverPole: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        poleReinforcement: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        downConductor: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        conductorClamps: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        jointConnections: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        groundingTerminalBox: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        controlBox: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        groundingSystem: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        conductorToGroundConnection: Joi.object({ good: Joi.boolean(), fair: Joi.boolean(), poor: Joi.boolean() }).optional(),
        notes: Joi.string().allow('').optional()
    }).optional(),

    visualInspection: Joi.object({
        airTerminal: Joi.string().allow('').optional(),
        downConductorCheck: Joi.string().allow('').optional(),
        groundingAndTestJoint: Joi.string().allow('').optional()
    }).optional(),

    standardCompliance: Joi.object({
        asBuiltDrawing: Joi.object({ good: Joi.boolean(), poor: Joi.boolean(), notes: Joi.string().allow('') }).optional(),
        terminalToConductorConnection: Joi.object({ good: Joi.boolean(), poor: Joi.boolean(), notes: Joi.string().allow('') }).optional(),
        downConductorJoints: Joi.object({ good: Joi.boolean(), poor: Joi.boolean(), notes: Joi.string().allow('') }).optional(),
        testJointBoxInstallation: Joi.object({ good: Joi.boolean(), poor: Joi.boolean(), notes: Joi.string().allow('') }).optional(),
        conductorMaterialStandard: Joi.object({ good: Joi.boolean(), poor: Joi.boolean(), notes: Joi.string().allow('') }).optional(),
        lightningCounter: Joi.object({ good: Joi.boolean(), poor: Joi.boolean(), notes: Joi.string().allow('') }).optional(),
        radioactiveTerminal: Joi.object({ good: Joi.boolean(), poor: Joi.boolean(), notes: Joi.string().allow('') }).optional(),
        groundingRodMaterial: Joi.object({ good: Joi.boolean(), poor: Joi.boolean(), notes: Joi.string().allow('') }).optional(),
        arresterInstallation: Joi.object({ good: Joi.boolean(), poor: Joi.boolean(), notes: Joi.string().allow('') }).optional()
    }).optional(),

    dynamicTestItems: Joi.array().items(dynamicTestItemSchema).optional(),
    dynamicItems: Joi.array().items(dynamicItemSchema).optional(),

    conclusion: Joi.string().allow('').optional(),
    recomendations: Joi.string().allow('').optional()

}).min(1).unknown(false); // <--- Aturan ketat tetap dipertahankan

module.exports = {
    laporanPetirPayload,
};