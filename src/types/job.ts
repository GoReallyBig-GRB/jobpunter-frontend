export type ParserConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type JobDecision = 'APPLY' | 'REVIEW' | 'REJECT' | 'WATCH';

export type JobStatus = 
  | 'NEW' 
  | 'REVIEW' 
  | 'READY_TO_APPLY' 
  | 'APPLIED' 
  | 'SCREENING'
  | 'INTERVIEW_INVITED'
  | 'INTERVIEW' 
  | 'OFFER' 
  | 'WON'
  | 'LOST'
  | 'ARCHIVED'
  | 'REJECTED' 
  | 'WATCHLIST'
  | 'CLOSED';

export interface ApplicationAuditEntry {
  id: string;
  timestamp: string;
  previousState: JobStatus;
  newState: JobStatus;
  actor: 'USER' | 'SYSTEM' | 'INTEGRATION';
  reason: string;
  notes?: string;
}

export type JDRetrievalStatus = 
  | 'FULL_JD_RETRIEVED' 
  | 'PARTIAL_JD_RETRIEVED' 
  | 'JD_UNAVAILABLE' 
  | 'URL_INACCESSIBLE' 
  | 'REQUIRES_REVIEW' 
  | 'CLOSED' 
  | 'STALE';

export type ApplicationRoute = 
  | 'FREE_ATS' 
  | 'DIRECT_CAREERS' 
  | 'AGGREGATOR_FREE' 
  | 'REVIEW_UNKNOWN' 
  | 'BLOCKED_PAID';

export type RouteStatus = 'GOOD' | 'REVIEW' | 'HARD_REJECT';

export interface RouteAnalysis {
  status: RouteStatus;
  routeType: string;
  evidence: string;
  verificationStatus: string;
  score: number; // max 10
}

export type RemoteEligibility = 
  | 'NIGERIA_OK' 
  | 'WORLDWIDE_REMOTE' 
  | 'REGION_RESTRICTED' 
  | 'HYBRID_ONSITE' 
  | 'UNCLEAR';

export type FreshnessStatus = 
  | 'CURRENT_ACTIVE' 
  | 'RECENTLY_POSTED' 
  | 'AGE_UNCERTAIN' 
  | 'STALE' 
  | 'CLOSED_EXPIRED';

export interface FreshnessAnalysis {
  status: FreshnessStatus;
  postingDate: string;
  daysSincePosted?: number;
  warning?: string;
  score: number; // max 10
}

export type RequirementSeverity = 
  | 'MUST_HAVE' 
  | 'IMPORTANT' 
  | 'PREFERRED' 
  | 'CONTEXTUAL';

export type EvidenceStatus = 
  | 'DIRECT' 
  | 'TRANSFERABLE' 
  | 'STRONG_TRANSFERABLE'
  | 'PARTIAL' 
  | 'WEAK_TRANSFERABLE'
  | 'MISSING' 
  | 'CONTRADICTED'
  | 'REQUIRES_VERIFICATION'
  | 'DISQUALIFYING';

export interface RequirementEvaluation {
  id: string;
  requirement: string;
  category?: 'ROLE_CORE' | 'DOMAIN' | 'TECHNICAL' | 'SENIORITY' | 'EDUCATION' | 'LOCATION' | 'OTHER';
  severity: RequirementSeverity;
  status: EvidenceStatus;
  candidateEvidence: string;
  sourceProduct: string; // The source item from Master Profile (e.g. project, previous role)
  rationale: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  isMaterialGap: boolean;
  provenance: {
    candidateEvidenceSource: string; // e.g. "Master Profile > Projects > Project A"
    jdRequirementSource: string; // e.g. "Job Description > Requirements"
  };
}

export interface SeniorityAnalysis {
  requiredSeniority: string;
  candidateDocumentedLevel: string;
  seniorityGap: string;
  isMaterial: boolean;
  decisionImpact: string;
  score: number; // max 15
}

