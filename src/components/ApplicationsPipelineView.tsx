import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Job, JobStatus, ApplicationAuditEntry } from '../types/job';
import { 
  Send, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  FileText, 
  Edit3, 
  Clock, 
  Award,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  User,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ApplicationsPipelineViewProps {
  onOpenJobDetail: (id: string) => void;
}

const PIPELINE_COLUMNS: { status: JobStatus; title: string; color: string; badgeColor: string }[] = [
  { status: 'READY_TO_APPLY', title: 'Ready to Apply', color: 'border-emerald-300 bg-emerald-50/20', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { status: 'APPLIED', title: 'Applied', color: 'border-blue-300 bg-blue-50/20', badgeColor: 'bg-blue-100 text-blue-800' },
  { status: 'SCREENING', title: 'Screening', color: 'border-purple-300 bg-purple-50/20', badgeColor: 'bg-purple-100 text-purple-800' },
  { status: 'INTERVIEW', title: 'Interview Stages', color: 'border-fuchsia-300 bg-fuchsia-50/20', badgeColor: 'bg-fuchsia-100 text-fuchsia-800' },
  { status: 'OFFER', title: 'Offer Extended', color: 'border-teal-300 bg-teal-50/30', badgeColor: 'bg-teal-100 text-teal-800' },
  { status: 'WON', title: 'Won (Accepted)', color: 'border-green-400 bg-green-50/40', badgeColor: 'bg-green-100 text-green-900' },
  { status: 'LOST', title: 'Lost (Rejected / Gap)', color: 'border-rose-300 bg-rose-50/20', badgeColor: 'bg-rose-100 text-rose-800' },
  { status: 'ARCHIVED', title: 'Archived', color: 'border-zinc-300 bg-zinc-50', badgeColor: 'bg-zinc-200 text-zinc-700' }
];

export const ApplicationsPipelineView: React.FC<ApplicationsPipelineViewProps> = ({
  onOpenJobDetail
}) => {
  const { jobs, updateJobStatus } = useJobs();
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [newStatus, setNewStatus] = useState<JobStatus>('APPLIED');

  // Loss analysis state
  const [lostReasonCategory, setLostReasonCategory] = useState<string>('SKILLS_EXPERIENCE_GAP');
  const [lostStageAt, setLostStageAt] = useState<string>('Post-Recruiter Screening');
  const [lostLessons, setLostLessons] = useState<string>('');

  const openStatusModal = (job: Job) => {
    setEditingJobId(job.id);
    setNewStatus(job.status);
    setNoteInput(job.notes || '');
    setLostReasonCategory(job.lostReason || 'SKILLS_EXPERIENCE_GAP');
    setLostLessons('');
  };

  const handleSaveStatus = () => {
    if (!editingJobId) return;

    let computedReason = noteInput;
    if (newStatus === 'LOST') {
      computedReason = `[Loss: ${lostReasonCategory} at ${lostStageAt}] ${lostLessons || noteInput}`.trim();
    }

    updateJobStatus(
      editingJobId, 
      newStatus, 
      noteInput, 
      'USER', 
      newStatus === 'LOST' ? computedReason : undefined
    );
    setEditingJobId(null);
  };

  const activePipelineJobs = jobs.filter(j => 
    ['READY_TO_APPLY', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'WON', 'LOST'].includes(j.status)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 bg-white p-4 rounded-xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Applications Lifecycle
            </span>
            <span className="text-xs text-zinc-400">&bull;</span>
            <span className="text-xs text-zinc-500 font-mono">Explicit Stage Ownership &amp; Loss Analysis</span>
          </div>
          <h2 className="text-base font-bold text-zinc-900 tracking-tight mt-1 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            <span>Application Pipeline &amp; Stage Ownership Tracker</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Clear separation between <strong>System Events</strong> (JD retrieved, package generated) and <strong>Candidate Actions</strong> (submitted, interview stages, outcome analysis).
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-500 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-200 shrink-0">
          Active Opportunities: <strong className="text-zinc-900">{activePipelineJobs.length}</strong>
        </div>
      </div>

      {/* Kanban / Multi-column board */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map(col => {
          const colJobs = jobs.filter(j => j.status === col.status || (col.status === 'ARCHIVED' && (j.status === 'CLOSED' || j.status === 'ARCHIVED')));

          return (
            <div key={col.status} className={`rounded-xl border p-3 flex flex-col ${col.color} min-w-[260px] max-w-[280px] shrink-0`}>
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200/80 text-xs">
                <span className="font-bold text-zinc-900">{col.title}</span>
                <span className={`font-mono px-2 py-0.5 rounded font-bold text-[10px] ${col.badgeColor}`}>
                  {colJobs.length}
                </span>
              </div>

              {/* Cards in column */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {colJobs.map(job => {
                  const lastAudit = job.pipelineHistory?.[0];
                  return (
                    <div
                      key={job.id}
                      className="p-3.5 bg-white border border-zinc-200 rounded-lg shadow-2xs hover:shadow-xs transition-shadow text-xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 
                          onClick={() => onOpenJobDetail(job.id)}
                          className="font-bold text-zinc-900 cursor-pointer hover:underline line-clamp-2 leading-tight"
                        >
                          {job.title}
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                          {job.score.total}/100
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-zinc-800">{job.company}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{job.location}</span>
                      </div>

                      <div className="text-[10px] text-zinc-500 font-mono bg-zinc-50 p-1.5 rounded border border-zinc-100">
                        Variant: <strong className="text-zinc-700">{job.targetCV.replace('_PM', '').replace('_', ' ')}</strong>
                      </div>

                      {/* Lost Reason Display (Requirement 12) */}
                      {job.status === 'LOST' && job.lostReason && (
                        <div className="p-2 bg-rose-50 border border-rose-200 rounded text-[10px] text-rose-800 space-y-0.5">
                          <strong className="block font-semibold">Loss Audit &amp; Remediable Gap:</strong>
                          <p className="line-clamp-2 leading-tight">{job.lostReason}</p>
                        </div>
                      )}

                      {/* Explicit Stage Ownership & Event Actor */}
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 pt-1 border-t border-zinc-100">
                        {lastAudit?.actor === 'SYSTEM' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                            <Cpu className="w-3 h-3 text-emerald-600" />
                            System Event
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                            <User className="w-3 h-3 text-blue-600" />
                            Candidate Moved
                          </span>
                        )}
                        <span className="truncate">{lastAudit?.reason?.slice(0, 30) || 'Active'}</span>
                      </div>

                      {job.notes && (
                        <div className="text-[10px] bg-zinc-50 p-1.5 rounded border border-zinc-100 text-zinc-600 italic line-clamp-2">
                          {job.notes}
                        </div>
                      )}

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                        <button
                          onClick={() => openStatusModal(job)}
                          className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Advance Stage</span>
                        </button>

                        {job.applicationUrl && (
                          <a
                            href={job.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-700"
                            title="Open portal"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colJobs.length === 0 && (
                  <div className="text-center py-8 text-xs text-zinc-400 italic bg-white/50 rounded-lg border border-dashed border-zinc-200">
                    No active roles
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Update Stage & Loss Analysis Modal */}
      {editingJobId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-zinc-300 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h3 className="text-sm font-bold text-zinc-900">
                Advance Application Pipeline Stage
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Candidate Authority Event
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Target Pipeline Stage:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as JobStatus)}
                className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg font-semibold text-zinc-900 focus:outline-none"
              >
                <option value="READY_TO_APPLY">Ready to Apply</option>
                <option value="APPLIED">Applied (Submitted to Company)</option>
                <option value="SCREENING">Screening (Recruiter Initial Screen)</option>
                <option value="INTERVIEW">Interview Stages (Technical / Loop)</option>
                <option value="OFFER">Offer Extended</option>
                <option value="WON">Won (Offer Accepted)</option>
                <option value="LOST">Lost (Rejected / Gap Encountered)</option>
                <option value="ARCHIVED">Archived / Cancelled</option>
              </select>
            </div>

            {/* Loss Analysis Fields (Section 12) */}
            {newStatus === 'LOST' && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-3">
                <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  <span>Outcome Analysis &amp; Verifiable Gap Feedback</span>
                </div>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  Record verifiable feedback to inform future Master Career Profile positioning and CV Variants without guessing.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Loss Category</label>
                    <select
                      value={lostReasonCategory}
                      onChange={(e) => setLostReasonCategory(e.target.value)}
                      className="w-full p-2 bg-white border border-rose-200 rounded text-xs"
                    >
                      <option value="SKILLS_EXPERIENCE_GAP">Skills / Experience Gap</option>
                      <option value="SALARY_MISMATCH">Salary Mismatch</option>
                      <option value="LOCATION_VISA_GAP">Location / Visa Constraint</option>
                      <option value="ROLE_CANCELLED">Company Frozen / Cancelled</option>
                      <option value="CANDIDATE_WITHDREW">Candidate Withdrew</option>
                      <option value="OTHER">Other / Undisclosed</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">Stage Lost At</label>
                    <select
                      value={lostStageAt}
                      onChange={(e) => setLostStageAt(e.target.value)}
                      className="w-full p-2 bg-white border border-rose-200 rounded text-xs"
                    >
                      <option value="Resume Screen">Resume Screen</option>
                      <option value="Post-Recruiter Screen">Recruiter Screen</option>
                      <option value="Technical Round">Technical / Case Study</option>
                      <option value="Executive Round">Final / Executive Loop</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1 text-[11px]">
                    Lessons Learned / Actionable Gap to Update in Profile:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Hiring manager wanted explicit AWS fintech architecture evidence. Update Master Profile Experience..."
                    value={lostLessons}
                    onChange={(e) => setLostLessons(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-rose-200 rounded"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Candidate Notes / Stage Details:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Recruiter confirmed next steps for panel interview on Thursday..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
              <button
                onClick={() => setEditingJobId(null)}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
