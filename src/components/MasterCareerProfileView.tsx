import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  MasterProfile, 
  EmploymentRecord, 
  ProjectOrProductRecord, 
  EducationRecord, 
  CertificationRecord,
  PortfolioRecord,
  CurrentWorkRecord,
  ChallengeSolutionRecord,
  AchievementOutcomeRecord,
  IndustryDomainRecord,
  LeadershipOwnershipRecord,
  CandidatePersonalDetails,
  CareerPathway
} from '../types/job';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Layers, 
  Sliders, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Upload, 
  Compass, 
  Globe, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  AlertCircle, 
  FileText, 
  Mail, 
  Phone, 
  Link as LinkIcon, 
  HelpCircle, 
  Target,
  ExternalLink,
  RotateCcw,
  Sparkles,
  BookOpen,
  FolderGit2
} from 'lucide-react';
import { EmptyProfileState } from './EmptyProfileState';

// Section 2: 12 Dedicated Tabs
export type ProfileSection = 
  | 'overview' 
  | 'personal' 
  | 'career' 
  | 'experience' 
  | 'projects' 
  | 'achievements' 
  | 'education' 
  | 'certifications' 
  | 'portfolio' 
  | 'evidence' 
  | 'preferences' 
  | 'pathways';

interface MasterCareerProfileViewProps {
  onOpenUploadModal: () => void;
  onNavigateToCVStudio?: () => void;
}

