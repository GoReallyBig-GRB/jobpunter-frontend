import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

/**
 * End-user informational view only.
 * Provider credentials, model selection, task routing, and fallback are system-managed.
 * Operational controls belong behind a separately authenticated administrator boundary.
 */
export const AIProvidersView: React.FC = () => (
  <div className="space-y-6 text-sm">
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">JobPunter AI</h1>
          <p className="text-xs text-zinc-500">AI is provided and configured by JobPunter.</p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
        <div className="space-y-1">
          <h2 className="font-semibold text-emerald-950">No AI setup required</h2>
          <p className="leading-relaxed text-emerald-900">
            Use JobPunter's available AI features directly. You do not need to provide API keys,
            choose an AI provider or model, or configure task routing. JobPunter manages those
            settings centrally.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default AIProvidersView;
