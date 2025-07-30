'use strict';

const Joi = require('joi');

const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(true, false).required(),
    result: Joi.string().allow('').required()
});

const laporanGondolaPayload = Joi.object({
    inspectionType: Joi.string().allow('').required(),
    examinationType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    extraId: Joi.number().required(),
    createdAt: Joi.string().required(),

    generalData: Joi.object({
        ownerName: Joi.string().allow('').required(),
        ownerAddress: Joi.string().allow('').required(),
        userInCharge: Joi.string().allow('').required(),
        subcontractorPersonInCharge: Joi.string().allow('').required(),
        unitLocation: Joi.string().allow('').required(),
        operatorName: Joi.string().allow('').required(),
        equipmentType: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        brandType: Joi.string().allow('').required(),
        locationAndYearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        capacityWorkingLoad: Joi.string().allow('').required(),
        intendedUse: Joi.string().allow('').required(),
        usagePermitNumber: Joi.string().allow('').required(),
        operatorCertificate: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        gondolaSpecification: Joi.object({
            supportMastHeight: Joi.string().allow('').required(),
            frontBeamLength: Joi.string().allow('').required(),
            middleBeamLength: Joi.string().allow('').required(),
            rearBeamLength: Joi.string().allow('').required(),
            balanceWeightDistance: Joi.string().allow('').required(),
            capacity: Joi.string().allow('').required(),
            speed: Joi.string().allow('').required(),
            platformSize: Joi.string().allow('').required(),
            wireRopeDiameter: Joi.string().allow('').required()
        }).required(),
        hoist: Joi.object({
            model: Joi.string().allow('').required(),
            liftingCapacity: Joi.string().allow('').required(),
            electricMotor: Joi.object({
                type: Joi.string().allow('').required(),
                power: Joi.string().allow('').required(),
                voltage: Joi.string().allow('').required(),
                voltageHz: Joi.string().allow('').required()
            }).required()
        }).required(),
        safetyLockType: Joi.string().allow('').required(),
        brake: Joi.object({
            type: Joi.string().allow('').required(),
            model: Joi.string().allow('').required(),
            capacity: Joi.string().allow('').required()
        }).required(),
        suspensionMechanical: Joi.object({
            supportMastHeight: Joi.string().allow('').required(),
            frontBeamLength: Joi.string().allow('').required(),
            material: Joi.string().allow('').required()
        }).required(),
        machineWeight: Joi.object({
            totalPlatformWeight: Joi.string().allow('').required(),
            suspensionMechanicalWeight: Joi.string().allow('').required(),
            balanceWeight: Joi.string().allow('').required(),
            totalMachineWeight: Joi.string().allow('').required()
        }).required()
    }).required(),

    visualInspection: Joi.object({
        suspensionStructure: Joi.object().pattern(Joi.string().allow(''), inspectionItemSchema).required(),
        steelWireRope: Joi.object().pattern(Joi.string().allow(''), inspectionItemSchema).required(),
        electricalSystem: Joi.object().pattern(Joi.string().allow(''), inspectionItemSchema).required(),
        platform: Joi.object().pattern(Joi.string().allow(''), inspectionItemSchema).required(),
        safetyDevices: Joi.object().pattern(Joi.string().allow(''), inspectionItemSchema).required()
    }).required(),

    nonDestructiveTesting: Joi.object({
        steelCableRope: Joi.object({
            ndtType: Joi.string().allow('').required(),
            items: Joi.array().items(Joi.object({
                usage: Joi.string().allow('').required(),
                specDiameter: Joi.string().allow('').required(),
                actualDiameter: Joi.string().allow('').required(),
                construction: Joi.string().allow('').required(),
                type: Joi.string().allow('').required(),
                length: Joi.string().allow('').required(),
                age: Joi.string().allow('').required(),
                defectFound: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            })).required()
        }).required(),
        suspensionStructure: Joi.object({
            ndtType: Joi.string().allow('').required(),
            items: Joi.array().items(Joi.object({
                part: Joi.string().allow('').required(),
                location: Joi.string().allow('').required(),
                defectFound: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            })).required()
        }).required(),
        gondolaCage: Joi.object({
            ndtType: Joi.string().allow('').required(),
            items: Joi.array().items(Joi.object({
                part: Joi.string().allow('').required(),
                location: Joi.string().allow('').required(),
                defectFound: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            })).required()
        }).required(),
        clamps: Joi.object({
            items: Joi.array().items(Joi.object({
                partCheck: Joi.string().allow('').required(),
                location: Joi.string().allow('').required(),
                defectFound: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            })).required()
        }).required()
    }).required(),

    testing: Joi.object({
        dynamicLoadTest: Joi.object({
            note: Joi.string().allow('').required(),
            items: Joi.array().items(Joi.object({
                loadPercentage: Joi.string().allow('').required(),
                loadDetails: Joi.string().allow('').required(),
                remarks: Joi.string().allow('').required(),
                result: Joi.string().allow('').required()
            })).required()
        }).required(),
        staticLoadTest: Joi.object({
            note: Joi.string().allow('').required(),
            items: Joi.array().items(Joi.object({
                loadPercentage: Joi.string().allow('').required(),
                loadDetails: Joi.string().allow('').required(),
                remarks: Joi.string().allow('').required(),
                result: Joi.string().allow('').required()
            })).required()
        }).required()
    }).required(),

    conclusion: Joi.string().allow('').required(),
    recommendation: Joi.string().allow('').required()
});

module.exports = {
    laporanGondolaPayload,
};