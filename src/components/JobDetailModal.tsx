import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { CVVariant, JobDecision } from '../types/job';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ShieldAlert, 
  Copy, 
  Check, 
  Edit3,
  Calendar,
  Globe,
  Layers,
  Send,
  Clock,
  History,
  Info,
  Sparkles,
  Download
} from 'lucide-react';

interface JobDetailModalProps {
  jobId: string;
  onClose: () => void;
  onSelectForApplication?: (id: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  jobId,
  onClose,
  onSelectForApplication
}) => {
  const { jobs, cvVariants, masterProfile, overrideJobDecision, generateJobSpecificCVForJob } = useJobs();
  const job = jobs.find(j => j.id === jobId);

  const [activeTab, setActiveTab] = useState<'verdict' | 'requirements' | 'materials' | 'route_seniority' | 'history' | 'raw'>('verdict');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingDecision, setEditingDecision] = useState(false);
  const [customDecision, setCustomDecision] = useState<JobDecision>(job?.decision || 'REVIEW');
  const [customCV, setCustomCV] = useState<string>(job?.targetCV || cvVariants[0]?.userDefinedName || 'Master Profile Presentation');
  const [overrideNotes, setOverrideNotes] = useState('');
  const [isGeneratingATS, setIsGeneratingATS] = useState(false);

  if (!job) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveDecisionOverride = () => {
    overrideJobDecision(job.id, customDecision, customCV, overrideNotes || "Decision updated in details modal");
    setEditingDecision(false);
    setOverrideNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg border border-zinc-300 max-w-4xl w-full max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
              <span className="font-semibold text-zinc-800">{job.company}</span>
              <span aria-hidden="true">·</span>
              <span>{job.location}</span>
              <span aria-hidden="true">·</span>
              <span>Source: {job.source}</span>
              {job.isDuplicate && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-blue-700 font-semibold">Duplicate Opportunity</span>
                </>
              )}
            </div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
              {job.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Decision Pill */}
            <div className={`px-2.5 py-1 text-xs font-bold font-mono rounded border ${
              job.decision === 'APPLY' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
              job.decision === 'REVIEW' ? 'bg-amber-100 text-amber-900 border-amber-300' :
              job.decision === 'WATCH' ? 'bg-blue-100 text-blue-900 border-blue-300' :
              'bg-zinc-100 text-zinc-700 border-zinc-300'
            }`}>
              {job.decision} ({job.score.total}/100)
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Sub-nav Tabs (Evidence-First Structure) */}
        <div className="flex items-center gap-1 px-5 border-b border-zinc-200 bg-white text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('verdict')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'verdict'
                ? 'border-zinc-900 text-zinc-900 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            1. Executive Verdict &amp; Fit
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'requirements'
                ? 'border-zinc-900 text-zinc-900 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            2. Requirement Evidence Table ({job.requirementEvaluations?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('route_seniority')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'route_seniority'
                ? 'border-zinc-900 text-zinc-900 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            3. Route, Seniority &amp; Freshness
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'materials'
                ? 'border-zinc-900 text-zinc-900 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            4. Tailored Application Materials
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-zinc-900 text-zinc-900 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            5. Human Override History ({job.overrideHistory?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'raw'
                ? 'border-zinc-900 text-zinc-900 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            6. Raw Description
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-zinc-800">
          {/* TAB 1: EXECUTIVE VERDICT, WHY IT FITS, WHY IT DOESN'T */}
          {activeTab === 'verdict' && (
            <div className="space-y-6">
              {/* Executive Verdict Banner */}
              <div className={`p-4 rounded-md border ${
                job.decision === 'APPLY' ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' :
                job.decision === 'REVIEW' ? 'bg-amber-50/80 border-amber-300 text-amber-950' :
                job.decision === 'WATCH' ? 'bg-blue-50/80 border-blue-300 text-blue-950' :
                'bg-zinc-100 border-zinc-300 text-zinc-900'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Info className="w-4 h-4 shrink-0" />
                  <span className="font-bold uppercase tracking-wider font-mono text-[11px]">
                    Executive Decision Verdict:
                  </span>
                </div>
                <p className="text-xs font-semibold leading-relaxed">
                  {job.decisionReason}
                </p>
              </div>

              {/* Core Discipline Fit vs Domain Fit comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md">
                  <div className="flex items-center justify-between pb-1 mb-2 border-b border-zinc-200">
                    <span className="font-bold text-zinc-900 uppercase font-mono text-[11px]">
                      {masterProfile?.primaryProfession || 'Role'} Capability Fit
                    </span>
                    <span className="font-mono font-bold text-sm text-zinc-900">
                      {job.detailedScores?.corePMScore || 0}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-snug">
                    Evaluates core capabilities, execution depth, operational methodology, and competencies documented in candidate profile.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md">
                  <div className="flex items-center justify-between pb-1 mb-2 border-b border-zinc-200">
                    <span className="font-bold text-zinc-900 uppercase font-mono text-[11px]">
                      Specific Domain Fit
                    </span>
                    <span className="font-mono font-bold text-sm text-zinc-900">
                      {job.detailedScores?.domainScore || 0}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-snug">
                    Evaluates documented vertical experience, regulatory context, industry expertise, and specialized domain requirements.
                  </p>
                </div>
              </div>

              {/* 10-Point Apply Gate Checklist Status */}
              {job.applyGate && (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-zinc-900 font-mono text-[11px]">
                      Application Criteria Readiness Gate
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      job.applyGate.passed ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {job.applyGate.passed ? 'ALL CHECKS PASSED' : 'APPLY GATE BLOCKED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {job.applyGate.checklist?.map((check) => (
                      <div key={check.ruleNumber} className="flex items-start gap-2 p-2 bg-white rounded border border-zinc-200">
                        {check.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className={`font-semibold ${check.passed ? 'text-zinc-800' : 'text-rose-900'}`}>
                            #{check.ruleNumber} {check.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 block leading-tight mt-0.5">
                            {check.details}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why It Fits & Why NOT Apply Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Why It Fits */}
                <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-md space-y-2">
                  <span className="font-bold uppercase tracking-wider text-emerald-950 font-mono text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Why It Fits (Documented Matches)</span>
                  </span>
                  <ul className="space-y-1.5 text-zinc-800 text-[11px] list-disc list-inside">
                    {job.whyItFits && job.whyItFits.length > 0 ? (
                      job.whyItFits.map((fit, idx) => <li key={idx} className="leading-snug">{fit}</li>)
                    ) : (
                      <li className="text-zinc-400 italic">No direct evidence matches identified.</li>
                    )}
                  </ul>
                </div>

                {/* Why It Doesn't */}
                <div className="p-4 bg-rose-50/40 border border-rose-200 rounded-md space-y-2">
                  <span className="font-bold uppercase tracking-wider text-rose-950 font-mono text-[11px] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Why NOT Apply (Decisive Issues)</span>
                  </span>
                  <ul className="space-y-1.5 text-rose-900 text-[11px] list-disc list-inside">
                    {job.whyNotApply && job.whyNotApply.length > 0 ? (
                      job.whyNotApply.map((blocker, idx) => <li key={idx} className="leading-snug">{blocker}</li>)
                    ) : (
                      <li className="text-zinc-500 italic">No disqualifying blockers identified.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REQUIREMENT-BY-REQUIREMENT EVIDENCE TABLE */}
          {activeTab === 'requirements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
                  Extracted Requirements &amp; Evidence Matching
                </h4>
                <span className="text-[10px] font-mono text-zinc-500">
                  {job.requirementEvaluations?.length || 0} Requirements Evaluated
                </span>
              </div>

              <div className="border border-zinc-200 rounded-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Requirement</th>
                      <th className="py-2.5 px-2.5 font-semibold">Importance</th>
                      <th className="py-2.5 px-2.5 font-semibold">Evidence Status</th>
                      <th className="py-2.5 px-4 font-semibold">Candidate Evidence &amp; Product</th>
                      <th className="py-2.5 px-3 font-semibold">Material Gap?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-zinc-700">
                    {job.requirementEvaluations?.map((req) => (
                      <tr key={req.id} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 px-3 font-medium text-zinc-900 max-w-xs">
                          <div>{req.requirement}</div>
                          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            Source: {req.provenance?.jdRequirementSource || 'JD'}
                          </div>
                        </td>
                        <td className="py-3 px-2.5 font-mono text-[10px]">
                          <span className={`px-1.5 py-0.2 rounded font-semibold ${
                            req.severity === 'MUST_HAVE' ? 'bg-zinc-900 text-white' :
                            req.severity === 'IMPORTANT' ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {req.severity.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-2.5 font-mono text-[10px]">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            req.status === 'DIRECT' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                            req.status === 'TRANSFERABLE' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                            req.status === 'PARTIAL' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                            'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] leading-relaxed">
                          <div className="font-semibold text-zinc-900">{req.sourceProduct}</div>
                          <div className="text-zinc-600 mt-0.5">{req.candidateEvidence}</div>
                          <div className="text-[10px] text-zinc-400 italic mt-0.5">{req.rationale}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-center">
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
          )}

          {/* TAB 3: ROUTE, SENIORITY & FRESHNESS */}
          {activeTab === 'route_seniority' && (
            <div className="space-y-6">
              {/* Seniority Analysis */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md space-y-3">
                <span className="font-bold uppercase tracking-wider text-zinc-900 font-mono text-[11px] block">
                  Seniority &amp; Role Scope Assessment
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="font-semibold text-zinc-700 block">Required Responsibility:</span>
                    <span className="text-zinc-900 mt-0.5 block">{job.seniorityAnalysis?.requiredSeniority}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-700 block">Candidate Documented Level:</span>
                    <span className="text-zinc-900 mt-0.5 block">{job.seniorityAnalysis?.candidateDocumentedLevel}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white border border-zinc-200 rounded text-[11px]">
                  <span className="font-semibold text-zinc-700 block">Seniority Gap Analysis:</span>
                  <p className="text-zinc-800 mt-0.5">{job.seniorityAnalysis?.seniorityGap}</p>
                  <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                    Decision Impact: {job.seniorityAnalysis?.decisionImpact}
                  </span>
                </div>
              </div>

              {/* Application Route Analysis */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md space-y-3">
                <span className="font-bold uppercase tracking-wider text-zinc-900 font-mono text-[11px] block">
                  Application Route Verification ($0 Policy)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <span className="font-semibold text-zinc-700 block">Route Status:</span>
                    <span className={`font-mono font-bold mt-0.5 block ${
                      job.routeAnalysis?.status === 'GOOD' ? 'text-emerald-700' :
                      job.routeAnalysis?.status === 'REVIEW' ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {job.routeAnalysis?.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-700 block">Route Type:</span>
                    <span className="text-zinc-900 mt-0.5 block">{job.routeAnalysis?.routeType}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-700 block">Verification Status:</span>
                    <span className="text-zinc-900 mt-0.5 block">{job.routeAnalysis?.verificationStatus}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white border border-zinc-200 rounded text-[11px]">
                  <span className="font-semibold text-zinc-700 block">Route Evidence:</span>
                  <p className="text-zinc-800 mt-0.5">{job.routeAnalysis?.evidence}</p>
                </div>
              </div>

              {/* Job Freshness */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md space-y-3">
                <span className="font-bold uppercase tracking-wider text-zinc-900 font-mono text-[11px] block">
                  Job Freshness &amp; Availability
                </span>
                <div className="flex items-center gap-4 text-[11px]">
                  <div>
                    <span className="font-semibold text-zinc-700 block">Status:</span>
                    <span className="font-mono font-bold text-zinc-900 mt-0.5 block">
                      {job.freshnessAnalysis?.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-700 block">Posting Date:</span>
                    <span className="font-mono text-zinc-900 mt-0.5 block">
                      {job.freshnessAnalysis?.postingDate}
                    </span>
                  </div>
                  {job.freshnessAnalysis?.daysSincePosted !== undefined && (
                    <div>
                      <span className="font-semibold text-zinc-700 block">Age:</span>
                      <span className="font-mono text-zinc-900 mt-0.5 block">
                        {job.freshnessAnalysis?.daysSincePosted} days old
                      </span>
                    </div>
                  )}
                </div>
                {job.freshnessAnalysis?.warning && (
                  <p className="text-amber-800 text-[11px] bg-amber-50 p-2 rounded border border-amber-200">
                    {job.freshnessAnalysis.warning}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TAILORED APPLICATION MATERIALS & JOB-SPECIFIC CV */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              {/* Job-Specific ATS CV */}
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-purple-950 font-mono text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      Tailored ATS Application CV
                    </span>
                    <p className="text-[11px] text-purple-800 mt-0.5">
                      Optimized for {job.company}&apos;s ATS without modifying source CV variant.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      setIsGeneratingATS(true);
                      try {
                        await generateJobSpecificCVForJob(job.id);
                      } finally {
                        setIsGeneratingATS(false);
                      }
                    }}
                    disabled={isGeneratingATS}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded transition-colors disabled:opacity-50 flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isGeneratingATS ? 'Generating...' : (job.jobSpecificCV ? 'Re-Tailor ATS CV' : 'Generate ATS CV')}</span>
                  </button>
                </div>

                {job.jobSpecificCV && (
                  <div className="bg-white p-3 rounded border border-purple-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-zinc-800">
                        Tailored Summary:
                      </span>
                      <button
                        onClick={() => handleCopy(job.jobSpecificCV!.tailoredContent, 'modal_ats_cv')}
                        className="px-2 py-0.5 text-[11px] bg-zinc-100 hover:bg-zinc-200 rounded flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'modal_ats_cv' ? 'Copied!' : 'Copy ATS CV'}</span>
                      </button>
                    </div>
                    <p className="text-zinc-700 bg-zinc-50 p-2 rounded text-[11px]">
                      {job.jobSpecificCV.tailoredSummary}
                    </p>
                    <div className="max-h-48 overflow-y-auto bg-zinc-950 text-zinc-100 p-2.5 rounded font-mono text-[10px] whitespace-pre-wrap leading-relaxed">
                      {job.jobSpecificCV.tailoredContent}
                    </div>
                  </div>
                )}
              </div>

              {job.applicationMaterials ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 font-mono text-xs">
                      Grounded Cover Letter (100% Evidence-Based)
                    </span>
                    <button
                      onClick={() => handleCopy(job.applicationMaterials?.coverLetter || '', 'modal_cl')}
                      className="px-2.5 py-1 text-xs bg-white border border-zinc-300 rounded hover:bg-zinc-50 flex items-center gap-1"
                    >
                      {copiedKey === 'modal_cl' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'modal_cl' ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-zinc-50 border border-zinc-200 rounded font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-zinc-800">
                    {job.applicationMaterials.coverLetter}
                  </pre>

                  {job.applicationMaterials.questionsAnswers && (
                    <div className="space-y-3 pt-3 border-t border-zinc-200">
                      <span className="font-bold text-zinc-900 block font-mono text-xs">
                        Screening Question Answers:
                      </span>
                      {job.applicationMaterials.questionsAnswers.map((qa, idx) => (
                        <div key={idx} className="p-3 bg-zinc-50 rounded border border-zinc-200">
                          <div className="font-semibold text-zinc-900">{qa.question}</div>
                          <div className="text-[11px] text-zinc-700 mt-1">{qa.answer}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center text-zinc-400 italic">
                  Application materials are only generated for APPLY and REVIEW opportunities.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HUMAN OVERRIDE HISTORY (Section 23) */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono flex items-center gap-1.5">
                  <History className="w-4 h-4 text-zinc-600" />
                  <span>Human Override Audit Trail</span>
                </h4>
                <button
                  onClick={() => setEditingDecision(!editingDecision)}
                  className="px-3 py-1 text-xs font-medium bg-zinc-900 text-white rounded hover:bg-zinc-800"
                >
                  {editingDecision ? 'Cancel' : '+ New Decision Override'}
                </button>
              </div>

              {editingDecision && (
                <div className="p-4 bg-zinc-50 border border-zinc-300 rounded-md space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-zinc-700 block mb-1">New Decision:</label>
                      <select
                        value={customDecision}
                        onChange={(e) => setCustomDecision(e.target.value as JobDecision)}
                        className="w-full p-2 bg-white border border-zinc-300 rounded text-xs"
                      >
                        <option value="APPLY">APPLY (Move to Ready Queue)</option>
                        <option value="REVIEW">REVIEW (Keep in Decision Desk)</option>
                        <option value="WATCH">WATCH (Move to Watchlist)</option>
                        <option value="REJECT">REJECT (Dismiss)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-zinc-700 block mb-1">Target CV:</label>
                      <select
                        value={customCV}
                        onChange={(e) => setCustomCV(e.target.value)}
                        className="w-full p-2 bg-white border border-zinc-300 rounded text-xs"
                      >
                        <option value="Core Product Manager CV">Core Product Manager CV</option>
                        <option value="Technical Product Manager CV">Technical Product Manager CV</option>
                        <option value="SaaS / B2B Product Manager CV">SaaS / B2B Product Manager CV</option>
                        <option value="Marketplace & Payments Product Manager CV">Marketplace &amp; Payments PM CV</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">User Audit Note / Rationale:</label>
                    <input
                      type="text"
                      placeholder="Why is this decision being updated..."
                      value={overrideNotes}
                      onChange={(e) => setOverrideNotes(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded text-xs"
                    />
                  </div>

                  <button
                    onClick={handleSaveDecisionOverride}
                    className="px-4 py-1.5 font-bold text-white bg-zinc-900 rounded hover:bg-zinc-800 text-xs"
                  >
                    Save Override &amp; Log to Audit Trail
                  </button>
                </div>
              )}

              {/* History List */}
              <div className="space-y-2.5">
                {job.overrideHistory && job.overrideHistory.length > 0 ? (
                  job.overrideHistory.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200 rounded-md text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-900 font-mono">
                          {rec.previousDecision} &rarr; {rec.newDecision}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {new Date(rec.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-zinc-700 text-[11px]">{rec.userNote}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-zinc-400 italic bg-zinc-50 rounded border border-zinc-200">
                    No human overrides recorded yet. Decision was made deterministically by system rules.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: RAW DESCRIPTION */}
          {activeTab === 'raw' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded">
                <div>
                  <span className="font-mono text-zinc-500">Parser Confidence:</span>
                  <span className="font-bold text-zinc-900 ml-1.5">{job.parserConfidence}</span>
                </div>
                {job.missingFields.length > 0 && (
                  <span className="text-amber-800 font-mono text-[11px]">
                    Missing: {job.missingFields.join(', ')}
                  </span>
                )}
              </div>

              <div>
                <span className="font-bold text-zinc-900 block mb-1">Full Ingested Description:</span>
                <pre className="p-4 bg-zinc-50 border border-zinc-200 rounded font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-zinc-700 max-h-[400px] overflow-y-auto">
                  {job.description || "No description provided."}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="text-[11px] font-mono text-zinc-500">
            ID: {job.id} · Discovered: {job.discoveredDate}
          </div>

          <div className="flex items-center gap-2">
            {job.status === 'READY_TO_APPLY' && onSelectForApplication && (
              <button
                onClick={() => {
                  onSelectForApplication(job.id);
                  onClose();
                }}
                className="px-4 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded transition-colors text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Go to Application Desk</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
