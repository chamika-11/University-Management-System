import { useQuery } from '@tanstack/react-query';
import { academicClient } from '@/api/academicClient';

export const useCourses = (filters = {}) =>
  useQuery({
    queryKey: ['academics', 'courses', filters],
    queryFn: () => academicClient.getCourses(filters),
    keepPreviousData: true,
  });

export const useCourse = (id) =>
  useQuery({
    queryKey: ['academics', 'course', id],
    queryFn: () => academicClient.getCourse(id),
    enabled: !!id,
  });

export const useSyllabus = (courseId) =>
  useQuery({
    queryKey: ['academics', 'syllabus', courseId],
    queryFn: () => academicClient.getSyllabus(courseId),
    enabled: !!courseId,
  });

export const usePrerequisites = (courseId) =>
  useQuery({
    queryKey: ['academics', 'prerequisites', courseId],
    queryFn: () => academicClient.getPrerequisites(courseId),
    enabled: !!courseId,
  });

export const useDepartments = () =>
  useQuery({
    queryKey: ['academics', 'departments'],
    queryFn: academicClient.getDepartments,
    staleTime: 10 * 60_000, // departments rarely change
  });

export const usePrograms = () =>
  useQuery({
    queryKey: ['academics', 'programs'],
    queryFn: academicClient.getPrograms,
    staleTime: 10 * 60_000,
  });

export const useCurrentSemester = () =>
  useQuery({
    queryKey: ['academics', 'currentSemester'],
    queryFn: academicClient.getCurrentSemester,
  });
