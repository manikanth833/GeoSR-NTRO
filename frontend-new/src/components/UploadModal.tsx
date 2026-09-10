import React, { DragEvent, useRef, useState } from 'react';
import { ImageUp, X } from 'lucide-react';
import { api } from '../services/api';
import { SceneMetadata } from '../types';
import { ErrorBanner } from './ErrorBanner';
import { LoadingSpinner } from './LoadingSpinner';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (scene: SceneMetadata) => void;
}

const ACCEPTED_EXTENSIONS = /\.(png|jpe?g|tiff?)$/i;

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploaded }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectFile = (candidate?: File) => {
    setError(null);
    if (!candidate) return;
    if (!ACCEPTED_EXTENSIONS.test(candidate.name)) {
      setFile(null);
      setError('Choose a PNG, JPEG, TIFF, or GeoTIFF image.');
      return;
    }
    setFile(candidate);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    selectFile(event.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Choose an image before starting the upload.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await api.uploadImage(file);
      onUploaded(result.metadata);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300"><ImageUp className="w-4 h-4" /></div>
            <div><h3 className="font-bold text-base">Upload Satellite Image</h3><p className="text-xs text-slate-400 font-mono">PNG, JPEG, TIFF, or GeoTIFF — maximum 25 MB</p></div>
          </div>
          {!loading && <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"><X className="w-5 h-5" /></button>}
        </div>
        {loading ? <LoadingSpinner label="Uploading and preparing RGBN enhancement layers..." /> : <>
          <div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} onClick={() => inputRef.current?.click()} className="cursor-pointer rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-[#111723] p-8 text-center transition-colors">
            <ImageUp className="w-8 h-8 mx-auto text-emerald-400 mb-3" />
            <p className="text-sm font-semibold text-slate-200">Drop an image here or click to browse</p>
            <p className="text-xs text-slate-500 mt-1">{file ? file.name : 'Your RGB image will receive a synthetic NIR proxy for demo analysis.'}</p>
            <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg,.tif,.tiff,image/png,image/jpeg,image/tiff" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
          </div>
          {error && <ErrorBanner title="Upload Error" message={error} />}
          <button onClick={handleUpload} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 disabled:text-slate-400 font-bold text-sm transition-colors" disabled={!file}>Upload & Prepare Enhancement</button>
        </>}
      </div>
    </div>
  );
};