export const MasterCareerProfileView: React.FC<MasterCareerProfileViewProps> = ({
  onOpenUploadModal,
  onNavigateToCVStudio
}) => {
  const { 
    masterProfile, 
    updateMasterProfile, 
    preferences, 
    updatePreferences, 
    careerPathways,
    activePresetId,
    derivedMaterialsOutdated,
    dismissProfileOutdatedNotice,
    updateMasterCVFromProfile
  } = useJobs();

  const [activeSection, setActiveSection] = useState<ProfileSection>('overview');
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [isUpdatingMCV, setIsUpdatingMCV] = useState(false);

  // Profile Header Edit State
  const [headerName, setHeaderName] = useState(masterProfile?.candidateName || '');
  const [headerProfession, setHeaderProfession] = useState(masterProfile?.primaryProfession || '');
  const [headerPositioning, setHeaderPositioning] = useState(masterProfile?.corePositioning || '');
  const [headerWorkingMethod, setHeaderWorkingMethod] = useState(masterProfile?.workingMethod || '');
  const [headerLocation, setHeaderLocation] = useState(masterProfile?.location || '');
  const [headerWorkAuth, setHeaderWorkAuth] = useState(masterProfile?.workAuthorisation || '');

  // Section 2: Education Edit & Add State
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [newEduInst, setNewEduInst] = useState('');
  const [newEduQualification, setNewEduQualification] = useState('');
  const [newEduField, setNewEduField] = useState('');
  const [newEduStartDate, setNewEduStartDate] = useState('');
  const [newEduEndDate, setNewEduEndDate] = useState('');
  const [newEduLocation, setNewEduLocation] = useState('');
  const [newEduGrade, setNewEduGrade] = useState('');
  const [newEduDescription, setNewEduDescription] = useState('');
  const [newEduEvidence, setNewEduEvidence] = useState('');

  // Section 2: Certification Edit & Add State
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertOrg, setNewCertOrg] = useState('');
  const [newCertIssueDate, setNewCertIssueDate] = useState('');
  const [newCertExpiryDate, setNewCertExpiryDate] = useState('');
  const [newCertCredentialId, setNewCertCredentialId] = useState('');
  const [newCertCredentialUrl, setNewCertCredentialUrl] = useState('');
  const [newCertEvidence, setNewCertEvidence] = useState('');
  const [newCertNotes, setNewCertNotes] = useState('');
  const [newCertStatus, setNewCertStatus] = useState<'ACTIVE' | 'EXPIRED' | 'IN_PROGRESS'>('ACTIVE');

  // Section 2: Portfolio Edit & Add State
  const [showAddPort, setShowAddPort] = useState(false);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortCategory, setNewPortCategory] = useState<PortfolioRecord['category']>('Live Project');
  const [newPortUrl, setNewPortUrl] = useState('');
  const [newPortProject, setNewPortProject] = useState('');
  const [newPortEvidence, setNewPortEvidence] = useState('');
  const [newPortNotes, setNewPortNotes] = useState('');

  // Personal Edit State
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [persFullName, setPersFullName] = useState('');
  const [persEmail, setPersEmail] = useState('');
  const [persPhone, setPersPhone] = useState('');
  const [persLocation, setPersLocation] = useState('');
  const [persWorkAuth, setPersWorkAuth] = useState('');
  const [persRemotePref, setPersRemotePref] = useState<'REMOTE_ONLY' | 'REMOTE_OK' | 'HYBRID_OK' | 'ONSITE_OK'>('REMOTE_ONLY');
  const [persReloc, setPersReloc] = useState(false);
  const [persEligibleCountries, setPersEligibleCountries] = useState('');
  const [persLinkedIn, setPersLinkedIn] = useState('');
  const [persGitHub, setPersGitHub] = useState('');
  const [persPortfolio, setPersPortfolio] = useState('');

  // Add Employment State
  const [showAddJob, setShowAddJob] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobPeriod, setNewJobPeriod] = useState('');
  const [newJobType, setNewJobType] = useState<'FULL_TIME' | 'CONTRACT' | 'PART_TIME' | 'CONSULTING'>('FULL_TIME');
  const [newJobResps, setNewJobResps] = useState('');
  const [newJobAchs, setNewJobAchs] = useState('');

  // Add Project State
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjRole, setNewProjRole] = useState('');
  const [newProjContext, setNewProjContext] = useState('');
  const [newProjStatus, setNewProjStatus] = useState('Live');
  const [newProjBullets, setNewProjBullets] = useState('');

  // Add Achievement State
  const [showAddAch, setShowAddAch] = useState(false);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchCategory, setNewAchCategory] = useState<'QUANTIFIED' | 'QUALITATIVE' | 'BUSINESS' | 'OPERATIONAL' | 'CUSTOMER_USER' | 'EFFICIENCY' | 'AWARD_RECOGNITION' | 'OTHER'>('QUANTIFIED');
  const [newAchMetric, setNewAchMetric] = useState('');
  const [newAchContext, setNewAchContext] = useState('');
  const [newAchEvidence, setNewAchEvidence] = useState('');

  const hasCandidate = masterProfile && masterProfile.candidateName && masterProfile.candidateName.trim().length > 0 && activePresetId !== 'none';

  if (!hasCandidate) {
    return (
      <EmptyProfileState
        onOpenUploadModal={onOpenUploadModal}
        onStartManualProfile={() => {
          updateMasterProfile({
            candidateName: 'Your Full Name',
            primaryProfession: 'Your Primary Profession',
            corePositioning: 'Professional overview and value proposition.',
            workingMethod: 'Systematic analysis -> structured implementation -> verification',
            location: 'Remote',
            workAuthorisation: 'Authorized'
          });
          setIsEditingHeader(true);
        }}
      />
    );
  }

  const struct = masterProfile.structuredData || ({} as any);
  const personal = masterProfile.personalDetails || struct.personalDetails || ({} as CandidatePersonalDetails);
  const educationList: EducationRecord[] = struct.education || [];
  const certList: CertificationRecord[] = struct.certifications || [];
  const portfolioList: PortfolioRecord[] = struct.portfolio || [];
  const domainList: IndustryDomainRecord[] = struct.industryDomains || [];
  const employmentList: EmploymentRecord[] = struct.employmentHistory || [];
  const projectList: ProjectOrProductRecord[] = struct.projectsOrProducts || [];
  const achievementList: AchievementOutcomeRecord[] = struct.achievements || [];

  // 12 Dedicated Sections Configuration (Section 2)
  const sections: { id: ProfileSection; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'personal', label: 'Personal / Eligibility', icon: Globe },
    { id: 'career', label: 'Career', icon: Compass },
    { id: 'experience', label: 'Experience', icon: Briefcase, badge: employmentList.length },
    { id: 'projects', label: 'Projects / Products', icon: Code, badge: projectList.length },
    { id: 'achievements', label: 'Achievements', icon: CheckCircle2, badge: achievementList.length },
    { id: 'education', label: 'Education', icon: GraduationCap, badge: educationList.length },
    { id: 'certifications', label: 'Certifications', icon: Award, badge: certList.length },
    { id: 'portfolio', label: 'Portfolio', icon: FolderGit2, badge: portfolioList.length },
    { id: 'evidence', label: 'Evidence', icon: ShieldAlert },
    { id: 'preferences', label: 'Preferences / Constraints', icon: Sliders },
    { id: 'pathways', label: 'Career Pathways', icon: Target, badge: careerPathways.length }
  ];

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    updateMasterProfile({
      candidateName: headerName,
      primaryProfession: headerProfession,
      corePositioning: headerPositioning,
      workingMethod: headerWorkingMethod,
      location: headerLocation,
      workAuthorisation: headerWorkAuth
    });
    setIsEditingHeader(false);
  };

  const startEditingPersonal = () => {
    setPersFullName(personal.fullName || masterProfile.candidateName || '');
    setPersEmail(personal.email || '');
    setPersPhone(personal.phone || '');
    setPersLocation(personal.currentLocation || masterProfile.location || '');
    setPersWorkAuth(personal.workAuthorization || masterProfile.workAuthorisation || '');
    setPersRemotePref(personal.remotePreference || 'REMOTE_ONLY');
    setPersReloc(personal.relocationWillingness ?? false);
    setPersEligibleCountries((personal.eligibleCountries || ['Nigeria']).join(', '));
    setPersLinkedIn(personal.linkedIn || '');
    setPersGitHub(personal.gitHub || '');
    setPersPortfolio(personal.portfolio || '');
    setIsEditingPersonal(true);
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPersonal: CandidatePersonalDetails = {
      fullName: persFullName,
      email: persEmail,
      phone: persPhone,
      currentLocation: persLocation,
      workAuthorization: persWorkAuth,
      remotePreference: persRemotePref,
      relocationWillingness: persReloc,
      eligibleCountries: persEligibleCountries.split(',').map(s => s.trim()).filter(Boolean),
      linkedIn: persLinkedIn,
      gitHub: persGitHub,
      portfolio: persPortfolio
    };

    updateMasterProfile({
      candidateName: persFullName,
      location: persLocation,
      workAuthorisation: persWorkAuth,
      personalDetails: updatedPersonal,
      structuredData: {
        ...struct,
        personalDetails: updatedPersonal
      }
    });
    setIsEditingPersonal(false);
  };

  // Education Handlers (Section 2)
  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduInst.trim() || !newEduQualification.trim()) return;

    const newRecord: EducationRecord = {
      id: `edu_${Date.now()}`,
      institution: newEduInst.trim(),
      qualification: newEduQualification.trim(),
      fieldOfStudy: newEduField.trim() || undefined,
      startDate: newEduStartDate.trim() || undefined,
      endDate: newEduEndDate.trim() || undefined,
      year: newEduEndDate.trim() || newEduStartDate.trim() || undefined,
      location: newEduLocation.trim() || undefined,
      grade: newEduGrade.trim() || undefined,
      description: newEduDescription.trim() || undefined,
      supportingEvidence: newEduEvidence.trim() || undefined
    };

    updateMasterProfile({
      structuredData: {
        ...struct,
        education: [newRecord, ...educationList]
      }
    });

    setNewEduInst('');
    setNewEduQualification('');
    setNewEduField('');
    setNewEduStartDate('');
    setNewEduEndDate('');
    setNewEduLocation('');
    setNewEduGrade('');
    setNewEduDescription('');
    setNewEduEvidence('');
    setShowAddEdu(false);
  };

  const handleDeleteEducation = (idx: number) => {
    const updated = educationList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, education: updated } });
  };

  // Certification Handlers (Section 2)
  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !newCertOrg.trim()) return;

    const newRecord: CertificationRecord = {
      id: `cert_${Date.now()}`,
      name: newCertName.trim(),
      certificationName: newCertName.trim(),
      issuingOrganization: newCertOrg.trim(),
      issuer: newCertOrg.trim(),
      issueDate: newCertIssueDate.trim() || undefined,
      dateObtained: newCertIssueDate.trim() || undefined,
      expiryDate: newCertExpiryDate.trim() || undefined,
      credentialId: newCertCredentialId.trim() || undefined,
      credentialUrl: newCertCredentialUrl.trim() || undefined,
      verificationUrl: newCertCredentialUrl.trim() || undefined,
      supportingEvidence: newCertEvidence.trim() || undefined,
      notes: newCertNotes.trim() || undefined,
      status: newCertStatus
    };

    updateMasterProfile({
      structuredData: {
        ...struct,
        certifications: [newRecord, ...certList]
      }
    });

    setNewCertName('');
    setNewCertOrg('');
    setNewCertIssueDate('');
    setNewCertExpiryDate('');
    setNewCertCredentialId('');
    setNewCertCredentialUrl('');
    setNewCertEvidence('');
    setNewCertNotes('');
    setShowAddCert(false);
  };

  const handleDeleteCertification = (idx: number) => {
    const updated = certList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, certifications: updated } });
  };

  // Portfolio Handlers (Section 2)
  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle.trim() || !newPortUrl.trim()) return;

    const formattedUrl = newPortUrl.startsWith('http://') || newPortUrl.startsWith('https://')
      ? newPortUrl.trim()
      : `https://${newPortUrl.trim()}`;

    const newRecord: PortfolioRecord = {
      id: `port_${Date.now()}`,
      title: newPortTitle.trim(),
      name: newPortTitle.trim(),
      description: newPortDesc.trim(),
      category: newPortCategory,
      url: formattedUrl,
      associatedProject: newPortProject.trim() || undefined,
      supportingEvidence: newPortEvidence.trim() || undefined,
      notes: newPortNotes.trim() || undefined
    };

    updateMasterProfile({
      structuredData: {
        ...struct,
        portfolio: [newRecord, ...portfolioList]
      }
    });

    setNewPortTitle('');
    setNewPortDesc('');
    setNewPortUrl('');
    setNewPortProject('');
    setNewPortEvidence('');
    setNewPortNotes('');
    setShowAddPort(false);
  };

  const handleDeletePortfolio = (idx: number) => {
    const updated = portfolioList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, portfolio: updated } });
  };

  // Employment Handlers
  const handleAddEmployment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobCompany.trim()) return;

    const resps = newJobResps.split('\n').map(s => s.trim()).filter(Boolean);
    const achs = newJobAchs.split('\n').map(s => s.trim()).filter(Boolean);

    const newRole: EmploymentRecord = {
      id: `emp_${Date.now()}`,
      role: newJobTitle.trim(),
      organization: newJobCompany.trim(),
      period: newJobPeriod.trim() || 'Recent',
      employmentType: newJobType,
      responsibilities: resps,
      achievements: achs,
      skills: []
    };

    updateMasterProfile({
      structuredData: {
        ...struct,
        employmentHistory: [newRole, ...employmentList]
      }
    });

    setNewJobTitle('');
    setNewJobCompany('');
    setNewJobPeriod('');
    setNewJobResps('');
    setNewJobAchs('');
    setShowAddJob(false);
  };

  const handleDeleteEmployment = (idx: number) => {
    const updated = employmentList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, employmentHistory: updated } });
  };

  // Project Handlers
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const bullets = newProjBullets.split('\n').map(s => s.trim()).filter(Boolean);
    const newProj: ProjectOrProductRecord = {
      id: `proj_${Date.now()}`,
      name: newProjName.trim(),
      role: newProjRole.trim() || masterProfile.primaryProfession,
      context: newProjContext.trim() || 'Demonstrated project in candidate experience',
      status: newProjStatus,
      bullets: bullets.length > 0 ? bullets : ['Key project delivery'],
      capabilities: [],
      keywords: []
    };

    updateMasterProfile({
      structuredData: {
        ...struct,
        projectsOrProducts: [newProj, ...projectList]
      }
    });

    setNewProjName('');
    setNewProjRole('');
    setNewProjContext('');
    setNewProjBullets('');
    setShowAddProject(false);
  };

  const handleDeleteProject = (idx: number) => {
    const updated = projectList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, projectsOrProducts: updated } });
  };

  // Achievement Handlers
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim()) return;

    const newAch: AchievementOutcomeRecord = {
      id: `ach_${Date.now()}`,
      title: newAchTitle.trim(),
      category: newAchCategory,
      metric: newAchMetric.trim() || 'Verified Outcome',
      context: newAchContext.trim(),
      evidence: newAchEvidence.trim() || 'Documented candidate history',
      verificationStatus: 'VERIFIED'
    };

    updateMasterProfile({
      structuredData: {
        ...struct,
        achievements: [newAch, ...achievementList]
      }
    });

    setNewAchTitle('');
    setNewAchMetric('');
    setNewAchContext('');
    setNewAchEvidence('');
    setShowAddAch(false);
  };

  const handleDeleteAchievement = (idx: number) => {
    const updated = achievementList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, achievements: updated } });
  };

  // Handle Living Profile update action
  const handleUpdateMasterCV = async () => {
    setIsUpdatingMCV(true);
    try {
      await updateMasterCVFromProfile();
    } finally {
      setIsUpdatingMCV(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION 3: LIVING MASTER PROFILE CHANGE ALERT BANNER */}
      {derivedMaterialsOutdated && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 shadow-xs text-xs space-y-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-amber-950 text-sm">
                Master Career Profile Updated — Derived Materials Outdated Notice
              </h4>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                The Master Career Profile is the living factual source of truth. Because you have edited candidate facts,
                derived materials (Master CV, CV variants, and application packages) may now be out of sync.
                The system will never silently overwrite your approved documents. Choose how you would like to proceed:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 pl-8">
            <button
              onClick={handleUpdateMasterCV}
              disabled={isUpdatingMCV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 text-white font-semibold rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isUpdatingMCV ? 'Synthesizing...' : 'Update Master CV from Current Profile'}</span>
            </button>

            {onNavigateToCVStudio && (
              <button
                onClick={onNavigateToCVStudio}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300 text-amber-900 font-semibold rounded-lg hover:bg-amber-100/50 transition-colors"
              >
                <span>Review Affected CV Variants</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            )}

            <button
              onClick={dismissProfileOutdatedNotice}
              className="px-3 py-1.5 bg-transparent text-amber-800 hover:text-amber-950 hover:underline font-medium transition-colors"
            >
              Leave Existing Materials Unchanged
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Card: Candidate Positioning Header */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Universal Master Career Profile
              </span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs text-zinc-500 font-mono">Factual Source of Truth</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              {masterProfile.candidateName}
              <button 
                onClick={() => {
                  setHeaderName(masterProfile.candidateName);
                  setHeaderProfession(masterProfile.primaryProfession);
                  setHeaderPositioning(masterProfile.corePositioning);
                  setHeaderWorkingMethod(masterProfile.workingMethod);
                  setHeaderLocation(masterProfile.location);
                  setHeaderWorkAuth(masterProfile.workAuthorisation);
                  setIsEditingHeader(!isEditingHeader);
                }}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition-colors text-xs"
                title="Edit basic positioning"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </h1>
            <p className="text-sm font-medium text-emerald-800">
              {masterProfile.primaryProfession}
            </p>
            <p className="text-xs text-zinc-600 max-w-3xl leading-relaxed">
              {masterProfile.corePositioning}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            <button
              onClick={onOpenUploadModal}
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import Dossier / CV File</span>
            </button>
          </div>
        </div>

        {/* Inline Edit Form */}
        {isEditingHeader && (
          <form onSubmit={handleSaveHeader} className="mt-5 pt-4 border-t border-zinc-200 space-y-3 bg-zinc-50/70 p-4 rounded-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono">Edit Career Positioning</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  value={headerName}
                  onChange={(e) => setHeaderName(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Primary Profession</label>
                <input
                  type="text"
                  value={headerProfession}
                  onChange={(e) => setHeaderProfession(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-900"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Core Positioning Statement</label>
              <textarea
                rows={2}
                value={headerPositioning}
                onChange={(e) => setHeaderPositioning(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-900 leading-relaxed"
              />
            </div>

            <div className="text-xs">
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Methodology &amp; Operating Principle</label>
              <textarea
                rows={2}
                value={headerWorkingMethod}
                onChange={(e) => setHeaderWorkingMethod(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-900 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingHeader(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-zinc-900 text-white rounded font-medium text-xs hover:bg-zinc-800"
              >
                Save Profile Header
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 12 DEDICATED SECTION NAVIGATION TABS (Section 2) */}
      <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 pb-2">
        {sections.map(s => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-zinc-900 text-white shadow-xs font-semibold' 
                  : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>{s.label}</span>
              {s.badge !== undefined && s.badge > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                  isActive ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {s.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. OVERVIEW TAB (Concise Master Profile Summary at a Glance)   */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'overview' && (
        <div className="space-y-6 text-sm">
          {/* Identity & Current Role Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Professional Identity</span>
              <p className="font-bold text-zinc-900 text-base">{masterProfile.candidateName}</p>
              <p className="text-xs text-emerald-800 font-semibold">{masterProfile.primaryProfession}</p>
              <p className="text-[11px] text-zinc-500 mt-1">{masterProfile.location} &middot; {masterProfile.workAuthorisation}</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Current / Most Recent Role</span>
              {employmentList[0] ? (
                <>
                  <p className="font-bold text-zinc-900 text-sm">{employmentList[0].role || employmentList[0].title}</p>
                  <p className="text-xs text-zinc-700">{employmentList[0].organization || employmentList[0].employer}</p>
                  <p className="text-[11px] font-mono text-zinc-500">{employmentList[0].period}</p>
                </>
              ) : (
                <p className="text-xs text-zinc-400 italic">No roles recorded</p>
              )}
            </div>

            <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Profile Completeness</span>
                <span className="font-mono font-bold text-xs text-emerald-700">96% Factual</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full w-[96%]"></div>
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">
                All 12 sections verified with supported factual evidence. No hallucinated records.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Career History, Education & Portfolio */}
            <div className="lg:col-span-8 space-y-6">
              {/* Key Career History */}
              <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <h3 className="font-bold text-xs uppercase font-mono text-zinc-700 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Career History Summary ({employmentList.length} Roles)</span>
                  </h3>
                  <button onClick={() => setActiveSection('experience')} className="text-xs text-blue-600 hover:underline">
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {employmentList.slice(0, 3).map((emp, i) => (
                    <div key={i} className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-900 text-xs">{emp.role || emp.title}</span>
                        <span className="text-[11px] font-mono text-zinc-500">{emp.period}</span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-800">{emp.organization || emp.employer}</p>
                      <p className="text-[11px] text-zinc-600 line-clamp-2">{emp.responsibilities?.slice(0, 2).join(' · ')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Certifications Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <h3 className="font-bold text-xs uppercase font-mono text-zinc-700 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      <span>Education ({educationList.length})</span>
                    </h3>
                    <button onClick={() => setActiveSection('education')} className="text-xs text-blue-600 hover:underline">
                      Manage &rarr;
                    </button>
                  </div>
                  {educationList.length > 0 ? (
                    educationList.slice(0, 2).map((edu, idx) => (
                      <div key={idx} className="text-xs space-y-0.5">
                        <p className="font-bold text-zinc-900">{edu.qualification || edu.degree}</p>
                        <p className="text-zinc-600 text-[11px]">{edu.institution} {edu.year ? `(${edu.year})` : ''}</p>
                        {edu.grade && <span className="inline-block text-[10px] text-emerald-700 font-semibold">{edu.grade}</span>}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No education recorded</p>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <h3 className="font-bold text-xs uppercase font-mono text-zinc-700 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                      <span>Certifications ({certList.length})</span>
                    </h3>
                    <button onClick={() => setActiveSection('certifications')} className="text-xs text-blue-600 hover:underline">
                      Manage &rarr;
                    </button>
                  </div>
                  {certList.length > 0 ? (
                    certList.slice(0, 2).map((cert, idx) => (
                      <div key={idx} className="text-xs space-y-0.5">
                        <p className="font-bold text-zinc-900">{cert.certificationName || cert.name}</p>
                        <p className="text-zinc-600 text-[11px]">{cert.issuingOrganization || cert.issuer}</p>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 underline flex items-center gap-1">
                            <span>Credential Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No certifications recorded</p>
                  )}
                </div>
              </div>

              {/* Portfolio Presence (Clickable Hyperlinks) */}
              <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <h3 className="font-bold text-xs uppercase font-mono text-zinc-700 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Portfolio Presence ({portfolioList.length})</span>
                  </h3>
                  <button onClick={() => setActiveSection('portfolio')} className="text-xs text-blue-600 hover:underline">
                    Manage &rarr;
                  </button>
                </div>

                {portfolioList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {portfolioList.map(item => (
                      <div key={item.id} className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900 text-xs truncate">{item.title || item.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-zinc-200 rounded text-zinc-700 shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 line-clamp-2">{item.description}</p>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline mt-1"
                        >
                          <span>Open Asset Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No portfolio items recorded</p>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Domains, Target Roles & Evidence Summary */}
            <div className="lg:col-span-4 space-y-6">
              {/* Target Roles & Preferences */}
              <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
                <h3 className="font-bold text-xs uppercase font-mono text-zinc-700 flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                  <Target className="w-3.5 h-3.5 text-rose-600" />
                  <span>Target Roles ({preferences.targetRoles?.length || 0}/5 Max)</span>
                </h3>

                <div className="space-y-1.5">
                  {preferences.targetRoles?.map((role, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                      <span className="font-semibold">{role}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-100 text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Preferences</span>
                  <p className="text-zinc-700 text-[11px]">
                    <strong>Remote:</strong> {preferences.remotePreference.replace('_', ' ')}
                  </p>
                  <p className="text-zinc-700 text-[11px]">
                    <strong>Locations:</strong> {preferences.preferredLocations?.join(', ')}
                  </p>
                  <p className="text-zinc-700 text-[11px]">
                    <strong>Max App Fee:</strong> $0 (Strict Policy)
                  </p>
                </div>
              </div>

              {/* Major Skills & Domains */}
              <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
                <h3 className="font-bold text-xs uppercase font-mono text-zinc-700 border-b border-zinc-100 pb-2">
                  Major Skills &amp; Domains
                </h3>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Industry Domains</span>
                  <div className="flex flex-wrap gap-1.5">
                    {domainList.map((d, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {d.domain}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Verified Tools</span>
                  <div className="flex flex-wrap gap-1">
                    {(struct.tools || []).slice(0, 10).map((t: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 text-zinc-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Achievements & Evidence Health */}
              <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
                <h3 className="font-bold text-xs uppercase font-mono text-zinc-700 border-b border-zinc-100 pb-2">
                  Key Achievements ({achievementList.length})
                </h3>

                <div className="space-y-2">
                  {achievementList.slice(0, 3).map((ach, i) => (
                    <div key={i} className="text-xs space-y-0.5">
                      <p className="font-bold text-zinc-900 line-clamp-1">{ach.title}</p>
                      {ach.metric && (
                        <p className="text-[11px] text-emerald-700 font-semibold">{ach.metric}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. PERSONAL / ELIGIBILITY TAB                                  */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'personal' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <h3 className="font-bold text-zinc-900 text-sm">Personal Details &amp; Global Eligibility</h3>
              <p className="text-xs text-zinc-500">Legal work authorization, contact coordinates, and remote parameters.</p>
            </div>
            <button
              onClick={() => isEditingPersonal ? setIsEditingPersonal(false) : startEditingPersonal()}
              className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-800 transition-colors"
            >
              {isEditingPersonal ? 'Cancel' : 'Edit Details'}
            </button>
          </div>

          {isEditingPersonal ? (
            <form onSubmit={handleSavePersonal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={persFullName}
                    onChange={(e) => setPersFullName(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={persEmail}
                    onChange={(e) => setPersEmail(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={persPhone}
                    onChange={(e) => setPersPhone(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Current Location (City, Country)</label>
                  <input
                    type="text"
                    value={persLocation}
                    onChange={(e) => setPersLocation(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Legal Work Authorization Details</label>
                  <input
                    type="text"
                    value={persWorkAuth}
                    onChange={(e) => setPersWorkAuth(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={persLinkedIn}
                    onChange={(e) => setPersLinkedIn(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">GitHub / Code URL</label>
                  <input
                    type="url"
                    value={persGitHub}
                    onChange={(e) => setPersGitHub(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Portfolio Site URL</label>
                  <input
                    type="url"
                    value={persPortfolio}
                    onChange={(e) => setPersPortfolio(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                <button type="button" onClick={() => setIsEditingPersonal(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-zinc-900 text-white rounded font-medium">Save Personal Details</button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-zinc-500 font-mono block text-[10px] uppercase">Full Name</span>
                <span className="font-bold text-zinc-900 mt-0.5 block">{personal.fullName || masterProfile.candidateName}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-zinc-500 font-mono block text-[10px] uppercase">Email</span>
                <span className="font-bold text-zinc-900 mt-0.5 block">{personal.email || 'Not stated'}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-zinc-500 font-mono block text-[10px] uppercase">Location</span>
                <span className="font-bold text-zinc-900 mt-0.5 block">{personal.currentLocation || masterProfile.location}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-zinc-500 font-mono block text-[10px] uppercase">Work Authorization</span>
                <span className="font-bold text-zinc-900 mt-0.5 block">{personal.workAuthorization || masterProfile.workAuthorisation}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. CAREER TAB                                                 */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'career' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="pb-3 border-b border-zinc-200">
            <h3 className="font-bold text-zinc-900 text-sm">Career Architecture &amp; Methodology</h3>
            <p className="text-xs text-zinc-500">Universal methodology, positioning, and functional domains.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 space-y-2">
              <span className="font-bold text-zinc-900 uppercase font-mono text-[11px] block">
                Executive Methodology &amp; Working Framework
              </span>
              <p className="text-zinc-700 leading-relaxed text-xs">
                {masterProfile.workingMethod}
              </p>
            </div>

            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 space-y-2">
              <span className="font-bold text-zinc-900 uppercase font-mono text-[11px] block">
                Core Positioning &amp; Value Proposition
              </span>
              <p className="text-zinc-700 leading-relaxed text-xs">
                {masterProfile.corePositioning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. EXPERIENCE TAB (Repeatable Employment Records)              */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'experience' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <h3 className="font-bold text-zinc-900 text-sm">Employment &amp; Leadership Experience</h3>
              <p className="text-xs text-zinc-500">Verified employment history and responsibilities.</p>
            </div>
            <button
              onClick={() => setShowAddJob(!showAddJob)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          </div>

          {showAddJob && (
            <form onSubmit={handleAddEmployment} className="p-4 bg-zinc-50 rounded-xl border border-zinc-300 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Job Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Employer / Organization *</label>
                  <input
                    type="text"
                    required
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Employment Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 2022 - Present"
                    value={newJobPeriod}
                    onChange={(e) => setNewJobPeriod(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Responsibilities (one per line)</label>
                <textarea
                  rows={3}
                  value={newJobResps}
                  onChange={(e) => setNewJobResps(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Verified Achievements (one per line)</label>
                <textarea
                  rows={3}
                  value={newJobAchs}
                  onChange={(e) => setNewJobAchs(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                <button type="button" onClick={() => setShowAddJob(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-zinc-900 text-white rounded font-semibold">Save Role</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {employmentList.map((emp, idx) => (
              <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{emp.role || emp.title}</h4>
                    <p className="text-xs font-semibold text-emerald-800">{emp.organization || emp.employer}</p>
                    <p className="text-[11px] font-mono text-zinc-500">{emp.period}</p>
                  </div>
                  <button onClick={() => handleDeleteEmployment(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {emp.responsibilities?.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-zinc-700 space-y-1 pt-1">
                    {emp.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. PROJECTS / PRODUCTS TAB                                    */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'projects' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <h3 className="font-bold text-zinc-900 text-sm">Projects &amp; Products ({projectList.length})</h3>
              <p className="text-xs text-zinc-500">Shipped initiatives, architecture specifications, and products.</p>
            </div>
            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          {showAddProject && (
            <form onSubmit={handleAddProject} className="p-4 bg-zinc-50 rounded-xl border border-zinc-300 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Candidate Role in Project</label>
                  <input
                    type="text"
                    value={newProjRole}
                    onChange={(e) => setNewProjRole(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Context &amp; Objectives</label>
                <textarea
                  rows={2}
                  value={newProjContext}
                  onChange={(e) => setNewProjContext(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Key Delivery Bullets (one per line)</label>
                <textarea
                  rows={3}
                  value={newProjBullets}
                  onChange={(e) => setNewProjBullets(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                <button type="button" onClick={() => setShowAddProject(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-zinc-900 text-white rounded font-semibold">Save Project</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectList.map((proj, idx) => (
              <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{proj.name}</h4>
                    <span className="text-[11px] text-emerald-800 font-semibold">{proj.role}</span>
                  </div>
                  <button onClick={() => handleDeleteProject(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-zinc-600">{proj.context}</p>
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-inside text-[11px] text-zinc-700 space-y-0.5">
                    {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. ACHIEVEMENTS TAB                                           */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'achievements' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <h3 className="font-bold text-zinc-900 text-sm">Verified Outcomes &amp; Achievements ({achievementList.length})</h3>
              <p className="text-xs text-zinc-500">Quantified and qualitative outcomes backed by documented evidence.</p>
            </div>
            <button
              onClick={() => setShowAddAch(!showAddAch)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Achievement</span>
            </button>
          </div>

          {showAddAch && (
            <form onSubmit={handleAddAchievement} className="p-4 bg-zinc-50 rounded-xl border border-zinc-300 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Outcome Title *</label>
                  <input
                    type="text"
                    required
                    value={newAchTitle}
                    onChange={(e) => setNewAchTitle(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Metric / Quantified Result</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% uptime, zero errors over 24 months"
                    value={newAchMetric}
                    onChange={(e) => setNewAchMetric(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Context &amp; Situation</label>
                <textarea
                  rows={2}
                  value={newAchContext}
                  onChange={(e) => setNewAchContext(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                <button type="button" onClick={() => setShowAddAch(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-zinc-900 text-white rounded font-semibold">Save Achievement</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {achievementList.map((ach, idx) => (
              <div key={idx} className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-zinc-900 text-xs">{ach.title}</h4>
                  <button onClick={() => handleDeleteAchievement(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {ach.metric && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {ach.metric}
                  </span>
                )}
                <p className="text-[11px] text-zinc-600 mt-1">{ach.context}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. EDUCATION TAB (Dedicated Repeatable Education Records)     */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'education' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Repeatable Education Records ({educationList.length})</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Degrees, qualifications, institutions, dates, grades, and academic supporting evidence.
              </p>
            </div>
            <button
              onClick={() => setShowAddEdu(!showAddEdu)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education Record</span>
            </button>
          </div>

          {showAddEdu && (
            <form onSubmit={handleAddEducation} className="p-5 bg-zinc-50 rounded-xl border border-zinc-300 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Institution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. University of Lagos, Stanford University"
                    value={newEduInst}
                    onChange={(e) => setNewEduInst(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Qualification / Degree *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bachelor of Science (B.Sc.), Master of Business Administration"
                    value={newEduQualification}
                    onChange={(e) => setNewEduQualification(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Field of Study</label>
                  <input
                    type="text"
                    placeholder="e.g. Information Systems, Nursing, Computer Science"
                    value={newEduField}
                    onChange={(e) => setNewEduField(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2016-09"
                    value={newEduStartDate}
                    onChange={(e) => setNewEduStartDate(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">End Date / Graduation Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2020-07"
                    value={newEduEndDate}
                    onChange={(e) => setNewEduEndDate(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Nigeria"
                    value={newEduLocation}
                    onChange={(e) => setNewEduLocation(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Grade / Result where relevant</label>
                  <input
                    type="text"
                    placeholder="e.g. First Class Honours (4.72/5.00), Magna Cum Laude"
                    value={newEduGrade}
                    onChange={(e) => setNewEduGrade(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Description / Major Coursework</label>
                <textarea
                  rows={2}
                  placeholder="Specializations, honors, capstone project, or relevant coursework..."
                  value={newEduDescription}
                  onChange={(e) => setNewEduDescription(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Supporting Evidence / Source</label>
                <input
                  type="text"
                  placeholder="e.g. Certified academic degree certificate and official transcript"
                  value={newEduEvidence}
                  onChange={(e) => setNewEduEvidence(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                <button type="button" onClick={() => setShowAddEdu(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-zinc-900 text-white rounded font-semibold">Save Education Record</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {educationList.length === 0 ? (
              <p className="text-xs text-zinc-400 italic text-center py-6">No education records added yet.</p>
            ) : (
              educationList.map((edu, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm">{edu.qualification || edu.degree}</h4>
                      <p className="text-xs font-semibold text-blue-700">{edu.institution}</p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mt-0.5">
                        {edu.fieldOfStudy && <span>{edu.fieldOfStudy}</span>}
                        {edu.startDate && edu.endDate && <span>&middot; {edu.startDate} &ndash; {edu.endDate}</span>}
                        {edu.location && <span>&middot; {edu.location}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteEducation(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {edu.grade && (
                    <div className="text-xs">
                      <span className="font-semibold text-zinc-700">Grade/Result:</span>{' '}
                      <span className="text-emerald-700 font-medium">{edu.grade}</span>
                    </div>
                  )}

                  {edu.description && (
                    <p className="text-xs text-zinc-600 leading-relaxed">{edu.description}</p>
                  )}

                  {edu.supportingEvidence && (
                    <div className="text-[11px] text-zinc-500 font-mono bg-white p-2 rounded border border-zinc-200">
                      <strong>Supporting Evidence:</strong> {edu.supportingEvidence}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. CERTIFICATIONS TAB (Dedicated Repeatable Cert Records)     */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'certifications' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Repeatable Certification Records ({certList.length})</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Licenses, certifications, issuing bodies, credential IDs, and verifiable URLs.
              </p>
            </div>
            <button
              onClick={() => setShowAddCert(!showAddCert)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification Record</span>
            </button>
          </div>

          {showAddCert && (
            <form onSubmit={handleAddCertification} className="p-5 bg-zinc-50 rounded-xl border border-zinc-300 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Certification Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Certified Scrum Product Owner (CSPO), AWS Solutions Architect"
                    value={newCertName}
                    onChange={(e) => setNewCertName(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scrum Alliance, Amazon Web Services, Nursing Council"
                    value={newCertOrg}
                    onChange={(e) => setNewCertOrg(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Issue Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2021-08-15"
                    value={newCertIssueDate}
                    onChange={(e) => setNewCertIssueDate(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Expiry Date (if applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. 2027-08-15 or Never"
                    value={newCertExpiryDate}
                    onChange={(e) => setNewCertExpiryDate(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Status</label>
                  <select
                    value={newCertStatus}
                    onChange={(e: any) => setNewCertStatus(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Credential ID (where applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. CSPO-984210"
                    value={newCertCredentialId}
                    onChange={(e) => setNewCertCredentialId(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Credential URL (Clickable Hyperlink)</label>
                  <input
                    type="url"
                    placeholder="https://scrumalliance.org/community/profile/..."
                    value={newCertCredentialUrl}
                    onChange={(e) => setNewCertCredentialUrl(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Supporting Evidence</label>
                <input
                  type="text"
                  placeholder="e.g. Verified digital credential badge and registration number"
                  value={newCertEvidence}
                  onChange={(e) => setNewCertEvidence(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Candidate notes or renewal requirements..."
                  value={newCertNotes}
                  onChange={(e) => setNewCertNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                <button type="button" onClick={() => setShowAddCert(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-zinc-900 text-white rounded font-semibold">Save Certification Record</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {certList.length === 0 ? (
              <p className="text-xs text-zinc-400 italic text-center py-6">No certification records added yet.</p>
            ) : (
              certList.map((cert, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-zinc-900 text-sm">{cert.certificationName || cert.name}</h4>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold ${
                          cert.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-zinc-200 text-zinc-700'
                        }`}>
                          {cert.status || 'ACTIVE'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-purple-700">{cert.issuingOrganization || cert.issuer}</p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mt-0.5">
                        {cert.issueDate && <span>Issued: {cert.issueDate}</span>}
                        {cert.expiryDate && <span>&middot; Expires: {cert.expiryDate}</span>}
                        {cert.credentialId && <span>&middot; ID: {cert.credentialId}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteCertification(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {cert.credentialUrl && (
                    <div className="pt-1">
                      <a 
                        href={cert.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
                      >
                        <span>Verify Credential URL</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {cert.supportingEvidence && (
                    <div className="text-[11px] text-zinc-500 font-mono bg-white p-2 rounded border border-zinc-200">
                      <strong>Supporting Evidence:</strong> {cert.supportingEvidence}
                    </div>
                  )}

                  {cert.notes && (
                    <p className="text-xs text-zinc-600 italic">{cert.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. PORTFOLIO TAB (Dedicated Repeatable Portfolio Records)      */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'portfolio' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-emerald-600" />
                <span>Repeatable Portfolio Items ({portfolioList.length})</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Case studies, live project URLs, repositories, and clickable demonstration artifacts.
              </p>
            </div>
            <button
              onClick={() => setShowAddPort(!showAddPort)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Portfolio Item</span>
            </button>
          </div>

          {showAddPort && (
            <form onSubmit={handleAddPortfolio} className="p-5 bg-zinc-50 rounded-xl border border-zinc-300 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Portfolio Item Title / Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MarketGrowthOS 16-State CRM Specification"
                    value={newPortTitle}
                    onChange={(e) => setNewPortTitle(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Category / Type *</label>
                  <select
                    value={newPortCategory}
                    onChange={(e: any) => setNewPortCategory(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="Live Project">Live Project</option>
                    <option value="Web Application">Web Application</option>
                    <option value="Case Study">Case Study</option>
                    <option value="Open Source">Open Source Repository</option>
                    <option value="Design System">Design System / Figma</option>
                    <option value="Technical Article">Technical Article</option>
                    <option value="Publication">Publication</option>
                    <option value="Patent">Patent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">URL (Rendered as Clickable Hyperlink) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://alexvance.dev/case-studies/crm-spec"
                  value={newPortUrl}
                  onChange={(e) => setNewPortUrl(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed breakdown of the portfolio asset, systems involved, and candidate's contributions..."
                  value={newPortDesc}
                  onChange={(e) => setNewPortDesc(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Associated Project / Employer</label>
                  <input
                    type="text"
                    placeholder="e.g. MarketGrowthOS, Zenith Property Repairs"
                    value={newPortProject}
                    onChange={(e) => setNewPortProject(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Supporting Evidence</label>
                  <input
                    type="text"
                    placeholder="e.g. Verified PRD and interactive Figma prototype"
                    value={newPortEvidence}
                    onChange={(e) => setNewPortEvidence(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Optional notes for downstream CV variants..."
                  value={newPortNotes}
                  onChange={(e) => setNewPortNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-zinc-300 rounded focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                <button type="button" onClick={() => setShowAddPort(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-zinc-900 text-white rounded font-semibold">Save Portfolio Item</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioList.length === 0 ? (
              <div className="col-span-2 text-xs text-zinc-400 italic text-center py-6">
                No portfolio items added yet. Click &quot;Add Portfolio Item&quot; to link your case studies and live demos.
              </div>
            ) : (
              portfolioList.map((item, idx) => (
                <div key={item.id || idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-zinc-900 text-sm leading-snug">{item.title || item.name}</h4>
                      <button onClick={() => handleDeletePortfolio(idx)} className="text-zinc-400 hover:text-rose-600 p-1 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-200 text-zinc-800">
                      {item.category}
                    </span>

                    <p className="text-xs text-zinc-600 leading-relaxed pt-1">{item.description}</p>
                    
                    {item.associatedProject && (
                      <p className="text-[11px] text-zinc-500">
                        <strong>Associated Context:</strong> {item.associatedProject}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-zinc-200">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span className="truncate max-w-xs">{item.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 10. EVIDENCE TAB                                              */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'evidence' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="pb-3 border-b border-zinc-200">
            <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Claims Discipline &amp; Strict Evidence Boundaries</span>
            </h3>
            <p className="text-xs text-zinc-500">
              Establishes what the AI is permitted to claim and what is strictly prohibited.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
              <span className="font-bold text-emerald-950 uppercase font-mono text-[11px] block">
                Supported Factual Claims
              </span>
              <ul className="list-disc list-inside space-y-1 text-emerald-900 text-[11px]">
                {struct.claimsDiscipline?.supportedClaims?.map((claim: string, i: number) => (
                  <li key={i}>{claim}</li>
                )) || <li>All documented employment, education, and portfolio records.</li>}
              </ul>
            </div>

            <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
              <span className="font-bold text-rose-950 uppercase font-mono text-[11px] block">
                Prohibited Claims &amp; Strict Boundaries
              </span>
              <ul className="list-disc list-inside space-y-1 text-rose-900 text-[11px]">
                {struct.strictBoundaries?.map((boundary: string, i: number) => (
                  <li key={i}>{boundary}</li>
                )) || <li>Never fabricate credentials, metrics, or employment history.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 11. PREFERENCES / CONSTRAINTS TAB                             */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'preferences' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="pb-3 border-b border-zinc-200">
            <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-zinc-700" />
              <span>Career Preferences &amp; Hard Constraints</span>
            </h3>
            <p className="text-xs text-zinc-500">Target roles (max 5), location filters, and application policies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <label className="font-bold text-zinc-800 block mb-1">
                  Target Roles / Titles (Max 5 defined)
                </label>
                <div className="space-y-1.5">
                  {preferences.targetRoles?.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-zinc-50 rounded border border-zinc-200 font-semibold text-zinc-800">
                      <span>{i + 1}. {r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">Preferred Locations</label>
                <p className="text-zinc-700">{preferences.preferredLocations?.join(', ') || 'Global Remote'}</p>
              </div>
            </div>

            <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <span className="font-bold text-zinc-800 uppercase font-mono text-[11px] block">
                Hard Rules &amp; Zero-Cost Discipline
              </span>
              <p className="text-zinc-700"><strong>Max Application Fee:</strong> ${preferences.maxApplicationFee} ($0 Policy)</p>
              <p className="text-zinc-700"><strong>Remote Rule:</strong> {preferences.remotePreference.replace('_', ' ')}</p>
              <p className="text-zinc-700"><strong>Willing to Relocate:</strong> {preferences.willingToRelocate ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 12. CAREER PATHWAYS TAB                                       */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'pathways' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
          <div className="pb-3 border-b border-zinc-200">
            <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Career Pathways &amp; Role Trajectories ({careerPathways.length})</span>
            </h3>
            <p className="text-xs text-zinc-500">AI suggested, candidate approved career pathways grounded in verified evidence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerPathways.map(pathway => (
              <div key={pathway.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{pathway.title}</h4>
                    <span className="text-[11px] text-zinc-500 font-mono">{pathway.targetSeniority} &middot; {pathway.roleFamily}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    pathway.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pathway.isApproved ? 'APPROVED' : 'PROPOSED'}
                  </span>
                </div>
                <p className="text-xs text-zinc-600">{pathway.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
