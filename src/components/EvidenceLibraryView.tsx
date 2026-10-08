import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  FileText, 
  ShieldCheck, 
  Layers, 
  AlertCircle, 
  Copy, 
  CheckCircle2, 
  Check, 
  Terminal,
  Upload,
  Edit3,
  Sliders,
  Plus,
  Compass,
  UserCheck,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { MasterProfile, JobPreferences } from '../types/job';

export const EvidenceLibraryView: React.FC = () => {
  const { 
    masterProfile, 
    preferences, 
    activePresetId,
    candidatePresets,
    switchCandidatePreset,
    updateMasterProfile, 
    importProfileDocument, 
    updatePreferences,
    reEvaluateAllJobs
  } = useJobs();

  const [activeTab, setActiveTab] = useState<'evidence' | 'preferences' | 'import'>('evidence');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    masterProfile.structuredData?.projectsOrProducts?.[0]?.id || ''
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Edit Master Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(masterProfile.candidateName);
  const [editProfession, setEditProfession] = useState(masterProfile.primaryProfession);
  const [editPositioning, setEditPositioning] = useState(masterProfile.corePositioning);
  const [editWorkingMethod, setEditWorkingMethod] = useState(masterProfile.workingMethod);
  const [editLocation, setEditLocation] = useState(masterProfile.location);
  const [editWorkAuth, setEditWorkAuth] = useState(masterProfile.workAuthorisation);

  // Document Import state
  const [importFileName, setImportFileName] = useState('');
  const [importRawText, setImportRawText] = useState('');
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // Edit Preferences state
  const [newTargetRole, setNewTargetRole] = useState('');
  const [newExcludedIndustry, setNewExcludedIndustry] = useState('');
  const [newExcludedJobType, setNewExcludedJobType] = useState('');
  const [newPreferTerm, setNewPreferTerm] = useState('');
  const [newAvoidTerm, setNewAvoidTerm] = useState('');

  const projects = masterProfile.structuredData?.projectsOrProducts || [];
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveProfileHeader = (e: React.FormEvent) => {
    e.preventDefault();
    updateMasterProfile({
      candidateName: editName,
      primaryProfession: editProfession,
      corePositioning: editPositioning,
      workingMethod: editWorkingMethod,
      location: editLocation,
      workAuthorisation: editWorkAuth
    });
    setIsEditingProfile(false);
  };

  const handleImportDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importRawText.trim()) return;

    setIsParsingDoc(true);
    try {
      await importProfileDocument(
        importFileName || 'Imported_Candidate_Profile.txt',
        'text',
        importRawText
      );
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        setActiveTab('evidence');
      }, 1500);
    } finally {
      setIsParsingDoc(false);
    }
  };

  const handleAddTargetRole = () => {
    if (!newTargetRole.trim()) return;
    const updated = Array.from(new Set([...preferences.targetRoles, newTargetRole.trim()]));
    updatePreferences({ targetRoles: updated });
    setNewTargetRole('');
  };

  const handleRemoveTargetRole = (role: string) => {
    updatePreferences({ targetRoles: preferences.targetRoles.filter(r => r !== role) });
  };

  const handleAddExcludedIndustry = () => {
    if (!newExcludedIndustry.trim()) return;
    const updated = Array.from(new Set([...preferences.excludedIndustries, newExcludedIndustry.trim()]));
    updatePreferences({ excludedIndustries: updated });
    setNewExcludedIndustry('');
  };

  const handleRemoveExcludedIndustry = (ind: string) => {
    updatePreferences({ excludedIndustries: preferences.excludedIndustries.filter(i => i !== ind) });
  };

  const handleAddExcludedJobType = () => {
    if (!newExcludedJobType.trim()) return;
    const updated = Array.from(new Set([...preferences.excludedJobTypes, newExcludedJobType.trim()]));
    updatePreferences({ excludedJobTypes: updated });
    setNewExcludedJobType('');
  };

  const handleRemoveExcludedJobType = (t: string) => {
    updatePreferences({ excludedJobTypes: preferences.excludedJobTypes.filter(x => x !== t) });
  };

  const handleAddPreferTerm = () => {
    if (!newPreferTerm.trim()) return;
    const current = preferences.terminologyPreferences?.prefer || [];
    updatePreferences({
      terminologyPreferences: {
        prefer: Array.from(new Set([...current, newPreferTerm.trim()])),
        avoid: preferences.terminologyPreferences?.avoid || []
      }
    });
    setNewPreferTerm('');
  };

  const handleRemovePreferTerm = (term: string) => {
    const current = preferences.terminologyPreferences?.prefer || [];
    updatePreferences({
      terminologyPreferences: {
        prefer: current.filter(t => t !== term),
        avoid: preferences.terminologyPreferences?.avoid || []
      }
    });
  };

  const handleAddAvoidTerm = () => {
    if (!newAvoidTerm.trim()) return;
    const current = preferences.terminologyPreferences?.avoid || [];
    updatePreferences({
      terminologyPreferences: {
        prefer: preferences.terminologyPreferences?.prefer || [],
        avoid: Array.from(new Set([...current, newAvoidTerm.trim()]))
      }
    });
    setNewAvoidTerm('');
  };

  const handleRemoveAvoidTerm = (term: string) => {
    const current = preferences.terminologyPreferences?.avoid || [];
    updatePreferences({
      terminologyPreferences: {
        prefer: preferences.terminologyPreferences?.prefer || [],
        avoid: current.filter(t => t !== term)
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Candidate Preset Switcher Bar */}
      <div className="bg-white rounded-lg p-3.5 border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider">
            Active Candidate Profile:
          </span>
          <span className="text-xs text-zinc-600 font-medium">
            Select or replace candidate to verify true agnostic architecture:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {candidatePresets.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => switchCandidatePreset(preset.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs ring-1 ring-zinc-900'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
          {activePresetId === 'custom' && (
            <span className="px-3 py-1.5 text-xs font-semibold rounded bg-purple-100 text-purple-900 border border-purple-200">
              Custom Uploaded Candidate
            </span>
          )}
        </div>
      </div>

      {/* Top Banner: Master Job Profile Header */}
      <div className="bg-zinc-900 text-white rounded-lg p-6 border border-zinc-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
                Factual Master Job Profile (Source of Truth)
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs text-zinc-400 font-mono">
                {masterProfile.candidateName} — {masterProfile.primaryProfession}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1">
              {masterProfile.corePositioning}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setEditName(masterProfile.candidateName);
                setEditProfession(masterProfile.primaryProfession);
                setEditPositioning(masterProfile.corePositioning);
                setEditWorkingMethod(masterProfile.workingMethod);
                setEditLocation(masterProfile.location);
                setEditWorkAuth(masterProfile.workAuthorisation);
                setIsEditingProfile(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded hover:bg-zinc-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>

        {/* Working Method Steps */}
        <div>
          <span className="text-xs uppercase font-mono text-zinc-400 block mb-1.5">
            Structured Working Method:
          </span>
          <div className="text-xs font-mono bg-zinc-950 p-3 rounded-md text-emerald-300 border border-zinc-800 overflow-x-auto whitespace-pre-wrap">
            {masterProfile.workingMethod}
          </div>
        </div>

        {/* Location & Authorization metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-zinc-800/80 p-2.5 rounded border border-zinc-700">
            <strong className="text-zinc-400">Documented Location:</strong>{' '}
            <span className="text-zinc-200">{masterProfile.location}</span>
          </div>
          <div className="bg-zinc-800/80 p-2.5 rounded border border-zinc-700">
            <strong className="text-zinc-400">Work Authorization:</strong>{' '}
            <span className="text-zinc-200">{masterProfile.workAuthorisation}</span>
          </div>
        </div>

        {/* Strict Boundaries */}
        {masterProfile.structuredData?.strictBoundaries?.length > 0 && (
          <div className="bg-zinc-800/60 p-3.5 rounded-md border border-zinc-700/80">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Mandatory Integrity Guardrails (Never Hallucinate / Manipulate)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px] text-zinc-300">
              {masterProfile.structuredData.strictBoundaries.map((b, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-400 shrink-0 font-bold">&times;</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'evidence'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Layers className="w-4 h-4 text-zinc-700" />
            <span>Structured Evidence Hierarchy</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'preferences'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Editorial Preferences &amp; Boundaries</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'import'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Upload className="w-4 h-4 text-purple-600" />
            <span>Import Profile / Resume (AI Parse)</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: STRUCTURED EVIDENCE HIERARCHY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          {/* Projects / Platforms */}
          {projects.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-700" />
                  <span>Documented Projects &amp; Products ({projects.length})</span>
                </h3>
                <span className="text-xs text-zinc-500 font-mono">100% Verifiable</span>
              </div>

              {/* Selector Tabs */}
              <div className="flex flex-wrap gap-2">
                {projects.map(p => {
                  const isSelected = p.id === selectedProjectId || (!selectedProjectId && p === currentProject);
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className={`px-3 py-2 text-xs font-medium rounded-md transition-all text-left border ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="font-bold">{p.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {p.role}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Project Detail Card */}
              {currentProject && (
                <div className="bg-white rounded-lg border border-zinc-200 p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                    <div>
                      <h4 className="text-base font-bold text-zinc-900">{currentProject.name}</h4>
                      <p className="text-xs text-zinc-500">{currentProject.headline || currentProject.context}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded">
                        Role: {currentProject.role}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider font-mono mb-1.5">
                      Factual Bullets &amp; Scope:
                    </h5>
                    <ul className="text-xs text-zinc-700 space-y-1.5">
                      {currentProject.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-zinc-400 mt-0.5">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider font-mono mb-1.5">
                      Documented Capabilities:
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProject.capabilities.map((c, i) => (
                        <span key={i} className="text-xs font-mono bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Employment History */}
          {masterProfile.structuredData?.employmentHistory?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-mono flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-zinc-700" />
                <span>Documented Employment Records</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {masterProfile.structuredData.employmentHistory.map((emp, i) => (
                  <div key={i} className="bg-white rounded-lg border border-zinc-200 p-4 space-y-2.5 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900">{emp.role}</h4>
                        <div className="text-xs text-zinc-600 font-mono">{emp.organization} · {emp.period}</div>
                      </div>
                    </div>

                    <ul className="text-xs text-zinc-700 space-y-1">
                      {emp.responsibilities.slice(0, 4).map((r, ri) => (
                        <li key={ri} className="flex items-start gap-1.5">
                          <span className="text-zinc-400">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>

                    {emp.achievements?.length > 0 && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100 font-mono">
                        <strong>Verified Outcome:</strong> {emp.achievements[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills & Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-zinc-200 p-4 space-y-2">
              <h4 className="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider">
                Documented Skills &amp; Competencies
              </h4>
              <div className="space-y-2">
                {masterProfile.structuredData?.skills?.map((cat, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-semibold text-zinc-700 block mb-1">{cat.category}:</span>
                    <div className="flex flex-wrap gap-1">
                      {cat.items.map((item, ii) => (
                        <span key={ii} className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded text-[11px] font-mono">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-zinc-200 p-4 space-y-2">
              <h4 className="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider">
                Tools, Platforms &amp; Credentials
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-semibold text-zinc-700 block mb-1">Tools &amp; Software:</span>
                  <div className="flex flex-wrap gap-1">
                    {masterProfile.structuredData?.tools?.map((tool, idx) => (
                      <span key={idx} className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded text-[11px] font-mono">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {masterProfile.structuredData?.certifications?.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-700 block mb-1">Verified Certifications:</span>
                    <ul className="text-xs text-zinc-700 space-y-0.5">
                      {masterProfile.structuredData.certifications.map((cert, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 font-mono text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{cert.name} {cert.issuer ? `(${cert.issuer})` : ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: EDITORIAL PREFERENCES & BOUNDARIES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Candidate Editorial Control &amp; Preferences</h3>
              <p className="text-xs text-zinc-500">
                You are the editor of your career. Define target roles, industries, exclusions, and terminology rules. AI cannot override these constraints.
              </p>
            </div>
            <button
              onClick={() => reEvaluateAllJobs()}
              className="px-3 py-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white rounded transition-colors shrink-0"
            >
              Re-Evaluate Jobs with Current Rules
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Roles */}
            <div className="bg-white p-5 rounded-lg border border-zinc-200 space-y-3">
              <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
                Target Roles ({preferences.targetRoles.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {preferences.targetRoles.map((role, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded text-xs border border-emerald-200">
                    <span>{role}</span>
                    <button onClick={() => handleRemoveTargetRole(role)} className="text-emerald-700 hover:text-emerald-950 font-bold">×</button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add target role..."
                  value={newTargetRole}
                  onChange={(e) => setNewTargetRole(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTargetRole()}
                  className="flex-1 p-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
                <button
                  onClick={handleAddTargetRole}
                  className="px-3 py-2 text-xs font-semibold bg-zinc-900 text-white rounded"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Excluded Industries */}
            <div className="bg-white p-5 rounded-lg border border-zinc-200 space-y-3">
              <h4 className="text-xs font-bold text-rose-900 uppercase font-mono tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                Explicitly Excluded Industries (Hard No-Go)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {preferences.excludedIndustries.map((ind, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-rose-50 text-rose-900 px-2.5 py-1 rounded text-xs border border-rose-200">
                    <span>{ind}</span>
                    <button onClick={() => handleRemoveExcludedIndustry(ind)} className="text-rose-700 hover:text-rose-950 font-bold">×</button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="e.g. Gambling, Outbound Sales..."
                  value={newExcludedIndustry}
                  onChange={(e) => setNewExcludedIndustry(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddExcludedIndustry()}
                  className="flex-1 p-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
                <button
                  onClick={handleAddExcludedIndustry}
                  className="px-3 py-2 text-xs font-semibold bg-zinc-900 text-white rounded"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Excluded Job Types */}
            <div className="bg-white p-5 rounded-lg border border-zinc-200 space-y-3">
              <h4 className="text-xs font-bold text-amber-900 uppercase font-mono tracking-wider flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Excluded Job Types (Blockers)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {preferences.excludedJobTypes.map((type, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded text-xs border border-amber-200">
                    <span>{type}</span>
                    <button onClick={() => handleRemoveExcludedJobType(type)} className="text-amber-700 hover:text-amber-950 font-bold">×</button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="e.g. Commission-Only, Outbound SDR..."
                  value={newExcludedJobType}
                  onChange={(e) => setNewExcludedJobType(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddExcludedJobType()}
                  className="flex-1 p-2 text-xs bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
                <button
                  onClick={handleAddExcludedJobType}
                  className="px-3 py-2 text-xs font-semibold bg-zinc-900 text-white rounded"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Transferability & Remote Policy */}
            <div className="bg-white p-5 rounded-lg border border-zinc-200 space-y-4">
              <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
                Work Arrangement &amp; Transferability
              </h4>
              <div>
                <label className="text-xs text-zinc-600 block mb-1">Transferability Policy:</label>
                <select
                  value={preferences.transferabilityPolicy || 'BALANCED'}
                  onChange={(e) => updatePreferences({ transferabilityPolicy: e.target.value as any })}
                  className="w-full p-2 text-xs bg-zinc-50 border border-zinc-300 rounded"
                >
                  <option value="CONSERVATIVE">Conservative (Strict Direct Evidence Only)</option>
                  <option value="BALANCED">Balanced (Permit Rigorously Grounded Transferable Evidence)</option>
                  <option value="AGGRESSIVE">Aggressive (Broad Transferable Fit)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-600 block mb-1">Remote Preference:</label>
                <select
                  value={preferences.remotePreference}
                  onChange={(e) => updatePreferences({ remotePreference: e.target.value as any })}
                  className="w-full p-2 text-xs bg-zinc-50 border border-zinc-300 rounded"
                >
                  <option value="REMOTE_ONLY">Remote Only ($0 Commute)</option>
                  <option value="REMOTE_OK">Remote Friendly</option>
                  <option value="HYBRID_OK">Hybrid OK</option>
                  <option value="ONSITE_OK">On-Site / Clinical Hospital OK</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: IMPORT PROFILE DOCUMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-xs max-w-2xl mx-auto space-y-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-purple-600" />
              Import Any Candidate Profile or Resume (Candidate-Agnostic)
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Paste full resume, LinkedIn summary, or professional biography. The AI / deterministic parser extracts structured employment history, competencies, and strict boundaries without human lock-in.
            </p>
          </div>

          <form onSubmit={handleImportDocument} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Source Document Label / File Name</label>
              <input
                type="text"
                placeholder="e.g. Jane_Doe_Resume_2026.txt"
                value={importFileName}
                onChange={(e) => setImportFileName(e.target.value)}
                className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Raw Profile Text *</label>
              <textarea
                rows={12}
                required
                placeholder="Paste the candidate's complete experience, roles, achievements, tools, and background here..."
                value={importRawText}
                onChange={(e) => setImportRawText(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
              />
            </div>

            {importSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile parsed successfully! Updating candidate state...</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setImportRawText('')}
                className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isParsingDoc}
                className="px-5 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded disabled:opacity-50"
              >
                {isParsingDoc ? 'Parsing Profile...' : 'Parse & Activate Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h3 className="text-sm font-bold text-zinc-900">Edit Master Profile Header</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>

            <form onSubmit={handleSaveProfileHeader} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Primary Profession</label>
                <input
                  type="text"
                  required
                  value={editProfession}
                  onChange={(e) => setEditProfession(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Core Positioning Value Proposition</label>
                <textarea
                  rows={2}
                  value={editPositioning}
                  onChange={(e) => setEditPositioning(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Working Method</label>
                <textarea
                  rows={2}
                  value={editWorkingMethod}
                  onChange={(e) => setEditWorkingMethod(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Work Authorisation</label>
                  <input
                    type="text"
                    value={editWorkAuth}
                    onChange={(e) => setEditWorkAuth(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
