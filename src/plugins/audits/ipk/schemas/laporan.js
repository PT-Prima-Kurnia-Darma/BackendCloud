'use strict';

const Joi = require('joi');

    const documentChecklistItemSchema = Joi.object({
        available: Joi.boolean().allow(true, false).required(),
        notes: Joi.string().allow('').required()
    });

    const alarmInstallationItemSchema = Joi.object({
        location: Joi.string().allow('').required(),
        zone: Joi.string().allow('').required(),
        ror: Joi.string().allow('').required(),
        fixed: Joi.string().allow('').required(),
        smoke: Joi.string().allow('').required(),
        tpm: Joi.string().allow('').required(),
        flsw: Joi.string().allow('').required(),
        bell: Joi.string().allow('').required(),
        lamp: Joi.string().allow('').required(),
        status: Joi.string().allow('').required()
    });

    const pumpFunctionTestItemSchema = Joi.object({
        pumpType: Joi.string().allow('').required(),
        start: Joi.string().allow('').required(),
        stop: Joi.string().allow('').required()
    });

    const hydrantOperationalTestItemSchema = Joi.object({
        test: Joi.string().allow('').required(),
        pressure: Joi.string().allow('').required(),
        transmitPower: Joi.string().allow('').required(),
        nozzlePosition: Joi.string().allow('').required(),
        status: Joi.string().allow('').required(),
        description: Joi.string().allow('').required()
    });

    const laporanProteksiKebakaranPayload = Joi.object({
        examinationType: Joi.string().allow('').required(),
        extraid: Joi.number().required(),
        createdAt: Joi.string().allow('').required(),
        inspectionType: Joi.string().allow('').required(),
        equipmentType: Joi.string().allow('').required(),
        documentChecklist: Joi.object({
            technicalDrawing: documentChecklistItemSchema,
            previousTestDocumentation: documentChecklistItemSchema,
            requestLetter: documentChecklistItemSchema,
            specificationDocument: documentChecklistItemSchema
        }).required(),
        generalData: Joi.object({
            companyName: Joi.string().allow('').required(),
            companyLocation: Joi.string().allow('').required(),
            usageLocation: Joi.string().allow('').required(),
            certificateNumber: Joi.string().allow('').required(),
            k3Object: Joi.string().allow('').required(),
            inspectionDate: Joi.string().allow('').required()
        }).required(),
        buildingData: Joi.object({
            landArea: Joi.string().allow('').required(),
            buildingArea: Joi.string().allow('').required(),
            buildingHeight: Joi.string().allow('').required(),
            floorCount: Joi.string().allow('').required(),
            construction: Joi.object({
                mainStructure: Joi.string().allow('').required(),
                floorStructure: Joi.string().allow('').required(),
                exteriorWalls: Joi.string().allow('').required(),
                interiorWalls: Joi.string().allow('').required(),
                ceilingFrame: Joi.string().allow('').required(),
                ceilingCover: Joi.string().allow('').required(),
                roofFrame: Joi.string().allow('').required(),
                roofCover: Joi.string().allow('').required()
            }).required(),
            yearBuilt: Joi.string().allow('').required(),
            fireProtectionEquipment: Joi.object({
                portableExtinguishers: Joi.string().allow('').required(),
                indoorHydrantBox: Joi.string().allow('').required(),
                pillarAndOutdoorHydrant: Joi.string().allow('').required(),
                siameseConnection: Joi.string().allow('').required(),
                sprinklerSystem: Joi.string().allow('').required(),
                heatAndSmokeDetectors: Joi.string().allow('').required(),
                exitSigns: Joi.string().allow('').required(),
                emergencyStairs: Joi.string().allow('').required(),
                assemblyPoint: Joi.string().allow('').required()
            }).required()
        }).required(),
        technicalSpecifications: Joi.object({
            mcfa: Joi.object({
                brandOrType: Joi.string().allow('').required(),
                result: Joi.string().allow('').required(),
                ledAnnunciator: Joi.string().allow('').required(),
                type: Joi.string().allow('').required(),
                serialNumber: Joi.string().allow('').required()
            }).required(),
            heatDetector: Joi.object({
                brandOrType: Joi.string().allow('').required(),
                result: Joi.string().allow('').required(),
                pointCount: Joi.string().allow('').required(),
                spacing: Joi.string().allow('').required(),
                operatingTemperature: Joi.string().allow('').required()
            }).required(),
            smokeDetector: Joi.object({
                brandOrType: Joi.string().allow('').required(),
                result: Joi.string().allow('').required(),
                pointCount: Joi.string().allow('').required(),
                spacing: Joi.string().allow('').required(),
                operatingTemperature: Joi.string().allow('').required()
            }).required(),
            apar: Joi.object({
                brandOrType: Joi.string().allow('').required(),
                result: Joi.string().allow('').required(),
                count: Joi.string().allow('').required(),
                spacing: Joi.string().allow('').required(),
                placement: Joi.string().allow('').required()
            }).required()
        }).required(),
        resultAlarmInstallation: Joi.string().allow('').required(),
        totalAlarmInstallation: Joi.string().allow('').required(),
        alarmInstallationData: Joi.array().items(alarmInstallationItemSchema).required(),
        alarmTestResults: Joi.object({
            panelFunction: Joi.string().allow('').required(),
            alarmTest: Joi.string().allow('').required(),
            faultTest: Joi.string().allow('').required(),
            interconnectionTest: Joi.string().allow('').required()
        }).required(),
        hydrantSystem: Joi.object({
            waterSource: Joi.object({
                specification: Joi.string().allow('').required(),
                status: Joi.string().allow('').required(),
                note: Joi.string().allow('').required()
            }).required(),
            groundReservoir: Joi.object({
                backupSpec: Joi.string().allow('').required(),
                backupStatus: Joi.string().allow('').required(),
                backupResult: Joi.string().allow('').required()
            }).required(),
            gravitationTank: Joi.object({
                spec: Joi.string().allow('').required(),
                status: Joi.string().allow('').required(),
                result: Joi.string().allow('').required()
            }).required(),
            siameseConnection: Joi.object({
                spec: Joi.string().allow('').required(),
                status: Joi.string().allow('').required(),
                result: Joi.string().allow('').required()
            }).required(),
            pumps: Joi.object({
                jockey: Joi.object({
                    quantity: Joi.string().allow('').required(),
                    headM: Joi.string().allow('').required(),
                    autoStart: Joi.string().allow('').required(),
                    autoStop: Joi.string().allow('').required()
                }).required(),
                electric: Joi.object({
                    quantity: Joi.string().allow('').required(),
                    headM: Joi.string().allow('').required(),
                    autoStart: Joi.string().allow('').required(),
                    stop: Joi.string().allow('').required()
                }).required(),
                diesel: Joi.object({
                    quantity: Joi.string().allow('').required(),
                    headM: Joi.string().allow('').required(),
                    autoStart: Joi.string().allow('').required(),
                    stop: Joi.string().allow('').required()
                }).required()
            }).required(),
            indoorHydrant: Joi.object({
                points: Joi.string().allow('').required(),
                diameter: Joi.string().allow('').required(),
                hoseLength: Joi.string().allow('').required(),
                placement: Joi.string().allow('').required()
            }).required(),
            landingValve: Joi.object({
                points: Joi.string().allow('').required(),
                diameter: Joi.string().allow('').required(),
                clutchType: Joi.string().allow('').required(),
                placement: Joi.string().allow('').required()
            }).required(),
            outdoorHydrant: Joi.object({
                points: Joi.string().allow('').required(),
                diameter: Joi.string().allow('').required(),
                hoseLength: Joi.string().allow('').required(),
                nozzleDiameter: Joi.string().allow('').required(),
                placement: Joi.string().allow('').required()
            }).required(),
            fireServiceConnection: Joi.object({
                points: Joi.string().allow('').required(),
                inletDiameter: Joi.string().allow('').required(),
                outletDiameter: Joi.string().allow('').required(),
                clutchType: Joi.string().allow('').required(),
                condition: Joi.string().allow('').required(),
                placement: Joi.string().allow('').required()
            }).required(),
            pipingAndValves: Joi.object({
                pressureReliefValve: Joi.object({ spec: Joi.string().allow('').required(), status: Joi.string().allow('').required(), remarks: Joi.string().allow('').required() }).required(),
                testValve: Joi.object({ spec: Joi.string().allow('').required(), status: Joi.string().allow('').required(), remarks: Joi.string().allow('').required() }).required(),
                suctionPipe: Joi.object({ spec: Joi.string().allow('').required(), status: Joi.string().allow('').required(), remarks: Joi.string().allow('').required() }).required(),
                mainPipe: Joi.object({ spec: Joi.string().allow('').required(), status: Joi.string().allow('').required(), remarks: Joi.string().allow('').required() }).required(),
                standPipe: Joi.object({ spec: Joi.string().allow('').required(), status: Joi.string().allow('').required(), remarks: Joi.string().allow('').required() }).required(),
                hydrantPillar: Joi.object({ spec: Joi.string().allow('').required(), status: Joi.string().allow('').required(), remarks: Joi.string().allow('').required() }).required(),
                innerHydrant: Joi.object({ spec: Joi.string().allow('').required(), status: Joi.string().allow('').required(), remarks: Joi.string().allow('').required() }).required(),
                hoseReel: Joi.object({ spec: Joi.string().allow('').required(), status: Joi.string().allow('').required(), remarks: Joi.string().allow('').required() }).required()
            }).required()
        }).required(),
        pumpFunctionTest: Joi.array().items(pumpFunctionTestItemSchema).required(),
        hydrantOperationalTest: Joi.array().items(hydrantOperationalTestItemSchema).required(),
        recommendations: Joi.string().allow('').required(),
        conclusion: Joi.string().allow('').required(),
});

module.exports = {
    laporanProteksiKebakaranPayload,
};