'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Bell, BriefcaseBusiness, ChevronDown, FileCheck2, FileText, House, Layers, Link, Mail, MoreHorizontal, Search, Settings2, Sparkles, Upload, UserRound, type LucideIcon } from 'lucide-react';
import { googleSignIn, initAuth, logoutUser } from '../services/firebase';
import { ConnectionAction, integrationPreview } from './ConnectionAction';
import { actionReadiness, connectionFeedback } from './connections';
import { searchProcessedJobs, type SearchJob, type SearchPage } from './searchApi';
import './candidate.css';

type Screen = 'Home' | 'Career' | 'Review' | 'Job Pool' | 'Discover' | 'Punts' | 'Pipeline' | 'More';
type CareerSection = 'overview' | 'upload' | 'create' | 'profile' | 'pathways' | 'documents';
type Intake = 'url' | 'description' | 'email' | 'schedule' | null;
const tabs: { title: Screen; icon: LucideIcon }[] = [
  { title: 'Home', icon: House }, { title: 'Career', icon: UserRound }, { title: 'Review', icon: FileCheck2 },
  { title: 'Job Pool', icon: Layers }, { title: 'Discover', icon: Search }, { title: 'Punts', icon: Sparkles },
  { title: 'Pipeline', icon: BriefcaseBusiness }, { title: 'More', icon: MoreHorizontal },
];

function Card({ title, subtitle, icon: Icon, onClick }: { title: string; subtitle: string; icon: LucideIcon; onClick: () => void }) {
  return <button className="jp-small-card" onClick={onClick}><Icon aria-hidden="true" /><strong>{title}</strong><span>{subtitle}</span></button>;
}
function Panel({ children, feature = false }: { children: ReactNode; feature?: boolean }) {
  return <section className={`jp-panel ${feature ? 'jp-feature' : ''}`}>{children}</section>;
}
function Heading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <><span className="jp-eyebrow">{eyebrow}</span><h1>{title}</h1>{children && <p className="jp-muted">{children}</p>}</>;
}

