'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { storage, BUCKET_NAME } = require('../../../../../utils/storage');

const getCheckmark = (status) => (status === true ? '√' : '');
const getOppositeCheckmark = (status) => (status === false ? '√' : '');

const createLaporanPtpMesin = async (data) => {
    const templatePath = 'ptp/mesin/laporanPtpMesin.docx';

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template Laporan PTP Mesin:', error);
        throw new Error('Template dokumen Laporan PTP Mesin tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => ""
    });
    
    const g = data.generalData || {};
    const t = data.technicalData || {};
    const v = data.visualInspection || {};
    const test = data.testingAndMeasurement || {};
    const elec = data.electricalPanelComponents || {};
    const conc = data.conclusionAndRecommendation || {};
    const admin = data.administration || {};
    const found = data.foundationAnalysis || {};
    const env = data.environmentalMeasurement || {};


    const renderData = {
        examinationType: data.examinationType,
        subInspectionType: data.subInspectionType,
        companyName: g.companyName,
        companyLocation: g.companyLocation,
        userInCharge: g.userInCharge,
        userAddressInCharge: g.userAddressInCharge,
        subcontractorPersonInCharge: g.subcontractorPersonInCharge,
        unitLocation: g.unitLocation,
        equipmentType: g.equipmentType,
        brandType: g.brandType,
        serialNumberUnitNumber: g.serialNumberUnitNumber,
        manufacturer: g.manufacturer,
        locationAndYearOfManufacture: g.locationAndYearOfManufacture,
        technicalDataDieselMotorPowerRpm: g.technicalDataDieselMotorPowerRpm,
        intendedUse: g.intendedUse,
        pjk3SkpNo: g.pjk3SkpNo,
        ak3SkpNo: g.ak3SkpNo,
        usagePermitNumber: g.usagePermitNumber,
        operatorName: g.operatorName,
        equipmentHistory: g.equipmentHistory,
        
        technicalDataMaxFeederSpeed: t.machineSpecification?.technicalDataMaxFeederSpeed,
        technicalDataMaxPlateWidth: t.machineSpecification?.technicalDataMaxPlateWidth,
        technicalDataPlateThickness: t.machineSpecification?.technicalDataPlateThickness,
        technicalDataMaxPlateWeight: t.machineSpecification?.technicalDataMaxPlateWeight,
        technicalDataMaxInnerCoilDiameter: t.machineSpecification?.technicalDataMaxInnerCoilDiameter,
        technicalDataMaxOuterCoilDiameter: t.machineSpecification?.technicalDataMaxOuterCoilDiameter,
        technicalDataDriveMotor: t.machineSpecification?.technicalDataDriveMotor,
        technicalDataMachineWeight: t.machineSpecification?.technicalDataMachineWeight,
        technicalDataOverallDimension: t.machineSpecification?.technicalDataOverallDimension,
        technicalDataFoundationDim: t.foundationDimension?.technicalDataFoundationDim,
        technicalDataFoundationDistance: t.foundationDimension?.technicalDataFoundationDistance,
        technicalDataVibrationDamperType: t.foundationDimension?.technicalDataVibrationDamperType,
        technicalDataFoundationWeight1: t.foundationDimension?.technicalDataFoundationWeight1,
        technicalDataFoundationWeight2: t.foundationDimension?.technicalDataFoundationWeight2,

        visualCheckFoundationTrue: getCheckmark(v.foundation?.status),
        visualCheckFoundationFalse: getOppositeCheckmark(v.foundation?.status),
        visualCheckFoundationResult: v.foundation?.result,
        visualCheckFoundationBearingTrue: getCheckmark(v.foundationBearing?.status),
        visualCheckFoundationBearingFalse: getOppositeCheckmark(v.foundationBearing?.status),
        visualCheckFoundationBearingResult: v.foundationBearing?.result,
        visualCheckMainFrameTrue: getCheckmark(v.machineFrame?.mainFrame?.status),
        visualCheckMainFrameFalse: getOppositeCheckmark(v.machineFrame?.mainFrame?.status),
        visualCheckMainFrameResult: v.machineFrame?.mainFrame?.result,
        visualCheckBraceFrameTrue: getCheckmark(v.machineFrame?.braceFrame?.status),
        visualCheckBraceFrameFalse: getOppositeCheckmark(v.machineFrame?.braceFrame?.status),
        visualCheckBraceFrameResult: v.machineFrame?.braceFrame?.result,
        visualCheckRollerTrue: getCheckmark(v.roller?.status),
        visualCheckRollerFalse: getOppositeCheckmark(v.roller?.status),
        visualCheckRollerResult: v.roller?.result,
        visualCheckControlPanelTrue: getCheckmark(v.controlPanel?.status),
        visualCheckControlPanelFalse: getOppositeCheckmark(v.controlPanel?.status),
        visualCheckControlPanelResult: v.controlPanel?.result,
        visualCheckDisplayTrue: getCheckmark(v.display?.status),
        visualCheckDisplayFalse: getOppositeCheckmark(v.display?.status),
        visualCheckDisplayResult: v.display?.result,
        visualCheckOperationButtonsTrue: getCheckmark(v.operationButtons?.status),
        visualCheckOperationButtonsFalse: getOppositeCheckmark(v.operationButtons?.status),
        visualCheckOperationButtonsResult: v.operationButtons?.result,

        electricVoltage: v.electricalComponents?.measurements?.electricVoltage,
        electricPhase: v.electricalComponents?.measurements?.electricPhase,
        electricFrequency: v.electricalComponents?.measurements?.electricFrequency,
        electricAmper: v.electricalComponents?.measurements?.electricAmper,

        visualCheckElectricalVoltageTrue: getCheckmark(v.electricalComponents?.voltage?.status),
        visualCheckElectricalVoltageFalse: getOppositeCheckmark(v.electricalComponents?.voltage?.status),
        visualCheckElectricalVoltageResult: v.electricalComponents?.voltage?.result,
        visualCheckElectricalPowerTrue: getCheckmark(v.electricalComponents?.power?.status),
        visualCheckElectricalPowerFalse: getOppositeCheckmark(v.electricalComponents?.power?.status),
        visualCheckElectricalPowerResult: v.electricalComponents?.power?.result,
        visualCheckElectricalPhaseTrue: getCheckmark(v.electricalComponents?.phase?.status),
        visualCheckElectricalPhaseFalse: getOppositeCheckmark(v.electricalComponents?.phase?.status),
        visualCheckElectricalPhaseResult: v.electricalComponents?.phase?.result,
        visualCheckElectricalFrequencyTrue: getCheckmark(v.electricalComponents?.frequency?.status),
        visualCheckElectricalFrequencyFalse: getOppositeCheckmark(v.electricalComponents?.frequency?.status),
        visualCheckElectricalFrequencyResult: v.electricalComponents?.frequency?.result,
        visualCheckElectricalCurrentTrue: getCheckmark(v.electricalComponents?.current?.status),
        visualCheckElectricalCrentFalseur: getOppositeCheckmark(v.electricalComponents?.current?.status),
        visualCheckElectricalCurrentResult: v.electricalComponents?.current?.result,
        visualCheckElectricalPanelTrue: getCheckmark(v.electricalComponents?.electricalPanel?.status),
        visualCheckElectricalPanelFalse: getOppositeCheckmark(v.electricalComponents?.electricalPanel?.status),
        visualCheckElectricalPanelResult: v.electricalComponents?.electricalPanel?.result,
        visualCheckElectricalConductorTrue: getCheckmark(v.electricalComponents?.conductor?.status),
        visualCheckElectricalConductorFalse: getOppositeCheckmark(v.electricalComponents?.conductor?.status),
        visualCheckElectricalConductorResult: v.electricalComponents?.conductor?.result,
        visualCheckElectricalInsulationTrue: getCheckmark(v.electricalComponents?.insulation?.status),
        visualCheckElectricalInsulationFalse: getOppositeCheckmark(v.electricalComponents?.insulation?.status),
        visualCheckElectricalInsulationResult: v.electricalComponents?.insulation?.result,

        visualCheckSafetyLimitSwitchUpTrue: getCheckmark(v.safetyDevices?.limitSwitchUp?.status),
        visualCheckSafetyLimitSwitchUpFalse: getOppositeCheckmark(v.safetyDevices?.limitSwitchUp?.status),
        visualCheckSafetyLimitSwitchUpResult: v.safetyDevices?.limitSwitchUp?.result,
        visualCheckSafetyLimitSwitchDownTrue: getCheckmark(v.safetyDevices?.limitSwitchDown?.status),
        visualCheckSafetyLimitSwitchDownFalse: getOppositeCheckmark(v.safetyDevices?.limitSwitchDown?.status),
        visualCheckSafetyLimitSwitchDownResult: v.safetyDevices?.limitSwitchDown?.result,
        visualCheckSafetyGroundingTrue: getCheckmark(v.safetyDevices?.grounding?.status),
        visualCheckSafetyGroundingFalse: getOppositeCheckmark(v.safetyDevices?.grounding?.status),
        visualCheckSafetyGroundingResult: v.safetyDevices?.grounding?.result,
        visualCheckSafetyGuardTrue: getCheckmark(v.safetyDevices?.safetyGuard?.status),
        visualCheckSafetyGuardFalse: getOppositeCheckmark(v.safetyDevices?.safetyGuard?.status),
        visualCheckSafetyGuardResult: v.safetyDevices?.safetyGuard?.result,
        visualCheckSafetyStampLockTrue: getCheckmark(v.safetyDevices?.stampLock?.status),
        visualCheckSafetyStampLockFalse: getOppositeCheckmark(v.safetyDevices?.stampLock?.status),
        visualCheckSafetyStampLockResult: v.safetyDevices?.stampLock?.result,
        visualCheckSafetyPressureIndicatorTrue: getCheckmark(v.safetyDevices?.pressureIndicator?.status),
        visualCheckSafetyPressureIndicatorFalse: getOppositeCheckmark(v.safetyDevices?.pressureIndicator?.status),
        visualCheckSafetyPressureIndicatorResult: v.safetyDevices?.pressureIndicator?.result,
        visualCheckSafetyEmergencyStopTrue: getCheckmark(v.safetyDevices?.emergencyStop?.status),
        visualCheckSafetyEmergencyStopFalse: getOppositeCheckmark(v.safetyDevices?.emergencyStop?.status),
        visualCheckSafetyEmergencyStopResult: v.safetyDevices?.emergencyStop?.result,
        visualCheckSafetyHandSensorTrue: getCheckmark(v.safetyDevices?.handSensor?.status),
        visualCheckSafetyHandSensorFalse: getOppositeCheckmark(v.safetyDevices?.handSensor?.status),
        visualCheckSafetyHandSensorResult: v.safetyDevices?.handSensor?.result,

        visualCheckHydraulicPumpTrue: getCheckmark(v.hydraulic?.pump?.status),
        visualCheckHydraulicPumpFalse: getOppositeCheckmark(v.hydraulic?.pump?.status),
        visualCheckHydraulicPumpResult: v.hydraulic?.pump?.result,
        visualCheckHydraulicHoseTrue: getCheckmark(v.hydraulic?.hose?.status),
        visualCheckHydraulicHoseFalse: getOppositeCheckmark(v.hydraulic?.hose?.status),
        visualCheckHydraulicHoseResult: v.hydraulic?.hose?.result,

        testingSafetyGroundingMemenuhi: getCheckmark(test.safetyDeviceTest?.grounding?.status),
        testingSafetyGroundingTidakMemenuhi: getOppositeCheckmark(test.safetyDeviceTest?.grounding?.status),
        testingSafetyGroundingResult: test.safetyDeviceTest?.grounding?.result,
        testingSafetyGuardMemenuhi: getCheckmark(test.safetyDeviceTest?.safetyGuard?.status),
        testingSafetyGuardTidakMemenuhi: getOppositeCheckmark(test.safetyDeviceTest?.safetyGuard?.status),
        testingSafetyGuardResult: test.safetyDeviceTest?.safetyGuard?.result,
        testingSafetyRollerMemenuhi: getCheckmark(test.safetyDeviceTest?.roller?.status),
        testingSafetyRollerTidakMemenuhi: getOppositeCheckmark(test.safetyDeviceTest?.roller?.status),
        testingSafetyRollerResult: test.safetyDeviceTest?.roller?.result,
        testingSafetyEmergencyStopMemenuhi: getCheckmark(test.safetyDeviceTest?.emergencyStop?.status),
        testingSafetyEmergencyStopTidakMemenuhi: getOppositeCheckmark(test.safetyDeviceTest?.emergencyStop?.status),
        testingSafetyEmergencyStopResult: test.safetyDeviceTest?.emergencyStop?.result,

        testingSpeedMemenuhi: getCheckmark(test.speedTest?.status),
        testingSpeedTidakMemenuhi: getOppositeCheckmark(test.speedTest?.status),
        testingSpeedResult: test.speedTest?.result,
        testingFunctionMemenuhi: getCheckmark(test.functionTest?.status),
        testingFunctionTidakMemenuhi: getOppositeCheckmark(test.functionTest?.status),
        testingFunctionResult: test.functionTest?.result,
        testingWeldJointMemenuhi: getCheckmark(test.weldJointTest?.status),
        testingWeldJointTidakMemenuhi: getOppositeCheckmark(test.weldJointTest?.status),
        testingWeldJointResult: test.weldJointTest?.result,
        testingVibrationMemenuhi: getCheckmark(test.vibrationTest?.status),
        testingVibrationTidakMemenuhi: getOppositeCheckmark(test.vibrationTest?.status),
        testingVibrationResult: test.vibrationTest?.result,
        testingLightingMemenuhi: getCheckmark(test.lightingTest?.status),
        testingLightingTidakMemenuhi: getOppositeCheckmark(test.lightingTest?.status),
        testingLightingResult: test.lightingTest?.result,
        testingNoiseMemenuhi: getCheckmark(test.noiseTest?.status),
        testingNoiseTidakMemenuhi: getOppositeCheckmark(test.noiseTest?.status),
        testingNoiseResult: test.noiseTest?.result,
        
        panelControlKa: elec.ka,
        panelControlVoltageRs: elec.voltage?.rs,
        panelControlVoltageRt: elec.voltage?.rt,
        panelControlVoltageSt: elec.voltage?.st,
        panelControlVoltageRn: elec.voltage?.rn,
        panelControlVoltageRg: elec.voltage?.rg,
        panelControlVoltageNg: elec.voltage?.ng,
        panelControlPowerInfoFrequency: elec.powerInfo?.frequency,
        panelControlPowerInfoCosQ: elec.powerInfo?.cosQ,
        panelControlPowerInfoAmpereR: elec.powerInfo?.ampere?.r,
        panelControlPowerInfoAmpereS: elec.powerInfo?.ampere?.s,
        panelControlPowerInfoAmpereT: elec.powerInfo?.ampere?.t,
        panelControlPowerInfoResult: elec.powerInfo?.result,

        conclusion: conc.conclusion,
        recommendations: conc.recommendations,
        inspectionDate: admin.inspectionDate,

        actualWeight: found.actualWeight,
        additionalMeterials: found.additionalMeterials,
        totalWeight: found.totalWeight,
        minimumFoundationWeight: found.minimumFoundationWeight,
        totalMinimumFoundationWeight: found.totalMinimumFoundationWeight,
        foundationWeight: found.foundationWeight,
        heightFoundation: found.heightFoundation,
        foundationAnalysisResult: found.foundationAnalysisResult,

        noiseResultA: env.noise?.pointA?.result,
        noiseStatusA: env.noise?.pointA?.status,
        noiseResultB: env.noise?.pointB?.result,
        noiseStatusB: env.noise?.pointB?.status,
        noiseResultC: env.noise?.pointC?.result,
        noiseStatusC: env.noise?.pointC?.status,
        noiseResultD: env.noise?.pointD?.result,
        noiseStatusD: env.noise?.pointD?.status,

        lightResultA: env.lighting?.pointA?.result,
        lightStatusA: env.lighting?.pointA?.status,
        lightResultB: env.lighting?.pointB?.result,
        lightStatusB: env.lighting?.pointB?.status,
        lightResultC: env.lighting?.pointC?.result,
        lightStatusC: env.lighting?.pointC?.status,
        lightResultD: env.lighting?.pointD?.result,
        lightStatusD: env.lighting?.pointD?.status
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    
    const companyName = g.companyName?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'UnknownCompany';
    const fileName = `Laporan-PTP-Mesin-${companyName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createLaporanPtpMesin };