'use strict';

const Joi = require('joi');

// Skema untuk setiap item hasil inspeksi
const inspectionItemSchema = Joi.object({
    result: Joi.string().allow('').optional(),
    status: Joi.boolean().optional()
}).optional();

// Skema payload utama untuk laporan eskalator (SUDAH DISESUAIKAN)
const laporanEskalatorPayload = Joi.object({
    // --- Data Umum (Root Level) ---
    inspectionType: Joi.string().allow('').optional(),
    equipmentType: Joi.string().allow('').optional(),
    ownerName: Joi.string().allow('').optional(),
    nameUsageLocation: Joi.string().allow('').optional(),
    safetyObjectTypeAndNumber: Joi.string().allow('').optional(),
    intendedUse: Joi.string().allow('').optional(),
    permitNumber: Joi.string().allow('').optional(),
    examinationType: Joi.string().allow('').optional(),
    inspectionDate: Joi.string().allow('').optional(),

    // --- Technical Data ---
    technicalData: Joi.object({
        technicalDatamanufacturer: Joi.string().allow('').optional(),
        technicalDatabrand: Joi.string().allow('').optional(),
        technicalDatacountryAndYear: Joi.string().allow('').optional(),
        technicalDataserialNumber: Joi.string().allow('').optional(),
        technicalDatatransports: Joi.string().allow('').optional(),
        technicalDatacapacity: Joi.string().allow('').optional(),
        technicalDataliftHeight: Joi.string().allow('').optional(),
        technicalDataspeed: Joi.string().allow('').optional(),
        technicalDatadriveType: Joi.string().allow('').optional(),
        technicalDatamotorCurrent: Joi.string().allow('').optional(),
        technicalDatamotorPower: Joi.string().allow('').optional(),
        technicalDatasafetyDevices: Joi.string().allow('').optional()
    }).optional(),

    // --- Inspection and Testing Frame and Machine Room ---
    inspectionAndTestingframeAndMachineRoom: Joi.object({
        inspectionAndTestingframeAndMachineRoomframeresult: inspectionItemSchema,
        'inspectionAndTestingframeAndMachineRoomsupportBeams iresults': inspectionItemSchema, // Key dengan spasi, harus dalam tanda kutip
        inspectionAndTestingframeAndMachineRoommachineRoomConditionresult: inspectionItemSchema,
        inspectionAndTestingframeAndMachineRoommachineRoomClearanceresult: inspectionItemSchema,
        inspectionAndTestingframeAndMachineRoommachineRoomLightingresult: inspectionItemSchema,
        inspectionAndTestingframeAndMachineRoommachineCoverPlateresult: inspectionItemSchema,
        inspectionAndTestingframeAndMachineRoompitConditionresult: inspectionItemSchema,
        inspectionAndTestingframeAndMachineRoompitClearanceresult: inspectionItemSchema,
        inspectionAndTestingframeAndMachineRoompitStepCoverPlateresult: inspectionItemSchema
    }).optional(),

    // --- Drive Equipment ---
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
    }).optional(),

    // --- Steps or Pallets ---
    stepsOrPallets: Joi.object({
        stepsOrPalletsstepMaterialresult: inspectionItemSchema,
        stepsOrPalletsstepDimensionsresult: inspectionItemSchema,
        stepsOrPalletspalletDimensionsresult: inspectionItemSchema,
        stepsOrPalletsstepSurfaceresult: inspectionItemSchema,
        stepsOrPalletsstepLevelnessresult: inspectionItemSchema,
        stepsOrPalletsskirtBrushresult: inspectionItemSchema,
        stepsOrPalletsstepWheelsresult: inspectionItemSchema
    }).optional(),

    // --- Landing Area ---
    landingArea: Joi.object({
        landingArealandingPlatesresult: inspectionItemSchema,
        landingAreacombTeethresult: inspectionItemSchema,
        landingAreacombConditionresult: inspectionItemSchema,
        landingArealandingCoverresult: inspectionItemSchema,
        landingArealandingAccessArearesult: inspectionItemSchema
    }).optional(),

    // --- Balustrade ---
    balustrade: Joi.object({
        balustradebalustradePanelmaterialresult: inspectionItemSchema,
        balustradebalustradePanelheightresult: inspectionItemSchema,
        balustradebalustradePanelsidePressureresult: inspectionItemSchema,
        balustradebalustradePanelverticalPressureresult: inspectionItemSchema,
        balustradeskirtPanelresult: inspectionItemSchema,
        balustradeskirtPanelFlexibilityresult: inspectionItemSchema,
        balustradestepToSkirtClearanceresult: inspectionItemSchema
    }).optional(),

    // --- Handrail ---
    handrail: Joi.object({
        handrailhandrailConditionresult: inspectionItemSchema,
        handrailhandrailSpeedSynchronizationresult: inspectionItemSchema,
        handrailhandrailWidthresult: inspectionItemSchema
    }).optional(),

    // --- Runway ---
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
    }).optional(),

    // --- Safety Equipment ---
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
    }).optional(),

    // --- Electrical Installation ---
    electricalInstallation: Joi.object({
        electricalInstallationinstallationStandardresult: inspectionItemSchema,
        electricalInstallationelectricalPanelresult: inspectionItemSchema,
        electricalInstallationgroundingCableresult: inspectionItemSchema,
        electricalInstallationfireAlarmConnectionresult: inspectionItemSchema
    }).optional(),

    // --- Outdoor Specifics ---
    outdoorSpecifics: Joi.object({
        outdoorSpecificspitWaterPumpresult: inspectionItemSchema,
        outdoorSpecificsweatherproofComponentsresult: inspectionItemSchema
    }).optional(),

    // --- User Safety ---
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
    }).optional(),

    // --- Kesimpulan ---
    testingEscalator: Joi.string().allow('').optional(),
    conclusion: Joi.string().allow('').optional()

}).unknown(false).min(1);

module.exports = {
    laporanEskalatorPayload,
};