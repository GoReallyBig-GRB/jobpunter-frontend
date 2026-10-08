import React, { useState, useMemo } from 'react';
import { useJobs } from '../context/JobContext';
import { Job, JobDecision, JobStatus, CVVariant, ParserConfidence } from '../types/job';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  CopyCheck, 
  FileEdit,
  Trash2,
  LayoutGrid,
  List,
  Sparkles,
  ShieldAlert,
  Send
} from 'lucide-react';

interface JobsListViewProps {
  onOpenJobDetail: (id: string) => void;
  onSelectForReview?: (id: string) => void;
  onSelectForApplication?: (id: string) => void;
}

export const JobsListView: React.FC<JobsListViewProps> = ({
  onOpenJobDetail,
  onSelectForReview,
  onSelectForApplication
}) => {
  const { jobs, deleteJob, updateJobStatus } = useJobs();

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<'ALL' | JobDecision>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | JobStatus>('ALL');
  const [confidenceFilter, setConfidenceFilter] = useState<'ALL' | ParserConfidence>('ALL');
  const [cvFilter, setCvFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Extract unique sources for filter
  const availableSources = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach(j => {
      set.add(j.source);
      j.allSources?.forEach(s => set.add(s));
    });
    return Array.from(set);
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const text = `${job.title} ${job.company} ${job.location} ${job.description} ${job.source} ${job.provenanceLabel || ''}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      // Decision
      if (decisionFilter !== 'ALL' && job.decision !== decisionFilter) return false;

      // Status
      if (statusFilter !== 'ALL' && job.status !== statusFilter) return false;

      // Confidence
      if (confidenceFilter !== 'ALL' && job.parserConfidence !== confidenceFilter) return false;

      // CV Variant
      if (cvFilter !== 'ALL' && !job.targetCV.toLowerCase().includes(cvFilter.toLowerCase())) return false;

      // Source
      if (sourceFilter !== 'ALL') {
        const hasSource = job.source === sourceFilter || job.allSources?.includes(sourceFilter);
        if (!hasSource) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, decisionFilter, statusFilter, confidenceFilter, cvFilter, sourceFilter]);

  const renderDecisionBadge = (decision: JobDecision) => {
    switch (decision) {
      case 'APPLY':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            APPLY
          </span>
        );
      case 'REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            REVIEW
          </span>
        );
      case 'WATCH':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            WATCH
          </span>
        );
      case 'REJECT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-600 bg-zinc-200 px-2.5 py-0.5 rounded border border-zinc-300">
            <XCircle className="w-3.5 h-3.5 text-zinc-500" />
            REJECT
          </span>
        );
    }
  };

  const renderStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">NEW</span>;
      case 'REVIEW':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">REVIEW</span>;
      case 'READY_TO_APPLY':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">READY TO APPLY</span>;
      case 'APPLIED':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300">APPLIED</span>;
      case 'SCREENING':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">SCREENING</span>;
      case 'INTERVIEW':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-300">INTERVIEW</span>;
      case 'OFFER':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-300">OFFER</span>;
      case 'WON':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-green-200 text-green-950 border border-green-400">WON</span>;
      case 'LOST':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">LOST</span>;
      case 'ARCHIVED':
      case 'CLOSED':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 border border-zinc-300">ARCHIVED</span>;
      default:
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">{status}</span>;
    }
  };

  const renderConfidence = (conf: ParserConfidence) => {
    switch (conf) {
      case 'HIGH':
        return <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">HIGH</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">MED</span>;
      case 'LOW':
        return <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">LOW</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Filters */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by role, company, skills (e.g. CRM, Stripe, APIs, Lagos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-zinc-50 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-zinc-400 hover:text-zinc-600"
              >
                &times;
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                  viewMode === 'cards' ? 'bg-white shadow-xs font-semibold text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                  viewMode === 'table' ? 'bg-white shadow-xs font-semibold text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
                }`}
                title="Compact Table View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Table</span>
              </button>
            </div>

            <div className="text-xs text-zinc-500 font-mono shrink-0">
              Showing <strong className="text-zinc-900">{filteredJobs.length}</strong> of {jobs.length} jobs
            </div>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Decision Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-md">
            {(['ALL', 'APPLY', 'REVIEW', 'WATCH', 'REJECT'] as const).map(dec => (
              <button
                key={dec}
                onClick={() => setDecisionFilter(dec)}
                className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                  decisionFilter === dec
                    ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {dec}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-white border border-zinc-300 rounded px-2 py-1 text-zinc-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="REVIEW">Review Needed</option>
            <option value="READY_TO_APPLY">Ready to Apply</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="WATCHLIST">Watchlist</option>
            <option value="REJECTED">Rejected</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* CV Variant Filter */}
          <select
            value={cvFilter}
            onChange={(e) => setCvFilter(e.target.value)}
            className="text-xs bg-white border border-zinc-300 rounded px-2 py-1 text-zinc-700 focus:outline-none"
          >
            <option value="ALL">All CV Variants</option>
            <option value="Core Product Manager">Core PM</option>
            <option value="Technical Product Manager">Technical PM</option>
            <option value="SaaS">SaaS / B2B PM</option>
            <option value="Marketplace">Marketplace / Payments PM</option>
          </select>

          {/* Parser Confidence */}
          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value as any)}
            className="text-xs bg-white border border-zinc-300 rounded px-2 py-1 text-zinc-700 focus:outline-none"
          >
            <option value="ALL">All Confidence</option>
            <option value="HIGH">High Confidence</option>
            <option value="MEDIUM">Medium Confidence</option>
            <option value="LOW">Low Confidence</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs bg-white border border-zinc-300 rounded px-2 py-1 text-zinc-700 focus:outline-none"
          >
            <option value="ALL">All Sources</option>
            {availableSources.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {(decisionFilter !== 'ALL' || statusFilter !== 'ALL' || confidenceFilter !== 'ALL' || cvFilter !== 'ALL' || sourceFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setDecisionFilter('ALL');
                setStatusFilter('ALL');
                setConfidenceFilter('ALL');
                setCvFilter('ALL');
                setSourceFilter('ALL');
                setSearchQuery('');
              }}
              className="text-[11px] text-zinc-500 hover:text-zinc-900 underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: SCANNABLE CARD GRID VIEW (Section 10) */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => {
            const isApply = job.decision === 'APPLY';
            const isReview = job.decision === 'REVIEW';
            const hasBlockers = job.hardNoGoReasons && job.hardNoGoReasons.length > 0;

            return (
              <div
                key={job.id}
                className={`bg-white rounded-xl border p-4 flex flex-col justify-between transition-all hover:shadow-md ${
                  isApply ? 'border-emerald-300 ring-1 ring-emerald-200' :
                  isReview ? 'border-amber-300 ring-1 ring-amber-200' :
                  job.status === 'LOST' ? 'border-rose-200 bg-rose-50/10' :
                  'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Status + Decision + Score */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {renderStatusBadge(job.status)}
                      {renderDecisionBadge(job.decision)}
                    </div>

                    <div className="flex items-baseline gap-1 shrink-0 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">
                      <span className={`text-base font-bold font-mono ${
                        job.score.total >= 85 ? 'text-emerald-700' :
                        job.score.total >= 70 ? 'text-amber-700' : 'text-zinc-500'
                      }`}>
                        {job.score.total}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">/100</span>
                    </div>
                  </div>

                  {/* Job Title & Company */}
                  <div>
                    <h3 
                      onClick={() => onOpenJobDetail(job.id)}
                      className="font-bold text-sm text-zinc-900 hover:underline cursor-pointer leading-tight line-clamp-2"
                    >
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 mt-1">
                      <span>{job.company}</span>
                      <span className="text-zinc-300">&bull;</span>
                      <span className="text-zinc-600 font-normal">{job.location}</span>
                    </div>
                  </div>

                  {/* Provenance & Source Label */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {job.provenanceLabel || 'Quick Job-Site Match'}
                    </span>
                    <span className="text-zinc-400">&bull;</span>
                    <span className="text-zinc-500 truncate">{job.source}</span>
                  </div>

                  {/* Fit Tags: Core Role Fit + Domain Fit */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                      Role Fit: {job.detailedScores?.corePMScore || job.score.coreEvidenceFit}%
                    </span>
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-medium">
                      Domain: {job.detailedScores?.domainScore || job.score.domainFit}%
                    </span>
                    <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-mono">
                      Route: {job.applicationRoute.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Hard Blockers / Warning Flag */}
                  {hasBlockers && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-800 flex items-start gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{job.hardNoGoReasons.join('; ')}</span>
                    </div>
                  )}

                  {/* JD Status & Date Discovered */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
                    <span>Discovered: {job.discoveredDate || job.postingDate}</span>
                    <span className="text-emerald-700 font-medium">
                      {job.jdRetrievalStatus === 'FULL_JD_RETRIEVED' ? 'Full JD' : job.jdRetrievalStatus}
                    </span>
                  </div>
                </div>

                {/* Card Actions Bottom Bar */}
                <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenJobDetail(job.id)}
                    className="text-xs text-zinc-600 hover:text-zinc-900 font-medium flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Detail</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {job.decision === 'REVIEW' && onSelectForReview && (
                      <button
                        onClick={() => onSelectForReview(job.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded"
                      >
                        Review Desk
                      </button>
                    )}

                    {job.status === 'READY_TO_APPLY' && onSelectForApplication && (
                      <button
                        onClick={() => onSelectForApplication(job.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded flex items-center gap-1"
                      >
                        <Send className="w-3 h-3 text-emerald-900" />
                        <span>Package</span>
                      </button>
                    )}

                    {job.jobUrl && (
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-zinc-400 hover:text-zinc-700"
                        title="Original job posting"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredJobs.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white border border-zinc-200 rounded-xl text-zinc-400 text-xs italic">
              No jobs match the active filters or search query.
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 2: COMPACT TABLE VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'table' && (
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Job &amp; Company</th>
                  <th className="py-2.5 px-3 font-semibold">Location / Route</th>
                  <th className="py-2.5 px-3 font-semibold">Score</th>
                  <th className="py-2.5 px-3 font-semibold">Decision</th>
                  <th className="py-2.5 px-3 font-semibold">Provenance</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700">
                {filteredJobs.map(job => (
                  <tr 
                    key={job.id} 
                    className={`hover:bg-zinc-50/80 transition-colors ${
                      job.decision === 'APPLY' ? 'bg-emerald-50/20' : 
                      job.decision === 'REVIEW' ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Job & Company */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onOpenJobDetail(job.id)}
                            className="font-semibold text-zinc-900 hover:underline text-left"
                          >
                            {job.title}
                          </button>
                          {job.jobUrl && (
                            <a
                              href={job.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-zinc-700"
                              title="Open original job posting"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                          <span className="font-medium text-zinc-800">{job.company}</span>
                          <span aria-hidden="true">&bull;</span>
                          <span>Source: {job.source}</span>
                        </div>
                      </div>
                    </td>

                    {/* Location & Route */}
                    <td className="py-3 px-3">
                      <div className="text-zinc-800 font-medium">{job.location}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                        {job.applicationRoute.replace(/_/g, ' ')}
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-3 px-3">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-base font-bold font-mono ${
                          job.score.total >= 85 ? 'text-emerald-700' :
                          job.score.total >= 70 ? 'text-amber-700' : 'text-zinc-500'
                        }`}>
                          {job.score.total}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">/100</span>
                      </div>
                    </td>

                    {/* Decision */}
                    <td className="py-3 px-3">
                      {renderDecisionBadge(job.decision)}
                    </td>

                    {/* Provenance */}
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono font-medium text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded">
                        {job.provenanceLabel || 'Quick Job-Site Match'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {renderStatusBadge(job.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenJobDetail(job.id)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 rounded hover:bg-zinc-100"
                          title="View Full Evaluation"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {job.decision === 'REVIEW' && onSelectForReview && (
                          <button
                            onClick={() => onSelectForReview(job.id)}
                            className="px-2 py-1 text-[10px] font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded"
                            title="Open in Review Screen"
                          >
                            Review
                          </button>
                        )}

                        {job.status === 'READY_TO_APPLY' && onSelectForApplication && (
                          <button
                            onClick={() => onSelectForApplication(job.id)}
                            className="px-2 py-1 text-[10px] font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded"
                            title="Prepare Application"
                          >
                            Prepare
                          </button>
                        )}

                        <button
                          onClick={() => deleteJob(job.id)}
                          className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-zinc-400 italic">
                      No jobs match the active filters or search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