export interface DetailedScores {
  roleLegitimacy: number;             // 0-10
  locationWorkAuth: number;           // 0-20
  appAccessibility: number;           // 0-10
  seniorityFit: number;               // 0-15
  coreRoleCapability?: number;        // 0-20 (Universal Core Role Capability)
  corePMCapability: number;           // 0-20 (Core Role Capability legacy alias)
  technicalComplexity?: number;       // 0-10 (Universal Technical Complexity)
  technicalProductComplexity: number; // 0-10 (legacy alias)
  domainRelevance: number;            // 0-15
  evidenceStrength: number;           // 0-20
  missingCriticalPenalty: number;     // -30 to 0
  jobFreshness: number;               // 0-10
  coreRoleScore?: number;             // 0-100 (Universal Core Role Score)
  corePMScore: number;                // 0-100 (Core Role Score legacy alias)
  domainScore: number;                // 0-100 (Domain Match Score)
  total: number;                      // 0-100 overall
}

export interface ScoreBreakdown {
  locationEligibility: number; // max 20
  coreEvidenceFit: number;     // max 30
  seniorityFit: number;        // max 15
  domainFit: number;           // max 15
  appAccessibility: number;    // max 10
  roleAuthenticity: number;    // max 10
  total: number;               // max 100
}

export interface DirectEvidenceItem {
  requirement: string;
  product: string;
  evidence: string;
}

export interface TransferableEvidenceItem {
  requirement: string;
  product: string;
  capability: string;
  explanation: string;
}

export interface MissingEvidenceItem {
  requirement: string;
  impact: string;
  isMaterial?: boolean;
}

