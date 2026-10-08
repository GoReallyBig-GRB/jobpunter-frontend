import {
  Job,
  ScoreBreakdown,
  DetailedScores,
  JobDecision,
  RemoteEligibility,
  ApplicationRoute,
  RouteAnalysis,
  FreshnessAnalysis,
  SeniorityAnalysis,
  RequirementEvaluation,
  EvidenceCoverage,
  ApplyGateResult,
  ApplyGateCheck,
  ParserConfidence,
  EvidenceMatchOutput,
  ApplicationMaterials,
  SystemSettings,
  MasterProfile,
  CVVariant,
  JobPreferences,
  CVRanking,
  JDRetrievalStatus
} from '../types/job';
import { aiProvider } from './aiProvider';
import { PRESET_PRODUCT_MANAGER } from '../data/candidatePresets';

export const DEFAULT_SETTINGS: SystemSettings = {
  minApplyScore: 85,
  minReviewScore: 70,
  targetLocation: "Nigeria / Remote",
  allowWorldwideRemote: true,
  strictNigeriaAuthorisation: true,
  autoSelectCV: true,
  rejectPaidApplications: true,
  useAIInterpretation: true,
  taskModels: {
    extractionModel: 'gemini-2.5-flash',
    matchingModel: 'gemini-2.5-flash',
    generationModel: 'gemini-2.5-flash',
    parsingModel: 'gemini-2.5-flash',
    temperature: 0.1
  },
  discoverySettings: {
    quickMatchEnabled: true,
    dailyScheduleEnabled: false,
    dailyScheduleTime: '09:00',
    weeklyScheduleEnabled: false,
    weeklyScheduleDay: 'Monday',
    weeklyScheduleTime: '09:00'
  }
};

export interface RawJobInput {
  title?: string;
  company?: string;
  location?: string;
  source?: string;
  provenanceLabel?: string;
  externalJobId?: string;
  jobUrl?: string;
  applicationUrl?: string;
  description?: string;
  postingDate?: string;
  sourceEmailId?: string;
  jdRetrievalStatus?: JDRetrievalStatus;
}

/**
 * Extracts a stable external Job ID from common job portal URLs if available
 */
export function extractExternalJobId(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    // Lever: /jobs/<company>/<id>
    const leverMatch = u.pathname.match(/\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
    if (leverMatch) return `lever_${leverMatch[1]}`;
    // Greenhouse: /jobs/<id> or ?gh_jid=<id>
    const ghParam = u.searchParams.get('gh_jid');
    if (ghParam) return `greenhouse_${ghParam}`;
    const ghMatch = u.pathname.match(/\/jobs\/(\d+)/);
    if (ghMatch) return `greenhouse_${ghMatch[1]}`;
    // LinkedIn: /view/<id> or ?currentJobId=<id>
    const liParam = u.searchParams.get('currentJobId');
    if (liParam) return `linkedin_${liParam}`;
    const liMatch = u.pathname.match(/\/view\/(\d+)/);
    if (liMatch) return `linkedin_${liMatch[1]}`;
    // Indeed: ?jk=<id>
    const indeedParam = u.searchParams.get('jk');
    if (indeedParam) return `indeed_${indeedParam}`;
    return undefined;
  } catch {
    return undefined;
  }
}

export function deriveProvenanceLabel(source?: string, url?: string): string {
  if (!source) return 'Quick Job-Site Match';
  const s = source.toLowerCase();
  if (s.includes('scheduled')) return 'Scheduled Job-Site Match';
  if (s.includes('automated') || s.includes('gas') || s.includes('alert api')) return 'Automated Email Alert';
  if (s.includes('email') || s.includes('alert')) return 'Manual Email';
  if (s.includes('url') || (url && url.startsWith('http'))) return 'Manual URL';
  if (s.includes('quick')) return 'Quick Job-Site Match';
  return 'Quick Job-Site Match';
}

/**
 * Strips URL of tracking parameters (utm_*, ref, trackingId, etc.) for clean deduplication (Section 19)
 */
export function sanitizeJobUrl(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url.trim());
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'refId', 'trackingId', 'trk', 'fbclid', 'gclid'];
    trackingParams.forEach(param => parsed.searchParams.delete(param));
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return url.trim().replace(/[?&]utm_.*$/, '').replace(/\/+$/, '');
  }
}

/**
 * 1. Parser Confidence & Missing Fields
 */
export function evaluateParserConfidence(input: RawJobInput): {
  confidence: ParserConfidence;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  const title = input.title?.trim() || "";
  const company = input.company?.trim() || "";
  const jobUrl = input.jobUrl?.trim() || "";
  const description = input.description?.trim() || "";

  if (!title) missingFields.push("Job Title");
  if (!company) missingFields.push("Company Name");
  if (!jobUrl) missingFields.push("Job / Application URL");
  
  if (!description) {
    missingFields.push("Job Description");
  } else if (description.length < 80) {
    missingFields.push("Meaningful Job Description (content too brief to assess)");
  }

  if (missingFields.length === 0) {
    return { confidence: 'HIGH', missingFields: [] };
  } else if (missingFields.length === 1 && !missingFields.includes("Job Title") && !missingFields.includes("Company Name")) {
    return { confidence: 'MEDIUM', missingFields };
  } else {
    return { confidence: 'LOW', missingFields };
  }
}

/**
 * 2. Candidate-Agnostic Location & Work Authorization Analysis (Section 6)
 */
