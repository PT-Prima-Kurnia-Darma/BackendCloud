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
const BUCKET_NAME = 'audit-riksauji';

const getCheckmark = (value) => (value ? '✓' : '');
const getResultText = (value, trueText = 'Ada', falseText = 'Tidak Ada') => {
    if (value === true) return trueText;
    if (value === false) return falseText;
    return '';
};

const createLaporanListrik = async (data) => {
    const templatePath = 'petirListrik/InstalasiListrik/laporanListrik.docx'; // pastikan path ini benar

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template Laporan Listrik:', error);
        throw new Error('Template dokumen Laporan Listrik tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => ""
    });

    const renderData = {
        examinationType: data.examinationType,
        companyName: data.generalData.companyName,
        companyAddress: data.generalData.companyAddress,
        initialDocSldAda: getCheckmark(data.initialDocumentCheck.sld.isAvailable),
        initialDocSldTidakAda: getCheckmark(!data.initialDocumentCheck.sld.isAvailable),
        initialDocSldResult: data.initialDocumentCheck.sld.result,
        initialDocLayoutAda: getCheckmark(data.initialDocumentCheck.layout.isAvailable),
        initialDocLayoutTidakAda: getCheckmark(!data.initialDocumentCheck.layout.isAvailable),
        initialDocLayoutResult: data.initialDocumentCheck.layout.result,
        initialDocPermitAda: getCheckmark(data.initialDocumentCheck.permit.isAvailable),
        initialDocPermitTidakAda: getCheckmark(!data.initialDocumentCheck.permit.isAvailable),
        initialDocPermitResult: data.initialDocumentCheck.permit.result,
        initialDocLicenseAda: getCheckmark(data.initialDocumentCheck.technicianLicense.isAvailable),
        initialDocLicenseTidakAda: getCheckmark(!data.initialDocumentCheck.technicianLicense.isAvailable),
        initialDocLicenseResult: data.initialDocumentCheck.technicianLicense.result,
        installationType: data.generalData.installationType,
        businessField: data.generalData.businessField,
        safetyServiceProvider: data.generalData.safetyServiceProvider,
        ohsExpert: data.generalData.ohsExpert,
        permitNumber: data.generalData.permitNumber,
        inspectionDate: data.generalData.inspectionDate,
        inspectionLocation: data.generalData.inspectionLocation,
        technicalDataPlnPower: data.technicalData.plnPower,
        technicalDataGeneratorPower: data.technicalData.generatorPower,
        technicalDataTotalInstalledLoad: data.technicalData.totalInstalledLoad,
        technicalDataLightingPower: data.technicalData.lightingPower,
        technicalDataPowerLoad: data.technicalData.powerLoad,
        doc1PlanningPermitResult: getResultText(data.documentExamination1.hasPlanningPermit),
        doc1LocationMapResult: getResultText(data.documentExamination1.hasLocationMap),
        doc1SldResult: getResultText(data.documentExamination1.hasSld),
        doc1LayoutResult: getResultText(data.documentExamination1.hasLayout),
        doc1WiringDiagramResult: getResultText(data.documentExamination1.hasWiringDiagram),
        doc1AreaClassificationResult: getResultText(data.documentExamination1.hasAreaClassification),
        doc1PanelComponentListResult: getResultText(data.documentExamination1.hasPanelComponentList),
        doc1ShortCircuitCalcResult: getResultText(data.documentExamination1.hasShortCircuitCalc),
        doc1ManualBookResult: getResultText(data.documentExamination1.hasManualBook),
        doc1MaintenanceBookResult: getResultText(data.documentExamination1.hasMaintenanceBook),
        doc1WarningSignsResult: getResultText(data.documentExamination1.hasWarningSigns, 'Terpasang', 'Tidak terpasang'),
        doc1ManufacturerCertResult: getResultText(data.documentExamination1.hasManufacturerCert),
        doc1TechSpecResult: getResultText(data.documentExamination1.hasTechSpec),
        doc1TechSpecCertifResult: getResultText(data.documentExamination1.hasTechSpecCert),
        doc1PowerRecapResult: getResultText(data.documentExamination1.hasPowerRecap),
        doc1DailyRecordResult: getResultText(data.documentExamination1.hasDailyRecord),
        doc1PanelPointCountResult: getResultText(data.documentExamination1.hasPanelPointCount),
        doc1PanelCoverResult: getResultText(data.documentExamination1.isPanelCoverGood, 'Baik', 'Tidak Baik'),
        doc1OtherDataResult: getResultText(data.documentExamination1.hasOtherData),
        doc2UnitConstructionResult: getResultText(data.documentExamination2.isUnitConstructionGood, 'Baik', 'Tidak Baik'),
        doc2PlacementResult: getResultText(data.documentExamination2.isPlacementGood, 'Baik', 'Tidak Baik'),
        doc2NameplateResult: getResultText(data.documentExamination2.isNameplateVerified, 'Baik', 'Tidak Baik'),
        doc2AreaClassificationResult: getResultText(data.documentExamination2.isAreaClassificationOk, 'Sesuai', 'Tidak Sesuai'),
        doc2ProtectionResult: getResultText(data.documentExamination2.isProtectionGood, 'Baik', 'Tidak Baik'),
        doc2RadiationShieldingResult: getResultText(data.documentExamination2.isRadiationShieldingGood, 'Baik', 'Tidak Baik'),
        doc2PanelDoorHolderResult: getResultText(data.documentExamination2.hasPanelDoorHolder, 'Baik', 'Tidak Baik'),
        doc2BoltsAndScrewsResult: getResultText(data.documentExamination2.areBoltsAndScrewsSecure, 'Sesuai', 'Tidak Sesuai'),
        doc2BusbarIsolationResult: getResultText(data.documentExamination2.isBusbarIsolated, 'Baik', 'Tidak Baik'),
        doc2BusbarClearanceResult: getResultText(data.documentExamination2.isBusbarClearanceGood, 'Baik', 'Tidak Baik'),
        doc2CableInstallationResult: getResultText(data.documentExamination2.isCableInstallationOk, 'Sesuai', 'Tidak Sesuai'),
        doc2DoorCableProtectionResult: getResultText(data.documentExamination2.isDoorCableProtected, 'Baik', 'Tidak Baik'),
        doc2FuseSafetyResult: getResultText(data.documentExamination2.isFuseChangeSafe, 'Baik', 'Tidak Baik'),
        doc2CableTerminalProtectionResult: getResultText(data.documentExamination2.hasCableTerminalProtection, 'Baik', 'Tidak Baik'),
        doc2InstrumentMarkingResult: getResultText(data.documentExamination2.areInstrumentsMarked, 'Baik', 'Tidak Baik'),
        doc2EquipmentCodingResult: getResultText(data.documentExamination2.areEquipmentsCoded, 'Baik', 'Tidak Baik'),
        doc2CableInOutResult: getResultText(data.documentExamination2.isCableInOutGood, 'Baik', 'Tidak Baik'),
        doc2BusbarSizeResult: getResultText(data.documentExamination2.isBusbarSizeGood, 'Baik', 'Tidak Baik'),
        doc2BusbarCleanlinessResult: getResultText(data.documentExamination2.isBusbarClean, 'Bersih', 'Tidak Bersih'),
        doc2BusbarMarkingResult: getResultText(data.documentExamination2.isBusbarMarkingOk, 'Sesuai', 'Tidak Sesuai'),
        doc2GroundingCableResult: getResultText(data.documentExamination2.isGroundingCableGood, 'Baik', 'Tidak Baik'),
        doc2PanelDoorResult: getResultText(data.documentExamination2.isPanelDoorGood, 'Baik', 'Tidak Baik'),
        doc2SparepartSpecResult: getResultText(data.documentExamination2.areSparepartsOk, 'Sesuai', 'Tidak Sesuai'),
        doc2SafetyFacilitiesResult: getResultText(data.documentExamination2.areSafetyFacilitiesGood, 'Baik', 'Tidak Baik'),
        doc2BreakerCurrentRatingResult: getResultText(data.documentExamination2.breakerData.isCurrentRatingOk, 'Sesuai', 'Tidak Sesuai'),
        doc2BreakerVoltageRatingResult: getResultText(data.documentExamination2.breakerData.isVoltageRatingOk, 'Sesuai', 'Tidak Sesuai'),
        doc2BreakerBreakingCurrentResult: getResultText(data.documentExamination2.breakerData.isBreakingCurrentOk, 'Sesuai', 'Tidak Sesuai'),
        doc2BreakerControlVoltageResult: getResultText(data.documentExamination2.breakerData.isControlVoltageOk, 'Sesuai', 'Tidak Sesuai'),
        doc2BreakerManufacturerResult: getResultText(data.documentExamination2.breakerData.isManufacturerOk, 'Sesuai', 'Tidak Sesuai'),
        doc2BreakerTypeResult: getResultText(data.documentExamination2.breakerData.isTypeOk, 'Sesuai', 'Tidak Sesuai'),
        doc2BreakerSerialResult: getResultText(data.documentExamination2.breakerData.isSerialOk, 'Sesuai', 'Tidak Sesuai'),
        testingInsulationResult: getResultText(data.testing.isInsulationOk, 'Baik', 'Tidak Baik'),
        testingGroundingResult: getResultText(data.testing.isGroundingOk, 'Baik', 'Tidak Baik'),
        testingBreakerCtResult: getResultText(data.testing.breakerEquipment.isCtOk, 'Baik', 'Tidak Baik'),
        testingBreakerPtResult: getResultText(data.testing.breakerEquipment.isPtOk, 'Baik', 'Tidak Baik'),
        testingBreakerInstrumentsResult: getResultText(data.testing.breakerEquipment.isInstrumentsOk, 'Baik', 'Tidak Baik'),
        testingBreakerFuseResult: getResultText(data.testing.breakerEquipment.isFuseRatingOk, 'Baik', 'Tidak Baik'),
        testingBreakerMechanicalResult: getResultText(data.testing.breakerEquipment.isMechanicalOk, 'Baik', 'Tidak Baik'),
        testingBreakerTerminalResult: getResultText(data.testing.breakerEquipment.isTerminalOk, 'Baik', 'Tidak Baik'),
        testingBreakerTerminalMarkingResult: getResultText(data.testing.breakerEquipment.isTerminalMarkingOk, 'Baik', 'Tidak Baik'),
        testingBreakerInterlockResult: getResultText(data.testing.breakerEquipment.isInterlockSystemOk, 'Baik', 'Tidak Baik'),
        testingBreakerAuxSwitchResult: getResultText(data.testing.breakerEquipment.isAuxSwitchOk, 'Baik', 'Tidak Baik'),
        testingBreakerMechanicalTripResult: getResultText(data.testing.breakerEquipment.isMechanicalTripOk, 'Baik', 'Tidak Baik'),
        testingOverloadTripResult: getResultText(data.testing.isOverloadTripOk, 'Baik', 'Tidak Baik'),
        testingReversePowerRelayResult: getResultText(data.testing.isReversePowerRelayOk, 'Baik', 'Tidak Baik'),
        testingReverseCurrentRelayResult: getResultText(data.testing.isReverseCurrentRelayOk, 'Baik', 'Tidak Baik'),
        testingBreakerTripResult: getResultText(data.testing.isBreakerTripOk, 'Baik', 'Tidak Baik'),
        testingTemperatureResult: getResultText(data.testing.isTemperatureOk, 'Baik', 'Tidak Baik'),
        testingIndicatorLampResult: getResultText(data.testing.isIndicatorLampOk, 'Baik', 'Tidak Baik'),
        testingMeterDeviationResult: getResultText(data.testing.isMeterDeviationOk, 'Baik', 'Tidak Baik'),
        testingSynchronizationResult: getResultText(data.testing.isSynchronizationOk, 'Baik', 'Tidak Baik'),
        testingConductorAmpacityResult: getResultText(data.testing.isConductorAmpacityOk, 'Baik', 'Tidak Baik'),
        testingProtectionRatingResult: getResultText(data.testing.isProtectionRatingOk, 'Baik', 'Tidak Baik'),
        testingVoltageDropResult: getResultText(data.testing.isVoltageDropOk, 'Baik', 'Tidak Baik'),
        testingLossConnectionResult: getResultText(data.testing.hasLossConnection, 'Baik', 'Tidak Baik'),
        sdpFrontIndicatorLampsResult: getResultText(data.visualInspection.sdpFront.areIndicatorLampsGood, 'Baik', 'Tidak Baik'),
        sdpFrontDoorClearanceResult: getResultText(data.visualInspection.sdpFront.isDoorClearanceGood, 'Baik', 'Tidak Baik'),
        sdpFrontLightingProdResult: getResultText(data.visualInspection.sdpFront.isProductionLightingGood, 'Baik', 'Tidak Baik'),
        sdpFrontLightingOfficeResult: getResultText(data.visualInspection.sdpFront.isOfficeLightingGood, 'Baik', 'Tidak Baik'),
        sdpFrontLightingMainPanelResult: getResultText(data.visualInspection.sdpFront.isMainPanelLightingGood, 'Baik', 'Tidak Baik'),
        sdpFrontLightingWarehouseResult: getResultText(data.visualInspection.sdpFront.isWarehouseLightingGood, 'Baik', 'Tidak Baik'),
        sdpFrontUnusedItemsResult: getResultText(data.visualInspection.sdpFront.isAreaClearOfUnusedItems, 'Baik', 'Tidak Baik'),
        sdpFrontVentilationResult: getResultText(data.visualInspection.sdpFront.hasVentilationAndSigns, 'Terpasang', 'Tidak Terpasang'),
        floor: data.visualInspection.sdpFloors.map(floor => ({
            floorNumber: floor.floorNumber,
            coverResult: getResultText(floor.hasCover, 'Terpasang', 'Tidak Terpasang'),
            sldResult: getResultText(floor.hasSld, 'Terpasang', 'Tidak Terpasang'),
            bondingResult: getResultText(floor.hasBonding, 'Terpasang', 'Tidak Terpasang'),
            labelingResult: getResultText(floor.hasLabeling, 'Ada Label', 'Tidak di label'),
            colorCodeResult: getResultText(floor.isColorCodeOk, 'Sesuai', 'Tidak Sesuai'),
            cleanlinessResult: getResultText(floor.isClean, 'Baik', 'Tidak Baik'),
            neatnessResult: getResultText(floor.isNeat, 'Baik', 'Tidak Baik')
        })),
        sdpTerminalBusbarResult: getResultText(data.visualInspection.sdpTerminal.isBusbarOk, 'Sesuai', 'Tidak Sesuai'),
        sdpTerminalBreakerResult: getResultText(data.visualInspection.sdpTerminal.isBreakerOk, 'Sesuai', 'Tidak Sesuai'),
        sdpTerminalCableLugsResult: getResultText(data.visualInspection.sdpTerminal.areCableLugsOk, 'Sesuai', 'Tidak Sesuai'),
        sdpTerminalGroundingResult: getResultText(data.visualInspection.sdpTerminal.isGroundingSystemOk, 'Baik', 'Tidak Baik'),
        sdpTerminalBusbarDistanceResult: getResultText(data.visualInspection.sdpTerminal.isBusbarDistanceOk, 'Sesuai', 'Tidak Sesuai'),
        sdpTestingVoltageResult: getResultText(data.visualInspection.sdpTesting.isVoltageOk, 'Baik', 'Tidak Baik'),
        sdpTestingCurrentResult: getResultText(data.visualInspection.sdpTesting.isCurrentOk, 'Baik', 'Tidak Baik'),
        sdpTestingMeteringResult: getResultText(data.visualInspection.sdpTesting.isMeteringOk, 'Sesuai', 'Tidak Sesuai'),
        sdpTestingPanelLabelResult: getResultText(data.visualInspection.sdpTesting.hasPanelLabel, 'Terpasang', 'Tidak Terpasang'),
        sdpTestingWarningSignResult: getResultText(data.visualInspection.sdpTesting.hasWarningSign, 'Sesuai', 'Tidak Sesuai'),
        sdpTestingSwitchLockResult: getResultText(data.visualInspection.sdpTesting.hasSwitchAndLock, 'Ada', 'Tidak Ada'),
        sdpTestingTerminalHeatResult: getResultText(data.visualInspection.sdpTesting.isTerminalHeatTested, 'Dilakukan', 'Tidak Dilakukan'),
        sdpTestingGroundingResult: getResultText(data.visualInspection.sdpTesting.isGroundingTested, 'Dilakukan', 'Tidak Dilakukan'),
        sdpTestingConductorAmpacityResult: getResultText(data.visualInspection.sdpTesting.isConductorAmpacityOk, 'Sesuai', 'Tidak Sesuai'),
        sdpTestingProtectionRatingResult: getResultText(data.visualInspection.sdpTesting.isProtectionRatingOk, 'Sesuai', 'Tidak Sesuai'),
        found: data.found,
        conclusion: data.conclusion,
        recomendations: data.recommendations
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const companyName = data.generalData.companyName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Laporan-Instalasi-Listrik-${companyName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createLaporanListrik };