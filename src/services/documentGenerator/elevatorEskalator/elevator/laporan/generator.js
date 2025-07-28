'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { storage, BUCKET_NAME } = require('../../../../../utils/storage');

function getCheckmark(status) {
    if (status === true) return '✓';
    return '';
}

function getOppositeCheckmark(status) {
    if (status === false) return '✓';
    return '';
}

function getSyaratStatus(status) {
    if (status === true) return 'Memenuhi Syarat';
    if (status === false) return 'Tidak Memenuhi Syarat';
    return ''; 
}

const createLaporanElevator = async (data) => {
    const templatePathInBucket = 'elevatorEskalator/elevator/laporanElevator.docx';

    let content;
    try {
        console.log(`Mengunduh template: gs://${BUCKET_NAME}/${templatePathInBucket}`);
        const [fileBuffer] = await storage.bucket(BUCKET_NAME).file(templatePathInBucket).download();
        content = fileBuffer;
        console.log('Template berhasil diunduh.');
    } catch (error) {
        console.error(`Gagal mengunduh template dari GCS:`, error);
        throw new Error('Template dokumen elevator tidak dapat diakses dari Cloud Storage.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => "",
    });

    const i = data.inspectionAndTesting || {};

    const renderData = {
        // Data Utama
        examinationType: data?.examinationType,
        equipmentType: data?.equipmentType,
        
        // Data Umum
        ...data?.generalData,
        
         // Dokumen Teknis (Menggunakan helper baru)
        designDrawing: getSyaratStatus(data?.technicalDocumentInspection?.designDrawing),
        technicalCalculation: getSyaratStatus(data?.technicalDocumentInspection?.technicalCalculation),
        materialCertificate: getSyaratStatus(data?.technicalDocumentInspection?.materialCertificate),
        controlPanelDiagram: getSyaratStatus(data?.technicalDocumentInspection?.controlPanelDiagram),
        asBuiltDrawing: getSyaratStatus(data?.technicalDocumentInspection?.asBuiltDrawing),
        componentCertificates: getSyaratStatus(data?.technicalDocumentInspection?.componentCertificates),
        safeWorkProcedure: getSyaratStatus(data?.technicalDocumentInspection?.safeWorkProcedure),

        // --- machineRoomAndMachinery ---
        machineMountingresult: i.machineRoomAndMachinery?.machineMounting?.result,
        machineMountingMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineMounting?.status),
        machineMountingTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineMounting?.status),

        mechanicalBrakeresult: i.machineRoomAndMachinery?.mechanicalBrake?.result,
        mechanicalBrakeMemenuhi: getCheckmark(i.machineRoomAndMachinery?.mechanicalBrake?.status),
        mechanicalBrakeTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.mechanicalBrake?.status),

        electricalBrakeresult: i.machineRoomAndMachinery?.electricalBrake?.result,
        electricalBrakeMemenuhi: getCheckmark(i.machineRoomAndMachinery?.electricalBrake?.status),
        electricalBrakeTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.electricalBrake?.status),

        machineRoomConstructionresult: i.machineRoomAndMachinery?.machineRoomConstruction?.result,
        machineRoomConstructionMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineRoomConstruction?.status),
        machineRoomConstructionTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineRoomConstruction?.status),

        machineRoomClearanceresult: i.machineRoomAndMachinery?.machineRoomClearance?.result,
        machineRoomClearanceMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineRoomClearance?.status),
        machineRoomClearanceTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineRoomClearance?.status),

        machineRoomImplementationresult: i.machineRoomAndMachinery?.machineRoomImplementation?.result,
        machineRoomImplementationMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineRoomImplementation?.status),
        machineRoomImplementationTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineRoomImplementation?.status),

        ventilationresult: i.machineRoomAndMachinery?.ventilation?.result,
        ventilationMemenuhi: getCheckmark(i.machineRoomAndMachinery?.ventilation?.status),
        ventilationTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.ventilation?.status),

        machineRoomDoorresult: i.machineRoomAndMachinery?.machineRoomDoor?.result,
        machineRoomDoorMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineRoomDoor?.status),
        machineRoomDoorTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineRoomDoor?.status),

        mainPowerPanelPositionresult: i.machineRoomAndMachinery?.mainPowerPanelPosition?.result,
        mainPowerPanelPositionMemenuhi: getCheckmark(i.machineRoomAndMachinery?.mainPowerPanelPosition?.status),
        mainPowerPanelPositionTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.mainPowerPanelPosition?.status),

        rotatingPartsGuardresult: i.machineRoomAndMachinery?.rotatingPartsGuard?.result,
        rotatingPartsGuardMemenuhi: getCheckmark(i.machineRoomAndMachinery?.rotatingPartsGuard?.status),
        rotatingPartsGuardTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.rotatingPartsGuard?.status),

        ropeHoleGuardresult: i.machineRoomAndMachinery?.ropeHoleGuard?.result,
        ropeHoleGuardMemenuhi: getCheckmark(i.machineRoomAndMachinery?.ropeHoleGuard?.status),
        ropeHoleGuardTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.ropeHoleGuard?.status),

        machineRoomAccessLadderresult: i.machineRoomAndMachinery?.machineRoomAccessLadder?.result,
        machineRoomAccessLadderMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineRoomAccessLadder?.status),
        machineRoomAccessLadderTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineRoomAccessLadder?.status),

        floorLevelDifferenceresult: i.machineRoomAndMachinery?.floorLevelDifference?.result,
        floorLevelDifferenceMemenuhi: getCheckmark(i.machineRoomAndMachinery?.floorLevelDifference?.status),
        floorLevelDifferenceTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.floorLevelDifference?.status),

        fireExtinguisherresult: i.machineRoomAndMachinery?.fireExtinguisher?.result,
        fireExtinguisherMemenuhi: getCheckmark(i.machineRoomAndMachinery?.fireExtinguisher?.status),
        fireExtinguisherTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.fireExtinguisher?.status),

        panelPlacementresult: i.machineRoomAndMachinery?.machineRoomless?.panelPlacement?.result,
        panelPlacementMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineRoomless?.panelPlacement?.status),
        panelPlacementTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineRoomless?.panelPlacement?.status),

        lightingWorkArearesult: i.machineRoomAndMachinery?.machineRoomless?.lightingWorkArea?.result,
        lightingWorkAreaMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineRoomless?.lightingWorkArea?.status),
        lightingWorkAreaTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineRoomless?.lightingWorkArea?.status),

        lightingBetweenWorkArearesult: i.machineRoomAndMachinery?.machineRoomless?.lightingBetweenWorkArea?.result,
        lightingBetweenWorkAreaMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineRoomless?.lightingBetweenWorkArea?.status),
        lightingBetweenWorkAreaTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineRoomless?.lightingBetweenWorkArea?.status),

        manualBrakeReleaseresult: i.machineRoomAndMachinery?.machineRoomless?.manualBrakeRelease?.result,
        manualBrakeReleaseMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineRoomless?.manualBrakeRelease?.status),
        manualBrakeReleaseTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineRoomless?.manualBrakeRelease?.status),

        fireExtinguisherPlacementresult: i.machineRoomAndMachinery?.machineRoomless?.fireExtinguisherPlacement?.result,
        fireExtinguisherPlacementMemenuhi: getCheckmark(i.machineRoomAndMachinery?.machineRoomless?.fireExtinguisherPlacement?.status),
        fireExtinguisherPlacementTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.machineRoomless?.fireExtinguisherPlacement?.status),
        
        emergencyStopSwitchresult: i.machineRoomAndMachinery?.emergencyStopSwitch?.result,
        emergencyStopSwitchMemenuhi: getCheckmark(i.machineRoomAndMachinery?.emergencyStopSwitch?.status),
        emergencyStopSwitchTidakMemenuhi: getOppositeCheckmark(i.machineRoomAndMachinery?.emergencyStopSwitch?.status),

        // --- suspensionRopesAndBelts ---
        conditionresult: i.suspensionRopesAndBelts?.condition?.result,
        conditionMemenuhi: getCheckmark(i.suspensionRopesAndBelts?.condition?.status),
        conditionTidakMemenuhi: getOppositeCheckmark(i.suspensionRopesAndBelts?.condition?.status),

        chainUsageresult: i.suspensionRopesAndBelts?.chainUsage?.result,
        chainUsageMemenuhi: getCheckmark(i.suspensionRopesAndBelts?.chainUsage?.status),
        chainUsageTidakMemenuhi: getOppositeCheckmark(i.suspensionRopesAndBelts?.chainUsage?.status),

        safetyFactorresult: i.suspensionRopesAndBelts?.safetyFactor?.result,
        safetyFactorMemenuhi: getCheckmark(i.suspensionRopesAndBelts?.safetyFactor?.status),
        safetyFactorTidakMemenuhi: getOppositeCheckmark(i.suspensionRopesAndBelts?.safetyFactor?.status),

        ropeWithCounterweightresult: i.suspensionRopesAndBelts?.ropeWithCounterweight?.result,
        ropeWithCounterweightMemenuhi: getCheckmark(i.suspensionRopesAndBelts?.ropeWithCounterweight?.status),
        ropeWithCounterweightTidakMemenuhi: getOppositeCheckmark(i.suspensionRopesAndBelts?.ropeWithCounterweight?.status),

        ropeWithoutCounterweightresult: i.suspensionRopesAndBelts?.ropeWithoutCounterweight?.result,
        ropeWithoutCounterweightMemenuhi: getCheckmark(i.suspensionRopesAndBelts?.ropeWithoutCounterweight?.status),
        ropeWithoutCounterweightTidakMemenuhi: getOppositeCheckmark(i.suspensionRopesAndBelts?.ropeWithoutCounterweight?.status),

        beltresult: i.suspensionRopesAndBelts?.belt?.result,
        beltMemenuhi: getCheckmark(i.suspensionRopesAndBelts?.belt?.status),
        beltTidakMemenuhi: getOppositeCheckmark(i.suspensionRopesAndBelts?.belt?.status),

        slackRopeDeviceresult: i.suspensionRopesAndBelts?.slackRopeDevice?.result,
        slackRopeDeviceMemenuhi: getCheckmark(i.suspensionRopesAndBelts?.slackRopeDevice?.status),
        slackRopeDeviceTidakMemenuhi: getOppositeCheckmark(i.suspensionRopesAndBelts?.slackRopeDevice?.status),

        // --- drumsAndSheaves ---
        drumGroovesresult: i.drumsAndSheaves?.drumGrooves?.result,
        drumGroovesMemenuhi: getCheckmark(i.drumsAndSheaves?.drumGrooves?.status),
        drumGroovesTidakMemenuhi: getOppositeCheckmark(i.drumsAndSheaves?.drumGrooves?.status),

        passengerDrumDiameterresult: i.drumsAndSheaves?.passengerDrumDiameter?.result,
        passengerDrumDiameterMemenuhi: getCheckmark(i.drumsAndSheaves?.passengerDrumDiameter?.status),
        passengerDrumDiameterTidakMemenuhi: getOppositeCheckmark(i.drumsAndSheaves?.passengerDrumDiameter?.status),

        governorDrumDiameterresult: i.drumsAndSheaves?.governorDrumDiameter?.result,
        governorDrumDiameterMemenuhi: getCheckmark(i.drumsAndSheaves?.governorDrumDiameter?.status),
        governorDrumDiameterTidakMemenuhi: getOppositeCheckmark(i.drumsAndSheaves?.governorDrumDiameter?.status),
        
        // --- hoistwayAndPit ---
        constructionresult: i.hoistwayAndPit?.construction?.result,
        constructionMemenuhi: getCheckmark(i.hoistwayAndPit?.construction?.status),
        constructionTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.construction?.status),
        
        wallsresult: i.hoistwayAndPit?.walls?.result,
        wallsMemenuhi: getCheckmark(i.hoistwayAndPit?.walls?.status),
        wallsTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.walls?.status),
        
        inclinedElevatorTrackBedresult: i.hoistwayAndPit?.inclinedElevatorTrackBed?.result,
        inclinedElevatorTrackBedMemenuhi: getCheckmark(i.hoistwayAndPit?.inclinedElevatorTrackBed?.status),
        inclinedElevatorTrackBedTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.inclinedElevatorTrackBed?.status),
        
        cleanlinessresult: i.hoistwayAndPit?.cleanliness?.result,
        cleanlinessMemenuhi: getCheckmark(i.hoistwayAndPit?.cleanliness?.status),
        cleanlinessTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.cleanliness?.status),
        
        lightingresult: i.hoistwayAndPit?.lighting?.result,
        lightingMemenuhi: getCheckmark(i.hoistwayAndPit?.lighting?.status),
        lightingTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.lighting?.status),
        
        emergencyDoorNonStopresult: i.hoistwayAndPit?.emergencyDoorNonStop?.result,
        emergencyDoorNonStopMemenuhi: getCheckmark(i.hoistwayAndPit?.emergencyDoorNonStop?.status),
        emergencyDoorNonStopTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.emergencyDoorNonStop?.status),
        
        emergencyDoorSizeresult: i.hoistwayAndPit?.emergencyDoorSize?.result,
        emergencyDoorSizeMemenuhi: getCheckmark(i.hoistwayAndPit?.emergencyDoorSize?.status),
        emergencyDoorSizeTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.emergencyDoorSize?.status),
        
        emergencyDoorSafetySwitchresult: i.hoistwayAndPit?.emergencyDoorSafetySwitch?.result,
        emergencyDoorSafetySwitchMemenuhi: getCheckmark(i.hoistwayAndPit?.emergencyDoorSafetySwitch?.status),
        emergencyDoorSafetySwitchTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.emergencyDoorSafetySwitch?.status),
        
        emergencyDoorBridgeresult: i.hoistwayAndPit?.emergencyDoorBridge?.result,
        emergencyDoorBridgeMemenuhi: getCheckmark(i.hoistwayAndPit?.emergencyDoorBridge?.status),
        emergencyDoorBridgeTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.emergencyDoorBridge?.status),
        
        carTopClearanceresult: i.hoistwayAndPit?.carTopClearance?.result,
        carTopClearanceMemenuhi: getCheckmark(i.hoistwayAndPit?.carTopClearance?.status),
        carTopClearanceTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.carTopClearance?.status),
        
        pitClearanceresult: i.hoistwayAndPit?.pitClearance?.result,
        pitClearanceMemenuhi: getCheckmark(i.hoistwayAndPit?.pitClearance?.status),
        pitClearanceTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.pitClearance?.status),
        
        pitLadderresult: i.hoistwayAndPit?.pitLadder?.result,
        pitLadderMemenuhi: getCheckmark(i.hoistwayAndPit?.pitLadder?.status),
        pitLadderTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.pitLadder?.status),
        
        pitBelowWorkingAresresult: i.hoistwayAndPit?.pitBelowWorkingArea?.result,
        pitBelowWorkingAreaMemenuhi: getCheckmark(i.hoistwayAndPit?.pitBelowWorkingArea?.status),
        pitBelowWorkingAreaTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.pitBelowWorkingArea?.status),
        
        pitAccessSwitchresult: i.hoistwayAndPit?.pitAccessSwitch?.result,
        pitAccessSwitchMemenuhi: getCheckmark(i.hoistwayAndPit?.pitAccessSwitch?.status),
        pitAccessSwitchTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.pitAccessSwitch?.status),
        
        pitScreenresult: i.hoistwayAndPit?.pitScreen?.result,
        pitScreenMemenuhi: getCheckmark(i.hoistwayAndPit?.pitScreen?.status),
        pitScreenTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.pitScreen?.status),
        
        hoistwayDoorLeafresult: i.hoistwayAndPit?.hoistwayDoorLeaf?.result,
        hoistwayDoorLeafMemenuhi: getCheckmark(i.hoistwayAndPit?.hoistwayDoorLeaf?.status),
        hoistwayDoorLeafTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.hoistwayDoorLeaf?.status),
        
        hoistwayDoorInterlockresult: i.hoistwayAndPit?.hoistwayDoorInterlock?.result,
        hoistwayDoorInterlockMemenuhi: getCheckmark(i.hoistwayAndPit?.hoistwayDoorInterlock?.status),
        hoistwayDoorInterlockTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.hoistwayDoorInterlock?.status),
        
        floorLevelingresult: i.hoistwayAndPit?.floorLeveling?.result,
        floorLevelingMemenuhi: getCheckmark(i.hoistwayAndPit?.floorLeveling?.status),
        floorLevelingTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.floorLeveling?.status),
        
        hoistwaySeparatorBeamresult: i.hoistwayAndPit?.hoistwaySeparatorBeam?.result,
        hoistwaySeparatorBeamMemenuhi: getCheckmark(i.hoistwayAndPit?.hoistwaySeparatorBeam?.status),
        hoistwaySeparatorBeamTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.hoistwaySeparatorBeam?.status),
        
        inclinedElevatorStairsresult: i.hoistwayAndPit?.inclinedElevatorStairs?.result,
        inclinedElevatorStairsMemenuhi: getCheckmark(i.hoistwayAndPit?.inclinedElevatorStairs?.status),
        inclinedElevatorStairsTidakMemenuhi: getOppositeCheckmark(i.hoistwayAndPit?.inclinedElevatorStairs?.status),

        // --- car ---
        frameresult: i.car?.frame?.result,
        frameMemenuhi: getCheckmark(i.car?.frame?.status),
        frameTidakMemenuhi: getOppositeCheckmark(i.car?.frame?.status),

        bodyresult: i.car?.body?.result,
        bodyresultMemenuhi: getCheckmark(i.car?.body?.status),
        bodyresultTidakMemenuhi: getOppositeCheckmark(i.car?.body?.status),

        wallHeightresult: i.car?.wallHeight?.result,
        wallHeightMemenuhi: getCheckmark(i.car?.wallHeight?.status),
        wallHeightTidakMemenuhi: getOppositeCheckmark(i.car?.wallHeight?.status),

        floorAraeresult: i.car?.floorArea?.result,
        floorAreaMemenuhi: getCheckmark(i.car?.floorArea?.status),
        floorAreaTidakMemenuhi: getOppositeCheckmark(i.car?.floorArea?.status),

        carAreaExpansionresult: i.car?.carAreaExpansion?.result,
        carAreaExpansionMemenuhi: getCheckmark(i.car?.carAreaExpansion?.status),
        carAreaExpansionTidakMemenuhi: getOppositeCheckmark(i.car?.carAreaExpansion?.status),

        carDoorresult: i.car?.carDoor?.result,
        carDoorMemenuhi: getCheckmark(i.car?.carDoor?.status),
        carDoorTidakMemenuhi: getOppositeCheckmark(i.car?.carDoor?.status),

        sizeresult: i.car?.carDoorSpecs?.size?.result,
        sizeMemenuhi: getCheckmark(i.car?.carDoorSpecs?.size?.status),
        sizeTidakMemenuhi: getOppositeCheckmark(i.car?.carDoorSpecs?.size?.status),

        lockAndSwitchresult: i.car?.carDoorSpecs?.lockAndSwitch?.result,
        lockAndSwitchMemenuhi: getCheckmark(i.car?.carDoorSpecs?.lockAndSwitch?.status),
        lockAndSwitchTidakMemenuhi: getOppositeCheckmark(i.car?.carDoorSpecs?.lockAndSwitch?.status),

        sillClearanceresult: i.car?.carDoorSpecs?.sillClearance?.result,
        sillClearanceMemenuhi: getCheckmark(i.car?.carDoorSpecs?.sillClearance?.status),
        sillClearanceTidakMemenuhi: getOppositeCheckmark(i.car?.carDoorSpecs?.sillClearance?.status),

        carToBeamClearanceresult: i.car?.carToBeamClearance?.result,
        carToBeamClearanceMemenuhi: getCheckmark(i.car?.carToBeamClearance?.status),
        carToBeamClearanceTidakMemenuhi: getOppositeCheckmark(i.car?.carToBeamClearance?.status),

        alarmBellresult: i.car?.alarmBell?.result,
        alarmBellMemenuhi: getCheckmark(i.car?.alarmBell?.status),
        alarmBellTidakMemenuhi: getOppositeCheckmark(i.car?.alarmBell?.status),

        backupPowerARDresult: i.car?.backupPowerARD?.result,
        backupPowerARDMemenuhi: getCheckmark(i.car?.backupPowerARD?.status),
        backupPowerARDTidakMemenuhi: getOppositeCheckmark(i.car?.backupPowerARD?.status),

        intercomresult: i.car?.intercom?.result,
        intercomMemenuhi: getCheckmark(i.car?.intercom?.status),
        intercomTidakMemenuhi: getOppositeCheckmark(i.car?.intercom?.status),

        ventilationCarresult: i.car?.ventilation?.result,
        ventilationCarMemenuhi: getCheckmark(i.car?.ventilation?.status),
        ventilationCarTidakMemenuhi: getOppositeCheckmark(i.car?.ventilation?.status),

        emergencyLightingresult: i.car?.emergencyLighting?.result,
        emergencyLightingMemenuhi: getCheckmark(i.car?.emergencyLighting?.status),
        emergencyLightingTidakMemenuhi: getOppositeCheckmark(i.car?.emergencyLighting?.status),

        operatingPanelresult: i.car?.operatingPanel?.result,
        operatingPanelMemenuhi: getCheckmark(i.car?.operatingPanel?.status),
        operatingPanelTidakMemenuhi: getOppositeCheckmark(i.car?.operatingPanel?.status),

        carPositionIndicatorresult: i.car?.carPositionIndicator?.result,
        carPositionIndicatorMemenuhi: getCheckmark(i.car?.carPositionIndicator?.status),
        carPositionIndicatorTidakMemenuhi: getOppositeCheckmark(i.car?.carPositionIndicator?.status),

        manufacturerNameresult: i.car?.carSignage?.manufacturerName?.result,
        manufacturerNameMemenuhi: getCheckmark(i.car?.carSignage?.manufacturerName?.status),
        manufacturerNameTidakMemenuhi: getOppositeCheckmark(i.car?.carSignage?.manufacturerName?.status),

        loadCapacityresult: i.car?.carSignage?.loadCapacity?.result,
        loadCapacityMemenuhi: getCheckmark(i.car?.carSignage?.loadCapacity?.status),
        loadCapacityTidakMemenuhi: getOppositeCheckmark(i.car?.carSignage?.loadCapacity?.status),

        noSmokingSignresult: i.car?.carSignage?.noSmokingSign?.result,
        noSmokingSignMemenuhi: getCheckmark(i.car?.carSignage?.noSmokingSign?.status),
        noSmokingSignTidakMemenuhi: getOppositeCheckmark(i.car?.carSignage?.noSmokingSign?.status),

        overloadIndicatorresult: i.car?.carSignage?.overloadIndicator?.result,
        overloadIndicatorMemenuhi: getCheckmark(i.car?.carSignage?.overloadIndicator?.status),
        overloadIndicatorTidakMemenuhi: getOppositeCheckmark(i.car?.carSignage?.overloadIndicator?.status),

        doorOpenCloseButtonsresult: i.car?.carSignage?.doorOpenCloseButtons?.result,
        doorOpenCloseButtonsMemenuhi: getCheckmark(i.car?.carSignage?.doorOpenCloseButtons?.status),
        doorOpenCloseButtonsTidakMemenuhi: getOppositeCheckmark(i.car?.carSignage?.doorOpenCloseButtons?.status),

        floorButtonsresult: i.car?.carSignage?.floorButtons?.result,
        floorButtonsMemenuhi: getCheckmark(i.car?.carSignage?.floorButtons?.status),
        floorButtonsTidakMemenuhi: getOppositeCheckmark(i.car?.carSignage?.floorButtons?.status),

        alarmButtonresult: i.car?.carSignage?.alarmButton?.result,
        alarmButtonMemenuhi: getCheckmark(i.car?.carSignage?.alarmButton?.status),
        alarmButtonTidakMemenuhi: getOppositeCheckmark(i.car?.carSignage?.alarmButton?.status),

        twoWayIntercomresult: i.car?.carSignage?.twoWayIntercom?.result,
        twoWayIntercomMemenuhi: getCheckmark(i.car?.carSignage?.twoWayIntercom?.status),
        twoWayIntercomTidakMemenuhi: getOppositeCheckmark(i.car?.carSignage?.twoWayIntercom?.status),

        carRoofStrengthresult: i.car?.carRoofStrength?.result,
        carRoofStrengthMemenuhi: getCheckmark(i.car?.carRoofStrength?.status),
        carRoofStrengthTidakMemenuhi: getOppositeCheckmark(i.car?.carRoofStrength?.status),

        carTopEmergencyExitresult: i.car?.carTopEmergencyExit?.result,
        carTopEmergencyExitMemenuhi: getCheckmark(i.car?.carTopEmergencyExit?.status),
        carTopEmergencyExitTidakMemenuhi: getOppositeCheckmark(i.car?.carTopEmergencyExit?.status),

        carSideEmergencyExitresult: i.car?.carSideEmergencyExit?.result,
        carSideEmergencyExitMemenuhi: getCheckmark(i.car?.carSideEmergencyExit?.status),
        carSideEmergencyExitTidakMemenuhi: getOppositeCheckmark(i.car?.carSideEmergencyExit?.status),

        carTopGuardRailresult: i.car?.carTopGuardRail?.result,
        carTopGuardRailMemenuhi: getCheckmark(i.car?.carTopGuardRail?.status),
        carTopGuardRailTidakMemenuhi: getOppositeCheckmark(i.car?.carTopGuardRail?.status),

        guardRailHeight300to850result: i.car?.guardRailHeight300to850?.result,
        guardRailHeight300to850Memenuhi: getCheckmark(i.car?.guardRailHeight300to850?.status),
        guardRailHeight300to850TidakMemenuhi: getOppositeCheckmark(i.car?.guardRailHeight300to850?.status),

        guardRailHeightOver850result: i.car?.guardRailHeightOver850?.result,
        guardRailHeightOver850Memenuhi: getCheckmark(i.car?.guardRailHeightOver850?.status),
        guardRailHeightOver850TidakMemenuhi: getOppositeCheckmark(i.car?.guardRailHeightOver850?.status),

        carTopLightingresult: i.car?.carTopLighting?.result,
        carTopLightingMemenuhi: getCheckmark(i.car?.carTopLighting?.status),
        carTopLightingTidakMemenuhi: getOppositeCheckmark(i.car?.carTopLighting?.status),

        manualOperationButtonsresult: i.car?.manualOperationButtons?.result,
        manualOperationButtonsMemenuhi: getCheckmark(i.car?.manualOperationButtons?.status),
        manualOperationButtonsTidakMemenuhi: getOppositeCheckmark(i.car?.manualOperationButtons?.status),

        carInteriorresult: i.car?.carInterior?.result,
        carInteriorMemenuhi: getCheckmark(i.car?.carInterior?.status),
        carInteriorTidakMemenuhi: getOppositeCheckmark(i.car?.carInterior?.status),

        // --- governorAndSafetyBrake ---
        governorRopeClampresult: i.governorAndSafetyBrake?.governorRopeClamp?.result,
        governorRopeClampMemenuhi: getCheckmark(i.governorAndSafetyBrake?.governorRopeClamp?.status),
        governorRopeClampTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.governorRopeClamp?.status),

        governorSwitchresult: i.governorAndSafetyBrake?.governorSwitch?.result,
        governorSwitchMemenuhi: getCheckmark(i.governorAndSafetyBrake?.governorSwitch?.status),
        governorSwitchTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.governorSwitch?.status),

        safetyBrakeSpeedresult: i.governorAndSafetyBrake?.safetyBrakeSpeed?.result,
        safetyBrakeSpeedMemenuhi: getCheckmark(i.governorAndSafetyBrake?.safetyBrakeSpeed?.status),
        safetyBrakeSpeedTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.safetyBrakeSpeed?.status),

        safetyBrakeTyperesult: i.governorAndSafetyBrake?.safetyBrakeType?.result,
        safetyBrakeTypeMemenuhi: getCheckmark(i.governorAndSafetyBrake?.safetyBrakeType?.status),
        safetyBrakeTypeTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.safetyBrakeType?.status),

        safetyBrakeMechanismresult: i.governorAndSafetyBrake?.safetyBrakeMechanism?.result,
        safetyBrakeMechanismMemenuhi: getCheckmark(i.governorAndSafetyBrake?.safetyBrakeMechanism?.status),
        safetyBrakeMechanismTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.safetyBrakeMechanism?.status),

        progressiveSafetyBrakeresult: i.governorAndSafetyBrake?.progressiveSafetyBrake?.result,
        progressiveSafetyBrakeMemenuhi: getCheckmark(i.governorAndSafetyBrake?.progressiveSafetyBrake?.status),
        progressiveSafetyBrakeTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.progressiveSafetyBrake?.status),

        instantaneousSafetyBrakeresult: i.governorAndSafetyBrake?.instantaneousSafetyBrake?.result,
        instantaneousSafetyBrakeMemenuhi: getCheckmark(i.governorAndSafetyBrake?.instantaneousSafetyBrake?.status),
        instantaneousSafetyBrakeTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.instantaneousSafetyBrake?.status),

        safetyBrakeOperationresult: i.governorAndSafetyBrake?.safetyBrakeOperation?.result,
        safetyBrakeOperationMemenuhi: getCheckmark(i.governorAndSafetyBrake?.safetyBrakeOperation?.status),
        safetyBrakeOperationTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.safetyBrakeOperation?.status),

        electricalCutoutSwitchresult: i.governorAndSafetyBrake?.electricalCutoutSwitch?.result,
        electricalCutoutSwitchMemenuhi: getCheckmark(i.governorAndSafetyBrake?.electricalCutoutSwitch?.status),
        electricalCutoutSwitchTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.electricalCutoutSwitch?.status),

        limitSwitchresult: i.governorAndSafetyBrake?.limitSwitch?.result,
        limitSwitchMemenuhi: getCheckmark(i.governorAndSafetyBrake?.limitSwitch?.status),
        limitSwitchTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.limitSwitch?.status),

        overloadDeviceresult: i.governorAndSafetyBrake?.overloadDevice?.result,
        overloadDeviceMemenuhi: getCheckmark(i.governorAndSafetyBrake?.overloadDevice?.status),
        overloadDeviceTidakMemenuhi: getOppositeCheckmark(i.governorAndSafetyBrake?.overloadDevice?.status),

        // --- counterweightGuideRailsAndBuffers ---
        counterweightMaterialresult: i.counterweightGuideRailsAndBuffers?.counterweightMaterial?.result,
        counterweightMaterialMemenuhi: getCheckmark(i.counterweightGuideRailsAndBuffers?.counterweightMaterial?.status),
        counterweightMaterialTidakMemenuhi: getOppositeCheckmark(i.counterweightGuideRailsAndBuffers?.counterweightMaterial?.status),

        counterweightGuardScreenresult: i.counterweightGuideRailsAndBuffers?.counterweightGuardScreen?.result,
        counterweightGuardScreenMemenuhi: getCheckmark(i.counterweightGuideRailsAndBuffers?.counterweightGuardScreen?.status),
        counterweightGuardScreenTidakMemenuhi: getOppositeCheckmark(i.counterweightGuideRailsAndBuffers?.counterweightGuardScreen?.status),

        guideRailConstructionresult: i.counterweightGuideRailsAndBuffers?.guideRailConstruction?.result,
        guideRailConstructionMemenuhi: getCheckmark(i.counterweightGuideRailsAndBuffers?.guideRailConstruction?.status),
        guideRailConstructionTidakMemenuhi: getOppositeCheckmark(i.counterweightGuideRailsAndBuffers?.guideRailConstruction?.status),

        bufferTyperesult: i.counterweightGuideRailsAndBuffers?.bufferType?.result,
        bufferTypeMemenuhi: getCheckmark(i.counterweightGuideRailsAndBuffers?.bufferType?.status),
        bufferTypeTidakMemenuhi: getOppositeCheckmark(i.counterweightGuideRailsAndBuffers?.bufferType?.status),

        bufferFunctionresult: i.counterweightGuideRailsAndBuffers?.bufferFunction?.result,
        bufferFunctionMemenuhi: getCheckmark(i.counterweightGuideRailsAndBuffers?.bufferFunction?.status),
        bufferFunctionTidakMemenuhi: getOppositeCheckmark(i.counterweightGuideRailsAndBuffers?.bufferFunction?.status),

        bufferSafetySwitchresult: i.counterweightGuideRailsAndBuffers?.bufferSafetySwitch?.result,
        bufferSafetySwitchMemenuhi: getCheckmark(i.counterweightGuideRailsAndBuffers?.bufferSafetySwitch?.status),
        bufferSafetySwitchTidakMemenuhi: getOppositeCheckmark(i.counterweightGuideRailsAndBuffers?.bufferSafetySwitch?.status),

        // --- electricalInstallation ---
        installationStandardresult: i.electricalInstallation?.installationStandard?.result,
        installationStandardMemenuhi: getCheckmark(i.electricalInstallation?.installationStandard?.status),
        installationStandardTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.installationStandard?.status),

        electricalPanelresult: i.electricalInstallation?.electricalPanel?.result,
        electricalPanelMemenuhi: getCheckmark(i.electricalInstallation?.electricalPanel?.status),
        electricalPanelTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.electricalPanel?.status),

        backupPowerARD2result: i.electricalInstallation?.backupPowerARD?.result,
        backupPowerARD2Memenuhi: getCheckmark(i.electricalInstallation?.backupPowerARD?.status),
        backupPowerARD2TidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.backupPowerARD?.status),

        groundingCableresult: i.electricalInstallation?.groundingCable?.result,
        groundingCableMemenuhi: getCheckmark(i.electricalInstallation?.groundingCable?.status),
        groundingCableTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.groundingCable?.status),

        fireAlarmConnectionresult: i.electricalInstallation?.fireAlarmConnection?.result,
        fireAlarmConnectionMemenuhi: getCheckmark(i.electricalInstallation?.fireAlarmConnection?.status),
        fireAlarmConnectionTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireAlarmConnection?.status),

        backupPowerresult: i.electricalInstallation?.fireServiceElevator?.backupPower?.result,
        backupPowerMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.backupPower?.status),
        backupPowerTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.backupPower?.status),

        specialOperationresult: i.electricalInstallation?.fireServiceElevator?.specialOperation?.result,
        specialOperationMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.specialOperation?.status),
        specialOperationTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.specialOperation?.status),

        fireSwitchresult: i.electricalInstallation?.fireServiceElevator?.fireSwitch?.result,
        fireSwitchMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.fireSwitch?.status),
        fireSwitchTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.fireSwitch?.status),

        labelFireswitchresult: i.electricalInstallation?.fireServiceElevator?.label?.result,
        labelFireswitchMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.label?.status),
        labelFireswitchTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.label?.status),

        labelresult: i.electricalInstallation?.fireServiceElevator?.label?.result,
        labelMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.label?.status),
        labelTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.label?.status),

        electricalFireResistanceresult: i.electricalInstallation?.fireServiceElevator?.electricalFireResistance?.result,
        electricalFireResistanceMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.electricalFireResistance?.status),
        electricalFireResistanceTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.electricalFireResistance?.status),

        hoistwayWallFireResistanceresult: i.electricalInstallation?.fireServiceElevator?.hoistwayWallFireResistance?.result,
        hoistwayWallFireResistanceMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.hoistwayWallFireResistance?.status),
        hoistwayWallFireResistanceTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.hoistwayWallFireResistance?.status),

        carSizeresult: i.electricalInstallation?.fireServiceElevator?.carSize?.result,
        carSizeMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.carSize?.status),
        carSizeTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.carSize?.status),

        doorSizeresult: i.electricalInstallation?.fireServiceElevator?.doorSize?.result,
        doorSizeMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.doorSize?.status),
        doorSizeTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.doorSize?.status),

        travelTimeresult: i.electricalInstallation?.fireServiceElevator?.travelTime?.result,
        travelTimeMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.travelTime?.status),
        travelTimeTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.travelTime?.status),

        evacuationFloorresult: i.electricalInstallation?.fireServiceElevator?.evacuationFloor?.result,
        evacuationFloorMemenuhi: getCheckmark(i.electricalInstallation?.fireServiceElevator?.evacuationFloor?.status),
        evacuationFloorTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.fireServiceElevator?.evacuationFloor?.status),

        operatingPanel2result: i.electricalInstallation?.accessibilityElevator?.operatingPanel?.result,
        operatingPanel2Memenuhi: getCheckmark(i.electricalInstallation?.accessibilityElevator?.operatingPanel?.status),
        operatingPanel2TidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.accessibilityElevator?.operatingPanel?.status),

        panelHeightresult: i.electricalInstallation?.accessibilityElevator?.panelHeight?.result,
        panelHeightMemenuhi: getCheckmark(i.electricalInstallation?.accessibilityElevator?.panelHeight?.status),
        panelHeightTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.accessibilityElevator?.panelHeight?.status),

        doorOpenTimeresult: i.electricalInstallation?.accessibilityElevator?.doorOpenTime?.result,
        doorOpenTimeMemenuhi: getCheckmark(i.electricalInstallation?.accessibilityElevator?.doorOpenTime?.status),
        doorOpenTimeTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.accessibilityElevator?.doorOpenTime?.status),

        doorWidthresult: i.electricalInstallation?.accessibilityElevator?.doorWidth?.result,
        doorWidthMemenuhi: getCheckmark(i.electricalInstallation?.accessibilityElevator?.doorWidth?.status),
        doorWidthTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.accessibilityElevator?.doorWidth?.status),

        audioInformationresult: i.electricalInstallation?.accessibilityElevator?.audioInformation?.result,
        audioInformationMemenuhi: getCheckmark(i.electricalInstallation?.accessibilityElevator?.audioInformation?.status),
        audioInformationTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.accessibilityElevator?.audioInformation?.status),

        labelAccessibilityresult: i.electricalInstallation?.accessibilityElevator?.label?.result,
        labelAccessibilityMemenuhi: getCheckmark(i.electricalInstallation?.accessibilityElevator?.label?.status),
        labelAccessibilityTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.accessibilityElevator?.label?.status),

        availabilityresult: i.electricalInstallation?.seismicSensor?.availability?.result,
        availabilityMemenuhi: getCheckmark(i.electricalInstallation?.seismicSensor?.availability?.status),
        availabilityTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.seismicSensor?.availability?.status),

        functionresult: i.electricalInstallation?.seismicSensor?.function?.result,
        functionMemenuhi: getCheckmark(i.electricalInstallation?.seismicSensor?.function?.status),
        functionTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.seismicSensor?.function?.status),
        
        // --- Kesimpulan ---
        conclusion: data?.conclusion,
        recomendations: data?.recomendations
    };

    try {
        doc.render(renderData);
    } catch (error) {
        console.error("GAGAL RENDER DOKUMEN:", error.message);
        // Baris ini membantu dalam debugging dengan menampilkan detail error yang lebih lengkap
        const e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({error: e}));
        throw error;
    }

    const docxBuffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });

    const ownerName = data.generalData?.ownerName?.replace(/\s+/g, '-') || 'Tidak Ada Nama Perusahaan';
    const fileName = `Laporan Elevator-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanElevator,
};