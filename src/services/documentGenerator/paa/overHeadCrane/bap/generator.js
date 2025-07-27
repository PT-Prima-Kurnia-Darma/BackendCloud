'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { storage, BUCKET_NAME } = require('../../../../../utils/storage');

const formatBooleanToText = (status, trueText, falseText) => {
    if (status === true) return trueText;
    if (status === false) return falseText;
    return `${trueText} / ${falseText}`;
};


const createBapOverheadCrane = async (data) => {
    const templatePath = 'paa/overHeadCrane/bapOverheadCrane.docx';
    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template BAP Overhead Crane:', error);
        throw new Error('Template dokumen BAP Overhead Crane tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => ""
    });

    const h = data.reportHeader || {};
    const g = data.generalData || {};
    const t = data.technicalData || {};
    const v = data.visualInspection || {};
    const test = data.testing || {};
    const load = test.loadTest || {};
    const ndt = test.ndtTest || {};

    const renderData = {
        examinationType: h.examinationType,
        subInspectionType: data.subInspectionType,
        inspectionDate: h.inspectionDate,
        inspectionType: h.inspectionType,
        ownerName: g.ownerName,
        ownerAddress: g.ownerAddress,
        userInCharge: g.userInCharge,
        unitLocation: g.unitLocation,
        brandType: t.brandType,
        manufacturer: t.manufacturer,
        locationAndYearOfManufacture: t.locationAndYearOfManufacture,
        serialNumberUnitNumber: t.serialNumberUnitNumber,
        capacityWorkingLoad: t.capacityWorkingLoad,
        liftingSpeedMpm: t.liftingSpeedMpm,

        hasConstructionDefects: formatBooleanToText(v.hasConstructionDefects, 'Terdapat Cacat', 'Tidak Terdapat Cacat'),
        hookHasSafetyLatch: formatBooleanToText(v.hookHasSafetyLatch, 'Terpasang', 'Tidak Terpasang'),
        isEmergencyStopInstalled: formatBooleanToText(v.isEmergencyStopInstalled, 'Terpasang', 'Tidak Terpasang'),
        isWireropeGoodCondition: formatBooleanToText(v.isWireropeGoodCondition, 'Baik', 'Tidak Baik'),
        operatorHasK3License: formatBooleanToText(v.operatorHasK3License, 'Memiliki', 'Tidak Memiliki'),
        
        functionTest: formatBooleanToText(test.functionTest, 'Berfungsi Baik', 'Tidak Berfungsi Baik'),
        
        loadTon: load.loadTon,
        isAbleToLift: formatBooleanToText(load.isAbleToLift, 'Mampu', 'Tidak Mampu'),
        hasLoadDrop: formatBooleanToText(load.hasLoadDrop, 'Terjadi Penurunan', 'Tidak Terjadi Penurunan'),
        
        isNdtResultGood: formatBooleanToText(ndt.isNdtResultGood, 'Baik', 'Tidak Baik'),
        hasCrackIndication: formatBooleanToText(ndt.hasCrackIndication, 'Ditemukan Indikasi', 'Tidak Ditemukan Indikasi'),
    };

    try {
        doc.render(renderData);
    } catch (error) {
        console.error("Error saat rendering dokumen BAP Overhead Crane:", error);
        throw new Error("Gagal mengisi data ke template BAP Overhead Crane.");
    }

    const docxBuffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    });

    const safeCompanyName = (g.ownerName || 'UnknownCompany').replace(/[^\w\s.-]/g, '_');
    const fileName = `BAP-OverheadCrane-${safeCompanyName}-${data.id || 'new'}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createBapOverheadCrane,
};