export function evaluateLocationAndWorkAuth(
  locationStr: string,
  desc: string,
  preferences: JobPreferences
): { 
  eligibility: RemoteEligibility; 
  score: number; 
  notes: string; 
  hardReject: boolean;
  hardNoGoReason?: string;
} {
  const text = `${locationStr} ${desc}`.toLowerCase();
  const eligibleCountries = preferences.eligibleCountries.map(c => c.toLowerCase());
  const workAuths = preferences.workAuthorizations.map(w => w.toLowerCase());

  // Check explicit foreign citizenship requirements that candidate does not possess
  const requiresUSCitizen = /us citizen|u\.s\. citizen|united states citizen only|green card only|must be located in the us|us work authorization required/i.test(text);
  const requiresUKCitizen = /uk right to work|uk citizen only|must be based in the uk/i.test(text);
  const requiresEUCitizen = /eu right to work|eu passport|must be resident in eu/i.test(text);

  const candidateHasUS = workAuths.some(w => w.includes('us') || w.includes('united states'));
  const candidateHasUK = workAuths.some(w => w.includes('uk') || w.includes('united kingdom'));
  const candidateHasEU = workAuths.some(w => w.includes('eu') || w.includes('european'));

  if (requiresUSCitizen && !candidateHasUS && !/open to international|worldwide/i.test(text)) {
    return {
      eligibility: 'REGION_RESTRICTED',
      score: 0,
      notes: "Mandatory US work authorization required. Candidate does not possess US work authorization.",
      hardReject: true,
      hardNoGoReason: "Mandatory work authorization restricted to US citizens/residents."
    };
  }

  if (requiresUKCitizen && !candidateHasUK && !/worldwide/i.test(text)) {
    return {
      eligibility: 'REGION_RESTRICTED',
      score: 0,
      notes: "Mandatory UK work authorization required. Candidate does not possess UK right-to-work.",
      hardReject: true,
      hardNoGoReason: "Mandatory work authorization restricted to UK residents."
    };
  }

  if (requiresEUCitizen && !candidateHasEU && !/worldwide/i.test(text)) {
    return {
      eligibility: 'REGION_RESTRICTED',
      score: 0,
      notes: "Mandatory EU right to work required.",
      hardReject: true,
      hardNoGoReason: "Mandatory work authorization restricted to EU residents."
    };
  }

  // Check if job matches candidate's eligible countries
  const matchesCandidateCountry = eligibleCountries.some(c => text.includes(c));
  const isWorldwideRemote = /remote.*(worldwide|global|anywhere)|worldwide remote|work from anywhere|all countries welcome|open to international/i.test(text);
  const genericRemote = /remote/i.test(locationStr) || /100% remote|fully remote/i.test(text);

  if (matchesCandidateCountry) {
    return {
      eligibility: 'NIGERIA_OK',
      score: 20,
      notes: `Direct match: Role is based in or explicitly welcomes candidates in ${preferences.eligibleCountries.join(', ')}.`,
      hardReject: false
    };
  }

  if (isWorldwideRemote) {
    return {
      eligibility: 'WORLDWIDE_REMOTE',
      score: 18,
      notes: "Worldwide Remote: Role explicitly welcomes global international candidates.",
      hardReject: false
    };
  }

  if (genericRemote) {
    if (preferences.remotePreference === 'REMOTE_ONLY' || preferences.remotePreference === 'REMOTE_OK') {
      return {
        eligibility: 'UNCLEAR',
        score: 10,
        notes: "Listed as 'Remote' without stating international geographic eligibility. Conservative check requires human verification.",
        hardReject: false
      };
    }
  }

  // Check On-site constraints
  const foreignOnsite = /san francisco|new york|london|berlin|toronto|sydney|dublin|amsterdam|singapore/i.test(text);
  if (foreignOnsite && !genericRemote && !matchesCandidateCountry && !preferences.willingToRelocate) {
    return {
      eligibility: 'HYBRID_ONSITE',
      score: 0,
      notes: "On-site or hybrid role in foreign jurisdiction. Candidate is not willing to relocate without remote allowance.",
      hardReject: true,
      hardNoGoReason: "On-site foreign location requirement without international remote allowance."
    };
  }

  return {
    eligibility: 'UNCLEAR',
    score: 8,
    notes: "Location eligibility unclear. Verify before applying.",
    hardReject: false
  };
}

/**
 * 3. Application Route & Fee Verification ($0 Policy / Cost Rules)
 */
export function evaluateApplicationRoute(
  jobUrl: string,
  appUrl: string,
  desc: string,
  preferences: JobPreferences
): RouteAnalysis {
  const urlCombined = `${jobUrl} ${appUrl}`.toLowerCase();
  const descLower = desc.toLowerCase();

  // Paid application check against candidate fee preference (default: 0)
  const isPaid = /pay to apply|application fee|paid subscription required|premium members only|remote rocketship subscription|fee of \$|fee of \€|unlock application|deposit required/i.test(descLower) ||
    /subscribe.*to apply/i.test(descLower) ||
    urlCombined.includes("paid-remote-jobs");

  if (isPaid && preferences.maxApplicationFee === 0) {
    return {
      status: 'HARD_REJECT',
      routeType: "Paid Application Gate / Aggregator Paywall",
      evidence: "Job listing or URL explicitly demands payment or subscription to submit an application.",
      verificationStatus: "Blocked ($0 application policy violation)",
      score: 0
    };
  }

  // Free Enterprise ATS
  const isEnterpriseATS = /greenhouse\.io|lever\.co|workable\.com|ashbyhq\.com|bamboohr\.com|smartrecruiters\.com|applytojob\.com|jobvite\.com|recruitee\.com|rippling\.com/i.test(urlCombined);
  if (isEnterpriseATS) {
    return {
      status: 'GOOD',
      routeType: "Direct Free Enterprise ATS (Greenhouse / Lever / Ashby / Workable)",
      evidence: `Direct enterprise ATS portal (${urlCombined.split('?')[0].split('/').slice(0, 3).join('/')})`,
      verificationStatus: "Verified Free Route",
      score: 10
    };
  }

  // Reputable free platforms
  const isDirectBoard = /linkedin\.com\/jobs|indeed\.com|jobberman\.com|weworkremotely\.com|wellfound\.com/i.test(urlCombined);
  if (isDirectBoard) {
    return {
      status: 'GOOD',
      routeType: "Reputable Free Job Platform",
      evidence: "Direct listing on legitimate free recruitment board.",
      verificationStatus: "Free Platform Listing",
      score: 8
    };
  }

  // Official employer careers portal
  if (urlCombined.includes("careers") || urlCombined.includes("jobs.")) {
    return {
      status: 'GOOD',
      routeType: "Official Employer Careers Page",
      evidence: "Hosted on company's verified domain careers subpage.",
      verificationStatus: "Verified Employer Route",
      score: 9
    };
  }

  if (!urlCombined.trim()) {
    return {
      status: 'REVIEW',
      routeType: "Missing Application Destination",
      evidence: "No valid job or ATS URL supplied.",
      verificationStatus: "Unverified (Requires manual destination check)",
      score: 2
    };
  }

  return {
    status: 'REVIEW',
    routeType: "Third-party Aggregator / Unknown Redirect",
    evidence: "URL directs through an unfamiliar aggregator or redirect link.",
    verificationStatus: "Unverified Third-party Route",
    score: 5
  };
}

/**
 * 4. Job Freshness Evaluation
 */
