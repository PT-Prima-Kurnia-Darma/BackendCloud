'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../../config');

// Inisialisasi Google Cloud Storage
const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: {
      client_email: config.FIRESTORE_CLIENT_EMAIL,
      private_key: config.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
});

const BUCKET_NAME = 'audit-riksauji'; // Pastikan nama bucket Anda benar

const getCheckmark = (status) => (status ? '√' : '');


const createLaporanGondola = async (data) => {
    const templatePath = 'paa/gondola/laporanGondola.docx'; // Path ke template di GCS

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template Laporan Gondola:', error);
        throw new Error('Template dokumen Laporan Gondola tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { 
        paragraphLoop: true, 
        linebreaks: true, 
        nullGetter: () => "" // Mengganti nilai null/undefined dengan string kosong
    });
    
    // Memformat data untuk ditempelkan ke template
    const renderData = {
        // --- DATA UTAMA ---
        examinationType: data.examinationType,
        inspectionType: data.inspectionType.toUpperCase(),
        subInspectionType: data.subInspectionType,
        
        // --- DATA UMUM (I) ---
        ownerName: data.generalData.ownerName,
        ownerAddress: data.generalData.ownerAddress,
        userInCharge: data.generalData.userInCharge,
        subcontractorPersonInCharge: data.generalData.subcontractorPersonInCharge,
        unitLocation: data.generalData.unitLocation,
        operatorName: data.generalData.operatorName,
        equipmentType: data.generalData.equipmentType,
        manufacturer: data.generalData.manufacturer,
        brandType: data.generalData.brandType,
        locationAndYearOfManufacture: data.generalData.locationAndYearOfManufacture,
        serialNumberUnitNumber: data.generalData.serialNumberUnitNumber,
        capacityWorkingLoad: data.generalData.capacityWorkingLoad,
        intendedUse: data.generalData.intendedUse,
        usagePermitNumber: data.generalData.usagePermitNumber,
        operatorCertificate: data.generalData.operatorCertificate,
        inspectionDate: data.inspectionDate,

        // --- DATA TEKNIK (II) ---
        gondolaSpecificationSupportMastHeight: data.technicalData.gondolaSpecification.supportMastHeight,
        gondolaSpecificationFrontBeamLength: data.technicalData.gondolaSpecification.frontBeamLength,
        gondolaSpecificationMiddleBeamLength: data.technicalData.gondolaSpecification.middleBeamLength,
        gondolaSpecificationRearBeamLength: data.technicalData.gondolaSpecification.rearBeamLength,
        gondolaSpecificationBalanceWeightDistance: data.technicalData.gondolaSpecification.balanceWeightDistance,
        gondolaSpecificationCapacity: data.technicalData.gondolaSpecification.capacity,
        gondolaSpecificationSpeed: data.technicalData.gondolaSpecification.speed,
        gondolaSpecificationPlatformSize: data.technicalData.gondolaSpecification.platformSize,
        gondolaSpecificationWireRopeDiameter: data.technicalData.gondolaSpecification.wireRopeDiameter,
        
        hoistModel: data.technicalData.hoist.model,
        hoistLiftingCapacity: data.technicalData.hoist.liftingCapacity,
        hoistlElectricMotorType: data.technicalData.hoist.electricMotor.type,
        hoistElectricMotorPower: data.technicalData.hoist.electricMotor.power,
        hoistElectricMotorVoltage: data.technicalData.hoist.electricMotor.voltage,
        hoistElectricMotorVoltageHz: data.technicalData.hoist.electricMotor.voltageHz,
        
        safetyLockType: data.technicalData.safetyLockType,
        
        brakeType: data.technicalData.brake.type,
        brakeModel: data.technicalData.brake.model,
        brakeCapacity: data.technicalData.brake.capacity,
        
        suspensionMechanicalSupportMastHeight: data.technicalData.suspensionMechanical.supportMastHeight,
        suspensionMechanicalFrontBeamLength: data.technicalData.suspensionMechanical.frontBeamLength,
        suspensionMechanicalMaterial: data.technicalData.suspensionMechanical.material,
        
        machineWeightTotalPlatformWeight: data.technicalData.machineWeight.totalPlatformWeight,
        machineWeightSuspensionMechanicalWeight: data.technicalData.machineWeight.suspensionMechanicalWeight,
        machineWeightBalanceWeight: data.technicalData.machineWeight.balanceWeight,
        machineWeightTotalMachineWeight: data.technicalData.machineWeight.totalMachineWeight,

        // --- PEMERIKSAAN VISUAL (III) ---
        // Struktur Penggantung
        suspensionStructureFrontBeamMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.frontBeam.status),
        suspensionStructureFrontBeamTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.frontBeam.status),
        suspensionStructureFrontBeamResult: data.visualInspection.suspensionStructure.frontBeam.result,
        suspensionStructureMiddleBeamMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.middleBeam.status),
        suspensionStructureMiddleBeamTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.middleBeam.status),
        suspensionStructureMiddleBeamResult: data.visualInspection.suspensionStructure.middleBeam.result,
        suspensionStructureRearBeamMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.rearBeam.status),
        suspensionStructureRearBeamTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.rearBeam.status),
        suspensionStructureRearBeamResult: data.visualInspection.suspensionStructure.rearBeam.result,
        suspensionStructureFrontBeamSupportMastMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.frontBeamSupportMast.status),
        suspensionStructureFrontBeamSupportMastTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.frontBeamSupportMast.status),
        suspensionStructureFrontBeamSupportMastResult: data.visualInspection.suspensionStructure.frontBeamSupportMast.result,
        suspensionStructureLowerFrontBeamSupportMastMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.lowerFrontBeamSupportMast.status),
        suspensionStructureLowerFrontBeamSupportMastTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.lowerFrontBeamSupportMast.status),
        suspensionStructureLowerFrontBeamSupportMastResult: data.visualInspection.suspensionStructure.lowerFrontBeamSupportMast.result,
        suspensionStructureMastAndBeamClampMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.mastAndBeamClamp.status),
        suspensionStructureMastAndBeamClampTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.mastAndBeamClamp.status),
        suspensionStructureMastAndBeamClampResult: data.visualInspection.suspensionStructure.mastAndBeamClamp.result,
        suspensionStructureCouplingSleeveMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.couplingSleeve.status),
        suspensionStructureCouplingSleeveTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.couplingSleeve.status),
        suspensionStructureCouplingSleeveResult: data.visualInspection.suspensionStructure.couplingSleeve.result,
        suspensionStructureTurnBuckleMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.turnBuckle.status),
        suspensionStructureTurnBuckleTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.turnBuckle.status),
        suspensionStructureTurnBuckleResult: data.visualInspection.suspensionStructure.turnBuckle.result,
        suspensionStructureReinforcementRopeMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.reinforcementRope.status),
        suspensionStructureReinforcementRopeTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.reinforcementRope.status),
        suspensionStructureReinforcementRopeResult: data.visualInspection.suspensionStructure.reinforcementRope.result,
        suspensionStructureRearSupportMastMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.rearSupportMast.status),
        suspensionStructureRearSupportMastTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.rearSupportMast.status),
        suspensionStructureRearSupportMastResult: data.visualInspection.suspensionStructure.rearSupportMast.result,
        suspensionStructureBalanceWeightMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.balanceWeight.status),
        suspensionStructureBalanceWeightTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.balanceWeight.status),
        suspensionStructureBalanceWeightResult: data.visualInspection.suspensionStructure.balanceWeight.result,
        suspensionStructureFrontBeamSupportBaseMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.frontBeamSupportBase.status),
        suspensionStructureFrontBeamSupportBaseTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.frontBeamSupportBase.status),
        suspensionStructureFrontBeamSupportBaseResult: data.visualInspection.suspensionStructure.frontBeamSupportBase.result,
        suspensionStructureRearBeamSupportBaseMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.rearBeamSupportBase.status),
        suspensionStructureRearBeamSupportBaseTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.rearBeamSupportBase.status),
        suspensionStructureRearBeamSupportBaseResult: data.visualInspection.suspensionStructure.rearBeamSupportBase.result,
        suspensionStructureJackBaseJointMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.jackBaseJoint.status),
        suspensionStructureJackBaseJointTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.jackBaseJoint.status),
        suspensionStructureJackBaseJointResult: data.visualInspection.suspensionStructure.jackBaseJoint.result,
        suspensionStructureConnectionBoltsMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.connectionBolts.status),
        suspensionStructureConnectionBoltsTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.connectionBolts.status),
        suspensionStructureConnectionBoltsResult: data.visualInspection.suspensionStructure.connectionBolts.result,
        
        // Tali Kawat Baja
        steelWireRopeMainWireRopeMemenuhi: getCheckmark(data.visualInspection.steelWireRope.mainWireRope.status),
        steelWireRopeMainWireRopeTidakMemenuhi: getCheckmark(!data.visualInspection.steelWireRope.mainWireRope.status),
        steelWireRopeMainWireRopeResult: data.visualInspection.steelWireRope.mainWireRope.result,
        steelWireRopeSafetyRopeMemenuhi: getCheckmark(data.visualInspection.steelWireRope.safetyRope.status),
        steelWireRopeSafetyRopeTidakMemenuhi: getCheckmark(!data.visualInspection.steelWireRope.safetyRope.status),
        steelWireRopeSafetyRopeResult: data.visualInspection.steelWireRope.safetyRope.result,
        steelWireRopeSlingFastenersMemenuhi: getCheckmark(data.visualInspection.steelWireRope.slingFasteners.status),
        steelWireRopeSlingFastenersTidakMemenuhi: getCheckmark(!data.visualInspection.steelWireRope.slingFasteners.status),
        steelWireRopeSlingFastenersResult: data.visualInspection.steelWireRope.slingFasteners.result,

        // Sistem Kelistrikan
        electricalSystemHoistMotorMemenuhi: getCheckmark(data.visualInspection.electricalSystem.hoistMotor.status),
        electricalSystemHoistMotorTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.hoistMotor.status),
        electricalSystemHoistMotorResult: data.visualInspection.electricalSystem.hoistMotor.result,
        electricalSystemBrakeReleaseMemenuhi: getCheckmark(data.visualInspection.electricalSystem.brakeRelease.status),
        electricalSystemBrakeReleaseTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.brakeRelease.status),
        electricalSystemBrakeReleaseResult: data.visualInspection.electricalSystem.brakeRelease.result,
        electricalSystemManualReleaseMemenuhi: getCheckmark(data.visualInspection.electricalSystem.manualRelease.status),
        electricalSystemManualReleaseTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.manualRelease.status),
        electricalSystemManualReleaseResult: data.visualInspection.electricalSystem.manualRelease.result,
        electricalSystemPowerControlMemenuhi: getCheckmark(data.visualInspection.electricalSystem.powerControl.status),
        electricalSystemPowerControlTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.powerControl.status),
        electricalSystemPowerControlResult: data.visualInspection.electricalSystem.powerControl.result,
        electricalSystemPowerCableMemenuhi: getCheckmark(data.visualInspection.electricalSystem.powerCable.status),
        electricalSystemPowerCableTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.powerCable.status),
        electricalSystemPowerCableResult: data.visualInspection.electricalSystem.powerCable.result,
        electricalSystemHandleSwitchMemenuhi: getCheckmark(data.visualInspection.electricalSystem.handleSwitch.status),
        electricalSystemHandleSwitchTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.handleSwitch.status),
        electricalSystemHandleSwitchResult: data.visualInspection.electricalSystem.handleSwitch.result,
        electricalSystemUpperLimitSwitchMemenuhi: getCheckmark(data.visualInspection.electricalSystem.upperLimitSwitch.status),
        electricalSystemUpperLimitSwitchTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.upperLimitSwitch.status),
        electricalSystemUpperLimitSwitchResult: data.visualInspection.electricalSystem.upperLimitSwitch.result,
        electricalSystemLimitStopperMemenuhi: getCheckmark(data.visualInspection.electricalSystem.limitStopper.status),
        electricalSystemLimitStopperTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.limitStopper.status),
        electricalSystemLimitStopperResult: data.visualInspection.electricalSystem.limitStopper.result,
        electricalSystemSocketFittingMemenuhi: getCheckmark(data.visualInspection.electricalSystem.socketFitting.status),
        electricalSystemSocketFittingTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.socketFitting.status),
        electricalSystemSocketFittingResult: data.visualInspection.electricalSystem.socketFitting.result,
        electricalSystemGroundingMemenuhi: getCheckmark(data.visualInspection.electricalSystem.grounding.status),
        electricalSystemGroundingTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.grounding.status),
        electricalSystemGroundingResult: data.visualInspection.electricalSystem.grounding.result,
        electricalSystemBreakerFuseMemenuhi: getCheckmark(data.visualInspection.electricalSystem.breakerFuse.status),
        electricalSystemBreakerFuseTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.breakerFuse.status),
        electricalSystemBreakerFuseResult: data.visualInspection.electricalSystem.breakerFuse.result,
        electricalSystemEmergencyStopMemenuhi: getCheckmark(data.visualInspection.electricalSystem.emergencyStop.status),
        electricalSystemEmergencyStopTidakMemenuhi: getCheckmark(!data.visualInspection.electricalSystem.emergencyStop.status),
        electricalSystemEmergencyStopResult: data.visualInspection.electricalSystem.emergencyStop.result,
        
        // Platform
        platformHoistMountFrameMemenuhi: getCheckmark(data.visualInspection.platform.hoistMountFrame.status),
        platformHoistMountFrameTidakMemenuhi: getCheckmark(!data.visualInspection.platform.hoistMountFrame.status),
        platformHoistMountFrameResult: data.visualInspection.platform.hoistMountFrame.result,
        platformFrameMemenuhi: getCheckmark(data.visualInspection.platform.frame.status),
        platformFrameTidakMemenuhi: getCheckmark(!data.visualInspection.platform.frame.status),
        platformFrameResult: data.visualInspection.platform.frame.result,
        platformBottomPlateMemenuhi: getCheckmark(data.visualInspection.platform.bottomPlate.status),
        platformBottomPlateTidakMemenuhi: getCheckmark(!data.visualInspection.platform.bottomPlate.status),
        platformBottomPlateResult: data.visualInspection.platform.bottomPlate.result,
        platformPinsAndBoltsMemenuhi: getCheckmark(data.visualInspection.platform.pinsAndBolts.status),
        platformPinsAndBoltsTidakMemenuhi: getCheckmark(!data.visualInspection.platform.pinsAndBolts.status),
        platformPinsAndBoltsResult: data.visualInspection.platform.pinsAndBolts.result,
        platformBracketMemenuhi: getCheckmark(data.visualInspection.platform.bracket.status),
        platformBracketTidakMemenuhi: getCheckmark(!data.visualInspection.platform.bracket.status),
        platformBracketResult: data.visualInspection.platform.bracket.result,
        platformToeBoardMemenuhi: getCheckmark(data.visualInspection.platform.toeBoard.status),
        platformToeBoardTidakMemenuhi: getCheckmark(!data.visualInspection.platform.toeBoard.status),
        platformToeBoardResult: data.visualInspection.platform.toeBoard.result,
        platformRollerAndGuidePulleyMemenuhi: getCheckmark(data.visualInspection.platform.rollerAndGuidePulley.status),
        platformRollerAndGuidePulleyTidakMemenuhi: getCheckmark(!data.visualInspection.platform.rollerAndGuidePulley.status),
        platformRollerAndGuidePulleyResult: data.visualInspection.platform.rollerAndGuidePulley.result,
        platformNamePlateMemenuhi: getCheckmark(data.visualInspection.platform.namePlate.status),
        platformNamePlateTidakMemenuhi: getCheckmark(!data.visualInspection.platform.namePlate.status),
        platformNamePlateResult: data.visualInspection.platform.namePlate.result,

        // Alat-Alat Pengaman
        safetyDevicesSafetyLockMemenuhi: getCheckmark(data.visualInspection.safetyDevices.safetyLock.status),
        safetyDevicesSafetyLockTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.safetyLock.status),
        safetyDevicesSafetyLockResult: data.visualInspection.safetyDevices.safetyLock.result,
        safetyDevicesRubberBumperMemenuhi: getCheckmark(data.visualInspection.safetyDevices.rubberBumper.status),
        safetyDevicesRubberBumperTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.rubberBumper.status),
        safetyDevicesRubberBumperResult: data.visualInspection.safetyDevices.rubberBumper.result,
        safetyDevicesSafetyLifeLineMemenuhi: getCheckmark(data.visualInspection.safetyDevices.safetyLifeLine.status),
        safetyDevicesSafetyLifeLineTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.safetyLifeLine.status),
        safetyDevicesSafetyLifeLineResult: data.visualInspection.safetyDevices.safetyLifeLine.result,
        safetyDevicesLoadLimitSwitchMemenuhi: getCheckmark(data.visualInspection.safetyDevices.loadLimitSwitch.status),
        safetyDevicesLoadLimitSwitchTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.loadLimitSwitch.status),
        safetyDevicesLoadLimitSwitchResult: data.visualInspection.safetyDevices.loadLimitSwitch.result,
        safetyDevicesLimitBlockMemenuhi: getCheckmark(data.visualInspection.safetyDevices.limitBlock.status),
        safetyDevicesLimitBlockTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.limitBlock.status),
        safetyDevicesLimitBlockResult: data.visualInspection.safetyDevices.limitBlock.result,
        safetyDevicesUpperLimitSwitchMemenuhi: getCheckmark(data.visualInspection.safetyDevices.upperLimitSwitch.status),
        safetyDevicesUpperLimitSwitchTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.upperLimitSwitch.status),
        safetyDevicesUpperLimitSwitchResult: data.visualInspection.safetyDevices.upperLimitSwitch.result,
        safetyDevicesBodyHarnessMemenuhi: getCheckmark(data.visualInspection.safetyDevices.bodyHarness.status),
        safetyDevicesBodyHarnessTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.bodyHarness.status),
        safetyDevicesBodyHarnessResult: data.visualInspection.safetyDevices.bodyHarness.result,
        safetyDevicesHarnessAnchorageMemenuhi: getCheckmark(data.visualInspection.safetyDevices.harnessAnchorage.status),
        safetyDevicesHarnessAnchorageTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.harnessAnchorage.status),
        safetyDevicesHarnessAnchorageResult: data.visualInspection.safetyDevices.harnessAnchorage.result,
        safetyDevicesCommunicationToolMemenuhi: getCheckmark(data.visualInspection.safetyDevices.communicationTool.status),
        safetyDevicesCommunicationToolTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.communicationTool.status),
        safetyDevicesCommunicationToolResult: data.visualInspection.safetyDevices.communicationTool.result,
        handyTalkieMemenuhi: getCheckmark(data.visualInspection.safetyDevices.handyTalkie.status),
        handyTalkieTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.handyTalkie.status),
        handyTalkieResult: data.visualInspection.safetyDevices.handyTalkie.result,
        safetyDevicesSafetyHelmetMemenuhi: getCheckmark(data.visualInspection.safetyDevices.safetyHelmet.status),
        safetyDevicesSafetyHelmetTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.safetyHelmet.status),
        safetyDevicesSafetyHelmetResult: data.visualInspection.safetyDevices.safetyHelmet.result,
        safetyDevicesHandRailMemenuhi: getCheckmark(data.visualInspection.safetyDevices.handRail.status),
        safetyDevicesHandRailTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.handRail.status),
        safetyDevicesHandRailResult: data.visualInspection.safetyDevices.handRail.result,
        safetyDevicesOtherPpeMemenuhi: getCheckmark(data.visualInspection.safetyDevices.otherPpe.status),
        safetyDevicesOtherPpeTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.otherPpe.status),
        safetyDevicesOtherPpeResult: data.visualInspection.safetyDevices.otherPpe.result,
        safetyDevicesCoupForGlassMemenuhi: getCheckmark(data.visualInspection.safetyDevices.coupForGlass.status),
        safetyDevicesCoupForGlassTidakMemenuhi: getCheckmark(!data.visualInspection.safetyDevices.coupForGlass.status),
        safetyDevicesCoupForGlassResult: data.visualInspection.safetyDevices.coupForGlass.result,

        // --- PEMERIKSAAN TIDAK MERUSAK (IV) ---
        nonDestructiveTestWireRopeItems: data.nonDestructiveTesting.steelCableRope.items.map(item => ({
            nonDestructiveTestWireRopeUsage: item.usage,
            nonDestructiveTestWireRopeSpecDiameter: item.specDiameter,
            nonDestructiveTestWireRopeActualDiameter: item.actualDiameter,
            nonDestructiveTestWireRopeConstruction: item.construction,
            nonDestructiveTestWireRopeType: item.type,
            nonDestructiveTestWireRopeLength: item.length,
            nonDestructiveTestWireRopeAge: item.age,
            nonDestructiveTestWireRopeDefectTrue: getCheckmark(item.defectFound),
            nonDestructiveTestWireRopeDefectFalse: getCheckmark(!item.defectFound),
            nonDestructiveTestWireRopeResult: item.result,
        })),
        nonDestructiveTestWireRopeNdtType: data.nonDestructiveTesting.steelCableRope.ndtType,

        suspensionStructureItems: data.nonDestructiveTesting.suspensionStructure.items.map(item => ({
            suspensionStructurePart: item.part,
            suspensionStructureLocation: item.location,
            suspensionStructureDefectTrue: getCheckmark(item.defectFound),
            suspensionStructureDefectFalse: getCheckmark(!item.defectFound),
            suspensionStructureResult: item.result
        })),
        suspensionStructureType: data.nonDestructiveTesting.suspensionStructure.ndtType,
        
        gondolaCageItems: data.nonDestructiveTesting.gondolaCage.items.map(item => ({
            gondolaCagePart: item.part,
            gondolaCageLocation: item.location,
            gondolaCageDefectTrue: getCheckmark(item.defectFound),
            gondolaCageDefectFalse: getCheckmark(!item.defectFound),
            gondolaCageResult: item.result
        })),
        gondolaCageType: data.nonDestructiveTesting.gondolaCage.ndtType,
        
        clamsItems: data.nonDestructiveTesting.clamps.items.map(item => ({
            clamsPartCheck: item.partCheck,
            partLocation: item.location,
            defectAda: getCheckmark(item.defectFound),
            defectTidakAda: getCheckmark(!item.defectFound),
            partResult: item.result
        })),

        // --- PENGUJIAN (V) ---
        dynamicLoadTestLoadItems: data.testing.dynamicLoadTest.items.map(item => ({
            dynamicLoadTestLoadPercentage: item.loadPercentage,
            dynamicLoadTestLoadDetails: item.loadDetails,
            dynamicLoadTestRemarks: item.remarks,
            dynamicLoadTestResult: item.result
        })),
        dynamicLoadTestNotOrHappensNote: data.testing.dynamicLoadTest.note,
        
        staticLoadTestLoadItems: data.testing.staticLoadTest.items.map(item => ({
            staticLoadTestLoadPercentage: item.loadPercentage,
            staticLoadTestLoadDetails: item.loadDetails,
            staticLoadTestRemarks: item.remarks,
            staticLoadTestResult: item.result
        })),
        staticLoadTestNotOrHappensNote: data.testing.staticLoadTest.note,
        
        // --- KESIMPULAN & SARAN ---
        conclusion: data.conclusion,
        recomendation: data.recommendation,
    };

    // Render dokumen dengan data
    doc.render(renderData);

    // Hasilkan buffer dokumen
    const docxBuffer = doc.getZip().generate({ 
        type: 'nodebuffer', 
        compression: 'DEFLATE' 
    });
    
    // Buat nama file yang aman
    const ownerName = (data.generalData.ownerName || 'UnknownOwner').replace(/[^\w\s.-]/g, '');
    const safeOwnerName = ownerName.replace(/\s+/g, '_');
    const fileName = `Laporan-Gondola-${safeOwnerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanGondola,
};