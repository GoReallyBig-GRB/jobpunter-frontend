'use client';

import React, { useState } from 'react';
import { JobProvider, useJobs } from './context/JobContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { JobsListView } from './components/JobsListView';
import { ReviewQueueView } from './components/ReviewQueueView';
import { ReadyToApplyView } from './components/ReadyToApplyView';
import { ApplicationsPipelineView } from './components/ApplicationsPipelineView';
import { MasterCareerProfileView } from './components/MasterCareerProfileView';
import { CareerPreferencesView } from './components/CareerPreferencesView';
import { EvidenceHealthView } from './components/EvidenceHealthView';
import { TestCasesView } from './components/TestCasesView';
import { IngestionView } from './components/IngestionView';
import { SettingsView } from './components/SettingsView';
import { CVStudioView } from './components/CVStudioView';
import { AIProvidersView } from './components/AIProvidersView';
import { EvidenceLibraryView } from './components/EvidenceLibraryView';
import { JobDetailModal } from './components/JobDetailModal';
import { IngestModal } from './components/IngestModal';
import { DocumentIngestModal } from './components/DocumentIngestModal';
import { GoogleWorkspaceView } from './components/GoogleWorkspaceView';

function AppContent() {
  const { masterProfile } = useJobs();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedJobIdForModal, setSelectedJobIdForModal] = useState<string | null>(null);
  const [preselectedReviewId, setPreselectedReviewId] = useState<string | null>(null);
  const [preselectedReadyId, setPreselectedReadyId] = useState<string | null>(null);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);

  const handleOpenJobDetail = (id: string) => {
    setSelectedJobIdForModal(id);
  };

  const handleSelectForReview = (id: string) => {
    setPreselectedReviewId(id);
    setActiveTab('review');
  };

  const handleSelectForApplication = (id: string) => {
    setPreselectedReadyId(id);
    setActiveTab('ready');
  };

  const getPageTitle = (tab: NavTab): { title: string; subtitle: string } => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Executive Decision Dashboard', subtitle: 'Pipeline metrics, apply-gate pass rates, and conversion health' };
      case 'master_profile':
        return { title: 'Master Career Profile', subtitle: 'Universal factual source of truth across education, employment, and evidence' };
      case 'career_pathways':
        return { title: 'Career Pathways & Role Families', subtitle: 'AI suggested, candidate approved career trajectories' };
      case 'cv_library':
        return { title: 'Master CV & Variant Library', subtitle: 'Approved CV variants tailored for specific role families' };
      case 'preferences':
        return { title: 'Career Preferences & Hard Exclusions', subtitle: 'Candidate-defined constraints, excluded job types, and remote rules' };
      case 'ingestion':
        return { title: 'Job Alerts & Email Ingestion', subtitle: 'Multi-source digest splitter, URL deduplication, and raw parser' };
      case 'jobs':
        return { title: 'Evaluated Opportunity Pool', subtitle: 'Complete inventory of evaluated jobs and recommendation rankings' };
      case 'review':
        return { title: 'Review Desk', subtitle: 'Opportunities requiring candidate judgment or verification' };
      case 'ready':
        return { title: 'Ready to Apply', subtitle: '100% prepared applications with tailored ATS CVs and cover letters' };
      case 'pipeline':
        return { title: 'Application Pipeline', subtitle: 'Stage tracking from submission through interviews and offers' };
      case 'materials':
        return { title: 'Application Materials & Packages', subtitle: 'One-time job-specific application packages, questions, and audits' };
      case 'evidence_library':
        return { title: 'Candidate Evidence Library', subtitle: 'Factual repository of verified outcomes, case studies, and boundary rules' };
      case 'health':
        return { title: 'Evidence Health & Gaps', subtitle: 'Verification audits and missing requirement telemetry' };
      case 'tests':
        return { title: 'Decision Engine Test Suite', subtitle: 'Automated verification across 18 benchmark scenarios' };
      case 'ai_providers':
        return { title: 'JobPunter AI', subtitle: 'AI execution and configuration are managed by JobPunter.' };
      case 'settings':
        return { title: 'Candidate Preferences', subtitle: 'Your search location and application-cost constraints' };
      case 'google_workspace':
        return { title: 'Google Workspace Integrations', subtitle: 'Optional Google Drive, Gmail, Calendar, and Tasks connections' };
      default:
        return { title: 'JobPunter', subtitle: 'Precision Opportunity & Application Engine' };
    }
  };

  const { title, subtitle } = getPageTitle(activeTab);

  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-900 flex font-sans antialiased selection:bg-zinc-900 selection:text-white">
      {/* Persistent Sidebar (Section 21) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUploadModal={() => setIsDocumentUploadOpen(true)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Compact Global Header (Section 21) */}
        <Header
          onOpenIngestModal={() => setIsIngestModalOpen(true)}
          onOpenUploadModal={() => setIsDocumentUploadOpen(true)}
          onOpenWorkspace={() => setActiveTab('google_workspace')}
          title={title}
          subtitle={subtitle}
        />

        {/* View Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={(tab: any) => setActiveTab(tab)}
              onOpenJobDetail={handleOpenJobDetail}
              onOpenIngestModal={() => setIsIngestModalOpen(true)}
            />
          )}

          {activeTab === 'master_profile' && (
            <MasterCareerProfileView
              onOpenUploadModal={() => setIsDocumentUploadOpen(true)}
            />
          )}

          {activeTab === 'career_pathways' && (
            <CVStudioView />
          )}

          {activeTab === 'cv_library' && (
            <CVStudioView />
          )}

          {activeTab === 'preferences' && (
            <CareerPreferencesView />
          )}

          {activeTab === 'jobs' && (
            <JobsListView
              onOpenJobDetail={handleOpenJobDetail}
              onSelectForReview={handleSelectForReview}
              onSelectForApplication={handleSelectForApplication}
            />
          )}

          {activeTab === 'review' && (
            <ReviewQueueView
              onOpenJobDetail={handleOpenJobDetail}
              preselectedJobId={preselectedReviewId}
            />
          )}

          {activeTab === 'ready' && (
            <ReadyToApplyView
              onOpenJobDetail={handleOpenJobDetail}
              preselectedJobId={preselectedReadyId}
            />
          )}

          {activeTab === 'pipeline' && (
            <ApplicationsPipelineView
              onOpenJobDetail={handleOpenJobDetail}
            />
          )}

          {activeTab === 'materials' && (
            <ReadyToApplyView
              onOpenJobDetail={handleOpenJobDetail}
              preselectedJobId={preselectedReadyId}
            />
          )}

          {activeTab === 'evidence_library' && (
            <EvidenceLibraryView />
          )}

          {activeTab === 'health' && (
            <EvidenceHealthView />
          )}

          {activeTab === 'tests' && (
            <TestCasesView
              onOpenJobDetail={handleOpenJobDetail}
            />
          )}

          {activeTab === 'ingestion' && (
            <IngestionView
              onOpenJobDetail={handleOpenJobDetail}
            />
          )}

          {activeTab === 'ai_providers' && (
            <AIProvidersView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {activeTab === 'google_workspace' && (
            <GoogleWorkspaceView />
          )}

        </main>

        {/* Footer info */}
        <footer className="bg-white border-t border-zinc-200 py-3 px-6 text-xs text-zinc-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-700">JobPunter</span>
            <span>&middot;</span>
            <span>AI Interprets · Evidence Supports · Rules Decide · Candidate in Control</span>
          </div>
          <div>
            <span>
              {masterProfile?.candidateName ? (
                <>Active: <strong>{masterProfile.candidateName}</strong> ({masterProfile.primaryProfession})</>
              ) : (
                <span className="text-amber-600 font-semibold">No Master Career Profile configured</span>
              )}
            </span>
          </div>
        </footer>
      </div>

      {/* Detailed Inspection Modal */}
      {selectedJobIdForModal && (
        <JobDetailModal
          jobId={selectedJobIdForModal}
          onClose={() => setSelectedJobIdForModal(null)}
          onSelectForApplication={handleSelectForApplication}
        />
      )}

      {/* Quick Job Ingestion Modal */}
      <IngestModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onJobEvaluated={(id) => setSelectedJobIdForModal(id)}
      />

      {/* Real Multi-Format Document Ingest Modal (PDF/DOCX/TXT) */}
      <DocumentIngestModal
        isOpen={isDocumentUploadOpen}
        onClose={() => setIsDocumentUploadOpen(false)}
        onSuccess={() => setActiveTab('master_profile')}
      />
    </div>
  );
}

export default function App() {
  return (
    <JobProvider>
      <AppContent />
    </JobProvider>
  );
}
