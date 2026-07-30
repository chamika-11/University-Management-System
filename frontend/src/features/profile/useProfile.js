import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userClient } from '@/api/userClient';

export const useMyProfile = () =>
  useQuery({
    queryKey: ['profile', 'me'],
    queryFn: userClient.getMyProfile,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userClient.updateMyProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', 'me'] }),
  });
};

export const useAddresses = () =>
  useQuery({
    queryKey: ['profile', 'addresses'],
    queryFn: userClient.getAddresses,
  });

export const useAddAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userClient.addAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', 'addresses'] }),
  });
};

export const useEmergencyContacts = () =>
  useQuery({
    queryKey: ['profile', 'emergency-contacts'],
    queryFn: userClient.getEmergencyContacts,
  });

export const useAddEmergencyContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userClient.addEmergencyContact,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', 'emergency-contacts'] }),
  });
};
