import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/forms/FormField';
import { Modal } from '@/components/ui/Modal';
import { academicClient } from '@/api/academicClient';
import { parseError } from '@/utils/errorParser';
import { useToast } from '@/hooks/useToast';
import { Building, BookOpen, Plus, Search, RefreshCw } from 'lucide-react';

export default function AdminCatalogPage() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', title: '', dept: 'Computer Science', credits: '3', level: 'Undergraduate' });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await academicClient.getCourses();
      setCourses(res.data || res || []);
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    const title = (c.title || c.name || '').toLowerCase();
    const code = (c.code || c.courseCode || '').toLowerCase();
    return title.includes(q) || code.includes(q);
  });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.title) {
      showToast({ message: 'Course code and title are required.', type: 'error' });
      return;
    }

    try {
      const payload = {
        code: newCourse.code.toUpperCase(),
        title: newCourse.title,
        department: newCourse.dept,
        credits: parseInt(newCourse.credits, 10),
        level: newCourse.level,
      };

      await academicClient.createCourse(payload);
      showToast({ message: `Course ${payload.code} added to MongoDB catalog!`, type: 'success' });
      setIsAddModalOpen(false);
      setNewCourse({ code: '', title: '', dept: 'Computer Science', credits: '3', level: 'Undergraduate' });
      fetchCourses();
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
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
            Manage university degree programs, department offerings, and course curriculum live from MongoDB.
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
        <Button variant="outline" size="sm" onClick={fetchCourses}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading course catalog from MongoDB...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((course) => (
            <div key={course._id || course.id} className="card p-5 border border-white/10 hover:border-indigo-500/30 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-indigo-400 text-sm px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {course.code || course.courseCode || 'COURSE'}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-100 mt-2">{course.title || course.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{course.department || course.dept || 'Computer Science'} • {course.credits || 3} Credits • {course.level || 'Undergraduate'}</p>
                </div>
                <Badge variant="emerald">{course.status || 'ACTIVE'}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

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
            <Button type="submit" variant="primary">Add Course to DB</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
