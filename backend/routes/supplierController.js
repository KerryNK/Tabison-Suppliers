import { validationResult } from 'express-validator';
import * as supplierService from '../services/supplierService.js';

/**
 * A utility to handle async functions and catch errors
 * @param {Function} fn - The async function to wrap
 */
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getAllSuppliers = asyncHandler(async (req, res) => {
  const { suppliers, total } = await supplierService.findSuppliers(req.query, req.user);
  res.json({
    suppliers,
    pagination: {
      current: parseInt(req.query.page || 1, 10),
      pages: Math.ceil(total / parseInt(req.query.limit || 12, 10)),
      total,
      limit: parseInt(req.query.limit || 12, 10)
    },
    filters: req.query
  });
});

export const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await supplierService.findSupplierById(req.params.id);
  if (!supplier) {
    return res.status(404).json({ message: 'Supplier not found' });
  }
  res.json(supplier);
});

export const createSupplier = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const supplier = await supplierService.createSupplier(req.body);
  
  // Don't send sensitive admin fields in response
  const responseSupplier = supplier.toObject();
  delete responseSupplier.approvedBy;
  delete responseSupplier.searchKeywords;

  res.status(201).json({
    message: 'Registration successful! Your application is under review.',
    supplier: responseSupplier
  });
});

export const updateSupplier = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const updatedSupplier = await supplierService.updateSupplier(req.params.id, req.body, req.user);
  if (!updatedSupplier) {
    return res.status(404).json({ message: 'Supplier not found' });
  }

  res.json({
    message: 'Supplier profile updated successfully',
    supplier: updatedSupplier
  });
});

export const updateSupplierStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;
  const validStatuses = ['Pending', 'Active', 'Inactive', 'Suspended'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
    });
  }

  const supplier = await supplierService.updateSupplierStatus(req.params.id, status, rejectionReason, req.user.id);
  if (!supplier) {
    return res.status(404).json({ message: 'Supplier not found' });
  }

  res.json({
    message: `Supplier status updated to ${status}`,
    supplier
  });
});

export const deleteSupplier = asyncHandler(async (req, res) => {
  const deletedSupplier = await supplierService.deleteSupplier(req.params.id);
  if (!deletedSupplier) {
    return res.status(404).json({ message: 'Supplier not found' });
  }
  res.json({ 
    message: 'Supplier deleted successfully',
    deletedSupplier: {
      id: deletedSupplier._id,
      name: deletedSupplier.name,
      email: deletedSupplier.email
    }
  });
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await supplierService.getDashboardStats();
  res.json(stats);
});