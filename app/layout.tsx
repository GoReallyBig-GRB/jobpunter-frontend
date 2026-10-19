import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'JobPunter — Precision Opportunity & Application Engine',
  description: 'Precision job-hunting decision engine and application preparation system. Candidate in control.',
  openGraph: {
    title: 'JobPunter — Precision Opportunity & Application Engine',
    description: 'Precision job-hunting decision engine and application preparation system. Candidate in control.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}