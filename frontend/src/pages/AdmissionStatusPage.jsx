import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/authSlice';
import { useMyApplication, useAcceptOffer } from '@/features/admission-status/useAdmission';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { formatDate } from '@/utils/formatters';
import { CheckCircle2, Clock, FileText, User, Award } from 'lucide-react';

const STAGES = [
  { key: 'SUBMITTED', label: 'Applied', icon: FileText },
  { key: 'UNDER_REVIEW', label: 'Under Review', icon: Clock },
  { key: 'INTERVIEW', label: 'Interview', icon: User },
  { key: 'OFFER_SENT', label: 'Offer Sent', icon: Award },
  { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
];

const AdmissionStatusPage = () => {
  const user = useSelector(selectUser);
  const appId = user?.applicationId || user?.admissionApplicationId;
  const { data: application, isLoading } = useMyApplication(appId);
  const acceptOffer = useAcceptOffer(appId);
  const { showToast } = useToast();

  const handleAccept = async () => {
    try {
      await acceptOffer.mutateAsync();
      showToast({ message: 'Offer accepted! Welcome to the university.', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  if (!appId) {
    return (
      <div className="card max-w-lg">
        <p className="text-sm text-slate-400">No admission application found linked to your account.</p>
      </div>
    );
  }

  if (isLoading) return <PageSpinner />;
  if (!application) return <div className="card"><p className="text-sm text-slate-400">Application not found.</p></div>;

  const currentIdx = STAGES.findIndex((s) => s.key === application.status);

  return (
    <div className="animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="card mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Application ID</p>
            <p className="text-sm font-mono text-slate-300">{application._id || appId}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>
        {application.program && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <p className="text-xs text-slate-500">Applied Program</p>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">{application.program}</p>
          </div>
        )}
      </div>

      {/* Pipeline stepper */}
      <div className="card mb-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-6">Application Pipeline</h3>
        <div className="relative">
          {/* Track */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-indigo-500 transition-all duration-700"
            style={{ width: `${(currentIdx / (STAGES.length - 1)) * 100}%`, right: 'auto' }}
          />
          <div className="relative flex justify-between">
            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              const done = i <= currentIdx;
              return (
                <div key={stage.key} className="flex flex-col items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center z-10
                    border-2 transition-all duration-300
                    ${done ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-900 border-slate-700'}
                  `}>
                    <Icon size={14} className={done ? 'text-white' : 'text-slate-600'} />
                  </div>
                  <span className={`text-xs text-center max-w-[60px] leading-tight ${done ? 'text-slate-300' : 'text-slate-600'}`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accept offer */}
      {application.status === 'OFFER_SENT' && (
        <div className="card border-indigo-500/30">
          <p className="text-sm font-semibold text-slate-100 mb-1">🎉 You have an offer!</p>
          <p className="text-xs text-slate-400 mb-4">
            Accept your admission offer to confirm your enrollment.
            {application.offerExpiresAt && ` Offer valid until ${formatDate(application.offerExpiresAt)}.`}
          </p>
          <Button variant="primary" loading={acceptOffer.isPending} onClick={handleAccept} id="accept-offer-btn">
            Accept Offer
          </Button>
        </div>
      )}

      {application.status === 'ACCEPTED' && (
        <div className="card border-emerald-500/30 bg-emerald-500/5">
          <p className="text-sm font-semibold text-emerald-400">✓ Your admission has been confirmed.</p>
          <p className="text-xs text-slate-400 mt-1">Welcome to the university! You can now access all student services.</p>
        </div>
      )}
    </div>
  );
};

export default AdmissionStatusPage;
