import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  Sliders, 
  ShieldCheck, 
  RotateCcw, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Key,
  Activity,
  UserCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { aiProvider } from '../engine/aiProvider';
import { providerManager } from '../engine/providers/providerManager';
import { AIModelDefinition } from '../types/ai';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetToDemoData, 
    clearAllData, 
    exportCSV, 
    exportJSON,
    activePresetId,
    candidatePresets,
    switchCandidatePreset,
    reEvaluateAllJobs,
    aiTaskLogs
  } = useJobs();

  const [minApply, setMinApply] = useState(settings.minApplyScore);
  const [minReview, setMinReview] = useState(settings.minReviewScore);
  const [targetLocation, setTargetLocation] = useState(settings.targetLocation);
  const [rejectPaid, setRejectPaid] = useState(settings.rejectPaidApplications);
  const [useAI, setUseAI] = useState(settings.useAIInterpretation);

  // Multi-Model Configuration (Section 29 & 30)
  const availableModels = providerManager.getModels().map(m => ({
    id: m.modelId,
    label: `${m.displayName} (${m.provider}) - ${m.costCategory.toUpperCase()}`
  }));

  const [extractionModel, setExtractionModel] = useState(settings.taskModels.extractionModel || availableModels[0]?.id || 'gemini-2.5-flash');
  const [matchingModel, setMatchingModel] = useState(settings.taskModels.matchingModel || availableModels[0]?.id || 'gemini-2.5-flash');
  const [generationModel, setGenerationModel] = useState(settings.taskModels.generationModel || availableModels[0]?.id || 'gemini-2.5-flash');
  const [parsingModel, setParsingModel] = useState(settings.taskModels.parsingModel || availableModels[0]?.id || 'gemini-2.5-flash');
  const [temperature, setTemperature] = useState(settings.taskModels.temperature ?? 0.1);

  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTaskModels = {
      extractionModel,
      matchingModel,
      generationModel,
      parsingModel,
      temperature: Number(temperature)
    };

    updateSettings({
      minApplyScore: Number(minApply),
      minReviewScore: Number(minReview),
      targetLocation,
      rejectPaidApplications: rejectPaid,
      useAIInterpretation: useAI,
      taskModels: updatedTaskModels
    });

    aiProvider.setConfig({
      modelName: extractionModel,
      temperature: Number(temperature),
      taskModels: updatedTaskModels
    });

    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <h2 className="text-base font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <Sliders className="w-4 h-4 text-zinc-700" />
          <span>System Settings &amp; Multi-Model AI Architecture</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Configure multi-model task routing, deterministic evaluation thresholds, candidate profiles, and audit logs.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 29 & 30: AI Model Abstraction Layer */}
        <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-600" />
                AI Model Abstraction Layer (Multi-Model Support)
              </span>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                No hardcoded models. Assign task-appropriate models across extraction, matching, document parsing, and CV writing.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className={`px-2 py-0.5 rounded font-bold ${
                aiProvider.isAIAvailable() ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {aiProvider.isAIAvailable() ? 'AI Active (API Key Detected)' : 'Deterministic Fallback Active ($0 Cost)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded space-y-1">
              <label className="font-bold text-zinc-900 block">Requirement Extraction Task Model:</label>
              <select
                value={extractionModel}
                onChange={(e) => setExtractionModel(e.target.value)}
                className="w-full p-2 bg-white border border-zinc-300 rounded font-mono text-xs"
              >
                {availableModels.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-500 block">Used for parsing discrete requirements from JD text.</span>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded space-y-1">
              <label className="font-bold text-zinc-900 block">Evidence Matching &amp; Reasoning Model:</label>
              <select
                value={matchingModel}
                onChange={(e) => setMatchingModel(e.target.value)}
                className="w-full p-2 bg-white border border-zinc-300 rounded font-mono text-xs"
              >
                {availableModels.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-500 block">Used for nuanced semantic evidence mapping and boundary checking.</span>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded space-y-1">
              <label className="font-bold text-zinc-900 block">CV &amp; Materials Generation Model:</label>
              <select
                value={generationModel}
                onChange={(e) => setGenerationModel(e.target.value)}
                className="w-full p-2 bg-white border border-zinc-300 rounded font-mono text-xs"
              >
                {availableModels.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-500 block">Used for Master CV synthesis and one-time ATS job-specific CV tailoring.</span>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded space-y-1">
              <label className="font-bold text-zinc-900 block">Candidate Document Parsing Model:</label>
              <select
                value={parsingModel}
                onChange={(e) => setParsingModel(e.target.value)}
                className="w-full p-2 bg-white border border-zinc-300 rounded font-mono text-xs"
              >
                {availableModels.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-500 block">Used for parsing uploaded resumes/PDFs into structured Master Profiles.</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-zinc-900">Temperature Parameter: {temperature}</label>
              <span className="text-[10px] text-zinc-500 font-mono">0.0 (Strictly factual) - 1.0 (Creative)</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-zinc-900"
            />
            <p className="text-[10px] text-zinc-500">
              Low temperature (0.1) is mandatory for evidence-grounded matching to prevent hallucinated qualifications or metrics.
            </p>
          </div>
        </div>

        {/* Section 22 & 24: Scoring Thresholds & Gate Rules */}
        <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono block">
            Evaluation Thresholds &amp; Decision Gate
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded">
              <label className="font-bold text-emerald-950 block mb-1">
                APPLY Score Threshold (Min):
              </label>
              <input
                type="number"
                min={60}
                max={95}
                value={minApply}
                onChange={(e) => setMinApply(Number(e.target.value))}
                className="w-full p-2 bg-white border border-emerald-300 rounded font-mono font-bold text-sm"
              />
              <span className="text-[10px] text-emerald-800 mt-1 block">
                Roles scoring &ge;{minApply} receive automatic APPLY status if all 10 Apply Gate checks pass.
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded">
              <label className="font-bold text-amber-950 block mb-1">
                REVIEW Score Threshold (Min):
              </label>
              <input
                type="number"
                min={50}
                max={84}
                value={minReview}
                onChange={(e) => setMinReview(Number(e.target.value))}
                className="w-full p-2 bg-white border border-amber-300 rounded font-mono font-bold text-sm"
              />
              <span className="text-[10px] text-amber-800 mt-1 block">
                Roles scoring {minReview}&ndash;{minApply - 1} enter Review Queue. Below {minReview} is REJECT.
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rejectPaid}
                onChange={(e) => setRejectPaid(e.target.checked)}
                className="mt-0.5 rounded text-zinc-900 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-zinc-900 block">
                  Strictly Hard-Reject Paid Application Platforms ($0 Rule)
                </span>
                <span className="text-[11px] text-zinc-500">
                  Instantly reject and flag any opportunity requiring fees, paid subscriptions, or paid unlocks.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="mt-0.5 rounded text-zinc-900 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-zinc-900 block">
                  Enable AI Model Semantic Interpretation (When API Key is present)
                </span>
                <span className="text-[11px] text-zinc-500">
                  When enabled, invokes configured Gemini models for nuanced matching. When disabled or offline, uses 100% deterministic local rules.
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
            {savedMessage && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved successfully.
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-colors ml-auto shadow-xs"
            >
              Save System Settings
            </button>
          </div>
        </div>
      </form>

      {/* Section 31: AI Task Activity Log */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4 text-xs shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>AI Task Activity Audit Trail ({aiTaskLogs.length} events)</span>
          </h3>
          <span className="text-[10px] text-zinc-400 font-mono">Live In-Memory Telemetry</span>
        </div>

        {aiTaskLogs.length > 0 ? (
          <div className="space-y-2 max-h-52 overflow-y-auto font-mono text-[11px]">
            {aiTaskLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="p-2.5 bg-zinc-50 border border-zinc-200 rounded flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="font-bold text-zinc-900">{log.task}</span>
                  <span className="text-zinc-500">({log.model})</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-[10px]">
                  <span>{log.latencyMs}ms</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 italic py-2 text-center">
            No recent AI calls recorded yet. Ingest a job, discover pathways, or run diagnostics to log activity.
          </p>
        )}
      </div>

      {/* Data Management & Demo Reset */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4 text-xs shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
          Data Management &amp; Test Case Restoration
        </h3>
        <p className="text-zinc-500">
          Export full state to CSV or JSON backup, or reset data to the standard test pipeline.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={resetToDemoData}
            className="px-4 py-2 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-600" />
            <span>Reset to Standard Pipeline</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-300 rounded flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportJSON}
            className="px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-300 rounded flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Download JSON Backup</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all jobs and emails?")) {
                clearAllData();
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded flex items-center gap-1.5 ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
