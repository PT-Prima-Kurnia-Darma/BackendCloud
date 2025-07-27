'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { storage, BUCKET_NAME } = require('../../../../../utils/storage');

// Fungsi helper untuk memformat data ke dalam template
const getCheckmark = (status) => (status === true ? '√' : '');
const getOppositeCheckmark = (status) => (status === false ? '√' : '');
const getResultText = (item) => (item && item.result ? item.result : '');
const getRemarksText = (item) => (item && item.remarks ? item.remarks : '');

/**
 * Membuat dokumen laporan PTP Motor Diesel dari data yang diberikan.
 * @param {object} data - Data dari body.json yang berisi detail inspeksi.
 * @returns {Promise<{docxBuffer: Buffer, fileName: string}>} Buffer DOCX dan nama file.
 */
const createLaporanPtpDiesel = async (data) => {
    const templatePath = 'ptp/motorDiesel/laporanPtpDiesel.docx';

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
        nullGetter: () => "", // Mengembalikan string kosong jika data tidak ada
    });

    // Destrukturisasi data untuk kemudahan akses
    const g = data.generalData || {};
    const t = data.technicalData || {};
    const v = data.visualChecks || {};
    const tests = data.tests || {};
    const elec = data.electricalComponents || {};
    const mcb = data.mcbCalculation || {};
    const noise = data.noiseMeasurement || {};
    const light = data.lightingMeasurement || {};

    // Memetakan data JSON ke placeholder di DOCX SECARA MANUAL
    const renderData = {
        // DATA UMUM
        examinationType: data.examinationType,
        subInspectionType: data.subInspectionType,
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

        // DATA TEKNIK
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

        // PEMERIKSAAN VISUAL - KONSTRUKSI DASAR
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

        // PEMERIKSAAN VISUAL - STRUKTUR KONSTRUKSI
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

        // PEMERIKSAAN VISUAL - SISTEM PELUMASAN
        visualCheckLubeOilTrue: getCheckmark(v.lubricationSystem?.oil?.status),
        visualCheckLubeOilFalse: getOppositeCheckmark(v.lubricationSystem?.oil?.status),
        visualCheckLubeOilResult: getResultText(v.lubricationSystem?.oil),
        visualCheckLubeOilStrainerTrue: getCheckmark(v.lubricationSystem?.oilStrainer?.status),
        visualCheckLubeOilStrainerFalse: getOppositeCheckmark(v.lubricationSystem?.oilStrainer?.status),
        visualCheckLubeOilStrainerResult: getResultText(v.lubricationSystem?.oilStrainer),
        visualCheckLubeOilCoolerTrue: getCheckmark(v.lubricationSystem?.oilCooler?.status),
        visualCheckLubeOilCoolerFalse: getOppositeCheckmark(v.lubricationSystem?.oilCooler?.status),
        visualCheckLubeOilCoolerResult: getResultText(v.lubricationSystem?.oilCooler),
        visualCheckLubeOilFilterTrue: getCheckmark(v.lubricationSystem?.oilFilter?.status),
        visualCheckLubeOilFilterFalse: getOppositeCheckmark(v.lubricationSystem?.oilFilter?.status),
        visualCheckLubeOilFilterResult: getResultText(v.lubricationSystem?.oilFilter),
        visualCheckLubeByPassFilterTrue: getCheckmark(v.lubricationSystem?.byPassFilter?.status),
        visualCheckLubeByPassFilterFalse: getOppositeCheckmark(v.lubricationSystem?.byPassFilter?.status),
        visualCheckLubeByPassFilterResult: getResultText(v.lubricationSystem?.byPassFilter),
        visualCheckLubeSafetyValveTrue: getCheckmark(v.lubricationSystem?.safetyValve?.status),
        visualCheckLubeSafetyValveFalse: getOppositeCheckmark(v.lubricationSystem?.safetyValve?.status),
        visualCheckLubeSafetyValveResult: getResultText(v.lubricationSystem?.safetyValve),
        visualCheckLubePackingTrue: getCheckmark(v.lubricationSystem?.packing?.status),
        visualCheckLubePackingFalse: getOppositeCheckmark(v.lubricationSystem?.packing?.status),
        visualCheckLubePackingResult: getResultText(v.lubricationSystem?.packing),

        // PEMERIKSAAN VISUAL - SISTEM BAHAN BAKAR
        visualCheckFuelDailyTankTrue: getCheckmark(v.fuelSystem?.dailyTank?.status),
        visualCheckFuelDailyTankFalse: getOppositeCheckmark(v.fuelSystem?.dailyTank?.status),
        visualCheckFuelDailyTankResult: getResultText(v.fuelSystem?.dailyTank),
        visualCheckFuelInjectorTrue: getCheckmark(v.fuelSystem?.fuelInjector?.status),
        visualCheckFuelInjectorFalse: getOppositeCheckmark(v.fuelSystem?.fuelInjector?.status),
        visualCheckFuelInjectorResult: getResultText(v.fuelSystem?.fuelInjector),
        visualCheckFuelConnectionsTrue: getCheckmark(v.fuelSystem?.connections?.status),
        visualCheckFuelConnectionsFalse: getOppositeCheckmark(v.fuelSystem?.connections?.status),
        visualCheckFuelConnectionsResult: getResultText(v.fuelSystem?.connections),
        visualCheckFuelFloatTankTrue: getCheckmark(v.fuelSystem?.floatTank?.status),
        visualCheckFuelFloatTankFalse: getOppositeCheckmark(v.fuelSystem?.floatTank?.status),
        visualCheckFuelFloatTankResult: getResultText(v.fuelSystem?.floatTank),
        visualCheckFuelFilterTrue: getCheckmark(v.fuelSystem?.fuelFilter?.status),
        visualCheckFuelFilterFalse: getOppositeCheckmark(v.fuelSystem?.fuelFilter?.status),
        visualCheckFuelFilterResult: getResultText(v.fuelSystem?.fuelFilter),
        visualCheckFuelPumpTrue: getCheckmark(v.fuelSystem?.fuelPump?.status),
        visualCheckFuelPumpFalse: getOppositeCheckmark(v.fuelSystem?.fuelPump?.status),
        visualCheckFuelPumpResult: getResultText(v.fuelSystem?.fuelPump),
        visualCheckFuelMagneticScreenTrue: getCheckmark(v.fuelSystem?.magneticScreen?.status),
        visualCheckFuelMagneticScreenFalse: getOppositeCheckmark(v.fuelSystem?.magneticScreen?.status),
        visualCheckFuelMagneticScreenResult: getResultText(v.fuelSystem?.magneticScreen),
        visualCheckFuelGovernorTrue: getCheckmark(v.fuelSystem?.governor?.status),
        visualCheckFuelGovernorFalse: getOppositeCheckmark(v.fuelSystem?.governor?.status),
        visualCheckFuelGovernorResult: getResultText(v.fuelSystem?.governor),
        visualCheckFuelThrottleShaftTrue: getCheckmark(v.fuelSystem?.throttleShaft?.status),
        visualCheckFuelThrottleShaftFalse: getOppositeCheckmark(v.fuelSystem?.throttleShaft?.status),
        visualCheckFuelThrottleShaftResult: getResultText(v.fuelSystem?.throttleShaft),
        visualCheckFuelRegulatorTrue: getCheckmark(v.fuelSystem?.regulator?.status),
        visualCheckFuelRegulatorFalse: getOppositeCheckmark(v.fuelSystem?.regulator?.status),
        visualCheckFuelRegulatorResult: getResultText(v.fuelSystem?.regulator),
        visualCheckFuelShutOffValveTrue: getCheckmark(v.fuelSystem?.shutOffValve?.status),
        visualCheckFuelShutOffValveFalse: getOppositeCheckmark(v.fuelSystem?.shutOffValve?.status),
        visualCheckFuelShutOffValveResult: getResultText(v.fuelSystem?.shutOffValve),

        // PEMERIKSAAN VISUAL - ALAT BANTU START
        visualCheckStartingFeedPumpTrue: getCheckmark(v.startingAid?.feedPump?.status),
        visualCheckStartingFeedPumpFalse: getOppositeCheckmark(v.startingAid?.feedPump?.status),
        visualCheckStartingFeedPumpResult: getResultText(v.startingAid?.feedPump),
        visualCheckStartingFuelValveTrue: getCheckmark(v.startingAid?.fuelValve?.status),
        visualCheckStartingFuelValveFalse: getOppositeCheckmark(v.startingAid?.fuelValve?.status),
        visualCheckStartingFuelValveResult: getResultText(v.startingAid?.fuelValve),
        visualCheckStartingPrimingPumpTrue: getCheckmark(v.startingAid?.primingPump?.status),
        visualCheckStartingPrimingPumpFalse: getOppositeCheckmark(v.startingAid?.primingPump?.status),
        visualCheckStartingPrimingPumpResult: getResultText(v.startingAid?.primingPump),
        visualCheckStartingHeaterPlugTrue: getCheckmark(v.startingAid?.heaterPlug?.status),
        visualCheckStartingHeaterPlugFalse: getOppositeCheckmark(v.startingAid?.heaterPlug?.status),
        visualCheckStartingHeaterPlugResult: getResultText(v.startingAid?.heaterPlug),
        visualCheckStartingHeaterSwitchTrue: getCheckmark(v.startingAid?.heaterSwitch?.status),
        visualCheckStartingHeaterSwitchFalse: getOppositeCheckmark(v.startingAid?.heaterSwitch?.status),
        visualCheckStartingHeaterSwitchResult: getResultText(v.startingAid?.heaterSwitch),
        visualCheckStartingPreHeaterTrue: getCheckmark(v.startingAid?.preHeater?.status),
        visualCheckStartingPreHeaterFalse: getOppositeCheckmark(v.startingAid?.preHeater?.status),
        visualCheckStartingPreHeaterResult: getResultText(v.startingAid?.preHeater),
        visualCheckStartingWaterSignalTrue: getCheckmark(v.startingAid?.waterSignal?.status),
        visualCheckStartingWaterSignalFalse: getOppositeCheckmark(v.startingAid?.waterSignal?.status),
        visualCheckStartingWaterSignalResult: getResultText(v.startingAid?.waterSignal),
        visualCheckStartingSwitchTrue: getCheckmark(v.startingAid?.startingSwitch?.status),
        visualCheckStartingSwitchFalse: getOppositeCheckmark(v.startingAid?.startingSwitch?.status),
        visualCheckStartingSwitchResult: getResultText(v.startingAid?.startingSwitch),
        visualCheckStartingBatteryPolesTrue: getCheckmark(v.startingAid?.batteryPoles?.status),
        visualCheckStartingBatteryPolesFalse: getOppositeCheckmark(v.startingAid?.batteryPoles?.status),
        visualCheckStartingBatteryPolesResult: getResultText(v.startingAid?.batteryPoles),
        visualCheckStartingThermostartTankTrue: getCheckmark(v.startingAid?.thermostartTank?.status),
        visualCheckStartingThermostartTankFalse: getOppositeCheckmark(v.startingAid?.thermostartTank?.status),
        visualCheckStartingThermostartTankResult: getResultText(v.startingAid?.thermostartTank),
        visualCheckStartingThermostartTrue: getCheckmark(v.startingAid?.thermostart?.status),
        visualCheckStartingThermostartFalse: getOppositeCheckmark(v.startingAid?.thermostart?.status),
        visualCheckStartingThermostartResult: getResultText(v.startingAid?.thermostart),
        visualCheckStartingHeaterSignalTrue: getCheckmark(v.startingAid?.heaterSignal?.status),
        visualCheckStartingHeaterSignalFalse: getOppositeCheckmark(v.startingAid?.heaterSignal?.status),
        visualCheckStartingHeaterSignalResult: getResultText(v.startingAid?.heaterSignal),
        visualCheckStartingThermostartSwitchTrue: getCheckmark(v.startingAid?.thermostartSwitch?.status),
        visualCheckStartingThermostartSwitchFalse: getOppositeCheckmark(v.startingAid?.thermostartSwitch?.status),
        visualCheckStartingThermostartSwitchResult: getResultText(v.startingAid?.thermostartSwitch),
        visualCheckStartingGlowPlugTrue: getCheckmark(v.startingAid?.glowPlug?.status),
        visualCheckStartingGlowPlugFalse: getOppositeCheckmark(v.startingAid?.glowPlug?.status),
        visualCheckStartingGlowPlugResult: getResultText(v.startingAid?.glowPlug),
        visualCheckStartingSpeedSensorTrue: getCheckmark(v.startingAid?.speedSensor?.status),
        visualCheckStartingSpeedSensorFalse: getOppositeCheckmark(v.startingAid?.speedSensor?.status),
        visualCheckStartingSpeedSensorResult: getResultText(v.startingAid?.speedSensor),
        visualCheckStartingServiceMeterTrue: getCheckmark(v.startingAid?.serviceMeter?.status),
        visualCheckStartingServiceMeterFalse: getOppositeCheckmark(v.startingAid?.serviceMeter?.status),
        visualCheckStartingServiceMeterResult: getResultText(v.startingAid?.serviceMeter),
        visualCheckStartingTempSensorTrue: getCheckmark(v.startingAid?.tempSensor?.status),
        visualCheckStartingTempSensorFalse: getOppositeCheckmark(v.startingAid?.tempSensor?.status),
        visualCheckStartingTempSensorResult: getResultText(v.startingAid?.tempSensor),
        visualCheckStartingMotorTrue: getCheckmark(v.startingAid?.startingMotor?.status),
        visualCheckStartingMotorFalse: getOppositeCheckmark(v.startingAid?.startingMotor?.status),
        visualCheckStartingMotorResult: getResultText(v.startingAid?.startingMotor),

        // PEMERIKSAAN VISUAL - SISTEM PENDINGIN
        visualCheckCoolingWaterTrue: getCheckmark(v.coolingSystem?.coolingWater?.status),
        visualCheckCoolingWaterFalse: getOppositeCheckmark(v.coolingSystem?.coolingWater?.status),
        visualCheckCoolingWaterResult: getResultText(v.coolingSystem?.coolingWater),
        visualCheckCoolingBoltsTrue: getCheckmark(v.coolingSystem?.bolts?.status),
        visualCheckCoolingBoltsFalse: getOppositeCheckmark(v.coolingSystem?.bolts?.status),
        visualCheckCoolingBoltsResult: getResultText(v.coolingSystem?.bolts),
        visualCheckCoolingClampsTrue: getCheckmark(v.coolingSystem?.clamps?.status),
        visualCheckCoolingClampsFalse: getOppositeCheckmark(v.coolingSystem?.clamps?.status),
        visualCheckCoolingClampsResult: getResultText(v.coolingSystem?.clamps),
        visualCheckCoolingRadiatorTrue: getCheckmark(v.coolingSystem?.radiator?.status),
        visualCheckCoolingRadiatorFalse: getOppositeCheckmark(v.coolingSystem?.radiator?.status),
        visualCheckCoolingRadiatorResult: getResultText(v.coolingSystem?.radiator),
        visualCheckCoolingThermostatTrue: getCheckmark(v.coolingSystem?.thermostat?.status),
        visualCheckCoolingThermostatFalse: getOppositeCheckmark(v.coolingSystem?.thermostat?.status),
        visualCheckCoolingThermostatResult: getResultText(v.coolingSystem?.thermostat),
        visualCheckCoolingFanTrue: getCheckmark(v.coolingSystem?.fan?.status),
        visualCheckCoolingFanFalse: getOppositeCheckmark(v.coolingSystem?.fan?.status),
        visualCheckCoolingFanResult: getResultText(v.coolingSystem?.fan),
        visualCheckCoolingFanGuardTrue: getCheckmark(v.coolingSystem?.fanGuard?.status),
        visualCheckCoolingFanGuardFalse: getOppositeCheckmark(v.coolingSystem?.fanGuard?.status),
        visualCheckCoolingFanGuardResult: getResultText(v.coolingSystem?.fanGuard),
        visualCheckCoolingFanRotationTrue: getCheckmark(v.coolingSystem?.fanRotation?.status),
        visualCheckCoolingFanRotationFalse: getOppositeCheckmark(v.coolingSystem?.fanRotation?.status),
        visualCheckCoolingFanRotationResult: getResultText(v.coolingSystem?.fanRotation),
        visualCheckCoolingBearingTrue: getCheckmark(v.coolingSystem?.bearing?.status),
        visualCheckCoolingBearingFalse: getOppositeCheckmark(v.coolingSystem?.bearing?.status),
        visualCheckCoolingBearingResult: getResultText(v.coolingSystem?.bearing),

        // PEMERIKSAAN VISUAL - SISTEM SIRKULASI UDARA
        visualCheckAirCircPreCleanerTrue: getCheckmark(v.airCirculationSystem?.preCleaner?.status),
        visualCheckAirCircPreCleanerFalse: getOppositeCheckmark(v.airCirculationSystem?.preCleaner?.status),
        visualCheckAirCircPreCleanerResult: getResultText(v.airCirculationSystem?.preCleaner),
        visualCheckAirCircDustIndicatorTrue: getCheckmark(v.airCirculationSystem?.dustIndicator?.status),
        visualCheckAirCircDustIndicatorFalse: getOppositeCheckmark(v.airCirculationSystem?.dustIndicator?.status),
        visualCheckAirCircDustIndicatorResult: getResultText(v.airCirculationSystem?.dustIndicator),
        visualCheckAirCircAirCleanerTrue: getCheckmark(v.airCirculationSystem?.airCleaner?.status),
        visualCheckAirCircAirCleanerFalse: getOppositeCheckmark(v.airCirculationSystem?.airCleaner?.status),
        visualCheckAirCircAirCleanerResult: getResultText(v.airCirculationSystem?.airCleaner),
        visualCheckAirCircTurboChargerTrue: getCheckmark(v.airCirculationSystem?.turboCharger?.status),
        visualCheckAirCircTurboChargerFalse: getOppositeCheckmark(v.airCirculationSystem?.turboCharger?.status),
        visualCheckAirCircTurboChargerResult: getResultText(v.airCirculationSystem?.turboCharger),
        visualCheckAirCircClampsTrue: getCheckmark(v.airCirculationSystem?.clamps?.status),
        visualCheckAirCircClampsFalse: getOppositeCheckmark(v.airCirculationSystem?.clamps?.status),
        visualCheckAirCircClampsResult: getResultText(v.airCirculationSystem?.clamps),
        visualCheckAirCircAfterCoolerTrue: getCheckmark(v.airCirculationSystem?.afterCooler?.status),
        visualCheckAirCircAfterCoolerFalse: getOppositeCheckmark(v.airCirculationSystem?.afterCooler?.status),
        visualCheckAirCircAfterCoolerResult: getResultText(v.airCirculationSystem?.afterCooler),
        visualCheckAirCircMufflerTrue: getCheckmark(v.airCirculationSystem?.muffler?.status),
        visualCheckAirCircMufflerFalse: getOppositeCheckmark(v.airCirculationSystem?.muffler?.status),
        visualCheckAirCircMufflerResult: getResultText(v.airCirculationSystem?.muffler),
        visualCheckAirCircSilencerTrue: getCheckmark(v.airCirculationSystem?.silencer?.status),
        visualCheckAirCircSilencerFalse: getOppositeCheckmark(v.airCirculationSystem?.silencer?.status),
        visualCheckAirCircSilencerResult: getResultText(v.airCirculationSystem?.silencer),
        visualCheckAirCircHeatDamperTrue: getCheckmark(v.airCirculationSystem?.heatDamper?.status),
        visualCheckAirCircHeatDamperFalse: getOppositeCheckmark(v.airCirculationSystem?.heatDamper?.status),
        visualCheckAirCircHeatDamperResult: getResultText(v.airCirculationSystem?.heatDamper),
        visualCheckAirCircBoltsTrue: getCheckmark(v.airCirculationSystem?.bolts?.status),
        visualCheckAirCircBoltsFalse: getOppositeCheckmark(v.airCirculationSystem?.bolts?.status),
        visualCheckAirCircBoltsResult: getResultText(v.airCirculationSystem?.bolts),

        // PEMERIKSAAN VISUAL - BAGIAN-BAGIAN UTAMA
        visualCheckMainPartsDamperBoltsTrue: getCheckmark(v.mainParts?.damperBolts?.status),
        visualCheckMainPartsDamperBoltsFalse: getOppositeCheckmark(v.mainParts?.damperBolts?.status),
        visualCheckMainPartsDamperBoltsResult: getResultText(v.mainParts?.damperBolts),
        visualCheckMainPartsSupportTrue: getCheckmark(v.mainParts?.support?.status),
        visualCheckMainPartsSupportFalse: getOppositeCheckmark(v.mainParts?.support?.status),
        visualCheckMainPartsSupportResult: getResultText(v.mainParts?.support),
        visualCheckMainPartsFlyWheelHousingTrue: getCheckmark(v.mainParts?.flyWheelHousing?.status),
        visualCheckMainPartsFlyWheelHousingFalse: getOppositeCheckmark(v.mainParts?.flyWheelHousing?.status),
        visualCheckMainPartsFlyWheelHousingResult: getResultText(v.mainParts?.flyWheelHousing),
        visualCheckMainPartsFlyWheelTrue: getCheckmark(v.mainParts?.flyWheel?.status),
        visualCheckMainPartsFlyWheelFalse: getOppositeCheckmark(v.mainParts?.flyWheel?.status),
        visualCheckMainPartsFlyWheelResult: getResultText(v.mainParts?.flyWheel),
        visualCheckMainPartsVibrationDamperTrue: getCheckmark(v.mainParts?.vibrationDamper?.status),
        visualCheckMainPartsVibrationDamperFalse: getOppositeCheckmark(v.mainParts?.vibrationDamper?.status),
        visualCheckMainPartsVibrationDamperResult: getResultText(v.mainParts?.vibrationDamper),
        visualCheckMainPartsBeltAndPulleyTrue: getCheckmark(v.mainParts?.beltAndPulley?.status),
        visualCheckMainPartsBeltAndPulleyFalse: getOppositeCheckmark(v.mainParts?.beltAndPulley?.status),
        visualCheckMainPartsBeltAndPulleyResult: getResultText(v.mainParts?.beltAndPulley),
        visualCheckMainPartsCrankshaftTrue: getCheckmark(v.mainParts?.crankshaft?.status),
        visualCheckMainPartsCrankshaftFalse: getOppositeCheckmark(v.mainParts?.crankshaft?.status),
        visualCheckMainPartsCrankshaftResult: getResultText(v.mainParts?.crankshaft),

        // PEMERIKSAAN VISUAL - GENERATOR
        visualCheckGeneratorTerminalTrue: getCheckmark(v.generatorParts?.terminal?.status),
        visualCheckGeneratorTerminalFalse: getOppositeCheckmark(v.generatorParts?.terminal?.status),
        visualCheckGeneratorTerminalResult: getResultText(v.generatorParts?.terminal),
        visualCheckGeneratorCableTrue: getCheckmark(v.generatorParts?.cable?.status),
        visualCheckGeneratorCableFalse: getOppositeCheckmark(v.generatorParts?.cable?.status),
        visualCheckGeneratorCableResult: getResultText(v.generatorParts?.cable),
        visualCheckGeneratorPanelTrue: getCheckmark(v.generatorParts?.panel?.status),
        visualCheckGeneratorPanelFalse: getOppositeCheckmark(v.generatorParts?.panel?.status),
        visualCheckGeneratorPanelResult: getResultText(v.generatorParts?.panel),
        visualCheckGeneratorAmpereMeterTrue: getCheckmark(v.generatorParts?.ampereMeter?.status),
        visualCheckGeneratorAmpereMeterFalse: getOppositeCheckmark(v.generatorParts?.ampereMeter?.status),
        visualCheckGeneratorAmpereMeterResult: getResultText(v.generatorParts?.ampereMeter),
        visualCheckGeneratorVoltMeterTrue: getCheckmark(v.generatorParts?.voltMeter?.status),
        visualCheckGeneratorVoltMeterFalse: getOppositeCheckmark(v.generatorParts?.voltMeter?.status),
        visualCheckGeneratorVoltMeterResult: getResultText(v.generatorParts?.voltMeter),
        visualCheckGeneratorFrequencyMeterTrue: getCheckmark(v.generatorParts?.frequencyMeter?.status),
        visualCheckGeneratorFrequencyMeterFalse: getOppositeCheckmark(v.generatorParts?.frequencyMeter?.status),
        visualCheckGeneratorFrequencyMeterResult: getResultText(v.generatorParts?.frequencyMeter),
        visualCheckGeneratorCircuitBreakerTrue: getCheckmark(v.generatorParts?.circuitBreaker?.status),
        visualCheckGeneratorCircuitBreakerFalse: getOppositeCheckmark(v.generatorParts?.circuitBreaker?.status),
        visualCheckGeneratorCircuitBreakerResult: getResultText(v.generatorParts?.circuitBreaker),
        visualCheckGeneratorOnOffSwitchTrue: getCheckmark(v.generatorParts?.onOffSwitch?.status),
        visualCheckGeneratorOnOffSwitchFalse: getOppositeCheckmark(v.generatorParts?.onOffSwitch?.status),
        visualCheckGeneratorOnOffSwitchResult: getResultText(v.generatorParts?.onOffSwitch),

        // PEMERIKSAAN VISUAL - TRANSMISI
        visualCheckTransmissionGearTrue: getCheckmark(v.transmission?.gear?.status),
        visualCheckTransmissionGearFalse: getOppositeCheckmark(v.transmission?.gear?.status),
        visualCheckTransmissionGearResult: getResultText(v.transmission?.gear),
        visualCheckTransmissionBeltTrue: getCheckmark(v.transmission?.belt?.status),
        visualCheckTransmissionBeltFalse: getOppositeCheckmark(v.transmission?.belt?.status),
        visualCheckTransmissionBeltResult: getResultText(v.transmission?.belt),
        visualCheckTransmissionChainTrue: getCheckmark(v.transmission?.chain?.status),
        visualCheckTransmissionChainFalse: getOppositeCheckmark(v.transmission?.chain?.status),
        visualCheckTransmissionChainResult: getResultText(v.transmission?.chain),

        // PEMERIKSAAN VISUAL - MAIN DISTRIBUTOR PANEL
        visualCheckMdpCableTrue: getCheckmark(v.mdp?.cable?.status),
        visualCheckMdpCableFalse: getOppositeCheckmark(v.mdp?.cable?.status),
        visualCheckMdpCableResult: getResultText(v.mdp?.cable),
        visualCheckMdpConditionTrue: getCheckmark(v.mdp?.condition?.status),
        visualCheckMdpConditionFalse: getOppositeCheckmark(v.mdp?.condition?.status),
        visualCheckMdpConditionResult: getResultText(v.mdp?.condition),
        visualCheckMdpAmpereMeterTrue: getCheckmark(v.mdp?.ampereMeter?.status),
        visualCheckMdpAmpereMeterFalse: getOppositeCheckmark(v.mdp?.ampereMeter?.status),
        visualCheckMdpAmpereMeterResult: getResultText(v.mdp?.ampereMeter),
        visualCheckMdpVoltMeterTrue: getCheckmark(v.mdp?.voltMeter?.status),
        visualCheckMdpVoltMeterFalse: getOppositeCheckmark(v.mdp?.voltMeter?.status),
        visualCheckMdpVoltMeterResult: getResultText(v.mdp?.voltMeter),
        visualCheckMdpMainCircuitBreakerTrue: getCheckmark(v.mdp?.mainCircuitBreaker?.status),
        visualCheckMdpMainCircuitBreakerFalse: getOppositeCheckmark(v.mdp?.mainCircuitBreaker?.status),
        visualCheckMdpMainCircuitBreakerResult: getResultText(v.mdp?.mainCircuitBreaker),

        // PEMERIKSAAN VISUAL - SAFETY DEVICE
        visualCheckSafetyGroundingTrue: getCheckmark(v.safetyDevice?.grounding?.status),
        visualCheckSafetyGroundingFalse: getOppositeCheckmark(v.safetyDevice?.grounding?.status),
        visualCheckSafetyGroundingResult: getResultText(v.safetyDevice?.grounding),
        visualCheckSafetyLightningArresterTrue: getCheckmark(v.safetyDevice?.lightningArrester?.status),
        visualCheckSafetyLightningArresterFalse: getOppositeCheckmark(v.safetyDevice?.lightningArrester?.status),
        visualCheckSafetyLightningArresterResult: getResultText(v.safetyDevice?.lightningArrester),
        visualCheckSafetyEmergencyStopTrue: getCheckmark(v.safetyDevice?.emergencyStop?.status),
        visualCheckSafetyEmergencyStopFalse: getOppositeCheckmark(v.safetyDevice?.emergencyStop?.status),
        visualCheckSafetyEmergencyStopResult: getResultText(v.safetyDevice?.emergencyStop),
        visualCheckSafetyGovernorTrue: getCheckmark(v.safetyDevice?.governor?.status),
        visualCheckSafetyGovernorFalse: getOppositeCheckmark(v.safetyDevice?.governor?.status),
        visualCheckSafetyGovernorResult: getResultText(v.safetyDevice?.governor),
        visualCheckSafetyThermostatTrue: getCheckmark(v.safetyDevice?.thermostat?.status),
        visualCheckSafetyThermostatFalse: getOppositeCheckmark(v.safetyDevice?.thermostat?.status),
        visualCheckSafetyThermostatResult: getResultText(v.safetyDevice?.thermostat),
        visualCheckSafetyWaterSignalTrue: getCheckmark(v.safetyDevice?.waterSignal?.status),
        visualCheckSafetyWaterSignalFalse: getOppositeCheckmark(v.safetyDevice?.waterSignal?.status),
        visualCheckSafetyWaterSignalResult: getResultText(v.safetyDevice?.waterSignal),
        visualCheckSafetyFanGuardTrue: getCheckmark(v.safetyDevice?.fanGuard?.status),
        visualCheckSafetyFanGuardFalse: getOppositeCheckmark(v.safetyDevice?.fanGuard?.status),
        visualCheckSafetyFanGuardResult: getResultText(v.safetyDevice?.fanGuard),
        visualCheckSafetySilencerTrue: getCheckmark(v.safetyDevice?.silencer?.status),
        visualCheckSafetySilencerFalse: getOppositeCheckmark(v.safetyDevice?.silencer?.status),
        visualCheckSafetySilencerResult: getResultText(v.safetyDevice?.silencer),
        visualCheckSafetyVibrationDamperTrue: getCheckmark(v.safetyDevice?.vibrationDamper?.status),
        visualCheckSafetyVibrationDamperFalse: getOppositeCheckmark(v.safetyDevice?.vibrationDamper?.status),
        visualCheckSafetyVibrationDamperResult: getResultText(v.safetyDevice?.vibrationDamper),
        visualCheckSafetyCircuitBreakerTrue: getCheckmark(v.safetyDevice?.circuitBreaker?.status),
        visualCheckSafetyCircuitBreakerFalse: getOppositeCheckmark(v.safetyDevice?.circuitBreaker?.status),
        visualCheckSafetyCircuitBreakerResult: getResultText(v.safetyDevice?.circuitBreaker),
        visualCheckSafetyAvrTrue: getCheckmark(v.safetyDevice?.avr?.status),
        visualCheckSafetyAvrFalse: getOppositeCheckmark(v.safetyDevice?.avr?.status),
        visualCheckSafetyAvrResult: getResultText(v.safetyDevice?.avr),

        // PENGUJIAN NDT
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

        // PENGUJIAN SAFETY DEVICE
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

        // KOMPONEN LISTRIK
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

        // KESIMPULAN & REKOMENDASI
        conclusion: data.conclusion,
        recommendations: data.recommendations,
        inspectionDate: data.inspectionDate,

        // PERHITUNGAN MCB
        mcbPhase: mcb.phase,
        mcbVoltage: mcb.voltage,
        mcbCosQ: mcb.cosQ,
        mcbGeneratorPower: mcb.generatorPowerKva,
        mcbGeneratorPowerKw: mcb.generatorPowerKw,
        resultCalculation: mcb.resultCalculation,
        "Requirement calculation": mcb.requirementCalculation, // Penanganan placeholder dengan spasi
        conclusionMcb: mcb.conclusion,

        // PENGUKURAN KEBISINGAN
        noiseResultA: noise.pointA?.result,
        noiseStatusA: noise.pointA?.status,
        noiseResultB: noise.pointB?.result,
        noiseStatusB: noise.pointB?.status,
        noiseResultC: noise.pointC?.result,
        noiseStatusC: noise.pointC?.status,
        noiseResultD: noise.pointD?.result,
        noiseStatusD: noise.pointD?.status,

        // PENGUKURAN PENCAHAYAAN
        lightResultA: light.pointA?.result,
        lightStatusA: light.pointA?.status,
        lightResultB: light.pointB?.result,
        lightStatusB: light.pointB?.status,
        lightResultC: light.pointC?.result,
        lightStatusC: light.pointC?.status,
        lightResultD: light.pointD?.result,
        lightStatusD: light.pointD?.status,
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    
    const companyName = g.companyName?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'UnknownCompany';
    const fileName = `Laporan-PTP-Motor Diesel-${companyName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createLaporanPtpDiesel };
