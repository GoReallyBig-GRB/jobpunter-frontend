import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { X, Mail, PlusCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface IngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobEvaluated?: (id: string) => void;
}

export const IngestModal: React.FC<IngestModalProps> = ({ isOpen, onClose, onJobEvaluated }) => {
  const { ingestEmailAlert, addRawJob } = useJobs();
  const [mode, setMode] = useState<'email' | 'manual'>('email');

  // Email form
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('alerts@indeed.com');
  const [emailBody, setEmailBody] = useState('');

  // Manual form
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Nigeria / Remote');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');

  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'warning'; text: string; jobId?: string } | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = ingestEmailAlert(subject, emailBody, sender);
    if (res.parsingStatus === 'PROCESSED') {
      setResultMessage({
        type: 'success',
        text: `Extracted and evaluated ${res.createdJobs.length} job(s) from alert!`,
        jobId: res.createdJobs[0]?.id
      });
    } else {
      setResultMessage({
        type: 'warning',
        text: `Alert email marked as PARSING REQUIRED. Placed in Review Desk.`
      });
    }
    setSubject('');
    setEmailBody('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job = addRawJob({
      title,
      company,
      location,
      jobUrl: url,
      description: desc
    });
    setResultMessage({
      type: 'success',
      text: `Role evaluated! Decision: ${job.decision} (${job.score.total}/100)`,
      jobId: job.id
    });
    setTitle('');
    setCompany('');
    setUrl('');
    setDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-zinc-300 max-w-xl w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-zinc-900">
              Ingest New Job Opportunity
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
              Precision Filter
            </span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-md bg-zinc-100 p-1 text-xs">
          <button
            onClick={() => { setMode('email'); setResultMessage(null); }}
            className={`flex-1 py-1.5 font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'email' ? 'bg-white font-bold text-zinc-900 shadow-xs' : 'text-zinc-600'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Job Alert Email (Single or Digest)</span>
          </button>
          <button
            onClick={() => { setMode('manual'); setResultMessage(null); }}
            className={`flex-1 py-1.5 font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'manual' ? 'bg-white font-bold text-zinc-900 shadow-xs' : 'text-zinc-600'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Single Job Description</span>
          </button>
        </div>

        {resultMessage && (
          <div className={`p-3 rounded text-xs flex items-start justify-between ${
            resultMessage.type === 'success' ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'bg-amber-50 text-amber-950 border border-amber-200'
          }`}>
            <div className="flex items-center gap-2">
              {resultMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
              <span>{resultMessage.text}</span>
            </div>
            {resultMessage.jobId && onJobEvaluated && (
              <button
                onClick={() => {
                  onJobEvaluated(resultMessage.jobId!);
                  onClose();
                }}
                className="font-bold underline text-[11px] shrink-0 ml-2"
              >
                Inspect &rarr;
              </button>
            )}
          </div>
        )}

        {mode === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Email Subject Line *</label>
              <input
                type="text"
                required
                placeholder="e.g. Indeed Alert: Product Manager at Paga"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Raw Email Body *</label>
              <textarea
                rows={6}
                required
                placeholder="Paste the full text of the alert email..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full p-2 font-mono text-xs bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded"
              >
                Ingest Email
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Manager"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Company *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flutterwave"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Job / ATS URL</label>
              <input
                type="url"
                placeholder="https://jobs.lever.co/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Job Description *</label>
              <textarea
                rows={5}
                required
                placeholder="Paste the role requirements, team details, and qualifications..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full p-2 font-mono text-xs bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded"
              >
                Evaluate Opportunity
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
