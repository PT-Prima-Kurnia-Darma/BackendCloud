'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { storage, BUCKET_NAME } = require('../../../../../utils/storage');

// Fungsi bantuan untuk mendapatkan tanda centang (√) atau string kosong
const getCheckmark = (status) => (status === true ? '√' : '');
const getOppositeCheckmark = (status) => (status === false ? '√' : '');
const getNaCheckmark = (status) => (status === null || status === undefined ? 'N/A' : '');

const createLaporanForklift = async (data) => {
    const templatePath = 'paa/forklift/laporanForklift.docx';

    let content;
    try {
        const [fileBuffer] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
        content = fileBuffer;
    } catch (error) {
        console.error('Gagal mengunduh template Laporan Forklift:', error);
        throw new Error('Template dokumen Laporan Forklift tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => "", // Mengembalikan string kosong jika placeholder tidak ditemukan atau nilainya null/undefined
    });

    // Dekonstruksi data untuk kemudahan akses dan keamanan dari nilai null
    const g = data.generalData || {};
    const t = data.technicalData || {};
    const i = data.inspectionAndTesting || {};
    const mfc = i.mainFrameAndChassis || {};
    const pm = i.primeMover || {};
    const dsb = i.dashboard || {};
    const pt = i.powerTrain || {};
    const att = i.attachments || {};
    const pb = i.personalBasketAndHandrail || {};
    const hc = i.hydraulicComponents || {};
    const eoc = i.engineOnChecks || {};
    const test = data.testingForklift || {};

    const renderData = {
        // Header
        examinationType: data.examinationType,
        subInspectionType: data.subInspectionType,
        inspectionDate: data.inspectionDate,
        serialNumberUnitNumber: data.serialNumberUnitNumber,

        // General Data
        ownerName: g.ownerName,
        ownerAddress: g.ownerAddress,
        userInCharge: g.userInCharge,
        subcontractorPersonInCharge: g.subcontractorPersonInCharge,
        unitLocation: g.unitLocation,
        operatorName: g.operatorName,
        equipmentType: g.equipmentType,
        manufacturer: g.manufacturer,
        brandType: g.brandType,
        locationAndYearOfManufacture: g.locationAndYearOfManufacture,
        serialNumberUnitNumber: g.serialNumberUnitNumber,
        capacityWorkingLoad: g.capacityWorkingLoad,
        intendedUse: g.intendedUse,
        certificateNumber: g.certificateNumber,
        equipmentHistory: g.equipmentHistory,

        // Technical Data
        specificationSerialNumber: t.specificationSerialNumber,
        specificationCapacity: t.specificationCapacity,
        specificationAttachment: t.specificationAttachment,
        specificationForkDimensions: t.specificationForkDimensions,
        specificationSpeedLifting: t.specificationSpeedLifting,
        specificationSpeedLowering: t.specificationSpeedLowering,
        specificationSpeedTravelling: t.specificationSpeedTravelling,
        primeMoverBrandType: t.primeMoverBrandType,
        primeMoverSerialNumber: t.primeMoverSerialNumber,
        primeMoverYearOfManufacture: t.primeMoverYearOfManufacture,
        primeMoverRevolution: t.primeMoverRevolution,
        primeMoverPower: t.primeMoverPower,
        primeMoverNumberOfCylinders: t.primeMoverNumberOfCylinders,
        dimensionLength: t.dimensionLength,
        dimensionWidth: t.dimensionWidth,
        dimensionHeight: t.dimensionHeight,
        dimensionForkLiftingHeight: t.dimensionForkLiftingHeight,
        tirePressureDriveWheel: t.tirePressureDriveWheel,
        tirePressureSteeringWheel: t.tirePressureSteeringWheel,
        driveWheelSize: t.driveWheelSize,
        driveWheelType: t.driveWheelType,
        steeringWheelSize: t.steeringWheelSize,
        steeringWheelType: t.steeringWheelType,
        travellingBrakeSize: t.travellingBrakeSize,
        travellingBrakeType: t.travellingBrakeType,
        hydraulicPumpPressure: t.hydraulicPumpPressure,
        hydraulicPumpType: t.hydraulicPumpType,
        hydraulicPumpReliefValve: t.hydraulicPumpReliefValve,

        // --- PEMETAAN LENGKAP UNTUK INSPECTION & TESTING ---
        
        // Main Frame & Chassis
        mainFrameReinforcingCorrosionMemenuhi: getCheckmark(mfc.reinforcingFrameCorrosionResult?.status) || getNaCheckmark(mfc.reinforcingFrameCorrosionResult?.status),
        mainFrameReinforcingCorrosionTidakMemenuhi: getOppositeCheckmark(mfc.reinforcingFrameCorrosionResult?.status),
        mainFrameReinforcingCorrosionResult: mfc.reinforcingFrameCorrosionResult?.result,
        mainFrameReinforcingCracksMemenuhi: getCheckmark(mfc.reinforcingFrameCracksResult?.status) || getNaCheckmark(mfc.reinforcingFrameCracksResult?.status),
        mainFrameReinforcingCracksTidakMemenuhi: getOppositeCheckmark(mfc.reinforcingFrameCracksResult?.status),
        mainFrameReinforcingCracksResult: mfc.reinforcingFrameCracksResult?.result,
        mainFrameReinforcingDeformationMemenuhi: getCheckmark(mfc.reinforcingFrameDeformationResult?.status) || getNaCheckmark(mfc.reinforcingFrameDeformationResult?.status),
        mainFrameReinforcingDeformationTidakMemenuhi: getOppositeCheckmark(mfc.reinforcingFrameDeformationResult?.status),
        mainFrameReinforcingDeformationResult: mfc.reinforcingFrameDeformationResult?.result,
        counterweightCorrosionMemenuhi: getCheckmark(mfc.counterweightCorrosionResult?.status) || getNaCheckmark(mfc.counterweightCorrosionResult?.status),
        counterweightCorrosionTidakMemenuhi: getOppositeCheckmark(mfc.counterweightCorrosionResult?.status),
        counterweightCorrosionResult: mfc.counterweightCorrosionResult?.result,
        counterweightConditionMemenuhi: getCheckmark(mfc.counterweightConditionResult?.status) || getNaCheckmark(mfc.counterweightConditionResult?.status),
        counterweightConditionTidakMemenuhi: getOppositeCheckmark(mfc.counterweightConditionResult?.status),
        counterweightConditionResult: mfc.counterweightConditionResult?.result,
        otherEquipmentFloorDeckMemenuhi: getCheckmark(mfc.otherEquipmentFloorDeckResult?.status) || getNaCheckmark(mfc.otherEquipmentFloorDeckResult?.status),
        otherEquipmentFloorDeckTidakMemenuhi: getOppositeCheckmark(mfc.otherEquipmentFloorDeckResult?.status),
        otherEquipmentFloorDeckResult: mfc.otherEquipmentFloorDeckResult?.result,
        otherEquipmentStairsStepsMemenuhi: getCheckmark(mfc.otherEquipmentStairsStepsResult?.status) || getNaCheckmark(mfc.otherEquipmentStairsStepsResult?.status),
        otherEquipmentStairsStepsTidakMemenuhi: getOppositeCheckmark(mfc.otherEquipmentStairsStepsResult?.status),
        otherEquipmentStairsStepsResult: mfc.otherEquipmentStairsStepsResult?.result,
        otherEquipmentFasteningBoltsMemenuhi: getCheckmark(mfc.otherEquipmentFasteningBoltsResult?.status) || getNaCheckmark(mfc.otherEquipmentFasteningBoltsResult?.status),
        otherEquipmentFasteningBoltsTidakMemenuhi: getOppositeCheckmark(mfc.otherEquipmentFasteningBoltsResult?.status),
        otherEquipmentFasteningBoltsResult: mfc.otherEquipmentFasteningBoltsResult?.result,
        otherEquipmentOperatorSeatMemenuhi: getCheckmark(mfc.otherEquipmentOperatorSeatResult?.status) || getNaCheckmark(mfc.otherEquipmentOperatorSeatResult?.status),
        otherEquipmentOperatorSeatTidakMemenuhi: getOppositeCheckmark(mfc.otherEquipmentOperatorSeatResult?.status),
        otherEquipmentOperatorSeatResult: mfc.otherEquipmentOperatorSeatResult?.result,

        // Prime Mover
        primeMoverSystemCoolingMemenuhi: getCheckmark(pm.systemCoolingResult?.status) || getNaCheckmark(pm.systemCoolingResult?.status),
        primeMoverSystemCoolingTidakMemenuhi: getOppositeCheckmark(pm.systemCoolingResult?.status),
        primeMoverSystemCoolingResult: pm.systemCoolingResult?.result,
        primeMoverSystemLubricationMemenuhi: getCheckmark(pm.systemLubricationResult?.status) || getNaCheckmark(pm.systemLubricationResult?.status),
        primeMoverSystemLubricationTidakMemenuhi: getOppositeCheckmark(pm.systemLubricationResult?.status),
        primeMoverSystemLubricationResult: pm.systemLubricationResult?.result,
        primeMoverSystemFuelMemenuhi: getCheckmark(pm.systemFuelResult?.status) || getNaCheckmark(pm.systemFuelResult?.status),
        primeMoverSystemFuelTidakMemenuhi: getOppositeCheckmark(pm.systemFuelResult?.status),
        primeMoverSystemFuelResult: pm.systemFuelResult?.result,
        primeMoverSystemAirIntakeMemenuhi: getCheckmark(pm.systemAirIntakeResult?.status) || getNaCheckmark(pm.systemAirIntakeResult?.status),
        primeMoverSystemAirIntakeTidakMemenuhi: getOppositeCheckmark(pm.systemAirIntakeResult?.status),
        primeMoverSystemAirIntakeResult: pm.systemAirIntakeResult?.result,
        primeMoverSystemExhaustGasMemenuhi: getCheckmark(pm.systemExhaustGasResult?.status) || getNaCheckmark(pm.systemExhaustGasResult?.status),
        primeMoverSystemExhaustGasTidakMemenuhi: getOppositeCheckmark(pm.systemExhaustGasResult?.status),
        primeMoverSystemExhaustGasResult: pm.systemExhaustGasResult?.result,
        primeMoverSystemStarterMemenuhi: getCheckmark(pm.systemStarterResult?.status) || getNaCheckmark(pm.systemStarterResult?.status),
        primeMoverSystemStarterTidakMemenuhi: getOppositeCheckmark(pm.systemStarterResult?.status),
        primeMoverSystemStarterResult: pm.systemStarterResult?.result,
        primeMoverElectricalBatteryMemenuhi: getCheckmark(pm.electricalBatteryResult?.status) || getNaCheckmark(pm.electricalBatteryResult?.status),
        primeMoverElectricalBatteryTidakMemenuhi: getOppositeCheckmark(pm.electricalBatteryResult?.status),
        primeMoverElectricalBatteryResult: pm.electricalBatteryResult?.result,
        primeMoverElectricalStartingDynamoMemenuhi: getCheckmark(pm.electricalStartingDynamoResult?.status) || getNaCheckmark(pm.electricalStartingDynamoResult?.status),
        primeMoverElectricalStartingDynamoTidakMemenuhi: getOppositeCheckmark(pm.electricalStartingDynamoResult?.status),
        primeMoverElectricalStartingDynamoResult: pm.electricalStartingDynamoResult?.result,
        primeMoverElectricalAlternatorMemenuhi: getCheckmark(pm.electricalAlternatorResult?.status) || getNaCheckmark(pm.electricalAlternatorResult?.status),
        primeMoverElectricalAlternatorTidakMemenuhi: getOppositeCheckmark(pm.electricalAlternatorResult?.status),
        primeMoverElectricalAlternatorResult: pm.electricalAlternatorResult?.result,
        primeMoverElectricalBatteryCableMemenuhi: getCheckmark(pm.electricalBatteryCableResult?.status) || getNaCheckmark(pm.electricalBatteryCableResult?.status),
        primeMoverElectricalBatteryCableTidakMemenuhi: getOppositeCheckmark(pm.electricalBatteryCableResult?.status),
        primeMoverElectricalBatteryCableResult: pm.electricalBatteryCableResult?.result,
        primeMoverElectricalInstallationCableMemenuhi: getCheckmark(pm.electricalInstallationCableResult?.status) || getNaCheckmark(pm.electricalInstallationCableResult?.status),
        primeMoverElectricalInstallationCableTidakMemenuhi: getOppositeCheckmark(pm.electricalInstallationCableResult?.status),
        primeMoverElectricalInstallationCableResult: pm.electricalInstallationCableResult?.result,
        primeMoverElectricalLightingLampsMemenuhi: getCheckmark(pm.electricalLightingLampsResult?.status) || getNaCheckmark(pm.electricalLightingLampsResult?.status),
        primeMoverElectricalLightingLampsTidakMemenuhi: getOppositeCheckmark(pm.electricalLightingLampsResult?.status),
        primeMoverElectricalLightingLampsResult: pm.electricalLightingLampsResult?.result,
        primeMoverElectricalSafetyLampsMemenuhi: getCheckmark(pm.electricalSafetyLampsResult?.status) || getNaCheckmark(pm.electricalSafetyLampsResult?.status),
        primeMoverElectricalSafetyLampsTidakMemenuhi: getOppositeCheckmark(pm.electricalSafetyLampsResult?.status),
        primeMoverElectricalSafetyLampsResult: pm.electricalSafetyLampsResult?.result,
        primeMoverElectricalHornMemenuhi: getCheckmark(pm.electricalHornResult?.status) || getNaCheckmark(pm.electricalHornResult?.status),
        primeMoverElectricalHornTidakMemenuhi: getOppositeCheckmark(pm.electricalHornResult?.status),
        primeMoverElectricalHornResult: pm.electricalHornResult?.result,
        primeMoverElectricalFuseMemenuhi: getCheckmark(pm.electricalFuseResult?.status) || getNaCheckmark(pm.electricalFuseResult?.status),
        primeMoverElectricalFuseTidakMemenuhi: getOppositeCheckmark(pm.electricalFuseResult?.status),
        primeMoverElectricalFuseResult: pm.electricalFuseResult?.result,

        // Dashboard
        dashboardTempIndicatorMemenuhi: getCheckmark(dsb.tempIndicatorResult?.status) || getNaCheckmark(dsb.tempIndicatorResult?.status),
        dashboardTempIndicatorTidakMemenuhi: getOppositeCheckmark(dsb.tempIndicatorResult?.status),
        dashboardTempIndicatorResult: dsb.tempIndicatorResult?.result,
        dashboardOilPressureMemenuhi: getCheckmark(dsb.oilPressureResult?.status) || getNaCheckmark(dsb.oilPressureResult?.status),
        dashboardOilPressureTidakMemenuhi: getOppositeCheckmark(dsb.oilPressureResult?.status),
        dashboardOilPressureResult: dsb.oilPressureResult?.result,
        dashboardHydraulicPressureMemenuhi: getCheckmark(dsb.hydraulicPressureResult?.status) || getNaCheckmark(dsb.hydraulicPressureResult?.status),
        dashboardHydraulicPressureTidakMemenuhi: getOppositeCheckmark(dsb.hydraulicPressureResult?.status),
        dashboardHydraulicPressureResult: dsb.hydraulicPressureResult?.result,
        dashboardHourMeterMemenuhi: getCheckmark(dsb.hourMeterResult?.status) || getNaCheckmark(dsb.hourMeterResult?.status),
        dashboardHourMeterTidakMemenuhi: getOppositeCheckmark(dsb.hourMeterResult?.status),
        dashboardHourMeterResult: dsb.hourMeterResult?.result,
        dashboardGlowPlugMemenuhi: getCheckmark(dsb.glowPlugResult?.status) || getNaCheckmark(dsb.glowPlugResult?.status),
        dashboardGlowPlugTidakMemenuhi: getOppositeCheckmark(dsb.glowPlugResult?.status),
        dashboardGlowPlugResult: dsb.glowPlugResult?.result,
        dashboardFuelIndicatorMemenuhi: getCheckmark(dsb.fuelIndicatorResult?.status) || getNaCheckmark(dsb.fuelIndicatorResult?.status),
        dashboardFuelIndicatorTidakMemenuhi: getOppositeCheckmark(dsb.fuelIndicatorResult?.status),
        dashboardFuelIndicatorResult: dsb.fuelIndicatorResult?.result,
        dashboardLoadIndicatorMemenuhi: getCheckmark(dsb.loadIndicatorResult?.status) || getNaCheckmark(dsb.loadIndicatorResult?.status),
        dashboardLoadIndicatorTidakMemenuhi: getOppositeCheckmark(dsb.loadIndicatorResult?.status),
        dashboardLoadIndicatorResult: dsb.loadIndicatorResult?.result,
        dashboardLoadChartMemenuhi: getCheckmark(dsb.loadChartResult?.status) || getNaCheckmark(dsb.loadChartResult?.status),
        dashboardLoadChartTidakMemenuhi: getOppositeCheckmark(dsb.loadChartResult?.status),
        dashboardLoadChartResult: dsb.loadChartResult?.result,

        // Power Train
        powerTrainStarterDynamoMemenuhi: getCheckmark(pt.starterDynamoResult?.status) || getNaCheckmark(pt.starterDynamoResult?.status),
        powerTrainStarterDynamoTidakMemenuhi: getOppositeCheckmark(pt.starterDynamoResult?.status),
        powerTrainStarterDynamoResult: pt.starterDynamoResult?.result,
        powerTrainSteeringWheelMemenuhi: getCheckmark(pt.steeringWheelResult?.status) || getNaCheckmark(pt.steeringWheelResult?.status),
        powerTrainSteeringWheelTidakMemenuhi: getOppositeCheckmark(pt.steeringWheelResult?.status),
        powerTrainSteeringWheelResult: pt.steeringWheelResult?.result,
        powerTrainSteeringRodMemenuhi: getCheckmark(pt.steeringRodResult?.status) || getNaCheckmark(pt.steeringRodResult?.status),
        powerTrainSteeringRodTidakMemenuhi: getOppositeCheckmark(pt.steeringRodResult?.status),
        powerTrainSteeringRodResult: pt.steeringRodResult?.result,
        powerTrainSteeringGearBoxMemenuhi: getCheckmark(pt.steeringGearBoxResult?.status) || getNaCheckmark(pt.steeringGearBoxResult?.status),
        powerTrainSteeringGearBoxTidakMemenuhi: getOppositeCheckmark(pt.steeringGearBoxResult?.status),
        powerTrainSteeringGearBoxResult: pt.steeringGearBoxResult?.result,
        powerTrainSteeringPitmanMemenuhi: getCheckmark(pt.steeringPitmanResult?.status) || getNaCheckmark(pt.steeringPitmanResult?.status),
        powerTrainSteeringPitmanTidakMemenuhi: getOppositeCheckmark(pt.steeringPitmanResult?.status),
        powerTrainSteeringPitmanResult: pt.steeringPitmanResult?.result,
        powerTrainSteeringDragLinkMemenuhi: getCheckmark(pt.steeringDragLinkResult?.status) || getNaCheckmark(pt.steeringDragLinkResult?.status),
        powerTrainSteeringDragLinkTidakMemenuhi: getOppositeCheckmark(pt.steeringDragLinkResult?.status),
        powerTrainSteeringDragLinkResult: pt.steeringDragLinkResult?.result,
        powerTrainSteeringTieRodMemenuhi: getCheckmark(pt.steeringTieRodResult?.status) || getNaCheckmark(pt.steeringTieRodResult?.status),
        powerTrainSteeringTieRodTidakMemenuhi: getOppositeCheckmark(pt.steeringTieRodResult?.status),
        powerTrainSteeringTieRodResult: pt.steeringTieRodResult?.result,
        powerTrainSteeringLubeMemenuhi: getCheckmark(pt.steeringLubeResult?.status) || getNaCheckmark(pt.steeringLubeResult?.status),
        powerTrainSteeringLubeTidakMemenuhi: getOppositeCheckmark(pt.steeringLubeResult?.status),
        powerTrainSteeringLubeResult: pt.steeringLubeResult?.result,
        powerTrainWheelsFrontMemenuhi: getCheckmark(pt.wheelsFrontResult?.status) || getNaCheckmark(pt.wheelsFrontResult?.status),
        powerTrainWheelsFrontTidakMemenuhi: getOppositeCheckmark(pt.wheelsFrontResult?.status),
        powerTrainWheelsFrontResult: pt.wheelsFrontResult?.result,
        powerTrainWheelsRearMemenuhi: getCheckmark(pt.wheelsRearResult?.status) || getNaCheckmark(pt.wheelsRearResult?.status),
        powerTrainWheelsRearTidakMemenuhi: getOppositeCheckmark(pt.wheelsRearResult?.status),
        powerTrainWheelsRearResult: pt.wheelsRearResult?.result,
        powerTrainWheelsBoltsMemenuhi: getCheckmark(pt.wheelsBoltsResult?.status) || getNaCheckmark(pt.wheelsBoltsResult?.status),
        powerTrainWheelsBoltsTidakMemenuhi: getOppositeCheckmark(pt.wheelsBoltsResult?.status),
        powerTrainWheelsBoltsResult: pt.wheelsBoltsResult?.result,
        powerTrainWheelsDrumMemenuhi: getCheckmark(pt.wheelsDrumResult?.status) || getNaCheckmark(pt.wheelsDrumResult?.status),
        powerTrainWheelsDrumTidakMemenuhi: getOppositeCheckmark(pt.wheelsDrumResult?.status),
        powerTrainWheelsDrumResult: pt.wheelsDrumResult?.result,
        powerTrainWheelsLubeMemenuhi: getCheckmark(pt.wheelsLubeResult?.status) || getNaCheckmark(pt.wheelsLubeResult?.status),
        powerTrainWheelsLubeTidakMemenuhi: getOppositeCheckmark(pt.wheelsLubeResult?.status),
        powerTrainWheelsLubeResult: pt.wheelsLubeResult?.result,
        powerTrainWheelsMechanicalMemenuhi: getCheckmark(pt.wheelsMechanicalResult?.status) || getNaCheckmark(pt.wheelsMechanicalResult?.status),
        powerTrainWheelsMechanicalTidakMemenuhi: getOppositeCheckmark(pt.wheelsMechanicalResult?.status),
        powerTrainWheelsMechanicalResult: pt.wheelsMechanicalResult?.result,
        powerTrainClutchHousingMemenuhi: getCheckmark(pt.clutchHousingResult?.status) || getNaCheckmark(pt.clutchHousingResult?.status),
        powerTrainClutchHousingTidakMemenuhi: getOppositeCheckmark(pt.clutchHousingResult?.status),
        powerTrainClutchHousingResult: pt.clutchHousingResult?.result,
        powerTrainClutchConditionMemenuhi: getCheckmark(pt.clutchConditionResult?.status) || getNaCheckmark(pt.clutchConditionResult?.status),
        powerTrainClutchConditionTidakMemenuhi: getOppositeCheckmark(pt.clutchConditionResult?.status),
        powerTrainClutchConditionResult: pt.clutchConditionResult?.result,
        powerTrainClutchTransOilMemenuhi: getCheckmark(pt.clutchTransOilResult?.status) || getNaCheckmark(pt.clutchTransOilResult?.status),
        powerTrainClutchTransOilTidakMemenuhi: getOppositeCheckmark(pt.clutchTransOilResult?.status),
        powerTrainClutchTransOilResult: pt.clutchTransOilResult?.result,
        powerTrainClutchTransLeakMemenuhi: getCheckmark(pt.clutchTransLeakResult?.status) || getNaCheckmark(pt.clutchTransLeakResult?.status),
        powerTrainClutchTransLeakTidakMemenuhi: getOppositeCheckmark(pt.clutchTransLeakResult?.status),
        powerTrainClutchTransLeakResult: pt.clutchTransLeakResult?.result,
        powerTrainClutchShaftMemenuhi: getCheckmark(pt.clutchShaftResult?.status) || getNaCheckmark(pt.clutchShaftResult?.status),
        powerTrainClutchShaftTidakMemenuhi: getOppositeCheckmark(pt.clutchShaftResult?.status),
        powerTrainClutchShaftResult: pt.clutchShaftResult?.result,
        powerTrainClutchMechanicalMemenuhi: getCheckmark(pt.clutchMechanicalResult?.status) || getNaCheckmark(pt.clutchMechanicalResult?.status),
        powerTrainClutchMechanicalTidakMemenuhi: getOppositeCheckmark(pt.clutchMechanicalResult?.status),
        powerTrainClutchMechanicalResult: pt.clutchMechanicalResult?.result,
        powerTrainDiffHousingMemenuhi: getCheckmark(pt.diffHousingResult?.status) || getNaCheckmark(pt.diffHousingResult?.status),
        powerTrainDiffHousingTidakMemenuhi: getOppositeCheckmark(pt.diffHousingResult?.status),
        powerTrainDiffHousingResult: pt.diffHousingResult?.result,
        powerTrainDiffConditionMemenuhi: getCheckmark(pt.diffConditionResult?.status) || getNaCheckmark(pt.diffConditionResult?.status),
        powerTrainDiffConditionTidakMemenuhi: getOppositeCheckmark(pt.diffConditionResult?.status),
        powerTrainDiffConditionResult: pt.diffConditionResult?.result,
        powerTrainDiffOilMemenuhi: getCheckmark(pt.diffOilResult?.status) || getNaCheckmark(pt.diffOilResult?.status),
        powerTrainDiffOilTidakMemenuhi: getOppositeCheckmark(pt.diffOilResult?.status),
        powerTrainDiffOilResult: pt.diffOilResult?.result,
        powerTrainDiffLeakMemenuhi: getCheckmark(pt.diffLeakResult?.status) || getNaCheckmark(pt.diffLeakResult?.status),
        powerTrainDiffLeakTidakMemenuhi: getOppositeCheckmark(pt.diffLeakResult?.status),
        powerTrainDiffLeakResult: pt.diffLeakResult?.result,
        powerTrainDiffShaftMemenuhi: getCheckmark(pt.diffShaftResult?.status) || getNaCheckmark(pt.diffShaftResult?.status),
        powerTrainDiffShaftTidakMemenuhi: getOppositeCheckmark(pt.diffShaftResult?.status),
        powerTrainDiffShaftResult: pt.diffShaftResult?.result,
        powerTrainBrakesMainMemenuhi: getCheckmark(pt.brakesMainResult?.status) || getNaCheckmark(pt.brakesMainResult?.status),
        powerTrainBrakesMainTidakMemenuhi: getOppositeCheckmark(pt.brakesMainResult?.status),
        powerTrainBrakesMainResult: pt.brakesMainResult?.result,
        powerTrainBrakesHandMemenuhi: getCheckmark(pt.brakesHandResult?.status) || getNaCheckmark(pt.brakesHandResult?.status),
        powerTrainBrakesHandTidakMemenuhi: getOppositeCheckmark(pt.brakesHandResult?.status),
        powerTrainBrakesHandResult: pt.brakesHandResult?.result,
        powerTrainBrakesEmergencyMemenuhi: getCheckmark(pt.brakesEmergencyResult?.status) || getNaCheckmark(pt.brakesEmergencyResult?.status),
        powerTrainBrakesEmergencyTidakMemenuhi: getOppositeCheckmark(pt.brakesEmergencyResult?.status),
        powerTrainBrakesEmergencyResult: pt.brakesEmergencyResult?.result,
        powerTrainBrakesLeakMemenuhi: getCheckmark(pt.brakesLeakResult?.status) || getNaCheckmark(pt.brakesLeakResult?.status),
        powerTrainBrakesLeakTidakMemenuhi: getOppositeCheckmark(pt.brakesLeakResult?.status),
        powerTrainBrakesLeakResult: pt.brakesLeakResult?.result,
        powerTrainBrakesMechanicalMemenuhi: getCheckmark(pt.brakesMechanicalResult?.status) || getNaCheckmark(pt.brakesMechanicalResult?.status),
        powerTrainBrakesMechanicalTidakMemenuhi: getOppositeCheckmark(pt.brakesMechanicalResult?.status),
        powerTrainBrakesMechanicalResult: pt.brakesMechanicalResult?.result,
        powerTrainTransHousingMemenuhi: getCheckmark(pt.transHousingResult?.status) || getNaCheckmark(pt.transHousingResult?.status),
        powerTrainTransHousingTidakMemenuhi: getOppositeCheckmark(pt.transHousingResult?.status),
        powerTrainTransHousingResult: pt.transHousingResult?.result,
        powerTrainTransOilMemenuhi: getCheckmark(pt.transOilResult?.status) || getNaCheckmark(pt.transOilResult?.status),
        powerTrainTransOilTidakMemenuhi: getOppositeCheckmark(pt.transOilResult?.status),
        powerTrainTransOilResult: pt.transOilResult?.result,
        powerTrainTransLeakMemenuhi: getCheckmark(pt.transLeakResult?.status) || getNaCheckmark(pt.transLeakResult?.status),
        powerTrainTransLeakTidakMemenuhi: getOppositeCheckmark(pt.transLeakResult?.status),
        powerTrainTransLeakResult: pt.transLeakResult?.result,
        powerTrainTransMechanicalMemenuhi: getCheckmark(pt.transMechanicalResult?.status) || getNaCheckmark(pt.transMechanicalResult?.status),
        powerTrainTransMechanicalTidakMemenuhi: getOppositeCheckmark(pt.transMechanicalResult?.status),
        powerTrainTransMechanicalResult: pt.transMechanicalResult?.result,

        // Attachments
        attachmentMastWearMemenuhi: getCheckmark(att.mastWearResult?.status) || getNaCheckmark(att.mastWearResult?.status),
        attachmentMastWearTidakMemenuhi: getOppositeCheckmark(att.mastWearResult?.status),
        attachmentMastWearResult: att.mastWearResult?.result,
        attachmentMastCracksMemenuhi: getCheckmark(att.mastCracksResult?.status) || getNaCheckmark(att.mastCracksResult?.status),
        attachmentMastCracksTidakMemenuhi: getOppositeCheckmark(att.mastCracksResult?.status),
        attachmentMastCracksResult: att.mastCracksResult?.result,
        attachmentMastDeformationMemenuhi: getCheckmark(att.mastDeformationResult?.status) || getNaCheckmark(att.mastDeformationResult?.status),
        attachmentMastDeformationTidakMemenuhi: getOppositeCheckmark(att.mastDeformationResult?.status),
        attachmentMastDeformationResult: att.mastDeformationResult?.result,
        attachmentMastLubeMemenuhi: getCheckmark(att.mastLubeResult?.status) || getNaCheckmark(att.mastLubeResult?.status),
        attachmentMastLubeTidakMemenuhi: getOppositeCheckmark(att.mastLubeResult?.status),
        attachmentMastLubeResult: att.mastLubeResult?.result,
        attachmentMastShaftBearingMemenuhi: getCheckmark(att.mastShaftBearingResult?.status) || getNaCheckmark(att.mastShaftBearingResult?.status),
        attachmentMastShaftBearingTidakMemenuhi: getOppositeCheckmark(att.mastShaftBearingResult?.status),
        attachmentMastShaftBearingResult: att.mastShaftBearingResult?.result,
        attachmentLiftChainConditionMemenuhi: getCheckmark(att.liftChainConditionResult?.status) || getNaCheckmark(att.liftChainConditionResult?.status),
        attachmentLiftChainConditionTidakMemenuhi: getOppositeCheckmark(att.liftChainConditionResult?.status),
        attachmentLiftChainConditionResult: att.liftChainConditionResult?.result,
        attachmentLiftChainDeformationMemenuhi: getCheckmark(att.liftChainDeformationResult?.status) || getNaCheckmark(att.liftChainDeformationResult?.status),
        attachmentLiftChainDeformationTidakMemenuhi: getOppositeCheckmark(att.liftChainDeformationResult?.status),
        attachmentLiftChainDeformationResult: att.liftChainDeformationResult?.result,
        attachmentLiftChainLubeMemenuhi: getCheckmark(att.liftChainLubeResult?.status) || getNaCheckmark(att.liftChainLubeResult?.status),
        attachmentLiftChainLubeTidakMemenuhi: getOppositeCheckmark(att.liftChainLubeResult?.status),
        attachmentLiftChainLubeResult: att.liftChainLubeResult?.result,

        // Personal Basket & Handrail
        basketFloorCorrosionMemenuhi: getCheckmark(pb.basketFloorCorrosionResult?.status) || getNaCheckmark(pb.basketFloorCorrosionResult?.status),
        basketFloorCorrosionTidakMemenuhi: getOppositeCheckmark(pb.basketFloorCorrosionResult?.status),
        basketFloorCorrosionResult: pb.basketFloorCorrosionResult?.result,
        basketFloorCracksMemenuhi: getCheckmark(pb.basketFloorCracksResult?.status) || getNaCheckmark(pb.basketFloorCracksResult?.status),
        basketFloorCracksTidakMemenuhi: getOppositeCheckmark(pb.basketFloorCracksResult?.status),
        basketFloorCracksResult: pb.basketFloorCracksResult?.result,
        basketFloorDeformationMemenuhi: getCheckmark(pb.basketFloorDeformationResult?.status) || getNaCheckmark(pb.basketFloorDeformationResult?.status),
        basketFloorDeformationTidakMemenuhi: getOppositeCheckmark(pb.basketFloorDeformationResult?.status),
        basketFloorDeformationResult: pb.basketFloorDeformationResult?.result,
        basketFloorFasteningMemenuhi: getCheckmark(pb.basketFloorFasteningResult?.status) || getNaCheckmark(pb.basketFloorFasteningResult?.status),
        basketFloorFasteningTidakMemenuhi: getOppositeCheckmark(pb.basketFloorFasteningResult?.status),
        basketFloorFasteningResult: pb.basketFloorFasteningResult?.result,
        basketFrameCorrosionMemenuhi: getCheckmark(pb.basketFrameCorrosionResult?.status) || getNaCheckmark(pb.basketFrameCorrosionResult?.status),
        basketFrameCorrosionTidakMemenuhi: getOppositeCheckmark(pb.basketFrameCorrosionResult?.status),
        basketFrameCorrosionResult: pb.basketFrameCorrosionResult?.result,
        basketFrameCracksMemenuhi: getCheckmark(pb.basketFrameCracksResult?.status) || getNaCheckmark(pb.basketFrameCracksResult?.status),
        basketFrameCracksTidakMemenuhi: getOppositeCheckmark(pb.basketFrameCracksResult?.status),
        basketFrameCracksResult: pb.basketFrameCracksResult?.result,
        basketFrameDeformationMemenuhi: getCheckmark(pb.basketFrameDeformationResult?.status) || getNaCheckmark(pb.basketFrameDeformationResult?.status),
        basketFrameDeformationTidakMemenuhi: getOppositeCheckmark(pb.basketFrameDeformationResult?.status),
        basketFrameDeformationResult: pb.basketFrameDeformationResult?.result,
        basketFrameCrossBracingMemenuhi: getCheckmark(pb.basketFrameCrossBracingResult?.status) || getNaCheckmark(pb.basketFrameCrossBracingResult?.status),
        basketFrameCrossBracingTidakMemenuhi: getOppositeCheckmark(pb.basketFrameCrossBracingResult?.status),
        basketFrameCrossBracingResult: pb.basketFrameCrossBracingResult?.result,
        basketFrameDiagonalBracingMemenuhi: getCheckmark(pb.basketFrameDiagonalBracingResult?.status) || getNaCheckmark(pb.basketFrameDiagonalBracingResult?.status),
        basketFrameDiagonalBracingTidakMemenuhi: getOppositeCheckmark(pb.basketFrameDiagonalBracingResult?.status),
        basketFrameDiagonalBracingResult: pb.basketFrameDiagonalBracingResult?.result,
        basketBoltsCorrosionMemenuhi: getCheckmark(pb.basketBoltsCorrosionResult?.status) || getNaCheckmark(pb.basketBoltsCorrosionResult?.status),
        basketBoltsCorrosionTidakMemenuhi: getOppositeCheckmark(pb.basketBoltsCorrosionResult?.status),
        basketBoltsCorrosionResult: pb.basketBoltsCorrosionResult?.result,
        basketBoltsCracksMemenuhi: getCheckmark(pb.basketBoltsCracksResult?.status) || getNaCheckmark(pb.basketBoltsCracksResult?.status),
        basketBoltsCracksTidakMemenuhi: getOppositeCheckmark(pb.basketBoltsCracksResult?.status),
        basketBoltsCracksResult: pb.basketBoltsCracksResult?.result,
        basketBoltsDeformationMemenuhi: getCheckmark(pb.basketBoltsDeformationResult?.status) || getNaCheckmark(pb.basketBoltsDeformationResult?.status),
        basketBoltsDeformationTidakMemenuhi: getOppositeCheckmark(pb.basketBoltsDeformationResult?.status),
        basketBoltsDeformationResult: pb.basketBoltsDeformationResult?.result,
        basketBoltsFasteningMemenuhi: getCheckmark(pb.basketBoltsFasteningResult?.status) || getNaCheckmark(pb.basketBoltsFasteningResult?.status),
        basketBoltsFasteningTidakMemenuhi: getOppositeCheckmark(pb.basketBoltsFasteningResult?.status),
        basketBoltsFasteningResult: pb.basketBoltsFasteningResult?.result,
        basketDoorCorrosionMemenuhi: getCheckmark(pb.basketDoorCorrosionResult?.status) || getNaCheckmark(pb.basketDoorCorrosionResult?.status),
        basketDoorCorrosionTidakMemenuhi: getOppositeCheckmark(pb.basketDoorCorrosionResult?.status),
        basketDoorCorrosionResult: pb.basketDoorCorrosionResult?.result,
        basketDoorCracksMemenuhi: getCheckmark(pb.basketDoorCracksResult?.status) || getNaCheckmark(pb.basketDoorCracksResult?.status),
        basketDoorCracksTidakMemenuhi: getOppositeCheckmark(pb.basketDoorCracksResult?.status),
        basketDoorCracksResult: pb.basketDoorCracksResult?.result,
        basketDoorDeformationMemenuhi: getCheckmark(pb.basketDoorDeformationResult?.status) || getNaCheckmark(pb.basketDoorDeformationResult?.status),
        basketDoorDeformationTidakMemenuhi: getOppositeCheckmark(pb.basketDoorDeformationResult?.status),
        basketDoorDeformationResult: pb.basketDoorDeformationResult?.result,
        basketDoorFasteningMemenuhi: getCheckmark(pb.basketDoorFasteningResult?.status) || getNaCheckmark(pb.basketDoorFasteningResult?.status),
        basketDoorFasteningTidakMemenuhi: getOppositeCheckmark(pb.basketDoorFasteningResult?.status),
        basketDoorFasteningResult: pb.basketDoorFasteningResult?.result,
        handrailCracksMemenuhi: getCheckmark(pb.handrailCracksResult?.status) || getNaCheckmark(pb.handrailCracksResult?.status),
        handrailCracksTidakMemenuhi: getOppositeCheckmark(pb.handrailCracksResult?.status),
        handrailCracksResult: pb.handrailCracksResult?.result,
        handrailWearMemenuhi: getCheckmark(pb.handrailWearResult?.status) || getNaCheckmark(pb.handrailWearResult?.status),
        handrailWearTidakMemenuhi: getOppositeCheckmark(pb.handrailWearResult?.status),
        handrailWearResult: pb.handrailWearResult?.result,
        handrailCracks2Memenuhi: getCheckmark(pb.handrailCracks2Result?.status) || getNaCheckmark(pb.handrailCracks2Result?.status),
        handrailCracks2TidakMemenuhi: getOppositeCheckmark(pb.handrailCracks2Result?.status),
        handrailCracks2Result: pb.handrailCracks2Result?.result,
        handrailRailStraightnessMemenuhi: getCheckmark(pb.handrailRailStraightnessResult?.status) || getNaCheckmark(pb.handrailRailStraightnessResult?.status),
        handrailRailStraightnessTidakMemenuhi: getOppositeCheckmark(pb.handrailRailStraightnessResult?.status),
        handrailRailStraightnessResult: pb.handrailRailStraightnessResult?.result,
        handrailRailJointsMemenuhi: getCheckmark(pb.handrailRailJointsResult?.status) || getNaCheckmark(pb.handrailRailJointsResult?.status),
        handrailRailJointsTidakMemenuhi: getOppositeCheckmark(pb.handrailRailJointsResult?.status),
        handrailRailJointsResult: pb.handrailRailJointsResult?.result,
        handrailInterRailStraightnessMemenuhi: getCheckmark(pb.handrailInterRailStraightnessResult?.status) || getNaCheckmark(pb.handrailInterRailStraightnessResult?.status),
        handrailInterRailStraightnessTidakMemenuhi: getOppositeCheckmark(pb.handrailInterRailStraightnessResult?.status),
        handrailInterRailStraightnessResult: pb.handrailInterRailStraightnessResult?.result,
        handrailRailJointGapMemenuhi: getCheckmark(pb.handrailRailJointGapResult?.status) || getNaCheckmark(pb.handrailRailJointGapResult?.status),
        handrailRailJointGapTidakMemenuhi: getOppositeCheckmark(pb.handrailRailJointGapResult?.status),
        handrailRailJointGapResult: pb.handrailRailJointGapResult?.result,
        handrailRailFastenersMemenuhi: getCheckmark(pb.handrailRailFastenersResult?.status) || getNaCheckmark(pb.handrailRailFastenersResult?.status),
        handrailRailFastenersTidakMemenuhi: getOppositeCheckmark(pb.handrailRailFastenersResult?.status),
        handrailRailFastenersResult: pb.handrailRailFastenersResult?.result,
        handrailRailStopperMemenuhi: getCheckmark(pb.handrailRailStopperResult?.status) || getNaCheckmark(pb.handrailRailStopperResult?.status),
        handrailRailStopperTidakMemenuhi: getOppositeCheckmark(pb.handrailRailStopperResult?.status),
        handrailRailStopperResult: pb.handrailRailStopperResult?.result,
        
        // Hydraulic Components
        hydraulicTankLeakageMemenuhi: getCheckmark(hc.tankLeakageResult?.status) || getNaCheckmark(hc.tankLeakageResult?.status),
        hydraulicTankLeakageTidakMemenuhi: getOppositeCheckmark(hc.tankLeakageResult?.status),
        hydraulicTankLeakageResult: hc.tankLeakageResult?.result,
        hydraulicTankOilLevelMemenuhi: getCheckmark(hc.tankOilLevelResult?.status) || getNaCheckmark(hc.tankOilLevelResult?.status),
        hydraulicTankOilLevelTidakMemenuhi: getOppositeCheckmark(hc.tankOilLevelResult?.status),
        hydraulicTankOilLevelResult: hc.tankOilLevelResult?.result,
        hydraulicTankOilConditionMemenuhi: getCheckmark(hc.tankOilConditionResult?.status) || getNaCheckmark(hc.tankOilConditionResult?.status),
        hydraulicTankOilConditionTidakMemenuhi: getOppositeCheckmark(hc.tankOilConditionResult?.status),
        hydraulicTankOilConditionResult: hc.tankOilConditionResult?.result,
        hydraulicTankSuctionLineMemenuhi: getCheckmark(hc.tankSuctionLineResult?.status) || getNaCheckmark(hc.tankSuctionLineResult?.status),
        hydraulicTankSuctionLineTidakMemenuhi: getOppositeCheckmark(hc.tankSuctionLineResult?.status),
        hydraulicTankSuctionLineResult: hc.tankSuctionLineResult?.result,
        hydraulicTankReturnLineMemenuhi: getCheckmark(hc.tankReturnLineResult?.status) || getNaCheckmark(hc.tankReturnLineResult?.status),
        hydraulicTankReturnLineTidakMemenuhi: getOppositeCheckmark(hc.tankReturnLineResult?.status),
        hydraulicTankReturnLineResult: hc.tankReturnLineResult?.result,
        hydraulicPumpLeakageMemenuhi: getCheckmark(hc.pumpLeakageResult?.status) || getNaCheckmark(hc.pumpLeakageResult?.status),
        hydraulicPumpLeakageTidakMemenuhi: getOppositeCheckmark(hc.pumpLeakageResult?.status),
        hydraulicPumpLeakageResult: hc.pumpLeakageResult?.result,
        hydraulicPumpSuctionLineMemenuhi: getCheckmark(hc.pumpSuctionLineResult?.status) || getNaCheckmark(hc.pumpSuctionLineResult?.status),
        hydraulicPumpSuctionLineTidakMemenuhi: getOppositeCheckmark(hc.pumpSuctionLineResult?.status),
        hydraulicPumpSuctionLineResult: hc.pumpSuctionLineResult?.result,
        hydraulicPumpPressureLineMemenuhi: getCheckmark(hc.pumpPressureLineResult?.status) || getNaCheckmark(hc.pumpPressureLineResult?.status),
        hydraulicPumpPressureLineTidakMemenuhi: getOppositeCheckmark(hc.pumpPressureLineResult?.status),
        hydraulicPumpPressureLineResult: hc.pumpPressureLineResult?.result,
        hydraulicPumpFunctionMemenuhi: getCheckmark(hc.pumpFunctionResult?.status) || getNaCheckmark(hc.pumpFunctionResult?.status),
        hydraulicPumpFunctionTidakMemenuhi: getOppositeCheckmark(hc.pumpFunctionResult?.status),
        hydraulicPumpFunctionResult: hc.pumpFunctionResult?.result,
        hydraulicPumpNoiseMemenuhi: getCheckmark(hc.pumpNoiseResult?.status) || getNaCheckmark(hc.pumpNoiseResult?.status),
        hydraulicPumpNoiseTidakMemenuhi: getOppositeCheckmark(hc.pumpNoiseResult?.status),
        hydraulicPumpNoiseResult: hc.pumpNoiseResult?.result,
        hydraulicValveLeakageMemenuhi: getCheckmark(hc.valveLeakageResult?.status) || getNaCheckmark(hc.valveLeakageResult?.status),
        hydraulicValveLeakageTidakMemenuhi: getOppositeCheckmark(hc.valveLeakageResult?.status),
        hydraulicValveLeakageResult: hc.valveLeakageResult?.result,
        hydraulicValveLineConditionMemenuhi: getCheckmark(hc.valveLineConditionResult?.status) || getNaCheckmark(hc.valveLineConditionResult?.status),
        hydraulicValveLineConditionTidakMemenuhi: getOppositeCheckmark(hc.valveLineConditionResult?.status),
        hydraulicValveLineConditionResult: hc.valveLineConditionResult?.result,
        hydraulicValveReliefFunctionMemenuhi: getCheckmark(hc.valveReliefFunctionResult?.status) || getNaCheckmark(hc.valveReliefFunctionResult?.status),
        hydraulicValveReliefFunctionTidakMemenuhi: getOppositeCheckmark(hc.valveReliefFunctionResult?.status),
        hydraulicValveReliefFunctionResult: hc.valveReliefFunctionResult?.result,
        hydraulicValveNoiseMemenuhi: getCheckmark(hc.valveNoiseResult?.status) || getNaCheckmark(hc.valveNoiseResult?.status),
        hydraulicValveNoiseTidakMemenuhi: getOppositeCheckmark(hc.valveNoiseResult?.status),
        hydraulicValveNoiseResult: hc.valveNoiseResult?.result,
        hydraulicValveLiftCylinderMemenuhi: getCheckmark(hc.valveLiftCylinderResult?.status) || getNaCheckmark(hc.valveLiftCylinderResult?.status),
        hydraulicValveLiftCylinderTidakMemenuhi: getOppositeCheckmark(hc.valveLiftCylinderResult?.status),
        hydraulicValveLiftCylinderResult: hc.valveLiftCylinderResult?.result,
        hydraulicValveTiltCylinderMemenuhi: getCheckmark(hc.valveTiltCylinderResult?.status) || getNaCheckmark(hc.valveTiltCylinderResult?.status),
        hydraulicValveTiltCylinderTidakMemenuhi: getOppositeCheckmark(hc.valveTiltCylinderResult?.status),
        hydraulicValveTiltCylinderResult: hc.valveTiltCylinderResult?.result,
        hydraulicValveSteeringCylinderMemenuhi: getCheckmark(hc.valveSteeringCylinderResult?.status) || getNaCheckmark(hc.valveSteeringCylinderResult?.status),
        hydraulicValveSteeringCylinderTidakMemenuhi: getOppositeCheckmark(hc.valveSteeringCylinderResult?.status),
        hydraulicValveSteeringCylinderResult: hc.valveSteeringCylinderResult?.result,
        hydraulicActuatorLeakageMemenuhi: getCheckmark(hc.actuatorLeakageResult?.status) || getNaCheckmark(hc.actuatorLeakageResult?.status),
        hydraulicActuatorLeakageTidakMemenuhi: getOppositeCheckmark(hc.actuatorLeakageResult?.status),
        hydraulicActuatorLeakageResult: hc.actuatorLeakageResult?.result,
        hydraulicActuatorLineConditionMemenuhi: getCheckmark(hc.actuatorLineConditionResult?.status) || getNaCheckmark(hc.actuatorLineConditionResult?.status),
        hydraulicActuatorLineConditionTidakMemenuhi: getOppositeCheckmark(hc.actuatorLineConditionResult?.status),
        hydraulicActuatorLineConditionResult: hc.actuatorLineConditionResult?.result,
        hydraulicActuatorNoiseMemenuhi: getCheckmark(hc.actuatorNoiseResult?.status) || getNaCheckmark(hc.actuatorNoiseResult?.status),
        hydraulicActuatorNoiseTidakMemenuhi: getOppositeCheckmark(hc.actuatorNoiseResult?.status),
        hydraulicActuatorNoiseResult: hc.actuatorNoiseResult?.result,
        
        // Engine On Checks
        engineOnStarterDynamoMemenuhi: getCheckmark(eoc.starterDynamoResult?.status) || getNaCheckmark(eoc.starterDynamoResult?.status),
        engineOnStarterDynamoTidakMemenuhi: getOppositeCheckmark(eoc.starterDynamoResult?.status),
        engineOnStarterDynamoResult: eoc.starterDynamoResult?.result,
        engineOnInstrumentMemenuhi: getCheckmark(eoc.instrumentResult?.status) || getNaCheckmark(eoc.instrumentResult?.status),
        engineOnInstrumentTidakMemenuhi: getOppositeCheckmark(eoc.instrumentResult?.status),
        engineOnInstrumentResult: eoc.instrumentResult?.result,
        engineOnElectricalMemenuhi: getCheckmark(eoc.electricalResult?.status) || getNaCheckmark(eoc.electricalResult?.status),
        engineOnElectricalTidakMemenuhi: getOppositeCheckmark(eoc.electricalResult?.status),
        engineOnElectricalResult: eoc.electricalResult?.result,
        leakageEngineOilMemenuhi: getCheckmark(eoc.leakageEngineOilResult?.status) || getNaCheckmark(eoc.leakageEngineOilResult?.status),
        leakageEngineOilTidakMemenuhi: getOppositeCheckmark(eoc.leakageEngineOilResult?.status),
        leakageEngineOilResult: eoc.leakageEngineOilResult?.result,
        leakageFuelMemenuhi: getCheckmark(eoc.leakageFuelResult?.status) || getNaCheckmark(eoc.leakageFuelResult?.status),
        leakageFuelTidakMemenuhi: getOppositeCheckmark(eoc.leakageFuelResult?.status),
        leakageFuelResult: eoc.leakageFuelResult?.result,
        leakageCoolantMemenuhi: getCheckmark(eoc.leakageCoolantResult?.status) || getNaCheckmark(eoc.leakageCoolantResult?.status),
        leakageCoolantTidakMemenuhi: getOppositeCheckmark(eoc.leakageCoolantResult?.status),
        leakageCoolantResult: eoc.leakageCoolantResult?.result,
        leakageHydraulicOilMemenuhi: getCheckmark(eoc.leakageHydraulicOilResult?.status) || getNaCheckmark(eoc.leakageHydraulicOilResult?.status),
        leakageHydraulicOilTidakMemenuhi: getOppositeCheckmark(eoc.leakageHydraulicOilResult?.status),
        leakageHydraulicOilResult: eoc.leakageHydraulicOilResult?.result,
        leakageTransmissionOilMemenuhi: getCheckmark(eoc.leakageTransmissionOilResult?.status) || getNaCheckmark(eoc.leakageTransmissionOilResult?.status),
        leakageTransmissionOilTidakMemenuhi: getOppositeCheckmark(eoc.leakageTransmissionOilResult?.status),
        leakageTransmissionOilResult: eoc.leakageTransmissionOilResult?.result,
        leakageFinalDriveOilMemenuhi: getCheckmark(eoc.leakageFinalDriveOilResult?.status) || getNaCheckmark(eoc.leakageFinalDriveOilResult?.status),
        leakageFinalDriveOilTidakMemenuhi: getOppositeCheckmark(eoc.leakageFinalDriveOilResult?.status),
        leakageFinalDriveOilResult: eoc.leakageFinalDriveOilResult?.result,
        leakageBrakeFluidMemenuhi: getCheckmark(eoc.leakageBrakeFluidResult?.status) || getNaCheckmark(eoc.leakageBrakeFluidResult?.status),
        leakageBrakeFluidTidakMemenuhi: getOppositeCheckmark(eoc.leakageBrakeFluidResult?.status),
        leakageBrakeFluidResult: eoc.leakageBrakeFluidResult?.result,
        engineOnClutchMemenuhi: getCheckmark(eoc.clutchResult?.status) || getNaCheckmark(eoc.clutchResult?.status),
        engineOnClutchTidakMemenuhi: getOppositeCheckmark(eoc.clutchResult?.status),
        engineOnClutchResult: eoc.clutchResult?.result,
        engineOnTransmissionMemenuhi: getCheckmark(eoc.transmissionResult?.status) || getNaCheckmark(eoc.transmissionResult?.status),
        engineOnTransmissionTidakMemenuhi: getOppositeCheckmark(eoc.transmissionResult?.status),
        engineOnTransmissionResult: eoc.transmissionResult?.result,
        engineOnBrakeMemenuhi: getCheckmark(eoc.brakeResult?.status) || getNaCheckmark(eoc.brakeResult?.status),
        engineOnBrakeTidakMemenuhi: getOppositeCheckmark(eoc.brakeResult?.status),
        engineOnBrakeResult: eoc.brakeResult?.result,
        engineOnHornAlarmMemenuhi: getCheckmark(eoc.hornAlarmResult?.status) || getNaCheckmark(eoc.hornAlarmResult?.status),
        engineOnHornAlarmTidakMemenuhi: getOppositeCheckmark(eoc.hornAlarmResult?.status),
        engineOnHornAlarmResult: eoc.hornAlarmResult?.result,
        engineOnLampsMemenuhi: getCheckmark(eoc.lampsResult?.status) || getNaCheckmark(eoc.lampsResult?.status),
        engineOnLampsTidakMemenuhi: getOppositeCheckmark(eoc.lampsResult?.status),
        engineOnLampsResult: eoc.lampsResult?.result,
        engineOnHydraulicMotorMemenuhi: getCheckmark(eoc.hydraulicMotorResult?.status) || getNaCheckmark(eoc.hydraulicMotorResult?.status),
        engineOnHydraulicMotorTidakMemenuhi: getOppositeCheckmark(eoc.hydraulicMotorResult?.status),
        engineOnHydraulicMotorResult: eoc.hydraulicMotorResult?.result,
        engineOnSteeringCylinderMemenuhi: getCheckmark(eoc.steeringCylinderResult?.status) || getNaCheckmark(eoc.steeringCylinderResult?.status),
        engineOnSteeringCylinderTidakMemenuhi: getOppositeCheckmark(eoc.steeringCylinderResult?.status),
        engineOnSteeringCylinderResult: eoc.steeringCylinderResult?.result,
        engineOnLiftingCylinderMemenuhi: getCheckmark(eoc.liftingCylinderResult?.status) || getNaCheckmark(eoc.liftingCylinderResult?.status),
        engineOnLiftingCylinderTidakMemenuhi: getOppositeCheckmark(eoc.liftingCylinderResult?.status),
        engineOnLiftingCylinderResult: eoc.liftingCylinderResult?.result,
        engineOnTiltingCylinderMemenuhi: getCheckmark(eoc.tiltingCylinderResult?.status) || getNaCheckmark(eoc.tiltingCylinderResult?.status),
        engineOnTiltingCylinderTidakMemenuhi: getOppositeCheckmark(eoc.tiltingCylinderResult?.status),
        engineOnTiltingCylinderResult: eoc.tiltingCylinderResult?.result,
        engineOnExhaustGasMemenuhi: getCheckmark(eoc.exhaustGasResult?.status) || getNaCheckmark(eoc.exhaustGasResult?.status),
        engineOnExhaustGasTidakMemenuhi: getOppositeCheckmark(eoc.exhaustGasResult?.status),
        engineOnExhaustGasResult: eoc.exhaustGasResult?.result,
        engineOnControlLeversMemenuhi: getCheckmark(eoc.controlLeversResult?.status) || getNaCheckmark(eoc.controlLeversResult?.status),
        engineOnControlLeversTidakMemenuhi: getOppositeCheckmark(eoc.controlLeversResult?.status),
        engineOnControlLeversResult: eoc.controlLeversResult?.result,
        noiseEngineMemenuhi: getCheckmark(eoc.noiseEngineResult?.status) || getNaCheckmark(eoc.noiseEngineResult?.status),
        noiseEngineTidakMemenuhi: getOppositeCheckmark(eoc.noiseEngineResult?.status),
        noiseEngineResult: eoc.noiseEngineResult?.result,
        noiseTurbochargerMemenuhi: getCheckmark(eoc.noiseTurbochargerResult?.status) || getNaCheckmark(eoc.noiseTurbochargerResult?.status),
        noiseTurbochargerTidakMemenuhi: getOppositeCheckmark(eoc.noiseTurbochargerResult?.status),
        noiseTurbochargerResult: eoc.noiseTurbochargerResult?.result,
        noiseTransmissionMemenuhi: getCheckmark(eoc.noiseTransmissionResult?.status) || getNaCheckmark(eoc.noiseTransmissionResult?.status),
        noiseTransmissionTidakMemenuhi: getOppositeCheckmark(eoc.noiseTransmissionResult?.status),
        noiseTransmissionResult: eoc.noiseTransmissionResult?.result,
        noiseHydraulicPumpMemenuhi: getCheckmark(eoc.noiseHydraulicPumpResult?.status) || getNaCheckmark(eoc.noiseHydraulicPumpResult?.status),
        noiseHydraulicPumpTidakMemenuhi: getOppositeCheckmark(eoc.noiseHydraulicPumpResult?.status),
        noiseHydraulicPumpResult: eoc.noiseHydraulicPumpResult?.result,
        noiseProtectiveCoverMemenuhi: getCheckmark(eoc.noiseProtectiveCoverResult?.status) || getNaCheckmark(eoc.noiseProtectiveCoverResult?.status),
        noiseProtectiveCoverTidakMemenuhi: getOppositeCheckmark(eoc.noiseProtectiveCoverResult?.status),
        noiseProtectiveCoverResult: eoc.noiseProtectiveCoverResult?.result,

        // Conclusion & Recommendation
        conclusion: data.conclusion,
        recomendation: data.recommendation,
    };

        // 1. Meratakan Data Pemeriksaan Rantai
    if (test.liftingChainInspection && Array.isArray(test.liftingChainInspection)) {
        test.liftingChainInspection.forEach((item, index) => {
            const rowNum = index + 1; // Mulai dari 1
            renderData[`chainInspectionInspectedPart${rowNum}`] = item.inspectedPart;
            renderData[`chainInspectionContructionType${rowNum}`] = item.constructionType;
            renderData[`chainInspectionStandardPitch${rowNum}`] = item.standardPitch;
            renderData[`chainInspectionMeasuredPitch${rowNum}`] = item.measuredPitch;
            renderData[`chainInspectionStandardPin${rowNum}`] = item.standardPin;
            renderData[`chainInspectionMeasuredPin${rowNum}`] = item.measuredPin;
            renderData[`chainInspectionInspectResult${rowNum}`] = item.result;
        });
    }

    // 2. Meratakan Data Pengujian Tidak Merusak (NDT)
    renderData.NonDestructiveTestNdtType = test.nonDestructiveTesting?.ndtType;
    if (test.nonDestructiveTesting?.results && Array.isArray(test.nonDestructiveTesting.results)) {
        test.nonDestructiveTesting.results.forEach((item, index) => {
            const rowNum = index + 1; // Mulai dari 1
            renderData[`nonDestructiveTestInspectedPart${rowNum}`] = item.inspectedPart;
            renderData[`nonDestructiveTestLocation${rowNum}`] = item.location;
            renderData[`nonDestructiveTestDefectTrue${rowNum}`] = item.defectFound; // Langsung gunakan nilai dari data
            renderData[`nonDestructiveTestDefectFalse${rowNum}`] = item.defectNotFound; // Langsung gunakan nilai dari data
            renderData[`nonDestructiveTestResult${rowNum}`] = item.result;
        });
    }
    
    // 3. Meratakan Data Pengujian Beban
    if (test.loadTesting && Array.isArray(test.loadTesting)) {
        test.loadTesting.forEach((item, index) => {
            const rowNum = index + 1; // Mulai dari 1
            renderData[`loadTestLiftingHeight${rowNum}`] = item.liftingHeight;
            renderData[`loadTestTestLoad${rowNum}`] = item.testLoad;
            renderData[`loadTestSpeed${rowNum}`] = item.speed;
            renderData[`loadTestMovement${rowNum}`] = item.movement;
            renderData[`loadTestRemarks${rowNum}`] = item.remarks;
            renderData[`loadTestResult${rowNum}`] = item.result;
        });
    }

    try {
        doc.render(renderData);
    } catch (error) {
        console.error("GAGAL RENDER DOKUMEN:", error.message);
        const e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        };
        console.log(JSON.stringify({error: e}));
        throw error;
    }

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
    const ownerName = g.ownerName?.replace(/\s+/g, '-') || 'UnknownOwner';
    const fileName = `Laporan-Forklift-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanForklift,
};