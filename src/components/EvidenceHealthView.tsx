import React from 'react';
import { useJobs } from '../context/JobContext';
import { 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

export const EvidenceHealthView: React.FC = () => {
  const { jobs } = useJobs();

  // Aggregate missing requirements across REJECT and REVIEW jobs
  const gapMap = new Map<string, { count: number; severity: string; impact: string; exampleJobs: string[] }>();

  jobs.forEach(job => {
    if (job.decision === 'REJECT' || job.decision === 'REVIEW') {
      job.requirementEvaluations?.forEach(req => {
        if (req.status === 'MISSING' || req.status === 'DISQUALIFYING') {
          const key = req.requirement.toLowerCase().includes('lending') ? 'Consumer Lending & Credit Risk Underwriting' :
                      req.requirement.toLowerCase().includes('ehr') || req.requirement.toLowerCase().includes('hl7') ? 'Hospital EHR / FHIR Protocols' :
                      req.requirement.toLowerCase().includes('arr') || req.requirement.toLowerCase().includes('10m') ? 'Commercial Scale ($10M+ ARR / $80M P&L)' :
                      req.requirement.toLowerCase().includes('director') || req.requirement.toLowerCase().includes('15') ? 'Executive PM Management (10+ PMs)' :
                      req.requirement.toLowerCase().includes('sales') ? 'Outbound Sales / SDR Quotas' :
                      req.requirement.toLowerCase().includes('code') || req.requirement.toLowerCase().includes('production') ? 'Production Code Writing / Dual SWE' :
                      req.requirement.toLowerCase().includes('work authorization') || req.requirement.toLowerCase().includes('citizen') ? 'US/UK Foreign Work Authorization' :
                      req.requirement.slice(0, 50);

          const existing = gapMap.get(key) || { count: 0, severity: req.severity, impact: req.rationale, exampleJobs: [] };
          existing.count += 1;
          if (!existing.exampleJobs.includes(`${job.title} at ${job.company}`)) {
            existing.exampleJobs.push(`${job.title} at ${job.company}`);
          }
          gapMap.set(key, existing);
        }
      });
    }
  });

  const recurringGaps = Array.from(gapMap.entries())
    .map(([gap, data]) => ({ gap, ...data }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900 text-white rounded-lg p-6 border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Evidence Health &amp; Strategy Diagnostics</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Recurring Evidence Gaps &amp; Fit Analysis
        </h2>
        <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
          This view identifies where job market requirements repeatedly exceed documented candidate evidence across your pipeline. Rather than manufacturing a fit, use this diagnostic to stop wasting application cycles on structurally incompatible roles.
        </p>
      </div>

      {/* Grid: Win-Zone Pillars vs High-Risk Verticals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strongest Win-Zone Pillars */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
              Highest-Win Candidate Pillars
            </h3>
          </div>
          <div className="space-y-2.5 text-xs text-zinc-700">
            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded">
              <span className="font-bold text-emerald-950 block">1. B2B SaaS &amp; CRM Architecture</span>
              <span className="text-[11px] text-zinc-600 mt-0.5 block">
                Three-tier multi-tenant isolation, 16 CRM state transitions, qualification gates, and Mautic boundaries (MarketGrowthOS).
              </span>
            </div>
            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded">
              <span className="font-bold text-emerald-950 block">2. Developer Platforms &amp; API Boundaries</span>
              <span className="text-[11px] text-zinc-600 mt-0.5 block">
                API integration boundaries, webhook contradiction detection, and 1,200+ line QA verification specifications.
              </span>
            </div>
            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded">
              <span className="font-bold text-emerald-950 block">3. Managed Marketplaces &amp; Payout Infrastructure</span>
              <span className="text-[11px] text-zinc-600 mt-0.5 block">
                Five-stage project lifecycle, milestone verification, contractor registration, and Stripe Connect payout infrastructure (Zenith).
              </span>
            </div>
            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded">
              <span className="font-bold text-emerald-950 block">4. Live Communication SaaS &amp; Entitlements</span>
              <span className="text-[11px] text-zinc-600 mt-0.5 block">
                Subscription plans, account entitlement logic, and collaborative real-time video features (UrCalls).
              </span>
            </div>
          </div>
        </div>

        {/* Structural Gaps to Avoid */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <XCircle className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
              Structural Gaps to Avoid Applying For
            </h3>
          </div>
          <div className="space-y-2.5 text-xs text-zinc-700">
            <div className="p-3 bg-rose-50/50 border border-rose-200 rounded">
              <span className="font-bold text-rose-950 block">1. Banking Credit Lending &amp; Debt Delinquency</span>
              <span className="text-[11px] text-zinc-600 mt-0.5 block">
                Requires balance-sheet underwriting and default scoring. Commercial payout experience is not a substitute.
              </span>
            </div>
            <div className="p-3 bg-rose-50/50 border border-rose-200 rounded">
              <span className="font-bold text-rose-950 block">2. Hospital EHR Protocol Integrations</span>
              <span className="text-[11px] text-zinc-600 mt-0.5 block">
                Roles demanding direct institutional hospital HL7 / FHIR protocols. NexaLife covers transit workflows, not EHRs.
              </span>
            </div>
            <div className="p-3 bg-rose-50/50 border border-rose-200 rounded">
              <span className="font-bold text-rose-950 block">3. Multi-layer Director / VP Executive Leadership</span>
              <span className="text-[11px] text-zinc-600 mt-0.5 block">
                Roles requiring supervision of 10+ Product Managers or $50M+ P&amp;L governance.
              </span>
            </div>
            <div className="p-3 bg-rose-50/50 border border-rose-200 rounded">
              <span className="font-bold text-rose-950 block">4. Foreign Jurisdiction In-Office Mandates</span>
              <span className="text-[11px] text-zinc-600 mt-0.5 block">
                Roles legally requiring US Citizen Green Card or UK local residency with no international remote option.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Gaps Table */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
            Recurring Job Requirement Gaps Identified ({recurringGaps.length})
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">Based on Rejected / Reviewed Ingested Jobs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Requirement Gap</th>
                <th className="py-2.5 px-3 font-semibold">Frequency</th>
                <th className="py-2.5 px-3 font-semibold">Evidence Status</th>
                <th className="py-2.5 px-4 font-semibold">Strategic Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-700">
              {recurringGaps.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-zinc-900">
                    <div>{item.gap}</div>
                    <div className="text-[10px] font-normal text-zinc-500 mt-0.5 line-clamp-1">
                      Seen in: {item.exampleJobs.slice(0, 2).join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-zinc-800">
                    {item.count} job(s)
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-mono bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-semibold">
                      UNSUPPORTED
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 text-[11px] leading-relaxed">
                    Do not apply to roles where this is a central MUST-HAVE requirement. Preserve focus for core B2B SaaS, developer APIs, and managed marketplaces.
                  </td>
                </tr>
              ))}

              {recurringGaps.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-xs text-zinc-400 italic">
                    No recurring gaps detected yet. Ingest more jobs to build gap trends.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
