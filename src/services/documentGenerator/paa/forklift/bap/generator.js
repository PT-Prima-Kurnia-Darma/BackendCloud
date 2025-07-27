'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { storage, BUCKET_NAME } = require('../../../../../utils/storage');


const formatBooleanToText = (status, trueText, falseText) => {
    if (status === true) return trueText;
    if (status === false) return falseText;
    return `${trueText} / ${falseText}`; // Default jika null atau undefined
};

const createBapForklift = async (data) => {
    const templatePath = 'paa/forklift/bapForklift.docx';
    
    let content;
    try {
        const [fileBuffer] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
        content = fileBuffer;
    } catch (error) {
        console.error(`Gagal mengunduh template BAP Forklift:`, error);
        throw new Error('Template dokumen BAP Forklift tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    const g = data.generalData || {};
    const t = data.technicalData || {};
    const res = data.inspectionResult || {};
    const vis = res.visualCheck || {};
    const fun = res.functionalTest || {};
    const sig = data.signature || {};

    const renderData = {
        examinationType: data.examinationType,
        subInspectionType: data.subInspectionType,
        inspectionDate: data.inspectionDate,
        
        // Data Umum
        ownerName: g.ownerName,
        ownerAddress: g.ownerAddress,
        userInCharge: g.userInCharge,

        // Data Teknis
        brandType: t.brandType,
        manufacturer: t.manufacturer,
        locationAndYearOfManufacture: t.locationAndYearOfManufacture,
        serialNumberUnitNumber: t.serialNumberUnitNumber,
        capacityWorkingLoad: t.capacityWorkingLoad,
        liftingHeightMeters: t.liftingHeightMeters,
        
        // --- Hasil Pemeriksaan (dengan format teks) ---
        hasForkDefects: formatBooleanToText(vis.hasForkDefects, 'Ditemukan', 'Tidak ditemukan'),
        isNameplateAttached: formatBooleanToText(vis.isNameplateAttached, 'Terpasang', 'tidak terpasang'),
        isAparAvailable: formatBooleanToText(vis.isAparAvailable, 'tersedia', 'tidak tersedia'),
        isCapacityMarkingDisplayed: formatBooleanToText(vis.isCapacityMarkingDisplayed, 'terpasang', 'tidak terpasang'),
        hasHydraulicLeak: formatBooleanToText(vis.hasHydraulicLeak, 'terdapat', 'tidak terdapat'),
        isChainGoodCondition: formatBooleanToText(vis.isChainGoodCondition, 'kondisi baik', 'tidak baik'),
        
        loadKg: fun.loadKg,
        liftHeightMeters: fun.liftHeightMeters,
        isAbleToLiftAndHold: formatBooleanToText(fun.isAbleToLiftAndHold, 'mampu', 'tidak mampu'),
        isFunctioningWell: formatBooleanToText(fun.isFunctioningWell, 'baik', 'tidak baik'),
        hasCrackIndication: formatBooleanToText(fun.hasCrackIndication, 'ditemukan', 'tidak ditemukan'),
        isEmergencyStopFunctional: formatBooleanToText(fun.isEmergencyStopFunctional, 'berfungsi', 'tidak berfungsi'),
        isWarningLampHornFunctional: formatBooleanToText(fun.isWarningLampHornFunctional, 'berfungsi', 'tidak berfungsi'),
        
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const ownerName = g.ownerName?.replace(/\s+/g, '-') || 'UnknownOwner';
    const fileName = `BAP-Forklift-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createBapForklift };