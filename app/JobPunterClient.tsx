'use client';

import dynamic from 'next/dynamic';

const ExistingJobPunterApp = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 text-zinc-700">
      <p className="text-sm">Loading JobPunter…</p>
    </main>
  ),
});

export default function JobPunterClient() {
  return <ExistingJobPunterApp />;
}