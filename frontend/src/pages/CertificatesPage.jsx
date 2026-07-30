import React from 'react';
import { useMyCertificates, useDownloadFile } from '@/features/documents/useDocuments';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/utils/formatters';
import { GraduationCap, Download, Award } from 'lucide-react';

const CertificatesPage = () => {
  const { data, isLoading } = useMyCertificates();
  const { downloadFile } = useDownloadFile();

  const certs = Array.isArray(data) ? data : data?.certificates || [];

  const handleDownload = (cert) => {
    downloadFile(cert.fileId || cert._id, `${cert.name || 'certificate'}.pdf`);
  };

  return (
    <div className="animate-fade-in">
      {isLoading ? <PageSpinner /> : certs.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No certificates yet" description="Certificates you earn will appear here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert) => (
            <div key={cert._id} className="card flex flex-col gap-4 hover:border-indigo-500/20 transition-all duration-200">
              <div className="h-24 bg-gradient-to-br from-amber-900/20 to-indigo-900/20 rounded-xl flex items-center justify-center">
                <Award size={36} className="text-amber-400/60" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-200">{cert.name || cert.title}</h3>
                {cert.issuedDate && (
                  <p className="text-xs text-slate-500 mt-1">Issued {formatDate(cert.issuedDate)}</p>
                )}
                {cert.course && <p className="text-xs text-slate-500">{cert.course}</p>}
              </div>
              <div className="flex items-center justify-between">
                <Badge color="emerald">Verified</Badge>
                <Button size="xs" variant="secondary" onClick={() => handleDownload(cert)}>
                  <Download size={12} /> PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