export interface RiskItem {
  title: string;
  explanation: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface EvidenceMatchOutput {
  direct: DirectEvidenceItem[];
  transferable: TransferableEvidenceItem[];
  missing: MissingEvidenceItem[];
  risks: RiskItem[];
}

export interface EvidenceCoverage {
  supportedMaterialCount: number;
  totalMaterialCount: number;
  directMatchesCount: number;
  transferableMatchesCount: number;
  missingMaterialCount: number;
  hardBlockersCount: number;
  verificationRequiredCount: number;
}

export interface ApplyGateCheck {
  ruleNumber: number;
  name: string;
  passed: boolean;
  details: string;
}

export interface ApplyGateResult {
  passed: boolean;
  checklist: ApplyGateCheck[];
  failedRule?: string;
}

export interface ApplicationMaterials {
  summary: string;
  coverLetter: string;
  keyEvidenceToEmphasize: string[];
  interviewDefensePoints: { concern: string; counterStrategy: string }[];
  salaryContext?: string;
  questionsAnswers: { question: string; answer: string }[];
}

export interface OverrideRecord {
  timestamp: string;
  previousDecision: JobDecision;
  newDecision: JobDecision;
  userNote: string;
}

// Section 21: CV Ranking representation
export interface CVRanking {
  cvVariantId: string;
  cvName: string;
  relevanceScore: number; // 0-100
  mustHaveCoverage: number; // count
  strongestEvidence: string[];
  missingRelevantEvidence: string[];
  explanation: string;
}

// -------------------------------------------------------------
// Section 3: Universal Master Career Profile Layer (Agnostic & Configurable)
// -------------------------------------------------------------

export type ExpertiseLevel = 'EXPERT' | 'STRONG' | 'WORKING_KNOWLEDGE' | 'FAMILIAR' | 'EXPOSURE';

export interface CandidatePersonalDetails {
  fullName: string;
  preferredName?: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  linkedIn?: string;
  gitHub?: string;
  portfolio?: string;
  professionalLinks?: { label: string; url: string }[];
  currentLocation: string;
  eligibleCountries: string[];
  workAuthorization: string;
  remotePreference: RemotePreference;
  relocationWillingness: boolean;
  travelWillingness?: string;
  employmentTypePreferences?: string[];
  availability?: string;
  noticePeriod?: string;
  compensationExpectations?: string;
  languages?: { language: string; proficiency: string }[];
  professionalCredentials?: string[];
}

export interface EducationRecord {
  id?: string;
  institution: string;
  qualification: string;
  fieldOfStudy?: string;
  specialization?: string;
  startDate?: string;
  endDate?: string;
  year?: string; // legacy compatibility
  degree?: string; // legacy compatibility
  location?: string;
  grade?: string; // Grade / Result where relevant
  description?: string;
  supportingEvidence?: string; // Optional supporting evidence / source
  relevantCoursework?: string[];
  academicDistinctions?: string[];
}

export interface CertificationRecord {
  id?: string;
  name: string;
  certificationName?: string; // Section 2 alias
  issuingOrganization: string;
  issuer?: string; // legacy compatibility
  issueDate?: string;
  dateObtained?: string;
  date?: string; // legacy compatibility
  expirationDate?: string;
  expiryDate?: string; // Section 2 alias
  credentialId?: string; // credential ID where applicable
  credentialReference?: string; // legacy alias
  credentialUrl?: string; // credential URL (rendered as clickable link)
  verificationUrl?: string; // legacy alias
  supportingEvidence?: string;
  notes?: string;
  status?: 'ACTIVE' | 'EXPIRED' | 'IN_PROGRESS';
  valid?: boolean; // legacy compatibility
}

export interface PortfolioRecord {
  id: string;
  title: string;
  name?: string; // Section 2 alias
  description: string;
  category: 'Live Project' | 'Web Application' | 'Case Study' | 'Open Source' | 'Design System' | 'Technical Article' | 'Publication' | 'Patent' | 'Other';
  url: string; // Stored and rendered as clickable hyperlink
  associatedProject?: string; // Associated project / product / experience
  supportingEvidence?: string;
  notes?: string;
}

export interface IndustryDomainRecord {
  id?: string;
  industry: string;
  subIndustry?: string;
  domain: string;
  periodOfExperience?: string;
  exposureType?: 'DIRECT_OPERATIONAL' | 'ADJACENT' | 'COLLABORATIVE' | 'THEORETICAL';
  depthOfExperience?: 'DEEP' | 'MODERATE' | 'WORKING';
  associatedEmployerOrProject?: string;
  evidence?: string;
  functionalAreas?: string[];
}

export interface EmploymentRecord {
  id?: string;
  role: string;
  title?: string;
  employer?: string;
  organization: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'CONSULTING' | 'INTERNSHIP';
  startDate?: string;
  endDate?: string;
  period: string;
  currentRole?: boolean;
  calculatedDuration?: string;
  location?: string;
  industry?: string;
  teamContext?: string;
  responsibilities: string[];
  areasOwned?: string[];
  achievements: string[];
  skills: string[];
  tools?: string[];
  projects?: string[];
  usersServed?: string;
  stakeholders?: string[];
  teamOrLeadershipResponsibility?: string;
  outcomes?: string[];
  evidenceSource?: string;
  candidateNotes?: string;
}

export interface CurrentWorkRecord {
  id?: string;
  employerOrContext: string;
  role: string;
  responsibilities: string[];
  projects: string[];
  objectives: string[];
  challenges: string[];
  achievements: string[];
  teamContext?: string;
  toolsTechnologies: string[];
  status: 'LIVE_SHIPPED' | 'IN_TESTING' | 'IN_DEVELOPMENT' | 'PLANNED';
}

export type ProjectActivityCategory = 
  | 'Research' 
  | 'Analysis' 
  | 'Design' 
  | 'Engineering' 
  | 'Product' 
  | 'Operations' 
  | 'Sales' 
  | 'Marketing' 
  | 'Clinical' 
  | 'Administration' 
  | 'Leadership' 
  | 'Implementation' 
  | 'Testing' 
  | 'Documentation' 
  | 'Customer' 
  | 'Other';

export interface ProjectOrProductRecord {
  id: string;
  name: string;
  headline?: string;
  type?: string;
  industry?: string;
  domain?: string;
  organization?: string;
  dates?: string;
  status?: string;
  context: string;
  problemOrNeed?: string;
  usersOrStakeholders?: string;
  businessContext?: string;
  objectives?: string[];
  constraints?: string[];
  role: string;
  ownership?: string;
  responsibilities?: string[];
  decisions?: string[];
  decisionsMade?: string[];
  challenges?: string[];
  solutions?: string[];
  technologiesTools?: string[];
  lifecycleStatus?: 'LIVE_SHIPPED' | 'TESTING' | 'PROTOTYPE' | 'IN_DEVELOPMENT' | 'DISCONTINUED';
  evidenceSource?: string;
  contributions?: string[];
  collaboration?: string;
  workPerformed?: string;
  activityCategories?: ProjectActivityCategory[];
  bullets: string[];
  capabilities: string[];
  outcomes?: string[];
  keywords: string[];
  cautionNotes?: string;
}

export interface ChallengeSolutionRecord {
  id: string;
  challenge: string;
  context: string;
  candidateResponsibility?: string;
  analysis?: string;
  constraints: string[];
  optionsConsidered: string[];
  decisionOrAction: string;
  decision?: string;
  reasoning: string;
  solution: string;
  tradeoff?: string;
  result: string;
  lessonLearned?: string;
  evidence?: string;
  measurementState: 'MEASURED' | 'NOT_MEASURED' | 'UNKNOWN' | 'REQUIRES_VERIFICATION';
}

export interface SkillToolRecord {
  name: string;
  category: 'SKILL' | 'TOOL' | 'TECHNOLOGY' | 'PLATFORM' | 'LANGUAGE' | 'METHODOLOGY' | 'FUNCTIONAL_CAPABILITY' | 'DOMAIN';
  level: ExpertiseLevel;
  evidenceRelationship?: string;
}

export interface AchievementOutcomeRecord {
  id: string;
  title: string;
  category: 'QUANTIFIED' | 'QUALITATIVE' | 'BUSINESS' | 'OPERATIONAL' | 'CUSTOMER_USER' | 'EFFICIENCY' | 'AWARD_RECOGNITION' | 'OTHER';
  metric?: string;
  context: string;
  action?: string;
  outcome?: string;
  evidence: string;
  verificationStatus?: 'VERIFIED' | 'SELF_REPORTED' | 'DOCUMENTED_EVIDENCE' | 'REQUIRES_CONFIRMATION';
}

export interface LeadershipOwnershipRecord {
  id: string;
  title: string;
  ownershipType: 
    | 'TEAM_LEADERSHIP' 
    | 'INDIVIDUAL_OWNERSHIP' 
    | 'CROSS_FUNCTIONAL' 
    | 'STAKEHOLDER_MGMT' 
    | 'DECISION_MAKING' 
    | 'PLANNING' 
    | 'DELIVERY' 
    | 'MENTORING' 
    | 'PROCESS_OWNERSHIP' 
    | 'TECHNICAL_OWNERSHIP' 
    | 'OPERATIONAL_OWNERSHIP' 
    | 'QUALITY_OWNERSHIP'
    | 'ESCALATION_HANDLING';
  teams?: string;
  stakeholders?: string;
  decisionOwnership?: string;
  crossFunctionalWork?: string;
  mentoringScope?: string;
  deliveryOwnership?: string;
  productOwnership?: string;
  escalationHandling?: string;
  governanceScope?: string;
  description: string;
  evidence?: string;
}

export interface InfluencesMethodsRecord {
  name: string;
  category: 'PRINCIPLE' | 'FRAMEWORK' | 'METHOD' | 'TECHNICAL_PATTERN' | 'INDUSTRY_PRACTICE' | 'BOOK' | 'MENTOR' | 'PREVIOUS_EXPERIENCE' | 'OTHER';
  description: string;
}

export interface ClaimsDiscipline {
  supportedClaims: string[];
  unsupportedClaims: string[];
  missingEvidence: string[];
  missingMetrics: string[];
  unverifiedInformation: string[];
  candidateRestrictions: string[];
  excludedPresentations: string[];
  verificationRequired: string[];
}

export interface MasterCareerProfile {
  id: string;
  candidateName: string;
  primaryProfession: string;
  corePositioning: string;
  workingMethod: string;
  location: string;
  workAuthorisation: string;
  rawText: string;
  personalDetails?: CandidatePersonalDetails;
  sourceDocument?: {
    fileName: string;
    fileType: 'pdf' | 'docx' | 'txt' | 'text';
    fileSize?: number;
    uploadedAt: string;
  };
  structuredData: {
    personalDetails?: CandidatePersonalDetails;
    education: EducationRecord[];
    certifications: CertificationRecord[];
    portfolio?: PortfolioRecord[];
    industryDomains?: IndustryDomainRecord[];
    employmentHistory: EmploymentRecord[];
    currentWork?: CurrentWorkRecord[];
    projectsOrProducts: ProjectOrProductRecord[];
    skills: { category: string; items: string[] }[];
    tools: string[];
    domains: string[];
    achievements?: AchievementOutcomeRecord[];
    challengesSolutions?: ChallengeSolutionRecord[];
    influencesMethods?: InfluencesMethodsRecord[];
    leadershipOwnership: string[] | LeadershipOwnershipRecord[];
    claimsDiscipline?: ClaimsDiscipline;
    strictBoundaries: string[];
  };
  lastModifiedAt?: string;
  derivedMaterialsOutdated?: boolean;
  materialsOutdatedReason?: string;
  updatedAt: string;
}

// MasterProfile is the alias for MasterCareerProfile for universal use
export type MasterProfile = MasterCareerProfile;

// Section 36: Full Job-Specific Application Package
export interface JobApplicationPackage {
  jobId: string;
  tailoredCV: JobSpecificCV;
  coverLetter: string;
  applicationQuestions: {
    question: string;
    suggestedAnswer: string;
    groundedEvidence: string[];
    evidenceGapFlag?: string;
    candidateApproved?: boolean;
  }[];
  applicationAudit: {
    sourceVariantName: string;
    requirementsAddressed: number;
    totalRequirements: number;
    evidenceUsed: string[];
    alignedKeywords: string[];
    missingEvidence: string[];
    unsupportedClaimsCheck: boolean;
    candidateApprovalStatus: 'PENDING' | 'APPROVED' | 'MODIFIED';
  };
  createdAt: string;
  updatedAt: string;
}

// Section 4: CV Variant Library
export interface CVVariant {
  id: string;
  fileName: string;
  userDefinedName: string;
  description?: string;
  rawText: string;
  parsedSections: { title: string; content: string }[];
  highlightedSkills: string[];
  highlightedExperiences: string[];
  pathwayId?: string;
  approvedRoleFamily?: string;
  approvedTargetDomains?: string[];
  evidenceEmphasis?: string[];
  terminologyPreferences?: string[];
  candidateApproved?: boolean;
  isActive: boolean;
  uploadedAt: string;
  updatedAt: string;
}

// Master CV (Comprehensive representation from Master Job Profile + Editorial Preferences)
export interface MasterCV {
  id: string;
  sourceProfileId: string;
  title: string;
  candidateName: string;
  contactInfo?: string;
  professionalSummary: string;
  sections: { heading: string; items: string[] }[];
  fullMarkdown: string;
  candidateApproved: boolean;
  generatedAt: string;
  updatedAt: string;
}

// Section 6: Candidate Preferences & Constraints
export type RemotePreference =
  | 'REMOTE_ONLY'
  | 'REMOTE_PREFERRED'
  | 'REMOTE_OK'
  | 'HYBRID_OK'
  | 'FLEXIBLE'
  | 'ONSITE_OK';

export type TransferabilityPolicy =
  | 'STRICT'
  | 'MODERATE'
  | 'FLEXIBLE'
  | 'CONSERVATIVE'
  | 'BALANCED'
  | 'AGGRESSIVE';

export interface JobPreferences {
  targetRoles: string[];
  targetSeniority: string[];
  targetDomains?: string[];
  targetIndustries?: string[];
  preferredIndustries: string[];
  excludedIndustries: string[];
  preferredLocations: string[];
  remotePreference: RemotePreference;
  eligibleCountries: string[];
  workAuthorizationCountries?: string[];
  workAuthorizations: string[];
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string;
  salaryPeriod?: 'HOUR' | 'MONTH' | 'YEAR' | 'CONTRACT' | 'UNSPECIFIED';
  salaryExpectation?: string;
  employmentTypes?: string[];
  excludedJobTypes: string[];
  maxApplicationFee: number;
  willingToRelocate: boolean;
  preferredTerminology?: string[];
  avoidedTerminology?: string[];
  terminologyPreferences?: { prefer: string[]; avoid: string[] };
  transferabilityPolicy?: TransferabilityPolicy;
  evidenceEmphasis?: string[];
  evidenceExclusions?: string[];
  otherSearchConstraints?: string[];
  notes?: string;
}

export interface CareerPathway {
  id: string;
  title: string;
  roleFamily: string;
  targetSeniority: string;
  rationale: string;
  supportingEvidence: string[];
  gaps: string[];
  isApproved: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  source: 'AI_SUGGESTED' | 'USER_DEFINED';
  createdAt: string;
}

export interface JobSpecificCV {
  id: string;
  jobId: string;
  sourceVariantId: string;
  sourceVariantName: string;
  tailoredSummary: string;
  tailoredContent: string;
  changesMade: string[];
  alignedKeywords: string[];
  unsupportedClaimsCheck: boolean; // true = 0 false/unsupported claims
  generatedAt: string;
  candidateApproved: boolean;
}

export interface TaskModelConfig {
  extractionModel: string;
  matchingModel: string;
  generationModel: string;
  parsingModel?: string;
  temperature: number;
}

export interface AITaskLogEntry {
  id: string;
  timestamp: string;
  task: string;
  model: string;
  latencyMs: number;
  status: 'SUCCESS' | 'FALLBACK' | 'ERROR';
  details?: string;
  taskVersion?: number;
}

export type AITaskId = 
  | 'master_cv_generation'
  | 'cv_variant_generation'
  | 'tailored_cv_generation'
  | 'candidate_profile_extraction'
  | 'cv_extraction'
  | 'dossier_extraction'
  | 'document_parsing'
  | 'jd_extraction'
  | 'requirement_extraction'
  | 'requirement_classification'
  | 'job_evaluation'
  | 'semantic_matching'
  | 'transferability_analysis'
  | 'career_pathway_suggestions'
  | 'cover_letter_generation'
  | 'application_qa_generation'
  | 'email_job_extraction';

export interface AITaskVersion {
  version: number;
  createdAt: string;
  systemPrompt: string;
  taskInstructions: string;
  assignedModel: string;
  temperature: number;
  notes?: string;
}

export interface AITaskConfig {
  id: string;
  taskId: AITaskId;
  name: string;
  description: string;
  purpose: string;
  permittedInputs: string[];
  expectedOutput: string;
  factualGroundingRules: string[];
  validationRequirements: string[];
  systemPrompt: string;
  taskInstructions: string;
  assignedModel: string;
  fallbackModel: string;
  temperature: number;
  enabled: boolean;
  activeVersion: number;
  versionHistory: AITaskVersion[];
}

export type IntegrationStatus = 
  | 'CONFIGURED'
  | 'CONNECTED'
  | 'OPERATIONAL'
  | 'UNAVAILABLE'
  | 'REQUIRES_AUTH'
  | 'UNSUPPORTED';

export interface IntegrationConfig {
  id: string;
  name: string;
  category: 'EMAIL' | 'STORAGE' | 'AI_PROVIDER' | 'SPREADSHEET' | 'JOB_BOARD' | 'SYSTEM';
  status: IntegrationStatus;
  description: string;
  endpointOrAccount?: string;
  lastChecked?: string;
  authScopes?: string[];
  statusMessage?: string;
}

// Full Job entity
export interface Job {
  id: string;
  sourceEmailId?: string;
  source: string;
  allSources?: string[];
  title: string;
  company: string;
  location: string;
  remoteEligibility: RemoteEligibility;
  employmentType: string;
  description: string;
  jobUrl: string;
  cleanUrl?: string; // stripped of tracking parameters
  applicationUrl?: string;
  applicationRoute: ApplicationRoute;
  routeDetails?: string;
  routeAnalysis: RouteAnalysis;
  postingDate: string;
  discoveredDate: string;
  deadline?: string;
  freshnessAnalysis: FreshnessAnalysis;
  jdRetrievalStatus: JDRetrievalStatus;
  parserConfidence: ParserConfidence;
  missingFields: string[];
  
