'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../../config');

// Inisialisasi koneksi ke Google Cloud Storage
let privateKey = config.FIRESTORE_PRIVATE_KEY;
if (privateKey && privateKey.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: {
      client_email: config.FIRESTORE_CLIENT_EMAIL,
      private_key: privateKey,
    },
});

const BUCKET_NAME = 'tamplate-audit-riksauji'; // Nama bucket yang benar

// =================================================================================
// FUNGSI BANTUAN
// =================================================================================

/**
 * Membuat simbol centang (✓) jika statusnya true.
 * @param {boolean} status
 * @returns {string} '✓' atau string kosong
 */
function getCheckmark(status) {
    if (status === true) return '✓';
    return '';
}

/**
 * Membuat simbol centang (✓) jika statusnya false.
 * @param {boolean} status
 * @returns {string} '✓' atau string kosong
 */
function getOppositeCheckmark(status) {
    if (status === false) return '✓';
    return '';
}

// =================================================================================
// FUNGSI GENERATOR UTAMA
// =================================================================================

/**
 * Membuat dokumen laporan eskalator dari template di GCS.
 * @param {object} data - Objek data audit eskalator lengkap dari Firestore.
 * @returns {Promise<{docxBuffer: Buffer, fileName: string}>} Buffer dokumen dan nama filenya.
 */
