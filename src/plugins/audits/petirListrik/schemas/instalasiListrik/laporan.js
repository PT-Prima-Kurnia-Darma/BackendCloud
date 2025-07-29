'use strict';

const Joi = require('joi');

const laporanListrikPayload = Joi.object({
    examinationType: Joi.string().allow('').required(),
    inspectionType: Joi.string().allow('').required(),
    extraId: Joi.number().required(),
    createdAt: Joi.string().allow('').required(),
    equipmentType: Joi.string().allow('').required(),
    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyAddress: Joi.string().allow('').required(),
        installationType: Joi.string().allow('').required(),
        businessField: Joi.string().allow('').required(),
        safetyServiceProvider: Joi.string().allow('').required(),
        ohsExpert: Joi.string().allow('').required(),
        permitNumber: Joi.string().allow('').required(),
        inspectionDate: Joi.string().allow('').required(),
        inspectionLocation: Joi.string().allow('').required()
    }).required(),
    initialDocumentCheck: Joi.object({
        sld: Joi.object({
            isAvailable: Joi.boolean().allow(true, false).required(),
            result: Joi.string().allow('').required()
        }).required(),
        layout: Joi.object({
            isAvailable: Joi.boolean().allow(true, false).required(),
            result: Joi.string().allow('').required()
        }).required(),
        permit: Joi.object({
            isAvailable: Joi.boolean().allow(true, false).required(),
            result: Joi.string().allow('').required()
        }).required(),
        technicianLicense: Joi.object({
            isAvailable: Joi.boolean().allow(true, false).required(),
            result: Joi.string().allow('').required()
        }).required()
    }).required(),
    technicalData: Joi.object({
        plnPower: Joi.string().allow('').required(),
        generatorPower: Joi.string().allow('').required(),
        totalInstalledLoad: Joi.string().allow('').required(),
        lightingPower: Joi.string().allow('').required(),
        powerLoad: Joi.string().allow('').required()
    }).required(),
    documentExamination1: Joi.object({
        hasPlanningPermit: Joi.boolean().allow(true, false).required(),
        hasLocationMap: Joi.boolean().allow(true, false).required(),
        hasSld: Joi.boolean().allow(true, false).required(),
        hasLayout: Joi.boolean().allow(true, false).required(),
        hasWiringDiagram: Joi.boolean().allow(true, false).required(),
        hasAreaClassification: Joi.boolean().allow(true, false).required(),
        hasPanelComponentList: Joi.boolean().allow(true, false).required(),
        hasShortCircuitCalc: Joi.boolean().allow(true, false).required(),
        hasManualBook: Joi.boolean().allow(true, false).required(),
        hasMaintenanceBook: Joi.boolean().allow(true, false).required(),
        hasWarningSigns: Joi.boolean().allow(true, false).required(),
        hasManufacturerCert: Joi.boolean().allow(true, false).required(),
        hasTechSpec: Joi.boolean().allow(true, false).required(),
        hasTechSpecCert: Joi.boolean().allow(true, false).required(),
        hasPowerRecap: Joi.boolean().allow(true, false).required(),
        hasDailyRecord: Joi.boolean().allow(true, false).required(),
        hasPanelPointCount: Joi.boolean().allow(true, false).required(),
        isPanelCoverGood: Joi.boolean().allow(true, false).required(),
        hasOtherData: Joi.boolean().allow(true, false).required()
    }).required(),
    documentExamination2: Joi.object({
        isUnitConstructionGood: Joi.boolean().allow(true, false).required(),
        isPlacementGood: Joi.boolean().allow(true, false).required(),
        isNameplateVerified: Joi.boolean().allow(true, false).required(),
        isAreaClassificationOk: Joi.boolean().allow(true, false).required(),
        isProtectionGood: Joi.boolean().allow(true, false).required(),
        isRadiationShieldingGood: Joi.boolean().allow(true, false).required(),
        hasPanelDoorHolder: Joi.boolean().allow(true, false).required(),
        areBoltsAndScrewsSecure: Joi.boolean().allow(true, false).required(),
        isBusbarIsolated: Joi.boolean().allow(true, false).required(),
        isBusbarClearanceGood: Joi.boolean().allow(true, false).required(),
        isCableInstallationOk: Joi.boolean().allow(true, false).required(),
        isDoorCableProtected: Joi.boolean().allow(true, false).required(),
        isFuseChangeSafe: Joi.boolean().allow(true, false).required(),
        hasCableTerminalProtection: Joi.boolean().allow(true, false).required(),
        areInstrumentsMarked: Joi.boolean().allow(true, false).required(),
        areEquipmentsCoded: Joi.boolean().allow(true, false).required(),
        isCableInOutGood: Joi.boolean().allow(true, false).required(),
        isBusbarSizeGood: Joi.boolean().allow(true, false).required(),
        isBusbarClean: Joi.boolean().allow(true, false).required(),
        isBusbarMarkingOk: Joi.boolean().allow(true, false).required(),
        isGroundingCableGood: Joi.boolean().allow(true, false).required(),
        isPanelDoorGood: Joi.boolean().allow(true, false).required(),
        areSparepartsOk: Joi.boolean().allow(true, false).required(),
        areSafetyFacilitiesGood: Joi.boolean().allow(true, false).required(),
        breakerData: Joi.object({
            isCurrentRatingOk: Joi.boolean().allow(true, false).required(),
            isVoltageRatingOk: Joi.boolean().allow(true, false).required(),
            isBreakingCurrentOk: Joi.boolean().allow(true, false).required(),
            isControlVoltageOk: Joi.boolean().allow(true, false).required(),
            isManufacturerOk: Joi.boolean().allow(true, false).required(),
            isTypeOk: Joi.boolean().allow(true, false).required(),
            isSerialOk: Joi.boolean().allow(true, false).required()
        }).required()
    }).required(),
    testing: Joi.object({
        isInsulationOk: Joi.boolean().allow(true, false).required(),
        isGroundingOk: Joi.boolean().allow(true, false).required(),
        isOverloadTripOk: Joi.boolean().allow(true, false).required(),
        isReversePowerRelayOk: Joi.boolean().allow(true, false).required(),
        isReverseCurrentRelayOk: Joi.boolean().allow(true, false).required(),
        isBreakerTripOk: Joi.boolean().allow(true, false).required(),
        isTemperatureOk: Joi.boolean().allow(true, false).required(),
        isIndicatorLampOk: Joi.boolean().allow(true, false).required(),
        isMeterDeviationOk: Joi.boolean().allow(true, false).required(),
        isSynchronizationOk: Joi.boolean().allow(true, false).required(),
        isConductorAmpacityOk: Joi.boolean().allow(true, false).required(),
        isProtectionRatingOk: Joi.boolean().allow(true, false).required(),
        isVoltageDropOk: Joi.boolean().allow(true, false).required(),
        hasLossConnection: Joi.boolean().allow(true, false).required(),
        breakerEquipment: Joi.object({
            isCtOk: Joi.boolean().allow(true, false).required(),
            isPtOk: Joi.boolean().allow(true, false).required(),
            isInstrumentsOk: Joi.boolean().allow(true, false).required(),
            isFuseRatingOk: Joi.boolean().allow(true, false).required(),
            isMechanicalOk: Joi.boolean().allow(true, false).required(),
            isTerminalOk: Joi.boolean().allow(true, false).required(),
            isTerminalMarkingOk: Joi.boolean().allow(true, false).required(),
            isInterlockSystemOk: Joi.boolean().allow(true, false).required(),
            isAuxSwitchOk: Joi.boolean().allow(true, false).required(),
            isMechanicalTripOk: Joi.boolean().allow(true, false).required()
        }).required()
    }).required(),
    visualInspection: Joi.object({
        sdpFront: Joi.object({
            areIndicatorLampsGood: Joi.boolean().allow(true, false).required(),
            isDoorClearanceGood: Joi.boolean().allow(true, false).required(),
            isLightingGood: Joi.boolean().allow(true, false).required(),
            isProductionLightingGood: Joi.boolean().allow(true, false).required(),
            isOfficeLightingGood: Joi.boolean().allow(true, false).required(),
            isMainPanelLightingGood: Joi.boolean().allow(true, false).required(),
            isWarehouseLightingGood: Joi.boolean().allow(true, false).required(),
            isAreaClearOfUnusedItems: Joi.boolean().allow(true, false).required(),
            hasVentilationAndSigns: Joi.boolean().allow(true, false).required()
        }).required(),
        sdpFloors: Joi.array().items(Joi.object({
            floorNumber: Joi.string().allow('').required(),
            hasCover: Joi.boolean().allow(true, false).required(),
            hasSld: Joi.boolean().allow(true, false).required(),
            hasBonding: Joi.boolean().allow(true, false).required(),
            hasLabeling: Joi.boolean().allow(true, false).required(),
            isColorCodeOk: Joi.boolean().allow(true, false).required(),
            isClean: Joi.boolean().allow(true, false).required(),
            isNeat: Joi.boolean().allow(true, false).required()
        })).required(),
        sdpTerminal: Joi.object({
            isBusbarOk: Joi.boolean().allow(true, false).required(),
            isBreakerOk: Joi.boolean().allow(true, false).required(),
            areCableLugsOk: Joi.boolean().allow(true, false).required(),
            isGroundingSystemOk: Joi.boolean().allow(true, false).required(),
            isBusbarDistanceOk: Joi.boolean().allow(true, false).required()
        }).required(),
        sdpTesting: Joi.object({
            isVoltageOk: Joi.boolean().allow(true, false).required(),
            isCurrentOk: Joi.boolean().allow(true, false).required(),
            isMeteringOk: Joi.boolean().allow(true, false).required(),
            hasPanelLabel: Joi.boolean().allow(true, false).required(),
            hasWarningSign: Joi.boolean().allow(true, false).required(),
            hasSwitchAndLock: Joi.boolean().allow(true, false).required(),
            isTerminalHeatTested: Joi.boolean().allow(true, false).required(),
            isGroundingTested: Joi.boolean().allow(true, false).required(),
            isConductorAmpacityOk: Joi.boolean().allow(true, false).required(),
            isProtectionRatingOk: Joi.boolean().allow(true, false).required()
        }).required()
    }).required(),
    found: Joi.string().allow('').required(),
    conclusion: Joi.string().allow('').required(),
    recommendations: Joi.string().allow('').required()
});

module.exports = {
    laporanListrikPayload
};