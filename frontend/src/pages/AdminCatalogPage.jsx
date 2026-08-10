import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/forms/FormField';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import { Building, BookOpen, Plus, Search, Layers, Edit, Trash2 } from 'lucide-react';

const mockCourses = [
  { id: 'CS-101', code: 'CS101', title: 'Introduction to Computer Science', dept: 'Computer Science', credits: 4, level: 'Undergraduate', status: 'ACTIVE' },
  { id: 'SE-302', code: 'SE302', title: 'Software Architecture & Microservices', dept: 'Software Engineering', credits: 3, level: 'Undergraduate', status: 'ACTIVE' },
  { id: 'AI-401', code: 'AI401', title: 'Artificial Intelligence & Neural Networks', dept: 'Artificial Intelligence', credits: 4, level: 'Graduate', status: 'ACTIVE' },
  { id: 'DS-201', code: 'DS201', title: 'Data Structures & Algorithms', dept: 'Data Science', credits: 4, level: 'Undergraduate', status: 'ACTIVE' },
];

export default function AdminCatalogPage() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState(mockCourses);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', title: '', dept: 'Computer Science', credits: '3', level: 'Undergraduate' });

  const filtered = courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.title) {
      showToast({ message: 'Course code and title are required.', type: 'error' });
      return;
    }

    const created = {
      id: newCourse.code,
      code: newCourse.code.toUpperCase(),
      title: newCourse.title,
      dept: newCourse.dept,
      credits: parseInt(newCourse.credits, 10),
      level: newCourse.level,
      status: 'ACTIVE',
    };

    setCourses([created, ...courses]);
    setIsAddModalOpen(false);
    setNewCourse({ code: '', title: '', dept: 'Computer Science', credits: '3', level: 'Undergraduate' });
    showToast({ message: `Course ${created.code} added to catalog!`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Building className="w-7 h-7 text-indigo-400" />
            Academic Catalog Governance
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Manage university degree programs, department offerings, and course curriculum.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <Plus className="w-4 h-4" /> Add New Course
        </Button>
      </div>

      <div className="card p-4 bg-slate-900/80 border border-white/5 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search catalog..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 text-xs" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((course) => (
          <div key={course.id} className="card p-5 border border-white/10 hover:border-indigo-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-bold text-indigo-400 text-sm px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  {course.code}
                </span>
                <h3 className="text-lg font-semibold text-slate-100 mt-2">{course.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{course.dept} • {course.credits} Credits • {course.level}</p>
              </div>
              <Badge variant="emerald">{course.status}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Course to Catalog">
        <form onSubmit={handleAddCourse} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
              <Input placeholder="CS-405" value={newCourse.code} onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Credit Hours</label>
              <Input type="number" value={newCourse.credits} onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title</label>
            <Input placeholder="Cloud Computing & Distributed Systems" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Course</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
