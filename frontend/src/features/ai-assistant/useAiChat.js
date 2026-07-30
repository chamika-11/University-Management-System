import { useMutation } from '@tanstack/react-query';
import { aiRagClient } from '@/api/aiRagClient';

export const useAiChat = () =>
  useMutation({
    mutationFn: aiRagClient.chat,
  });
