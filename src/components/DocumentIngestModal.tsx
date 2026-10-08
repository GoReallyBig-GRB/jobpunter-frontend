import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { extractDocumentText, DocumentExtractionResult } from '../utils/documentExtractor';
import { MasterProfile } from '../types/job';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Loader2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface DocumentIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DocumentIngestModal: React.FC<DocumentIngestModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { masterProfile, importProfileDocument, commitImportedProfile } = useJobs();

  const [step, setStep] = useState<'upload' | 'extracting' | 'review'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractionResult, setExtractionResult] = useState<DocumentExtractionResult | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<MasterProfile | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<{ field: string; existing: string; extracted: string }[]>([]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorMsg(null);
    setStep('extracting');

    try {
      // 1. Read real file content & metadata
      const result = await extractDocumentText(file);
      setExtractionResult(result);

      if (!result.extractedText || result.extractedText.length < 50) {
        throw new Error('Extracted text is too brief to formulate a comprehensive profile. Please ensure the file contains readable text.');
      }

      // 2. Parse into structured profile candidate
      const parsed = await importProfileDocument(result.fileName, result.fileType, result.extractedText);
      setExtractedProfile(parsed);

      // 3. Detect conflicts with existing profile
      const detectedConflicts: { field: string; existing: string; extracted: string }[] = [];
      if (masterProfile && masterProfile.candidateName && masterProfile.candidateName !== 'Candidate Profile') {
        if (parsed.candidateName && parsed.candidateName !== masterProfile.candidateName) {
          detectedConflicts.push({
            field: 'Candidate Name',
            existing: masterProfile.candidateName,
            extracted: parsed.candidateName
          });
        }
        if (parsed.primaryProfession && parsed.primaryProfession !== masterProfile.primaryProfession) {
          detectedConflicts.push({
            field: 'Primary Profession',
            existing: masterProfile.primaryProfession,
            extracted: parsed.primaryProfession
          });
        }
        if (parsed.location && parsed.location !== masterProfile.location) {
          detectedConflicts.push({
            field: 'Location',
            existing: masterProfile.location,
            extracted: parsed.location
          });
        }
      }
      setConflicts(detectedConflicts);
      setStep('review');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStep('upload');
    }
  };

  const handleConfirmAuthoritative = () => {
    if (!extractedProfile) return;
    commitImportedProfile(extractedProfile);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-semibold leading-tight">Master Career Profile Document Ingestion</h2>
              <p className="text-xs text-zinc-400">Genuine PDF, DOCX, and TXT File Parser with Provenance Review</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-sm space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs">Document Extraction Notice</p>
                <p className="text-xs mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center hover:border-zinc-500 transition-colors bg-zinc-50">
                <Upload className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                <h3 className="font-medium text-zinc-900 mb-1">Select your resume or career dossier</h3>
                <p className="text-xs text-zinc-500 mb-4 max-w-md mx-auto">
                  Supports real binary PDF (.pdf), Microsoft Word (.docx), and plain text / Markdown (.txt).
                </p>

                <label className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-zinc-800 transition-colors">
                  <FileText className="w-4 h-4" />
                  Browse Document
                  <input 
                    type="file" 
                    accept=".pdf,.docx,.txt" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-600">
                <div className="p-3 bg-zinc-100 rounded-lg">
                  <span className="font-semibold block text-zinc-900 mb-0.5">PDF Extraction</span>
                  Full binary text extraction via pdfjs parsing.
                </div>
                <div className="p-3 bg-zinc-100 rounded-lg">
                  <span className="font-semibold block text-zinc-900 mb-0.5">DOCX Extraction</span>
                  Structured document XML parsing with Mammoth.
                </div>
                <div className="p-3 bg-zinc-100 rounded-lg">
                  <span className="font-semibold block text-zinc-900 mb-0.5">Candidate Control</span>
                  No silent overwrites. Review and confirm changes.
                </div>
              </div>
            </div>
          )}

          {step === 'extracting' && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-zinc-800 animate-spin mx-auto" />
              <h3 className="font-semibold text-zinc-900">Extracting Document &amp; Parsing Career Facts</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Reading {selectedFile?.name}... Parsing structured employment, education, competencies, and achievements.
              </p>
            </div>
          )}

          {step === 'review' && extractedProfile && extractionResult && (
            <div className="space-y-5">
              {/* File Metadata Card */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-md text-emerald-800 font-mono text-xs font-bold uppercase">
                    {extractionResult.fileType}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 text-xs">{extractionResult.fileName}</h4>
                    <p className="text-xs text-zinc-500">
                      {(extractionResult.fileSize / 1024).toFixed(1)} KB · {extractionResult.metadata.wordCount} words · {extractionResult.metadata.pageCount ? `${extractionResult.metadata.pageCount} pages` : 'Plain text'}
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-medium">
                  Extracted Successfully
                </span>
              </div>

              {/* Conflict Detection Banner */}
              {conflicts.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Conflicts Detected with Current Profile
                  </div>
                  <p className="text-xs text-amber-800">
                    The uploaded document contains different information than your current Master Career Profile:
                  </p>
                  <div className="space-y-1.5 text-xs font-mono">
                    {conflicts.map((c, i) => (
                      <div key={i} className="bg-white p-2 rounded border border-amber-200 flex justify-between">
                        <span className="font-bold text-zinc-700">{c.field}:</span>
                        <span className="text-zinc-500 line-through">{c.existing}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 mx-1 inline" />
                        <span className="text-emerald-700 font-semibold">{c.extracted}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Structured Summary */}
              <div className="space-y-3">
                <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider text-zinc-500">
                  Extracted Structured Profile Overview
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <span className="text-zinc-500 block text-[11px]">Candidate Name</span>
                    <input 
                      type="text"
                      value={extractedProfile.candidateName}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, candidateName: e.target.value })}
                      className="font-semibold text-zinc-900 bg-white border border-zinc-300 rounded px-2 py-1 w-full mt-1"
                    />
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <span className="text-zinc-500 block text-[11px]">Primary Profession</span>
                    <input 
                      type="text"
                      value={extractedProfile.primaryProfession}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, primaryProfession: e.target.value })}
                      className="font-semibold text-zinc-900 bg-white border border-zinc-300 rounded px-2 py-1 w-full mt-1"
                    />
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
                  <span className="text-zinc-500 block text-[11px] mb-1">Core Positioning &amp; Value Proposition</span>
                  <textarea 
                    rows={2}
                    value={extractedProfile.corePositioning}
                    onChange={(e) => setExtractedProfile({ ...extractedProfile, corePositioning: e.target.value })}
                    className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-zinc-100 rounded-lg">
                    <span className="text-lg font-bold text-zinc-900 block font-mono">
                      {extractedProfile.structuredData?.employmentHistory?.length || 0}
                    </span>
                    <span className="text-zinc-500 text-[11px]">Roles Identified</span>
                  </div>
                  <div className="p-2.5 bg-zinc-100 rounded-lg">
                    <span className="text-lg font-bold text-zinc-900 block font-mono">
                      {extractedProfile.structuredData?.skills?.reduce((acc, s) => acc + (s.items?.length || 0), 0) || 0}
                    </span>
                    <span className="text-zinc-500 text-[11px]">Skills Extracted</span>
                  </div>
                  <div className="p-2.5 bg-zinc-100 rounded-lg">
                    <span className="text-lg font-bold text-zinc-900 block font-mono">
                      {extractedProfile.structuredData?.education?.length || 0}
                    </span>
                    <span className="text-zinc-500 text-[11px]">Degrees / Credentials</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 'review') setStep('upload');
              else onClose();
            }}
            className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-medium"
          >
            {step === 'review' ? 'Choose Different File' : 'Cancel'}
          </button>

          {step === 'review' && (
            <button
              onClick={handleConfirmAuthoritative}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm &amp; Set as Master Career Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
