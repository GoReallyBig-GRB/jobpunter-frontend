import React, { useState } from 'react';
import { providerManager } from '../engine/providers/providerManager';
import { AIModelDefinition, TaskModelRoute, TaskType, ProviderCredentials } from '../types/ai';
import { AITaskLogEntry } from '../types/job';
import { 
  Cpu, 
  Key, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Settings, 
  Save, 
  RefreshCw,
  Plus,
  Zap,
  Globe,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export const AIProvidersView: React.FC = () => {
  const [models, setModels] = useState<AIModelDefinition[]>(() => providerManager.getModels());
  const [routes, setRoutes] = useState<TaskModelRoute[]>(() => providerManager.getRoutes());
  const [credentials, setCredentials] = useState<ProviderCredentials>(() => providerManager.getCredentials());
  const [taskLogs, setTaskLogs] = useState<AITaskLogEntry[]>(() => providerManager.getTaskLogs());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Key form state
  const [googleKey, setGoogleKey] = useState(credentials.googleApiKey || '');
  const [openaiKey, setOpenaiKey] = useState(credentials.openaiApiKey || '');
  const [anthropicKey, setAnthropicKey] = useState(credentials.anthropicApiKey || '');
  const [customUrl, setCustomUrl] = useState(credentials.customBaseUrl || '');
  const [customKey, setCustomKey] = useState(credentials.customApiKey || '');

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    providerManager.setCredentials({
      googleApiKey: googleKey.trim(),
      openaiApiKey: openaiKey.trim(),
      anthropicApiKey: anthropicKey.trim(),
      customBaseUrl: customUrl.trim(),
      customApiKey: customKey.trim()
    });
    setCredentials(providerManager.getCredentials());
    setModels(providerManager.getModels());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRouteModelChange = (task: TaskType, primaryModelId: string) => {
    const existing = providerManager.getRouteForTask(task);
    const updated: TaskModelRoute = { ...existing, primaryModelId };
    providerManager.setRoute(updated);
    setRoutes(providerManager.getRoutes());
  };

  const handleRouteFallbackChange = (task: TaskType, fallbackModelId: string) => {
    const existing = providerManager.getRouteForTask(task);
    const updated: TaskModelRoute = { ...existing, fallbackModelId: fallbackModelId || undefined };
    providerManager.setRoute(updated);
    setRoutes(providerManager.getRoutes());
  };

  const tasksList: { task: TaskType; label: string; desc: string }[] = [
    { task: 'document_parsing', label: 'Document File Extraction', desc: 'Raw text and section parsing from PDF, DOCX, and TXT files' },
    { task: 'profile_extraction', label: 'Master Career Profile Structuring', desc: 'Structuring candidate facts, boundaries, and competencies' },
    { task: 'jd_extraction', label: 'JD Requirement Extraction', desc: 'Extracting discrete requirements and severities from raw postings' },
    { task: 'requirement_classification', label: 'Requirement Classification', desc: 'Classifying requirements into Core Role, Domain, Seniority' },
    { task: 'evidence_matching', label: 'Evidence & Gap Matching', desc: 'Semantic mapping of requirements against factual Master Profile' },
    { task: 'career_pathway_discovery', label: 'Career Pathway Discovery', desc: 'Suggesting evidence-grounded pathways and target roles' },
    { task: 'cv_generation', label: 'CV Studio & Job-Specific ATS CVs', desc: 'Drafting substantive application-ready ATS resumes' },
    { task: 'cover_letter', label: 'Cover Letter Drafting', desc: 'Grounded cover letters referencing verified candidate projects' },
    { task: 'application_questions', label: 'Application Questions Generator', desc: 'Anticipating employer screening and behavioral questions' },
    { task: 'suggested_answers', label: 'Evidence-Grounded Answers', desc: 'Formulating answers anchored strictly in candidate proof' }
  ];

  return (
    <div className="space-y-6 text-sm">
      {/* View Header */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                True Provider Abstraction
              </span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs text-zinc-500 font-mono">Multi-Model Registry &amp; Task Router</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">AI Providers, Models &amp; Routing</h1>
            <p className="text-xs text-zinc-600 max-w-2xl leading-relaxed">
              Configure direct foundation providers (Google, OpenAI, Anthropic), local OpenAI-compatible endpoints (Ollama, vLLM), or gateway aggregators (OpenRouter). Route different models to specific extraction, matching, and generation tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Provider Credentials Card */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-600" />
            Provider Credentials &amp; API Keys
          </h2>
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Credentials Saved &amp; Models Refreshed
            </span>
          )}
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Google Gemini */}
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-zinc-900">Google Gemini</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                  Default / $0 Tier
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Injected via runtime or custom API key.</p>
              <input
                type="password"
                placeholder="GEMINI_API_KEY"
                value={googleKey}
                onChange={(e) => setGoogleKey(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs font-mono"
              />
            </div>

            {/* OpenAI */}
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-zinc-900">OpenAI Direct</span>
                <span className="text-[10px] font-mono bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded">
                  Paid / Commercial
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">GPT-4o, GPT-4o-mini support.</p>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs font-mono"
              />
            </div>

            {/* Anthropic */}
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-zinc-900">Anthropic Claude</span>
                <span className="text-[10px] font-mono bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded">
                  Paid / Commercial
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Claude 3.7 Sonnet, 3.5 Haiku.</p>
              <input
                type="password"
                placeholder="sk-ant-..."
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
          </div>

          {/* Local / Custom Gateway */}
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
            <span className="font-semibold text-xs text-zinc-900 block">OpenAI-Compatible Local Endpoint or Gateway (Ollama / vLLM / OpenRouter)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">Base URL</label>
                <input
                  type="text"
                  placeholder="http://localhost:11434/v1 or https://openrouter.ai/api/v1"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">API Key (if required)</label>
                <input
                  type="password"
                  placeholder="Bearer token or leave empty for Ollama"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              Save Provider Credentials
            </button>
          </div>
        </form>
      </div>

      {/* Task-Level Model Routing Card */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Task-Level Model Routing
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select independent models and fallback paths for each discrete extraction, matching, and generation task.
          </p>
        </div>

        <div className="space-y-3">
          {tasksList.map((t) => {
            const currentRoute = routes.find(r => r.task === t.task) || {
              task: t.task,
              primaryModelId: 'google-gemini-2.5-flash',
              temperature: 0.1
            };

            return (
              <div key={t.task} className="p-3.5 bg-zinc-50/70 rounded-xl border border-zinc-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5 max-w-sm">
                  <h3 className="font-semibold text-xs text-zinc-900">{t.label}</h3>
                  <p className="text-[11px] text-zinc-500 leading-normal">{t.desc}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-zinc-500 mb-0.5">Primary Model</label>
                    <select
                      value={currentRoute.primaryModelId}
                      onChange={(e) => handleRouteModelChange(t.task, e.target.value)}
                      className="bg-white border border-zinc-300 rounded px-2.5 py-1.5 font-medium text-zinc-800 text-xs focus:outline-none"
                    >
                      {models.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.displayName} ({m.provider})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-zinc-500 mb-0.5">Fallback Model</label>
                    <select
                      value={currentRoute.fallbackModelId || ''}
                      onChange={(e) => handleRouteFallbackChange(t.task, e.target.value)}
                      className="bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-600 text-xs focus:outline-none"
                    >
                      <option value="">Deterministic Rule Fallback</option>
                      {models.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.displayName} ({m.provider})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Registry Table */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-zinc-700" />
            Configurable Model Registry ({models.length} registered models)
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Full catalog of registered models with capabilities, context capacities, and availability state.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 font-mono uppercase text-[10px] bg-zinc-50">
                <th className="py-2.5 px-3">Model Name</th>
                <th className="py-2.5 px-3">Provider</th>
                <th className="py-2.5 px-3">Context</th>
                <th className="py-2.5 px-3">Cost Category</th>
                <th className="py-2.5 px-3">Availability</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {models.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50/60">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900">
                    {m.displayName}
                    <span className="block font-mono text-[10px] text-zinc-400 font-normal">{m.modelId}</span>
                  </td>
                  <td className="py-2.5 px-3 uppercase font-mono text-[11px] text-zinc-600">{m.provider}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-600">
                    {m.contextCapacity ? `${(m.contextCapacity / 1000).toFixed(0)}k tokens` : 'Standard'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      m.costCategory === 'free' ? 'bg-emerald-100 text-emerald-800' :
                      m.costCategory === 'low' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {m.costCategory}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {m.isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-zinc-400 text-[11px]">
                        Requires Key
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      m.isEnabled ? 'bg-zinc-100 text-zinc-800' : 'bg-zinc-200 text-zinc-400'
                    }`}>
                      {m.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Task Execution Log */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-3">
        <h2 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-700" />
          Recent AI Task Activity Log ({taskLogs.length} events)
        </h2>
        {taskLogs.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">No AI tasks executed yet. Running extraction or matching will populate the audit log.</p>
        ) : (
          <div className="space-y-1.5 font-mono text-xs max-h-60 overflow-y-auto">
            {taskLogs.slice(0, 15).map(log => (
              <div key={log.id} className="p-2 bg-zinc-50 rounded border border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                    log.status === 'FALLBACK' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {log.status}
                  </span>
                  <span className="font-semibold text-zinc-800">{log.task}</span>
                  <span className="text-zinc-400">·</span>
                  <span className="text-zinc-500">{log.model}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                  <span>{log.latencyMs}ms</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
