'use strict';

const auditService = require('./services');
const Boom = require('@hapi/boom');

const createAuditHandler = async (request, h) => {
    try {
        const auditId = await auditService.createAudit(request.payload);
        return h.response({
            status: 'success',
            message: 'Audit data created successfully',
            data: { auditId },
        }).code(201);
    } catch (error) {
        return Boom.badImplementation('Failed to create audit data');
    }
};

const getAllAuditsHandler = async (request, h) => {
    const audits = await auditService.getAllAudits();
    return { status: 'success', data: { audits } };
};

const getAuditByIdHandler = async (request, h) => {
    const { id } = request.params;
    const audit = await auditService.getAuditById(id);
    if (!audit) {
        return Boom.notFound('Audit data not found');
    }
    return { status: 'success', data: { audit } };
};

const updateAuditByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        await auditService.updateAuditById(id, request.payload);
        return { status: 'success', message: 'Audit data updated successfully' };
    } catch (error) {
        return Boom.notFound('Failed to update. Audit data not found');
    }
};

const deleteAuditByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        await auditService.deleteAuditById(id);
        return { status: 'success', message: 'Audit data deleted successfully' };
    } catch (error) {
        return Boom.notFound('Failed to delete. Audit data not found');
    }
};

module.exports = {
    createAuditHandler,
    getAllAuditsHandler,
    getAuditByIdHandler,
    updateAuditByIdHandler,
    deleteAuditByIdHandler,
};