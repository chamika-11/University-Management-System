import React from 'react';
import { Upload } from 'lucide-react';

export function FileUpload({ onSelect, accept = '*/*', disabled }) {
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onSelect(e.target.files[0]);
    }
  };

  return (
    <div className="relative border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors">
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
      <p className="text-xs font-semibold text-slate-200">Click or drag file to upload</p>
      <p className="text-[11px] text-slate-500 mt-1">PDF, DOCX, ZIP up to 25MB</p>
    </div>
  );
}

export default FileUpload;
