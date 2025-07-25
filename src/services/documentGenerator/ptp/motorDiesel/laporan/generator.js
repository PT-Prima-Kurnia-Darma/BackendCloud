'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../../config');

// Inisialisasi GCS
let privateKey = config.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n');
const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: { client_email: config.FIRESTORE_CLIENT_EMAIL, private_key: privateKey },
});
const BUCKET_NAME = 'tamplate-audit-riksauji';

// Helper untuk mengubah boolean menjadi tanda centang '√' atau string kosong
const getCheckmark = (status) => (status === true ? '√' : '');
const getOppositeCheckmark = (status) => (status === false ? '√' : '');
const getResultText = (item) => (item ? item.result : '');
const getRemarksText = (item) => (item ? item.remarks : '');

const createLaporanPtpDiesel = async (data) => {
    // Nama file template harus sesuai dengan yang diunggah
    const templatePath = 'ptp/laporanPtpDiesel.docx';

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template Laporan PTP Diesel:', error);
        throw new Error('Template dokumen Laporan PTP Diesel tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => ""
    });

    const g = data.generalData || {};
    const t = data.technicalData || {};
    const v = data.visualChecks || {};
    const tests = data.tests || {};
    const elec = data.electricalComponents || {};
    const mcb = data.mcbCalculation || {};
    const noise = data.noiseMeasurement || {};
    const light = data.lightingMeasurement || {};

    const renderData = {
        examinationType: data.examinationType,
        subInspectionType: data.subInspectionType,
        
        // General Data
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
        capacityWorkingLoad: g.capacityWorkingLoad,
        intendedUse: g.intendedUse,
        pjk3SkpNo: g.pjk3SkpNo,
        ak3SkpNo: g.ak3SkpNo,
        portableOrStationer: g.portableOrStationer,
        usagePermitNumber: g.usagePermitNumber,
        operatorName: g.operatorName,
        equipmentHistory: g.equipmentHistory,

        // Technical Data
        technicalDataDieselMotorBrandModel: t.dieselMotor?.brandModel,
        technicalDataDieselMotorManufacturer: t.dieselMotor?.manufacturer,
        technicalDataDieselMotorClassification: t.dieselMotor?.classification,
        technicalDataDieselMotorSerialNumber: t.dieselMotor?.serialNumber,
        technicalDataDieselMotorPowerRpm: t.dieselMotor?.powerRpm,
        technicalDataDieselMotorStartingPower: t.dieselMotor?.startingPower,
        technicalDataDieselMotorCylinderCount: t.dieselMotor?.cylinderCount,
        technicalDataGeneratorBrandType: t.generator?.brandType,
        technicalDataGeneratorManufacturer: t.generator?.manufacturer,
        technicalDataGeneratorSerialNumber: t.generator?.serialNumber,
        technicalDataGeneratorPower: t.generator?.power,
        technicalDataGeneratorFrequency: t.generator?.frequency,
        technicalDataGeneratorRpm: t.generator?.rpm,
        technicalDataGeneratorVoltage: t.generator?.voltage,
        technicalDataGeneratorPowerFactor: t.generator?.powerFactor,
        technicalDataGeneratorCurrent: t.generator?.current,

        // Visual Checks
        visualCheckFoundationTrue: getCheckmark(v.basicConstruction?.foundation?.status),
        visualCheckFoundationFalse: getOppositeCheckmark(v.basicConstruction?.foundation?.status),
        visualCheckFoundationResult: getResultText(v.basicConstruction?.foundation),
        visualCheckDieselHousingTrue: getCheckmark(v.basicConstruction?.dieselHousing?.status),
        visualCheckDieselHousingFalse: getOppositeCheckmark(v.basicConstruction?.dieselHousing?.status),
        visualCheckDieselHousingResult: getResultText(v.basicConstruction?.dieselHousing),
        visualCheckSupportTrue: getCheckmark(v.basicConstruction?.support?.status),
        visualCheckSupportFalse: getOppositeCheckmark(v.basicConstruction?.support?.status),
        visualCheckSupportResult: getResultText(v.basicConstruction?.support),
        visualCheckAnchorBoltTrue: getCheckmark(v.basicConstruction?.anchorBolt?.status),
        visualCheckAnchorBoltFalse: getOppositeCheckmark(v.basicConstruction?.anchorBolt?.status),
        visualCheckAnchorBoltResult: getResultText(v.basicConstruction?.anchorBolt),
        
        visualCheckStructureDailyTankTrue: getCheckmark(v.structuralConstruction?.dailyTank?.status),
        visualCheckStructureDailyTankFalse: getOppositeCheckmark(v.structuralConstruction?.dailyTank?.status),
        visualCheckStructureDailyTankResult: getResultText(v.structuralConstruction?.dailyTank),
        visualCheckStructureMufflerTrue: getCheckmark(v.structuralConstruction?.muffler?.status),
        visualCheckStructureMufflerFalse: getOppositeCheckmark(v.structuralConstruction?.muffler?.status),
        visualCheckStructureMufflerResult: getResultText(v.structuralConstruction?.muffler),
        visualCheckStructureAirVesselTrue: getCheckmark(v.structuralConstruction?.airVessel?.status),
        visualCheckStructureAirVesselFalse: getOppositeCheckmark(v.structuralConstruction?.airVessel?.status),
        visualCheckStructureAirVesselResult: getResultText(v.structuralConstruction?.airVessel),
        visualCheckStructurePanelTrue: getCheckmark(v.structuralConstruction?.panel?.status),
        visualCheckStructurePanelFalse: getOppositeCheckmark(v.structuralConstruction?.panel?.status),
        visualCheckStructurePanelResult: getResultText(v.structuralConstruction?.panel),

        // ... Lanjutkan untuk semua visualChecks
        
        // Tests
        ndtTestShaftRpmRemarks: getRemarksText(tests.ndt?.shaftRpm),
        ndtTestShaftRpmResult: getResultText(tests.ndt?.shaftRpm),
        ndtTestWeldJointRemarks: getRemarksText(tests.ndt?.weldJoint),
        ndtTestWeldJointResult: getResultText(tests.ndt?.weldJoint),
        ndtTestNoiseRemarks: getRemarksText(tests.ndt?.noise),
        ndtTestNoiseResult: getResultText(tests.ndt?.noise),
        ndtTestLightingRemarks: getRemarksText(tests.ndt?.lighting),
        ndtTestLightingResult: getResultText(tests.ndt?.lighting),
        ndtTestLoadTestRemarks: getRemarksText(tests.ndt?.loadTest),
        ndtTestLoadTestResult: getResultText(tests.ndt?.loadTest),

        safetyDeviceTestGovernorRemarks: getRemarksText(tests.safetyDevice?.governor),
        safetyDeviceTestGovernorResult: getResultText(tests.safetyDevice?.governor),
        safetyDeviceTestEmergencyStopRemarks: getRemarksText(tests.safetyDevice?.emergencyStop),
        safetyDeviceTestEmergencyStopResult: getResultText(tests.safetyDevice?.emergencyStop),
        safetyDeviceTestGroundingRemarks: getRemarksText(tests.safetyDevice?.grounding),
        safetyDeviceTestGroundingResult: getResultText(tests.safetyDevice?.grounding),
        safetyDeviceTestPanelRemarks: getRemarksText(tests.safetyDevice?.indicatorPanel),
        safetyDeviceTestPanelResult: getResultText(tests.safetyDevice?.indicatorPanel),
        safetyDeviceTestPressureGaugeRemarks: getRemarksText(tests.safetyDevice?.pressureGauge),
        safetyDeviceTestPressureGaugeResult: getResultText(tests.safetyDevice?.pressureGauge),
        safetyDeviceTestTempIndicatorRemarks: getRemarksText(tests.safetyDevice?.tempIndicator),
        safetyDeviceTestTempIndicatorResult: getResultText(tests.safetyDevice?.tempIndicator),
        safetyDeviceTestWaterIndicatorRemarks: getRemarksText(tests.safetyDevice?.waterIndicator),
        safetyDeviceTestWaterIndicatorResult: getResultText(tests.safetyDevice?.waterIndicator),
        safetyDeviceTestSafetyValvesRemarks: getRemarksText(tests.safetyDevice?.safetyValves),
        safetyDeviceTestSafetyValvesResult: getResultText(tests.safetyDevice?.safetyValves),
        safetyDeviceTestRadiatorRemarks: getRemarksText(tests.safetyDevice?.radiator),
        safetyDeviceTestRadiatorResult: getResultText(tests.safetyDevice?.radiator),

        // Electrical Components
        panelControlKa: elec.panelControl?.ka,
        panelControlVoltageRs: elec.panelControl?.voltage?.rs,
        panelControlVoltageRt: elec.panelControl?.voltage?.rt,
        panelControlVoltageSt: elec.panelControl?.voltage?.st,
        panelControlVoltageRn: elec.panelControl?.voltage?.rn,
        panelControlVoltageRg: elec.panelControl?.voltage?.rg,
        panelControlVoltageNg: elec.panelControl?.voltage?.ng,
        panelControlPowerInfoFrequency: elec.panelControl?.powerInfo?.frequency,
        panelControlPowerInfoCosQ: elec.panelControl?.powerInfo?.cosQ,
        panelControlPowerInfoAmpereR: elec.panelControl?.powerInfo?.ampere?.r,
        panelControlPowerInfoAmpereS: elec.panelControl?.powerInfo?.ampere?.s,
        panelControlPowerInfoAmpereT: elec.panelControl?.powerInfo?.ampere?.t,
        panelControlPowerInfoResult: elec.panelControl?.powerInfo?.result,

        // Conclusion & Recommendations
        conclusion: data.conclusion,
        recommendations: data.recommendations,
        inspectionDate: data.inspectionDate,

        // MCB Calculation
        mcbPhase: mcb.phase,
        mcbVoltage: mcb.voltage,
        mcbCosQ: mcb.cosQ,
        mcbGeneratorPower: mcb.generatorPowerKva,
        mcbGeneratorPowerKw: mcb.generatorPowerKw,
        resultCalculation: mcb.resultCalculation,
        'Requirement calculation': mcb.requirementCalculation, // Nama placeholder dengan spasi
        conclusionMcb: mcb.conclusion,

        // Noise Measurement
        noiseResultA: noise.pointA?.result,
        noiseStatusA: noise.pointA?.status,
        noiseResultB: noise.pointB?.result,
        noiseStatusB: noise.pointB?.status,
        noiseResultC: noise.pointC?.result,
        noiseStatusC: noise.pointC?.status,
        noiseResultD: noise.pointD?.result,
        noiseStatusD: noise.pointD?.status,

        // Lighting Measurement
        lightResultA: light.pointA?.result,
        lightStatusA: light.pointA?.status,
        lightResultB: light.pointB?.result,
        lightStatusB: light.pointB?.status,
        lightResultC: light.pointC?.result,
        lightStatusC: light.pointC?.status,
        lightResultD: light.pointD?.result,
        lightStatusD: light.pointD?.status
    };
    
    // Melengkapi semua placeholder untuk visual checks
    const visualCheckSections = Object.keys(v);
    visualCheckSections.forEach(sectionKey => {
        const section = v[sectionKey];
        if (section) {
            const componentKeys = Object.keys(section);
            componentKeys.forEach(compKey => {
                const component = section[compKey];
                const placeholderBase = `visualCheck${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}${compKey.charAt(0).toUpperCase() + compKey.slice(1)}`;
                renderData[`${placeholderBase}True`] = getCheckmark(component.status);
                renderData[`${placeholderBase}False`] = getOppositeCheckmark(component.status);
                renderData[`${placeholderBase}Result`] = getResultText(component);
            });
        }
    });


    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const companyName = g.companyName?.replace(/\s+/g, '-') || 'UnknownCompany';
    const fileName = `Laporan-Motor-Diesel-${companyName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createLaporanPtpDiesel };