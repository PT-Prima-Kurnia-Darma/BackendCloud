'use strict';

const Joi = require('joi');

// Skema untuk item inspeksi yang berulang (status boolean dan teks hasil)
const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(true, false),
    result: Joi.string().allow('').required()
});

// Skema untuk hasil pengujian NDT dan Safety Device
const testResultSchema = Joi.object({
    remarks: Joi.string().allow('').required(),
    result: Joi.string().allow('').required()
});

const laporanPtpDieselPayload = Joi.object({
    examinationType: Joi.string().allow('').required(),
    extraId: Joi.number().required(),
    createdAt: Joi.string().required(),
    inspectionType: Joi.string().allow('').required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        userInCharge: Joi.string().allow('').required(),
        userAddressInCharge: Joi.string().allow('').required(),
        subcontractorPersonInCharge: Joi.string().allow('').required(),
        unitLocation: Joi.string().allow('').required(),
        equipmentType: Joi.string().allow('').required(),
        brandType: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        locationAndYearOfManufacture: Joi.string().allow('').required(),
        capacityWorkingLoad: Joi.string().allow('').required(),
        intendedUse: Joi.string().allow('').required(),
        pjk3SkpNo: Joi.string().allow('').required(),
        ak3SkpNo: Joi.string().allow('').required(),
        portableOrStationer: Joi.string().allow('').required(),
        usagePermitNumber: Joi.string().allow('').required(),
        operatorName: Joi.string().allow('').required(),
        equipmentHistory: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        dieselMotor: Joi.object({
            brandModel: Joi.string().allow('').required(),
            manufacturer: Joi.string().allow('').required(),
            classification: Joi.string().allow('').required(),
            serialNumber: Joi.string().allow('').required(),
            powerRpm: Joi.string().allow('').required(),
            startingPower: Joi.string().allow('').required(),
            cylinderCount: Joi.string().allow('').required()
        }).required(),
        generator: Joi.object({
            brandType: Joi.string().allow('').required(),
            manufacturer: Joi.string().allow('').required(),
            serialNumber: Joi.string().allow('').required(),
            power: Joi.string().allow('').required(),
            frequency: Joi.string().allow('').required(),
            rpm: Joi.string().allow('').required(),
            voltage: Joi.string().allow('').required(),
            powerFactor: Joi.string().allow('').required(),
            current: Joi.string().allow('').required()
        }).required()
    }).required(),

    visualChecks: Joi.object({
        basicConstruction: Joi.object({
            foundation: inspectionItemSchema,
            dieselHousing: inspectionItemSchema,
            support: inspectionItemSchema,
            anchorBolt: inspectionItemSchema
        }).required(),
        structuralConstruction: Joi.object({
            dailyTank: inspectionItemSchema,
            muffler: inspectionItemSchema,
            airVessel: inspectionItemSchema,
            panel: inspectionItemSchema
        }).required(),
        lubricationSystem: Joi.object({
            oil: inspectionItemSchema,
            oilStrainer: inspectionItemSchema,
            oilCooler: inspectionItemSchema,
            oilFilter: inspectionItemSchema,
            byPassFilter: inspectionItemSchema,
            safetyValve: inspectionItemSchema,
            packing: inspectionItemSchema
        }).required(),
        fuelSystem: Joi.object({
            dailyTank: inspectionItemSchema,
            fuelInjector: inspectionItemSchema,
            connections: inspectionItemSchema,
            floatTank: inspectionItemSchema,
            fuelFilter: inspectionItemSchema,
            fuelPump: inspectionItemSchema,
            magneticScreen: inspectionItemSchema,
            governor: inspectionItemSchema,
            throttleShaft: inspectionItemSchema,
            regulator: inspectionItemSchema,
            shutOffValve: inspectionItemSchema
        }).required(),
        startingAid: Joi.object({
            feedPump: inspectionItemSchema,
            fuelValve: inspectionItemSchema,
            primingPump: inspectionItemSchema,
            heaterPlug: inspectionItemSchema,
            heaterSwitch: inspectionItemSchema,
            preHeater: inspectionItemSchema,
            waterSignal: inspectionItemSchema,
            startingSwitch: inspectionItemSchema,
            batteryPoles: inspectionItemSchema,
            thermostartTank: inspectionItemSchema,
            thermostart: inspectionItemSchema,
            heaterSignal: inspectionItemSchema,
            thermostartSwitch: inspectionItemSchema,
            glowPlug: inspectionItemSchema,
            speedSensor: inspectionItemSchema,
            serviceMeter: inspectionItemSchema,
            tempSensor: inspectionItemSchema,
            startingMotor: inspectionItemSchema
        }).required(),
        coolingSystem: Joi.object({
            coolingWater: inspectionItemSchema,
            bolts: inspectionItemSchema,
            clamps: inspectionItemSchema,
            radiator: inspectionItemSchema,
            thermostat: inspectionItemSchema,
            fan: inspectionItemSchema,
            fanGuard: inspectionItemSchema,
            fanRotation: inspectionItemSchema,
            bearing: inspectionItemSchema
        }).required(),
        airCirculationSystem: Joi.object({
            preCleaner: inspectionItemSchema,
            dustIndicator: inspectionItemSchema,
            airCleaner: inspectionItemSchema,
            turboCharger: inspectionItemSchema,
            clamps: inspectionItemSchema,
            afterCooler: inspectionItemSchema,
            muffler: inspectionItemSchema,
            silencer: inspectionItemSchema,
            heatDamper: inspectionItemSchema,
            bolts: inspectionItemSchema
        }).required(),
        mainParts: Joi.object({
            damperBolts: inspectionItemSchema,
            support: inspectionItemSchema,
            flyWheelHousing: inspectionItemSchema,
            flyWheel: inspectionItemSchema,
            vibrationDamper: inspectionItemSchema,
            beltAndPulley: inspectionItemSchema,
            crankshaft: inspectionItemSchema
        }).required(),
        generatorParts: Joi.object({
            terminal: inspectionItemSchema,
            cable: inspectionItemSchema,
            panel: inspectionItemSchema,
            ampereMeter: inspectionItemSchema,
            voltMeter: inspectionItemSchema,
            frequencyMeter: inspectionItemSchema,
            circuitBreaker: inspectionItemSchema,
            onOffSwitch: inspectionItemSchema
        }).required(),
        transmission: Joi.object({
            gear: inspectionItemSchema,
            belt: inspectionItemSchema,
            chain: inspectionItemSchema
        }).required(),
        mdp: Joi.object({
            cable: inspectionItemSchema,
            condition: inspectionItemSchema,
            ampereMeter: inspectionItemSchema,
            voltMeter: inspectionItemSchema,
            mainCircuitBreaker: inspectionItemSchema
        }).required(),
        safetyDevice: Joi.object({
            grounding: inspectionItemSchema,
            lightningArrester: inspectionItemSchema,
            emergencyStop: inspectionItemSchema,
            governor: inspectionItemSchema,
            thermostat: inspectionItemSchema,
            waterSignal: inspectionItemSchema,
            fanGuard: inspectionItemSchema,
            silencer: inspectionItemSchema,
            vibrationDamper: inspectionItemSchema,
            circuitBreaker: inspectionItemSchema,
            avr: inspectionItemSchema
        }).required()
    }).required(),

    tests: Joi.object({
        ndt: Joi.object({
            shaftRpm: testResultSchema,
            weldJoint: testResultSchema,
            noise: testResultSchema,
            lighting: testResultSchema,
            loadTest: testResultSchema
        }).required(),
        safetyDevice: Joi.object({
            governor: testResultSchema,
            emergencyStop: testResultSchema,
            grounding: testResultSchema,
            indicatorPanel: testResultSchema,
            pressureGauge: testResultSchema,
            tempIndicator: testResultSchema,
            waterIndicator: testResultSchema,
            safetyValves: testResultSchema,
            radiator: testResultSchema
        }).required()
    }).required(),

    electricalComponents: Joi.object({
        panelControl: Joi.object({
            ka: Joi.string().allow('').required(),
            voltage: Joi.object({
                rs: Joi.string().allow('').required(),
                rt: Joi.string().allow('').required(),
                st: Joi.string().allow('').required(),
                rn: Joi.string().allow('').required(),
                rg: Joi.string().allow('').required(),
                ng: Joi.string().allow('').required()
            }).required(),
            powerInfo: Joi.object({
                frequency: Joi.string().allow('').required(),
                cosQ: Joi.string().allow('').required(),
                ampere: Joi.object({
                    r: Joi.string().allow('').required(),
                    s: Joi.string().allow('').required(),
                    t: Joi.string().allow('').required()
                }).required(),
                result: Joi.string().allow('').required()
            }).required()
        }).required()
    }).required(),

    conclusion: Joi.string().allow('').required(),
    recommendations: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),

    mcbCalculation: Joi.object({
        phase: Joi.string().allow('').required(),
        voltage: Joi.string().allow('').required(),
        cosQ: Joi.string().allow('').required(),
        generatorPowerKva: Joi.string().allow('').required(),
        generatorPowerKw: Joi.string().allow('').required(),
        resultCalculation: Joi.string().allow('').required(),
        requirementCalculation: Joi.string().allow('').required(),
        conclusion: Joi.string().allow('').required()
    }).required(),

    noiseMeasurement: Joi.object({
        pointA: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
        pointB: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
        pointC: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
        pointD: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required()
    }).required(),

    lightingMeasurement: Joi.object({
        pointA: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
        pointB: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
        pointC: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
        pointD: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required()
    }).required()
});

module.exports = {
    laporanPtpDieselPayload
};