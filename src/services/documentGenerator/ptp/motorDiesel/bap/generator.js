'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../../config');

let privateKey = config.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n');
const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: { client_email: config.FIRESTORE_CLIENT_EMAIL, private_key: privateKey },
});
const BUCKET_NAME = 'tamplate-audit-riksauji';

const formatCondition = (status, choices) => {
    if (status === true) return choices[0];
    if (status === false) return choices[1];
    return `${choices[0]} / ${choices[1]}`;
};

const createBapPtpDiesel = async (data) => {
    const templatePath = 'ptp/motorDiesel/bapPtp.docx';

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template BAP PTP Motor Diesel:', error);
        throw new Error('Template dokumen BAP PTP Motor Diesel tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    const g = data.generalData || {};
    const t = data.technicalData || {};
    const v = data.visualChecks || {};
    const f = data.functionalTests || {};

    const renderData = {
        // HEADER & DATA UMUM
        examinationType: data.examinationType,
        subInspectionType: data.subInspectionType,
        inspectionDate: data.inspectionDate,
        companyName: g.companyName,
        companyLocation: g.companyLocation,
        unitLocation: g.unitLocation,
        userAddressInCharge: g.userAddressInCharge,

        // DATA TEKNIS
        brandType: t.brandType,
        manufacturer: t.manufacturer,
        locationAndYearOfManufacture: t.locationAndYearOfManufacture,
        serialNumberUnitNumber: t.serialNumberUnitNumber,
        capacityWorkingLoad: t.capacityWorkingLoad,
        technicalDataDieselMotorPowerRpm: t.technicalDataDieselMotorPowerRpm,
        specialSpecification: t.specialSpecification,
        dimensionsDescription: t.dimensionsDescription,
        rotationRpm: t.rotationRpm,
        technicalDataGeneratorFrequency: t.technicalDataGeneratorFrequency,
        technicalDataGeneratorCurrent: t.technicalDataGeneratorCurrent,
        machineWeightKg: t.machineWeightKg,
        areSafetyFeaturesInstalled: formatCondition(t.areSafetyFeaturesInstalled, ['terpasang lengkap', 'tidak terpasang']),

        // PEMERIKSAAN VISUAL
        isMachineGoodCondition: formatCondition(v.isMachineGoodCondition, ['baik', 'tidak']),
        areElectricalIndicatorsGood: formatCondition(v.areElectricalIndicatorsGood, ['baik', 'tidak']),
        isAparAvailable: formatCondition(v.isAparAvailable, ['tersedia', 'tidak tersedia']),
        isPpeAvailable: formatCondition(v.isPpeAvailable, ['baik', 'tidak']),
        isGroundingInstalled: formatCondition(v.isGroundingInstalled, ['terpasang', 'tidak terpasang']),
        isBatteryGoodCondition: formatCondition(v.isBatteryGoodCondition, ['baik', 'tidak baik']),
        hasLubricationLeak: formatCondition(v.hasLubricationLeak, ['Terjadi', 'tidak terjadi']),
        isFoundationGoodCondition: formatCondition(v.isFoundationGoodCondition, ['baik', 'tidak baik']),
        hasHydraulicLeak: formatCondition(v.hasHydraulicLeak, ['terjadi', 'tidak terjadi']),

        // PENGUJIAN
        isLightingCompliant: formatCondition(f.isLightingCompliant, ['memenuhi', 'tidak memenuhi']),
        isNoiseLevelCompliant: formatCondition(f.isNoiseLevelCompliant, ['memenuhi', 'tidak memenuhi']),
        isEmergencyStopFunctional: formatCondition(f.isEmergencyStopFunctional, ['baik', 'tidak']),
        isMachineFunctional: formatCondition(f.isMachineFunctional, ['baik', 'tidak']),
        isVibrationLevelCompliant: formatCondition(f.isVibrationLevelCompliant, ['memenuhi', 'tidak memenuhi']),
        isInsulationResistanceOk: formatCondition(f.isInsulationResistanceOk, ['baik', 'tidak baik']),
        isShaftRotationCompliant: formatCondition(f.isShaftRotationCompliant, ['sesuai', 'tidak sesuai']),
        isGroundingResistanceCompliant: formatCondition(f.isGroundingResistanceCompliant, ['memenuhi', 'tidak memenuhi']),
        isNdtWeldTestOk: formatCondition(f.isNdtWeldTestOk, ['baik', 'tidak baik']),
        isVoltageBetweenPhasesNormal: formatCondition(f.isVoltageBetweenPhasesNormal, ['normal', 'tidak normal']),
        isPhaseLoadBalanced: formatCondition(f.isPhaseLoadBalanced, ['Seimbang', 'Tidak Seimbang']),
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const companyNameSafe = g.companyName?.replace(/\s+/g, '-') || 'UnknownCompany';
    const fileName = `BAP-PTP-MotorDiesel-${companyNameSafe}-${data.id || 'new'}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createBapPtpDiesel };