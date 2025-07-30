'use strict';

const Joi = require('joi');

// Skema untuk setiap item hasil inspeksi (tidak berubah)
const inspectionItemSchema = Joi.object({
    result: Joi.string().allow('').required(),
    status: Joi.boolean().allow(true, false).required()
}).required();

// Skema payload utama untuk laporan eskalator (SUDAH DISESUAIKAN DENGAN STRUKTUR BARU)
const laporanEskalatorPayload = Joi.object({
    inspectionType: Joi.string().allow('').required(),
    equipmentType: Joi.string().allow('').required(),
    createdAt: Joi.string().required(),
    extraId: Joi.number().required(),

    // 1. Menambahkan validasi untuk objek 'generalData'
    generalData: Joi.object({
        ownerName: Joi.string().allow('').required(),
        nameUsageLocation: Joi.string().allow('').required(),
        safetyObjectTypeAndNumber: Joi.string().allow('').required(),
        intendedUse: Joi.string().allow('').required(),
        permitNumber: Joi.string().allow('').required(),
        examinationType: Joi.string().allow('').required(),
        inspectionDate: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        technicalDatamanufacturer: Joi.string().allow('').required(),
        technicalDatabrand: Joi.string().allow('').required(),
        technicalDatacountryAndYear: Joi.string().allow('').required(),
        technicalDataserialNumber: Joi.string().allow('').required(),
        technicalDatatransports: Joi.string().allow('').required(),
        technicalDatacapacity: Joi.string().allow('').required(),
        technicalDataliftHeight: Joi.string().allow('').required(),
        technicalDataspeed: Joi.string().allow('').required(),
        technicalDatadriveType: Joi.string().allow('').required(),
        technicalDatamotorCurrent: Joi.string().allow('').required(),
        technicalDatamotorPower: Joi.string().allow('').required(),
        technicalDatasafetyDevices: Joi.string().allow('').required()
    }).required(),

    // 2. Menambahkan validasi untuk objek 'inspectionAndTesting'
    inspectionAndTesting: Joi.object({
        inspectionAndTestingframeAndMachineRoom: Joi.object({
            inspectionAndTestingframeAndMachineRoomframeresult: inspectionItemSchema,
            inspectionAndTestingframeAndMachineRoomsupportBeamsresults: inspectionItemSchema,
            inspectionAndTestingframeAndMachineRoommachineRoomConditionresult: inspectionItemSchema,
            inspectionAndTestingframeAndMachineRoommachineRoomClearanceresult: inspectionItemSchema,
            inspectionAndTestingframeAndMachineRoommachineRoomLightingresult: inspectionItemSchema,
            inspectionAndTestingframeAndMachineRoommachineCoverPlateresult: inspectionItemSchema,
            inspectionAndTestingframeAndMachineRoompitConditionresult: inspectionItemSchema,
            inspectionAndTestingframeAndMachineRoompitClearanceresult: inspectionItemSchema,
            inspectionAndTestingframeAndMachineRoompitStepCoverPlateresult: inspectionItemSchema
        }).required(),

        driveEquipment: Joi.object({
            driveEquipmentdriveMachineresult: inspectionItemSchema,
            driveEquipmentspeedUnder30Degreesresult: inspectionItemSchema,
            driveEquipmentspeed30to35Degreesresult: inspectionItemSchema,
            driveEquipmenttravelatorSpeedresult: inspectionItemSchema,
            driveEquipmentstoppingDistance0_5result: inspectionItemSchema,
            driveEquipmentstoppingDistance0_75result: inspectionItemSchema,
            driveEquipmentstoppingDistance0_90result: inspectionItemSchema,
            driveEquipmentdriveChainresult: inspectionItemSchema,
            driveEquipmentchainBreakingStrengthresult: inspectionItemSchema
        }).required(),

        stepsOrPallets: Joi.object({
            stepsOrPalletsstepMaterialresult: inspectionItemSchema,
            stepsOrPalletsstepDimensionsresult: inspectionItemSchema,
            stepsOrPalletspalletDimensionsresult: inspectionItemSchema,
            stepsOrPalletsstepSurfaceresult: inspectionItemSchema,
            stepsOrPalletsstepLevelnessresult: inspectionItemSchema,
            stepsOrPalletsskirtBrushresult: inspectionItemSchema,
            stepsOrPalletsstepWheelsresult: inspectionItemSchema
        }).required(),

        landingArea: Joi.object({
            landingArealandingPlatesresult: inspectionItemSchema,
            landingAreacombTeethresult: inspectionItemSchema,
            landingAreacombConditionresult: inspectionItemSchema,
            landingArealandingCoverresult: inspectionItemSchema,
            landingArealandingAccessArearesult: inspectionItemSchema
        }).required(),

        balustrade: Joi.object({
            balustradebalustradePanelmaterialresult: inspectionItemSchema,
            balustradebalustradePanelheightresult: inspectionItemSchema,
            balustradebalustradePanelsidePressureresult: inspectionItemSchema,
            balustradebalustradePanelverticalPressureresult: inspectionItemSchema,
            balustradeskirtPanelresult: inspectionItemSchema,
            balustradeskirtPanelFlexibilityresult: inspectionItemSchema,
            balustradestepToSkirtClearanceresult: inspectionItemSchema
        }).required(),

        handrail: Joi.object({
            handrailhandrailConditionresult: inspectionItemSchema,
            handrailhandrailSpeedSynchronizationresult: inspectionItemSchema,
            handrailhandrailWidthresult: inspectionItemSchema
        }).required(),

        runway: Joi.object({
            runwaybeamStrengthAndPositionresult: inspectionItemSchema,
            runwaypitWallConditionresult: inspectionItemSchema,
            runwayescalatorFrameEnclosureresult: inspectionItemSchema,
            runwaylightingresult: inspectionItemSchema,
            runwayheadroomClearanceresult: inspectionItemSchema,
            runwaybalustradeToObjectClearanceresult: inspectionItemSchema,
            runwayantiClimbDeviceHeightresult: inspectionItemSchema,
            runwayornamentPlacementresult: inspectionItemSchema,
            runwayoutdoorClearanceresult: inspectionItemSchema
        }).required(),

        safetyEquipment: Joi.object({
            safetyEquipmentoperationControlKeyresult: inspectionItemSchema,
            safetyEquipmentemergencyStopSwitchresult: inspectionItemSchema,
            safetyEquipmentstepChainSafetyDeviceresult: inspectionItemSchema,
            safetyEquipmentdriveChainSafetyDeviceresult: inspectionItemSchema,
            safetyEquipmentstepSafetyDeviceresult: inspectionItemSchema,
            safetyEquipmenthandrailSafetyDeviceresult: inspectionItemSchema,
            safetyEquipmentreversalStopDeviceresult: inspectionItemSchema,
            safetyEquipmenthandrailEntryGuardresult: inspectionItemSchema,
            safetyEquipmentcombPlateSafetyDeviceresult: inspectionItemSchema,
            safetyEquipmentinnerDeckingBrushresult: inspectionItemSchema,
            safetyEquipmentstopButtonsresult: inspectionItemSchema
        }).required(),

        electricalInstallation: Joi.object({
            electricalInstallationinstallationStandardresult: inspectionItemSchema,
            electricalInstallationelectricalPanelresult: inspectionItemSchema,
            electricalInstallationgroundingCableresult: inspectionItemSchema,
            electricalInstallationfireAlarmConnectionresult: inspectionItemSchema
        }).required(),

        outdoorSpecifics: Joi.object({
            outdoorSpecificspitWaterPumpresult: inspectionItemSchema,
            outdoorSpecificsweatherproofComponentsresult: inspectionItemSchema
        }).required(),

        userSafety: Joi.object({
            userSafetySignagenoBulkyItemsresult: inspectionItemSchema,
            userSafetySignagenoJumpingresult: inspectionItemSchema,
            userSafetySignageunattendedChildrenresult: inspectionItemSchema,
            userSafetySignagenoTrolleysOrStrollersresult: inspectionItemSchema,
            userSafetySignagenoLeaningresult: inspectionItemSchema,
            userSafetySignagenoSteppingOnSkirtresult: inspectionItemSchema,
            userSafetySignagesoftSoleFootwearWarningresult: inspectionItemSchema,
            userSafetySignagenoSittingOnStepsresult: inspectionItemSchema,
            userSafetySignageholdHandrailresult: inspectionItemSchema
        }).required(),
    }).required(),

    testingEscalator: Joi.string().allow('').required(),
    conclusion: Joi.string().allow('').required()

}); 

module.exports = {
    laporanEskalatorPayload,
};