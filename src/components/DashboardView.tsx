import React from 'react';
import { useJobs } from '../context/JobContext';
import { NavTab } from './Header';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  FileText, 
  Layers, 
  Send, 
  CopyCheck, 
  Clock, 
  ShieldAlert,
  TrendingUp,
  Activity,
  Filter
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenJobDetail: (id: string) => void;
  onOpenIngestModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenJobDetail,
  onOpenIngestModal
}) => {
  const { jobs, sourceEmails } = useJobs();

  // Metrics
  const totalDiscovered = jobs.length;
  const newJobs = jobs.filter(j => j.status === 'NEW').length;
  const applyJobs = jobs.filter(j => j.decision === 'APPLY').length;
  const reviewJobs = jobs.filter(j => j.decision === 'REVIEW').length;
  const watchJobs = jobs.filter(j => j.decision === 'WATCH').length;
  const rejectedJobs = jobs.filter(j => j.decision === 'REJECT').length;
  const readyToApply = jobs.filter(j => j.status === 'READY_TO_APPLY').length;
  const applied = jobs.filter(j => j.status === 'APPLIED').length;
  const interviews = jobs.filter(j => j.status === 'INTERVIEW').length;
  const offers = jobs.filter(j => j.status === 'OFFER').length;

  const duplicates = jobs.filter(j => j.isDuplicate || (j.allSources && j.allSources.length > 1));
  const parsingFailures = sourceEmails.filter(e => e.processedStatus === 'PARSING_REQUIRED');

  // Section 21: Top Rejection Reasons Categorization
  const rejectionCategories: Record<string, number> = {
    'Domain Mismatch (Lending / Clinical EHR)': 0,
    'Material Seniority Mismatch (VP / 15 PMs)': 0,
    'Location / Work Auth (US/UK Citizen Only)': 0,
    'Paid Route / Paywall ($0 Policy)': 0,
    'Non-PM Role (Sales / Pure Dev / HR)': 0,
    'Stale / Expired Role (>30 Days)': 0,
    'Insufficient Job Description / Low Confidence': 0,
    'Score Below Minimum Threshold': 0
  };

  jobs.forEach(job => {
    if (job.decision === 'REJECT' || job.decision === 'WATCH') {
      const reasonsCombined = (job.whyNotApply || []).join(' ').toLowerCase();
      if (reasonsCombined.includes('lending') || reasonsCombined.includes('clinical') || reasonsCombined.includes('specialist domain')) {
        rejectionCategories['Domain Mismatch (Lending / Clinical EHR)'] += 1;
      } else if (reasonsCombined.includes('executive') || reasonsCombined.includes('seniority') || reasonsCombined.includes('15')) {
        rejectionCategories['Material Seniority Mismatch (VP / 15 PMs)'] += 1;
      } else if (reasonsCombined.includes('authorization') || reasonsCombined.includes('foreign') || reasonsCombined.includes('us/uk')) {
        rejectionCategories['Location / Work Auth (US/UK Citizen Only)'] += 1;
      } else if (reasonsCombined.includes('paid') || reasonsCombined.includes('subscription') || reasonsCombined.includes('deposit')) {
        rejectionCategories['Paid Route / Paywall ($0 Policy)'] += 1;
      } else if (reasonsCombined.includes('sales') || reasonsCombined.includes('quota') || reasonsCombined.includes('recruiting')) {
        rejectionCategories['Non-PM Role (Sales / Pure Dev / HR)'] += 1;
      } else if (reasonsCombined.includes('closed') || reasonsCombined.includes('stale') || reasonsCombined.includes('30 days')) {
        rejectionCategories['Stale / Expired Role (>30 Days)'] += 1;
      } else if (reasonsCombined.includes('description') || reasonsCombined.includes('confidence')) {
        rejectionCategories['Insufficient Job Description / Low Confidence'] += 1;
      } else {
        rejectionCategories['Score Below Minimum Threshold'] += 1;
      }
    }
  });

  const highConfidenceApply = jobs.filter(j => j.decision === 'APPLY' && j.applyGate?.passed);
  const reviewBacklog = jobs.filter(j => j.decision === 'REVIEW' && j.status === 'REVIEW');

  return (
    <div className="space-y-6">
      {/* Top Banner: Governing Principle */}
      <div className="bg-zinc-900 text-white rounded-lg p-5 border border-zinc-800 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              <span>Section 1 Governing Principle</span>
              <span className="text-zinc-600">·</span>
              <span>Evidence-Backed Verification</span>
            </div>
            <p className="text-base font-semibold text-zinc-100">
              &ldquo;Is this job genuinely worth this candidate&apos;s limited application time based on documented evidence?&rdquo;
            </p>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Strict personal screener: Answers based on verifiable product specifications in MarketGrowthOS, NexaLife Care, UrCalls, and Zenith Property Repairs. Never manufactures a fit.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('ready')}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Ready to Apply ({readyToApply})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className="px-3.5 py-2 text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-md hover:bg-zinc-700 transition-colors"
            >
              Run 18 Tests
            </button>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        <div className="bg-white border border-zinc-200 rounded-lg p-3">
          <span className="text-[11px] font-medium text-zinc-500 block">Total Ingested</span>
          <span className="text-xl font-bold font-mono text-zinc-900 mt-1 block">{totalDiscovered}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Discovered</span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-3">
          <span className="text-[11px] font-medium text-zinc-500 block">New Ingested</span>
          <span className="text-xl font-bold font-mono text-zinc-800 mt-1 block">{newJobs}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Unprocessed</span>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3">
          <span className="text-[11px] font-semibold text-emerald-800 block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            APPLY ({applyJobs})
          </span>
          <span className="text-xl font-bold font-mono text-emerald-900 mt-1 block">{applyJobs}</span>
          <span className="text-[10px] text-emerald-700 mt-0.5 block">Passed Apply Gate</span>
        </div>

        <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3">
          <span className="text-[11px] font-semibold text-amber-800 block flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            REVIEW ({reviewJobs})
          </span>
          <span className="text-xl font-bold font-mono text-amber-900 mt-1 block">{reviewJobs}</span>
          <span className="text-[10px] text-amber-700 mt-0.5 block">Human check needed</span>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
          <span className="text-[11px] font-medium text-zinc-500 block flex items-center gap-1">
            <XCircle className="w-3 h-3 text-zinc-400" />
            REJECT ({rejectedJobs})
          </span>
          <span className="text-xl font-bold font-mono text-zinc-600 mt-1 block">{rejectedJobs}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Filtered out</span>
        </div>

        <div className="bg-white border border-emerald-300 rounded-lg p-3">
          <span className="text-[11px] font-medium text-zinc-700 block">Ready to Apply</span>
          <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">{readyToApply}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Prepared</span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-3">
          <span className="text-[11px] font-medium text-zinc-500 block flex items-center gap-1">
            <Send className="w-3 h-3 text-blue-500" />
            Applied
          </span>
          <span className="text-xl font-bold font-mono text-zinc-800 mt-1 block">{applied}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Submitted</span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-3">
          <span className="text-[11px] font-medium text-zinc-500 block">Interviews</span>
          <span className="text-xl font-bold font-mono text-blue-700 mt-1 block">{interviews}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">In Progress</span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-3">
          <span className="text-[11px] font-medium text-zinc-500 block">Offers</span>
          <span className="text-xl font-bold font-mono text-purple-700 mt-1 block">{offers}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Outcomes</span>
        </div>
      </div>

      {/* Section 21: Funnel & Rejection Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Funnel */}
        <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Application Screening Funnel</span>
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Precision Filtering</span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-700">1. Total Ingested Opportunities</span>
                <span className="font-mono font-bold text-zinc-900">{totalDiscovered}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-zinc-400 h-2 rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-700">2. Qualified (Passed Hard NO-GO Rules)</span>
                <span className="font-mono font-bold text-zinc-900">{applyJobs + reviewJobs}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${totalDiscovered ? Math.round(((applyJobs + reviewJobs) / totalDiscovered) * 100) : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-700">3. High-Confidence Verified (APPLY Gate)</span>
                <span className="font-mono font-bold text-emerald-700">{applyJobs}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${totalDiscovered ? Math.round((applyJobs / totalDiscovered) * 100) : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-700">4. Ready to Submit / Prepared</span>
                <span className="font-mono font-bold text-emerald-800">{readyToApply}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${totalDiscovered ? Math.round((readyToApply / totalDiscovered) * 100) : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-zinc-700">5. Submitted Applications</span>
                <span className="font-mono font-bold text-blue-700">{applied}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${totalDiscovered ? Math.round((applied / totalDiscovered) * 100) : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Rejection Reasons Breakdown */}
        <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Decisive Rejection &amp; Blocker Reasons</span>
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Why Jobs Failed</span>
          </div>

          <div className="space-y-2 text-xs">
            {Object.entries(rejectionCategories).map(([reason, count]) => {
              if (count === 0) return null;
              return (
                <div key={reason} className="p-2.5 bg-zinc-50 rounded border border-zinc-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span className="font-medium text-zinc-800">{reason}</span>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 bg-white px-2 py-0.5 rounded border border-zinc-300 text-[11px]">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setActiveTab('health')}
            className="text-xs text-teal-700 font-medium hover:underline flex items-center gap-1 pt-1"
          >
            <span>View Full Evidence Health &amp; Recurring Gaps Diagnostic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Cards: High-Confidence APPLY & Review Backlog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* High-Confidence APPLY */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="text-sm font-semibold text-zinc-900">
                Verified APPLY Opportunities ({highConfidenceApply.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('ready')}
              className="text-xs text-emerald-700 font-medium hover:underline flex items-center gap-1"
            >
              <span>Open Queue</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {highConfidenceApply.slice(0, 3).map(job => (
              <div
                key={job.id}
                onClick={() => onOpenJobDetail(job.id)}
                className="p-3 bg-zinc-50 hover:bg-zinc-100/80 rounded-md border border-zinc-200 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900">{job.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                      <span>{job.company}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-emerald-700 font-bold">{job.score.total}/100</span>
                      <span aria-hidden="true">·</span>
                      <span>PM:{job.detailedScores?.corePMScore} / Dom:{job.detailedScores?.domainScore}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold shrink-0">
                    {job.targetCV.replace('_', ' ')}
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] text-zinc-600 line-clamp-1">
                  <strong>Verdict:</strong> {job.decisionReason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Backlog */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <h3 className="text-sm font-semibold text-zinc-900">
                Review Backlog ({reviewBacklog.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('review')}
              className="text-xs text-amber-700 font-medium hover:underline flex items-center gap-1"
            >
              <span>Decision Desk</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {reviewBacklog.slice(0, 3).map(job => (
              <div
                key={job.id}
                onClick={() => onOpenJobDetail(job.id)}
                className="p-3 bg-zinc-50 hover:bg-zinc-100/80 rounded-md border border-zinc-200 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900">{job.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                      <span>{job.company}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-amber-700 font-bold">{job.score.total}/100</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[10px]">Conf: {job.parserConfidence}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold shrink-0">
                    REVIEW
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200">
                  <strong>Why Held:</strong> {job.decisionReason}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
