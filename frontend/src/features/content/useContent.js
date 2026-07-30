import { useQuery } from '@tanstack/react-query';
import { contentClient } from '@/api/contentClient';

export const useModules = (courseId) =>
  useQuery({
    queryKey: ['content', 'modules', courseId],
    queryFn: () => contentClient.getModules({ courseId }),
    enabled: !!courseId,
  });

export const useLessons = (moduleId) =>
  useQuery({
    queryKey: ['content', 'lessons', moduleId],
    queryFn: () => contentClient.getLessons(moduleId),
    enabled: !!moduleId,
  });

export const useLiveSessions = (sectionId) =>
  useQuery({
    queryKey: ['live-sessions', sectionId],
    queryFn: () => contentClient.getLiveSessions(sectionId),
    enabled: !!sectionId,
  });