  // Duplication tracking
  duplicateGroup?: string;
  isDuplicate?: boolean;
  duplicateOfId?: string;

  // Evaluation & Decision
  score: ScoreBreakdown;
  detailedScores: DetailedScores;
  evidenceCoverage: EvidenceCoverage;
  applyGate: ApplyGateResult;
  seniorityAnalysis: SeniorityAnalysis;
  requirementEvaluations: RequirementEvaluation[];

  // Explanations
  decision: JobDecision;
  decisionReason: string;        // "Why this decision?"
  whyNotApply: string[];         // "Why NOT Apply?" panel
  whyItFits: string[];           // "Why It Fits" panel
  hardNoGoReasons: string[];
  isHardNoGo: boolean;
  hardRejectionReasons: string[];
  reviewReasons: string[];
  decisionOverrideReason?: string;
  
  // CV & Materials
  selectedCVId?: string;
  cvRankings?: CVRanking[];
  targetCV: string; // CV Variant ID or Name
  cvRationale: string;
  status: JobStatus;
  evidenceMatch: EvidenceMatchOutput;
  applicationMaterials?: ApplicationMaterials;
  jobSpecificCV?: JobSpecificCV;
  
  // Human tracking & overrides
  notes?: string;
  userDecisionModified?: boolean;
  overrideHistory?: OverrideRecord[];
  