export function evaluateFreshness(postingDateStr?: string, desc?: string): FreshnessAnalysis {
  const dLower = (desc || '').toLowerCase();

  if (/this job is closed|no longer accepting applications|expired job|position filled/i.test(dLower)) {
    return {
      status: 'CLOSED_EXPIRED',
      postingDate: postingDateStr || 'Unknown',
      warning: "Role is explicitly marked as closed or no longer accepting applications.",
      score: 0
    };
  }

  if (!postingDateStr) {
    return {
      status: 'AGE_UNCERTAIN',
      postingDate: 'Not specified',
      warning: "Posting date was not extracted from alert. Verify role is still active before applying.",
      score: 6
    };
  }

  try {
    const postDate = new Date(postingDateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      return {
        status: 'STALE',
        postingDate: postingDateStr,
        daysSincePosted: diffDays,
        warning: `Posting is ${diffDays} days old (>30 days). Likely in advanced interviewing stages or stale.`,
        score: 3
      };
    } else if (diffDays <= 7) {
      return {
        status: 'RECENTLY_POSTED',
        postingDate: postingDateStr,
        daysSincePosted: diffDays,
        score: 10
      };
    } else {
      return {
        status: 'CURRENT_ACTIVE',
        postingDate: postingDateStr,
        daysSincePosted: diffDays,
        score: 8
      };
    }
  } catch {
    return {
      status: 'AGE_UNCERTAIN',
      postingDate: postingDateStr,
      warning: "Unparseable date format.",
      score: 6
    };
  }
}

/**
 * 5. Candidate-Agnostic Seniority & Role Scope Assessment (Section 16)
 */
export function evaluateSeniority(
  title: string,
  desc: string,
  masterProfile: MasterProfile,
  preferences: JobPreferences
): SeniorityAnalysis {
  const t = title.toLowerCase();
  const d = desc.toLowerCase();

  const candidateLevel = `${masterProfile.primaryProfession} with documented experience in: ${masterProfile.structuredData?.leadershipOwnership?.join('; ') || 'Squad / Operational Ownership'}`;

  // Check for excessive organizational executive hierarchy (Section 8)
  const isExecutiveTitle = /director|vp of|vice president|c-level|chief|head of/i.test(t);
  const managesMassiveTeam = /manage a team of (?:1[0-9]|[2-9][0-9])|supervising directors|managing 15\+|managing 20\+/i.test(d);
  const extremeYears = /(?:12\+|15\+|20\+)\s*years/i.test(d);

  if (isExecutiveTitle && (managesMassiveTeam || extremeYears)) {
    return {
      requiredSeniority: "Executive Director / VP managing large multi-tier department with 12+ years required",
      candidateDocumentedLevel: candidateLevel,
      seniorityGap: "Materially excessive management scope (requires supervising multiple management tiers or institutional governance). Exceeds candidate's documented level.",
      isMaterial: true,
      decisionImpact: "HARD_NO_GO: Organizational hierarchy materially exceeds candidate profile.",
      score: 2
    };
  }

  if (isExecutiveTitle) {
    return {
      requiredSeniority: "Director / Head of (Scope unverified)",
      candidateDocumentedLevel: candidateLevel,
      seniorityGap: "Executive title. Requires manual verification of whether the role is hands-on or organizational management.",
      isMaterial: false,
      decisionImpact: "REVIEW: Check actual squad vs organizational management responsibility.",
      score: 8
    };
  }

  // Check preference match for target seniority
  const matchesPreferredSeniority = preferences.targetSeniority.some(s => t.includes(s.toLowerCase()));

  return {
    requiredSeniority: title,
    candidateDocumentedLevel: candidateLevel,
    seniorityGap: matchesPreferredSeniority ? "Direct match with candidate's target seniority preferences." : "Within realistic professional execution scope.",
    isMaterial: false,
    decisionImpact: "SUPPORTED: Scope aligns with candidate's documented experience.",
    score: 15
  };
}

/**
 * 6. JD Retrieval Status Determination (Section 8)
 */
export function determineJDRetrievalStatus(input: RawJobInput): JDRetrievalStatus {
  if (input.jdRetrievalStatus) return input.jdRetrievalStatus;

  const desc = input.description?.trim() || "";
  const url = input.jobUrl?.trim() || "";

  if (/closed|no longer accepting/i.test(desc)) return 'CLOSED';
  if (!url) return 'REQUIRES_REVIEW';
  if (desc.length > 300) return 'FULL_JD_RETRIEVED';
  if (desc.length > 80) return 'PARTIAL_JD_RETRIEVED';
  return 'JD_UNAVAILABLE';
}

/**
 * 7. Candidate-Agnostic Master Evaluation Pipeline (Section 1 to 37)
 */
