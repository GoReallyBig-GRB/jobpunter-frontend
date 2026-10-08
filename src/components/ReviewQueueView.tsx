import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Job, CVVariant, JobDecision } from '../types/job';
import { CV_VARIANTS } from '../data/evidenceProfile';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  ShieldAlert, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Eye,
  Bookmark
} from 'lucide-react';

interface ReviewQueueViewProps {
  onOpenJobDetail: (id: string) => void;
  preselectedJobId?: string | null;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({
  onOpenJobDetail,
  preselectedJobId
}) => {
  const { jobs, overrideJobDecision, updateJobStatus } = useJobs();

  // Find all jobs that need human review (decision REVIEW or WATCH)
  const reviewJobs = jobs.filter(j => (j.decision === 'REVIEW' || j.decision === 'WATCH') && (j.status === 'REVIEW' || j.status === 'WATCHLIST' || j.status === 'NEW'));

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (preselectedJobId) {
      const idx = reviewJobs.findIndex(j => j.id === preselectedJobId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const [selectedCVOverride, setSelectedCVOverride] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const currentJob: Job | undefined = reviewJobs[currentIndex] || reviewJobs[0];

  const handleAction = (action: JobDecision | 'KEEP_FOR_LATER') => {
    if (!currentJob) return;

    if (action === 'APPLY') {
      overrideJobDecision(
        currentJob.id, 
        'APPLY', 
        selectedCVOverride || currentJob.targetCV, 
        reviewNote || "User approved from Review Decision Desk"
      );
    } else if (action === 'REJECT') {
      overrideJobDecision(
        currentJob.id, 
        'REJECT', 
        undefined, 
        reviewNote || "User rejected from Review Decision Desk"
      );
    } else if (action === 'WATCH') {
      overrideJobDecision(
        currentJob.id,
        'WATCH',
        undefined,
        reviewNote || "User moved to Watchlist"
      );
    } else {
      updateJobStatus(currentJob.id, 'REVIEW', reviewNote || "Kept in review backlog for future evaluation");
    }

    setReviewNote('');
    setSelectedCVOverride(null);
    if (currentIndex >= reviewJobs.length - 1) {
      setCurrentIndex(Math.max(0, reviewJobs.length - 2));
    }
  };

  if (reviewJobs.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-zinc-900">Review Backlog Is Clear</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          No borderline opportunities are currently awaiting human intervention. The deterministic screener has categorized all ingested jobs into verified APPLY or hard REJECT.
        </p>
      </div>
    );
  }

  const effectiveCV = selectedCVOverride || currentJob.targetCV;

  return (
    <div className="space-y-6">
      {/* Top Review Desk Header */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-amber-950">
              Human Intervention Decision Desk
            </h2>
            <p className="text-xs text-amber-800">
              Single-screen candidate decision desk with requirement-level evidence, gaps, and route verification.
            </p>
          </div>
        </div>

        {/* Counter & Nav */}
        <div className="flex items-center gap-2 text-xs font-mono self-end sm:self-center">
          <span className="text-amber-900 font-semibold">
            Opportunity {currentIndex + 1} of {reviewJobs.length}
          </span>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => {
                setCurrentIndex(prev => Math.max(0, prev - 1));
                setSelectedCVOverride(null);
                setReviewNote('');
              }}
              disabled={currentIndex === 0}
              className="p-1 rounded bg-white border border-amber-300 text-amber-900 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentIndex(prev => Math.min(reviewJobs.length - 1, prev + 1));
                setSelectedCVOverride(null);
                setReviewNote('');
              }}
              disabled={currentIndex === reviewJobs.length - 1}
              className="p-1 rounded bg-white border border-amber-300 text-amber-900 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Review Decision Desk Container */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs space-y-6">
        {/* 1. Header Bar: JOB, COMPANY, DECISION, SCORE, ROUTE, LOCATION, SENIORITY, CONFIDENCE */}
        <div className="p-6 bg-zinc-50 border-b border-zinc-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
                <span className="font-semibold text-zinc-800">{currentJob.company}</span>
                <span aria-hidden="true">·</span>
                <span>Source: {currentJob.source}</span>
                <span aria-hidden="true">·</span>
                <span>Confidence: <strong className="text-zinc-900">{currentJob.parserConfidence}</strong></span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                {currentJob.title}
              </h3>
            </div>

            {/* Score & Verdict badges */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right font-mono">
                <span className="text-[10px] text-zinc-400 uppercase block">Total Score</span>
                <span className="text-2xl font-bold text-amber-800 block">
                  {currentJob.score.total}<span className="text-xs text-zinc-400">/100</span>
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  Core PM:{currentJob.detailedScores?.corePMScore} | Dom:{currentJob.detailedScores?.domainScore}
                </span>
              </div>

              {currentJob.jobUrl && (
                <a
                  href={currentJob.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 transition-colors flex items-center gap-1.5"
                >
                  <span>Open Posting</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Attribute Bar: Location, Seniority, Route, Freshness */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-200 text-xs">
            <div className="p-2.5 bg-white rounded border border-zinc-200">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Location &amp; Work Auth</span>
              <span className="font-semibold text-zinc-800 block mt-0.5">{currentJob.location}</span>
              <span className="text-[10px] text-zinc-500 font-mono block">Status: {currentJob.remoteEligibility}</span>
            </div>

            <div className="p-2.5 bg-white rounded border border-zinc-200">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Seniority &amp; Scope</span>
              <span className="font-semibold text-zinc-800 block mt-0.5 line-clamp-1">
                {currentJob.seniorityAnalysis?.requiredSeniority || 'Squad Level'}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">
                {currentJob.seniorityAnalysis?.isMaterial ? 'Material Gap' : 'Supported'}
              </span>
            </div>

            <div className="p-2.5 bg-white rounded border border-zinc-200">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Application Route ($0 Rule)</span>
              <span className="font-semibold text-zinc-800 block mt-0.5 line-clamp-1">
                {currentJob.routeAnalysis?.routeType || currentJob.applicationRoute}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">
                Status: {currentJob.routeAnalysis?.status || 'REVIEW'}
              </span>
            </div>

            <div className="p-2.5 bg-white rounded border border-zinc-200">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Job Freshness</span>
              <span className="font-semibold text-zinc-800 block mt-0.5">
                {currentJob.freshnessAnalysis?.status.replace('_', ' ') || 'ACTIVE'}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">
                {currentJob.postingDate || 'Recent'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* 2. DECISION REASON ("Why this decision?") */}
          <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-md">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-950 font-mono block mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-700" />
              <span>Decisive Verdict Reason:</span>
            </span>
            <p className="text-xs text-amber-950 font-medium leading-relaxed">
              {currentJob.decisionReason}
            </p>
          </div>

          {/* 3. WHY NOT APPLY PANEL (Decisive Issues) */}
          {currentJob.whyNotApply && currentJob.whyNotApply.length > 0 && (
            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-md">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-950 font-mono block mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Why NOT Apply? (Critical Blockers &amp; Uncertainties)</span>
              </span>
              <ul className="space-y-1 text-xs text-rose-900 list-disc list-inside">
                {currentJob.whyNotApply.map((reason, idx) => (
                  <li key={idx} className="leading-snug">{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. REQUIREMENT MATCH TABLE (Section 15) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
                Requirement-by-Requirement Evidence Evaluation
              </h4>
              <span className="text-[10px] font-mono text-zinc-500">
                {currentJob.requirementEvaluations?.length || 0} Extracted Requirements
              </span>
            </div>

            <div className="border border-zinc-200 rounded-md overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">JD Requirement</th>
                    <th className="py-2.5 px-2.5 font-semibold">Importance</th>
                    <th className="py-2.5 px-2.5 font-semibold">Evidence Status</th>
                    <th className="py-2.5 px-4 font-semibold">Candidate Evidence &amp; Product</th>
                    <th className="py-2.5 px-3 font-semibold">Material Gap?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-700">
                  {currentJob.requirementEvaluations?.map((req) => (
                    <tr key={req.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-zinc-900 max-w-xs">
                        {req.requirement}
                      </td>
                      <td className="py-2.5 px-2.5 font-mono text-[10px]">
                        <span className={`px-1.5 py-0.2 rounded font-semibold ${
                          req.severity === 'MUST_HAVE' ? 'bg-zinc-900 text-white' :
                          req.severity === 'IMPORTANT' ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {req.severity.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 font-mono text-[10px]">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          req.status === 'DIRECT' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          req.status === 'TRANSFERABLE' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                          req.status === 'PARTIAL' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[11px] leading-relaxed">
                        <div className="font-semibold text-zinc-900">{req.sourceProduct}</div>
                        <div className="text-zinc-600 mt-0.5">{req.candidateEvidence}</div>
                        <div className="text-[10px] text-zinc-400 italic mt-0.5">{req.rationale}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-center">
                        {req.isMaterialGap ? (
                          <span className="text-rose-700 font-bold text-[10px] bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            YES
                          </span>
                        ) : (
                          <span className="text-zinc-400 text-[10px]">NO</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Recommended CV & Override */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md text-xs space-y-2">
              <span className="font-bold uppercase tracking-wider text-zinc-900 font-mono block">
                Recommended CV Variant
              </span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900">{effectiveCV}</span>
                <select
                  value={effectiveCV}
                  onChange={(e) => setSelectedCVOverride(e.target.value)}
                  className="text-xs bg-white border border-zinc-300 rounded px-2 py-1 text-zinc-800"
                >
                  <option value="Core Product Manager CV">Core PM CV</option>
                  <option value="Technical Product Manager CV">Technical PM CV</option>
                  <option value="SaaS / B2B Product Manager CV">SaaS / B2B PM CV</option>
                  <option value="Marketplace & Payments Product Manager CV">Marketplace / Payments PM CV</option>
                </select>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                {currentJob.cvRationale}
              </p>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md text-xs space-y-2">
              <span className="font-bold uppercase tracking-wider text-zinc-900 font-mono block">
                Human Review Note / Decision Context
              </span>
              <input
                type="text"
                placeholder="Optional reason for override or audit note..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="w-full p-2 bg-white border border-zinc-300 rounded text-xs focus:outline-none"
              />
              <span className="text-[10px] text-zinc-400 block font-mono">
                Preserved in human override audit history.
              </span>
            </div>
          </div>
        </div>

        {/* 6. Action Bar */}
        <div className="p-4 bg-zinc-100 border-t border-zinc-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={() => onOpenJobDetail(currentJob.id)}
            className="text-xs text-zinc-700 hover:text-zinc-900 font-semibold underline text-center sm:text-left flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Evidence-First Job Detail Screen &rarr;</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button
              onClick={() => handleAction('KEEP_FOR_LATER')}
              className="px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Keep For Later</span>
            </button>

            <button
              onClick={() => handleAction('WATCH')}
              className="px-3.5 py-2 text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-600" />
              <span>WATCH</span>
            </button>

            <button
              onClick={() => handleAction('REJECT')}
              className="px-4 py-2 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>REJECT</span>
            </button>

            <button
              onClick={() => handleAction('APPLY')}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>APPLY (Move to Queue)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
