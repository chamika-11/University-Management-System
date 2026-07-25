'use strict';

const appRepo = require('../repositories/application.repository');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class ApplicationProcessingService {
  /**
   * Submits a fresh student admission application.
   */
  async submitApplication({ applicantId, email, firstName, lastName, phone, programId, cycleCode }) {
    const cycle = cycleCode
      ? await appRepo.findAllCycles().then(list => list.find(c => c.code === cycleCode))
      : await appRepo.findActiveCycle();

    if (!cycle) throw AppError.badRequest('No active admission cycle available', 'NO_ACTIVE_CYCLE');

    const existing = await appRepo.findByEmailAndCycle(email, cycle._id);
    if (existing) throw AppError.conflict('You have already applied for this cycle', 'DUPLICATE_APPLICATION');

    const application = await appRepo.createApplication({
      applicantId, email, firstName, lastName, phone, programId, cycleId: cycle._id,
      status: 'APPLIED',
    });

    await publisher.publish('admission.events', {
      eventType: 'admission.application_submitted',
      payload: {
        applicationId: application._id.toString(),
        applicantId,
        email,
        firstName,
        lastName,
        programId,
      },
    });

    logger.info('[AdmissionService] Application submitted', { email, id: application._id });
    return application;
  }

  /**
   * Updates upload documents and advances state.
   */
  async uploadDocuments(id, documents) {
    const app = await appRepo.findApplicationById(id);
    if (!app) throw AppError.notFound('Application');

    const updated = await appRepo.updateApplication(id, { documents, status: 'DOCUMENT_SUBMITTED' });
    return updated;
  }

  /**
   * Performs an automated eligibility check.
   */
  async evaluateEligibility(id, meritScore) {
    const app = await appRepo.findApplicationById(id);
    if (!app) throw AppError.notFound('Application');

    let status = 'REJECTED';
    if (meritScore >= 50) {
      status = 'ELIGIBILITY_CHECKED';
    }

    const updated = await appRepo.updateApplication(id, { meritScore, status });

    logger.info('[AdmissionService] Eligibility evaluated', { id, score: meritScore, result: status });
    return updated;
  }

  /**
   * Generates an official offer letter path.
   */
  async generateOfferLetter(id) {
    const app = await appRepo.findApplicationById(id);
    if (!app) throw AppError.notFound('Application');
    if (app.status !== 'ELIGIBILITY_CHECKED') throw AppError.badRequest('Applicant is not eligible yet', 'NOT_ELIGIBLE');

    const offerLetterUrl = `/offers/OFFER-${id}.pdf`;
    const updated = await appRepo.updateApplication(id, { offerLetterUrl, status: 'OFFER_GENERATED' });

    await publisher.publish('admission.events', {
      eventType: 'admission.offer_generated',
      payload: { applicationId: id, email: app.email, applicantName: `${app.firstName} ${app.lastName}`, offerLetterUrl },
    });

    return updated;
  }

  /**
   * Accepts the generated offer letter.
   */
  async acceptOffer(id) {
    const app = await appRepo.findApplicationById(id);
    if (!app) throw AppError.notFound('Application');
    if (app.status !== 'OFFER_GENERATED') throw AppError.badRequest('No offer letter has been generated', 'NO_OFFER');

    const updated = await appRepo.updateApplication(id, { status: 'OFFER_ACCEPTED' });
    return updated;
  }

  /**
   * Confirms user registration and invokes welcome flow in user-service.
   */
  async confirmAdmission(id) {
    const app = await appRepo.findApplicationById(id);
    if (!app) throw AppError.notFound('Application');
    if (app.status !== 'FEE_PAID' && app.status !== 'OFFER_ACCEPTED') {
      throw AppError.badRequest('Admission requirements are pending', 'FEE_PENDING');
    }

    const updated = await appRepo.updateApplication(id, { status: 'CONFIRMED' });

    await publisher.publish('admission.events', {
      eventType: 'admission.confirmed',
      payload: {
        applicantId: app.applicantId,
        email: app.email,
        firstName: app.firstName,
        lastName: app.lastName,
        programId: app.programId,
      },
    });

    logger.info('[AdmissionService] Admission confirmed and student profile creation requested', { id });
    return updated;
  }

  async markPaid(id, invoiceId) {
    const app = await appRepo.findApplicationById(id);
    if (!app) return;
    await appRepo.updateApplication(id, { status: 'FEE_PAID', feeInvoiceId: invoiceId });
    logger.info('[AdmissionService] Application fee marked paid, moving to FEE_PAID state', { id });
    // Auto confirm admission once application fee paid
    await this.confirmAdmission(id);
  }
}

module.exports = new ApplicationProcessingService();
