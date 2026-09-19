import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

export default function ImageDropzone({ selectedFile, previewUrl, onFileSelected, onReset }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const validateAndSelect = (file) => {
    setErrorMsg('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 15MB limit.');
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {errorMsg && (
        <div className="mb-3 p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-indigo-900/50 bg-slate-950/80 p-2 group">
          <div className="relative aspect-square max-h-[340px] mx-auto rounded-lg overflow-hidden flex items-center justify-center bg-slate-900">
            <img
              src={previewUrl}
              alt="Footprint preview"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mt-3 flex items-center justify-between px-2 text-xs text-slate-300">
            <span className="truncate max-w-[200px] font-mono text-indigo-300">
              {selectedFile?.name || 'Footprint Image'}
            </span>
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/50 hover:bg-rose-800/70 border border-rose-700/60 text-rose-200 text-xs font-semibold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[260px] ${
            isDragOver
              ? 'border-indigo-400 bg-indigo-950/30 shadow-lg shadow-indigo-500/10'
              : 'border-indigo-900/50 bg-slate-950/50 hover:border-indigo-700 hover:bg-slate-900/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <div className="w-14 h-14 rounded-full bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-semibold text-slate-100">
            Upload Wildlife Footprint Image
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Drag and drop your image here, or click to browse files
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">JPEG</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">PNG</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">WEBP</span>
            <span>(224 × 224 RGB Recommended)</span>
          </div>
        </div>
      )}
    </div>
  );
}
