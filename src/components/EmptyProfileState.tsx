import React from 'react';
import { useJobs } from '../context/JobContext';
import { UserX, Upload, UserCheck, Plus, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface EmptyProfileStateProps {
  onOpenUploadModal: () => void;
  onStartManualProfile: () => void;
}

export const EmptyProfileState: React.FC<EmptyProfileStateProps> = ({
  onOpenUploadModal,
  onStartManualProfile
}) => {
  const { candidatePresets, switchCandidatePreset } = useJobs();

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-xs max-w-3xl mx-auto my-8 text-center space-y-6">
      <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400 border border-zinc-200">
        <UserX className="w-8 h-8 text-zinc-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">No Master Career Profile Configured</h2>
        <p className="text-xs text-zinc-600 max-w-lg mx-auto leading-relaxed">
          Zero-Cost Job Hunter is candidate-agnostic by architecture. The system never assumes your profession, skills, or constraints. Configure your factual Master Career Profile to unlock precision evidence matching, opportunity evaluation, and tailored application materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left pt-2">
        {/* Option 1: Genuine Document Ingestion */}
        <div 
          onClick={onOpenUploadModal}
          className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100 hover:border-zinc-400 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg group-hover:scale-105 transition-transform">
              <Upload className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded">PDF · DOCX · TXT</span>
          </div>
          <h3 className="font-semibold text-xs text-zinc-900 group-hover:text-emerald-700">Upload Career Document</h3>
          <p className="text-[11px] text-zinc-500 leading-normal">
            Select a real PDF, Word DOCX, or text file. The system will extract your career facts with conflict review.
          </p>
        </div>

        {/* Option 2: Manual Profile Setup */}
        <div 
          onClick={onStartManualProfile}
          className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100 hover:border-zinc-400 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-indigo-100 text-indigo-800 rounded-lg group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded">Custom</span>
          </div>
          <h3 className="font-semibold text-xs text-zinc-900 group-hover:text-indigo-700">Configure Manually</h3>
          <p className="text-[11px] text-zinc-500 leading-normal">
            Enter your personal details, employment history, competencies, and boundaries through structured forms.
          </p>
        </div>
      </div>

      {/* Demo / Testing Fixtures */}
      <div className="pt-4 border-t border-zinc-100 space-y-3">
        <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase block font-mono">
          Or load a reference candidate fixture for testing:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {candidatePresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => switchCandidatePreset(preset.id)}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-medium border border-zinc-200 flex items-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-zinc-600" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
