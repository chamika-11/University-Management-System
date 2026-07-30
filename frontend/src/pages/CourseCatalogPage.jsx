import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses, useDepartments } from '@/features/catalog/useCatalog';
import { FormField } from '@/components/forms/FormField';
import { Select } from '@/components/forms/Select';
import { Input } from '@/components/forms/FormField';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { CourseCard } from '@/components/course-card/CourseCard';
import { EnrollButton } from '@/components/course-card/EnrollButton';
import { useDebounce } from '@/hooks/useDebounce';
import { BookOpen, Search } from 'lucide-react';

const CourseCatalogPage = () => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);
  const { data: departments } = useDepartments();
  const { data, isLoading } = useCourses({ q: debouncedSearch, department, page, limit: 12 });

  const courses = Array.isArray(data) ? data : data?.courses || data?.data || [];
  const totalPages = data?.totalPages || data?.pages || 1;

  return (
    <div className="animate-fade-in">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <Input
            id="catalog-search"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select
          id="catalog-dept-filter"
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
          className="sm:w-48"
        >
          <option value="">All Departments</option>
          {(Array.isArray(departments) ? departments : departments?.departments || []).map((d) => (
            <option key={d._id || d.code} value={d._id || d.code}>{d.name}</option>
          ))}
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses found" description="Try a different search term or filter." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const section = course.sections?.[0];
            const seatsLeft = section ? (section.capacity - (section.enrolled || 0)) : 1;
            return (
              <div key={course._id} className="relative">
                <Link to={`/catalog/${course._id}`} className="block">
                  <CourseCard course={course} />
                </Link>
                {/* Overlay enroll button */}
                <div className="mt-2">
                  {section && <EnrollButton course={course} section={section} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default CourseCatalogPage;