const createLaporanEskalator = async (data) => {
    const templatePathInBucket = 'elevatorEskalator/eskalator/laporanEskalator.docx';

    let content;
    try {
        console.log(`Mengunduh template: gs://${BUCKET_NAME}/${templatePathInBucket}`);
        const [fileBuffer] = await storage.bucket(BUCKET_NAME).file(templatePathInBucket).download();
        content = fileBuffer;
        console.log('Template laporan eskalator berhasil diunduh.');
    } catch (error) {
        console.error(`Gagal mengunduh template eskalator dari GCS:`, error);
        throw new Error('Template dokumen eskalator tidak dapat diakses dari Cloud Storage.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => "", // Ganti tag yang tidak ada datanya dengan string kosong
    });

    // =================================================================================
    // PERSIAPAN DATA UNTUK RENDER
    // =================================================================================

    // Membuat alias untuk objek 'inspectionAndTesting' agar lebih ringkas dan aman
    const i = data.inspectionAndTesting || {};

    // Siapkan data untuk dirender ke dalam template.
    // Nama key di sini HARUS SAMA PERSIS dengan placeholder di file .docx Anda.
    const renderData = {
        // Data Umum (diambil dari objek 'generalData')
        ...data.generalData,
        equipmentType: data.equipmentType,
        inspectionType: data.inspectionType,
        
        // Data Teknis (tetap sama)
        ...data.technicalData,

        // --- PEMERIKSAAN DAN PENGUJIAN ---
        
        // A. KERANGKA, RUANG MESIN & PIT
        inspectionAndTestingframeAndMachineRoomframeresult: i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoomframeresult?.result,
        inspectionAndTestingframeAndMachineRoomframeMemenuhi: getCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoomframeresult?.status),
        inspectionAndTestingframeAndMachineRoomframeTidakMemenuhi: getOppositeCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoomframeresult?.status),
        
        'inspectionAndTestingframeAndMachineRoomsupportBeams iresults': i.inspectionAndTestingframeAndMachineRoom?.['inspectionAndTestingframeAndMachineRoomsupportBeams iresults']?.result,
        'inspectionAndTestingframeAndMachineRoomsupportBeamsMemenuhi': getCheckmark(i.inspectionAndTestingframeAndMachineRoom?.['inspectionAndTestingframeAndMachineRoomsupportBeams iresults']?.status),
        'inspectionAndTestingframeAndMachineRoomsupportBeamsTidakMemenuhi': getOppositeCheckmark(i.inspectionAndTestingframeAndMachineRoom?.['inspectionAndTestingframeAndMachineRoomsupportBeams iresults']?.status),

        inspectionAndTestingframeAndMachineRoommachineRoomConditionresult: i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomConditionresult?.result,
        inspectionAndTestingframeAndMachineRoommachineRoomConditionMemenuhi: getCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomConditionresult?.status),
        inspectionAndTestingframeAndMachineRoommachineRoomConditionTidakMemenuhi: getOppositeCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomConditionresult?.status),
        
        inspectionAndTestingframeAndMachineRoommachineRoomClearanceresult: i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomClearanceresult?.result,
        inspectionAndTestingframeAndMachineRoommachineRoomClearanceMemenuhi: getCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomClearanceresult?.status),
        inspectionAndTestingframeAndMachineRoommachineRoomClearanceTidakMemenuhi: getOppositeCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomClearanceresult?.status),
        
        inspectionAndTestingframeAndMachineRoommachineRoomLightingresult: i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomLightingresult?.result,
        inspectionAndTestingframeAndMachineRoommachineRoomLightingMemenuhi: getCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomLightingresult?.status),
        inspectionAndTestingframeAndMachineRoommachineRoomLightingTidakMemenuhi: getOppositeCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomLightingresult?.status),
        
        inspectionAndTestingframeAndMachineRoommachineCoverPlateresult: i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineCoverPlateresult?.result,
        inspectionAndTestingframeAndMachineRoommachineCoverPlateMemenuhi: getCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineCoverPlateresult?.status),
        inspectionAndTestingframeAndMachineRoommachineCoverPlateTidakMemenuhi: getOppositeCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineCoverPlateresult?.status),
        
        inspectionAndTestingframeAndMachineRoompitConditionresult: i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitConditionresult?.result,
        inspectionAndTestingframeAndMachineRoompitConditionMemenuhi: getCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitConditionresult?.status),
        inspectionAndTestingframeAndMachineRoompitConditionTidakMemenuhi: getOppositeCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitConditionresult?.status),
        
        inspectionAndTestingframeAndMachineRoompitClearanceresult: i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitClearanceresult?.result,
        inspectionAndTestingframeAndMachineRoompitClearanceMemenuhi: getCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitClearanceresult?.status),
        inspectionAndTestingframeAndMachineRoompitClearanceTidakMemenuhi: getOppositeCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitClearanceresult?.status),

        inspectionAndTestingframeAndMachineRoompitStepCoverPlateresult: i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitStepCoverPlateresult?.result,
        inspectionAndTestingframeAndMachineRoompitStepCoverPlateMemenuhi: getCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitStepCoverPlateresult?.status),
        inspectionAndTestingframeAndMachineRoompitStepCoverPlateTidakMemenuhi: getOppositeCheckmark(i.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitStepCoverPlateresult?.status),

        // B. PERLENGKAPAN PENGGERAK
        driveEquipmentdriveMachineresult: i.driveEquipment?.driveEquipmentdriveMachineresult?.result,
        driveEquipmentdriveMachineMemenuhi: getCheckmark(i.driveEquipment?.driveEquipmentdriveMachineresult?.status),
        driveEquipmentdriveMachineTidakMemenuhi: getOppositeCheckmark(i.driveEquipment?.driveEquipmentdriveMachineresult?.status),

        driveEquipmentspeedUnder30Degreesresult: i.driveEquipment?.driveEquipmentspeedUnder30Degreesresult?.result,
        driveEquipmentspeedUnder30DegreesMemenuhi: getCheckmark(i.driveEquipment?.driveEquipmentspeedUnder30Degreesresult?.status),
        driveEquipmentspeedUnder30DegreesTidakMemenuhi: getOppositeCheckmark(i.driveEquipment?.driveEquipmentspeedUnder30Degreesresult?.status),
        
        driveEquipmentspeed30to35Degreesresult: i.driveEquipment?.driveEquipmentspeed30to35Degreesresult?.result,
        driveEquipmentspeed30to35DegreesMemenuhi: getCheckmark(i.driveEquipment?.driveEquipmentspeed30to35Degreesresult?.status),
        driveEquipmentspeed30to35DegreesTidakMemenuhi: getOppositeCheckmark(i.driveEquipment?.driveEquipmentspeed30to35Degreesresult?.status),

        driveEquipmenttravelatorSpeedresult: i.driveEquipment?.driveEquipmenttravelatorSpeedresult?.result,
        driveEquipmenttravelatorSpeedMemenuhi: getCheckmark(i.driveEquipment?.driveEquipmenttravelatorSpeedresult?.status),
        driveEquipmenttravelatorSpeedTidakMemenuhi: getOppositeCheckmark(i.driveEquipment?.driveEquipmenttravelatorSpeedresult?.status),

        driveEquipmentstoppingDistance0_5result: i.driveEquipment?.driveEquipmentstoppingDistance0_5result?.result,
        driveEquipmentstoppingDistance0_5Memenuhi: getCheckmark(i.driveEquipment?.driveEquipmentstoppingDistance0_5result?.status),
        driveEquipmentstoppingDistance0_5TidakMemenuhi: getOppositeCheckmark(i.driveEquipment?.driveEquipmentstoppingDistance0_5result?.status),

        driveEquipmentstoppingDistance0_75result: i.driveEquipment?.driveEquipmentstoppingDistance0_75result?.result,
        driveEquipmentstoppingDistance0_75Memenuhi: getCheckmark(i.driveEquipment?.driveEquipmentstoppingDistance0_75result?.status),
        driveEquipmentstoppingDistance0_75TidakMemenuhi: getOppositeCheckmark(i.driveEquipment?.driveEquipmentstoppingDistance0_75result?.status),

        driveEquipmentstoppingDistance0_90result: i.driveEquipment?.driveEquipmentstoppingDistance0_90result?.result,
        driveEquipmentstoppingDistance0_90Memenuhi: getCheckmark(i.driveEquipment?.driveEquipmentstoppingDistance0_90result?.status),
        driveEquipmentstoppingDistance0_90TidakMemenuhi: getOppositeCheckmark(i.driveEquipment?.driveEquipmentstoppingDistance0_90result?.status),

        driveEquipmentdriveChainresult: i.driveEquipment?.driveEquipmentdriveChainresult?.result,
        driveEquipmentdriveChainMemenuhi: getCheckmark(i.driveEquipment?.driveEquipmentdriveChainresult?.status),
        driveEquipmentdriveChainTidakMemenuhi: getOppositeCheckmark(i.driveEquipment?.driveEquipmentdriveChainresult?.status),

        driveEquipmentchainBreakingStrengthresult: i.driveEquipment?.driveEquipmentchainBreakingStrengthresult?.result,
        driveEquipmentchainBreakingStrengthMemenuhi: getCheckmark(i.driveEquipment?.driveEquipmentchainBreakingStrengthresult?.status),
        driveEquipmentchainBreakingStrengthTidakMemenuhi: getOppositeCheckmark(i.driveEquipment?.driveEquipmentchainBreakingStrengthresult?.status),

        // C. ANAK TANGGA / PALLET
        stepsOrPalletsstepMaterialresult: i.stepsOrPallets?.stepsOrPalletsstepMaterialresult?.result,
        stepsOrPalletsstepMaterialMemenuhi: getCheckmark(i.stepsOrPallets?.stepsOrPalletsstepMaterialresult?.status),
        stepsOrPalletsstepMaterialTidakMemenuhi: getOppositeCheckmark(i.stepsOrPallets?.stepsOrPalletsstepMaterialresult?.status),

        stepsOrPalletsstepDimensionsresult: i.stepsOrPallets?.stepsOrPalletsstepDimensionsresult?.result,
        stepsOrPalletsstepDimensionsMemenuhi: getCheckmark(i.stepsOrPallets?.stepsOrPalletsstepDimensionsresult?.status),
        stepsOrPalletsstepDimensionsTidakMemenuhi: getOppositeCheckmark(i.stepsOrPallets?.stepsOrPalletsstepDimensionsresult?.status),

        stepsOrPalletspalletDimensionsresult: i.stepsOrPallets?.stepsOrPalletspalletDimensionsresult?.result,
        stepsOrPalletspalletDimensionsMemenuhi: getCheckmark(i.stepsOrPallets?.stepsOrPalletspalletDimensionsresult?.status),
        stepsOrPalletspalletDimensionsTidakMemenuhi: getOppositeCheckmark(i.stepsOrPallets?.stepsOrPalletspalletDimensionsresult?.status),

        stepsOrPalletsstepSurfaceresult: i.stepsOrPallets?.stepsOrPalletsstepSurfaceresult?.result,
        stepsOrPalletsstepSurfaceMemenuhi: getCheckmark(i.stepsOrPallets?.stepsOrPalletsstepSurfaceresult?.status),
        stepsOrPalletsstepSurfaceTidakMemenuhi: getOppositeCheckmark(i.stepsOrPallets?.stepsOrPalletsstepSurfaceresult?.status),

        stepsOrPalletsstepLevelnessresult: i.stepsOrPallets?.stepsOrPalletsstepLevelnessresult?.result,
        stepsOrPalletsstepLevelnessMemenuhi: getCheckmark(i.stepsOrPallets?.stepsOrPalletsstepLevelnessresult?.status),
        stepsOrPalletsstepLevelnessTidakMemenuhi: getOppositeCheckmark(i.stepsOrPallets?.stepsOrPalletsstepLevelnessresult?.status),

        stepsOrPalletsskirtBrushresult: i.stepsOrPallets?.stepsOrPalletsskirtBrushresult?.result,
        stepsOrPalletsskirtBrushMemenuhi: getCheckmark(i.stepsOrPallets?.stepsOrPalletsskirtBrushresult?.status),
        stepsOrPalletsskirtBrushTidakMemenuhi: getOppositeCheckmark(i.stepsOrPallets?.stepsOrPalletsskirtBrushresult?.status),

        stepsOrPalletsstepWheelsresult: i.stepsOrPallets?.stepsOrPalletsstepWheelsresult?.result,
        stepsOrPalletsstepWheelsMemenuhi: getCheckmark(i.stepsOrPallets?.stepsOrPalletsstepWheelsresult?.status),
        stepsOrPalletsstepWheelsTidakMemenuhi: getOppositeCheckmark(i.stepsOrPallets?.stepsOrPalletsstepWheelsresult?.status),
        
        // D. DAERAH PENDARATAN
        landingArealandingPlatesresult: i.landingArea?.landingArealandingPlatesresult?.result,
        landingArealandingPlatesMemenuhi: getCheckmark(i.landingArea?.landingArealandingPlatesresult?.status),
        landingArealandingPlatesTidakMemenuhi: getOppositeCheckmark(i.landingArea?.landingArealandingPlatesresult?.status),

        landingAreacombTeethresult: i.landingArea?.landingAreacombTeethresult?.result,
        landingAreacombTeethMemenuhi: getCheckmark(i.landingArea?.landingAreacombTeethresult?.status),
        landingAreacombTeethTidakMemenuhi: getOppositeCheckmark(i.landingArea?.landingAreacombTeethresult?.status),

        landingAreacombConditionresult: i.landingArea?.landingAreacombConditionresult?.result,
        landingAreacombConditionMemenuhi: getCheckmark(i.landingArea?.landingAreacombConditionresult?.status),
        landingAreacombConditionTidakMemenuhi: getOppositeCheckmark(i.landingArea?.landingAreacombConditionresult?.status),

        landingArealandingCoverresult: i.landingArea?.landingArealandingCoverresult?.result,
        landingArealandingCoverMemenuhi: getCheckmark(i.landingArea?.landingArealandingCoverresult?.status),
        landingArealandingCoverTidakMemenuhi: getOppositeCheckmark(i.landingArea?.landingArealandingCoverresult?.status),
        
        landingArealandingAccessArearesult: i.landingArea?.landingArealandingAccessArearesult?.result,
        landingArealandingAccessAreaMemenuhi: getCheckmark(i.landingArea?.landingArealandingAccessArearesult?.status),
        landingArealandingAccessAreaTidakMemenuhi: getOppositeCheckmark(i.landingArea?.landingArealandingAccessArearesult?.status),

        // E. BALUSTRADE
        balustradebalustradePanelmaterialresult: i.balustrade?.balustradebalustradePanelmaterialresult?.result,
        balustradebalustradePanelmaterialMemenuhi: getCheckmark(i.balustrade?.balustradebalustradePanelmaterialresult?.status),
        balustradebalustradePanelmaterialTidakMemenuhi: getOppositeCheckmark(i.balustrade?.balustradebalustradePanelmaterialresult?.status),

        balustradebalustradePanelheightresult: i.balustrade?.balustradebalustradePanelheightresult?.result,
        balustradebalustradePanelheightMemenuhi: getCheckmark(i.balustrade?.balustradebalustradePanelheightresult?.status),
        balustradebalustradePanelheightTidakMemenuhi: getOppositeCheckmark(i.balustrade?.balustradebalustradePanelheightresult?.status),

        balustradebalustradePanelsidePressureresult: i.balustrade?.balustradebalustradePanelsidePressureresult?.result,
        balustradebalustradePanelsidePressureMemenuhi: getCheckmark(i.balustrade?.balustradebalustradePanelsidePressureresult?.status),
        balustradebalustradePanelsidePressureTidakMemenuhi: getOppositeCheckmark(i.balustrade?.balustradebalustradePanelsidePressureresult?.status),

        balustradebalustradePanelverticalPressureresult: i.balustrade?.balustradebalustradePanelverticalPressureresult?.result,
        balustradebalustradePanelverticalPressureMemenuhi: getCheckmark(i.balustrade?.balustradebalustradePanelverticalPressureresult?.status),
        balustradebalustradePanelverticalPressureTidakMemenuhi: getOppositeCheckmark(i.balustrade?.balustradebalustradePanelverticalPressureresult?.status),

        balustradeskirtPanelresult: i.balustrade?.balustradeskirtPanelresult?.result,
        balustradeskirtPanelMemenuhi: getCheckmark(i.balustrade?.balustradeskirtPanelresult?.status),
        balustradeskirtPanelTidakMemenuhi: getOppositeCheckmark(i.balustrade?.balustradeskirtPanelresult?.status),

        balustradeskirtPanelFlexibilityresult: i.balustrade?.balustradeskirtPanelFlexibilityresult?.result,
        balustradeskirtPanelFlexibilityMemenuhi: getCheckmark(i.balustrade?.balustradeskirtPanelFlexibilityresult?.status),
        balustradeskirtPanelFlexibilityTidakMemenuhi: getOppositeCheckmark(i.balustrade?.balustradeskirtPanelFlexibilityresult?.status),
        
        balustradestepToSkirtClearanceresult: i.balustrade?.balustradestepToSkirtClearanceresult?.result,
        balustradestepToSkirtClearanceMemenuhi: getCheckmark(i.balustrade?.balustradestepToSkirtClearanceresult?.status),
        balustradestepToSkirtClearanceTidakMemenuhi: getOppositeCheckmark(i.balustrade?.balustradestepToSkirtClearanceresult?.status),

        // F. BAN PEGANGAN (HANDRAIL)
        handrailhandrailConditionresult: i.handrail?.handrailhandrailConditionresult?.result,
        handrailhandrailConditionMemenuhi: getCheckmark(i.handrail?.handrailhandrailConditionresult?.status),
        handrailhandrailConditionTidakMemenuhi: getOppositeCheckmark(i.handrail?.handrailhandrailConditionresult?.status),
        
        handrailhandrailSpeedSynchronizationresult: i.handrail?.handrailhandrailSpeedSynchronizationresult?.result,
        handrailhandrailSpeedSynchronizationMemenuhi: getCheckmark(i.handrail?.handrailhandrailSpeedSynchronizationresult?.status),
        handrailhandrailSpeedSynchronizationTidakMemenuhi: getOppositeCheckmark(i.handrail?.handrailhandrailSpeedSynchronizationresult?.status),
        
        handrailhandrailWidthresult: i.handrail?.handrailhandrailWidthresult?.result,
        handrailhandrailWidthMemenuhi: getCheckmark(i.handrail?.handrailhandrailWidthresult?.status),
        handrailhandrailWidthTidakMemenuhi: getOppositeCheckmark(i.handrail?.handrailhandrailWidthresult?.status),

        // G. LINTASAN
        runwaybeamStrengthAndPositionresult: i.runway?.runwaybeamStrengthAndPositionresult?.result,
        runwaybeamStrengthAndPositionMemenuhi: getCheckmark(i.runway?.runwaybeamStrengthAndPositionresult?.status),
        runwaybeamStrengthAndPositionTidakMemenuhi: getOppositeCheckmark(i.runway?.runwaybeamStrengthAndPositionresult?.status),
        
        runwaypitWallConditionresult: i.runway?.runwaypitWallConditionresult?.result,
        runwaypitWallConditionMemenuhi: getCheckmark(i.runway?.runwaypitWallConditionresult?.status),
        runwaypitWallConditionTidakMemenuhi: getOppositeCheckmark(i.runway?.runwaypitWallConditionresult?.status),
        
        runwayescalatorFrameEnclosureresult: i.runway?.runwayescalatorFrameEnclosureresult?.result,
        runwayescalatorFrameEnclosureMemenuhi: getCheckmark(i.runway?.runwayescalatorFrameEnclosureresult?.status),
        runwayescalatorFrameEnclosureTidakMemenuhi: getOppositeCheckmark(i.runway?.runwayescalatorFrameEnclosureresult?.status),
        
        runwaylightingresult: i.runway?.runwaylightingresult?.result,
        runwaylightingMemenuhi: getCheckmark(i.runway?.runwaylightingresult?.status),
        runwaylightingTidakMemenuhi: getOppositeCheckmark(i.runway?.runwaylightingresult?.status),
        
        runwayheadroomClearanceresult: i.runway?.runwayheadroomClearanceresult?.result,
        runwayheadroomClearanceMemenuhi: getCheckmark(i.runway?.runwayheadroomClearanceresult?.status),
        runwayheadroomClearanceTidakMemenuhi: getOppositeCheckmark(i.runway?.runwayheadroomClearanceresult?.status),
        
        runwaybalustradeToObjectClearanceresult: i.runway?.runwaybalustradeToObjectClearanceresult?.result,
        runwaybalustradeToObjectClearanceMemenuhi: getCheckmark(i.runway?.runwaybalustradeToObjectClearanceresult?.status),
        runwaybalustradeToObjectClearanceTidakMemenuhi: getOppositeCheckmark(i.runway?.runwaybalustradeToObjectClearanceresult?.status),

        runwayantiClimbDeviceHeightresult: i.runway?.runwayantiClimbDeviceHeightresult?.result,
        runwayantiClimbDeviceHeightMemenuhi: getCheckmark(i.runway?.runwayantiClimbDeviceHeightresult?.status),
        runwayantiClimbDeviceHeightTidakMemenuhi: getOppositeCheckmark(i.runway?.runwayantiClimbDeviceHeightresult?.status),

        runwayornamentPlacementresult: i.runway?.runwayornamentPlacementresult?.result,
        runwayornamentPlacementMemenuhi: getCheckmark(i.runway?.runwayornamentPlacementresult?.status),
        runwayornamentPlacementTidakMemenuhi: getOppositeCheckmark(i.runway?.runwayornamentPlacementresult?.status),
        
        runwayoutdoorClearanceresult: i.runway?.runwayoutdoorClearanceresult?.result,
        runwayoutdoorClearanceMemenuhi: getCheckmark(i.runway?.runwayoutdoorClearanceresult?.status),
        runwayoutdoorClearanceTidakMemenuhi: getOppositeCheckmark(i.runway?.runwayoutdoorClearanceresult?.status),

        // H. PERLENGKAPAN PENGAMAN
        safetyEquipmentoperationControlKeyresult: i.safetyEquipment?.safetyEquipmentoperationControlKeyresult?.result,
        safetyEquipmentoperationControlKeyMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmentoperationControlKeyresult?.status),
        safetyEquipmentoperationControlKeyTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmentoperationControlKeyresult?.status),
        
        safetyEquipmentemergencyStopSwitchresult: i.safetyEquipment?.safetyEquipmentemergencyStopSwitchresult?.result,
        safetyEquipmentemergencyStopSwitchMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmentemergencyStopSwitchresult?.status),
        safetyEquipmentemergencyStopSwitchTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmentemergencyStopSwitchresult?.status),
        
        safetyEquipmentstepChainSafetyDeviceresult: i.safetyEquipment?.safetyEquipmentstepChainSafetyDeviceresult?.result,
        safetyEquipmentstepChainSafetyDeviceMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmentstepChainSafetyDeviceresult?.status),
        safetyEquipmentstepChainSafetyDeviceTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmentstepChainSafetyDeviceresult?.status),
        
        safetyEquipmentdriveChainSafetyDeviceresult: i.safetyEquipment?.safetyEquipmentdriveChainSafetyDeviceresult?.result,
        safetyEquipmentdriveChainSafetyDeviceMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmentdriveChainSafetyDeviceresult?.status),
        safetyEquipmentdriveChainSafetyDeviceTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmentdriveChainSafetyDeviceresult?.status),
        
        safetyEquipmentstepSafetyDeviceresult: i.safetyEquipment?.safetyEquipmentstepSafetyDeviceresult?.result,
        safetyEquipmentstepSafetyDeviceMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmentstepSafetyDeviceresult?.status),
        safetyEquipmentstepSafetyDeviceTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmentstepSafetyDeviceresult?.status),
        
        safetyEquipmenthandrailSafetyDeviceresult: i.safetyEquipment?.safetyEquipmenthandrailSafetyDeviceresult?.result,
        safetyEquipmenthandrailSafetyDeviceMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmenthandrailSafetyDeviceresult?.status),
        safetyEquipmenthandrailSafetyDeviceTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmenthandrailSafetyDeviceresult?.status),
        
        safetyEquipmentreversalStopDeviceresult: i.safetyEquipment?.safetyEquipmentreversalStopDeviceresult?.result,
        safetyEquipmentreversalStopDeviceMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmentreversalStopDeviceresult?.status),
        safetyEquipmentreversalStopDeviceTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmentreversalStopDeviceresult?.status),
        
        safetyEquipmenthandrailEntryGuardresult: i.safetyEquipment?.safetyEquipmenthandrailEntryGuardresult?.result,
        safetyEquipmenthandrailEntryGuardMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmenthandrailEntryGuardresult?.status),
        safetyEquipmenthandrailEntryGuardTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmenthandrailEntryGuardresult?.status),
        
        safetyEquipmentcombPlateSafetyDeviceresult: i.safetyEquipment?.safetyEquipmentcombPlateSafetyDeviceresult?.result,
        safetyEquipmentcombPlateSafetyDeviceMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmentcombPlateSafetyDeviceresult?.status),
        safetyEquipmentcombPlateSafetyDeviceTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmentcombPlateSafetyDeviceresult?.status),

        safetyEquipmentinnerDeckingBrushresult: i.safetyEquipment?.safetyEquipmentinnerDeckingBrushresult?.result,
        safetyEquipmentinnerDeckingBrushMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmentinnerDeckingBrushresult?.status),
        safetyEquipmentinnerDeckingBrushTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmentinnerDeckingBrushresult?.status),
        
        safetyEquipmentstopButtonsresult: i.safetyEquipment?.safetyEquipmentstopButtonsresult?.result,
        safetyEquipmentstopButtonsMemenuhi: getCheckmark(i.safetyEquipment?.safetyEquipmentstopButtonsresult?.status),
        safetyEquipmentstopButtonsTidakMemenuhi: getOppositeCheckmark(i.safetyEquipment?.safetyEquipmentstopButtonsresult?.status),

        // I. INSTALASI LISTRIK
        electricalInstallationinstallationStandardresult: i.electricalInstallation?.electricalInstallationinstallationStandardresult?.result,
        electricalInstallationinstallationStandardMemenuhi: getCheckmark(i.electricalInstallation?.electricalInstallationinstallationStandardresult?.status),
        electricalInstallationinstallationStandardTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.electricalInstallationinstallationStandardresult?.status),
        
        electricalInstallationelectricalPanelresult: i.electricalInstallation?.electricalInstallationelectricalPanelresult?.result,
        electricalInstallationelectricalPanelMemenuhi: getCheckmark(i.electricalInstallation?.electricalInstallationelectricalPanelresult?.status),
        electricalInstallationelectricalPanelTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.electricalInstallationelectricalPanelresult?.status),
        
        electricalInstallationgroundingCableresult: i.electricalInstallation?.electricalInstallationgroundingCableresult?.result,
        electricalInstallationgroundingCableMemenuhi: getCheckmark(i.electricalInstallation?.electricalInstallationgroundingCableresult?.status),
        electricalInstallationgroundingCableTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.electricalInstallationgroundingCableresult?.status),

        electricalInstallationfireAlarmConnectionresult: i.electricalInstallation?.electricalInstallationfireAlarmConnectionresult?.result,
        electricalInstallationfireAlarmConnectionMemenuhi: getCheckmark(i.electricalInstallation?.electricalInstallationfireAlarmConnectionresult?.status),
        electricalInstallationfireAlarmConnectionTidakMemenuhi: getOppositeCheckmark(i.electricalInstallation?.electricalInstallationfireAlarmConnectionresult?.status),
        
        // J. KHUSUS UNTUK PEMASANGAN DI LUAR GEDUNG
        outdoorSpecificspitWaterPumpresult: i.outdoorSpecifics?.outdoorSpecificspitWaterPumpresult?.result,
        outdoorSpecificspitWaterPumpMemenuhi: getCheckmark(i.outdoorSpecifics?.outdoorSpecificspitWaterPumpresult?.status),
        outdoorSpecificspitWaterPumpTidakMemenuhi: getOppositeCheckmark(i.outdoorSpecifics?.outdoorSpecificspitWaterPumpresult?.status),

        outdoorSpecificsweatherproofComponentsresult: i.outdoorSpecifics?.outdoorSpecificsweatherproofComponentsresult?.result,
        outdoorSpecificsweatherproofComponentsMemenuhi: getCheckmark(i.outdoorSpecifics?.outdoorSpecificsweatherproofComponentsresult?.status),
        outdoorSpecificsweatherproofComponentsTidakMemenuhi: getOppositeCheckmark(i.outdoorSpecifics?.outdoorSpecificsweatherproofComponentsresult?.status),
        
        // K. PENGAMAN PENGGUNA
        userSafetySignagenoBulkyItemsresult: i.userSafety?.userSafetySignagenoBulkyItemsresult?.result,
        userSafetySignagenoBulkyItemsMemenuhi: getCheckmark(i.userSafety?.userSafetySignagenoBulkyItemsresult?.status),
        userSafetySignagenoBulkyItemsTidakMemenuhi: getOppositeCheckmark(i.userSafety?.userSafetySignagenoBulkyItemsresult?.status),

        userSafetySignagenoJumpingresult: i.userSafety?.userSafetySignagenoJumpingresult?.result,
        userSafetySignagenoJumpingMemenuhi: getCheckmark(i.userSafety?.userSafetySignagenoJumpingresult?.status),
        userSafetySignagenoJumpingTidakMemenuhi: getOppositeCheckmark(i.userSafety?.userSafetySignagenoJumpingresult?.status),
        
        userSafetySignageunattendedChildrenresult: i.userSafety?.userSafetySignageunattendedChildrenresult?.result,
        userSafetySignageunattendedChildrenMemenuhi: getCheckmark(i.userSafety?.userSafetySignageunattendedChildrenresult?.status),
        userSafetySignageunattendedChildrenTidakMemenuhi: getOppositeCheckmark(i.userSafety?.userSafetySignageunattendedChildrenresult?.status),
        
        userSafetySignagenoTrolleysOrStrollersresult: i.userSafety?.userSafetySignagenoTrolleysOrStrollersresult?.result,
        userSafetySignagenoTrolleysOrStrollersMemenuhi: getCheckmark(i.userSafety?.userSafetySignagenoTrolleysOrStrollersresult?.status),
        userSafetySignagenoTrolleysOrStrollersTidakMemenuhi: getOppositeCheckmark(i.userSafety?.userSafetySignagenoTrolleysOrStrollersresult?.status),
        
        userSafetySignagenoLeaningresult: i.userSafety?.userSafetySignagenoLeaningresult?.result,
        userSafetySignagenoLeaningMemenuhi: getCheckmark(i.userSafety?.userSafetySignagenoLeaningresult?.status),
        userSafetySignagenoLeaningTidakMemenuhi: getOppositeCheckmark(i.userSafety?.userSafetySignagenoLeaningresult?.status),
        
        userSafetySignagenoSteppingOnSkirtresult: i.userSafety?.userSafetySignagenoSteppingOnSkirtresult?.result,
        userSafetySignagenoSteppingOnSkirtMemenuhi: getCheckmark(i.userSafety?.userSafetySignagenoSteppingOnSkirtresult?.status),
        userSafetySignagenoSteppingOnSkirtTidakMemenuhi: getOppositeCheckmark(i.userSafety?.userSafetySignagenoSteppingOnSkirtresult?.status),

        userSafetySignagesoftSoleFootwearWarningresult: i.userSafety?.userSafetySignagesoftSoleFootwearWarningresult?.result,
        userSafetySignagesoftSoleFootwearWarningMemenuhi: getCheckmark(i.userSafety?.userSafetySignagesoftSoleFootwearWarningresult?.status),
        userSafetySignagesoftSoleFootwearWarningTidakMemenuhi: getOppositeCheckmark(i.userSafety?.userSafetySignagesoftSoleFootwearWarningresult?.status),

        userSafetySignagenoSittingOnStepsresult: i.userSafety?.userSafetySignagenoSittingOnStepsresult?.result,
        userSafetySignagenoSittingOnStepsMemenuhi: getCheckmark(i.userSafety?.userSafetySignagenoSittingOnStepsresult?.status),
        userSafetySignagenoSittingOnStepsTidakMemenuhi: getOppositeCheckmark(i.userSafety?.userSafetySignagenoSittingOnStepsresult?.status),

        userSafetySignageholdHandrailresult: i.userSafety?.userSafetySignageholdHandrailresult?.result,
        userSafetySignageholdHandrailMemenuhi: getCheckmark(i.userSafety?.userSafetySignageholdHandrailresult?.status),
        userSafetySignageholdHandrailTidakMemenuhi: getOppositeCheckmark(i.userSafety?.userSafetySignageholdHandrailresult?.status),

        // Kesimpulan
        testingEscalator: data.testingEscalator,
        conclusion: data.conclusion,
    };

    try {
        doc.render(renderData);
    } catch (error) {
        console.error("GAGAL RENDER DOKUMEN ESKALATOR:", error.message);
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

    // Membuat nama file yang dinamis dan aman
    const ownerName = data.generalData?.ownerName?.replace(/\s+/g, '-') || 'UnknownOwner';
    const fileName = `Laporan-Eskalator-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanEskalator,
};