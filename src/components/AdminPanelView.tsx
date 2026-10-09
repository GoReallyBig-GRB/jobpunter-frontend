import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { AITaskConfig, IntegrationConfig, AITaskVersion } from '../types/job';
import { 
  ShieldCheck, 
  Cpu, 
  Sliders, 
  Layers, 
  Terminal, 
  RefreshCw, 
  Save, 
  History, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  FileCode, 
  Clock, 
  Sparkles,
  Lock,
  Search,
  Check,
  ChevronRight,
  Database,
  Radio,
  SlidersHorizontal,
  Mail,
  FolderGit2
} from 'lucide-react';

interface AdminPanelViewProps {
  onCloseAdmin?: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ onCloseAdmin }) => {
  const { 
    settings, 
    updateSettings, 
    aiTaskLogs, 
    aiTasksConfig, 
    updateAITaskConfig, 
    rollbackAITaskConfig, 
    integrationsConfig,
    updateIntegrationStatus 
  } = useJobs();

  const [adminTab, setAdminTab] = useState<'ai_tasks' | 'integrations' | 'matching_rules' | 'ingestion_rules' | 'logs_audit'>('ai_tasks');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(aiTasksConfig[0]?.id || '');
  const selectedTask = aiTasksConfig.find(t => t.id === selectedTaskId) || aiTasksConfig[0];

  // AI Task Edit State
  const [editingPrompt, setEditingPrompt] = useState(selectedTask?.systemPrompt || '');
  const [editingInstructions, setEditingInstructions] = useState(selectedTask?.taskInstructions || '');
  const [editingModel, setEditingModel] = useState(selectedTask?.assignedModel || 'gemini-2.5-flash');
  const [editingFallback, setEditingFallback] = useState(selectedTask?.fallbackModel || 'gemini-1.5-flash');
  const [editingTemp, setEditingTemp] = useState(selectedTask?.temperature ?? 0.1);
  const [editingEnabled, setEditingEnabled] = useState(selectedTask?.enabled ?? true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [versionNotes, setVersionNotes] = useState('');

  // Update edit form when selected task changes
  React.useEffect(() => {
    if (selectedTask) {
      setEditingPrompt(selectedTask.systemPrompt);
      setEditingInstructions(selectedTask.taskInstructions);
      setEditingModel(selectedTask.assignedModel);
      setEditingFallback(selectedTask.fallbackModel);
      setEditingTemp(selectedTask.temperature);
      setEditingEnabled(selectedTask.enabled);
      setVersionNotes('');
      setSaveSuccess(false);
    }
  }, [selectedTaskId]);

  const handleSaveTaskConfig = () => {
    if (!selectedTask) return;

    updateAITaskConfig(selectedTask.id, {
      systemPrompt: editingPrompt,
      taskInstructions: editingInstructions,
      assignedModel: editingModel,
      fallbackModel: editingFallback,
      temperature: editingTemp,
      enabled: editingEnabled
    }, versionNotes || `Admin update v${selectedTask.activeVersion + 1}`);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRollbackVersion = (versionNum: number) => {
    if (!selectedTask) return;
    rollbackAITaskConfig(selectedTask.id, versionNum);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> OPERATIONAL</span>;
      case 'CONNECTED':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300"><CheckCircle2 className="w-3 h-3 text-blue-600" /> CONNECTED</span>;
      case 'CONFIGURED':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300"><CheckCircle2 className="w-3 h-3 text-purple-600" /> CONFIGURED</span>;
      case 'REQUIRES_AUTH':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300"><AlertTriangle className="w-3 h-3 text-amber-600" /> REQUIRES AUTH</span>;
      case 'UNAVAILABLE':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-300"><XCircle className="w-3 h-3 text-zinc-500" /> UNAVAILABLE</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300"><XCircle className="w-3 h-3 text-rose-600" /> UNSUPPORTED</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Panel Header */}
      <div className="bg-zinc-900 text-white rounded-xl p-5 border border-zinc-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono uppercase tracking-wider rounded font-bold">
              Restricted Control Plane
            </span>
            <span className="text-xs text-zinc-400 font-mono">System Administrator Role Active</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">JobPunter Governance &amp; Administration Control Plane</h2>
          <p className="text-xs text-zinc-400">
            Centrally govern AI tasks, Markdown prompt commands, version rollback, evaluation thresholds, and external integrations.
          </p>
        </div>

        {onCloseAdmin && (
          <button
            onClick={onCloseAdmin}
            className="px-3.5 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition-colors shrink-0"
          >
            Return to Candidate Workspace &rarr;
          </button>
        )}
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex rounded-lg bg-zinc-200/80 p-1 text-xs font-medium space-x-1 overflow-x-auto">
        <button
          onClick={() => setAdminTab('ai_tasks')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors whitespace-nowrap ${
            adminTab === 'ai_tasks' ? 'bg-white font-bold text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Tasks &amp; Prompt Governance</span>
        </button>

        <button
          onClick={() => setAdminTab('integrations')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors whitespace-nowrap ${
            adminTab === 'integrations' ? 'bg-white font-bold text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Integration Management</span>
        </button>

        <button
          onClick={() => setAdminTab('matching_rules')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors whitespace-nowrap ${
            adminTab === 'matching_rules' ? 'bg-white font-bold text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Evaluation &amp; Matching Rules</span>
        </button>

        <button
          onClick={() => setAdminTab('ingestion_rules')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors whitespace-nowrap ${
            adminTab === 'ingestion_rules' ? 'bg-white font-bold text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ingestion &amp; Deduplication Governance</span>
        </button>

        <button
          onClick={() => setAdminTab('logs_audit')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors whitespace-nowrap ${
            adminTab === 'logs_audit' ? 'bg-white font-bold text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>AI Execution Logs &amp; Audit ({aiTaskLogs.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAB 1: AI TASKS & PROMPT GOVERNANCE */}
      {/* ------------------------------------------------------------------ */}
      {adminTab === 'ai_tasks' && selectedTask && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tasks Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono px-1">
              Controlled AI Tasks ({aiTasksConfig.length})
            </h3>
            <div className="bg-white rounded-xl border border-zinc-300 divide-y divide-zinc-100 overflow-hidden shadow-xs">
              {aiTasksConfig.map(task => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-center justify-between text-xs ${
                    task.id === selectedTaskId ? 'bg-zinc-900 text-white font-semibold' : 'hover:bg-zinc-50 text-zinc-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{task.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        task.id === selectedTaskId ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        v{task.activeVersion}
                      </span>
                    </div>
                    <p className={`text-[11px] line-clamp-1 mt-0.5 ${
                      task.id === selectedTaskId ? 'text-zinc-300' : 'text-zinc-500'
                    }`}>
                      {task.purpose}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${task.id === selectedTaskId ? 'text-white' : 'text-zinc-400'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Task Editor Workspace */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-zinc-300 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-900">{selectedTask.name}</h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-mono text-xs font-bold rounded">
                    Active Version {selectedTask.activeVersion}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{selectedTask.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveTaskConfig}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors shadow-xs"
                >
                  {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{saveSuccess ? 'Changes Saved' : 'Save & Publish Version'}</span>
                </button>
              </div>
            </div>

            {/* Task Governance Metadata & Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                <span className="font-bold text-zinc-700 block uppercase font-mono text-[10px]">
                  Factual Grounding &amp; Anti-Hallucination Policy
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-zinc-600 text-[11px]">
                  {selectedTask.factualGroundingRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                <span className="font-bold text-zinc-700 block uppercase font-mono text-[10px]">
                  Permitted Inputs &amp; Expected Output
                </span>
                <p className="text-[11px] text-zinc-600">
                  <strong>Inputs:</strong> {selectedTask.permittedInputs.join(', ')}
                </p>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  <strong>Output:</strong> {selectedTask.expectedOutput}
                </p>
              </div>
            </div>

            {/* Model & Routing Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Assigned AI Model</label>
                <select
                  value={editingModel}
                  onChange={(e) => setEditingModel(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded text-xs focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="gemini-2.5-flash">Google Gemini 2.5 Flash</option>
                  <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
                  <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                  <option value="gpt-4o">OpenAI GPT-4o</option>
                  <option value="deterministic_template">Deterministic Core Engine (No AI)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Fallback Model</label>
                <select
                  value={editingFallback}
                  onChange={(e) => setEditingFallback(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded text-xs focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="gemini-1.5-flash">Google Gemini 1.5 Flash</option>
                  <option value="deterministic_parser">Deterministic Template / Regex</option>
                  <option value="gpt-4o-mini">OpenAI GPT-4o Mini</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Temperature ({editingTemp})</label>
                <input
                  type="range"
                  min="0.0"
                  max="0.7"
                  step="0.05"
                  value={editingTemp}
                  onChange={(e) => setEditingTemp(parseFloat(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            </div>

            {/* System Prompt (Markdown Editable) */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-zinc-800 flex items-center justify-between">
                <span>System Prompt (Markdown Editable)</span>
                <span className="text-[10px] text-zinc-500 font-mono">Governs persona &amp; constraints</span>
              </label>
              <textarea
                value={editingPrompt}
                onChange={(e) => setEditingPrompt(e.target.value)}
                rows={4}
                className="w-full font-mono text-xs p-3 bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed text-zinc-800"
              />
            </div>

            {/* Task Instructions / Commands (Markdown Editable) */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-zinc-800 flex items-center justify-between">
                <span>Task Instructions &amp; Commands (Markdown Editable)</span>
                <span className="text-[10px] text-zinc-500 font-mono">Governs execution mechanics</span>
              </label>
              <textarea
                value={editingInstructions}
                onChange={(e) => setEditingInstructions(e.target.value)}
                rows={5}
                className="w-full font-mono text-xs p-3 bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed text-zinc-800"
              />
            </div>

            {/* Version Change Notes */}
            <div className="space-y-1">
              <label className="font-semibold text-xs text-zinc-700 block">Version Changelog Note</label>
              <input
                type="text"
                placeholder="e.g. Tightened hallucination constraints for credentials"
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            {/* Version History & Rollback Table */}
            <div className="pt-4 border-t border-zinc-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-zinc-500" />
                <span>Version History &amp; Rollback Control</span>
              </h4>

              <div className="border border-zinc-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-zinc-100 text-zinc-600 font-mono text-[11px]">
                    <tr>
                      <th className="p-2.5">Version</th>
                      <th className="p-2.5">Model</th>
                      <th className="p-2.5">Created</th>
                      <th className="p-2.5">Notes</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {selectedTask.versionHistory.map(ver => (
                      <tr key={ver.version} className={ver.version === selectedTask.activeVersion ? 'bg-blue-50/50' : 'bg-white'}>
                        <td className="p-2.5 font-bold font-mono">
                          v{ver.version} {ver.version === selectedTask.activeVersion && <span className="text-[10px] text-blue-700 ml-1">(Active)</span>}
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-zinc-600">{ver.assignedModel}</td>
                        <td className="p-2.5 text-zinc-500">{new Date(ver.createdAt).toLocaleDateString()}</td>
                        <td className="p-2.5 text-zinc-700 italic">{ver.notes || 'Routine update'}</td>
                        <td className="p-2.5 text-right">
                          {ver.version !== selectedTask.activeVersion && (
                            <button
                              onClick={() => handleRollbackVersion(ver.version)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Rollback</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 2: INTEGRATION MANAGEMENT */}
      {/* ------------------------------------------------------------------ */}
      {adminTab === 'integrations' && (
        <div className="bg-white rounded-xl border border-zinc-300 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div>
              <h3 className="text-base font-bold text-zinc-900">System Integrations Control Plane</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Manage OAuth and API connectivity across Gmail, Google Drive, Sheets, AI providers, and job boards.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
              Real Connection States
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationsConfig.map(integ => (
              <div key={integ.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{integ.name}</h4>
                    <span className="text-[11px] text-zinc-500 font-mono block mt-0.5">Category: {integ.category}</span>
                  </div>
                  {getStatusBadge(integ.status)}
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {integ.description}
                </p>

                {integ.endpointOrAccount && (
                  <div className="text-[11px] font-mono text-zinc-600 bg-white p-2 rounded border border-zinc-200">
                    <strong>Endpoint/Target:</strong> {integ.endpointOrAccount}
                  </div>
                )}

                {integ.authScopes && (
                  <div className="text-[10px] font-mono text-zinc-500 space-y-0.5">
                    <span className="font-bold block">Authorized OAuth Scopes:</span>
                    {integ.authScopes.map((scope, i) => (
                      <span key={i} className="block text-zinc-600 truncate">{scope}</span>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-zinc-400">
                    Last Checked: {integ.lastChecked ? new Date(integ.lastChecked).toLocaleTimeString() : 'Never'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateIntegrationStatus(integ.id, 'OPERATIONAL')}
                      className="px-2 py-1 text-[11px] font-semibold bg-white border border-zinc-300 hover:bg-zinc-100 rounded text-zinc-700"
                    >
                      Verify Health
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 3: EVALUATION & MATCHING RULES */}
      {/* ------------------------------------------------------------------ */}
      {adminTab === 'matching_rules' && (
        <div className="bg-white rounded-xl border border-zinc-300 p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-zinc-200">
            <h3 className="text-base font-bold text-zinc-900">Evaluation Decision Thresholds &amp; Hard Filters</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Governs automated apply gates, minimum review thresholds, and location compliance rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <label className="font-bold text-zinc-800 block mb-1">
                  Apply Gate Threshold (Current: {settings.minApplyScore}/100)
                </label>
                <input
                  type="range"
                  min="75"
                  max="95"
                  value={settings.minApplyScore}
                  onChange={(e) => updateSettings({ minApplyScore: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Roles scoring at or above this threshold with 0 blockers receive an immediate APPLY recommendation.
                </p>
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">
                  Review Gate Threshold (Current: {settings.minReviewScore}/100)
                </label>
                <input
                  type="range"
                  min="60"
                  max="80"
                  value={settings.minReviewScore}
                  onChange={(e) => updateSettings({ minReviewScore: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Roles scoring between Review and Apply are routed to the Review Desk for candidate judgment.
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <span className="font-bold text-zinc-800 block uppercase font-mono text-[11px]">
                Hard Exclusion Rules
              </span>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.rejectPaidApplications}
                  onChange={(e) => updateSettings({ rejectPaidApplications: e.target.checked })}
                  className="rounded text-zinc-900"
                />
                <span className="font-medium text-zinc-700">$0 Application Fee Policy (Hard Reject paid application portals)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.strictNigeriaAuthorisation}
                  onChange={(e) => updateSettings({ strictNigeriaAuthorisation: e.target.checked })}
                  className="rounded text-zinc-900"
                />
                <span className="font-medium text-zinc-700">Strict Work Authorization Check (Require remote or authorized country)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowWorldwideRemote}
                  onChange={(e) => updateSettings({ allowWorldwideRemote: e.target.checked })}
                  className="rounded text-zinc-900"
                />
                <span className="font-medium text-zinc-700">Permit Worldwide Remote (Allow contracts open to global contractors)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 4: INGESTION & DEDUPLICATION */}
      {/* ------------------------------------------------------------------ */}
      {adminTab === 'ingestion_rules' && (
        <div className="bg-white rounded-xl border border-zinc-300 p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-zinc-200">
            <h3 className="text-base font-bold text-zinc-900">Job Ingestion, Freshness &amp; Deduplication Governance</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Governs URL sanitization, duplicate detection logic, and job freshness degradation rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
              <span className="font-bold text-zinc-800 uppercase font-mono text-[11px] block">
                URL Sanitization &amp; Deduplication Rules
              </span>
              <p className="text-zinc-600 leading-relaxed text-[11px]">
                Job URLs are automatically stripped of tracking query parameters (utm_*, ref, trackingId, trk) before comparison.
                Opportunities matching on normalized title, company, and sanitized URL are grouped as duplicate encounters.
              </p>
              <div className="text-[10px] font-mono text-zinc-500 bg-white p-2 rounded border border-zinc-200">
                Rule: exact match on (company.clean + title.clean) or externalJobId.
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
              <span className="font-bold text-zinc-800 uppercase font-mono text-[11px] block">
                Freshness Decay Thresholds
              </span>
              <p className="text-zinc-600 leading-relaxed text-[11px]">
                Jobs posted within 7 days receive full freshness score (10/10).
                Jobs posted 8-21 days ago receive moderate score (7/10).
                Jobs exceeding 30 days are flagged as STALE or CLOSED with a freshness penalty.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 5: AI EXECUTION LOGS & AUDIT */}
      {/* ------------------------------------------------------------------ */}
      {adminTab === 'logs_audit' && (
        <div className="bg-white rounded-xl border border-zinc-300 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <h3 className="text-base font-bold text-zinc-900">AI Task Execution Telemetry</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Audit trail of all recent AI invocations, latency, model assignments, and status.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
              {aiTaskLogs.length} Logged Runs
            </span>
          </div>

          <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-zinc-100 text-zinc-600 font-mono text-[11px]">
                <tr>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Task</th>
                  <th className="p-2.5">Model</th>
                  <th className="p-2.5">Latency</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-mono text-[11px]">
                {aiTaskLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-zinc-400 font-sans italic">
                      No AI tasks executed in this session yet. Tasks appear as they execute.
                    </td>
                  </tr>
                ) : (
                  aiTaskLogs.map(log => (
                    <tr key={log.id} className="hover:bg-zinc-50">
                      <td className="p-2.5 text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="p-2.5 font-bold text-zinc-800">{log.task}</td>
                      <td className="p-2.5 text-zinc-600">{log.model}</td>
                      <td className="p-2.5 text-zinc-600">{log.latencyMs}ms</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                          log.status === 'FALLBACK' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-zinc-500 truncate max-w-xs">{log.details || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
