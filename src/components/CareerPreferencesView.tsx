import React, { useEffect, useState } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  Sliders, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Save, 
  Plus, 
  X, 
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  Globe
} from 'lucide-react';

export const CareerPreferencesView: React.FC = () => {
  const { preferences, savePreferences, preferencesRevision, preferencesStatus, preferencesError, hasSavedPreferences, reEvaluateAllJobs } = useJobs();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preference fields
  const [remotePref, setRemotePref] = useState(preferences.remotePreference);
  const [salaryExpectation, setSalaryExpectation] = useState(preferences.salaryExpectation || '');
  const [willingToRelocate, setWillingToRelocate] = useState(preferences.willingToRelocate);
  const [maxFee, setMaxFee] = useState(preferences.maxApplicationFee ?? 0);
  const [notes, setNotes] = useState(preferences.notes || '');

  // Tag inputs
  const [targetRoles, setTargetRoles] = useState<string[]>(preferences.targetRoles || []);
  const [newRole, setNewRole] = useState('');

  const [targetSeniority, setTargetSeniority] = useState<string[]>(preferences.targetSeniority || []);
  const [newSeniority, setNewSeniority] = useState('');

  const [preferredIndustries, setPreferredIndustries] = useState<string[]>(preferences.preferredIndustries || []);
  const [newPrefInd, setNewPrefInd] = useState('');

  const [excludedIndustries, setExcludedIndustries] = useState<string[]>(preferences.excludedIndustries || []);
  const [newExInd, setNewExInd] = useState('');

  const [excludedJobTypes, setExcludedJobTypes] = useState<string[]>(preferences.excludedJobTypes || []);
  const [newExJob, setNewExJob] = useState('');

  const [preferredLocations, setPreferredLocations] = useState<string[]>(preferences.preferredLocations || []);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    setRemotePref(preferences.remotePreference);
    setSalaryExpectation(preferences.salaryExpectation || '');
    setWillingToRelocate(preferences.willingToRelocate ?? false);
    setMaxFee(preferences.maxApplicationFee ?? 0);
    setNotes(preferences.notes || '');
    setTargetRoles(preferences.targetRoles || []);
    setTargetSeniority(preferences.targetSeniority || []);
    setPreferredIndustries(preferences.preferredIndustries || []);
    setExcludedIndustries(preferences.excludedIndustries || []);
    setExcludedJobTypes(preferences.excludedJobTypes || []);
    setPreferredLocations(preferences.preferredLocations || []);
  }, [preferences]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);
    const nextPreferences = {
      ...preferences,
      remotePreference: remotePref,
      salaryExpectation,
      willingToRelocate,
      maxApplicationFee: maxFee,
      notes,
      targetRoles,
      targetSeniority,
      preferredIndustries,
      excludedIndustries,
      excludedJobTypes,
      preferredLocations
    };
    const saved = await savePreferences(nextPreferences);
    if (saved) {
      reEvaluateAllJobs();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const addTag = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string, clear: () => void) => {
    if (!val.trim()) return;
    if (!list.includes(val.trim())) {
      setList([...list, val.trim()]);
    }
    clear();
  };

  const removeTag = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Candidate Sovereignty
              </span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs text-zinc-500 font-mono">Explicit Search Constraints &amp; Rules</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Career Preferences &amp; Hard Exclusions</h1>
            <p className="text-xs text-zinc-600 max-w-2xl leading-relaxed">
              Rules decide, not unexamined assumptions. Exclusions specified here actively drive the decision engine (e.g. commission-only roles, unpermitted locations, or unwanted industries).
            </p>
          </div>

          {preferencesStatus === 'loading' && <p role="status" className="text-xs text-blue-700">Loading your preferences from the server…</p>}
          {preferencesStatus === 'saving' && <p role="status" className="text-xs text-blue-700">Saving preferences to the server…</p>}
          {preferencesStatus === 'signed_out' && <p role="alert" className="text-xs text-amber-800">Sign in to load and save account preferences. Changes cannot be saved while signed out.</p>}
          {preferencesStatus === 'error' && <p role="alert" className="text-xs text-rose-700">{preferencesError || 'Preferences could not be loaded or saved.'}</p>}
          {preferencesStatus === 'conflict' && <p role="alert" className="text-xs text-rose-700">Revision conflict: {preferencesError || 'The server has newer preferences. Review the reloaded values before saving again.'}</p>}
          {preferencesStatus === 'ready' && preferencesRevision === 0 && <p role="status" className="text-xs text-amber-800">These are backend defaults (revision 0), not a previously saved configuration. Save to create your first saved version.</p>}
          {preferencesStatus === 'ready' && hasSavedPreferences && <p className="text-xs text-zinc-500">Loaded saved server preferences · revision {preferencesRevision}</p>}
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Preferences Saved &amp; Pipeline Re-evaluated
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Target Roles & Seniority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3 shadow-2xs">
            <h3 className="font-bold text-zinc-900 text-xs uppercase font-mono tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-zinc-700" />
              Target Roles / Titles
            </h3>
            <div className="flex flex-wrap gap-1.5 min-h-12 p-2 bg-zinc-50 rounded-lg border border-zinc-200">
              {targetRoles.map((r, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-white text-zinc-800 px-2 py-1 rounded border border-zinc-300">
                  {r}
                  <button type="button" onClick={() => removeTag(targetRoles, setTargetRoles, i)} className="text-zinc-400 hover:text-zinc-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add target role (e.g. Staff Nurse, Product Owner)"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="flex-1 bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800"
              />
              <button
                type="button"
                onClick={() => addTag(targetRoles, setTargetRoles, newRole, () => setNewRole(''))}
                className="px-3 py-1.5 bg-zinc-900 text-white rounded text-xs font-semibold hover:bg-zinc-800"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3 shadow-2xs">
            <h3 className="font-bold text-zinc-900 text-xs uppercase font-mono tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-zinc-700" />
              Target Seniority Scope
            </h3>
            <div className="flex flex-wrap gap-1.5 min-h-12 p-2 bg-zinc-50 rounded-lg border border-zinc-200">
              {targetSeniority.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-white text-zinc-800 px-2 py-1 rounded border border-zinc-300">
                  {s}
                  <button type="button" onClick={() => removeTag(targetSeniority, setTargetSeniority, i)} className="text-zinc-400 hover:text-zinc-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add seniority (e.g. Senior, Lead, Mid-Level)"
                value={newSeniority}
                onChange={(e) => setNewSeniority(e.target.value)}
                className="flex-1 bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800"
              />
              <button
                type="button"
                onClick={() => addTag(targetSeniority, setTargetSeniority, newSeniority, () => setNewSeniority(''))}
                className="px-3 py-1.5 bg-zinc-900 text-white rounded text-xs font-semibold hover:bg-zinc-800"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Location & Remote Flexibility */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4 shadow-2xs">
          <h3 className="font-bold text-zinc-900 text-xs uppercase font-mono tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-zinc-700" />
            Location &amp; Remote Work Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Work Arrangement</label>
              <select
                value={remotePref}
                onChange={(e) => setRemotePref(e.target.value as any)}
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 font-medium text-zinc-800"
              >
                <option value="REMOTE_ONLY">Remote Only (Strict)</option>
                <option value="REMOTE_PREFERRED">Remote Preferred</option>
                <option value="REMOTE_OK">Remote OK</option>
                <option value="HYBRID_OK">Hybrid OK</option>
                <option value="FLEXIBLE">Flexible</option>
                <option value="ONSITE_OK">Onsite OK</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Compensation Expectation</label>
              <input
                type="text"
                placeholder="e.g. $80,000 - $110,000"
                value={salaryExpectation}
                onChange={(e) => setSalaryExpectation(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Max Application Fee Policy</label>
              <div className="flex items-center gap-2 pt-1">
                <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                  ${maxFee}
                </span>
                <span className="text-[11px] text-zinc-500">($0 strict anti-scam policy)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hard Exclusions: Excluded Job Types & Industries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-rose-200 p-5 space-y-3 shadow-2xs bg-rose-50/20">
            <h3 className="font-bold text-rose-900 text-xs uppercase font-mono tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Explicitly Excluded Job Types
            </h3>
            <p className="text-[11px] text-rose-800">
              Any position matching these job types will trigger an automatic Hard NO-GO rejection.
            </p>
            <div className="flex flex-wrap gap-1.5 min-h-12 p-2 bg-white rounded-lg border border-rose-200">
              {excludedJobTypes.map((ex, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-medium">
                  {ex}
                  <button type="button" onClick={() => removeTag(excludedJobTypes, setExcludedJobTypes, i)} className="text-rose-500 hover:text-rose-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Commission-Only, Outbound Cold Calling SDR"
                value={newExJob}
                onChange={(e) => setNewExJob(e.target.value)}
                className="flex-1 bg-white border border-rose-300 rounded px-2.5 py-1.5 text-xs text-zinc-800"
              />
              <button
                type="button"
                onClick={() => addTag(excludedJobTypes, setExcludedJobTypes, newExJob, () => setNewExJob(''))}
                className="px-3 py-1.5 bg-rose-700 text-white rounded text-xs font-semibold hover:bg-rose-800"
              >
                Exclude
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-rose-200 p-5 space-y-3 shadow-2xs bg-rose-50/20">
            <h3 className="font-bold text-rose-900 text-xs uppercase font-mono tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Explicitly Excluded Industries
            </h3>
            <p className="text-[11px] text-rose-800">
              Industries or sectors you refuse to work in or are prohibited from pursuing.
            </p>
            <div className="flex flex-wrap gap-1.5 min-h-12 p-2 bg-white rounded-lg border border-rose-200">
              {excludedIndustries.map((ex, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-medium">
                  {ex}
                  <button type="button" onClick={() => removeTag(excludedIndustries, setExcludedIndustries, i)} className="text-rose-500 hover:text-rose-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Gambling, Crypto Speculation"
                value={newExInd}
                onChange={(e) => setNewExInd(e.target.value)}
                className="flex-1 bg-white border border-rose-300 rounded px-2.5 py-1.5 text-xs text-zinc-800"
              />
              <button
                type="button"
                onClick={() => addTag(excludedIndustries, setExcludedIndustries, newExInd, () => setNewExInd(''))}
                className="px-3 py-1.5 bg-rose-700 text-white rounded text-xs font-semibold hover:bg-rose-800"
              >
                Exclude
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Constraints & Notes */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-2 shadow-2xs">
          <label className="block text-xs font-bold text-zinc-900 uppercase font-mono">
            Candidate Directives &amp; Verification Rules
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional specific rules (e.g. Strict $0 policy, verify sponsorship requirement before applying, etc.)"
            className="w-full bg-zinc-50 border border-zinc-300 rounded p-2.5 text-xs text-zinc-800"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={preferencesStatus === 'loading' || preferencesStatus === 'saving' || preferencesStatus === 'signed_out' || preferencesRevision === null}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            Save Preferences to Server &amp; Re-Evaluate Opportunities
          </button>
        </div>
      </form>
    </div>
  );
};
