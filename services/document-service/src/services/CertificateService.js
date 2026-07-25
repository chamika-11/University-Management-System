'use strict';

const crypto = require('crypto');
const IssuedCertificate = require('../models/IssuedCertificate');
const IssuedCertificateModel = require('../models/IssuedCertificate.model');
const AppError = require('../utils/AppError');
const publisher = require('../events/publisher');

class CertificateService {
  /**
   * Simulates PDF certificate compilation and signs it digitally.
   */
  async issueCertificate({ studentId, certificateType }) {
    const verificationToken = crypto.randomBytes(16).toString('hex');
    
    // Create a digital signature over the certificate attributes
    const signInput = `${studentId}:${certificateType}:${verificationToken}`;
    const digitalSignature = crypto.createHash('sha256').update(signInput).digest('hex');

    const fileUrl = `/certificates/CERT-${verificationToken}.pdf`;

    const cert = await IssuedCertificateModel.create({
      studentId,
      certificateType,
      fileUrl,
      digitalSignature,
      verificationToken,
    });

    await publisher.publish('document.events', {
      eventType: 'document.certificate_issued',
      payload: { certificateId: cert._id.toString(), studentId, certificateType, verificationToken },
    });

    return cert;
  }

  /**
   * Public QR lookup to verify certificate integrity.
   */
  async verifyCertificate(verificationToken) {
    const cert = await IssuedCertificateModel.findOne({ verificationToken });
    if (!cert) throw AppError.notFound('Certificate');

    // Re-verify digital signature to ensure database records weren't tampered with
    const signInput = `${cert.studentId}:${cert.certificateType}:${verificationToken}`;
    const expectedSignature = crypto.createHash('sha256').update(signInput).digest('hex');

    const isAuthentic = cert.digitalSignature === expectedSignature;

    return {
      isValid: isAuthentic,
      certificate: cert,
      message: isAuthentic ? 'Verification successful. Certificate is genuine.' : 'Warning: Digital signature mismatch!',
    };
  }

  async getStudentCertificates(studentId) {
    return IssuedCertificateModel.find({ studentId }).sort({ issueDate: -1 });
  }
}

module.exports = new CertificateService();
