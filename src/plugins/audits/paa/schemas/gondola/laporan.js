'use strict';

const Joi = require('joi');

const inspectionItemSchema = Joi.object({
    status: Joi.boolean().required(),
    result: Joi.string().allow('').optional()
});

const laporanGondolaPayload = Joi.object({
    inspectionType: Joi.string().required(),
    examinationType: Joi.string().required(),
    inspectionDate: Joi.string().required(),
    extraId: Joi.number().optional(),
    createdAt: Joi.string().optional(),

    generalData: Joi.object({
        ownerName: Joi.string().required(),
        ownerAddress: Joi.string().required(),
        userInCharge: Joi.string().optional(),
        subcontractorPersonInCharge: Joi.string().optional(),
        unitLocation: Joi.string().optional(),
        operatorName: Joi.string().optional(),
        equipmentType: Joi.string().required(),
        manufacturer: Joi.string().optional(),
        brandType: Joi.string().optional(),
        locationAndYearOfManufacture: Joi.string().optional(),
        serialNumberUnitNumber: Joi.string().optional(),
        capacityWorkingLoad: Joi.string().optional(),
        intendedUse: Joi.string().optional(),
        usagePermitNumber: Joi.string().optional(),
        operatorCertificate: Joi.string().optional()
    }).required(),

    technicalData: Joi.object({
        gondolaSpecification: Joi.object({
            supportMastHeight: Joi.number().optional(),
            frontBeamLength: Joi.number().optional(),
            middleBeamLength: Joi.number().optional(),
            rearBeamLength: Joi.number().optional(),
            balanceWeightDistance: Joi.number().optional(),
            capacity: Joi.string().optional(),
            speed: Joi.string().optional(),
            platformSize: Joi.string().optional(),
            wireRopeDiameter: Joi.number().optional()
        }).optional(),
        hoist: Joi.object({
            model: Joi.string().optional(),
            liftingCapacity: Joi.number().optional(),
            electricMotor: Joi.object({
                type: Joi.string().optional(),
                power: Joi.string().optional(),
                voltage: Joi.number().optional(),
                voltageHz: Joi.number().optional()
            }).optional()
        }).optional(),
        safetyLockType: Joi.string().optional(),
        brake: Joi.object({
            type: Joi.string().optional(),
            model: Joi.string().optional(),
            capacity: Joi.string().optional()
        }).optional(),
        suspensionMechanical: Joi.object({
            supportMastHeight: Joi.number().optional(),
            frontBeamLength: Joi.number().optional(),
            material: Joi.string().optional()
        }).optional(),
        machineWeight: Joi.object({
            totalPlatformWeight: Joi.number().optional(),
            suspensionMechanicalWeight: Joi.number().optional(),
            balanceWeight: Joi.number().optional(),
            totalMachineWeight: Joi.string().optional()
        }).optional()
    }).optional(),

    visualInspection: Joi.object({
        suspensionStructure: Joi.object().pattern(Joi.string(), inspectionItemSchema).optional(),
        steelWireRope: Joi.object().pattern(Joi.string(), inspectionItemSchema).optional(),
        electricalSystem: Joi.object().pattern(Joi.string(), inspectionItemSchema).optional(),
        platform: Joi.object().pattern(Joi.string(), inspectionItemSchema).optional(),
        safetyDevices: Joi.object().pattern(Joi.string(), inspectionItemSchema).optional()
    }).optional(),

    nonDestructiveTesting: Joi.object({
        steelCableRope: Joi.object({
            ndtType: Joi.string().optional(),
            items: Joi.array().items(Joi.object({
                usage: Joi.string().optional(),
                specDiameter: Joi.string().optional(),
                actualDiameter: Joi.string().optional(),
                construction: Joi.string().optional(),
                type: Joi.string().optional(),
                length: Joi.string().optional(),
                age: Joi.string().optional(),
                defectFound: Joi.boolean().optional(),
                result: Joi.string().optional()
            })).optional()
        }).optional(),
        suspensionStructure: Joi.object({
            ndtType: Joi.string().optional(),
            items: Joi.array().items(Joi.object({
                part: Joi.string().optional(),
                location: Joi.string().optional(),
                defectFound: Joi.boolean().optional(),
                result: Joi.string().optional()
            })).optional()
        }).optional(),
        gondolaCage: Joi.object({
            ndtType: Joi.string().optional(),
            items: Joi.array().items(Joi.object({
                part: Joi.string().optional(),
                location: Joi.string().optional(),
                defectFound: Joi.boolean().optional(),
                result: Joi.string().optional()
            })).optional()
        }).optional(),
        clamps: Joi.object({
            items: Joi.array().items(Joi.object({
                partCheck: Joi.string().optional(),
                location: Joi.string().optional(),
                defectFound: Joi.boolean().optional(),
                result: Joi.string().optional()
            })).optional()
        }).optional()
    }).optional(),

    testing: Joi.object({
        dynamicLoadTest: Joi.object({
            note: Joi.string().optional(),
            items: Joi.array().items(Joi.object({
                loadPercentage: Joi.string().optional(),
                loadDetails: Joi.string().optional(),
                remarks: Joi.string().optional(),
                result: Joi.string().optional()
            })).optional()
        }).optional(),
        staticLoadTest: Joi.object({
            note: Joi.string().optional(),
            items: Joi.array().items(Joi.object({
                loadPercentage: Joi.string().optional(),
                loadDetails: Joi.string().optional(),
                remarks: Joi.string().optional(),
                result: Joi.string().optional()
            })).optional()
        }).optional()
    }).optional(),

    conclusion: Joi.string().optional(),
    recommendation: Joi.string().optional()
});

module.exports = {
    laporanGondolaPayload,
};