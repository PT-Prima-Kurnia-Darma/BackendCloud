'use strict';

const Joi = require('joi');

const laporanListrikPayload = Joi.object({
    examinationType: Joi.string().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),
    extraid: Joi.number().allow('').optional(),
    createdaAt: Joi.string().allow('').optional(),
    equipmentType: Joi.string().allow('').optional(),
    generalData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyAddress: Joi.string().allow('').optional(),
        installationType: Joi.string().allow('').optional(),
        businessField: Joi.string().allow('').optional(),
        safetyServiceProvider: Joi.string().allow('').optional(),
        ohsExpert: Joi.string().allow('').optional(),
        permitNumber: Joi.string().allow('').optional(),
        inspectionDate: Joi.string().allow('').optional(),
        inspectionLocation: Joi.string().allow('').optional()
    }).optional(),
    initialDocumentCheck: Joi.object({
        sld: Joi.object({
            isAvailable: Joi.boolean().allow(null).optional(),
            result: Joi.string().allow('').optional()
        }).optional(),
        layout: Joi.object({
            isAvailable: Joi.boolean().allow(null).optional(),
            result: Joi.string().allow('').optional()
        }).optional(),
        permit: Joi.object({
            isAvailable: Joi.boolean().allow(null).optional(),
            result: Joi.string().allow('').optional()
        }).optional(),
        technicianLicense: Joi.object({
            isAvailable: Joi.boolean().allow(null).optional(),
            result: Joi.string().allow('').optional()
        }).optional()
    }).optional(),
    technicalData: Joi.object({
        plnPower: Joi.string().allow('').optional(),
        generatorPower: Joi.string().allow('').optional(),
        totalInstalledLoad: Joi.string().allow('').optional(),
        lightingPower: Joi.string().allow('').optional(),
        powerLoad: Joi.string().allow('').optional()
    }).optional(),
    documentExamination1: Joi.object({
        hasPlanningPermit: Joi.boolean().allow(null).optional(),
        hasLocationMap: Joi.boolean().allow(null).optional(),
        hasSld: Joi.boolean().allow(null).optional(),
        hasLayout: Joi.boolean().allow(null).optional(),
        hasWiringDiagram: Joi.boolean().allow(null).optional(),
        hasAreaClassification: Joi.boolean().allow(null).optional(),
        hasPanelComponentList: Joi.boolean().allow(null).optional(),
        hasShortCircuitCalc: Joi.boolean().allow(null).optional(),
        hasManualBook: Joi.boolean().allow(null).optional(),
        hasMaintenanceBook: Joi.boolean().allow(null).optional(),
        hasWarningSigns: Joi.boolean().allow(null).optional(),
        hasManufacturerCert: Joi.boolean().allow(null).optional(),
        hasTechSpec: Joi.boolean().allow(null).optional(),
        hasTechSpecCert: Joi.boolean().allow(null).optional(),
        hasPowerRecap: Joi.boolean().allow(null).optional(),
        hasDailyRecord: Joi.boolean().allow(null).optional(),
        hasPanelPointCount: Joi.boolean().allow(null).optional(),
        isPanelCoverGood: Joi.boolean().allow(null).optional(),
        hasOtherData: Joi.boolean().allow(null).optional()
    }).optional(),
    documentExamination2: Joi.object({
        isUnitConstructionGood: Joi.boolean().allow(null).optional(),
        isPlacementGood: Joi.boolean().allow(null).optional(),
        isNameplateVerified: Joi.boolean().allow(null).optional(),
        isAreaClassificationOk: Joi.boolean().allow(null).optional(),
        isProtectionGood: Joi.boolean().allow(null).optional(),
        isRadiationShieldingGood: Joi.boolean().allow(null).optional(),
        hasPanelDoorHolder: Joi.boolean().allow(null).optional(),
        areBoltsAndScrewsSecure: Joi.boolean().allow(null).optional(),
        isBusbarIsolated: Joi.boolean().allow(null).optional(),
        isBusbarClearanceGood: Joi.boolean().allow(null).optional(),
        isCableInstallationOk: Joi.boolean().allow(null).optional(),
        isDoorCableProtected: Joi.boolean().allow(null).optional(),
        isFuseChangeSafe: Joi.boolean().allow(null).optional(),
        hasCableTerminalProtection: Joi.boolean().allow(null).optional(),
        areInstrumentsMarked: Joi.boolean().allow(null).optional(),
        areEquipmentsCoded: Joi.boolean().allow(null).optional(),
        isCableInOutGood: Joi.boolean().allow(null).optional(),
        isBusbarSizeGood: Joi.boolean().allow(null).optional(),
        isBusbarClean: Joi.boolean().allow(null).optional(),
        isBusbarMarkingOk: Joi.boolean().allow(null).optional(),
        isGroundingCableGood: Joi.boolean().allow(null).optional(),
        isPanelDoorGood: Joi.boolean().allow(null).optional(),
        areSparepartsOk: Joi.boolean().allow(null).optional(),
        areSafetyFacilitiesGood: Joi.boolean().allow(null).optional(),
        breakerData: Joi.object({
            isCurrentRatingOk: Joi.boolean().allow(null).optional(),
            isVoltageRatingOk: Joi.boolean().allow(null).optional(),
            isBreakingCurrentOk: Joi.boolean().allow(null).optional(),
            isControlVoltageOk: Joi.boolean().allow(null).optional(),
            isManufacturerOk: Joi.boolean().allow(null).optional(),
            isTypeOk: Joi.boolean().allow(null).optional(),
            isSerialOk: Joi.boolean().allow(null).optional()
        }).optional()
    }).optional(),
    testing: Joi.object({
        isInsulationOk: Joi.boolean().allow(null).optional(),
        isGroundingOk: Joi.boolean().allow(null).optional(),
        isOverloadTripOk: Joi.boolean().allow(null).optional(),
        isReversePowerRelayOk: Joi.boolean().allow(null).optional(),
        isReverseCurrentRelayOk: Joi.boolean().allow(null).optional(),
        isBreakerTripOk: Joi.boolean().allow(null).optional(),
        isTemperatureOk: Joi.boolean().allow(null).optional(),
        isIndicatorLampOk: Joi.boolean().allow(null).optional(),
        isMeterDeviationOk: Joi.boolean().allow(null).optional(),
        isSynchronizationOk: Joi.boolean().allow(null).optional(),
        isConductorAmpacityOk: Joi.boolean().allow(null).optional(),
        isProtectionRatingOk: Joi.boolean().allow(null).optional(),
        isVoltageDropOk: Joi.boolean().allow(null).optional(),
        hasLossConnection: Joi.boolean().allow(null).optional(),
        breakerEquipment: Joi.object({
            isCtOk: Joi.boolean().allow(null).optional(),
            isPtOk: Joi.boolean().allow(null).optional(),
            isInstrumentsOk: Joi.boolean().allow(null).optional(),
            isFuseRatingOk: Joi.boolean().allow(null).optional(),
            isMechanicalOk: Joi.boolean().allow(null).optional(),
            isTerminalOk: Joi.boolean().allow(null).optional(),
            isTerminalMarkingOk: Joi.boolean().allow(null).optional(),
            isInterlockSystemOk: Joi.boolean().allow(null).optional(),
            isAuxSwitchOk: Joi.boolean().allow(null).optional(),
            isMechanicalTripOk: Joi.boolean().allow(null).optional()
        }).optional()
    }).optional(),
    visualInspection: Joi.object({
        sdpFront: Joi.object({
            areIndicatorLampsGood: Joi.boolean().allow(null).optional(),
            isDoorClearanceGood: Joi.boolean().allow(null).optional(),
            isLightingGood: Joi.boolean().allow(null).optional(),
            isProductionLightingGood: Joi.boolean().allow(null).optional(),
            isOfficeLightingGood: Joi.boolean().allow(null).optional(),
            isMainPanelLightingGood: Joi.boolean().allow(null).optional(),
            isWarehouseLightingGood: Joi.boolean().allow(null).optional(),
            isAreaClearOfUnusedItems: Joi.boolean().allow(null).optional(),
            hasVentilationAndSigns: Joi.boolean().allow(null).optional()
        }).optional(),
        sdpFloors: Joi.array().items(Joi.object({
            floorNumber: Joi.number().optional(),
            hasCover: Joi.boolean().allow(null).optional(),
            hasSld: Joi.boolean().allow(null).optional(),
            hasBonding: Joi.boolean().allow(null).optional(),
            hasLabeling: Joi.boolean().allow(null).optional(),
            isColorCodeOk: Joi.boolean().allow(null).optional(),
            isClean: Joi.boolean().allow(null).optional(),
            isNeat: Joi.boolean().allow(null).optional()
        })).optional(),
        sdpTerminal: Joi.object({
            isBusbarOk: Joi.boolean().allow(null).optional(),
            isBreakerOk: Joi.boolean().allow(null).optional(),
            areCableLugsOk: Joi.boolean().allow(null).optional(),
            isGroundingSystemOk: Joi.boolean().allow(null).optional(),
            isBusbarDistanceOk: Joi.boolean().allow(null).optional()
        }).optional(),
        sdpTesting: Joi.object({
            isVoltageOk: Joi.boolean().allow(null).optional(),
            isCurrentOk: Joi.boolean().allow(null).optional(),
            isMeteringOk: Joi.boolean().allow(null).optional(),
            hasPanelLabel: Joi.boolean().allow(null).optional(),
            hasWarningSign: Joi.boolean().allow(null).optional(),
            hasSwitchAndLock: Joi.boolean().allow(null).optional(),
            isTerminalHeatTested: Joi.boolean().allow(null).optional(),
            isGroundingTested: Joi.boolean().allow(null).optional(),
            isConductorAmpacityOk: Joi.boolean().allow(null).optional(),
            isProtectionRatingOk: Joi.boolean().allow(null).optional()
        }).optional()
    }).optional(),
    found: Joi.string().allow('').optional(),
    conclusion: Joi.string().allow('').optional(),
    recommendations: Joi.string().allow('').optional()
});

module.exports = {
    laporanListrikPayload
};