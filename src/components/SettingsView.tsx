import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Sliders, RotateCcw, Trash2, Download, CheckCircle2, AlertCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDemoData,
    clearAllData,
    exportCSV,
    exportJSON
  } = useJobs();

  const [targetLocation, setTargetLocation] = useState(settings.targetLocation);
  const [rejectPaid, setRejectPaid] = useState(settings.rejectPaidApplications);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateSettings({
      targetLocation: targetLocation.trim(),
      rejectPaidApplications: rejectPaid
    });
    setSavedMessage(true);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-zinc-900">
          <Sliders className="h-4 w-4 text-zinc-700" />
          Candidate Preferences
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Preferences guide opportunity filtering. They do not change your factual career evidence.
        </p>
      </section>

      <form onSubmit={handleSave} className="space-y-6 text-sm">
        <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6">
          <div>
            <label htmlFor="target-location" className="mb-1 block font-semibold text-zinc-900">
              Preferred location
            </label>
            <input
              id="target-location"
              value={targetLocation}
              onChange={(event) => setTargetLocation(event.target.value)}
              placeholder="e.g. Remote, Nigeria"
              className="w-full rounded border border-zinc-300 bg-white p-2 text-sm"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Use this as a search preference, not as proof of work authorization or employer eligibility.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={rejectPaid}
              onChange={(event) => setRejectPaid(event.target.checked)}
              className="mt-0.5 rounded text-zinc-900"
            />
            <span>
              <span className="block font-semibold text-zinc-900">Exclude paid application routes</span>
              <span className="mt-1 block text-xs text-zinc-500">
                Prefer opportunities with a free, usable application route. A route must still be checked before it is described as free.
              </span>
            </span>
          </label>

          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            {savedMessage && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Preferences saved in this browser.
              </span>
            )}
            <button
              type="submit"
              className="ml-auto rounded bg-zinc-900 px-5 py-2 font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              Save Preferences
            </button>
          </div>
        </section>
      </form>

      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          These preferences and the prototype data below are still browser-local. They are not yet backed by the PostgreSQL API and will not automatically follow you to another device. Server persistence must be completed before this is treated as production-ready.
        </p>
      </div>

      {/* Data Management & Demo Reset */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4 text-xs shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
          Prototype Data Management
        </h3>
        <p className="text-zinc-500">
          Export the current browser-held prototype state or reset it. This is not a server backup.
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
