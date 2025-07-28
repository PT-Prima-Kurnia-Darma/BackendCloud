'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { storage, BUCKET_NAME } = require('../../../../../utils/storage');

const getCheckmark = (value) => (value ? '✓' : '');

const createLaporanPetir = async (data) => {
    const templatePath = 'petirListrik/instalasiPetir/laporanPetir.docx';

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template Laporan Petir:', error);
        throw new Error('Template dokumen Laporan Petir tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, nullGetter: () => "" });

    const pjk3 = data.pjk3Data || {};
    const owner = data.ownerData || {};
    const tech = data.technicalData || {};
    const physical = data.physicalInspection || {};
    const visual = data.visualInspection || {};
    const compliance = data.standardCompliance || {};

    const renderData = {
        examinationType: data.examinationType,
        companyNameandaddres: pjk3.companyNameandaddres,
        companyPermitNo: pjk3.companyPermitNo,
        expertPermitNo: pjk3.expertPermitNo,
        expertName: pjk3.expertName,
        riksaujiTools: pjk3.riksaujiTools,
        companyName: owner.companyName,
        companyLocation: owner.companyLocation,
        usageLocation: owner.usageLocation,
        objectType: owner.objectType,
        typeInspection: owner.typeInspection,
        certificateNo: owner.certificateNo,
        inspectionDate: owner.inspectionDate,
        conductorType: tech.conductorType,
        buildingHeight: tech.buildingHeight,
        buildingArea: tech.buildingArea,
        receiverHeight: tech.receiverHeight,
        receiverCount: tech.receiverCount,
        testJointCount: tech.testJointCount,
        conductorDescription: tech.conductorDescription,
        groundingResistance: tech.groundingResistance,
        spreadingResistance: tech.spreadingResistance,
        installer: tech.installer,

        // Physical Inspection
        installationSystemgood: getCheckmark(physical.installationSystem?.good),
        installationSystemfair: getCheckmark(physical.installationSystem?.fair),
        installationSystempoor: getCheckmark(physical.installationSystem?.poor),
        installerResult: physical.notes,
        receiverHeadgood: getCheckmark(physical.receiverHead?.good),
        receiverHeadfair: getCheckmark(physical.receiverHead?.fair),
        receiverHeadpoor: getCheckmark(physical.receiverHead?.poor),
        receiverPolegood: getCheckmark(physical.receiverPole?.good),
        receiverPolefair: getCheckmark(physical.receiverPole?.fair),
        receiverPolepoor: getCheckmark(physical.receiverPole?.poor),
        poleReinforcementgood: getCheckmark(physical.poleReinforcement?.good),
        poleReinforcementfair: getCheckmark(physical.poleReinforcement?.fair),
        poleReinforcementpoor: getCheckmark(physical.poleReinforcement?.poor),
        downConductorgood: getCheckmark(physical.downConductor?.good),
        downConductorfair: getCheckmark(physical.downConductor?.fair),
        downConductorpoor: getCheckmark(physical.downConductor?.poor),
        conductorClampsgood: getCheckmark(physical.conductorClamps?.good),
        conductorClampsfair: getCheckmark(physical.conductorClamps?.fair),
        conductorClampspoor: getCheckmark(physical.conductorClamps?.poor),
        jointConnectionsgood: getCheckmark(physical.jointConnections?.good),
        jointConnectionsfair: getCheckmark(physical.jointConnections?.fair),
        jointConnectionspoor: getCheckmark(physical.jointConnections?.poor),
        groundingTerminalBoxgood: getCheckmark(physical.groundingTerminalBox?.good),
        groundingTerminalBoxfair: getCheckmark(physical.groundingTerminalBox?.fair),
        groundingTerminalBoxpoor: getCheckmark(physical.groundingTerminalBox?.poor),
        controlBoxgood: getCheckmark(physical.controlBox?.good),
        controlBoxfair: getCheckmark(physical.controlBox?.fair),
        controlBoxpoor: getCheckmark(physical.controlBox?.poor),
        groundingSystemgood: getCheckmark(physical.groundingSystem?.good),
        groundingSystemfair: getCheckmark(physical.groundingSystem?.fair),
        groundingSystempoor: getCheckmark(physical.groundingSystem?.poor),
        conductorToGroundConnectiongood: getCheckmark(physical.conductorToGroundConnection?.good),
        conductorToGroundConnectionfair: getCheckmark(physical.conductorToGroundConnection?.fair),
        conductorToGroundConnectionpoor: getCheckmark(physical.conductorToGroundConnection?.poor),

        // Visual Inspection
        airTerminal: visual.airTerminal,
        downConductorCheck: visual.downConductorCheck,
        groundingAndTestJoint: visual.groundingAndTestJoint,

        // Standard Compliance
        asBuiltDrawingCompliancegood: getCheckmark(compliance.asBuiltDrawing?.good),
        asBuiltDrawingCompliancepoor: getCheckmark(compliance.asBuiltDrawing?.poor),
        asBuiltDrawingCompliancenotes: compliance.asBuiltDrawing?.notes,
        terminalToConductorConnectiongood: getCheckmark(compliance.terminalToConductorConnection?.good),
        terminalToConductorConnectionpoor: getCheckmark(compliance.terminalToConductorConnection?.poor),
        terminalToConductorConnectionnotes: compliance.terminalToConductorConnection?.notes,
        downConductorJointsgood: getCheckmark(compliance.downConductorJoints?.good),
        downConductorJointspoor: getCheckmark(compliance.downConductorJoints?.poor),
        downConductorJointsnotes: compliance.downConductorJoints?.notes,
        testJointBoxInstallationgood: getCheckmark(compliance.testJointBoxInstallation?.good),
        testJointBoxInstallationpoor: getCheckmark(compliance.testJointBoxInstallation?.poor),
        testJointBoxInstallationnotes: compliance.testJointBoxInstallation?.notes,
        conductorMaterialStandardgood: getCheckmark(compliance.conductorMaterialStandard?.good),
        conductorMaterialStandardpoor: getCheckmark(compliance.conductorMaterialStandard?.poor),
        conductorMaterialStandardnotes: compliance.conductorMaterialStandard?.notes,
        lightningCounterInstalledgood: getCheckmark(compliance.lightningCounter?.good),
        lightningCounterInstalledpoor: getCheckmark(compliance.lightningCounter?.poor),
        lightningCounterInstallednotes: compliance.lightningCounter?.notes,
        radioactiveTerminalgood: getCheckmark(compliance.radioactiveTerminal?.good),
        radioactiveTerminalpoor: getCheckmark(compliance.radioactiveTerminal?.poor),
        radioactiveTerminalnotes: compliance.radioactiveTerminal?.notes,
        groundingRodMaterialgood: getCheckmark(compliance.groundingRodMaterial?.good),
        groundingRodMaterialpoor: getCheckmark(compliance.groundingRodMaterial?.poor),
        groundingRodMaterialnotes: compliance.groundingRodMaterial?.notes,
        arresterInstallationgood: getCheckmark(compliance.arresterInstallation?.good),
        arresterInstallationpoor: getCheckmark(compliance.arresterInstallation?.poor),
        arresterInstallationnotes: compliance.arresterInstallation?.notes,

        // Dynamic Tables
        dynamicTestItems: data.dynamicTestItems || [],
        dynamicItems: (data.dynamicItems || []).map(item => ({
            ...item,
            outcomeBaik: getCheckmark(item.outcomeBaik),
            outcomeBuruk: getCheckmark(item.outcomeBuruk),
        })),

        // Conclusion
        conclusion: data.conclusion,
        recomendations: data.recomendations,
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
    const companyName = owner.companyName?.replace(/\s+/g, '-') || 'Tidak Ada Nama Perusahaan';
    const fileName = `Laporan Instalasi Penyalur Petir-${companyName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanPetir,
};