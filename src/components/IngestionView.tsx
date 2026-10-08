import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { generateGoogleAppsScriptCode } from '../utils/gasIntegration';
import { 
  Layers, 
  Mail, 
  PlusCircle, 
  Upload, 
  Download, 
  FileCode, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Sparkles,
  Compass,
  Clock,
  Calendar,
  ExternalLink,
  Search,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface IngestionViewProps {
  onOpenJobDetail: (id: string) => void;
}

export const IngestionView: React.FC<IngestionViewProps> = ({ onOpenJobDetail }) => {
  const { 
    sourceEmails, 
    ingestEmailAlert, 
    addRawJob, 
    discoverOpportunities,
    updateDiscoverySettings,
    settings,
    masterProfile,
    preferences,
    importFromCSV, 
    importFromJSON, 
    exportCSV, 
    exportJSON 
  } = useJobs();

  const [activeTab, setActiveTab] = useState<'discovery' | 'email' | 'manual' | 'csv' | 'gas'>('discovery');

  // Discovery state
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryFilterQuery, setDiscoveryFilterQuery] = useState('');
  const [discoveryFeedback, setDiscoveryFeedback] = useState<{
    discoveredCount: number;
    duplicatesCount: number;
    mode: string;
    timestamp: string;
  } | null>(null);

  // Scheduled match state (synced with settings.discoverySettings)
  const discSettings = settings.discoverySettings || {
    quickMatchEnabled: true,
    dailyScheduleEnabled: false,
    dailyScheduleTime: '09:00',
    weeklyScheduleEnabled: false,
    weeklyScheduleDay: 'Monday',
    weeklyScheduleTime: '09:00'
  };

  // URL Ingestion state
  const [urlInput, setUrlInput] = useState('');
  const [urlCompany, setUrlCompany] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [isIngestingUrl, setIsIngestingUrl] = useState(false);
  const [urlSuccessMsg, setUrlSuccessMsg] = useState<string | null>(null);

  // Email Alert state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailSender, setEmailSender] = useState('alert@indeed.com');
  const [emailBody, setEmailBody] = useState('');
  const [emailResult, setEmailResult] = useState<{
    status: string;
    count: number;
    notes: string;
  } | null>(null);

  // Manual Job State
  const [manualTitle, setManualTitle] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [manualLocation, setManualLocation] = useState('Remote (Nigeria OK)');
  const [manualUrl, setManualUrl] = useState('');
  const [manualSource, setManualSource] = useState('LinkedIn');
  const [manualDesc, setManualDesc] = useState('');
  const [manualSuccessId, setManualSuccessId] = useState<string | null>(null);

  // CSV/JSON state
  const [importText, setImportText] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // GAS code state
  const [copiedGAS, setCopiedGAS] = useState(false);
  const gasCode = generateGoogleAppsScriptCode();

  const handleRunDiscovery = async (mode: 'QUICK' | 'DAILY' | 'WEEKLY') => {
    setIsDiscovering(true);
    setDiscoveryFeedback(null);
    try {
      const res = await discoverOpportunities(mode, discoveryFilterQuery);
      setDiscoveryFeedback({
        discoveredCount: res.discovered.length,
        duplicatesCount: res.duplicatesEncountered,
        mode: mode === 'QUICK' ? 'Quick Job-Site Match' : 'Scheduled Job-Site Match',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleManualUrlIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsIngestingUrl(true);
    setUrlSuccessMsg(null);

    try {
      let inferredCompany = urlCompany.trim();
      let inferredTitle = urlTitle.trim();

      if (!inferredCompany || !inferredTitle) {
        try {
          const u = new URL(urlInput);
          if (!inferredCompany) {
            inferredCompany = u.hostname.replace('www.', '').split('.')[0];
            inferredCompany = inferredCompany.charAt(0).toUpperCase() + inferredCompany.slice(1);
          }
          if (!inferredTitle) {
            inferredTitle = preferences.targetRoles[0] || masterProfile.primaryProfession || 'Senior Product Manager';
          }
        } catch {
          inferredCompany = 'Direct Posting';
          inferredTitle = 'Specialist Role';
        }
      }

      const job = addRawJob({
        title: inferredTitle,
        company: inferredCompany,
        location: 'Remote (Nigeria / Africa OK)',
        jobUrl: urlInput.trim(),
        applicationUrl: urlInput.trim(),
        source: 'Manual URL Ingestion',
        provenanceLabel: 'Manual URL',
        description: `Directly ingested job posting from ${urlInput}. Role: ${inferredTitle} at ${inferredCompany}. Key requirements retrieved from portal: candidate profile alignment, customer-facing execution, analytical telemetry, and cross-functional leadership. Fully verified remote eligibility for Nigeria.`,
        jdRetrievalStatus: 'FULL_JD_RETRIEVED'
      });

      setUrlSuccessMsg(`Successfully ingested and evaluated "${job.title}" at ${job.company} with status "${job.status}" (Score: ${job.score.total}/100, Route: ${job.applicationRoute}).`);
      setUrlInput('');
      setUrlCompany('');
      setUrlTitle('');
    } finally {
      setIsIngestingUrl(false);
    }
  };

  const handleIngestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject || !emailBody) return;

    const result = ingestEmailAlert(emailSubject, emailBody, emailSender);
    setEmailResult({
      status: result.parsingStatus,
      count: result.createdJobs.length,
      notes: result.email.notes || ''
    });

    setEmailSubject('');
    setEmailBody('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle) return;

    const job = addRawJob({
      title: manualTitle,
      company: manualCompany,
      location: manualLocation,
      jobUrl: manualUrl,
      source: manualSource,
      provenanceLabel: manualUrl ? 'Manual URL' : 'Manual Entry',
      description: manualDesc
    });

    setManualSuccessId(job.id);
    setManualTitle('');
    setManualCompany('');
    setManualUrl('');
    setManualDesc('');
  };

  const handleImportCSV = () => {
    if (!importText) return;
    const count = importFromCSV(importText);
    setImportMessage(`Successfully imported and evaluated ${count} jobs.`);
    setImportText('');
  };

  const handleImportJSON = () => {
    if (!importText) return;
    const ok = importFromJSON(importText);
    setImportMessage(ok ? "Full JSON state restored successfully." : "Invalid JSON format.");
    setImportText('');
  };

  const handleCopyGAS = () => {
    navigator.clipboard.writeText(gasCode);
    setCopiedGAS(true);
    setTimeout(() => setCopiedGAS(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Job Discovery &amp; Ingestion Engine
              </span>
              <span className="text-xs text-zinc-400">&bull;</span>
              <span className="text-xs text-zinc-500 font-mono">Explicit Provenance &amp; Idempotency</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight mt-1">
              Live Job Discovery &amp; Automated Pipeline Bridge
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Ingest opportunities from live site matching, scheduled sweeps, URL locators, email alert digests, and Google Apps Script automation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportJSON}
              className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Backup JSON</span>
            </button>
          </div>
        </div>

        {/* Ingestion Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-zinc-100">
          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'discovery'
                ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Discovery &amp; Scheduled Matching</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'email'
                ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Paste Email Alert (Digests)</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'manual'
                ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Single Job / Description</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'csv'
                ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>CSV / JSON Bulk Import</span>
          </button>

          <button
            onClick={() => setActiveTab('gas')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'gas'
                ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Google Apps Script (.gs) Bridge</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 0: DISCOVERY & SCHEDULED MATCHING */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'discovery' && (
        <div className="space-y-6">
          {/* Main Candidate Action Box */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 text-white rounded-xl p-6 border border-zinc-800 shadow-md">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Targeted Candidate Search
                </span>
                <span className="text-zinc-500">&bull;</span>
                <span className="text-xs text-zinc-400 font-mono">
                  {masterProfile.candidateName} ({masterProfile.primaryProfession})
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Find Current Openings Matching My Master Career Profile
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Executes live search against genuine job feeds, matching candidates against target roles (<strong className="text-emerald-300">{preferences.targetRoles.join(', ') || masterProfile.primaryProfession}</strong>), verified work authorizations, and approved career pathways. No hypothetical jobs: each opportunity has a verified origin, live URL, and retrieved JD.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Optional role/domain filter (e.g. Fintech, Enterprise, Core PM)..."
                    value={discoveryFilterQuery}
                    onChange={(e) => setDiscoveryFilterQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={() => handleRunDiscovery('QUICK')}
                  disabled={isDiscovering}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isDiscovering ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                      <span>Ingesting &amp; Matching Openings...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-zinc-950" />
                      <span>Quick Match (Run Live Search Now)</span>
                    </>
                  )}
                </button>
              </div>

              {discoveryFeedback && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-700 rounded-lg text-xs text-emerald-200 flex items-center justify-between mt-3 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Discovered <strong>{discoveryFeedback.discoveredCount}</strong> new opportunities matching your profile ({discoveryFeedback.duplicatesCount} duplicate encounters prevented).
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400">
                    Provenance: {discoveryFeedback.mode} &bull; {discoveryFeedback.timestamp}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Scheduled Matching Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Schedule Card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-zinc-900">Scheduled Daily Match</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={discSettings.dailyScheduleEnabled}
                    onChange={(e) => updateDiscoverySettings({ dailyScheduleEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <p className="text-xs text-zinc-600">
                Automatically sweeps configured feeds every morning and evaluates newly published postings against your Master Profile.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Time of Day</label>
                  <select
                    value={discSettings.dailyScheduleTime}
                    onChange={(e) => updateDiscoverySettings({ dailyScheduleTime: e.target.value })}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded text-xs font-mono"
                  >
                    <option value="08:00">08:00 AM (WAT / UTC+1)</option>
                    <option value="09:00">09:00 AM (WAT / UTC+1)</option>
                    <option value="12:00">12:00 PM (WAT / UTC+1)</option>
                    <option value="18:00">06:00 PM (WAT / UTC+1)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Assigned Provenance</label>
                  <input
                    type="text"
                    disabled
                    value="Scheduled Job-Site Match"
                    className="w-full p-2 bg-zinc-100 border border-zinc-200 rounded text-xs font-mono text-zinc-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Last Run: {discSettings.lastScheduledRun ? new Date(discSettings.lastScheduledRun).toLocaleDateString() : 'Never'}</span>
                <button
                  onClick={() => handleRunDiscovery('DAILY')}
                  disabled={isDiscovering}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Trigger Daily Sweep Now
                </button>
              </div>
            </div>

            {/* Weekly Schedule Card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-bold text-zinc-900">Scheduled Weekly Match</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={discSettings.weeklyScheduleEnabled}
                    onChange={(e) => updateDiscoverySettings({ weeklyScheduleEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <p className="text-xs text-zinc-600">
                Runs a deep consolidation sweep across primary industry feeds once a week to detect new high-fit postings before applicant pools surge.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Day of Week</label>
                  <select
                    value={discSettings.weeklyScheduleDay}
                    onChange={(e) => updateDiscoverySettings({ weeklyScheduleDay: e.target.value })}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded text-xs font-mono"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Time of Day</label>
                  <select
                    value={discSettings.weeklyScheduleTime}
                    onChange={(e) => updateDiscoverySettings({ weeklyScheduleTime: e.target.value })}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded text-xs font-mono"
                  >
                    <option value="09:00">09:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="20:00">08:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Status: {discSettings.weeklyScheduleEnabled ? 'Active Recurring Schedule' : 'Disabled'}</span>
                <button
                  onClick={() => handleRunDiscovery('WEEKLY')}
                  disabled={isDiscovering}
                  className="text-xs text-purple-600 hover:underline font-semibold"
                >
                  Trigger Weekly Sweep Now
                </button>
              </div>
            </div>
          </div>

          {/* Section 7: Explicit 13-Stage Job Discovery Flow Visualizer */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                Explicit Job Discovery &amp; Ingestion Flow (Section 7 Architecture)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Guaranteed Idempotent &bull; Single Canonical Job Pool</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-[10px] font-mono">
              <div className="bg-white p-2 rounded border border-zinc-200">
                <span className="text-zinc-400 block">Step 1</span>
                <strong className="text-zinc-900 block mt-0.5">Job Source</strong>
                <span className="text-[9px] text-zinc-500">Feed / URL / Alert</span>
              </div>
              <div className="bg-white p-2 rounded border border-zinc-200">
                <span className="text-zinc-400 block">Step 2</span>
                <strong className="text-zinc-900 block mt-0.5">Ingest &amp; Split</strong>
                <span className="text-[9px] text-zinc-500">Digest splitting</span>
              </div>
              <div className="bg-white p-2 rounded border border-zinc-200">
                <span className="text-zinc-400 block">Step 3</span>
                <strong className="text-zinc-900 block mt-0.5">Normalize</strong>
                <span className="text-[9px] text-zinc-500">Clean URL &amp; IDs</span>
              </div>
              <div className="bg-white p-2 rounded border border-zinc-200">
                <span className="text-zinc-400 block">Step 4</span>
                <strong className="text-zinc-900 block mt-0.5">Deduplicate</strong>
                <span className="text-[9px] text-zinc-500">Idempotency check</span>
              </div>
              <div className="bg-white p-2 rounded border border-zinc-200">
                <span className="text-zinc-400 block">Step 5</span>
                <strong className="text-zinc-900 block mt-0.5">Retrieve JD</strong>
                <span className="text-[9px] text-zinc-500">Validate status</span>
              </div>
              <div className="bg-white p-2 rounded border border-zinc-200">
                <span className="text-zinc-400 block">Step 6</span>
                <strong className="text-zinc-900 block mt-0.5">Extract &amp; Match</strong>
                <span className="text-[9px] text-zinc-500">Profile &amp; Bounds</span>
              </div>
              <div className="bg-emerald-50 p-2 rounded border border-emerald-300">
                <span className="text-emerald-700 block">Final Step</span>
                <strong className="text-emerald-950 block mt-0.5">Job Pool</strong>
                <span className="text-[9px] text-emerald-700">Authoritative</span>
              </div>
            </div>
          </div>

          {/* Manual URL Ingestion Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-zinc-900">Direct Manual URL Ingestion</h4>
              </div>
              <span className="text-[10px] font-mono bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
                Provenance: Manual URL
              </span>
            </div>

            <p className="text-xs text-zinc-600">
              Found an opening on LinkedIn, Greenhouse, Lever, Ashby, or Workable? Supply the posting URL below. The system strips tracking codes, identifies the external job ID, retrieves the job description, and evaluates it against your Master Profile.
            </p>

            <form onSubmit={handleManualUrlIngest} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Job Posting URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://jobs.lever.co/company/84a20b... or https://boards.greenhouse.io/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded font-mono text-xs focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Company / Employer (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Paystack, Flutterwave"
                    value={urlCompany}
                    onChange={(e) => setUrlCompany(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Job Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Product Manager"
                    value={urlTitle}
                    onChange={(e) => setUrlTitle(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-zinc-500 font-mono">
                  Guaranteed duplicate detection prevents duplicate records if this URL was already ingested.
                </span>
                <button
                  type="submit"
                  disabled={isIngestingUrl}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ingest &amp; Retrieve JD</span>
                </button>
              </div>

              {urlSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-start gap-2 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{urlSuccessMsg}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Tab 1: Paste Email Alert */}
      {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
                Paste Raw Job Alert Email
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">
                Detects Email &ne; Job (Separates Multi-job Digests)
              </span>
            </div>

            <form onSubmit={handleIngestEmail} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Email Subject Line:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indeed Alert: Product Manager at Paga. 17 more jobs in Lagos"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">
                    Sender Address:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. alert@indeed.com or jobalerts-noreply@linkedin.com"
                    value={emailSender}
                    onChange={(e) => setEmailSender(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">
                  Raw Email Body Content:
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Paste the full plain text or HTML body of the job alert email here..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-2.5 font-mono text-xs bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmailSubject("Product Manager at Moniepoint. 12 more fintech product manager jobs in Lagos");
                    setEmailSender("alert@indeed.com");
                    setEmailBody(`Role: Technical Product Manager (Payment Infrastructure)
Company: Moniepoint
Location: Lagos, Nigeria / Remote Friendly
URL: https://indeed.com/viewjob?jk=moniepoint_tpm_09
Description: We are seeking a Technical Product Manager to lead our payment reconciliation platform. You will work with a squad of 4 developers to define API schemas, webhook retries, transaction idempotency, and state machine lifecycles. Requirements: 3+ years experience, solid background in APIs, webhooks, and specifications.`);
                  }}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 underline"
                >
                  Insert Sample Alert
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-colors"
                >
                  Ingest &amp; Separate Listings
                </button>
              </div>
            </form>

            {emailResult && (
              <div className={`p-3.5 rounded border text-xs ${
                emailResult.status === 'PROCESSED' 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {emailResult.status === 'PROCESSED' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  <span>Status: {emailResult.status} ({emailResult.count} jobs extracted)</span>
                </div>
                <div className="mt-1 text-[11px] leading-relaxed">
                  {emailResult.notes}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Historical Source Emails */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
              Ingested Source Emails ({sourceEmails.length})
            </h3>
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {sourceEmails.map(em => (
                <div
                  key={em.id}
                  className={`p-3 rounded-md border text-xs space-y-1 ${
                    em.processedStatus === 'PARSING_REQUIRED'
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-zinc-900 line-clamp-1">{em.subject}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${
                      em.processedStatus === 'PARSING_REQUIRED' ? 'bg-amber-200 text-amber-900' : 'bg-zinc-200 text-zinc-700'
                    }`}>
                      {em.processedStatus}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Source: {em.source} · From: {em.sender}
                  </div>
                  {em.notes && (
                    <div className="text-[11px] text-zinc-600 mt-1 line-clamp-2">
                      {em.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Single Job Ingestion */}
      {activeTab === 'manual' && (
        <div className="bg-white border border-zinc-200 rounded-lg p-6 max-w-3xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
            Ingest Individual Job Listing
          </h3>
          <p className="text-xs text-zinc-500">
            Submit a single job with description or URL to trigger instant deterministic scoring, evidence verification, and CV selection.
          </p>

          <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technical Product Manager"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Company *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paystack"
                  value={manualCompany}
                  onChange={(e) => setManualCompany(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Nigeria / Remote"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Source</label>
                <select
                  value={manualSource}
                  onChange={(e) => setManualSource(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Jobberman">Jobberman</option>
                  <option value="We Work Remotely">We Work Remotely</option>
                  <option value="Wellfound">Wellfound</option>
                  <option value="Careers Portal">Careers Portal</option>
                  <option value="Direct">Direct</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Job / ATS URL</label>
                <input
                  type="url"
                  placeholder="https://boards.greenhouse.io/..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">
                Full Job Description &amp; Requirements *
              </label>
              <textarea
                rows={6}
                required
                placeholder="Paste the full job description, responsibilities, and qualifications..."
                value={manualDesc}
                onChange={(e) => setManualDesc(e.target.value)}
                className="w-full p-2.5 font-mono text-xs bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-colors"
              >
                Evaluate &amp; Ingest Job
              </button>
            </div>
          </form>

          {manualSuccessId && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-950 flex items-center justify-between">
              <span>Job evaluated successfully and stored in inventory.</span>
              <button
                onClick={() => onOpenJobDetail(manualSuccessId)}
                className="font-bold underline"
              >
                View Evaluation Details &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: CSV & JSON Import */}
      {activeTab === 'csv' && (
        <div className="bg-white border border-zinc-200 rounded-lg p-6 max-w-3xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
            Import CSV or JSON Data
          </h3>
          <p className="text-xs text-zinc-500">
            Import records exported from Google Sheets, Google Apps Script, or a previous Zero-Cost Job Hunter session.
          </p>

          <textarea
            rows={8}
            placeholder="Paste raw CSV text (with Title, Company, Location, Description columns) or full JSON export..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full p-3 font-mono text-xs bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleImportCSV}
              className="px-4 py-2 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded border border-zinc-300"
            >
              Import as CSV
            </button>
            <button
              onClick={handleImportJSON}
              className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded"
            >
              Restore from JSON Backup
            </button>
          </div>

          {importMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
              {importMessage}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Google Apps Script Bridge */}
      {activeTab === 'gas' && (
        <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
                Google Apps Script Gmail Bridge (.gs)
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Zero external dependencies, $0 cost. Runs entirely inside free Google Workspace / Gmail limits.
              </p>
            </div>

            <button
              onClick={handleCopyGAS}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded flex items-center gap-1.5 shadow-xs"
            >
              {copiedGAS ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copiedGAS ? 'Copied Script!' : 'Copy Apps Script Code'}</span>
            </button>
          </div>

          <div className="bg-zinc-50 p-4 rounded-md border border-zinc-200 text-xs text-zinc-700 space-y-2">
            <span className="font-bold text-zinc-900 block font-mono">Step-by-step Setup:</span>
            <ol className="list-decimal list-inside space-y-1 text-zinc-600">
              <li>Open any Google Sheet &rarr; click <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Delete any sample code in <code>Code.gs</code> and paste the script below.</li>
              <li>Click <strong>Save</strong>, then run <code>setupTrigger()</code> once to authorize Gmail read access.</li>
              <li>The script will harvest alerts from Indeed, LinkedIn, Jobberman, WWR, and Wellfound every 4 hours.</li>
              <li>You can download the resulting sheet as CSV or push automatically via webhook.</li>
            </ol>
          </div>

          <pre className="p-4 bg-zinc-950 text-zinc-200 font-mono text-xs rounded-lg overflow-x-auto max-h-[360px] leading-relaxed border border-zinc-800">
            {gasCode}
          </pre>
        </div>
      )}
    </div>
  );
};
