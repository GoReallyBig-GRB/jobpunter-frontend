import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  MasterProfile, 
  EmploymentRecord, 
  ProjectOrProductRecord, 
  EducationRecord, 
  CertificationRecord,
  CurrentWorkRecord,
  ChallengeSolutionRecord,
  AchievementOutcomeRecord,
  IndustryDomainRecord,
  LeadershipOwnershipRecord,
  CandidatePersonalDetails
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
  AlertCircle,
  FileText,
  Mail,
  Phone,
  Link as LinkIcon,
  HelpCircle,
  Flag,
  Target
} from 'lucide-react';
import { EmptyProfileState } from './EmptyProfileState';

export type ProfileSection = 
  | 'overview' 
  | 'personal' 
  | 'career_identity'
  | 'employment' 
  | 'current_work' 
  | 'projects' 
  | 'achievements' 
  | 'challenges' 
  | 'leadership' 
  | 'skills_tools' 
  | 'claims_discipline';

interface MasterCareerProfileViewProps {
  onOpenUploadModal: () => void;
}

export const MasterCareerProfileView: React.FC<MasterCareerProfileViewProps> = ({
  onOpenUploadModal
}) => {
  const { 
    masterProfile, 
    updateMasterProfile, 
    preferences, 
    updatePreferences, 
    activePresetId 
  } = useJobs();

  const [activeSection, setActiveSection] = useState<ProfileSection>('overview');
  const [isEditingHeader, setIsEditingHeader] = useState(false);

  // Profile Header Edit State
  const [headerName, setHeaderName] = useState(masterProfile?.candidateName || '');
  const [headerProfession, setHeaderProfession] = useState(masterProfile?.primaryProfession || '');
  const [headerPositioning, setHeaderPositioning] = useState(masterProfile?.corePositioning || '');
  const [headerWorkingMethod, setHeaderWorkingMethod] = useState(masterProfile?.workingMethod || '');
  const [headerLocation, setHeaderLocation] = useState(masterProfile?.location || '');
  const [headerWorkAuth, setHeaderWorkAuth] = useState(masterProfile?.workAuthorisation || '');

  // Add Item States
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [newEduDegree, setNewEduDegree] = useState('');
  const [newEduInst, setNewEduInst] = useState('');
  const [newEduField, setNewEduField] = useState('');
  const [newEduDates, setNewEduDates] = useState('');
  const [newEduLocation, setNewEduLocation] = useState('');

  const [showAddCert, setShowAddCert] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertStatus, setNewCertStatus] = useState<'ACTIVE' | 'EXPIRED' | 'IN_PROGRESS'>('ACTIVE');

  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomainIndustry, setNewDomainIndustry] = useState('');
  const [newDomainName, setNewDomainName] = useState('');
  const [newDomainDepth, setNewDomainDepth] = useState<'DEEP' | 'MODERATE' | 'WORKING'>('DEEP');
  const [newDomainExposure, setNewDomainExposure] = useState<'DIRECT_OPERATIONAL' | 'ADJACENT' | 'COLLABORATIVE' | 'THEORETICAL'>('DIRECT_OPERATIONAL');
  const [newDomainEvidence, setNewDomainEvidence] = useState('');

  const [showAddJob, setShowAddJob] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobPeriod, setNewJobPeriod] = useState('');
  const [newJobType, setNewJobType] = useState<'FULL_TIME' | 'CONTRACT' | 'PART_TIME' | 'CONSULTING'>('FULL_TIME');
  const [newJobResps, setNewJobResps] = useState('');
  const [newJobAchs, setNewJobAchs] = useState('');

  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjRole, setNewProjRole] = useState('');
  const [newProjContext, setNewProjContext] = useState('');
  const [newProjStatus, setNewProjStatus] = useState('Live');
  const [newProjBullets, setNewProjBullets] = useState('');

  const [showAddAch, setShowAddAch] = useState(false);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchCategory, setNewAchCategory] = useState<'QUANTIFIED' | 'QUALITATIVE' | 'BUSINESS' | 'OPERATIONAL' | 'CUSTOMER_USER' | 'EFFICIENCY' | 'AWARD_RECOGNITION' | 'OTHER'>('QUANTIFIED');
  const [newAchMetric, setNewAchMetric] = useState('');
  const [newAchContext, setNewAchContext] = useState('');
  const [newAchEvidence, setNewAchEvidence] = useState('');

  const [showAddChallenge, setShowAddChallenge] = useState(false);
  const [newChalProblem, setNewChalProblem] = useState('');
  const [newChalContext, setNewChalContext] = useState('');
  const [newChalDecision, setNewChalDecision] = useState('');
  const [newChalSolution, setNewChalSolution] = useState('');
  const [newChalTradeoff, setNewChalTradeoff] = useState('');
  const [newChalResult, setNewChalResult] = useState('');
  const [newChalEvidence, setNewChalEvidence] = useState('');
  const [newChalMeasurement, setNewChalMeasurement] = useState<'MEASURED' | 'NOT_MEASURED' | 'UNKNOWN' | 'REQUIRES_VERIFICATION'>('MEASURED');

  const [showAddLeadership, setShowAddLeadership] = useState(false);
  const [newLeadTitle, setNewLeadTitle] = useState('');
  const [newLeadType, setNewLeadType] = useState<LeadershipOwnershipRecord['ownershipType']>('TEAM_LEADERSHIP');
  const [newLeadDesc, setNewLeadDesc] = useState('');
  const [newLeadEvidence, setNewLeadEvidence] = useState('');

  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillItems, setNewSkillItems] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newBoundary, setNewBoundary] = useState('');
  const [newSupportedClaim, setNewSupportedClaim] = useState('');

  // Personal Details Edit State
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [persFullName, setPersFullName] = useState('');
  const [persEmail, setPersEmail] = useState('');
  const [persPhone, setPersPhone] = useState('');
  const [persLocation, setPersLocation] = useState('');
  const [persWorkAuth, setPersWorkAuth] = useState('');
  const [persRemotePref, setPersRemotePref] = useState<'REMOTE_ONLY' | 'REMOTE_OK' | 'HYBRID_OK' | 'ONSITE_OK'>('REMOTE_ONLY');
  const [persReloc, setPersReloc] = useState(false);
  const [persEligibleCountries, setPersEligibleCountries] = useState('');
  const [persLanguages, setPersLanguages] = useState('');
  const [persCredentials, setPersCredentials] = useState('');
  const [persLinkedIn, setPersLinkedIn] = useState('');
  const [persGitHub, setPersGitHub] = useState('');
  const [persPortfolio, setPersPortfolio] = useState('');

  // Extended Experience / Job State
  const [newJobUsers, setNewJobUsers] = useState('');
  const [newJobStakeholders, setNewJobStakeholders] = useState('');
  const [newJobLeadership, setNewJobLeadership] = useState('');
  const [newJobTools, setNewJobTools] = useState('');
  const [newJobProjects, setNewJobProjects] = useState('');

  // Extended Project State
  const [newProjProblem, setNewProjProblem] = useState('');
  const [newProjUsers, setNewProjUsers] = useState('');
  const [newProjDecisions, setNewProjDecisions] = useState('');
  const [newProjConstraints, setNewProjConstraints] = useState('');
  const [newProjChallenges, setNewProjChallenges] = useState('');
  const [newProjSolutions, setNewProjSolutions] = useState('');
  const [newProjTools, setNewProjTools] = useState('');
  const [newProjOutcomes, setNewProjOutcomes] = useState('');
  const [newProjLifecycle, setNewProjLifecycle] = useState<'LIVE_SHIPPED' | 'TESTING' | 'PROTOTYPE' | 'IN_DEVELOPMENT' | 'DISCONTINUED'>('LIVE_SHIPPED');
  const [newProjEvidence, setNewProjEvidence] = useState('');

  // Extended Achievement State
  const [newAchAction, setNewAchAction] = useState('');
  const [newAchOutcome, setNewAchOutcome] = useState('');
  const [newAchVerification, setNewAchVerification] = useState<'VERIFIED' | 'SELF_REPORTED' | 'DOCUMENTED_EVIDENCE' | 'REQUIRES_CONFIRMATION'>('VERIFIED');

  // Extended Challenge State
  const [newChalResp, setNewChalResp] = useState('');
  const [newChalAnalysis, setNewChalAnalysis] = useState('');

  // Extended Leadership State
  const [newLeadTeams, setNewLeadTeams] = useState('');
  const [newLeadStakeholders, setNewLeadStakeholders] = useState('');
  const [newLeadDecisions, setNewLeadDecisions] = useState('');
  const [newLeadCrossFunc, setNewLeadCrossFunc] = useState('');
  const [newLeadMentoring, setNewLeadMentoring] = useState('');
  const [newLeadDelivery, setNewLeadDelivery] = useState('');
  const [newLeadProduct, setNewLeadProduct] = useState('');
  const [newLeadEscalations, setNewLeadEscalations] = useState('');
  const [newLeadGovernance, setNewLeadGovernance] = useState('');

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
    setPersLanguages((personal.languages || [{ language: 'English', proficiency: 'Fluent' }]).map(l => typeof l === 'string' ? l : `${l.language} (${l.proficiency})`).join(', '));
    setPersCredentials((personal.professionalCredentials || []).join(', '));
    setPersLinkedIn(personal.linkedIn || '');
    setPersGitHub(personal.gitHub || '');
    setPersPortfolio(personal.portfolio || '');
    setIsEditingPersonal(true);
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPersonal: CandidatePersonalDetails = {
      ...personal,
      fullName: persFullName,
      email: persEmail,
      phone: persPhone,
      city: personal.city || '',
      country: personal.country || '',
      currentLocation: persLocation,
      workAuthorization: persWorkAuth,
      remotePreference: persRemotePref,
      relocationWillingness: persReloc,
      eligibleCountries: persEligibleCountries.split(',').map(s => s.trim()).filter(Boolean),
      languages: persLanguages.split(',').map(s => {
        const trimmed = s.trim();
        const match = trimmed.match(/^([^(]+)(?:\(([^)]+)\))?$/);
        return {
          language: match ? match[1].trim() : trimmed,
          proficiency: match && match[2] ? match[2].trim() : 'Fluent'
        };
      }).filter(l => l.language),
      professionalCredentials: persCredentials.split(',').map(s => s.trim()).filter(Boolean),
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

  const sections: { id: ProfileSection; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'personal', label: 'Personal & Eligibility', icon: Globe },
    { id: 'career_identity', label: 'Career Identity & Domains', icon: Compass },
    { id: 'employment', label: 'Employment History', icon: Briefcase },
    { id: 'current_work', label: 'Current Work', icon: Layers },
    { id: 'projects', label: 'Projects & Work', icon: Code },
    { id: 'achievements', label: 'Achievements & Outcomes', icon: CheckCircle2 },
    { id: 'challenges', label: 'Challenges & Solutions', icon: AlertCircle },
    { id: 'leadership', label: 'Leadership & Ownership', icon: Target },
    { id: 'skills_tools', label: 'Skills & Tools', icon: Sliders },
    { id: 'claims_discipline', label: 'Claims Discipline', icon: ShieldAlert }
  ];

  const struct = masterProfile.structuredData || {} as any;
  const personal = masterProfile.personalDetails || struct.personalDetails || {} as CandidatePersonalDetails;
  const educationList: EducationRecord[] = struct.education || [];
  const certList: CertificationRecord[] = struct.certifications || [];
  const domainList: IndustryDomainRecord[] = struct.industryDomains || [];
  const employmentList: EmploymentRecord[] = struct.employmentHistory || [];
  const currentWorkList: CurrentWorkRecord[] = struct.currentWork || [];
  const projectList: ProjectOrProductRecord[] = struct.projectsOrProducts || [];
  const achievementList: AchievementOutcomeRecord[] = struct.achievements || [];
  const challengeList: ChallengeSolutionRecord[] = struct.challengesSolutions || [];
  const leadershipList: LeadershipOwnershipRecord[] = Array.isArray(struct.leadershipOwnership) 
    ? struct.leadershipOwnership.map((item: any, i: number) => typeof item === 'string' ? { id: `lo_${i}`, title: item, ownershipType: 'TEAM_LEADERSHIP', description: item } : item)
    : [];

  // Handlers for Add Operations
  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduDegree || !newEduInst) return;
    const newRecord: EducationRecord = {
      id: `edu_${Date.now()}`,
      qualification: newEduDegree,
      degree: newEduDegree,
      institution: newEduInst,
      fieldOfStudy: newEduField,
      year: newEduDates,
      location: newEduLocation
    };
    updateMasterProfile({
      structuredData: {
        ...struct,
        education: [newRecord, ...educationList]
      }
    });
    setNewEduDegree('');
    setNewEduInst('');
    setNewEduField('');
    setNewEduDates('');
    setNewEduLocation('');
    setShowAddEdu(false);
  };

  const handleDeleteEducation = (idx: number) => {
    const updated = educationList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, education: updated } });
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName) return;
    const newCert: CertificationRecord = {
      id: `cert_${Date.now()}`,
      name: newCertName,
      issuingOrganization: newCertIssuer,
      dateObtained: newCertDate,
      status: newCertStatus
    };
    updateMasterProfile({
      structuredData: {
        ...struct,
        certifications: [newCert, ...certList]
      }
    });
    setNewCertName('');
    setNewCertIssuer('');
    setNewCertDate('');
    setShowAddCert(false);
  };

  const handleDeleteCertification = (idx: number) => {
    const updated = certList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, certifications: updated } });
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainIndustry || !newDomainName) return;
    const newRecord: IndustryDomainRecord = {
      id: `dom_${Date.now()}`,
      industry: newDomainIndustry,
      domain: newDomainName,
      depthOfExperience: newDomainDepth,
      exposureType: newDomainExposure,
      evidence: newDomainEvidence
    };
    updateMasterProfile({
      structuredData: {
        ...struct,
        industryDomains: [newRecord, ...domainList]
      }
    });
    setNewDomainIndustry('');
    setNewDomainName('');
    setNewDomainEvidence('');
    setShowAddDomain(false);
  };

  const handleDeleteDomain = (idx: number) => {
    const updated = domainList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, industryDomains: updated } });
  };

  const handleAddEmployment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCompany) return;
    const resps = newJobResps.split('\n').map(s => s.trim()).filter(Boolean);
    const achs = newJobAchs.split('\n').map(s => s.trim()).filter(Boolean);
    const newRole: EmploymentRecord = {
      id: `emp_${Date.now()}`,
      role: newJobTitle,
      title: newJobTitle,
      organization: newJobCompany,
      employer: newJobCompany,
      period: newJobPeriod || 'Recent',
      employmentType: newJobType,
      responsibilities: resps,
      achievements: achs,
      usersServed: newJobUsers || undefined,
      stakeholders: newJobStakeholders ? newJobStakeholders.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      teamOrLeadershipResponsibility: newJobLeadership || undefined,
      tools: newJobTools ? newJobTools.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      projects: newJobProjects ? newJobProjects.split(',').map(s => s.trim()).filter(Boolean) : undefined,
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
    setNewJobUsers('');
    setNewJobStakeholders('');
    setNewJobLeadership('');
    setNewJobTools('');
    setNewJobProjects('');
    setShowAddJob(false);
  };

  const handleDeleteEmployment = (idx: number) => {
    const updated = employmentList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, employmentHistory: updated } });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName) return;
    const bullets = newProjBullets.split('\n').map(s => s.trim()).filter(Boolean);
    const newProj: ProjectOrProductRecord = {
      id: `proj_${Date.now()}`,
      name: newProjName,
      role: newProjRole || 'Lead',
      context: newProjContext,
      status: newProjStatus,
      problemOrNeed: newProjProblem || undefined,
      usersOrStakeholders: newProjUsers || undefined,
      decisionsMade: newProjDecisions ? newProjDecisions.split('\n').map(s => s.trim()).filter(Boolean) : undefined,
      constraints: newProjConstraints ? newProjConstraints.split('\n').map(s => s.trim()).filter(Boolean) : undefined,
      challenges: newProjChallenges ? newProjChallenges.split('\n').map(s => s.trim()).filter(Boolean) : undefined,
      solutions: newProjSolutions ? newProjSolutions.split('\n').map(s => s.trim()).filter(Boolean) : undefined,
      technologiesTools: newProjTools ? newProjTools.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      outcomes: newProjOutcomes ? newProjOutcomes.split('\n').map(s => s.trim()).filter(Boolean) : undefined,
      lifecycleStatus: newProjLifecycle,
      evidenceSource: newProjEvidence || undefined,
      bullets,
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
    setNewProjProblem('');
    setNewProjUsers('');
    setNewProjDecisions('');
    setNewProjConstraints('');
    setNewProjChallenges('');
    setNewProjSolutions('');
    setNewProjTools('');
    setNewProjOutcomes('');
    setNewProjEvidence('');
    setShowAddProject(false);
  };

  const handleDeleteProject = (idx: number) => {
    const updated = projectList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, projectsOrProducts: updated } });
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle) return;
    const newAch: AchievementOutcomeRecord = {
      id: `ach_${Date.now()}`,
      title: newAchTitle,
      category: newAchCategory,
      metric: newAchMetric || 'Requires Verification',
      context: newAchContext,
      action: newAchAction || undefined,
      outcome: newAchOutcome || undefined,
      evidence: newAchEvidence || 'Candidate documented experience',
      verificationStatus: newAchVerification
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
    setNewAchAction('');
    setNewAchOutcome('');
    setShowAddAch(false);
  };

  const handleDeleteAchievement = (idx: number) => {
    const updated = achievementList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, achievements: updated } });
  };

  const handleAddChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChalProblem || !newChalSolution) return;
    const newChal: ChallengeSolutionRecord = {
      id: `cs_${Date.now()}`,
      challenge: newChalProblem,
      context: newChalContext,
      candidateResponsibility: newChalResp || undefined,
      analysis: newChalAnalysis || undefined,
      decisionOrAction: newChalDecision || newChalSolution,
      reasoning: newChalDecision,
      decision: newChalDecision || undefined,
      solution: newChalSolution,
      tradeoff: newChalTradeoff,
      result: newChalResult,
      evidence: newChalEvidence,
      measurementState: newChalMeasurement,
      constraints: [],
      optionsConsidered: []
    };
    updateMasterProfile({
      structuredData: {
        ...struct,
        challengesSolutions: [newChal, ...challengeList]
      }
    });
    setNewChalProblem('');
    setNewChalContext('');
    setNewChalDecision('');
    setNewChalSolution('');
    setNewChalTradeoff('');
    setNewChalResult('');
    setNewChalEvidence('');
    setNewChalResp('');
    setNewChalAnalysis('');
    setShowAddChallenge(false);
  };

  const handleDeleteChallenge = (idx: number) => {
    const updated = challengeList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, challengesSolutions: updated } });
  };

  const handleAddLeadership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadTitle) return;
    const newLead: LeadershipOwnershipRecord = {
      id: `lo_${Date.now()}`,
      title: newLeadTitle,
      ownershipType: newLeadType,
      teams: newLeadTeams || undefined,
      stakeholders: newLeadStakeholders || undefined,
      decisionOwnership: newLeadDecisions || undefined,
      crossFunctionalWork: newLeadCrossFunc || undefined,
      mentoringScope: newLeadMentoring || undefined,
      deliveryOwnership: newLeadDelivery || undefined,
      productOwnership: newLeadProduct || undefined,
      escalationHandling: newLeadEscalations || undefined,
      governanceScope: newLeadGovernance || undefined,
      description: newLeadDesc,
      evidence: newLeadEvidence
    };
    updateMasterProfile({
      structuredData: {
        ...struct,
        leadershipOwnership: [newLead, ...leadershipList]
      }
    });
    setNewLeadTitle('');
    setNewLeadDesc('');
    setNewLeadEvidence('');
    setNewLeadTeams('');
    setNewLeadStakeholders('');
    setNewLeadDecisions('');
    setNewLeadCrossFunc('');
    setNewLeadMentoring('');
    setNewLeadDelivery('');
    setNewLeadProduct('');
    setNewLeadEscalations('');
    setNewLeadGovernance('');
    setShowAddLeadership(false);
  };

  const handleDeleteLeadership = (idx: number) => {
    const updated = leadershipList.filter((_, i) => i !== idx);
    updateMasterProfile({ structuredData: { ...struct, leadershipOwnership: updated } });
  };

  const handleAddSkillGroup = () => {
    if (!newSkillCategory.trim() || !newSkillItems.trim()) return;
    const items = newSkillItems.split(',').map(s => s.trim()).filter(Boolean);
    const existing = struct.skills || [];
    updateMasterProfile({
      structuredData: {
        ...struct,
        skills: [...existing, { category: newSkillCategory.trim(), items }]
      }
    });
    setNewSkillCategory('');
    setNewSkillItems('');
  };

  const handleAddTool = () => {
    if (!newTool.trim()) return;
    const existing = struct.tools || [];
    updateMasterProfile({
      structuredData: {
        ...struct,
        tools: [...existing, newTool.trim()]
      }
    });
    setNewTool('');
  };

  const handleAddBoundary = () => {
    if (!newBoundary.trim()) return;
    const existing = struct.strictBoundaries || [];
    updateMasterProfile({
      structuredData: {
        ...struct,
        strictBoundaries: [...existing, newBoundary.trim()]
      }
    });
    setNewBoundary('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card: Candidate Truth */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
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
              Import Dossier (PDF/DOCX/TXT)
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
                className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900"
              />
            </div>

            <div className="text-xs">
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Working Method &amp; Operational Approach</label>
              <textarea
                rows={2}
                value={headerWorkingMethod}
                onChange={(e) => setHeaderWorkingMethod(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Location / Base</label>
                <input
                  type="text"
                  value={headerLocation}
                  onChange={(e) => setHeaderLocation(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Work Authorisation Details</label>
                <input
                  type="text"
                  value={headerWorkAuth}
                  onChange={(e) => setHeaderWorkAuth(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-900"
                />
              </div>
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
                className="px-3 py-1.5 bg-emerald-600 text-white rounded font-medium text-xs hover:bg-emerald-700"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Structured Section Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 pb-2">
        {sections.map(s => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-zinc-900 text-white shadow-2xs font-semibold' 
                  : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION CONTENT */}

      {/* 1. Overview */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
              <h3 className="font-semibold text-xs uppercase font-mono text-zinc-500">Methodology &amp; Operating Principle</h3>
              <p className="text-zinc-700 text-xs leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                {masterProfile.workingMethod}
              </p>
            </div>

            {/* Employment Highlights */}
            <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
              <h3 className="font-semibold text-xs uppercase font-mono text-zinc-500">Documented Roles ({employmentList.length})</h3>
              <div className="space-y-3">
                {employmentList.map((role, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-zinc-900 text-xs">{role.role || role.title}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">{role.period}</span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-800">{role.organization || role.employer}</p>
                    <ul className="list-disc list-inside text-[11px] text-zinc-600 space-y-0.5">
                      {role.responsibilities?.slice(0, 3).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
              <h3 className="font-semibold text-xs uppercase font-mono text-zinc-500">Career Evidence Stats</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="text-xl font-bold text-zinc-900 block font-mono">
                    {projectList.length}
                  </span>
                  <span className="text-[11px] text-zinc-500">Projects</span>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="text-xl font-bold text-zinc-900 block font-mono">
                    {achievementList.length}
                  </span>
                  <span className="text-[11px] text-zinc-500">Outcomes</span>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="text-xl font-bold text-zinc-900 block font-mono">
                    {challengeList.length}
                  </span>
                  <span className="text-[11px] text-zinc-500">Challenges</span>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="text-xl font-bold text-zinc-900 block font-mono">
                    {struct.strictBoundaries?.length || 0}
                  </span>
                  <span className="text-[11px] text-zinc-500">Boundaries</span>
                </div>
              </div>
            </div>

            {/* Strict Boundaries Preview */}
            <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-2">
              <h3 className="font-semibold text-xs uppercase font-mono text-rose-700 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Claims Discipline &amp; Boundaries
              </h3>
              <ul className="text-xs space-y-1.5 text-zinc-600">
                {struct.strictBoundaries?.map((b: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 bg-rose-50/50 p-2 rounded border border-rose-100 text-[11px]">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. Personal & Eligibility */}
      {activeSection === 'personal' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                Personal Details &amp; Global Eligibility
              </h3>
              {!isEditingPersonal ? (
                <button
                  onClick={startEditingPersonal}
                  className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-800 flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingPersonal(false)}
                  className="px-2.5 py-1 text-xs text-zinc-500 hover:text-zinc-800"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditingPersonal ? (
              <form onSubmit={handleSavePersonal} className="p-4 bg-zinc-50 rounded-lg border border-zinc-300 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={persFullName}
                      onChange={(e) => setPersFullName(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={persEmail}
                      onChange={(e) => setPersEmail(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Phone</label>
                    <input
                      type="text"
                      value={persPhone}
                      onChange={(e) => setPersPhone(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Current Location *</label>
                    <input
                      type="text"
                      required
                      value={persLocation}
                      onChange={(e) => setPersLocation(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Work Authorization *</label>
                    <input
                      type="text"
                      required
                      value={persWorkAuth}
                      onChange={(e) => setPersWorkAuth(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Remote Preference *</label>
                    <select
                      value={persRemotePref}
                      onChange={(e) => setPersRemotePref(e.target.value as any)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    >
                      <option value="REMOTE_ONLY">Remote Only</option>
                      <option value="REMOTE_OK">Remote Preferred</option>
                      <option value="HYBRID_OK">Hybrid OK</option>
                      <option value="ONSITE_OK">Onsite OK</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Countries Legally Permitted to Work From (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Nigeria, Ghana, United Kingdom"
                      value={persEligibleCountries}
                      onChange={(e) => setPersEligibleCountries(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Languages (comma separated with proficiency)</label>
                    <input
                      type="text"
                      placeholder="e.g. English (Native), French (Professional)"
                      value={persLanguages}
                      onChange={(e) => setPersLanguages(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/..."
                      value={persLinkedIn}
                      onChange={(e) => setPersLinkedIn(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">GitHub / Code URL</label>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={persGitHub}
                      onChange={(e) => setPersGitHub(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Portfolio / Personal Site</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={persPortfolio}
                      onChange={(e) => setPersPortfolio(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Professional Credentials &amp; Licenses (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Registered Nurse (RN) License, Certified Scrum Master (CSM), AWS Certified"
                    value={persCredentials}
                    onChange={(e) => setPersCredentials(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="persRelocCheck"
                    checked={persReloc}
                    onChange={(e) => setPersReloc(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-0"
                  />
                  <label htmlFor="persRelocCheck" className="text-zinc-700 font-medium">
                    Willing to Relocate for the Right Opportunity
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                  <button type="button" onClick={() => setIsEditingPersonal(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-zinc-900 text-white rounded font-medium">Save Personal Details</button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-mono block text-[10px] uppercase">Full Name</span>
                    <span className="font-bold text-zinc-900 mt-0.5 block">{personal.fullName || masterProfile.candidateName}</span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-mono block text-[10px] uppercase">Email</span>
                    <span className="font-semibold text-zinc-800 mt-0.5 block">{personal.email || 'alex.vance@example.com'}</span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-mono block text-[10px] uppercase">Phone</span>
                    <span className="font-semibold text-zinc-800 mt-0.5 block">{personal.phone || '+234 801 234 5678'}</span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-mono block text-[10px] uppercase">Current Location</span>
                    <span className="font-semibold text-zinc-800 mt-0.5 block">{personal.currentLocation || masterProfile.location}</span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-mono block text-[10px] uppercase">Work Authorization</span>
                    <span className="font-semibold text-zinc-800 mt-0.5 block">{personal.workAuthorization || masterProfile.workAuthorisation}</span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-mono block text-[10px] uppercase">Remote Preference</span>
                    <span className="font-semibold text-emerald-700 mt-0.5 block">{personal.remotePreference || 'REMOTE_ONLY'}</span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-mono block text-[10px] uppercase">Relocation</span>
                    <span className="font-semibold text-zinc-800 mt-0.5 block">{personal.relocationWillingness ? 'Yes (Willing)' : 'No (Strict Remote)'}</span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 font-mono block text-[10px] uppercase">Languages</span>
                    <span className="font-semibold text-zinc-800 mt-0.5 block">
                      {personal.languages && personal.languages.length > 0 
                        ? personal.languages.map(l => typeof l === 'string' ? l : `${l.language} (${l.proficiency})`).join(', ')
                        : 'English (Fluent)'}
                    </span>
                  </div>
                </div>

                {/* Eligible Countries */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider font-mono block mb-1.5">
                    Countries Legally Permitted to Work From:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(personal.eligibleCountries || ['Nigeria']).map((country, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded font-medium">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Professional Links */}
                {(personal.linkedIn || personal.gitHub || personal.portfolio) && (
                  <div className="pt-2 border-t border-zinc-100 flex flex-wrap gap-3 text-xs">
                    {personal.linkedIn && (
                      <a href={personal.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
                        <LinkIcon className="w-3.5 h-3.5" />
                        LinkedIn
                      </a>
                    )}
                    {personal.gitHub && (
                      <a href={personal.gitHub} target="_blank" rel="noopener noreferrer" className="text-zinc-800 hover:underline flex items-center gap-1 font-medium">
                        <Code className="w-3.5 h-3.5" />
                        GitHub
                      </a>
                    )}
                    {personal.portfolio && (
                      <a href={personal.portfolio} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline flex items-center gap-1 font-medium">
                        <Globe className="w-3.5 h-3.5" />
                        Portfolio
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Education Records */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Education Records ({educationList.length})
              </h3>
              <button
                onClick={() => setShowAddEdu(!showAddEdu)}
                className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Degree</span>
              </button>
            </div>

            {showAddEdu && (
              <form onSubmit={handleAddEducation} className="p-4 bg-zinc-50 rounded-lg border border-zinc-300 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Qualification / Degree *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Sc. Information Systems"
                      value={newEduDegree}
                      onChange={(e) => setNewEduDegree(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Institution *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. University of Lagos"
                      value={newEduInst}
                      onChange={(e) => setNewEduInst(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Field of Study</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science"
                      value={newEduField}
                      onChange={(e) => setNewEduField(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Years / Dates</label>
                    <input
                      type="text"
                      placeholder="e.g. 2016 - 2020"
                      value={newEduDates}
                      onChange={(e) => setNewEduDates(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Lagos, Nigeria"
                      value={newEduLocation}
                      onChange={(e) => setNewEduLocation(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowAddEdu(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-zinc-900 text-white rounded font-medium">Save Education</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {educationList.map((edu, idx) => (
                <div key={idx} className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <h4 className="font-bold text-zinc-900">{edu.qualification || edu.degree}</h4>
                    <p className="text-emerald-700 font-semibold mt-0.5">{edu.institution}</p>
                    <div className="text-[11px] text-zinc-500 mt-1 font-mono">
                      {edu.year || edu.startDate} {edu.location && `· ${edu.location}`}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteEducation(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Licenses */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                Certifications, Licenses &amp; Credentials ({certList.length})
              </h3>
              <button
                onClick={() => setShowAddCert(!showAddCert)}
                className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Credential</span>
              </button>
            </div>

            {showAddCert && (
              <form onSubmit={handleAddCertification} className="p-4 bg-zinc-50 rounded-lg border border-zinc-300 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Certification / License Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Registered Nurse (RN) License #88291"
                      value={newCertName}
                      onChange={(e) => setNewCertName(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Issuing Body / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Nursing Council / American Heart Association"
                      value={newCertIssuer}
                      onChange={(e) => setNewCertIssuer(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Date Obtained</label>
                    <input
                      type="text"
                      placeholder="e.g. 2024"
                      value={newCertDate}
                      onChange={(e) => setNewCertDate(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Status</label>
                    <select
                      value={newCertStatus}
                      onChange={(e) => setNewCertStatus(e.target.value as any)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    >
                      <option value="ACTIVE">Active / Verified</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="EXPIRED">Expired</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowAddCert(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-zinc-900 text-white rounded font-medium">Save Credential</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certList.map((cert, idx) => (
                <div key={idx} className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-zinc-900">{cert.name}</h4>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                        {cert.status || 'ACTIVE'}
                      </span>
                    </div>
                    {cert.issuingOrganization && (
                      <p className="text-zinc-600 text-[11px] mt-0.5">{cert.issuingOrganization}</p>
                    )}
                    {cert.dateObtained && (
                      <span className="text-[10px] text-zinc-400 font-mono block mt-1">Obtained: {cert.dateObtained}</span>
                    )}
                  </div>
                  <button onClick={() => handleDeleteCertification(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Career Identity & Domains */}
      {activeSection === 'career_identity' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              Professional Identity &amp; Positioning
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-zinc-500 font-mono text-[10px] uppercase block">Primary Profession</span>
                <span className="font-bold text-sm text-zinc-900 mt-1 block">{masterProfile.primaryProfession}</span>
              </div>
              <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-zinc-500 font-mono text-[10px] uppercase block">Years of Documented Experience</span>
                <span className="font-bold text-sm text-zinc-900 mt-1 block">5+ Years Verified</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider font-mono block mb-1">
                Core Positioning &amp; Value Proposition:
              </span>
              <p className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-lg border border-zinc-200 leading-relaxed">
                {masterProfile.corePositioning}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider font-mono block mb-1">
                Working Method &amp; Operational Approach:
              </span>
              <p className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-lg border border-zinc-200 leading-relaxed">
                {masterProfile.workingMethod}
              </p>
            </div>
          </div>

          {/* Industry & Domain Experience */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Industry &amp; Domain Experience Records ({domainList.length})
              </h3>
              <button
                onClick={() => setShowAddDomain(!showAddDomain)}
                className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Domain Record</span>
              </button>
            </div>

            {showAddDomain && (
              <form onSubmit={handleAddDomain} className="p-4 bg-zinc-50 rounded-lg border border-zinc-300 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Industry *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Healthcare / Acute Care"
                      value={newDomainIndustry}
                      onChange={(e) => setNewDomainIndustry(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Domain Area *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Intensive Care Unit (ICU)"
                      value={newDomainName}
                      onChange={(e) => setNewDomainName(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Depth of Experience</label>
                    <select
                      value={newDomainDepth}
                      onChange={(e) => setNewDomainDepth(e.target.value as any)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    >
                      <option value="DEEP">Deep / Primary Focus</option>
                      <option value="MODERATE">Moderate / Solid Exposure</option>
                      <option value="WORKING">Working Knowledge</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Exposure Type</label>
                    <select
                      value={newDomainExposure}
                      onChange={(e) => setNewDomainExposure(e.target.value as any)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    >
                      <option value="DIRECT_OPERATIONAL">Direct Operational</option>
                      <option value="ADJACENT">Adjacent Domain</option>
                      <option value="COLLABORATIVE">Cross-Functional Collaborative</option>
                      <option value="THEORETICAL">Theoretical</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Documented Evidence</label>
                  <input
                    type="text"
                    placeholder="e.g. St. Nicholas ICU shifts / MarketGrowthOS CRM state machine"
                    value={newDomainEvidence}
                    onChange={(e) => setNewDomainEvidence(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowAddDomain(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-zinc-900 text-white rounded font-medium">Save Domain</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {domainList.map((dom, idx) => (
                <div key={idx} className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-zinc-900">{dom.domain}</h4>
                      <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-semibold">
                        {dom.depthOfExperience}
                      </span>
                    </div>
                    <p className="text-zinc-600 text-[11px] font-medium mt-0.5">{dom.industry}</p>
                    {dom.evidence && (
                      <p className="text-zinc-500 text-[11px] italic mt-1">Evidence: {dom.evidence}</p>
                    )}
                  </div>
                  <button onClick={() => handleDeleteDomain(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Employment History */}
      {activeSection === 'employment' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Verified Employment History ({employmentList.length})
              </h3>
              <button
                onClick={() => setShowAddJob(!showAddJob)}
                className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>

            {showAddJob && (
              <form onSubmit={handleAddEmployment} className="p-4 bg-zinc-50 rounded-lg border border-zinc-300 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Role / Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Backend Engineer"
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
                      placeholder="e.g. PaySync Technologies"
                      value={newJobCompany}
                      onChange={(e) => setNewJobCompany(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Period / Dates</label>
                    <input
                      type="text"
                      placeholder="e.g. 2022 - Present"
                      value={newJobPeriod}
                      onChange={(e) => setNewJobPeriod(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Employment Type</label>
                    <select
                      value={newJobType}
                      onChange={(e) => setNewJobType(e.target.value as any)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    >
                      <option value="FULL_TIME">Full-Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="PART_TIME">Part-Time</option>
                      <option value="CONSULTING">Consulting</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Users / Customers Served</label>
                    <input
                      type="text"
                      placeholder="e.g. 120k active merchants, ICU cardiac patients"
                      value={newJobUsers}
                      onChange={(e) => setNewJobUsers(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Key Stakeholders (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. CTO, Head of Compliance, Clinical Director"
                      value={newJobStakeholders}
                      onChange={(e) => setNewJobStakeholders(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Team &amp; Leadership Responsibility</label>
                    <input
                      type="text"
                      placeholder="e.g. Led squad of 6 engineers & 2 designers / Charge nurse for 12 beds"
                      value={newJobLeadership}
                      onChange={(e) => setNewJobLeadership(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Tools &amp; Technologies Used (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. PostgreSQL, Redis, Jira, Epic EHR"
                      value={newJobTools}
                      onChange={(e) => setNewJobTools(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Products / Projects Worked On (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. PaySync Merchant Portal, Realtime Reconciliation Pipeline"
                    value={newJobProjects}
                    onChange={(e) => setNewJobProjects(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Responsibilities (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Designed webhook engine&#10;Mentored squad developers"
                    value={newJobResps}
                    onChange={(e) => setNewJobResps(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Verified Achievements (One per line)</label>
                  <textarea
                    rows={2}
                    placeholder="Scaled platform to 450 req/sec at 99.98% uptime"
                    value={newJobAchs}
                    onChange={(e) => setNewJobAchs(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowAddJob(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-zinc-900 text-white rounded font-medium">Save Role</button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {employmentList.map((emp, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900">{emp.role || emp.title}</h4>
                      <p className="text-emerald-700 font-semibold text-xs mt-0.5">{emp.organization || emp.employer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200 text-[11px]">
                        {emp.period}
                      </span>
                      <button onClick={() => handleDeleteEmployment(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {emp.responsibilities && emp.responsibilities.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-semibold text-zinc-500">Core Responsibilities:</span>
                      <ul className="list-disc list-inside text-zinc-700 space-y-0.5 pl-1">
                        {emp.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {emp.usersServed && (
                    <div className="text-[11px] text-zinc-600 bg-white p-2 rounded border border-zinc-200">
                      <strong>Users / Customers:</strong> {emp.usersServed}
                    </div>
                  )}

                  {emp.teamOrLeadershipResponsibility && (
                    <div className="text-[11px] text-zinc-600 bg-white p-2 rounded border border-zinc-200">
                      <strong>Leadership / Scope:</strong> {emp.teamOrLeadershipResponsibility}
                    </div>
                  )}

                  {emp.stakeholders && emp.stakeholders.length > 0 && (
                    <div className="text-[11px] text-zinc-600">
                      <strong className="text-zinc-700">Stakeholders:</strong> {emp.stakeholders.join(', ')}
                    </div>
                  )}

                  {emp.tools && emp.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {emp.tools.map((t, ti) => (
                        <span key={ti} className="text-[10px] font-mono bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {emp.achievements && emp.achievements.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-zinc-200/60">
                      <span className="text-[10px] uppercase font-mono font-semibold text-emerald-800">Verified Achievements:</span>
                      <ul className="list-disc list-inside text-emerald-900 space-y-0.5 pl-1">
                        {emp.achievements.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Current Work */}
      {activeSection === 'current_work' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Active Position &amp; Ongoing Work Focus
            </h3>
            <p className="text-xs text-zinc-500">
              Clear distinction between live/shipped products, active testing, and planned initiatives.
            </p>

            <div className="space-y-4">
              {(currentWorkList.length > 0 ? currentWorkList : [
                {
                  id: "cw_def",
                  employerOrContext: employmentList[0]?.organization || "Current Organization",
                  role: employmentList[0]?.role || masterProfile.primaryProfession,
                  responsibilities: employmentList[0]?.responsibilities || ["Current operational responsibilities"],
                  projects: ["Active Core Initiatives"],
                  objectives: ["Maintain operational standards and zero errors"],
                  challenges: ["Complex systems constraints and workflow coordination"],
                  achievements: ["Documented baseline delivery"],
                  toolsTechnologies: struct.tools || ["Primary Tools"],
                  status: "LIVE_SHIPPED" as const
                }
              ]).map((cw, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900">{cw.role}</h4>
                      <p className="text-emerald-700 font-semibold text-xs mt-0.5">{cw.employerOrContext}</p>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {cw.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-white p-3 rounded border border-zinc-200">
                      <span className="text-[10px] font-mono font-semibold uppercase text-zinc-500 block mb-1">Active Projects</span>
                      <ul className="list-disc list-inside text-zinc-700 space-y-0.5">
                        {cw.projects?.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded border border-zinc-200">
                      <span className="text-[10px] font-mono font-semibold uppercase text-zinc-500 block mb-1">Current Objectives</span>
                      <ul className="list-disc list-inside text-zinc-700 space-y-0.5">
                        {cw.objectives?.map((o, i) => <li key={i}>{o}</li>)}
                      </ul>
                    </div>
                  </div>

                  {cw.challenges && cw.challenges.length > 0 && (
                    <div className="bg-amber-50/70 p-3 rounded border border-amber-200 text-amber-900">
                      <span className="text-[10px] font-mono font-semibold uppercase block mb-0.5">Active Challenges:</span>
                      <ul className="list-disc list-inside text-[11px] space-y-0.5">
                        {cw.challenges.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Projects & Professional Work */}
      {activeSection === 'projects' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-600" />
                Documented Projects &amp; Work Platforms ({projectList.length})
              </h3>
              <button
                onClick={() => setShowAddProject(!showAddProject)}
                className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {showAddProject && (
              <form onSubmit={handleAddProject} className="p-4 bg-zinc-50 rounded-lg border border-zinc-300 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Project / Platform Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ICU Sepsis Early Warning Protocol"
                      value={newProjName}
                      onChange={(e) => setNewProjName(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Candidate's Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Nurse Lead / Technical Architect"
                      value={newProjRole}
                      onChange={(e) => setNewProjRole(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Problem or Operational Need</label>
                    <input
                      type="text"
                      placeholder="e.g. Manual reconciliation created 48h delays"
                      value={newProjProblem}
                      onChange={(e) => setNewProjProblem(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Users / Stakeholders Served</label>
                    <input
                      type="text"
                      placeholder="e.g. 5,000 retail branch managers, compliance ops"
                      value={newProjUsers}
                      onChange={(e) => setNewProjUsers(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Lifecycle / Current Status</label>
                    <select
                      value={newProjLifecycle}
                      onChange={(e) => setNewProjLifecycle(e.target.value as any)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    >
                      <option value="LIVE_SHIPPED">Live / Shipped in Production</option>
                      <option value="TESTING">In Testing / Staging</option>
                      <option value="PROTOTYPE">Prototype / Pilot</option>
                      <option value="IN_DEVELOPMENT">In Active Development</option>
                      <option value="DISCONTINUED">Discontinued / Legacy</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Technologies &amp; Tools (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Node.js, RabbitMQ, Datadog, BigQuery"
                      value={newProjTools}
                      onChange={(e) => setNewProjTools(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Decisions Made (One per line)</label>
                    <textarea
                      rows={2}
                      placeholder="Selected asynchronous event bus&#10;Enforced idempotency keys"
                      value={newProjDecisions}
                      onChange={(e) => setNewProjDecisions(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Challenges &amp; Solutions (One per line)</label>
                    <textarea
                      rows={2}
                      placeholder="High volume webhooks -> Deployed Redis buffer"
                      value={newProjSolutions}
                      onChange={(e) => setNewProjSolutions(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Measurable Outcomes &amp; Evidence Source</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Outcome: Reduced settlement time by 82%"
                      value={newProjOutcomes}
                      onChange={(e) => setNewProjOutcomes(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Evidence: Q3 Engineering Ops Report"
                      value={newProjEvidence}
                      onChange={(e) => setNewProjEvidence(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Context &amp; Operational Background</label>
                  <textarea
                    rows={2}
                    placeholder="Describe the operational background and constraints..."
                    value={newProjContext}
                    onChange={(e) => setNewProjContext(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Key Actions &amp; Deliverables (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Trained clinical staff&#10;Established vital interval protocols"
                    value={newProjBullets}
                    onChange={(e) => setNewProjBullets(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowAddProject(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-zinc-900 text-white rounded font-medium">Save Project</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectList.map((p, idx) => (
                <div key={p.id || idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between space-y-3 text-xs">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-zinc-900">{p.name}</h4>
                          <span className="text-[10px] font-mono bg-zinc-200 text-zinc-700 px-1.5 py-0.2 rounded font-semibold inline-block">
                            {p.role}
                          </span>
                          {(p.lifecycleStatus || p.status) && (
                            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold inline-block">
                              {(p.lifecycleStatus || p.status || '').replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProject(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {p.problemOrNeed && (
                      <div className="text-[11px] text-zinc-700 bg-amber-50/60 p-2 rounded border border-amber-200">
                        <strong>Problem Solved:</strong> {p.problemOrNeed}
                      </div>
                    )}

                    {p.usersOrStakeholders && (
                      <div className="text-[11px] text-zinc-600">
                        <strong>Users / Stakeholders:</strong> {p.usersOrStakeholders}
                      </div>
                    )}

                    {p.context && (
                      <p className="text-zinc-600 leading-relaxed bg-white p-2.5 rounded border border-zinc-200/70">
                        {p.context}
                      </p>
                    )}

                    {p.decisionsMade && p.decisionsMade.length > 0 && (
                      <div className="text-[11px] text-zinc-700">
                        <strong className="block text-[10px] uppercase font-mono text-zinc-500">Decisions Made:</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {p.decisionsMade.map((d, di) => <li key={di}>{d}</li>)}
                        </ul>
                      </div>
                    )}

                    {p.solutions && p.solutions.length > 0 && (
                      <div className="text-[11px] text-zinc-700">
                        <strong className="block text-[10px] uppercase font-mono text-zinc-500">Solutions Implemented:</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {p.solutions.map((s, si) => <li key={si}>{s}</li>)}
                        </ul>
                      </div>
                    )}

                    {p.technologiesTools && p.technologiesTools.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.technologiesTools.map((t, ti) => (
                          <span key={ti} className="text-[10px] font-mono bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {p.bullets && p.bullets.length > 0 && (
                      <ul className="list-disc list-inside text-zinc-700 space-y-0.5 pt-1">
                        {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    )}

                    {(p.outcomes || p.evidenceSource) && (
                      <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-emerald-700 font-semibold">{Array.isArray(p.outcomes) ? p.outcomes.join(', ') : p.outcomes || 'Verified'}</span>
                        <span className="text-zinc-400 truncate max-w-[150px]">{p.evidenceSource}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Achievements & Outcomes */}
      {activeSection === 'achievements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <div>
                <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Achievements &amp; Factual Outcomes ({achievementList.length})
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Factual outcomes separated from general responsibilities. Zero invented metrics.
                </p>
              </div>
              <button
                onClick={() => setShowAddAch(!showAddAch)}
                className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Outcome</span>
              </button>
            </div>

            {showAddAch && (
              <form onSubmit={handleAddAchievement} className="p-4 bg-zinc-50 rounded-lg border border-zinc-300 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Achievement Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zero Medication Errors Over 24 Months"
                      value={newAchTitle}
                      onChange={(e) => setNewAchTitle(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Category</label>
                    <select
                      value={newAchCategory}
                      onChange={(e) => setNewAchCategory(e.target.value as any)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    >
                      <option value="QUANTIFIED">Quantified Metric</option>
                      <option value="OPERATIONAL">Operational Improvement</option>
                      <option value="EFFICIENCY">Efficiency / Speed</option>
                      <option value="BUSINESS">Business / Revenue</option>
                      <option value="CUSTOMER_USER">Customer / Patient Safety</option>
                      <option value="QUALITATIVE">Qualitative Distinction</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Action Taken (Candidate specific)</label>
                    <input
                      type="text"
                      placeholder="e.g. Instituted double-signoff checklist and barcode scanner verification"
                      value={newAchAction}
                      onChange={(e) => setNewAchAction(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Factual Outcome Achieved</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% medication administration compliance audit score"
                      value={newAchOutcome}
                      onChange={(e) => setNewAchOutcome(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Metric (or 'Not Measured')</label>
                    <input
                      type="text"
                      placeholder="e.g. 10,000+ doses / 0 errors"
                      value={newAchMetric}
                      onChange={(e) => setNewAchMetric(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Evidence / Source</label>
                    <input
                      type="text"
                      placeholder="e.g. Clinical quality audit records"
                      value={newAchEvidence}
                      onChange={(e) => setNewAchEvidence(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Verification Status</label>
                    <select
                      value={newAchVerification}
                      onChange={(e) => setNewAchVerification(e.target.value as any)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    >
                      <option value="VERIFIED">Verified with Source</option>
                      <option value="DOCUMENTED_EVIDENCE">Documented in Evidence Library</option>
                      <option value="SELF_REPORTED">Self-Reported</option>
                      <option value="REQUIRES_CONFIRMATION">Requires Confirmation</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Operational Context</label>
                  <input
                    type="text"
                    placeholder="e.g. Intensive care vasoactive infusions"
                    value={newAchContext}
                    onChange={(e) => setNewAchContext(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowAddAch(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-zinc-900 text-white rounded font-medium">Save Outcome</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievementList.map((ach, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 text-xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-zinc-900">{ach.title}</h4>
                      <button onClick={() => handleDeleteAchievement(idx)} className="text-zinc-400 hover:text-rose-600 p-1 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold inline-block">
                        {ach.category}
                      </span>
                      {ach.verificationStatus && (
                        <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-semibold border border-blue-200">
                          {ach.verificationStatus.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                    {ach.context && (
                      <p className="text-zinc-600 text-[11px] leading-relaxed"><strong>Context:</strong> {ach.context}</p>
                    )}
                    {ach.action && (
                      <p className="text-zinc-700 text-[11px] leading-relaxed"><strong>Action:</strong> {ach.action}</p>
                    )}
                    {ach.outcome && (
                      <p className="text-emerald-900 text-[11px] leading-relaxed font-medium"><strong>Outcome:</strong> {ach.outcome}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-emerald-700">{ach.metric || 'Documented'}</span>
                    <span className="text-zinc-400 truncate max-w-[150px]">{ach.evidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. Challenges & Solutions */}
      {activeSection === 'challenges' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <div>
                <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Challenges, Tradeoffs &amp; Technical Solutions ({challengeList.length})
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Real professional problem-solving with documented tradeoffs and verifiable outcomes.
                </p>
              </div>
              <button
                onClick={() => setShowAddChallenge(!showAddChallenge)}
                className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Case</span>
              </button>
            </div>

            {showAddChallenge && (
              <form onSubmit={handleAddChallenge} className="p-4 bg-zinc-50 rounded-lg border border-zinc-300 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Challenge / Problem *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Preventing Asynchronous Webhook State Race Conditions"
                    value={newChalProblem}
                    onChange={(e) => setNewChalProblem(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Candidate's Responsibility</label>
                    <input
                      type="text"
                      placeholder="e.g. Sole architect responsible for event pipeline reliability"
                      value={newChalResp}
                      onChange={(e) => setNewChalResp(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Root Cause / Analysis Performed</label>
                    <input
                      type="text"
                      placeholder="e.g. Profiling revealed network timeout spikes during DB lock contention"
                      value={newChalAnalysis}
                      onChange={(e) => setNewChalAnalysis(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Context &amp; Constraints</label>
                  <textarea
                    rows={2}
                    placeholder="Describe the operational background and constraints..."
                    value={newChalContext}
                    onChange={(e) => setNewChalContext(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Analysis / Decision Made *</label>
                    <input
                      type="text"
                      placeholder="e.g. Decided to decouple ingest from synchronous persistence"
                      value={newChalDecision}
                      onChange={(e) => setNewChalDecision(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Technical Solution Implemented *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Exact architectural or clinical action taken..."
                      value={newChalSolution}
                      onChange={(e) => setNewChalSolution(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Measurable Result</label>
                    <input
                      type="text"
                      placeholder="e.g. Zero state desyncs in 50k stress events"
                      value={newChalResult}
                      onChange={(e) => setNewChalResult(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Measurement Status</label>
                    <select
                      value={newChalMeasurement}
                      onChange={(e) => setNewChalMeasurement(e.target.value as any)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    >
                      <option value="MEASURED">Measured &amp; Verified</option>
                      <option value="NOT_MEASURED">Not Formally Measured</option>
                      <option value="REQUIRES_VERIFICATION">Requires Verification</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowAddChallenge(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-zinc-900 text-white rounded font-medium">Save Case</button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {challengeList.map((chal, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900">{chal.challenge}</h4>
                      <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold mt-0.5 inline-block">
                        {chal.measurementState}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteChallenge(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {chal.candidateResponsibility && (
                    <div className="text-[11px] text-zinc-700 bg-amber-50/50 p-2 rounded border border-amber-200">
                      <strong>Candidate Responsibility:</strong> {chal.candidateResponsibility}
                    </div>
                  )}

                  {chal.analysis && (
                    <div className="text-[11px] text-zinc-600 bg-white p-2 rounded border border-zinc-200">
                      <strong>Analysis:</strong> {chal.analysis}
                    </div>
                  )}

                  <p className="text-zinc-600 bg-white p-2.5 rounded border border-zinc-200/70 leading-relaxed">
                    <strong>Context:</strong> {chal.context}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white rounded border border-zinc-200">
                      <strong className="text-zinc-800 block mb-1 text-[11px]">Solution &amp; Action:</strong>
                      <p className="text-zinc-700 leading-relaxed">{chal.solution || chal.decisionOrAction}</p>
                    </div>
                    <div className="p-3 bg-white rounded border border-zinc-200">
                      <strong className="text-zinc-800 block mb-1 text-[11px]">Tradeoff &amp; Result:</strong>
                      <p className="text-zinc-700 leading-relaxed">{chal.tradeoff ? `${chal.tradeoff} · ` : ''}{chal.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. Leadership & Ownership */}
      {activeSection === 'leadership' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <div>
                <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  Leadership, Mentoring &amp; Ownership ({leadershipList.length})
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Distinct ownership types (technical, operational, quality, mentoring) beyond traditional people management.
                </p>
              </div>
              <button
                onClick={() => setShowAddLeadership(!showAddLeadership)}
                className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
            </div>

            {showAddLeadership && (
              <form onSubmit={handleAddLeadership} className="p-4 bg-zinc-50 rounded-lg border border-zinc-300 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Leadership Role / Scope *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Charge Nurse for 12-Bed ICU / Squad Tech Lead"
                      value={newLeadTitle}
                      onChange={(e) => setNewLeadTitle(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Ownership Type</label>
                    <select
                      value={newLeadType}
                      onChange={(e) => setNewLeadType(e.target.value as any)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    >
                      <option value="TEAM_LEADERSHIP">Team Leadership</option>
                      <option value="TECHNICAL_OWNERSHIP">Technical Ownership</option>
                      <option value="OPERATIONAL_OWNERSHIP">Operational Ownership</option>
                      <option value="DECISION_MAKING">Decision Making Authority</option>
                      <option value="DELIVERY">Delivery Ownership</option>
                      <option value="MENTORING">Mentoring &amp; Coaching</option>
                      <option value="CROSS_FUNCTIONAL">Cross-Functional Coordination</option>
                      <option value="QUALITY_OWNERSHIP">Quality &amp; Safety Ownership</option>
                      <option value="ESCALATION_HANDLING">Escalations &amp; Incident Management</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Teams Led / Collaborating</label>
                    <input
                      type="text"
                      placeholder="e.g. Backend Squad, Clinical Unit"
                      value={newLeadTeams}
                      onChange={(e) => setNewLeadTeams(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Stakeholders Managed</label>
                    <input
                      type="text"
                      placeholder="e.g. Executive sponsors, Physician leads"
                      value={newLeadStakeholders}
                      onChange={(e) => setNewLeadStakeholders(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Decision Ownership Scope</label>
                    <input
                      type="text"
                      placeholder="e.g. Architectural approval, triage authority"
                      value={newLeadDecisions}
                      onChange={(e) => setNewLeadDecisions(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Mentoring &amp; Coaching Scope</label>
                    <input
                      type="text"
                      placeholder="e.g. Mentored 4 junior engineers to promotion"
                      value={newLeadMentoring}
                      onChange={(e) => setNewLeadMentoring(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Escalations Handled &amp; Governance</label>
                    <input
                      type="text"
                      placeholder="e.g. Managed severity-1 incidents, compliance audits"
                      value={newLeadEscalations}
                      onChange={(e) => setNewLeadEscalations(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Description of Responsibility</label>
                  <textarea
                    rows={2}
                    placeholder="Describe team size, escalations handled, and governance..."
                    value={newLeadDesc}
                    onChange={(e) => setNewLeadDesc(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Evidence / Source</label>
                  <input
                    type="text"
                    placeholder="e.g. Performance reviews, team charters"
                    value={newLeadEvidence}
                    onChange={(e) => setNewLeadEvidence(e.target.value)}
                    className="w-full p-2 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowAddLeadership(false)} className="px-3 py-1.5 text-zinc-600">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-zinc-900 text-white rounded font-medium">Save Record</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {leadershipList.map((lead, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between space-y-2 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-zinc-900">{lead.title}</h4>
                      <button onClick={() => handleDeleteLeadership(idx)} className="text-zinc-400 hover:text-rose-600 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded font-semibold inline-block">
                      {lead.ownershipType.replace('_', ' ')}
                    </span>
                    <p className="text-zinc-600 text-[11px] leading-relaxed">{lead.description}</p>
                    
                    {lead.teams && (
                      <div className="text-[11px] text-zinc-700"><strong>Teams:</strong> {lead.teams}</div>
                    )}
                    {lead.stakeholders && (
                      <div className="text-[11px] text-zinc-700"><strong>Stakeholders:</strong> {lead.stakeholders}</div>
                    )}
                    {lead.decisionOwnership && (
                      <div className="text-[11px] text-zinc-700"><strong>Decisions:</strong> {lead.decisionOwnership}</div>
                    )}
                    {lead.mentoringScope && (
                      <div className="text-[11px] text-zinc-700"><strong>Mentoring:</strong> {lead.mentoringScope}</div>
                    )}
                    {lead.escalationHandling && (
                      <div className="text-[11px] text-zinc-700"><strong>Escalations:</strong> {lead.escalationHandling}</div>
                    )}
                  </div>

                  {lead.evidence && (
                    <div className="pt-2 border-t border-zinc-200/60 text-[10px] text-zinc-400 font-mono">
                      Evidence: {lead.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. Skills & Tools */}
      {activeSection === 'skills_tools' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h3 className="font-bold text-zinc-900 text-sm">Competencies &amp; Skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {struct.skills?.map((cat: any, i: number) => (
                <div key={i} className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 space-y-2">
                  <span className="font-semibold text-xs text-zinc-900 block">{cat.category}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items?.map((item: string, idx: number) => (
                      <span key={idx} className="text-xs bg-white text-zinc-800 px-2 py-0.5 rounded border border-zinc-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Skill Group */}
            <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Category name (e.g. Clinical Protocols, DevOps)"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="bg-white border border-zinc-300 rounded px-3 py-1.5 text-xs text-zinc-800 sm:w-1/3"
              />
              <input
                type="text"
                placeholder="Comma separated skills (e.g. Triage, EHR, CPR)"
                value={newSkillItems}
                onChange={(e) => setNewSkillItems(e.target.value)}
                className="bg-white border border-zinc-300 rounded px-3 py-1.5 text-xs text-zinc-800 flex-1"
              />
              <button
                onClick={handleAddSkillGroup}
                className="px-3 py-1.5 bg-zinc-900 text-white rounded text-xs font-semibold hover:bg-zinc-800"
              >
                Add Group
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h3 className="font-bold text-zinc-900 text-sm">Tools, Platforms &amp; Equipment</h3>
            <div className="flex flex-wrap gap-2">
              {struct.tools?.map((tool: string, i: number) => (
                <span key={i} className="text-xs font-mono bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-md border border-zinc-300">
                  {tool}
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="New tool or software name"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                className="bg-white border border-zinc-300 rounded px-3 py-1.5 text-xs text-zinc-800 w-64"
              />
              <button
                onClick={handleAddTool}
                className="px-3 py-1.5 bg-zinc-900 text-white rounded text-xs font-semibold hover:bg-zinc-800"
              >
                Add Tool
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Claims Discipline & Strict Boundaries */}
      {activeSection === 'claims_discipline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Strict Candidate Boundaries &amp; Claims Discipline (Zero Fabrication Architecture)
              </h3>
              <p className="text-xs text-zinc-500">
                Things you do NOT claim, roles you do NOT perform, and strict boundaries that must never be fabricated.
              </p>
            </div>

            <div className="space-y-2">
              {struct.strictBoundaries?.map((b: string, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-rose-50/60 rounded-lg border border-rose-200 text-xs">
                  <div className="flex items-center gap-2 text-rose-900">
                    <span className="font-bold text-rose-600">✕</span>
                    <span>{b}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="e.g. Do not claim people management for roles over 5 reports"
                value={newBoundary}
                onChange={(e) => setNewBoundary(e.target.value)}
                className="bg-white border border-zinc-300 rounded px-3 py-1.5 text-xs text-zinc-800 flex-1"
              />
              <button
                onClick={handleAddBoundary}
                className="px-3 py-1.5 bg-rose-600 text-white rounded text-xs font-semibold hover:bg-rose-700"
              >
                Add Boundary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
