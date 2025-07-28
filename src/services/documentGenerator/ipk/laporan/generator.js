'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { storage, BUCKET_NAME } = require('../../../../utils/storage');

const getCheckmark = (value) => (value ? '✓' : '');

const createLaporanProteksiKebakaran = async (data) => {
    const templatePath = 'proteksiKebakaran/laporanProteksiKebakaran.docx';

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template Laporan Proteksi Kebakaran:', error);
        throw new Error('Template dokumen Laporan Proteksi Kebakaran tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => ""
    });

    const d = data.documentChecklist || {};
    const g = data.generalData || {};
    const b = data.buildingData || {};
    const t = data.technicalSpecifications || {};
    const h = data.hydrantSystem || {};

    const renderData = {
        examinationType: data.examinationType,
        documentChecklisttechnicalDrawingTrue: getCheckmark(d.technicalDrawing?.available),
        documentChecklisttechnicalDrawingFalse: getCheckmark(!d.technicalDrawing?.available),
        documentChecklisttechnicalDrawingnotes: d.technicalDrawing?.notes,
        documentChecklistpreviousTestDocumentationsTrue: getCheckmark(d.previousTestDocumentation?.available),
        documentChecklistpreviousTestDocumentationFalse: getCheckmark(!d.previousTestDocumentation?.available),
        documentChecklistpreviousTestDocumentationnotes: d.previousTestDocumentation?.notes,
        documentChecklistrequestLetterTrue: getCheckmark(d.requestLetter?.available),
        documentChecklistrequestLetterFalse: getCheckmark(!d.requestLetter?.available),
        documentChecklistrequestLetternotes: d.requestLetter?.notes,
        documentChecklistspecificationDocumentTrue: getCheckmark(d.specificationDocument?.available),
        documentChecklistspecificationDocumentFalse: getCheckmark(!d.specificationDocument?.available),
        documentChecklistspecificationDocumentnotes: d.specificationDocument?.notes,
        companyName: g.companyName,
        companyLocation: g.companyLocation,
        usageLocation: g.usageLocation,
        certificateNumber: g.certificateNumber,
        k3Object: g.k3Object,
        inspectionDate: g.inspectionDate,
        landArea: b.landArea,
        buildingArea: b.buildingArea,
        buildingHeight: b.buildingHeight,
        floorCount: b.floorCount,
        mainStructure: b.construction?.mainStructure,
        floorStructure: b.construction?.floorStructure,
        exteriorWalls: b.construction?.exteriorWalls,
        interiorWalls: b.construction?.interiorWalls,
        ceilingFrame: b.construction?.ceilingFrame,
        ceilingCover: b.construction?.ceilingCover,
        roofFrame: b.construction?.roofFrame,
        roofCover: b.construction?.roofCover,
        yearBuilt: b.yearBuilt,
        portableExtinguishers: b.fireProtectionEquipment?.portableExtinguishers,
        indoorHydrantBox: b.fireProtectionEquipment?.indoorHydrantBox,
        pillarAndOutdoorHydrant: b.fireProtectionEquipment?.pillarAndOutdoorHydrant,
        siameseConnection: b.fireProtectionEquipment?.siameseConnection,
        sprinklerSystem: b.fireProtectionEquipment?.sprinklerSystem,
        heatAndSmokeDetectors: b.fireProtectionEquipment?.heatAndSmokeDetectors,
        exitSigns: b.fireProtectionEquipment?.exitSigns,
        emergencyStairs: b.fireProtectionEquipment?.emergencyStairs,
        assemblyPoint: b.fireProtectionEquipment?.assemblyPoint,
        mcfabrandOrType: t.mcfa?.brandOrType,
        controlMcfaResult: t.mcfa?.result,
        mcfaLed: t.mcfa?.ledAnnunciator,
        mcfaType: t.mcfa?.type,
        mcfaserialNumber: t.mcfa?.serialNumber,
        heatbrandOrType: t.heatDetector?.brandOrType,
        heatDetectorResult: t.heatDetector?.result,
        heatpointCount: t.heatDetector?.pointCount,
        heatspacing: t.heatDetector?.spacing,
        heatoperatingTemperature: t.heatDetector?.operatingTemperature,
        smokebrandOrType: t.smokeDetector?.brandOrType,
        smokeDetectorResult: t.smokeDetector?.result,
        smokepointCount: t.smokeDetector?.pointCount,
        smokespacing: t.smokeDetector?.spacing,
        smokeoperatingTemperature: t.smokeDetector?.operatingTemperature,
        aparbrandOrType: t.apar?.brandOrType,
        aparResult: t.apar?.result,
        aparcount: t.apar?.count,
        aparspacing: t.apar?.spacing,
        aparplacement: t.apar?.placement,
        resultAlarmInstallation: data.resultAlarmInstallation,
        totalAlarmInstallation: data.totalAlarmInstallation,
        instalationAlarmItems: data.alarmInstallationData.map(item => ({
            locationAlarm: item.location,
            zoneAlarm: item.zone,
            rorAlarm: item.ror,
            fixedAlarm: item.fixed,
            smokeAlarm: item.smoke,
            tpmAlarm: item.tpm,
            flswAlarm: item.flsw,
            bellAlarm: item.bell,
            lampAlarm: item.lamp,
            statusAlarm: item.status,
        })),
        panelFunction: data.alarmTestResults?.panelFunction,
        alarmTest: data.alarmTestResults?.alarmTest,
        faultTest: data.alarmTestResults?.faultTest,
        interconnectionTest: data.alarmTestResults?.interconnectionTest,
        waterSourceSpecification: h.waterSource?.specification,
        waterSourceStatus: h.waterSource?.status,
        waterSourceNote: h.waterSource?.note,
        groundReservoarBackupSpec: h.groundReservoir?.backupSpec,
        groundReservoarBackupStatus: h.groundReservoir?.backupStatus,
        groundReservoarBackupResult: h.groundReservoir?.backupResult,
        gravitationPumpSpec: h.gravitationTank?.spec,
        gravitationPumpStats: h.gravitationTank?.status,
        gravitationPumpResult: h.gravitationTank?.result,
        SiameseConectSpec: h.siameseConnection?.spec,
        SiameseConectStats: h.siameseConnection?.status,
        SiameseConectResult: h.siameseConnection?.result,
        jockeyQuantity: h.pumps?.jockey?.quantity,
        jockeyHeadM: h.pumps?.jockey?.headM,
        jockeyAutoStart: h.pumps?.jockey?.autoStart,
        jockeyAutoStop: h.pumps?.jockey?.autoStop,
        electricPumpQuantity: h.pumps?.electric?.quantity,
        electricPumpHeadM: h.pumps?.electric?.headM,
        electricPumpAutoStart: h.pumps?.electric?.autoStart,
        electricPumpStop: h.pumps?.electric?.stop,
        backupPumpQuantity: h.pumps?.diesel?.quantity,
        backupPumpHeadM: h.pumps?.diesel?.headM,
        backupPumpAuto: h.pumps?.diesel?.autoStart,
        backupPumpStop: h.pumps?.diesel?.stop,
        hydrantPoints: h.indoorHydrant?.points,
        hydrantDiameter: h.indoorHydrant?.diameter,
        hydrantDiameterHose: h.indoorHydrant?.hoseLength,
        hydrantPlacement: h.indoorHydrant?.placement,
        landingValvePoints: h.landingValve?.points,
        landingValveDia: h.landingValve?.diameter,
        landingValveClutch: h.landingValve?.clutchType,
        landingValvePlacement: h.landingValve?.placement,
        hydrantPoints: h.outdoorHydrant?.points,
        hydrantDiameter: h.outdoorHydrant?.diameter,
        hydrantLength: h.outdoorHydrant?.hoseLength,
        hydrantNoozleDia: h.outdoorHydrant?.nozzleDiameter,
        hydrantPlacement: h.outdoorHydrant?.placement,
        fireServicePoints: h.fireServiceConnection?.points,
        fireServiceInletDia: h.fireServiceConnection?.inletDiameter,
        fireServiceOutDia: h.fireServiceConnection?.outletDiameter,
        fireServiceClutchType: h.fireServiceConnection?.clutchType,
        fireServiceCondition: h.fireServiceConnection?.condition,
        fireServicePlacement: h.fireServiceConnection?.placement,
        pressureReliefValveSpec: h.pipingAndValves?.pressureReliefValve?.spec,
        pressureReliefValveStat: h.pipingAndValves?.pressureReliefValve?.status,
        pressureReliefValveremarks: h.pipingAndValves?.pressureReliefValve?.remarks,
        testValveSpec: h.pipingAndValves?.testValve?.spec,
        testValveStat: h.pipingAndValves?.testValve?.status,
        testValveremarks: h.pipingAndValves?.testValve?.remarks,
        suctionPipeSpec: h.pipingAndValves?.suctionPipe?.spec,
        suctionPipeStat: h.pipingAndValves?.suctionPipe?.status,
        suctionPiperemarks: h.pipingAndValves?.suctionPipe?.remarks,
        mainPipeSpec: h.pipingAndValves?.mainPipe?.spec,
        mainPipeStat: h.pipingAndValves?.mainPipe?.status,
        mainPiperemarks: h.pipingAndValves?.mainPipe?.remarks,
        standPipeSpec: h.pipingAndValves?.standPipe?.spec,
        standPipeStat: h.pipingAndValves?.standPipe?.status,
        standPiperemarks: h.pipingAndValves?.standPipe?.remarks,
        hydrantPillarSpec: h.pipingAndValves?.hydrantPillar?.spec,
        hydrantPillarStat: h.pipingAndValves?.hydrantPillar?.status,
        hydrantPillarremarks: h.pipingAndValves?.hydrantPillar?.remarks,
        hydrantInnerSpec: h.pipingAndValves?.innerHydrant?.spec,
        hydrantInnerStat: h.pipingAndValves?.innerHydrant?.status,
        hydrantInneremarks: h.pipingAndValves?.innerHydrant?.remarks,
        hoseRellSpec: h.pipingAndValves?.hoseReel?.spec,
        hoseRellStat: h.pipingAndValves?.hoseReel?.status,
        hoseRellremarks: h.pipingAndValves?.hoseReel?.remarks,
        pumpFunctionTestItems: data.pumpFunctionTest.map(item => ({
            pumpType: item.pumpType,
            pumpStart: item.start,
            pumpStop: item.stop,
        })),
        operationalHydrantItems: data.hydrantOperationalTest.map(item => ({
            operationalHydrantTest: item.test,
            operationalHydrantPressure: item.pressure,
            operationalHydrantTransmit: item.transmitPower,
            operationalHydrantNozzel: item.nozzlePosition,
            operationalHydrantStatus: item.status,
            operationalHydrantDesc: item.description,
        })),
        recommendations: data.recommendations,
        conclusion: data.conclusion,
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const companyName = g.companyName?.replace(/\s+/g, '-') || 'Tidak Ada Nama Perusahaan';
    const fileName = `Laporan Instalasi Proteksi Kebakaran-${companyName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createLaporanProteksiKebakaran };