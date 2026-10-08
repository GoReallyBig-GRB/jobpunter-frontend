import { AITaskConfig, IntegrationConfig } from '../types/job';

export const INITIAL_AI_TASKS_CONFIG: AITaskConfig[] = [
  {
    id: "task_cfg_master_cv",
    taskId: "master_cv_generation",
    name: "Master CV Generation",
    description: "Synthesizes the comprehensive baseline Master CV directly from the Universal Master Career Profile.",
    purpose: "Transform all verified factual employment, projects, skills, education, certifications, and portfolio evidence into a unified, formatted Master CV document.",
    permittedInputs: ["Universal Master Career Profile", "Candidate Preferences", "Approved Evidence Items"],
    expectedOutput: "Markdown / Formatted CV with Candidate Header, Professional Summary, Work Experience, Key Projects, Education, Certifications, Portfolio & Hyperlinks.",
    factualGroundingRules: [
      "Strict Grounding: ONLY use facts documented in the Master Career Profile.",
      "Zero Hallucination: NEVER invent employers, job titles, employment dates, or unverified metrics.",
      "Hyperlink Preservation: Retain all verified credential and portfolio URLs."
    ],
    validationRequirements: [
      "Verify that every employment entry maps to an existing EmploymentRecord.",
      "Verify that no unapproved skills or frameworks are introduced.",
      "Ensure candidate contact and location match profile."
    ],
    systemPrompt: `You are the JobPunter Master CV Generation Engine.
Your objective is to generate an authoritative, highly professional Master CV strictly grounded in the candidate's verified profile data.
You must adhere strictly to factual truth:
1. NEVER fabricate or exaggerate achievements, metrics, roles, or employers.
2. Structure output cleanly into standard executive CV sections.
3. Include active hyperlinks for verified portfolio items and credentials.`,
    taskInstructions: `Using the provided Master Career Profile JSON:
1. Extract candidate name, headline, contact info, and location.
2. Synthesize an executive professional summary reflecting documented scope and capabilities.
3. Format chronologically: Employment History -> Key Projects -> Technical / Functional Skills -> Education -> Certifications -> Portfolio Links.
4. Output in clean Markdown format with '#', '##', and bullet points.`,
    assignedModel: "gemini-2.5-flash",
    fallbackModel: "deterministic_template",
    temperature: 0.1,
    enabled: true,
    activeVersion: 1,
    versionHistory: [
      {
        version: 1,
        createdAt: "2026-10-01T00:00:00Z",
        systemPrompt: "You are the JobPunter Master CV Generation Engine. Generate an authoritative Master CV strictly grounded in verified facts.",
        taskInstructions: "Transform verified profile into clean Markdown executive CV preserving all dates, achievements, and links.",
        assignedModel: "gemini-2.5-flash",
        temperature: 0.1,
        notes: "Initial baseline configuration."
      }
    ]
  },
  {
    id: "task_cfg_cv_variant",
    taskId: "cv_variant_generation",
    name: "CV Variant Generation (Target Role)",
    description: "Generates an approved CV variant tailored to a specific target role family from the Master CV and evidence.",
    purpose: "Reorder emphasis, spotlight relevant projects, and adjust terminology to match one of the candidate's 5 target roles, without inventing facts.",
    permittedInputs: ["Master CV", "Master Career Profile", "Selected Target Role / Pathway", "Evidence Library"],
    expectedOutput: "Targeted CV Variant in structured Markdown preserving factual integrity while emphasizing matching capabilities.",
    factualGroundingRules: [
      "No Invention: Only highlight genuine projects and roles that exist in the Master Profile.",
      "Preserve History: Do not modify employment dates, organizations, or qualifications.",
      "Terminology Alignment: Adapt phrasing to target role conventions only when functionally equivalent."
    ],
    validationRequirements: [
      "Ensure target role belongs to the maximum 5 allowed target roles.",
      "Verify 100% of bullet points derive from approved evidence.",
      "Flag any terminology not supported by candidate background."
    ],
    systemPrompt: `You are the JobPunter CV Variant Synthesis Engine.
Your task is to re-weight and focus a candidate's Master CV toward a specific target role family without adding unverified claims.
Adjust emphasis and organization; never alter historical truth.`,
    taskInstructions: `Given the Master CV and Target Role Family:
1. Re-align the Professional Summary to spotlight relevance to the target role.
2. Reorder bullets within genuine past roles so that experiences most relevant to the target role appear first.
3. Spotlight relevant projects, certifications, and portfolio evidence.
4. Keep all factual constraints intact.`,
    assignedModel: "gemini-2.5-flash",
    fallbackModel: "gemini-1.5-flash",
    temperature: 0.1,
    enabled: true,
    activeVersion: 1,
    versionHistory: [
      {
        version: 1,
        createdAt: "2026-10-01T00:00:00Z",
        systemPrompt: "Re-weight and focus Master CV toward target role family without adding unverified claims.",
        taskInstructions: "Realign summary, reorder experience bullets for relevance, preserve factual constraints.",
        assignedModel: "gemini-2.5-flash",
        temperature: 0.1,
        notes: "Initial target role variant prompt."
      }
    ]
  },
  {
    id: "task_cfg_tailored_cv",
    taskId: "tailored_cv_generation",
    name: "One-Time Tailored CV Generation",
    description: "Creates an ATS-optimized, job-specific CV for an approved opportunity using the candidate's CV variant and actual JD.",
    purpose: "Align keywords and highlight relevant verified evidence to maximize ATS match score for a specific application.",
    permittedInputs: ["Target CV Variant", "Master Profile Evidence", "Verified Job Description"],
    expectedOutput: "Job-Specific Tailored CV with aligned keywords and documented evidence mapping.",
    factualGroundingRules: [
      "Zero Fabrication: Never claim required skills or technologies that do not exist in candidate evidence.",
      "Gap Transparency: If the JD requires a skill the candidate lacks, leave it unmentioned or acknowledge boundary.",
      "Evidence Grounding: Every tailored achievement bullet must cite an existing project or employer."
    ],
    validationRequirements: [
      "Check against candidate strict boundaries.",
      "Verify that keyword alignment does not falsify capability.",
      "Candidate approval required before application submission."
    ],
    systemPrompt: `You are the JobPunter Job-Specific Tailoring Engine.
Your objective is to tailor the candidate's approved CV variant specifically for an evaluated job opportunity.
Optimize presentation and ATS clarity while maintaining 100% adherence to verified truth.`,
    taskInstructions: `Compare the CV Variant with the Job Description:
1. Identify high-priority keywords from the JD that are genuinely supported by the candidate's evidence.
2. Emphasize those keywords naturally in the summary and experience bullet points.
3. Do NOT claim unsupported technologies.
4. Output tailored Markdown CV and a list of aligned keywords.`,
    assignedModel: "gemini-2.5-flash",
    fallbackModel: "deterministic_template",
    temperature: 0.1,
    enabled: true,
    activeVersion: 1,
    versionHistory: [
      {
        version: 1,
        createdAt: "2026-10-01T00:00:00Z",
        systemPrompt: "Tailor approved CV variant specifically for evaluated job opportunity with zero fabrication.",
        taskInstructions: "Align supported keywords, reorder relevant bullets, preserve factual boundaries.",
        assignedModel: "gemini-2.5-flash",
        temperature: 0.1,
        notes: "Initial tailored CV generation prompt."
      }
    ]
  },
  {
    id: "task_cfg_profile_extract",
    taskId: "candidate_profile_extraction",
    name: "Candidate Profile Document Extraction",
    description: "Parses uploaded resumes, CVs, and career dossiers (PDF, DOCX, TXT) into canonical Master Career Profile structure.",
    purpose: "Extract factual identity, contact info, employment history, projects, education, certifications, and portfolio items from raw text.",
    permittedInputs: ["Extracted Document Text", "Document Metadata"],
    expectedOutput: "Structured JSON conforming to MasterCareerProfile schema with all detectable fields populated.",
    factualGroundingRules: [
      "Extract Only: Only capture information explicitly present in the document.",
      "Preserve Gaps: Do not guess unmentioned dates or unstated metrics.",
      "Conflict Identification: Surface discrepancies with existing Master Profile for user review."
    ],
    validationRequirements: [
      "Ensure candidate name and profession are identified or marked unknown.",
      "Extract repeatable education and certification objects with institutions and dates.",
      "Extract clickable portfolio and LinkedIn URLs."
    ],
    systemPrompt: `You are the JobPunter Document Extraction Engine.
Parse raw candidate resume and dossier text into structured Master Career Profile JSON.
Extract facts faithfully without inference or embellishment.`,
    taskInstructions: `Analyze the provided resume / dossier text:
1. Extract candidateName, contact info (email, phone, location, LinkedIn, portfolio).
2. Extract employmentHistory: role, employer, dates, responsibilities, achievements, skills.
3. Extract education: institution, qualification/degree, fieldOfStudy, dates, grade, description.
4. Extract certifications: certificationName, issuingOrganization, issueDate, expiryDate, credentialId, credentialUrl.
5. Extract portfolio items: title, category, url, description, associatedProject.
6. Extract skills, tools, and domains.
7. Return strictly valid JSON.`,
    assignedModel: "gemini-2.5-flash",
    fallbackModel: "deterministic_regex",
    temperature: 0.0,
    enabled: true,
    activeVersion: 1,
    versionHistory: [
      {
        version: 1,
        createdAt: "2026-10-01T00:00:00Z",
        systemPrompt: "Parse raw candidate text into structured JSON Master Profile without embellishment.",
        taskInstructions: "Extract identity, contact, employment, education, certifications, portfolio, and skills into JSON.",
        assignedModel: "gemini-2.5-flash",
        temperature: 0.0,
        notes: "Initial profile extraction prompt."
      }
    ]
  },
  {
    id: "task_cfg_jd_extract",
    taskId: "jd_extraction",
    name: "Job Description Ingestion & Normalization",
    description: "Extracts role title, employer, location, remote status, employment type, salary, responsibilities, and application route from pasted or fetched JDs.",
    purpose: "Normalize unstructured job postings into canonical Job entity with explicit missing field identification.",
    permittedInputs: ["Pasted Job Text", "Job Portal URL", "Alert Email Body"],
    expectedOutput: "Normalized Job record with title, company, location, remoteEligibility, route, requirements, and missingFields list.",
    factualGroundingRules: [
      "No Assumptions: If company name, location, or salary is not mentioned, mark it as MISSING.",
      "Application Route Detection: Distinguish free direct ATS (Greenhouse, Lever, Workday) from aggregator listings.",
      "Clear Missingness: Do not hallucinate remote eligibility; categorize as UNCLEAR if unstated."
    ],
    validationRequirements: [
      "Identify all critical missing fields (Title, Company, Location, Route).",
      "Assign appropriate provenance label.",
      "Sanitize URLs of tracking parameters."
    ],
    systemPrompt: `You are the JobPunter Job Ingestion & Normalization Engine.
Extract canonical job posting details from unstructured job descriptions.
Never invent missing information. Clearly identify what is missing.`,
    taskInstructions: `Parse the pasted job description text:
1. Extract title, company, location, remoteEligibility (NIGERIA_OK, WORLDWIDE_REMOTE, REGION_RESTRICTED, HYBRID_ONSITE, UNCLEAR).
2. Extract employmentType, salary if explicitly stated, and applicationUrl / route.
3. List discrete requirements with categories (ROLE_CORE, DOMAIN, TECHNICAL, SENIORITY, EDUCATION, LOCATION).
4. Flag any critical fields not found in the text in the missingFields array.`,
    assignedModel: "gemini-2.5-flash",
    fallbackModel: "deterministic_parser",
    temperature: 0.1,
    enabled: true,
    activeVersion: 1,
    versionHistory: [
      {
        version: 1,
        createdAt: "2026-10-01T00:00:00Z",
        systemPrompt: "Extract canonical job posting details from unstructured JD text. Never invent missing details.",
        taskInstructions: "Extract title, company, location, remote status, route, and discrete requirements. Flag missing fields.",
        assignedModel: "gemini-2.5-flash",
        temperature: 0.1,
        notes: "Initial JD extraction prompt."
      }
    ]
  },
  {
    id: "task_cfg_job_eval",
    taskId: "job_evaluation",
    name: "Candidate-Job Fit Evaluation & Decision",
    description: "Evaluates opportunity against candidate Master Career Profile, preferences, and verified evidence across core capabilities and domains.",
    purpose: "Calculate evidence coverage, apply hard constraints, determine recommendation (APPLY, REVIEW, WATCH, REJECT), and establish next steps.",
    permittedInputs: ["Normalized Job", "Master Career Profile", "Candidate Preferences", "Evidence Library"],
    expectedOutput: "Detailed score breakdown (0-100), decision, decisive reason, why it fits list, blockers list, and next steps.",
    factualGroundingRules: [
      "Evidence-Backed Scoring: Base score strictly on documented candidate evidence matches.",
      "Constraint Enforcement: Apply hard rejections for location disqualifications, paid application fees, or excluded job types.",
      "Clear Explanations: Provide actionable, candidate-focused rationale without exposing internal code or debug jargon."
    ],
    validationRequirements: [
      "Ensure decision reasons are understandable and constructive.",
      "Verify every matched requirement cites candidate's source project or role.",
      "Include clear Next Step state (e.g., Prepare Application Package, Review Opportunity, Resolve Missing Info)."
    ],
    systemPrompt: `You are the JobPunter Opportunity Evaluation Engine.
Your objective is to objectively evaluate a job opportunity against candidate facts and preferences.
Produce clear, transparent, actionable recommendations and explainability.`,
    taskInstructions: `Evaluate the Job against the Master Career Profile:
1. Check work authorization and remote eligibility constraints.
2. Evaluate Core Capability Fit (0-100) and Specific Domain Fit (0-100).
3. Evaluate discrete requirements against candidate evidence (DIRECT, TRANSFERABLE, MISSING, CONTRADICTED).
4. Determine final decision: APPLY (>=85 pass), REVIEW (70-84 or judgment required), WATCH, or REJECT.
5. Provide concise 'Why It Fits' bullet points and 'Decisive Blockers' if any.
6. Designate immediate next step for the candidate.`,
    assignedModel: "gemini-2.5-flash",
    fallbackModel: "deterministic_evaluator",
    temperature: 0.1,
    enabled: true,
    activeVersion: 1,
    versionHistory: [
      {
        version: 1,
        createdAt: "2026-10-01T00:00:00Z",
        systemPrompt: "Objectively evaluate job opportunity against candidate facts and preferences with evidence-based scoring.",
        taskInstructions: "Check constraints, score capability and domain fit, verify evidence matches, determine next steps.",
        assignedModel: "gemini-2.5-flash",
        temperature: 0.1,
        notes: "Initial job evaluation prompt."
      }
    ]
  },
  {
    id: "task_cfg_cover_letter",
    taskId: "cover_letter_generation",
    name: "Tailored Cover Letter Generation",
    description: "Generates an executive, evidence-backed cover letter tailored specifically to the employer, role, and JD.",
    purpose: "Draft a compelling, professional cover letter referencing only documented projects, verified outcomes, and relevant skills.",
    permittedInputs: ["Candidate Master Profile", "Target Job Description", "Approved Evidence Items"],
    expectedOutput: "Fully formatted, editable Cover Letter in clean paragraphs with verified candidate achievements.",
    factualGroundingRules: [
      "Strict Evidence Only: Only reference projects, metrics, and outcomes that exist in candidate profile.",
      "No Generic Fluff: Avoid empty clichés; connect candidate's actual work directly to the employer's stated challenges.",
      "Editable & Usable: Output clean text ready for export, copy, or Universal Document Editor refinement."
    ],
    validationRequirements: [
      "Verify candidate name, employer name, and role title are accurate.",
      "Verify that all cited metrics (percentages, revenues, team sizes) match Master Profile.",
      "Disallow any claims flagged as unsupported in Claims Discipline."
    ],
    systemPrompt: `You are the JobPunter Executive Cover Letter Engine.
Craft professional, concise, persuasive cover letters strictly grounded in candidate evidence.
No hallucinations. No invented accomplishments.`,
    taskInstructions: `Write a tailored cover letter for the candidate applying to the specified company:
1. Address the hiring team professionally.
2. Connect the candidate's core positioning and demonstrated capabilities to the key objectives stated in the JD.
3. Cite 1-2 specific projects or achievements from the Master Career Profile that directly prove suitability.
4. Keep tone confident, disciplined, and executive (max 3-4 concise paragraphs).
5. Ensure candidate retains full editing control.`,
    assignedModel: "gemini-2.5-flash",
    fallbackModel: "deterministic_template",
    temperature: 0.2,
    enabled: true,
    activeVersion: 1,
    versionHistory: [
      {
        version: 1,
        createdAt: "2026-10-01T00:00:00Z",
        systemPrompt: "Craft professional, concise, persuasive cover letters strictly grounded in candidate evidence.",
        taskInstructions: "Generate 3-4 paragraph executive letter connecting candidate's genuine achievements to role needs.",
        assignedModel: "gemini-2.5-flash",
        temperature: 0.2,
        notes: "Initial cover letter prompt."
      }
    ]
  },
  {
    id: "task_cfg_application_qa",
    taskId: "application_qa_generation",
    name: "Application Q&A & Screening Answers",
    description: "Generates realistic screening questions and suggested answers grounded in candidate evidence with citation tracing.",
    purpose: "Prepare candidate for ATS questionnaire and application screening forms with verified factual answers.",
    permittedInputs: ["Job Description", "Master Career Profile", "Evidence Library"],
    expectedOutput: "Array of screening questions, suggested answers, cited evidence sources, and flags for any unsupported claims.",
    factualGroundingRules: [
      "Evidence Grounding: Every suggested answer must cite the specific Master Profile project or role it derives from.",
      "Flag Gaps: If an answer requires experience the candidate lacks, explicitly flag 'Evidence Gap' rather than inventing an answer.",
      "Candidate Discretion: Mark all answers as candidate-editable."
    ],
    validationRequirements: [
      "Ensure suggested answers do not claim technologies or years not documented in profile.",
      "Include explicit evidence attribution tags for candidate review.",
      "Flag any questions requiring legal or work authorization confirmations."
    ],
    systemPrompt: `You are the JobPunter Application Q&A Preparation Engine.
Anticipate screening questions for the role and formulate answers grounded entirely in verified candidate evidence.
Flag gaps honestly. Never fabricate.`,
    taskInstructions: `Based on the Job Description and Master Profile:
1. Identify 3-5 standard screening and behavioral application questions for this role.
2. Provide a suggested answer for each question using genuine situations, tasks, actions, and results from candidate history.
3. Explicitly cite the source project or employer for each answer.
4. If a question touches an area where candidate has no documented experience, flag: '[Evidence Gap: Candidate has no documented experience with X. Do not claim.]'`,
    assignedModel: "gemini-2.5-flash",
    fallbackModel: "deterministic_qa",
    temperature: 0.1,
    enabled: true,
    activeVersion: 1,
    versionHistory: [
      {
        version: 1,
        createdAt: "2026-10-01T00:00:00Z",
        systemPrompt: "Anticipate screening questions and formulate answers grounded entirely in verified candidate evidence.",
        taskInstructions: "Generate realistic questions, suggested STAR answers, evidence citations, and gap flags.",
        assignedModel: "gemini-2.5-flash",
        temperature: 0.1,
        notes: "Initial Q&A prompt."
      }
    ]
  },
  {
    id: "task_cfg_email_ingest",
    taskId: "email_job_extraction",
    name: "Job Alert Email Digest Ingestion",
    description: "Processes job alert emails from sources such as Indeed, LinkedIn, and direct employers into discrete job opportunities.",
    purpose: "Extract single or multiple job opportunities from email bodies, normalize fields, and eliminate duplicates.",
    permittedInputs: ["Raw Email Subject", "Email Sender", "Raw Email Body"],
    expectedOutput: "Extracted job listings with title, company, location, URL, and raw text chunks, or PARSING_REQUIRED flag.",
    factualGroundingRules: [
      "Do Not Bundle: Distinguish individual jobs in digest emails.",
      "Preserve Sender Identity: Retain original email headers and source provenance.",
      "Conservative Splitting: If jobs cannot be cleanly separated, mark email for human inspection rather than mangling listings."
    ],
    validationRequirements: [
      "Require at least title or URL to register a job.",
      "Check against existing jobs for deduplication.",
      "Flag digest emails needing manual review."
    ],
    systemPrompt: `You are the JobPunter Email Alert Parser Engine.
Analyze job alert emails and cleanly separate bundled opportunities into discrete records.`,
    taskInstructions: `Process the email subject, sender, and content:
1. Detect whether the email is a single job alert or a multi-job digest.
2. For digests, separate each listing by boundary markers.
3. For each listing, extract title, company, location, and apply link.
4. Return structured JSON array of extracted jobs.`,
    assignedModel: "gemini-2.5-flash",
    fallbackModel: "deterministic_regex",
    temperature: 0.0,
    enabled: true,
    activeVersion: 1,
    versionHistory: [
      {
        version: 1,
        createdAt: "2026-10-01T00:00:00Z",
        systemPrompt: "Analyze job alert emails and cleanly separate bundled opportunities into discrete records.",
        taskInstructions: "Detect single vs multi-job alert, parse each into title, company, location, URL.",
        assignedModel: "gemini-2.5-flash",
        temperature: 0.0,
        notes: "Initial email alert extraction prompt."
      }
    ]
  }
];

