import React from 'react';
import { useJobs } from '../context/JobContext';
import { NavTab } from './Sidebar';
export type { NavTab };
import { 
  Download, 
  PlusCircle, 
  UserCheck, 
  Upload, 
  MapPin, 
  Layers,
  Sparkles,
  FileCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenIngestModal: () => void;
  onOpenUploadModal: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenIngestModal,
  onOpenUploadModal,
  title = 'Master Career Profile',
  subtitle
}) => {
  const { 
    exportCSV, 
    exportJSON,
    masterProfile, 
    activePresetId, 
    candidatePresets, 
    switchCandidatePreset 
  } = useJobs();

  const hasCandidate = masterProfile && masterProfile.candidateName && masterProfile.candidateName.trim().length > 0;

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-30 px-6 py-2.5 flex items-center justify-between shadow-2xs">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 leading-tight">{title}</h2>
          {subtitle && (
            <p className="text-[11px] text-zinc-500 font-normal leading-none mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Action Controls & Candidate Selector */}
      <div className="flex items-center gap-3 text-xs">
        {/* Candidate Switcher Dropdown */}
        <div className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200/80 px-2.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-800 transition-colors">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-zinc-500 text-[11px] font-medium">Candidate:</span>
          <select
            value={activePresetId}
            onChange={(e) => switchCandidatePreset(e.target.value)}
            className="bg-transparent text-zinc-900 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            {candidatePresets.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            {activePresetId === 'custom' && (
              <option value="custom">Custom Ingested Profile</option>
            )}
            <option value="none">Empty (No Candidate)</option>
          </select>
        </div>

        {/* Location & Authorization Pill */}
        {hasCandidate && masterProfile.location && (
          <div className="hidden lg:flex items-center gap-1.5 text-zinc-500 text-xs px-2 py-1 bg-zinc-50 rounded-md border border-zinc-200">
            <MapPin className="w-3 h-3 text-zinc-400" />
            <span className="truncate max-w-[140px]">{masterProfile.location}</span>
          </div>
        )}

        {/* Upload Resume / Document Button */}
        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg font-medium border border-zinc-200 transition-colors cursor-pointer"
          title="Upload real PDF, DOCX, or TXT dossier"
        >
          <Upload className="w-3.5 h-3.5 text-zinc-600" />
          <span>Upload File</span>
        </button>

        {/* Ingest Job Alert Button */}
        <button
          onClick={onOpenIngestModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium shadow-2xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Add Job</span>
        </button>

        {/* Export Data */}
        <div className="flex items-center gap-1 pl-1 border-l border-zinc-200">
          <button
            onClick={exportCSV}
            className="p-1.5 text-zinc-500 hover:text-zinc-800 rounded-md hover:bg-zinc-100 transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
