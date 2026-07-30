import { useQuery } from '@tanstack/react-query';
import { documentClient } from '@/api/documentClient';

export const useMyCertificates = () =>
  useQuery({
    queryKey: ['documents', 'certificates', 'mine'],
    queryFn: documentClient.getMyCertificates,
  });

export const useDownloadFile = () => {
  const downloadFile = async (id, filename = 'download') => {
    const blob = await documentClient.downloadFile(id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return { downloadFile };
};
