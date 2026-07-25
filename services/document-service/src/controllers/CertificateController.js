'use strict';

const certService = require('../services/CertificateService');
const asyncHandler = require('../utils/asyncHandler');

class CertificateController {
  issue = asyncHandler(async (req, res) => {
    const { studentId, certificateType } = req.body;
    const cert = await certService.issueCertificate({ studentId, certificateType });
    res.status(201).json({ success: true, data: { certificate: cert } });
  });

  verify = asyncHandler(async (req, res) => {
    const result = await certService.verifyCertificate(req.params.token);
    res.status(200).json({ success: true, data: result });
  });

  getStudentCerts = asyncHandler(async (req, res) => {
    const studentId = req.params.studentId || req.user.id;
    const certificates = await certService.getStudentCertificates(studentId);
    res.status(200).json({ success: true, data: { certificates } });
  });
}

module.exports = new CertificateController();
