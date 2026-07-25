'use strict';

const Invoice = require('../models/Invoice.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const paginate = require('../utils/paginate');

class InvoiceController {
  getOne = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) throw AppError.notFound('Invoice');
    res.status(200).json({ success: true, data: { invoice } });
  });

  getMyInvoices = asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    const result = await paginate(Invoice, filter, { page, limit, sort: { createdAt: -1 } });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  getAll = asyncHandler(async (req, res) => {
    const { page, limit, userId, status } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    const result = await paginate(Invoice, filter, { page, limit, sort: { createdAt: -1 } });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });
}

module.exports = new InvoiceController();
