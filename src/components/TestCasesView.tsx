import React, { useState } from 'react';
import { useJobs, TestResultReport } from '../context/JobContext';
import { TEST_SUITE_DEFINITIONS } from '../data/demoData';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  ShieldCheck, 
  Layers, 
  AlertTriangle,
  RotateCcw,
  Clock,
  Eye
} from 'lucide-react';

interface TestCasesViewProps {
  onOpenJobDetail: (id: string) => void;
}

export const TestCasesView: React.FC<TestCasesViewProps> = ({ onOpenJobDetail }) => {
  const { runTestSuiteDiagnostics, jobs } = useJobs();
  const [testResults, setTestResults] = useState<TestResultReport[]>(() => runTestSuiteDiagnostics());
  const [filter, setFilter] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');

  const handleRunTests = () => {
    const results = runTestSuiteDiagnostics();
    setTestResults(results);
  };

  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.passed).length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const filteredResults = testResults.filter(r => {
    if (filter === 'PASSED') return r.passed;
    if (filter === 'FAILED') return !r.passed;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900 text-white rounded-lg p-6 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Section 25 Automated Diagnostic Test Suite</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              18 Verification Test Cases &amp; Gate Diagnostics
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Verifies precision-over-volume decision gates, requirement-level evidence matching, Apply Gate rules, seniority boundary checks, and paywall rejections across all 18 specified scenarios.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRunTests}
              className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run 18 Diagnostics</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Status Bar */}
        <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400">Total Scenarios: <strong>{totalTests}</strong></span>
            <span className="text-zinc-600">·</span>
            <span className="text-emerald-400">Passing: <strong>{passedTests}</strong></span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">Pass Rate: <strong className="text-emerald-300">{passRate}%</strong></span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-md text-[11px]">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2 py-0.5 rounded transition-colors ${filter === 'ALL' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              All ({totalTests})
            </button>
            <button
              onClick={() => setFilter('PASSED')}
              className={`px-2 py-0.5 rounded transition-colors ${filter === 'PASSED' ? 'bg-zinc-700 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Passed ({passedTests})
            </button>
            <button
              onClick={() => setFilter('FAILED')}
              className={`px-2 py-0.5 rounded transition-colors ${filter === 'FAILED' ? 'bg-zinc-700 text-rose-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Failed ({totalTests - passedTests})
            </button>
          </div>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Test #</th>
                <th className="py-2.5 px-4 font-semibold">Scenario &amp; Context</th>
                <th className="py-2.5 px-3 font-semibold">Expected</th>
                <th className="py-2.5 px-3 font-semibold">Actual Decision</th>
                <th className="py-2.5 px-3 font-semibold">Scores (Core / Dom / Tot)</th>
                <th className="py-2.5 px-3 font-semibold">Gate / Diagnostic Reason</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-700">
              {filteredResults.map((result) => {
                const def = TEST_SUITE_DEFINITIONS.find(d => d.testNumber === result.testNumber);
                const matchingJob = jobs.find(j => j.title === def?.input.title && j.company === def?.input.company);

                return (
                  <tr key={result.testNumber} className="hover:bg-zinc-50/80 transition-colors">
                    {/* Test Number */}
                    <td className="py-3 px-3 font-mono font-bold text-zinc-500">
                      #{result.testNumber}
                    </td>

                    {/* Scenario */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-900">{result.name}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {def?.scenarioDescription}
                      </div>
                      {matchingJob && (
                        <button
                          onClick={() => onOpenJobDetail(matchingJob.id)}
                          className="mt-1 text-[10px] text-blue-700 hover:underline flex items-center gap-1 font-mono"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect Full Evaluation</span>
                        </button>
                      )}
                    </td>

                    {/* Expected Decision */}
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-zinc-800 text-[11px]">
                        {result.expectedDecision}
                      </span>
                    </td>

                    {/* Actual Decision */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                        result.actualDecision === 'APPLY' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                        result.actualDecision === 'REVIEW' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                        result.actualDecision === 'WATCH' ? 'bg-blue-50 text-blue-900 border-blue-300' :
                        'bg-zinc-100 text-zinc-700 border-zinc-300'
                      }`}>
                        {result.actualDecision}
                      </span>
                    </td>

                    {/* Scores */}
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <div className="text-zinc-900 font-semibold">{result.score}/100</div>
                      <div className="text-[10px] text-zinc-400">
                        PM:{result.corePMScore} | Dom:{result.domainScore}
                      </div>
                    </td>

                    {/* Reason / Failed Gate */}
                    <td className="py-3 px-3 text-[11px] text-zinc-600 max-w-xs">
                      {result.failedGateRule && (
                        <div className="text-amber-800 font-semibold text-[10px] mb-0.5">
                          {result.failedGateRule}
                        </div>
                      )}
                      <div className="line-clamp-2 leading-tight">
                        {result.decisiveReason}
                      </div>
                    </td>

                    {/* Pass/Fail Status */}
                    <td className="py-3 px-3 text-center">
                      {result.passed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-mono font-bold text-[10px]">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          FAIL
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