export function CandidateApp() {
  const [screen, setScreen] = useState<Screen>('Home');
  const [careerSection, setCareerSection] = useState<CareerSection>('overview');
  const [intake, setIntake] = useState<Intake>(null);
  const [account, setAccount] = useState<{ uid: string; name: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [message, setMessage] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [puntTab, setPuntTab] = useState('New');
  const [searchResults, setSearchResults] = useState<SearchPage | null>(null);
  const [selectedJob, setSelectedJob] = useState<SearchJob | null>(null);
  const main = useRef<HTMLElement>(null);
  useEffect(() => initAuth(user => {
    // Account changes must not retain another candidate's in-memory records.
    setSearchResults(null); setSelectedJob(null);
    setAccount({ uid: user.uid, name: user.displayName?.split(' ')[0] || 'there' }); setAuthReady(true);
  }, () => { setAccount(null); setSearchResults(null); setSelectedJob(null); setAuthReady(true); }), []);

  function navigate(next: Screen) { setScreen(next); setIntake(null); setMessage(''); main.current?.focus(); window.scrollTo({ top: 0 }); }
  function career(next: CareerSection) { navigate('Career'); setCareerSection(next); }
  function pending(id: string) { setMessage(connectionFeedback(actionReadiness(id), integrationPreview) || 'This action is ready.'); }
  async function signIn() {
    if (signingIn) return;
    setSigningIn(true);
    try { await googleSignIn(); }
    catch (error) { setMessage(`Could not sign in. ${error instanceof Error ? error.message : 'Please try again.'}`); }
    finally { setSigningIn(false); }
  }
  const action = (id: string, label: string, primary = false) => <ConnectionAction id={id} report={setMessage} primary={primary}>{label}</ConnectionAction>;
  const unavailable = (id: string, text: string) => <Panel><p>{text}</p>{action(id, 'Load latest')}</Panel>;

  return <div className="jp-candidate">
    <header className="jp-header"><a href="#main" className="jp-brand" aria-label="JobPunter home" onClick={event => { event.preventDefault(); navigate('Home'); }}><img src="/jobpunter-logo.png" alt="JobPunter" /></a>
      <div className="jp-header-actions"><button className="jp-icon-button" aria-label="Notifications" onClick={() => pending('notifications.list')}><Bell size={19} /></button>
        {account ? <button className="jp-icon-button" aria-label="Account and settings" onClick={() => navigate('More')}><UserRound size={19} /></button> : <button className="jp-button" onClick={signIn} disabled={!authReady || signingIn}>{signingIn ? 'Signing in…' : 'Sign in'}</button>}</div>
    </header>
    {integrationPreview && <div className="jp-preview">Implementation preview · Unverified actions stay gated</div>}
    <main id="main" ref={main} tabIndex={-1} className="jp-content">
      {message && <div className="jp-feedback" role="alert"><p>{message}</p><button className="jp-button" onClick={() => setMessage('')}>Dismiss</button></div>}
      {screen === 'Home' && <>
        <Heading eyebrow={account ? `Welcome back, ${account.name}` : 'Your workspace'} title="Your job search, at a glance">Find opportunities. Build a strong application. Keep moving.</Heading>
        <div className="jp-stats">{[['Job Pool', 'Opportunities'], ['Punts', 'Strong matches'], ['Pipeline', 'Applications']].map(([target, label]) => <button key={target} onClick={() => navigate(target as Screen)}><strong aria-label="Count not loaded">—</strong><span>{label}</span></button>)}</div>
        <Panel feature><span className="jp-eyebrow">Your next step</span><h2>Find your next opportunity</h2><p>Start with the roles and locations you have in mind. Review the jobs, then add your career information to assess personal fit.</p><button className="jp-button jp-primary" onClick={() => navigate('Discover')}>Find opportunities</button></Panel>
        <h2>Make your next move</h2><div className="jp-card-grid">
          <Card title="Your career" subtitle="Your experience, in one place" icon={UserRound} onClick={() => career('overview')} />
          <Card title="Add your CV" subtitle="Start with what you have" icon={Upload} onClick={() => career('upload')} />
          <Card title="Review queue" subtitle="Decisions that need you" icon={FileCheck2} onClick={() => navigate('Review')} />
          <Card title="Discover" subtitle="Find your next opportunity" icon={Search} onClick={() => navigate('Discover')} />
        </div>
        <Panel><h2>Needs your attention</h2><p className="jp-muted">Updates have not been loaded.</p>{action('notifications.list', 'View updates')}</Panel>
        <Panel><h2>Your pipeline</h2><p className="jp-muted">Follow each application from preparation to outcome.</p><button className="jp-button" onClick={() => navigate('Pipeline')}>Open pipeline</button></Panel>
        <Panel><h2>Recent activity</h2><p className="jp-muted">Sign in and load your activity to continue where you left off.</p>{action('activity.list', 'Load activity')}</Panel>
        <Panel><h2>Need a hand?</h2><p className="jp-muted">Get help with your account or application preparation.</p>{action('support.list', 'Open support')}</Panel>
      </>}

      {screen === 'Discover' && <>
        <Heading eyebrow="Discover" title="Find your next opportunity">Find opportunities that suit your preferences, or add a job you already have in mind.</Heading>
        <button className="jp-disclosure" aria-expanded={searchOpen} aria-controls="discover-search" onClick={() => setSearchOpen(!searchOpen)}><span>Find opportunities</span><ChevronDown className={searchOpen ? 'jp-rotated' : ''} /></button>
        <div id="discover-search" hidden={!searchOpen}><SearchPanel personal={false} report={setMessage} onResults={setSearchResults} /></div>
        <h2 className="jp-section-title">Already found something?</h2><div className="jp-card-grid">
          <Card title="Add a job link" subtitle="Bring a listing with you" icon={Link} onClick={() => setIntake('url')} />
          <Card title="Paste a job" subtitle="Add the full description" icon={FileText} onClick={() => setIntake('description')} />
          <Card title="Paste an alert" subtitle="Review jobs from an email" icon={Mail} onClick={() => setIntake('email')} />
          <Card title="Daily updates" subtitle="Schedule recommendations" icon={Settings2} onClick={() => setIntake('schedule')} />
        </div>
        <Panel><h2>Personal email alerts</h2><p className="jp-muted">Connecting your mailbox requires separate permission. Signing in does not enable monitoring.</p>{action('mailbox.connect', 'Connect email alerts')}</Panel>
        {intake && <IntakePanel kind={intake} report={setMessage} close={() => setIntake(null)} />}
        <Panel><h2>Your discoveries</h2><p className="jp-muted">{searchResults ? `${searchResults.pagination.total} results. Personal fit has not been assessed.` : 'No search results have been loaded. Personal fit stays pending until career evidence is available.'}</p>{!searchResults && action('discover.results', 'Resume previous results')}<button className="jp-button" onClick={() => navigate('Job Pool')}>Open Job Pool</button></Panel>
        {searchResults?.data.map(job => <Panel key={job.id}><span className="jp-eyebrow">Fit pending</span><h2>{job.title}</h2><p>{job.company_name || 'Company not provided'} · {job.location_country || 'Location not provided'}</p><p className="jp-muted">{job.description?.preview || 'Description unavailable'}</p><button className="jp-button" onClick={() => setSelectedJob(job)}>Review this job</button></Panel>)}
      </>}

      {screen === 'Job Pool' && <>
        <Heading eyebrow="Your opportunities" title="Job Pool">Review your opportunities and choose your next move.</Heading>
        <div className="jp-actions"><button className="jp-disclosure" aria-expanded={searchOpen} aria-controls="pool-search" onClick={() => setSearchOpen(!searchOpen)}>Search your pool <ChevronDown className={searchOpen ? 'jp-rotated' : ''} /></button><button className="jp-button" onClick={() => navigate('Punts')}>View Punts</button></div>
        <div id="pool-search" hidden={!searchOpen}><SearchPanel personal report={setMessage} onResults={setSearchResults} /></div>
        {unavailable('pool.list', 'Your Job Pool has not been loaded. Opportunity and Punt counts are unavailable.')}
        <button className="jp-button jp-primary" onClick={() => navigate('Discover')}>Find opportunities</button>
      </>}

      {screen === 'Career' && <>
        <Heading eyebrow="Your career" title={careerSection === 'create' ? 'Build your CV, one detail at a time' : careerSection === 'upload' ? 'Start with your CV' : 'Your experience. Your story.'}>Keep a factual career source for CVs and applications. Review extracted information before approving it.</Heading>
        {careerSection !== 'overview' && <button className="jp-button" onClick={() => setCareerSection('overview')}>Back to career</button>}
        {careerSection === 'overview' && <div className="jp-card-grid">
          <Card title="Upload CV" subtitle="PDF, DOCX or text" icon={Upload} onClick={() => setCareerSection('upload')} />
          <Card title="Create a CV" subtitle="A guided start from scratch" icon={FileText} onClick={() => setCareerSection('create')} />
          <Card title="Career profile" subtitle="Review your factual source" icon={UserRound} onClick={() => setCareerSection('profile')} />
          <Card title="Career pathways" subtitle="Evidence-supported directions" icon={Sparkles} onClick={() => setCareerSection('pathways')} />
          <Card title="CV library" subtitle="Master and approved versions" icon={Layers} onClick={() => setCareerSection('documents')} />
          <Card title="Supporting evidence" subtitle="Projects and achievements" icon={FileCheck2} onClick={() => pending('career.evidence.list')} />
        </div>}
        {careerSection === 'upload' && <Panel><h2>Add your CV</h2><p className="jp-muted">Files stay on this device until upload is connected. Selecting a file does not save or approve it.</p><label className="jp-field">CV file *<input type="file" accept=".pdf,.docx,.txt" /></label>{action('career.import', 'Upload and review', true)}</Panel>}
        {careerSection === 'create' && <GuidedCareer report={setMessage} />}
        {careerSection === 'profile' && unavailable('career.profile.read', 'Your career profile has not been loaded.')}
        {careerSection === 'pathways' && unavailable('career.pathways.list', 'Pathways need approved career evidence. No directions have been generated here.')}
        {careerSection === 'documents' && <Panel><h2>Your CV library</h2><p className="jp-muted">Load the exact saved versions before editing, approving or exporting a CV.</p>{action('cv.list', 'Load CVs')}{action('cv.regenerate', 'Generate master CV')}{action('cv.saveApprove', 'Save and approve')}{action('cv.export.pdf', 'Export PDF')}{action('cv.export.docx', 'Export DOCX')}</Panel>}
      </>}

      {screen === 'Review' && <>
        <Heading eyebrow="Your decisions" title="Review queue">Review career facts, document changes and application materials before approval.</Heading>
        {unavailable('review.list', 'Your review items have not been loaded. Approval never submits an application to an employer.')}
        <div className="jp-card-grid"><Card title="Career facts" subtitle="Review the evidence behind your CV" icon={UserRound} onClick={() => career('profile')} /><Card title="Your documents" subtitle="Check exact saved revisions" icon={FileText} onClick={() => career('documents')} /></div>
      </>}

      {screen === 'Punts' && <>
        <Heading eyebrow="Your strongest matches" title="Punts">Recommendations supported by your career evidence. Submission is recorded only after you have applied.</Heading>
        <div className="jp-tabs" aria-label="Punt history">{['New', 'All', 'Watched', 'Applied', 'Rejected'].map(tab => <button key={tab} aria-pressed={puntTab === tab} onClick={() => setPuntTab(tab)}>{tab}</button>)}</div>
        {unavailable('punts.list', `${puntTab} Punts have not been loaded. Daily counts and personal fit are unavailable.`)}
        <Panel><h2>Strong matches start with your career</h2><p className="jp-muted">Add your CV or build a career profile to support an assessment. Search preferences alone do not establish fit.</p><button className="jp-button jp-primary" onClick={() => career('upload')}>Add your CV</button><button className="jp-button" onClick={() => career('create')}>Create a CV</button></Panel>
      </>}

      {screen === 'Pipeline' && <>
        <Heading eyebrow="One application at a time" title="Your pipeline">Keep preparation, actual submission and employer outcomes separate.</Heading>
        {unavailable('pipeline.list', 'Your applications have not been loaded. Stage counts are unavailable.')}
        <Panel><h2>Interview preparation</h2><p className="jp-muted">Open preparation for a selected application after your interview details are available.</p>{action('interview.open', 'Open interview preparation')}</Panel>
      </>}

      {screen === 'More' && <>
        <Heading eyebrow="Your account" title="A little more control">Manage your preferences, connections and support.</Heading>
        <Panel><h2>{account ? `Signed in as ${account.name}` : 'Sign in to JobPunter'}</h2><p className="jp-muted">Your account keeps your work separate from other candidates.</p>{account ? <button className="jp-button" onClick={async () => { try { await logoutUser(); setMessage('Signed out.'); } catch { setMessage('Could not sign out. Please retry.'); } }}>Sign out</button> : <button className="jp-button jp-primary" onClick={signIn} disabled={signingIn || !authReady}>Sign in with Google</button>}</Panel>
        <div className="jp-card-grid"><Card title="Preferences" subtitle="Where and how you want to work" icon={Settings2} onClick={() => pending('preferences.read')} /><Card title="Notifications" subtitle="Your updates and reminders" icon={Bell} onClick={() => pending('notifications.list')} /><Card title="Email connection" subtitle="Separate mailbox permission" icon={Mail} onClick={() => pending('mailbox.connect')} /><Card title="Support" subtitle="Get help when you need it" icon={MoreHorizontal} onClick={() => pending('support.list')} /></div>
      </>}
      {selectedJob && <Panel><button className="jp-button" onClick={() => setSelectedJob(null)}>Close selected job</button><span className="jp-eyebrow">Selected opportunity</span><h2>{selectedJob.title}</h2><details className="jp-career-section"><summary>View this job’s details<ChevronDown size={17} /></summary><p>{selectedJob.company_name || 'Company not provided'}</p><p>{selectedJob.description?.preview || 'Description unavailable'}</p></details><p className="jp-muted">Your personal fit has not been assessed. Add career evidence before preparing tailored documents.</p>{action('application.create', 'Prepare this application', true)}{action('pool.watch', 'Watch')}{action('pool.reject', 'Reject')}<button className="jp-button" onClick={() => career('upload')}>Add your CV</button></Panel>}
    </main>
    <nav className="jp-footer" aria-label="Main navigation">{tabs.map(({ title, icon: Icon }) => <button key={title} onClick={() => navigate(title)} aria-current={screen === title ? 'page' : undefined}><Icon aria-hidden="true" /><span>{title}</span></button>)}</nav>
  </div>;
}

function SearchPanel({ personal, report, onResults }: { personal: boolean; report: (message: string) => void; onResults: (page: SearchPage) => void }) {
  const form = useRef<HTMLFormElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  return <form ref={form} className="jp-panel jp-search" onSubmit={event => { event.preventDefault(); form.current?.querySelector<HTMLButtonElement>('[data-connection-action]')?.click(); }}>
    <label className="jp-field">{personal ? 'Search your opportunities' : 'Roles or keywords *'}<input name="query" required={!personal} maxLength={120} placeholder="e.g. product manager, SaaS" /></label>
    <p className="jp-small">Separate keywords with commas.</p>
    {!personal && <label className="jp-field">Country (optional)<input name="location_country" placeholder="e.g. Nigeria" /></label>}
    <div className="jp-actions"><button type="button" className="jp-button" aria-expanded={filtersOpen} aria-controls={personal ? 'pool-filters' : 'discover-filters'} onClick={() => setFiltersOpen(!filtersOpen)}>Filters <ChevronDown className={filtersOpen ? 'jp-rotated' : ''} size={17} /></button><button type="button" className="jp-button" onClick={() => { form.current?.reset(); }}>Clear filters</button></div>
    <div id={personal ? 'pool-filters' : 'discover-filters'} hidden={!filtersOpen}>
      <div className="jp-form-pair"><label className="jp-field">Work arrangement<select name="work_mode"><option value="">Any</option><option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On site</option></select></label><label className="jp-field">Employment type<select name="employment_type"><option value="">Any</option><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="CONTRACT">Contract</option></select></label></div>
      {personal && <><label className="jp-field">Recency<select name="recency"><option value="">Any time</option><option>Past day</option><option>Past week</option><option>Past month</option></select></label><label className="jp-field">Career pathway<select name="pathway"><option value="">All pathways</option></select></label><label className="jp-field">Source (optional)<input name="source" /></label><label className="jp-field">Your choice<select name="choice"><option value="">Any</option><option>Watched</option><option>Applied</option><option>Rejected</option></select></label></>}
    </div>
    <ConnectionAction id={personal ? 'pool.search' : 'discover.search'} report={report} primary dispatch={personal ? undefined : async () => {
      if (!form.current?.reportValidity()) return;
      const values = new FormData(form.current);
      const page = await searchProcessedJobs({ query: String(values.get('query') || ''), location_country: String(values.get('location_country') || ''), work_mode: String(values.get('work_mode') || ''), employment_type: String(values.get('employment_type') || '') });
      onResults(page);
    }}>{personal ? 'Search pool' : 'Find opportunities'}</ConnectionAction>
    <p className="jp-small">{personal ? 'Search and counts apply to your full Job Pool when connected.' : 'Personal fit is assessed only when your career evidence is available.'}</p>
  </form>;
}

function IntakePanel({ kind, report, close }: { kind: Exclude<Intake, null>; report: (message: string) => void; close: () => void }) {
  const titles = { url: 'Add a job link', description: 'Paste a job description', email: 'Paste an email alert', schedule: 'Schedule recommendations' };
  return <Panel><h2>{titles[kind]}</h2><p className="jp-small">Unsaved input. Nothing is submitted until this action is connected.</p>
    {kind === 'schedule' ? <><label className="jp-field">Time *<input type="time" defaultValue="09:00" /></label><label className="jp-field">Timezone *<input defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone} /></label></> : kind === 'url' ? <label className="jp-field">Job URL *<input type="url" placeholder="https://…" /></label> : <><label className="jp-field">{kind === 'email' ? 'Email content *' : 'Job description *'}<textarea /></label><label className="jp-field">Source URL (optional)<input type="url" /></label><label className="jp-field">Source name (optional)<input /></label></>}
    <ConnectionAction id={kind === 'schedule' ? 'discover.schedule' : `discover.intake.${kind}`} report={report} primary>{kind === 'schedule' ? 'Save schedule' : 'Submit for processing'}</ConnectionAction><button className="jp-button" onClick={close}>Close</button>
  </Panel>;
}

function GuidedCareer({ report }: { report: (message: string) => void }) {
  return <Panel><p className="jp-small">Unsaved draft. Your details are not persisted yet.</p>
    {[
      ['Personal details', ['Full name *', 'Email address *', 'Phone (optional)', 'Location *', 'Portfolio or LinkedIn URL (optional)']],
      ['Eligibility and preferences', ['Work authorization *', 'Target roles *', 'Preferred work arrangement (optional)']],
      ['Experience', ['Role and employer *', 'Start and end dates (optional)', 'Responsibilities and outcomes *']],
      ['Projects and achievements', ['Project name (optional)', 'Your contribution and measurable results (optional)']],
      ['Education', ['Qualification and institution (optional)', 'Graduation year (optional)']],
      ['Skills and links', ['Skills *', 'Supporting links (optional)']],
    ].map(([title, labels]) => <details className="jp-career-section" key={title as string}><summary>{title}<ChevronDown size={17} /></summary>{(labels as string[]).map(label => <label className="jp-field" key={label}>{label}<textarea rows={2} required={label.endsWith('*')} /></label>)}</details>)}
    <ConnectionAction id="career.draft.save" report={report} primary>Save career draft</ConnectionAction>
  </Panel>;
}