export const INITIAL_INTEGRATIONS_CONFIG: IntegrationConfig[] = [
  {
    id: "int_gmail",
    name: "Gmail API / Job Alerts Ingestion",
    category: "EMAIL",
    status: "CONFIGURED",
    description: "Authorized Google Workspace / Gmail ingestion for automated job alert retrieval.",
    endpointOrAccount: "goreallybig.business@gmail.com",
    lastChecked: "2026-10-08T03:00:00Z",
    authScopes: ["https://www.googleapis.com/auth/gmail.readonly"],
    statusMessage: "Configured via authorized Google workspace credentials."
  },
  {
    id: "int_gemini",
    name: "Google Gemini AI Provider",
    category: "AI_PROVIDER",
    status: "OPERATIONAL",
    description: "Primary AI reasoning engine powered by @google/genai SDK (Gemini 2.5 Flash / Gemini 1.5 Pro).",
    endpointOrAccount: "Google AI Studio API",
    lastChecked: "2026-10-08T03:22:00Z",
    statusMessage: "Operational with active API key and model routing."
  },
  {
    id: "int_gdrive",
    name: "Google Drive Storage",
    category: "STORAGE",
    status: "CONNECTED",
    description: "Cloud storage for generated CVs, application packages, and exported documents.",
    endpointOrAccount: "Google Drive Workspace Folder",
    lastChecked: "2026-10-08T02:45:00Z",
    authScopes: ["https://www.googleapis.com/auth/drive.file"],
    statusMessage: "Connected and ready for document synchronization."
  },
  {
    id: "int_gsheets",
    name: "Google Sheets Pipeline Export",
    category: "SPREADSHEET",
    status: "CONNECTED",
    description: "Two-way synchronization for application pipeline tracking and candidate audit logs.",
    endpointOrAccount: "JobPunter Pipeline Tracker Sheet",
    lastChecked: "2026-10-08T02:45:00Z",
    authScopes: ["https://www.googleapis.com/auth/spreadsheets"],
    statusMessage: "Connected and synced with Application Pipeline."
  },
  {
    id: "int_jobboards",
    name: "Job Board Direct Ingestion (Indeed / LinkedIn)",
    category: "JOB_BOARD",
    status: "OPERATIONAL",
    description: "Manual JD copy/paste, URL ingestion, and email alert splitter for public boards.",
    endpointOrAccount: "Multi-Source Parser Engine",
    lastChecked: "2026-10-08T03:15:00Z",
    statusMessage: "Operational across LinkedIn, Indeed, We Work Remotely, Wellfound, and direct careers portals."
  }
];
