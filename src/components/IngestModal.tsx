import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { X, Mail, PlusCircle, CheckCircle2, AlertTriangle, FileText, ArrowRight, ExternalLink } from 'lucide-react';

interface IngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobEvaluated?: (id: string) => void;
}

export const IngestModal: React.FC<IngestModalProps> = ({ isOpen, onClose, onJobEvaluated }) => {
  const { ingestEmailAlert, ingestManualJD } = useJobs();
  const [mode, setMode] = useState<'paste_jd' | 'email'>('paste_jd');

  // Manual JD Paste
  const [pastedJdText, setPastedJdText] = useState('');
  const [jdSource, setJdSource] = useState('LinkedIn / Web');

  // Email form
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('alerts@indeed.com');
  const [emailBody, setEmailBody] = useState('');

  const [resultMessage, setResultMessage] = useState<{ 
    type: 'success' | 'warning'; 
    text: string; 
    jobId?: string;
    decision?: string;
    nextStep?: string;
    missingFields?: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleManualJdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedJdText.trim()) return;

    const job = ingestManualJD(pastedJdText, jdSource);
    
    // Determine next step based on evaluation outcome
    let nextStep = 'Review Opportunity';
    if (job.missingFields && job.missingFields.length > 0) {
      nextStep = `Resolve Missing Information (${job.missingFields.join(', ')})`;
    } else if (job.decision === 'APPLY') {
      nextStep = 'Prepare Application Package';
    } else if (job.decision === 'REVIEW') {
      nextStep = 'Review Opportunity in Desk';
    } else if (job.decision === 'WATCH') {
      nextStep = 'Monitor on Watchlist';
    } else {
      nextStep = 'Inspect Match Reasons';
    }

    setResultMessage({
      type: job.decision === 'APPLY' ? 'success' : 'warning',
      text: `${job.title} at ${job.company} — Fit Score: ${job.score.total}/100.`,
      jobId: job.id,
      decision: job.decision,
      nextStep,
      missingFields: job.missingFields
    });

    setPastedJdText('');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = ingestEmailAlert(subject, emailBody, sender);
    if (res.parsingStatus === 'PROCESSED') {
      const topJob = res.createdJobs[0];
      setResultMessage({
        type: 'success',
        text: `Extracted and evaluated ${res.createdJobs.length} job(s) from alert!`,
        jobId: topJob?.id,
        decision: topJob?.decision,
        nextStep: topJob?.decision === 'APPLY' ? 'Prepare Application Package' : 'Review Opportunity'
      });
    } else {
      setResultMessage({
        type: 'warning',
        text: `Alert email marked as PARSING REQUIRED. Placed in Review Desk.`,
        nextStep: 'Manual inspection required'
      });
    }
    setSubject('');
    setEmailBody('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-zinc-300 max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div>
            <h3 className="text-base font-bold text-zinc-900">
              Job Ingestion &amp; Discovery
            </h3>
            <p className="text-xs text-zinc-500">
              Paste a full job description from any source or ingest email alerts.
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-zinc-100 p-1 text-xs font-semibold">
          <button
            onClick={() => { setMode('paste_jd'); setResultMessage(null); }}
            className={`flex-1 py-1.5 rounded transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'paste_jd' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Paste Job Description</span>
          </button>
          <button
            onClick={() => { setMode('email'); setResultMessage(null); }}
            className={`flex-1 py-1.5 rounded transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'email' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-purple-600" />
            <span>Job Alert Email</span>
          </button>
        </div>

        {/* User-Facing Next-Step Result Banner (Section 10) */}
        {resultMessage && (
          <div className={`p-4 rounded-xl text-xs space-y-2 border ${
            resultMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300' 
              : 'bg-amber-50 text-amber-950 border-amber-300'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {resultMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span className="font-bold text-zinc-900">{resultMessage.text}</span>
              </div>
              {resultMessage.decision && (
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                  resultMessage.decision === 'APPLY' ? 'bg-emerald-200 text-emerald-900' :
                  resultMessage.decision === 'REVIEW' ? 'bg-amber-200 text-amber-900' :
                  'bg-zinc-200 text-zinc-800'
                }`}>
                  {resultMessage.decision}
                </span>
              )}
            </div>

            {resultMessage.nextStep && (
              <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60">
                <span className="text-[11px] text-zinc-600">
                  <strong>Recommended Next Step:</strong> {resultMessage.nextStep}
                </span>
                {resultMessage.jobId && onJobEvaluated && (
                  <button
                    onClick={() => {
                      onJobEvaluated(resultMessage.jobId!);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 font-bold px-2.5 py-1 bg-zinc-900 text-white rounded text-[11px] hover:bg-zinc-800 transition-colors"
                  >
                    <span>Inspect &amp; Act</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Manual JD Paste */}
        {mode === 'paste_jd' ? (
          <form onSubmit={handleManualJdSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">
                Source Attribution
              </label>
              <select
                value={jdSource}
                onChange={(e) => setJdSource(e.target.value)}
                className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded text-xs focus:ring-1 focus:ring-zinc-900"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Company Careers Portal">Company Careers Portal</option>
                <option value="Recruiter Message">Recruiter Message / InMail</option>
                <option value="WhatsApp / Telegram">WhatsApp / Messaging</option>
                <option value="Email Alert">Email Notification</option>
                <option value="Other Board">Other Job Board</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">
                Pasted Job Description Text *
              </label>
              <textarea
                rows={9}
                required
                placeholder="Paste the full job posting from LinkedIn, Indeed, employer portal, or recruiter message. The system will extract title, company, location, remote eligibility, and requirements automatically..."
                value={pastedJdText}
                onChange={(e) => setPastedJdText(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed"
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                No URL required. Missing critical fields (employer, title, location) will be surfaced without fabrication.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!pastedJdText.trim()}
                className="px-4 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
              >
                Process &amp; Place in Job Pool
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Email Ingestion */
          <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Email Subject Line *</label>
              <input
                type="text"
                required
                placeholder="e.g. Indeed Alert: Senior Product Manager at Flutterwave"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Sender Email</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Email Content / Digest Body *</label>
              <textarea
                rows={7}
                required
                placeholder="Paste the raw alert email body (single job or multi-job digest)..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full p-2.5 font-mono text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!emailBody.trim()}
                className="px-4 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
              >
                Ingest &amp; Separate Listings
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
