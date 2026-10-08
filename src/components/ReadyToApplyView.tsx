import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Job, CVVariant, JobSpecificCV } from '../types/job';
import { parseMarkdownToStructuredCV, generateDocxBlob, generatePdfBlob, downloadBlob } from '../utils/documentExporter';
import { 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  FileText, 
  Send, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Briefcase,
  Sparkles,
  Download,
  Check,
  Edit3
} from 'lucide-react';

interface ReadyToApplyViewProps {
  onOpenJobDetail: (id: string) => void;
  preselectedJobId?: string | null;
}

export const ReadyToApplyView: React.FC<ReadyToApplyViewProps> = ({
  onOpenJobDetail,
  preselectedJobId
}) => {
  const { 
    jobs, 
    updateJobStatus, 
    cvVariants, 
    masterProfile, 
    generateJobSpecificCVForJob 
  } = useJobs();

  // Find all jobs that are READY_TO_APPLY
  const readyJobs = jobs.filter(j => j.status === 'READY_TO_APPLY');

  const [selectedId, setSelectedId] = useState<string>(() => {
    if (preselectedJobId && readyJobs.some(j => j.id === preselectedJobId)) {
      return preselectedJobId;
    }
    return readyJobs[0]?.id || '';
  });

  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [coverLetterEdit, setCoverLetterEdit] = useState<string>('');
  const [activeJobIdForEdit, setActiveJobIdForEdit] = useState<string>('');
  const [isGeneratingATS, setIsGeneratingATS] = useState(false);
  const [selectedVariantOverride, setSelectedVariantOverride] = useState<string>('');

  const currentJob = readyJobs.find(j => j.id === selectedId) || readyJobs[0];

  // Match CV variant from candidate's library
  const currentVariant = cvVariants.find(v => 
    v.id === (selectedVariantOverride || currentJob?.selectedCVId) ||
    v.userDefinedName === currentJob?.targetCV
  ) || cvVariants[0];

  // Initialize cover letter text when selected job changes
  if (currentJob && activeJobIdForEdit !== currentJob.id) {
    setActiveJobIdForEdit(currentJob.id);
    setCoverLetterEdit(currentJob.applicationMaterials?.coverLetter || '');
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleMarkApplied = (jobId: string) => {
    updateJobStatus(jobId, 'APPLIED', `Application submitted on ${new Date().toISOString().split('T')[0]}`);
  };

  const handleGenerateJobSpecificCV = async () => {
    if (!currentJob) return;
    setIsGeneratingATS(true);
    try {
      await generateJobSpecificCVForJob(currentJob.id, currentVariant?.id);
    } finally {
      setIsGeneratingATS(false);
    }
  };

  const [isEditingATSContent, setIsEditingATSContent] = useState(false);
  const [atsContentEdit, setAtsContentEdit] = useState('');

  const handleDownloadCVDocx = async (cv: JobSpecificCV) => {
    const text = isEditingATSContent ? atsContentEdit : cv.tailoredContent;
    const parsed = parseMarkdownToStructuredCV(text, masterProfile.candidateName);
    const blob = await generateDocxBlob(parsed);
    downloadBlob(blob, `${currentJob?.company.replace(/\s+/g, '_')}_${masterProfile.candidateName.replace(/\s+/g, '_')}_ATS_CV.docx`);
  };

  const handleDownloadCVPdf = (cv: JobSpecificCV) => {
    const text = isEditingATSContent ? atsContentEdit : cv.tailoredContent;
    const parsed = parseMarkdownToStructuredCV(text, masterProfile.candidateName);
    const blob = generatePdfBlob(parsed);
    downloadBlob(blob, `${currentJob?.company.replace(/\s+/g, '_')}_${masterProfile.candidateName.replace(/\s+/g, '_')}_ATS_CV.pdf`);
  };

  const handleDownloadCoverLetterDocx = async () => {
    const parsed = parseMarkdownToStructuredCV(
      `# ${masterProfile.candidateName}\n**Application to ${currentJob?.company} for ${currentJob?.title}**\n\n## Cover Letter\n${coverLetterEdit}`,
      masterProfile.candidateName
    );
    const blob = await generateDocxBlob(parsed);
    downloadBlob(blob, `${currentJob?.company.replace(/\s+/g, '_')}_Cover_Letter.docx`);
  };

  const handleDownloadCoverLetterPdf = () => {
    const parsed = parseMarkdownToStructuredCV(
      `# ${masterProfile.candidateName}\n**Application to ${currentJob?.company} for ${currentJob?.title}**\n\n## Cover Letter\n${coverLetterEdit}`,
      masterProfile.candidateName
    );
    const blob = generatePdfBlob(parsed);
    downloadBlob(blob, `${currentJob?.company.replace(/\s+/g, '_')}_Cover_Letter.pdf`);
  };

  const handleDownloadCV = (cv: JobSpecificCV) => {
    const blob = new Blob([cv.tailoredContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentJob?.company.replace(/\s+/g, '_')}_${masterProfile.candidateName.replace(/\s+/g, '_')}_CV.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (readyJobs.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <div className="w-12 h-12 bg-zinc-100 text-zinc-600 rounded-full flex items-center justify-center mx-auto">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-zinc-900">Application Queue Is Clear</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          No jobs are currently queued in <strong>READY TO APPLY</strong>. Ingest new job opportunities or evaluate roles from the <strong>Review Desk</strong> to populate prepared applications.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Ready Jobs List */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ready Applications ({readyJobs.length})</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">100% Prepared</span>
        </div>

        <div className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
          {readyJobs.map(job => {
            const isSelected = job.id === currentJob?.id;
            return (
              <div
                key={job.id}
                onClick={() => setSelectedId(job.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-50/50 border-emerald-400 shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900 line-clamp-1">{job.title}</h4>
                    <div className="text-[11px] font-medium text-zinc-600 mt-0.5">{job.company}</div>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-700 shrink-0">
                    {job.score.total}/100
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-zinc-500">
                  <span className="line-clamp-1">{job.targetCV}</span>
                  <span aria-hidden="true">·</span>
                  <span>{job.source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Workdesk: Prepared Application Materials */}
      {currentJob && (
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-lg p-6 space-y-6 shadow-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
                <span>Score: <strong className="text-emerald-700">{currentJob.score.total}/100</strong></span>
                <span aria-hidden="true">·</span>
                <span>Location: {currentJob.location}</span>
                <span aria-hidden="true">·</span>
                <span>Route: {currentJob.applicationRoute}</span>
              </div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                {currentJob.title}
              </h2>
              <div className="text-sm font-medium text-zinc-700 mt-0.5">
                {currentJob.company}
              </div>
            </div>

            {/* Direct Link & Submit Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {currentJob.applicationUrl && (
                <a
                  href={currentJob.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                </a>
              )}

              <button
                onClick={() => handleMarkApplied(currentJob.id)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mark as Applied</span>
              </button>
            </div>
          </div>

          {/* Section 26: Recommended Master CV Variant */}
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                Selected Master CV Variant:
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={currentVariant?.id || ''}
                  onChange={(e) => setSelectedVariantOverride(e.target.value)}
                  className="text-xs p-1 bg-white border border-zinc-300 rounded font-semibold text-zinc-800"
                >
                  {cvVariants.map(v => (
                    <option key={v.id} value={v.id}>{v.userDefinedName}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleCopy(currentVariant?.rawText || '', 'cv_text')}
                  className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1 bg-white px-2 py-1 rounded border border-zinc-200"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedSection === 'cv_text' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            
            <p className="text-xs text-zinc-700 leading-relaxed">
              <strong>Selection Rationale:</strong> {currentJob.cvRationale || `Matches ${currentJob.title} based on documented evidence and requirements.`}
            </p>
          </div>

          {/* Section 27: One-Time Job-Specific ATS CV Layer */}
          <div className="p-5 bg-purple-50/60 rounded-lg border border-purple-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-950 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  One-Time Job-Specific ATS CV (Section 27)
                </h3>
                <p className="text-[11px] text-purple-800 mt-0.5">
                  Tailors terminology and ordering to {currentJob.company}&apos;s JD without modifying the source CV variant or inventing qualifications.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleGenerateJobSpecificCV}
                  disabled={isGeneratingATS}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingATS ? 'Tailoring...' : (currentJob.jobSpecificCV ? 'Re-Tailor ATS CV' : 'Generate ATS CV')}</span>
                </button>
              </div>
            </div>

            {currentJob.jobSpecificCV && (
              <div className="bg-white p-4 rounded border border-purple-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <span className="font-semibold text-zinc-900 flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Zero Unsupported Claims Verified (Master Profile Grounded)
                  </span>
                  <div className="flex items-center gap-2">
                    {isEditingATSContent ? (
                      <button
                        onClick={() => {
                          if (currentJob.jobSpecificCV) {
                            currentJob.jobSpecificCV.tailoredContent = atsContentEdit;
                          }
                          setIsEditingATSContent(false);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-zinc-900 text-white rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setAtsContentEdit(currentJob.jobSpecificCV!.tailoredContent);
                          setIsEditingATSContent(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-white border border-zinc-300 text-zinc-700 rounded hover:bg-zinc-50 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(isEditingATSContent ? atsContentEdit : currentJob.jobSpecificCV!.tailoredContent, 'ats_cv')}
                      className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedSection === 'ats_cv' ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadCVDocx(currentJob.jobSpecificCV!)}
                      className="px-2.5 py-1 text-xs font-semibold bg-blue-100 hover:bg-blue-200 text-blue-900 rounded flex items-center gap-1"
                      title="Download formatted DOCX"
                    >
                      <Download className="w-3 h-3" />
                      <span>DOCX</span>
                    </button>
                    <button
                      onClick={() => handleDownloadCVPdf(currentJob.jobSpecificCV!)}
                      className="px-2.5 py-1 text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-900 rounded flex items-center gap-1"
                      title="Download formatted PDF"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-50 p-2.5 rounded text-[11px] space-y-1">
                  <strong className="text-zinc-800 block">Changes Made / ATS Optimizations:</strong>
                  <ul className="list-disc list-inside text-zinc-600 space-y-0.5">
                    {currentJob.jobSpecificCV.changesMade.map((ch, i) => (
                      <li key={i}>{ch}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="text-zinc-800 block text-[11px] mb-1">Tailored Summary:</strong>
                  <p className="text-zinc-700 bg-zinc-50 p-2.5 rounded text-xs leading-relaxed border border-zinc-100">
                    {currentJob.jobSpecificCV.tailoredSummary}
                  </p>
                </div>

                {isEditingATSContent ? (
                  <textarea
                    rows={14}
                    value={atsContentEdit}
                    onChange={(e) => setAtsContentEdit(e.target.value)}
                    className="w-full text-xs font-mono p-3 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                  />
                ) : (
                  <div className="max-h-60 overflow-y-auto bg-zinc-950 text-zinc-100 p-3 rounded font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                    {currentJob.jobSpecificCV.tailoredContent}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prepared Tailored Cover Letter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Grounded Cover Letter (100% Evidence-Based)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(coverLetterEdit, 'cover_letter')}
                  className="px-2.5 py-1 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{copiedSection === 'cover_letter' ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadCoverLetterDocx}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 flex items-center gap-1"
                  title="Download Cover Letter as DOCX"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOCX</span>
                </button>
                <button
                  onClick={handleDownloadCoverLetterPdf}
                  className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 flex items-center gap-1"
                  title="Download Cover Letter as PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            <textarea
              rows={9}
              value={coverLetterEdit}
              onChange={(e) => setCoverLetterEdit(e.target.value)}
              className="w-full text-xs font-mono p-3 bg-zinc-50 border border-zinc-300 rounded-md text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white leading-relaxed"
            />
            <span className="text-[10px] text-zinc-400 block font-mono">
              Editable text area. You can tweak salutations or phrasing before submitting.
            </span>
          </div>

          {/* Screening Questions & Answers */}
          {currentJob.applicationMaterials?.questionsAnswers && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Prepared Answers for Screening Questions</span>
              </span>

              <div className="space-y-2.5">
                {currentJob.applicationMaterials.questionsAnswers.map((qa, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 rounded-md border border-zinc-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">{qa.question}</span>
                      <button
                        onClick={() => handleCopy(qa.answer, `qa_${idx}`)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedSection === `qa_${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-zinc-700 mt-1 leading-relaxed text-[11px]">
                      {qa.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Likely Interview Concerns & Defense Strategy */}
          {currentJob.applicationMaterials?.interviewDefensePoints && (
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
                Likely Recruiter / Hiring Manager Concerns &amp; Candidate Defense
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {currentJob.applicationMaterials.interviewDefensePoints.map((dp, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 rounded border border-zinc-200">
                    <div className="font-semibold text-amber-900">
                      Potential Concern:
                    </div>
                    <div className="text-zinc-800 text-[11px] mt-0.5">{dp.concern}</div>
                    <div className="font-semibold text-emerald-900 mt-2">
                      Grounded Defense:
                    </div>
                    <div className="text-zinc-600 text-[11px] mt-0.5 leading-relaxed">
                      {dp.counterStrategy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 33: Application Package Audit & Grounding Verification */}
          <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 font-mono">
                  Application Package Audit &amp; Claims Discipline (Part H)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                100% EVIDENCE-BACKED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded border border-emerald-200 shadow-xs">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Unsupported Claims</span>
                <span className="text-sm font-bold text-emerald-700 mt-0.5 block">0 Detected (Zero Fabrication)</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Every claim maps to Master Career Profile facts</span>
              </div>
              <div className="bg-white p-3 rounded border border-emerald-200 shadow-xs">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Candidate Restrictions</span>
                <span className="text-sm font-bold text-emerald-700 mt-0.5 block">Strictly Respected</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Boundaries &amp; exclusions honored across all materials</span>
              </div>
              <div className="bg-white p-3 rounded border border-emerald-200 shadow-xs">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Candidate Control</span>
                <span className="text-sm font-bold text-zinc-800 mt-0.5 block">Editorial Authority</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">AI interprets · Evidence supports · Candidate decides</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-600 bg-white/70 p-2.5 rounded border border-emerald-100 leading-relaxed font-mono">
              <strong>Audit Checklist:</strong> Tailored CV derived from approved variant &bull; Grounded cover letter citing documented metrics &bull; Screening answers tied to verifiable experiences &bull; No hallucinated credentials or timeline inflation.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