export async function evaluateJobCandidateAgnostic(
  input: RawJobInput,
  masterProfile: MasterProfile,
  activeCVs: CVVariant[],
  preferences: JobPreferences,
  settings: SystemSettings = DEFAULT_SETTINGS
): Promise<Job> {
  const now = new Date().toISOString();
  const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanUrl = sanitizeJobUrl(input.jobUrl || "");

  // 1. Parser Confidence & Missing Fields
  const { confidence, missingFields } = evaluateParserConfidence(input);

  // 2. JD Retrieval Status (Section 8)
  const jdRetrievalStatus = determineJDRetrievalStatus(input);

  // 3. Location & Work Auth (Section 6)
  const locResult = evaluateLocationAndWorkAuth(input.location || "", input.description || "", preferences);

  // 4. Application Route & Fee Verification (Section 9)
  const routeAnalysis = evaluateApplicationRoute(cleanUrl, sanitizeJobUrl(input.applicationUrl || ""), input.description || "", preferences);

  // 5. Job Freshness (Section 10)
  const freshnessAnalysis = evaluateFreshness(input.postingDate, input.description || "");

  // 6. Seniority & Scope Assessment (Section 16)
  const seniorityAnalysis = evaluateSeniority(input.title || "", input.description || "", masterProfile, preferences);

  // 7. Check Excluded Job Types & Industries (Section 6)
  const combinedText = `${input.title} ${input.description}`.toLowerCase();
  const hardNoGoReasons: string[] = [];

  for (const excludedType of preferences.excludedJobTypes) {
    if (excludedType.trim() && combinedText.includes(excludedType.toLowerCase())) {
      hardNoGoReasons.push(`Role matches candidate's explicitly excluded job type: '${excludedType}'`);
    }
  }

  for (const excludedIndustry of preferences.excludedIndustries) {
    if (excludedIndustry.trim() && combinedText.includes(excludedIndustry.toLowerCase())) {
      hardNoGoReasons.push(`Role belongs to candidate's explicitly excluded industry: '${excludedIndustry}'`);
    }
  }

  // Check candidate exclusions for sales / cold calling / commission
  const isOutboundSalesRole = /cold call|quota-carrying|outbound business development|sales commission|sales specialist|sdr position|bdr position/i.test(combinedText);
  const candidateExcludesSales = (preferences.excludedJobTypes || []).some(t => /sales|sdr|bdr|cold call|commission/i.test(t)) ||
                                (preferences.excludedIndustries || []).some(i => /sales/i.test(i));
  if (isOutboundSalesRole && candidateExcludesSales) {
    hardNoGoReasons.push("Role involves outbound quota-carrying sales / SDR tasks, which is explicitly excluded in candidate's career preferences.");
  }

  if (locResult.hardNoGoReason) hardNoGoReasons.push(locResult.hardNoGoReason);
  if (routeAnalysis.status === 'HARD_REJECT') hardNoGoReasons.push(routeAnalysis.evidence);
  if (freshnessAnalysis.status === 'CLOSED_EXPIRED') hardNoGoReasons.push("Job is explicitly closed or expired.");
  if (seniorityAnalysis.isMaterial) hardNoGoReasons.push(seniorityAnalysis.seniorityGap);

  // 8. Modular AI Extraction & Mapping (Section 9, 10, 14)
  const extractedRequirements = await aiProvider.extractJobRequirements(input.description || "", input.title);
  const requirementEvaluations = await aiProvider.mapRequirementsToEvidence(extractedRequirements, masterProfile);

  // Calculate Evidence Coverage
  const materialReqs = requirementEvaluations.filter(r => r.severity === 'MUST_HAVE');
  const directMatches = requirementEvaluations.filter(r => r.status === 'DIRECT');
  const transferableMatches = requirementEvaluations.filter(r => r.status === 'TRANSFERABLE' || r.status === 'STRONG_TRANSFERABLE');
  const missingMaterial = materialReqs.filter(r => r.status === 'MISSING' || r.status === 'DISQUALIFYING' || r.status === 'CONTRADICTED');

  if (missingMaterial.length > 0) {
    missingMaterial.forEach(m => {
      if (m.severity === 'MUST_HAVE' && m.isMaterialGap && (m.status === 'DISQUALIFYING' || m.status === 'CONTRADICTED')) {
        hardNoGoReasons.push(`Material MUST-HAVE requirement contradicted by Master Profile: '${m.requirement}'`);
      }
    });
  }

  const coverage: EvidenceCoverage = {
    totalMaterialCount: materialReqs.length,
    supportedMaterialCount: materialReqs.filter(r => r.status === 'DIRECT' || r.status === 'TRANSFERABLE' || r.status === 'STRONG_TRANSFERABLE').length,
    directMatchesCount: directMatches.length,
    transferableMatchesCount: transferableMatches.length,
    missingMaterialCount: missingMaterial.length,
    hardBlockersCount: hardNoGoReasons.length,
    verificationRequiredCount: requirementEvaluations.filter(r => r.status === 'PARTIAL' || r.status === 'REQUIRES_VERIFICATION').length
  };

  // 9. Separate Core Role Fit from Domain Fit (Section 15)
  const roleReqs = requirementEvaluations.filter(r => r.category === 'ROLE_CORE' || r.category === 'SENIORITY' || !r.category);
  const domainReqs = requirementEvaluations.filter(r => r.category === 'DOMAIN' || r.category === 'TECHNICAL');

  const coreRoleSupported = roleReqs.filter(r => r.status === 'DIRECT' || r.status === 'TRANSFERABLE' || r.status === 'STRONG_TRANSFERABLE').length;
  const corePMScore = roleReqs.length > 0 ? Math.round((coreRoleSupported / roleReqs.length) * 100) : 70;

  const domainSupported = domainReqs.filter(r => r.status === 'DIRECT' || r.status === 'STRONG_TRANSFERABLE' || r.status === 'TRANSFERABLE').length;
  const domainScore = domainReqs.length > 0 ? Math.round((domainSupported / domainReqs.length) * 100) : 85;

  // 10. Run 10-Point Apply Gate (Section 14)
  const isHardNoGo = hardNoGoReasons.length > 0;
  const checklist: ApplyGateCheck[] = [
    {
      ruleNumber: 1,
      name: "Role is not in candidate's excluded job types",
      passed: !hardNoGoReasons.some(r => r.includes("excluded job type") || r.includes("excluded industry")),
      details: "Confirmed position is within candidate's permitted job categories."
    },
    {
      ruleNumber: 2,
      name: "No hard rejection / Hard NO-GO triggers",
      passed: hardNoGoReasons.length === 0,
      details: hardNoGoReasons.length === 0 ? "No hard blockers identified." : `Hard blocker active: ${hardNoGoReasons[0]}`
    },
    {
      ruleNumber: 3,
      name: "Location and work authorization confirmed",
      passed: locResult.eligibility === 'NIGERIA_OK' || locResult.eligibility === 'WORLDWIDE_REMOTE',
      details: locResult.notes
    },
    {
      ruleNumber: 4,
      name: "Application route is free and accessible",
      passed: routeAnalysis.status === 'GOOD',
      details: routeAnalysis.evidence
    },
    {
      ruleNumber: 5,
      name: "No material MUST-HAVE requirement is unsupported",
      passed: missingMaterial.length === 0,
      details: missingMaterial.length === 0 ? "All MUST-HAVE requirements satisfied." : `${missingMaterial.length} MUST-HAVE requirement(s) missing.`
    },
    {
      ruleNumber: 6,
      name: "Candidate has meaningful direct evidence for central responsibilities",
      passed: directMatches.length > 0 && corePMScore >= 60,
      details: directMatches.length > 0 ? `Verified ${directMatches.length} direct evidence match(es).` : "Lacks direct documented evidence."
    },
    {
      ruleNumber: 7,
      name: "Seniority is realistically within documented scope",
      passed: !seniorityAnalysis.isMaterial && seniorityAnalysis.score >= 10,
      details: seniorityAnalysis.decisionImpact
    },
    {
      ruleNumber: 8,
      name: "Job is not known to be closed or stale (>30 days)",
      passed: freshnessAnalysis.status !== 'CLOSED_EXPIRED' && freshnessAnalysis.status !== 'STALE',
      details: freshnessAnalysis.warning || "Posting is currently active."
    },
    {
      ruleNumber: 9,
      name: "Parser confidence is sufficient and full JD is retrieved",
      passed: confidence === 'HIGH' && jdRetrievalStatus !== 'JD_UNAVAILABLE',
      details: `Parser: ${confidence} | Retrieval: ${jdRetrievalStatus}`
    },
    {
      ruleNumber: 10,
      name: "Role is worth applying to based on factual Master Profile evidence",
      passed: domainScore >= 50 && hardNoGoReasons.length === 0,
      details: "Evidence verified against factual Master Profile."
    }
  ];

  const failedCheck = checklist.find(c => !c.passed);
  const applyGatePassed = !failedCheck;

  // 11. Calculate Granular Scores
  const detailedScores: DetailedScores = {
    roleLegitimacy: isHardNoGo ? 0 : 10,
    locationWorkAuth: locResult.score,
    appAccessibility: routeAnalysis.score,
    seniorityFit: seniorityAnalysis.score,
    coreRoleCapability: Math.round(corePMScore * 0.20),
    corePMCapability: Math.round(corePMScore * 0.20),
    technicalComplexity: 8,
    technicalProductComplexity: 8,
    domainRelevance: Math.round(domainScore * 0.15),
    evidenceStrength: Math.round(coverage.supportedMaterialCount >= 2 ? 18 : coverage.supportedMaterialCount === 1 ? 12 : 6),
    missingCriticalPenalty: coverage.missingMaterialCount > 0 ? -15 : 0,
    jobFreshness: freshnessAnalysis.score,
    coreRoleScore: corePMScore,
    corePMScore,
    domainScore,
    total: Math.max(0, Math.min(100,
      locResult.score +
      seniorityAnalysis.score +
      routeAnalysis.score +
      freshnessAnalysis.score +
      Math.round(corePMScore * 0.25) +
      Math.round(domainScore * 0.20) +
      (coverage.missingMaterialCount > 0 ? -15 : 0)
    ))
  };

  const score: ScoreBreakdown = {
    locationEligibility: locResult.score,
    coreEvidenceFit: Math.min(30, Math.round((corePMScore / 100) * 30)),
    seniorityFit: seniorityAnalysis.score,
    domainFit: Math.min(15, Math.round((domainScore / 100) * 15)),
    appAccessibility: routeAnalysis.score,
    roleAuthenticity: detailedScores.roleLegitimacy,
    total: detailedScores.total
  };

  // 12. Derive Decision & Human Explanations (Section 11, 19, 20)
  const whyNotApply: string[] = [];
  const whyItFits: string[] = [];
  const reviewReasons: string[] = [];

  if (hardNoGoReasons.length > 0) whyNotApply.push(...hardNoGoReasons);
  if (missingMaterial.length > 0) {
    missingMaterial.forEach(m => whyNotApply.push(`Missing MUST-HAVE: ${m.requirement}`));
  }
  if (locResult.eligibility === 'UNCLEAR') {
    whyNotApply.push("Remote location eligibility is not explicitly confirmed for candidate's location.");
    reviewReasons.push("Remote eligibility unverified.");
  }
  if (routeAnalysis.status === 'REVIEW') {
    whyNotApply.push(`Application route needs verification (${routeAnalysis.routeType}).`);
    reviewReasons.push("Application route unverified.");
  }
  if (freshnessAnalysis.status === 'STALE') {
    whyNotApply.push(`Posting is ${freshnessAnalysis.daysSincePosted} days old (>30 days). Likely closed.`);
  }

  directMatches.forEach(d => whyItFits.push(`${d.requirement}: Grounded in ${d.sourceProduct}.`));
  transferableMatches.forEach(t => whyItFits.push(`Transferable: ${t.requirement} (${t.sourceProduct}).`));

  let decision: JobDecision;
  let decisionReason: string;

  if (isHardNoGo) {
    decision = 'REJECT';
    decisionReason = `HARD NO-GO: ${hardNoGoReasons[0]}`;
  } else if (freshnessAnalysis.status === 'STALE') {
    decision = 'WATCH';
    decisionReason = `Posting is over 30 days old (${freshnessAnalysis.daysSincePosted} days). Placed on Watchlist to confirm active hiring before applying.`;
  } else if (score.total < settings.minReviewScore) {
    decision = 'REJECT';
    decisionReason = failedCheck
      ? `Rejected: Insufficient evidence score (${score.total}/100, min review threshold is ${settings.minReviewScore}). Failed gate: ${failedCheck.name} (${failedCheck.details})`
      : `Score (${score.total}/100) is below review threshold. Factual Master Profile lacks material evidence for role.`;
  } else if (confidence === 'LOW' || jdRetrievalStatus === 'JD_UNAVAILABLE') {
    decision = 'REVIEW';
    decisionReason = `Job details incomplete (Parser: ${confidence}, Retrieval: ${jdRetrievalStatus}). Human review required.`;
  } else if (applyGatePassed && score.total >= settings.minApplyScore) {
    decision = 'APPLY';
    decisionReason = `Strong evidence-backed fit: Validated against documented Master Profile. Passed all 10 Apply Gate verification checks.`;
  } else {
    decision = 'REVIEW';
    decisionReason = failedCheck
      ? `Held for REVIEW by Apply Gate: ${failedCheck.name} (${failedCheck.details})`
      : `Score (${score.total}/100) is in review range. ${reviewReasons[0] || 'Verification required.'}`;
  }

  // 13. Compare and Rank CV Variants (Section 21)
  const cvRankings = await aiProvider.rankCVVariants(requirementEvaluations, activeCVs, masterProfile);
  const topCV = cvRankings[0];
  const targetCV = topCV?.cvName || "Default Master Profile Presentation";
  const cvRationale = topCV?.explanation || "Selected based on requirement alignment.";

  // Initial Status
  let status: Job['status'] = 'NEW';
  if (decision === 'APPLY') status = 'READY_TO_APPLY';
  else if (decision === 'REVIEW') status = 'REVIEW';
  else if (decision === 'WATCH') status = 'WATCHLIST';
  else status = 'REJECTED';

  // Application Materials
  const selectedCVObj = activeCVs.find(cv => cv.id === topCV?.cvVariantId);
  const applicationMaterials = (decision === 'APPLY' || decision === 'REVIEW')
    ? await aiProvider.generateApplicationMaterials({
        id,
        company: input.company || "Company",
        title: input.title || "Position",
        remoteEligibility: locResult.eligibility
      } as Job, selectedCVObj, masterProfile, requirementEvaluations)
    : undefined;

  const evidenceMatchOutput: EvidenceMatchOutput = {
    direct: directMatches.map(d => ({ requirement: d.requirement, product: d.sourceProduct, evidence: d.candidateEvidence })),
    transferable: transferableMatches.map(t => ({ requirement: t.requirement, product: t.sourceProduct, capability: t.candidateEvidence, explanation: t.rationale })),
    missing: missingMaterial.map(m => ({ requirement: m.requirement, impact: m.rationale, isMaterial: m.isMaterialGap })),
    risks: whyNotApply.slice(0, 3).map(w => ({ title: "Requirement Gap", explanation: w, severity: 'MEDIUM' }))
  };

  return {
    id,
    sourceEmailId: input.sourceEmailId,
    source: input.source || 'Direct',
    allSources: input.source ? [input.source] : ['Direct'],
    title: input.title?.trim() || "Untitled Opportunity",
    company: input.company?.trim() || "Unknown Company",
    location: input.location?.trim() || "Remote",
    remoteEligibility: locResult.eligibility,
    employmentType: "Full-time",
    description: input.description || "",
    jobUrl: input.jobUrl || "",
    cleanUrl,
    applicationUrl: input.applicationUrl || input.jobUrl || "",
    applicationRoute: input.jobUrl?.includes("paid-remote") ? 'BLOCKED_PAID' : (routeAnalysis.status === 'GOOD' ? 'FREE_ATS' : 'REVIEW_UNKNOWN'),
    routeDetails: routeAnalysis.evidence,
    routeAnalysis,
    postingDate: input.postingDate || new Date().toISOString().split('T')[0],
    discoveredDate: now.split('T')[0],
    freshnessAnalysis,
    jdRetrievalStatus,
    parserConfidence: confidence,
    missingFields,
    score,
    detailedScores,
    evidenceCoverage: coverage,
    applyGate: {
      passed: applyGatePassed,
      checklist,
      failedRule: failedCheck ? `Rule #${failedCheck.ruleNumber}: ${failedCheck.name}` : undefined
    },
    seniorityAnalysis,
    requirementEvaluations,
    decision,
    decisionReason,
    whyNotApply,
    whyItFits,
    hardNoGoReasons,
    isHardNoGo,
    hardRejectionReasons: hardNoGoReasons,
    reviewReasons,
    selectedCVId: topCV?.cvVariantId,
    cvRankings,
    targetCV,
    cvRationale,
    status,
    evidenceMatch: evidenceMatchOutput,
    applicationMaterials,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Synchronous wrapper for backwards compatibility with test suites & seed data
 */
export function evaluateJob(
  input: RawJobInput,
  settings: SystemSettings = DEFAULT_SETTINGS,
  masterProfile?: MasterProfile,
  activeCVs?: CVVariant[],
  preferences?: JobPreferences
): Job {
  // Use imported default PM preset if none passed
  const prof = masterProfile || PRESET_PRODUCT_MANAGER.masterProfile;
  const cvs = activeCVs || PRESET_PRODUCT_MANAGER.cvVariants;
  const prefs = preferences || PRESET_PRODUCT_MANAGER.preferences;

  // Run candidate-agnostic evaluation synchronously (using deterministic mapping)
  const cleanUrl = sanitizeJobUrl(input.jobUrl || "");
  const { confidence, missingFields } = evaluateParserConfidence(input);
  const jdRetrievalStatus = determineJDRetrievalStatus(input);
  const locResult = evaluateLocationAndWorkAuth(input.location || "", input.description || "", prefs);
  const routeAnalysis = evaluateApplicationRoute(cleanUrl, sanitizeJobUrl(input.applicationUrl || ""), input.description || "", prefs);
  const freshnessAnalysis = evaluateFreshness(input.postingDate, input.description || "");
  const seniorityAnalysis = evaluateSeniority(input.title || "", input.description || "", prof, prefs);

  const combinedText = `${input.title} ${input.description}`.toLowerCase();
  const hardNoGoReasons: string[] = [];

  for (const excludedType of prefs.excludedJobTypes) {
    if (excludedType.trim() && combinedText.includes(excludedType.toLowerCase())) {
      hardNoGoReasons.push(`Role matches candidate's explicitly excluded job type: '${excludedType}'`);
    }
  }

  for (const excludedIndustry of prefs.excludedIndustries) {
    if (excludedIndustry.trim() && combinedText.includes(excludedIndustry.toLowerCase())) {
      hardNoGoReasons.push(`Role belongs to candidate's explicitly excluded industry: '${excludedIndustry}'`);
    }
  }

  // Check candidate exclusions for sales / cold calling / commission
  const isOutboundSalesRole = /cold call|quota-carrying|outbound business development|sales commission|sales specialist|sdr position|bdr position/i.test(combinedText);
  const candidateExcludesSales = (prefs.excludedJobTypes || []).some(t => /sales|sdr|bdr|cold call|commission/i.test(t)) ||
                                (prefs.excludedIndustries || []).some(i => /sales/i.test(i));
  if (isOutboundSalesRole && candidateExcludesSales) {
    hardNoGoReasons.push("Role involves outbound quota-carrying sales / SDR tasks, which is explicitly excluded in candidate's career preferences.");
  }

  if (locResult.hardNoGoReason) hardNoGoReasons.push(locResult.hardNoGoReason);
  if (routeAnalysis.status === 'HARD_REJECT') hardNoGoReasons.push(routeAnalysis.evidence);
  if (freshnessAnalysis.status === 'CLOSED_EXPIRED') hardNoGoReasons.push("Job is explicitly closed or expired.");
  if (seniorityAnalysis.isMaterial) hardNoGoReasons.push(seniorityAnalysis.seniorityGap);

  // Extract requirements
  const extractedRequirements = (aiProvider as any).extractRequirementsDeterministically(input.description || "", input.title);
  const requirementEvaluations = (aiProvider as any).mapRequirementsDeterministically(extractedRequirements, prof);

  const materialReqs = requirementEvaluations.filter((r: any) => r.severity === 'MUST_HAVE');
  const directMatches = requirementEvaluations.filter((r: any) => r.status === 'DIRECT');
  const transferableMatches = requirementEvaluations.filter((r: any) => r.status === 'TRANSFERABLE' || r.status === 'STRONG_TRANSFERABLE');
  const missingMaterial = materialReqs.filter((r: any) => r.status === 'MISSING' || r.status === 'DISQUALIFYING' || r.status === 'CONTRADICTED');

  if (missingMaterial.length > 0) {
    missingMaterial.forEach((m: any) => {
      if (m.severity === 'MUST_HAVE' && m.isMaterialGap && (m.status === 'DISQUALIFYING' || m.status === 'CONTRADICTED')) {
        hardNoGoReasons.push(`Material MUST-HAVE requirement contradicted by Master Profile: '${m.requirement}'`);
      }
    });
  }

  const coverage: EvidenceCoverage = {
    totalMaterialCount: materialReqs.length,
    supportedMaterialCount: materialReqs.filter((r: any) => r.status === 'DIRECT' || r.status === 'TRANSFERABLE' || r.status === 'STRONG_TRANSFERABLE').length,
    directMatchesCount: directMatches.length,
    transferableMatchesCount: transferableMatches.length,
    missingMaterialCount: missingMaterial.length,
    hardBlockersCount: hardNoGoReasons.length,
    verificationRequiredCount: requirementEvaluations.filter((r: any) => r.status === 'PARTIAL').length
  };

  const roleReqs = requirementEvaluations.filter((r: any) => r.category === 'ROLE_CORE' || r.category === 'SENIORITY' || !r.category);
  const domainReqs = requirementEvaluations.filter((r: any) => r.category === 'DOMAIN' || r.category === 'TECHNICAL');

  const coreRoleSupported = roleReqs.filter((r: any) => r.status === 'DIRECT' || r.status === 'TRANSFERABLE' || r.status === 'STRONG_TRANSFERABLE').length;
  const corePMScore = roleReqs.length > 0 ? Math.round((coreRoleSupported / roleReqs.length) * 100) : 70;

  const domainSupported = domainReqs.filter((r: any) => r.status === 'DIRECT' || r.status === 'STRONG_TRANSFERABLE' || r.status === 'TRANSFERABLE').length;
  const domainScore = domainReqs.length > 0 ? Math.round((domainSupported / domainReqs.length) * 100) : 85;

  const isHardNoGo = hardNoGoReasons.length > 0;
  const checklist: ApplyGateCheck[] = [
    {
      ruleNumber: 1,
      name: "Role is not in candidate's excluded job types",
      passed: !hardNoGoReasons.some(r => r.includes("excluded job type") || r.includes("excluded industry")),
      details: "Confirmed position is within candidate's permitted job categories."
    },
    {
      ruleNumber: 2,
      name: "No hard rejection / Hard NO-GO triggers",
      passed: hardNoGoReasons.length === 0,
      details: hardNoGoReasons.length === 0 ? "No hard blockers identified." : `Hard blocker active: ${hardNoGoReasons[0]}`
    },
    {
      ruleNumber: 3,
      name: "Location and work authorization confirmed",
      passed: locResult.eligibility === 'NIGERIA_OK' || locResult.eligibility === 'WORLDWIDE_REMOTE',
      details: locResult.notes
    },
    {
      ruleNumber: 4,
      name: "Application route is free and accessible",
      passed: routeAnalysis.status === 'GOOD',
      details: routeAnalysis.evidence
    },
    {
      ruleNumber: 5,
      name: "No material MUST-HAVE requirement is unsupported",
      passed: missingMaterial.length === 0,
      details: missingMaterial.length === 0 ? "All MUST-HAVE requirements satisfied." : `${missingMaterial.length} MUST-HAVE requirement(s) missing.`
    },
    {
      ruleNumber: 6,
      name: "Candidate has meaningful direct evidence for central responsibilities",
      passed: directMatches.length > 0 && corePMScore >= 60,
      details: directMatches.length > 0 ? `Verified ${directMatches.length} direct evidence match(es).` : "Lacks direct documented evidence."
    },
    {
      ruleNumber: 7,
      name: "Seniority is realistically within documented scope",
      passed: !seniorityAnalysis.isMaterial && seniorityAnalysis.score >= 10,
      details: seniorityAnalysis.decisionImpact
    },
    {
      ruleNumber: 8,
      name: "Job is not known to be closed or stale (>30 days)",
      passed: freshnessAnalysis.status !== 'CLOSED_EXPIRED' && freshnessAnalysis.status !== 'STALE',
      details: freshnessAnalysis.warning || "Posting is currently active."
    },
    {
      ruleNumber: 9,
      name: "Parser confidence is sufficient and full JD is retrieved",
      passed: confidence === 'HIGH' && jdRetrievalStatus !== 'JD_UNAVAILABLE',
      details: `Parser: ${confidence} | Retrieval: ${jdRetrievalStatus}`
    },
    {
      ruleNumber: 10,
      name: "Role is worth applying to based on factual Master Profile evidence",
      passed: domainScore >= 50 && hardNoGoReasons.length === 0,
      details: "Evidence verified against factual Master Profile."
    }
  ];

  const failedCheck = checklist.find(c => !c.passed);
  const applyGatePassed = !failedCheck;

  const detailedScores: DetailedScores = {
    roleLegitimacy: isHardNoGo ? 0 : 10,
    locationWorkAuth: locResult.score,
    appAccessibility: routeAnalysis.score,
    seniorityFit: seniorityAnalysis.score,
    coreRoleCapability: Math.round(corePMScore * 0.20),
    corePMCapability: Math.round(corePMScore * 0.20),
    technicalComplexity: 8,
    technicalProductComplexity: 8,
    domainRelevance: Math.round(domainScore * 0.15),
    evidenceStrength: Math.round(coverage.supportedMaterialCount >= 2 ? 18 : coverage.supportedMaterialCount === 1 ? 12 : 6),
    missingCriticalPenalty: coverage.missingMaterialCount > 0 ? -15 : 0,
    jobFreshness: freshnessAnalysis.score,
    coreRoleScore: corePMScore,
    corePMScore,
    domainScore,
    total: Math.max(0, Math.min(100,
      locResult.score +
      seniorityAnalysis.score +
      routeAnalysis.score +
      freshnessAnalysis.score +
      Math.round(corePMScore * 0.25) +
      Math.round(domainScore * 0.20) +
      (coverage.missingMaterialCount > 0 ? -15 : 0)
    ))
  };

  const score: ScoreBreakdown = {
    locationEligibility: locResult.score,
    coreEvidenceFit: Math.min(30, Math.round((corePMScore / 100) * 30)),
    seniorityFit: seniorityAnalysis.score,
    domainFit: Math.min(15, Math.round((domainScore / 100) * 15)),
    appAccessibility: routeAnalysis.score,
    roleAuthenticity: detailedScores.roleLegitimacy,
    total: detailedScores.total
  };

  const whyNotApply: string[] = [];
  const whyItFits: string[] = [];
  const reviewReasons: string[] = [];

  if (hardNoGoReasons.length > 0) whyNotApply.push(...hardNoGoReasons);
  if (missingMaterial.length > 0) {
    missingMaterial.forEach((m: any) => whyNotApply.push(`Missing MUST-HAVE: ${m.requirement}`));
  }
  if (locResult.eligibility === 'UNCLEAR') {
    whyNotApply.push("Remote location eligibility is not explicitly confirmed for candidate's location.");
    reviewReasons.push("Remote eligibility unverified.");
  }
  if (routeAnalysis.status === 'REVIEW') {
    whyNotApply.push(`Application route needs verification (${routeAnalysis.routeType}).`);
    reviewReasons.push("Application route unverified.");
  }
  if (freshnessAnalysis.status === 'STALE') {
    whyNotApply.push(`Posting is ${freshnessAnalysis.daysSincePosted} days old (>30 days). Likely closed.`);
  }

  directMatches.forEach((d: any) => whyItFits.push(`${d.requirement}: Grounded in ${d.sourceProduct}.`));
  transferableMatches.forEach((t: any) => whyItFits.push(`Transferable: ${t.requirement} (${t.sourceProduct}).`));

  let decision: JobDecision;
  let decisionReason: string;

  if (isHardNoGo) {
    decision = 'REJECT';
    decisionReason = `HARD NO-GO: ${hardNoGoReasons[0]}`;
  } else if (freshnessAnalysis.status === 'STALE') {
    decision = 'WATCH';
    decisionReason = `Posting is over 30 days old (${freshnessAnalysis.daysSincePosted} days). Placed on Watchlist to confirm active hiring before applying.`;
  } else if (score.total < settings.minReviewScore) {
    decision = 'REJECT';
    decisionReason = failedCheck
      ? `Rejected: Insufficient evidence score (${score.total}/100, min review threshold is ${settings.minReviewScore}). Failed gate: ${failedCheck.name} (${failedCheck.details})`
      : `Score (${score.total}/100) is below review threshold. Factual Master Profile lacks material evidence for role.`;
  } else if (confidence === 'LOW' || jdRetrievalStatus === 'JD_UNAVAILABLE') {
    decision = 'REVIEW';
    decisionReason = `Job details incomplete (Parser: ${confidence}, Retrieval: ${jdRetrievalStatus}). Human review required.`;
  } else if (applyGatePassed && score.total >= settings.minApplyScore) {
    decision = 'APPLY';
    decisionReason = `Strong evidence-backed fit: Validated against documented Master Profile. Passed all 10 Apply Gate verification checks.`;
  } else {
    decision = 'REVIEW';
    decisionReason = failedCheck
      ? `Held for REVIEW by Apply Gate: ${failedCheck.name} (${failedCheck.details})`
      : `Score (${score.total}/100) is in review range. ${reviewReasons[0] || 'Verification required.'}`;
  }

  const cvRankings: CVRanking[] = cvs.map((cv: CVVariant, idx: number) => ({
    cvVariantId: cv.id,
    cvName: cv.userDefinedName,
    relevanceScore: Math.max(60, 95 - idx * 10),
    mustHaveCoverage: materialReqs.length,
    strongestEvidence: directMatches.slice(0, 2).map((d: any) => d.requirement),
    missingRelevantEvidence: missingMaterial.slice(0, 1).map((m: any) => m.requirement),
    explanation: `CV '${cv.userDefinedName}' matches ${directMatches.length} requirements grounded in Master Profile.`
  }));

  const topCV = cvRankings[0];
  const targetCV = topCV?.cvName || `${prof.primaryProfession} CV`;
  const cvRationale = topCV?.explanation || "Selected based on Master Profile alignment.";

  let status: Job['status'] = 'NEW';
  if (decision === 'APPLY') status = 'READY_TO_APPLY';
  else if (decision === 'REVIEW') status = 'REVIEW';
  else if (decision === 'WATCH') status = 'WATCHLIST';
  else status = 'REJECTED';

  const evidenceMatchOutput: EvidenceMatchOutput = {
    direct: directMatches.map((d: any) => ({ requirement: d.requirement, product: d.sourceProduct, evidence: d.candidateEvidence })),
    transferable: transferableMatches.map((t: any) => ({ requirement: t.requirement, product: t.sourceProduct, capability: t.candidateEvidence, explanation: t.rationale })),
    missing: missingMaterial.map((m: any) => ({ requirement: m.requirement, impact: m.rationale, isMaterial: m.isMaterialGap })),
    risks: whyNotApply.slice(0, 3).map(w => ({ title: "Requirement Gap", explanation: w, severity: 'MEDIUM' }))
  };

  const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  return {
    id,
    sourceEmailId: input.sourceEmailId,
    source: input.source || 'Direct',
    allSources: input.source ? [input.source] : ['Direct'],
    title: input.title?.trim() || "Untitled Opportunity",
    company: input.company?.trim() || "Unknown Company",
    location: input.location?.trim() || "Remote",
    remoteEligibility: locResult.eligibility,
    employmentType: "Full-time",
    description: input.description || "",
    jobUrl: input.jobUrl || "",
    cleanUrl,
    applicationUrl: input.applicationUrl || input.jobUrl || "",
    applicationRoute: input.jobUrl?.includes("paid-remote") ? 'BLOCKED_PAID' : (routeAnalysis.status === 'GOOD' ? 'FREE_ATS' : 'REVIEW_UNKNOWN'),
    routeDetails: routeAnalysis.evidence,
    routeAnalysis,
    postingDate: input.postingDate || new Date().toISOString().split('T')[0],
    discoveredDate: now.split('T')[0],
    freshnessAnalysis,
    jdRetrievalStatus,
    parserConfidence: confidence,
    missingFields,
    score,
    detailedScores,
    evidenceCoverage: coverage,
    applyGate: {
      passed: applyGatePassed,
      checklist,
      failedRule: failedCheck ? `Rule #${failedCheck.ruleNumber}: ${failedCheck.name}` : undefined
    },
    seniorityAnalysis,
    requirementEvaluations,
    decision,
    decisionReason,
    whyNotApply,
    whyItFits,
    hardNoGoReasons,
    isHardNoGo,
    hardRejectionReasons: hardNoGoReasons,
    reviewReasons,
    selectedCVId: topCV?.cvVariantId,
    cvRankings,
    targetCV,
    cvRationale,
    status,
    evidenceMatch: evidenceMatchOutput,
    provenanceLabel: input.provenanceLabel || deriveProvenanceLabel(input.source, input.jobUrl),
    externalJobId: input.externalJobId || extractExternalJobId(input.jobUrl),
    firstSeen: now,
    lastSeen: now,
    reEncounterCount: 1,
    pipelineHistory: [
      {
        id: `audit_${Date.now()}`,
        timestamp: now,
        previousState: 'NEW',
        newState: status,
        actor: 'SYSTEM',
        reason: `Initial ingestion and evaluation (${decision} - ${score.total}/100)`
      }
    ],
    createdAt: now,
    updatedAt: now
  };
}

/**
 * 8. Upgraded Duplicate Detection (Section 19)
 */
export function detectDuplicates(newJob: Job, existingJobs: Job[]): {
  isDuplicate: boolean;
  duplicateOf?: Job;
  reason?: string;
} {
  const normTitle = newJob.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normCompany = newJob.company.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanUrl = newJob.cleanUrl || sanitizeJobUrl(newJob.jobUrl);
  const extId = newJob.externalJobId;

  for (const existing of existingJobs) {
    if (existing.id === newJob.id) continue;

    // 1. External Job ID match
    if (extId && existing.externalJobId && extId === existing.externalJobId) {
      return {
        isDuplicate: true,
        duplicateOf: existing,
        reason: `Identical external job posting ID (${extId})`
      };
    }

    const existTitle = existing.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existCompany = existing.company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existCleanUrl = existing.cleanUrl || sanitizeJobUrl(existing.jobUrl);

    // 2. Canonical URL match
    if (cleanUrl && existCleanUrl && cleanUrl === existCleanUrl) {
      return {
        isDuplicate: true,
        duplicateOf: existing,
        reason: "Exact job URL match (after stripping tracking parameters)"
      };
    }

    // 3. Normalized Company + Title match
    if (normCompany && existCompany && normCompany === existCompany) {
      if (normTitle === existTitle || (normTitle.length > 10 && existTitle.includes(normTitle)) || (existTitle.length > 10 && normTitle.includes(existTitle))) {
        return {
          isDuplicate: true,
          duplicateOf: existing,
          reason: `Same employer '${existing.company}' matching title '${existing.title}'`
        };
      }
    }
  }

  return { isDuplicate: false };
}