  // Provenance, Freshness & Lifecycle Audit
  provenanceLabel?: string;      // e.g. 'Quick Job-Site Match', 'Scheduled Job-Site Match', 'Manual URL', 'Manual Email', 'Automated Email Alert'
  firstSeen?: string;
  lastSeen?: string;
  externalJobId?: string;
  isStale?: boolean;
  isClosed?: boolean;
  lostReason?: string;
  pipelineHistory?: ApplicationAuditEntry[];
  reEncounterCount?: number;

  createdAt: string;
  updatedAt: string;
}

export interface SourceEmail {
  id: string;
  source: string;
  sender: string;
  subject: string;
  receivedDate: string;
  rawContent: string;
  processedStatus: 'PENDING' | 'PROCESSED' | 'PARSING_REQUIRED' | 'FAILED';
  extractedJobCount: number;
  extractedJobIds?: string[];
  notes?: string;
}

export interface DiscoveryScheduleSettings {
  quickMatchEnabled: boolean;
  dailyScheduleEnabled: boolean;
  dailyScheduleTime: string; // e.g. "09:00"
  weeklyScheduleEnabled: boolean;
  weeklyScheduleDay: string;  // e.g. "Monday"
  weeklyScheduleTime: string; // e.g. "09:00"
  lastScheduledRun?: string;
}

export interface SystemSettings {
  minApplyScore: number;       // default 85
  minReviewScore: number;      // default 70
  targetLocation: string;      // default 'Nigeria / Remote'
  allowWorldwideRemote: boolean;
  strictNigeriaAuthorisation: boolean;
  autoSelectCV: boolean;
  rejectPaidApplications: boolean;
  useAIInterpretation: boolean; // whether to invoke AIProvider for nuanced interpretation
  taskModels: TaskModelConfig;
  discoverySettings?: DiscoveryScheduleSettings;
}
