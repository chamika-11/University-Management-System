import React, { useState } from 'react';
import { Layers, Upload, Plus, FileText, Video, Link } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormField, Input, Select } from '@/components/forms/FormField';
import { useToast } from '@/hooks/useToast';

export default function FacultyContentPage() {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    if (!title) {
      showToast({ message: 'Content title is required.', type: 'error' });
      return;
    }
    showToast({ message: `Published "${title}" to course section!`, type: 'success' });
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-400" />
            Course Content Authoring & Materials
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Upload lecture notes, attach video recordings, and publish weekly syllabus modules.
          </p>
        </div>
      </div>

      <div className="card p-6 bg-slate-900 border border-white/10 max-w-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-400" /> Publish New Material
        </h3>

        <form onSubmit={handleUpload} className="space-y-4">
          <FormField label="Target Course Section">
            <Select>
              <option>CS101 - Intro to Computer Science (Sec 01)</option>
              <option>SE302 - Software Architecture (Sec 02)</option>
            </Select>
          </FormField>

          <FormField label="Material Title">
            <Input placeholder="Module 4: Distributed Systems & Microservices" value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormField>

          <FormField label="Material Type">
            <Select>
              <option>📄 Lecture Document / PDF</option>
              <option>🎥 Recorded Video Lecture Link</option>
              <option>🔗 Web Resource / Article</option>
            </Select>
          </FormField>

          <Button type="submit" variant="primary" size="md" className="flex items-center gap-2 shadow-lg shadow-indigo-600/20">
            <Upload className="w-4 h-4" /> Publish Material
          </Button>
        </form>
      </div>
    </div>
  );
}
