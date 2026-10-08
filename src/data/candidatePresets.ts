import { MasterProfile, CVVariant, JobPreferences, CareerPathway, MasterCV } from '../types/job';

/**
 * Candidate Profile Presets for Candidate-Agnostic Operation and Testing
 * Includes:
 * 1. Preset A: Product Management Candidate (Migrated from earlier seed data)
 * 2. Preset B: Clinical Nurse Specialist / Healthcare Professional (Radically different profession)
 * 3. Preset C: Senior Full-Stack Software Engineer (Engineering profession)
 */

export interface CandidatePreset {
  id: string;
  name: string;
  profession: string;
  description: string;
  masterProfile: MasterProfile;
  cvVariants: CVVariant[];
  preferences: JobPreferences;
  careerPathways: CareerPathway[];
  masterCV?: MasterCV;
}

// -------------------------------------------------------------
// PRESET A: Senior Product Manager (Migrated)
// -------------------------------------------------------------
export const PRESET_PRODUCT_MANAGER: CandidatePreset = {
  id: "preset_pm",
  name: "Candidate A (Product Manager)",
  profession: "Product Manager",
  description: "B2B SaaS, developer platforms, multi-tenancy, and managed marketplaces.",
  careerPathways: [
    {
      id: "pathway_pm_01",
      title: "Core B2B SaaS Product Management",
      roleFamily: "Product Management",
      targetSeniority: "Product Manager / Senior PM",
      rationale: "Directly supported by 0 to 1 SaaS definition at MarketGrowthOS, 16 CRM state transitions, and entitlement logic at UrCalls.",
      supportingEvidence: [
        "MarketGrowthOS: 0 to 1 SaaS definition with 16-state CRM lifecycle",
        "UrCalls: Multi-tier account entitlements and subscription plans"
      ],
      gaps: [],
      isApproved: true,
      confidence: "HIGH",
      source: "USER_DEFINED",
      createdAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "pathway_pm_02",
      title: "Technical Platform & Developer APIs PM",
      roleFamily: "Technical Product Management",
      targetSeniority: "Technical Product Manager",
      rationale: "Grounded in API integration boundaries, webhook contradiction detection, and 3-tier multi-tenant isolation.",
      supportingEvidence: [
        "MarketGrowthOS: Webhook contradiction prevention and multi-tenant isolation",
        "Early engineering squad collaboration on technical trade-offs"
      ],
      gaps: [],
      isApproved: true,
      confidence: "HIGH",
      source: "USER_DEFINED",
      createdAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "pathway_pm_03",
      title: "Managed Marketplaces & Fintech Operations PM",
      roleFamily: "Product Management",
      targetSeniority: "Marketplace Product Manager",
      rationale: "Proven milestone verification, contractor vetting, and Stripe Connect payout infrastructure at Zenith Property Repairs.",
      supportingEvidence: [
        "Zenith Property Repairs: Two-sided contractor marketplace with 5-stage project lifecycle",
        "Stripe Connect escrow and milestone payout mechanisms"
      ],
      gaps: [],
      isApproved: true,
      confidence: "HIGH",
      source: "USER_DEFINED",
      createdAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "pathway_pm_04",
      title: "Enterprise Solutions & Sales Engineering",
      roleFamily: "Solutions Engineering",
      targetSeniority: "Solutions Architect / Sales Engineer",
      rationale: "AI suggested based on strong technical explanation ability and systems modelling. However, outbound sales quotas conflict with core preference.",
      supportingEvidence: [
        "API specification authoring and technical workflow translation"
      ],
      gaps: [
        "Requires outbound sales quota carrying and cold prospecting which violates candidate preferences."
      ],
      isApproved: false,
      confidence: "MEDIUM",
      source: "AI_SUGGESTED",
      createdAt: "2026-10-03T14:20:00Z"
    }
  ],
  masterCV: {
    id: "mcv_pm_01",
    sourceProfileId: "profile_pm_01",
    title: "Master Curriculum Vitae — Alex Vance (Product Manager)",
    candidateName: "Alex Vance",
    contactInfo: "alex.vance@example.com · Lagos, Nigeria / Worldwide Remote",
    professionalSummary: "Systems-first Product Manager specializing in taking ambiguous operational business problems and translating them into explicit rules, workflows, state engines, and acceptance criteria that engineering can implement with zero ambiguity. Verifiable track record across 4 systems: MarketGrowthOS, UrCalls, NexaLife Care, and Zenith Property Repairs.",
    sections: [
      {
        heading: "Core Working Method",
        items: [
          "Understand problem -> decompose -> find viable solutions -> model workflows -> challenge scope/feasibility -> bring engineering in early -> refine against technical reality -> write PRD/spec -> build/review -> QA/refine."
        ]
      },
      {
        heading: "Documented Experience & Verified Products",
        items: [
          "MarketGrowthOS (B2B SaaS / CRM): Sole Product Owner for 0 to 1 SaaS definition; 3-tier multi-tenant architecture; 16 valid CRM lifecycle state transitions; 1,200+ line QA checklist with webhook contradiction prevention.",
          "UrCalls (Collaboration & Video SaaS): Product Manager (Platform & Monetization); subscription plans, multi-tier account hierarchy, and AI Notes post-meeting structured summary feature.",
          "NexaLife Care (Healthcare Operations): Product Manager; modelled self-managed and assisted patient journeys, human + software transit verification workflow, and HIPAA privacy access control gates.",
          "Zenith Property Repairs (Managed Marketplace): Marketplace Product Manager; two-sided commercial contractor governance, 5-stage project lifecycle, and Stripe Connect payout infrastructure."
        ]
      },
      {
        heading: "Technical & Systems Competencies",
        items: [
          "State Machine Modelling, PRDs, Acceptance Criteria, API Integration Boundaries, Webhooks, Multi-Tenant Database Isolation, Stripe Connect Payouts."
        ]
      }
    ],
    fullMarkdown: `# Alex Vance — Product Manager
**Location:** Lagos, Nigeria (Worldwide Remote Eligible) | **Contact:** alex.vance@example.com

## Professional Summary
Systems-first Product Manager specializing in taking ambiguous operational business problems and translating them into explicit rules, workflows, state engines, and acceptance criteria that engineering can implement with zero ambiguity.

## Verified Systems Experience
### 1. MarketGrowthOS — Multi-Tenant CRM & Growth Operations SaaS
* Sole Product Owner guiding 3-developer squad through 0 to 1 definition.
* Modelled 3-tier multi-tenant architecture with strict tenant isolation.
* Defined 16 valid CRM lifecycle state transitions and policy-driven conversion logic.
* Authored 1,200+ line QA checklist with webhook contradiction detection.

### 2. UrCalls — Video Communication & Collaboration SaaS
* Product Manager for platform and monetization tiers.
* Built subscription plans, account hierarchies, and seat entitlement logic.
* Launched AI Notes feature for automated post-meeting structured summaries.

### 3. NexaLife Care — Healthcare Referral & Transit Platform
* Modelled assisted patient journeys and transit dispatch verification.
* Translated HIPAA privacy constraints into product behaviour and access gates.

### 4. Zenith Property Repairs — Managed Marketplace & Contractor Ecosystem
* Governed two-sided contractor marketplace with 5-stage project lifecycle.
* Implemented Stripe Connect escrow payout and milestone verification infrastructure.
`,
    candidateApproved: true,
    generatedAt: "2026-10-01T10:00:00Z",
    updatedAt: "2026-10-01T10:00:00Z"
  },
  masterProfile: {
    id: "profile_pm_01",
    candidateName: "Alex Vance (PM Profile)",
    primaryProfession: "Product Manager",
    corePositioning: "Taking ambiguous business problems and turning them into explicit systems of rules, workflows, decisions and specifications that engineering can implement.",
    workingMethod: "Understand problem -> decompose -> find viable solutions -> model workflows -> challenge scope/feasibility -> bring engineering in early -> refine against technical reality -> write PRD/spec -> build/review -> QA/refine.",
    location: "Nigeria / Remote (Worldwide)",
    workAuthorisation: "Nigeria (Eligible for international remote roles)",
    rawText: `Master Job Profile: Product Manager
Core Positioning: Taking ambiguous business problems and turning them into explicit systems of rules, workflows, decisions and specifications that engineering can implement.
Working Method: Understand problem -> decompose -> find viable solutions -> model workflows -> challenge scope/feasibility -> bring engineering in early -> refine against technical reality -> write PRD/spec -> build/review -> QA/refine.

Documented Platforms & Experience:
1. MarketGrowthOS (Multi-tenant CRM and Growth Operations SaaS) - Testing-stage product:
- Sole Product Owner working directly with a three-person development team.
- 0 to 1 SaaS product definition, scoping, and roadmap prioritization.
- Three-tier multi-tenant architecture with tenant isolation and permission boundaries.
- CRM lifecycle modelling with 16 valid state transitions.
- Two-step qualification gate and policy-driven conversion logic.
- Mautic integration boundary and marketing automation workflows.
- Scope control and detailed specifications authored across 15 functional modules.
- 1,200+ line QA checklist including webhook contradiction detection to prevent data desynchronization.

2. UrCalls (Video Communication and Collaboration SaaS Product) - Live SaaS product:
- Product Manager (Platform and Monetization).
- Live SaaS video communication product handling meetings and collaborative sessions.
- Webinar product and monetization workflows.
- Subscription plans and entitlement logic across account tiers.
- Individual vs organization architecture with seats, roles, administration, and branding.
- Referral and affiliate network mechanics.
- AI Notes feature for automated post-meeting structured summaries.

3. NexaLife Care (Healthcare Referral-to-Care and Patient Transit Platform) - Live product:
- Product Manager (Operational and Compliance Workflows).
- Live healthcare referral-to-care platform connecting patients, clinics, and transit providers.
- Ambiguous and high-constraint discovery in healthcare operational workflows.
- Modelled both self-managed and assisted patient journeys with conditional fallbacks.
- Human + software operating model coordinating dispatchers, drivers, and clinic staff.
- HIPAA and privacy requirements translated into product behaviour, access controls, and compliance gates.
- Referral, clinic matching, appointment, transportation, and verification workflows.
- Trip Monitor feature enabling real-time transit dispatch verification and post-consultation audit checks.

4. Zenith Property Repairs (Managed Commercial Marketplace and Contractor Ecosystem) - Operational platform:
- Marketplace Product Manager.
- Managed marketplace governing two-sided contractor and property owner transactions.
- AI-assisted repair classification with inspection tiers, safety overrides, and severity rules.
- Five-stage project lifecycle: inspection -> estimate -> quote -> contract -> project.
- Milestone verification and payout logic.
- Change-order workflows and dispute reconciliation.
- Contractor registration and vetting workflows.
- Stripe Connect payout infrastructure and billing reconciliation.
- Support taxonomy, SLA rules, and operational escalation workflows.`,
    structuredData: {
      employmentHistory: [
        {
          role: "Product Owner",
          organization: "MarketGrowthOS",
          period: "2024 - Present",
          responsibilities: ["0 to 1 SaaS definition", "Three-tier multi-tenant architecture", "16-state CRM lifecycle", "15 module PRDs", "1,200+ line QA checklist"],
          achievements: ["Guided 3-developer squad from concept through functional validation without scope creep"],
          skills: ["B2B SaaS", "CRM", "Multi-tenancy", "PRDs", "QA Checklists", "State Machines"]
        },
        {
          role: "Product Manager (Platform & Monetization)",
          organization: "UrCalls",
          period: "2023 - 2024",
          responsibilities: ["Subscription plans", "Entitlement logic", "Org/team hierarchy", "AI Notes", "Live product iteration"],
          achievements: ["Delivered webinar monetization and multi-tier account administrative controls"],
          skills: ["Collaboration SaaS", "Video", "Entitlements", "AI Summaries"]
        },
        {
          role: "Product Manager (Operations & Compliance)",
          organization: "NexaLife Care",
          period: "2022 - 2023",
          responsibilities: ["Patient transit dispatch", "Referral workflows", "Privacy rules translated to controls", "Trip Monitor verification"],
          achievements: ["Built human + software transit verification workflow with post-consultation audit gates"],
          skills: ["Healthcare Workflows", "Compliance", "Dispatch", "Verification"]
        },
        {
          role: "Marketplace Product Manager",
          organization: "Zenith Property Repairs",
          period: "2021 - 2022",
          responsibilities: ["Two-sided contractor marketplace", "5-stage project lifecycle", "Stripe Connect payout infrastructure", "Contractor vetting"],
          achievements: ["Implemented milestone verification escrow gates and contractor SLA tracking"],
          skills: ["Marketplaces", "Payments", "Payouts", "Stripe Connect", "SLA Escalation"]
        }
      ],
      projectsOrProducts: [
        {
          id: "p_mgos",
          name: "MarketGrowthOS",
          headline: "Multi-tenant CRM and Growth Operations SaaS",
          role: "Product Owner",
          context: "0 to 1 SaaS product definition, multi-tenant architecture, and CRM lifecycle states.",
          bullets: [
            "Three-tier multi-tenant architecture with tenant isolation.",
            "16 valid state transitions for CRM lifecycle.",
            "Mautic integration boundary and webhook contradiction detection."
          ],
          capabilities: ["Multi-tenancy", "CRM Lifecycle", "Webhook boundaries", "QA checklists"],
          keywords: ["crm", "saas", "multi-tenant", "api", "webhooks", "specs", "prd"]
        },
        {
          id: "p_urcalls",
          name: "UrCalls",
          headline: "Video Communication and Collaboration SaaS Product",
          role: "Product Manager",
          context: "Live SaaS video communication product, subscription plans, and entitlement logic.",
          bullets: [
            "Subscription plans and entitlement logic across account tiers.",
            "Individual vs organization architecture with seats and administration.",
            "AI Notes feature for automated post-meeting structured summaries."
          ],
          capabilities: ["Subscriptions", "Entitlements", "Video collaboration", "AI summaries"],
          keywords: ["video", "collaboration", "saas", "subscriptions", "entitlements"]
        },
        {
          id: "p_nexalife",
          name: "NexaLife Care",
          headline: "Healthcare Referral-to-Care and Patient Transit Platform",
          role: "Product Manager",
          context: "Healthcare operational platform connecting clinics, patients, and transit.",
          bullets: [
            "Modelled self-managed and assisted patient journeys.",
            "HIPAA and privacy requirements translated into access controls.",
            "Trip Monitor real-time transit dispatch verification."
          ],
          capabilities: ["Patient journeys", "Healthcare operations", "Privacy controls", "Verification"],
          keywords: ["healthcare", "patient", "referral", "hipaa", "privacy", "transit"]
        },
        {
          id: "p_zenith",
          name: "Zenith Property Repairs",
          headline: "Managed Commercial Marketplace and Contractor Ecosystem",
          role: "Marketplace Product Manager",
          context: "Two-sided commercial marketplace connecting property owners and contractors.",
          bullets: [
            "5-stage project lifecycle: inspection -> estimate -> quote -> contract -> project.",
            "Milestone verification and Stripe Connect payout infrastructure.",
            "Contractor registration and vetting workflows."
          ],
          capabilities: ["Managed marketplaces", "Milestone payouts", "Stripe Connect", "Contractor vetting"],
          keywords: ["marketplace", "payouts", "contractor", "stripe connect", "milestone"]
        }
      ],
      skills: [
        { category: "Product Practice", items: ["0 to 1 SaaS Definition", "PRD Authoring", "State Machine Modelling", "QA Checklists", "Acceptance Criteria", "Engineering Collaboration"] },
        { category: "Architecture & Systems", items: ["Multi-Tenancy", "API Integration Boundaries", "Webhooks", "Entitlement Logic", "Stripe Connect Payouts"] },
        { category: "Domains", items: ["B2B SaaS", "CRM", "Two-Sided Marketplaces", "Healthcare Operations", "Collaboration Software"] }
      ],
      tools: ["Jira", "Postman", "Figma", "Stripe Dashboard", "Mautic", "Notion"],
      domains: ["B2B SaaS", "CRM", "Managed Marketplaces", "Healthcare Operations", "Video Collaboration"],
      certifications: [
        { id: "cert_pm_1", name: "Certified Scrum Product Owner (CSPO)", issuingOrganization: "Scrum Alliance", dateObtained: "2021", status: "ACTIVE" }
      ],
      education: [
        { id: "edu_pm_1", qualification: "Bachelor of Science", degree: "B.Sc.", fieldOfStudy: "Information Systems", institution: "University of Lagos", startDate: "2016", endDate: "2020", year: "2020", location: "Lagos, Nigeria" }
      ],
      personalDetails: {
        fullName: "Alex Vance",
        preferredName: "Alex",
        email: "alex.vance@example.com",
        phone: "+234 801 234 5678",
        city: "Lagos",
        country: "Nigeria",
        currentLocation: "Lagos, Nigeria",
        eligibleCountries: ["Nigeria"],
        workAuthorization: "Authorized to work in Nigeria; open to worldwide remote contracts",
        remotePreference: "REMOTE_ONLY",
        relocationWillingness: false,
        linkedIn: "https://linkedin.com/in/alex-vance-pm",
        portfolio: "https://alexvance.dev/portfolio"
      },
      currentWork: [
        {
          id: "cw_pm_1",
          employerOrContext: "MarketGrowthOS",
          role: "Product Owner",
          responsibilities: ["0 to 1 SaaS definition", "Three-tier multi-tenant isolation", "16-state CRM lifecycle modelling", "15 module PRDs"],
          projects: ["MarketGrowthOS Core V1", "Webhook Event Bridge", "CRM Funnel Automation"],
          objectives: ["Reach functional alpha sign-off without scope creep", "Zero data desynchronization across webhooks"],
          challenges: ["Managing complex webhook edge-cases with asynchronous downstream services"],
          achievements: ["Authored 1,200+ line QA test specification with webhook contradiction detection"],
          toolsTechnologies: ["Jira", "Postman", "Figma", "Notion", "PostgreSQL"],
          status: "IN_TESTING"
        }
      ],
      industryDomains: [
        { id: "id_pm_1", industry: "B2B SaaS", subIndustry: "CRM & Sales Tech", domain: "Multi-tenant Architecture", periodOfExperience: "2023 - Present", exposureType: "DIRECT_OPERATIONAL", depthOfExperience: "DEEP", evidence: "MarketGrowthOS 16-state CRM model" },
        { id: "id_pm_2", industry: "Commerce & Marketplaces", subIndustry: "Trades & Services", domain: "Escrow & Payout Workflows", periodOfExperience: "2021 - 2022", exposureType: "DIRECT_OPERATIONAL", depthOfExperience: "DEEP", evidence: "Zenith Property Repairs Stripe Connect integration" },
        { id: "id_pm_3", industry: "Healthcare Operations", subIndustry: "Patient Logistics", domain: "Dispatch & Non-Emergency Transit", periodOfExperience: "2022 - 2023", exposureType: "DIRECT_OPERATIONAL", depthOfExperience: "MODERATE", evidence: "NexaLife Care Trip Monitor & HIPAA compliance gates" }
      ],
      achievements: [
        { id: "ach_pm_1", title: "1,200+ Line QA Specification with Zero Webhook Desync", category: "OPERATIONAL", metric: "1,200+ test cases, 0 critical sync failures", context: "MarketGrowthOS asynchronous CRM event integration", evidence: "QA specification document & integration test suites" },
        { id: "ach_pm_2", title: "Two-Tier Monetization Architecture Delivered Ahead of Schedule", category: "BUSINESS", metric: "3 subscription tiers, automated seat licensing", context: "UrCalls collaboration platform", evidence: "Production billing release notes and Stripe webhook logs" },
        { id: "ach_pm_3", title: "Zero Escrow Misallocations Over 500+ Milestone Payouts", category: "QUANTIFIED", metric: "500+ milestones, 100% reconciliation accuracy", context: "Zenith Property Repairs two-sided contractor ecosystem", evidence: "Stripe Connect payout audit logs and ledger reconciliation reports" }
      ],
      challengesSolutions: [
        {
          id: "cs_pm_1",
          challenge: "Preventing State Contradictions Across Asynchronous Webhooks",
          context: "In MarketGrowthOS, parallel webhook notifications from marketing automation and CRM occasionally arrived out-of-order, causing race conditions in lead status.",
          constraints: ["No microservice rewrites permitted", "Limited developer bandwidth (3 developers)"],
          optionsConsidered: ["Client-side polling (rejected for scale)", "Strict database-level state machine with idempotency keys (chosen)"],
          decisionOrAction: "Specified a strict 16-state deterministic transition table requiring idempotency keys and state preconditions for every mutation.",
          reasoning: "Eliminates race conditions mathematically at the database boundary rather than relying on network delivery order.",
          solution: "Implemented idempotent state engine in PostgreSQL transactions with rejection logs for invalid transitions.",
          tradeoff: "Slightly increased latency on duplicate webhook re-deliveries, but guaranteed absolute data integrity.",
          result: "Zero state desynchronizations recorded across 50,000 simulated events during stress testing.",
          evidence: "MarketGrowthOS State Engine Architecture Document v1.4",
          measurementState: "MEASURED"
        }
      ],
      leadershipOwnership: [
        { id: "lo_pm_1", title: "Sole Product Owner for 3-Developer Engineering Squad", ownershipType: "TEAM_LEADERSHIP", description: "Led daily standups, backlog grooming, PRD walkthroughs, and QA sign-offs with developers.", evidence: "MarketGrowthOS Jira sprint board" },
        { id: "lo_pm_2", title: "Milestone Payout Escrow Decision Authority", ownershipType: "DECISION_MAKING", description: "Defined safety overrides, dispute reconciliation rules, and contractor suspension policies.", evidence: "Zenith Property Repairs operations handbook" }
      ],
      claimsDiscipline: {
        supportedClaims: [
          "0 to 1 SaaS scoping and state machine specification",
          "Multi-tenant database isolation and permission models",
          "PRD writing across 15+ functional modules",
          "Stripe Connect escrow and milestone payouts"
        ],
        unsupportedClaims: [
          "No claimed $10M+ commercial scale or ARR figures",
          "No claimed production software engineering code authorship",
          "No formal legal HIPAA privacy officer credentials"
        ],
        missingEvidence: ["Exact user retention cohort analytics for early alpha products"],
        missingMetrics: ["Customer acquisition cost (CAC) benchmarks"],
        unverifiedInformation: [],
        candidateRestrictions: [
          "Do not represent as an outbound sales SDR or cold caller",
          "Do not claim hospital EHR clinical integration protocols (HL7/FHIR)",
          "Do not claim bank debt collection underwriting"
        ],
        excludedPresentations: ["Pure sales commission roles", "Cryptocurrency trading"],
        verificationRequired: []
      },
      strictBoundaries: [
        "Never invent customer adoption, revenue, or market share",
        "Never claim commercial scale ($10M ARR) or quantified outcomes not in evidence",
        "Never claim formal certifications or professional licenses (e.g. legal HIPAA officer, FDA)",
        "Never claim software engineering degrees or production coding experience",
        "Do not claim hospital EHR clinical integration protocols (HL7/FHIR)",
        "Do not claim banking credit lending underwriting or balance-sheet debt collection"
      ]
    },
    updatedAt: new Date().toISOString()
  },
  cvVariants: [
    {
      id: "cv_pm_core",
      fileName: "Alex_Vance_Core_PM_CV.pdf",
      userDefinedName: "Core Product Manager CV",
      description: "General product ownership, PRD depth, state machine modelling, and cross-functional squad leadership.",
      rawText: "Core Product Manager CV summary: Systems-first Product Manager experienced in decomposing complex operational challenges into unambiguous specifications, state machines, and acceptance criteria.",
      parsedSections: [
        { title: "Summary", content: "Product Manager experienced in 0 to 1 SaaS definitions, operational state engines, and engineering squad leadership." },
        { title: "Core Experience", content: "MarketGrowthOS, UrCalls, NexaLife Care, Zenith Property Repairs." }
      ],
      highlightedSkills: ["0 to 1 Product Definition", "PRD Authoring", "State Machines", "QA Checklists"],
      highlightedExperiences: ["MarketGrowthOS", "UrCalls", "Zenith Property Repairs", "NexaLife Care"],
      isActive: true,
      uploadedAt: "2026-10-01T10:00:00Z",
      updatedAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "cv_pm_tech",
      fileName: "Alex_Vance_Technical_PM_CV.pdf",
      userDefinedName: "Technical Product Manager CV",
      description: "APIs, webhook boundaries, multi-tenant database isolation, and engineering collaboration.",
      rawText: "Technical Product Manager CV: Deep focus on developer platform APIs, webhook event contradiction detection, multi-tenancy, and engineering feasibility.",
      parsedSections: [
        { title: "Summary", content: "Technical Product Manager specializing in API specifications, webhook contradiction detection, and engineering squad alignment." },
        { title: "Key Projects", content: "MarketGrowthOS API boundaries and UrCalls collaboration infrastructure." }
      ],
      highlightedSkills: ["API Integration Boundaries", "Webhook Contradiction Detection", "Multi-Tenant Isolation", "Technical Feasibility"],
      highlightedExperiences: ["MarketGrowthOS", "UrCalls"],
      isActive: true,
      uploadedAt: "2026-10-01T10:00:00Z",
      updatedAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "cv_pm_saas",
      fileName: "Alex_Vance_B2B_SaaS_PM_CV.pdf",
      userDefinedName: "B2B SaaS / CRM Product Manager CV",
      description: "CRM lifecycle, 16 state transitions, qualification gates, and subscription entitlement logic.",
      rawText: "B2B SaaS PM CV: Specializing in CRM lifecycles, two-step qualification gates, multi-tenancy, and subscription tiers.",
      parsedSections: [
        { title: "Summary", content: "B2B SaaS Product Manager with 0 to 1 definition experience, 16 CRM state transitions, and entitlement logic." }
      ],
      highlightedSkills: ["B2B SaaS", "CRM Lifecycle", "16 State Transitions", "Subscription Plans"],
      highlightedExperiences: ["MarketGrowthOS", "UrCalls"],
      isActive: true,
      uploadedAt: "2026-10-01T10:00:00Z",
      updatedAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "cv_pm_marketplace",
      fileName: "Alex_Vance_Marketplace_Payments_PM_CV.pdf",
      userDefinedName: "Marketplace & Payments Product Manager CV",
      description: "Two-sided contractor marketplaces, milestone payouts, and Stripe Connect payout infrastructure.",
      rawText: "Marketplace & Payments PM CV: End-to-end commercial project lifecycle, milestone verification, contractor vetting, and Stripe Connect payout infrastructure.",
      parsedSections: [
        { title: "Summary", content: "Marketplace Product Manager specialized in two-sided commercial workflows and milestone payout infrastructure." }
      ],
      highlightedSkills: ["Managed Marketplaces", "Milestone Verification", "Stripe Connect Payouts", "Contractor Vetting"],
      highlightedExperiences: ["Zenith Property Repairs", "MarketGrowthOS"],
      isActive: true,
      uploadedAt: "2026-10-01T10:00:00Z",
      updatedAt: "2026-10-01T10:00:00Z"
    }
  ],
  preferences: {
    targetRoles: ["Product Manager", "Technical Product Manager", "Product Owner", "Platform Product Manager", "Marketplace Product Manager"],
    targetSeniority: ["Product Manager", "Senior Product Manager", "Product Owner"],
    preferredIndustries: ["B2B SaaS", "CRM", "Developer Platforms", "Marketplaces", "Collaboration Software"],
    excludedIndustries: ["Cryptocurrency Speculation", "Gambling", "Pure Outbound Sales"],
    preferredLocations: ["Nigeria", "Remote Worldwide", "Sub-Saharan Africa"],
    remotePreference: "REMOTE_ONLY",
    eligibleCountries: ["Nigeria"],
    workAuthorizations: ["Nigeria"],
    salaryExpectation: "$60,000 - $95,000 / year (Remote)",
    excludedJobTypes: ["Commission-Only", "Outbound Cold Calling SDR", "Recruitment Specialist"],
    maxApplicationFee: 0,
    willingToRelocate: false,
    notes: "Strict $0 application policy. Exclude roles requiring US/UK resident work permits."
  }
};

// -------------------------------------------------------------
// PRESET B: Clinical Nurse Specialist / Acute Care Registered Nurse
// Radically different profession to verify candidate-agnostic behaviour!
// -------------------------------------------------------------
export const PRESET_CLINICAL_NURSE: CandidatePreset = {
  id: "preset_nurse",
  name: "Candidate B (Registered Nurse / Clinical Care)",
  profession: "Registered Nurse",
  description: "Acute care, intensive care unit (ICU), emergency triage, patient advocacy, BLS/ACLS certified.",
  careerPathways: [
    {
      id: "pathway_nurse_01",
      title: "Inpatient Critical Care & ICU Staff Nurse",
      roleFamily: "Critical Care Nursing",
      targetSeniority: "Senior Staff Nurse / Charge Nurse",
      rationale: "Directly grounded in 2 years ICU experience, ventilator management, continuous vasoactive infusions, and code team resuscitation.",
      supportingEvidence: [
        "St. Nicholas Hospital: 1:2 nurse-to-patient critical care ratio in adult ICU",
        "AHA ACLS & BLS credentials, continuous hemodynamics and ventilator monitoring"
      ],
      gaps: [],
      isApproved: true,
      confidence: "HIGH",
      source: "USER_DEFINED",
      createdAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "pathway_nurse_02",
      title: "Emergency Department Acute Trauma Nurse",
      roleFamily: "Emergency Nursing",
      targetSeniority: "Staff Nurse / Emergency Triage",
      rationale: "Directly grounded in ESI triage of 50+ acute patients daily, trauma stabilization, and rapid EKG/phlebotomy at Lagoon Hospital.",
      supportingEvidence: [
        "Lagoon Hospital: ESI emergency triage protocols, door-to-treatment reduction",
        "AHA PALS certification and acute trauma resuscitation"
      ],
      gaps: [],
      isApproved: true,
      confidence: "HIGH",
      source: "USER_DEFINED",
      createdAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "pathway_nurse_03",
      title: "Hospital Telehealth & Remote Patient Monitoring Nurse",
      roleFamily: "Telehealth Nursing",
      targetSeniority: "Telehealth Clinical Coordinator",
      rationale: "Transferable clinical assessment skills and triage protocol knowledge. Candidate preferences allow hospital outpatient follow-up.",
      supportingEvidence: [
        "Bedside patient education and standardized sepsis warning protocol leadership"
      ],
      gaps: [
        "Requires familiarity with remote telemedicine outpatient billing software."
      ],
      isApproved: false,
      confidence: "MEDIUM",
      source: "AI_SUGGESTED",
      createdAt: "2026-10-03T11:00:00Z"
    }
  ],
  masterCV: {
    id: "mcv_nurse_01",
    sourceProfileId: "profile_nurse_01",
    title: "Master Clinical Curriculum Vitae — Sarah Chen, BSN, RN",
    candidateName: "Sarah Chen, BSN, RN",
    contactInfo: "sarah.chen.rn@example.com · Lagos, Nigeria",
    professionalSummary: "Compassionate, highly disciplined Registered Nurse (BSN, RN) with 5 years documented acute clinical care in high-acuity Intensive Care Units and Emergency Departments. Expert in vital stabilization, mechanical ventilation, hemodynamic arterial monitoring, vasoactive drug titration, and multidisciplinary clinical hand-offs.",
    sections: [
      {
        heading: "Licensure & Certifications",
        items: [
          "Registered Nurse (RN) License #RN-88291 (Nursing Council)",
          "Advanced Cardiovascular Life Support (ACLS) — American Heart Association",
          "Basic Life Support (BLS) — American Heart Association",
          "Pediatric Advanced Life Support (PALS) — AHA"
        ]
      },
      {
        heading: "Clinical Hospital Experience",
        items: [
          "St. Nicholas Hospital (2022 - Present) — Senior Staff Nurse (ICU): Managed 1:2 nurse-to-patient critical care ratios; mechanical ventilator protocols; zero medication administration errors over 24 months.",
          "Lagoon Hospital (2020 - 2022) — Staff Nurse (Emergency Department): Triaged 50+ acute patients daily using ESI protocols; reduced door-to-treatment time by 18 minutes."
        ]
      }
    ],
    fullMarkdown: `# Sarah Chen, BSN, RN
**Registered Nurse License #RN-88291** | **Contact:** sarah.chen.rn@example.com

## Professional Summary
Registered Nurse with 5 years acute care experience in emergency departments and adult intensive care units (ICU). Certified in ACLS, BLS, and PALS.

## Clinical Experience
### St. Nicholas Hospital — Senior Staff Nurse (ICU) (2022 - Present)
* Managed 1:2 nurse-to-patient ratio in 12-bed adult intensive care unit.
* Titrated vasoactive continuous infusions and monitored mechanical ventilators.
* Mentored 6 graduate nurse residents; zero medication errors over 24-month tenure.

### Lagoon Hospital — Emergency Department Staff Nurse (2020 - 2022)
* Triaged 50+ acute patients daily via Emergency Severity Index (ESI) protocols.
* Rapid acute stabilization for coronary syndromes, stroke alerts, and trauma.
`,
    candidateApproved: true,
    generatedAt: "2026-10-01T10:00:00Z",
    updatedAt: "2026-10-01T10:00:00Z"
  },
  masterProfile: {
    id: "profile_nurse_01",
    candidateName: "Sarah Chen, BSN, RN",
    primaryProfession: "Registered Nurse",
    corePositioning: "Experienced Acute Care and ICU Registered Nurse specialized in critical care triage, patient monitoring, medication administration, and interdisciplinary clinical collaboration.",
    workingMethod: "Patient Assessment -> Critical Triage -> Evidence-Based Clinical Protocol Execution -> Vital Stabilization -> Interdisciplinary Hand-off -> Detailed Charting.",
    location: "Lagos, Nigeria (Open to international clinical hospital contracts with visa sponsorship or local healthcare networks)",
    workAuthorisation: "Nigeria (Active Nursing and Midwifery Council Registered Nurse License)",
    rawText: `Master Job Profile: Registered Nurse (BSN, RN)
Professional Summary: Registered Nurse with 5 years acute care experience in emergency departments, intensive care units (ICU), and surgical post-op recovery.
Licensing & Credentials:
- Bachelor of Science in Nursing (BSN)
- Registered Nurse (RN) License #RN-88291
- Basic Life Support (BLS) Certified (AHA)
- Advanced Cardiovascular Life Support (ACLS) Certified (AHA)
- Pediatric Advanced Life Support (PALS) Certified

Clinical Experience:
1. St. Nicholas Hospital - Senior Staff Nurse (ICU & Critical Care) (2022 - Present):
- Managed 1:2 nurse-to-patient critical care ratios in 12-bed adult intensive care unit.
- Administered vasoactive continuous intravenous infusions, mechanical ventilator monitoring, and invasive arterial line hemodynamics.
- Coordinated rapid response emergency resuscitations and code blue teams.
- Conducted patient and family education on critical disease management and post-discharge protocols.

2. Lagoon Hospital - Emergency Department Staff Nurse (2020 - 2022):
- Triaged 50+ acute patients daily using Emergency Severity Index (ESI) protocols.
- Managed traumatic injuries, acute coronary syndromes, stroke alerts, and severe respiratory compromise.
- Administered controlled medications, inserted peripheral IV lines, and performed phlebotomy and 12-lead EKGs.

Strict Boundaries:
- Licensed for Nursing practice (BSN, RN). Does not hold Physician (MD) or Surgeon licensing.
- Documented in hospital acute care. Does not have software engineering or product management experience.`,
    structuredData: {
      employmentHistory: [
        {
          role: "Senior Staff Nurse (ICU & Critical Care)",
          organization: "St. Nicholas Hospital",
          period: "2022 - Present",
          responsibilities: ["1:2 ICU patient care", "Ventilator and hemodynamic monitoring", "Vasoactive infusions", "Code blue team resuscitation", "EMR electronic charting"],
          achievements: ["Zero medication administration errors over 24-month ICU tenure; mentored 6 graduate nurse residents"],
          skills: ["Critical Care", "Hemodynamic Monitoring", "Ventilator Management", "ACLS Resuscitation", "Clinical Charting"]
        },
        {
          role: "Staff Nurse (Emergency Department)",
          organization: "Lagoon Hospital",
          period: "2020 - 2022",
          responsibilities: ["ESI emergency triage", "Acute trauma stabilization", "IV insertion & phlebotomy", "12-lead EKG interpretation"],
          achievements: ["Reduced triage door-to-treatment time by 18 minutes through standardized triage intake checklists"],
          skills: ["Emergency Triage", "ESI Scoring", "Trauma Care", "Medication Administration"]
        }
      ],
      projectsOrProducts: [
        {
          id: "proj_icu_sepsis",
          name: "ICU Sepsis Early Warning Protocol",
          headline: "Clinical Quality Improvement Initiative",
          role: "Nurse Lead",
          context: "Led bedside implementation of standardized lactate and vital check protocols for early sepsis detection.",
          bullets: [
            "Trained 18 staff nurses on early sepsis diagnostic markers.",
            "Established vital check intervals reducing septic shock escalation in ICU."
          ],
          capabilities: ["Sepsis Protocol", "Clinical Training", "Bedside Monitoring"],
          keywords: ["sepsis", "icu", "critical care", "triage", "protocol"]
        }
      ],
      skills: [
        { category: "Clinical Competencies", items: ["Critical Care Nursing", "ICU Patient Management", "Emergency Triage", "Hemodynamic Monitoring", "IV Therapy", "Code Blue Resuscitation"] },
        { category: "Medical Tools & Systems", items: ["Electronic Health Records (Cerner/Epic)", "Mechanical Ventilators", "Infusion Pumps", "Defibrillators", "Telemetry"] }
      ],
      tools: ["Electronic Health Records (EHR)", "Infusion Pumps", "Ventilators", "Defibrillator", "Telemetry"],
      domains: ["Healthcare", "Critical Care", "Emergency Medicine", "Inpatient Hospital Care"],
      certifications: [
        { id: "cert_rn_1", name: "Registered Nurse (RN) License #RN-88291", issuingOrganization: "Nursing and Midwifery Council", dateObtained: "2020", status: "ACTIVE" },
        { id: "cert_rn_2", name: "Basic Life Support (BLS)", issuingOrganization: "American Heart Association", dateObtained: "2024", status: "ACTIVE" },
        { id: "cert_rn_3", name: "Advanced Cardiovascular Life Support (ACLS)", issuingOrganization: "American Heart Association", dateObtained: "2024", status: "ACTIVE" },
        { id: "cert_rn_4", name: "Pediatric Advanced Life Support (PALS)", issuingOrganization: "American Heart Association", dateObtained: "2023", status: "ACTIVE" }
      ],
      education: [
        { id: "edu_rn_1", qualification: "Bachelor of Science in Nursing", degree: "BSN", fieldOfStudy: "Nursing Science", institution: "University College Hospital", startDate: "2016", endDate: "2020", year: "2020", location: "Ibadan, Nigeria" }
      ],
      personalDetails: {
        fullName: "Sarah Chen, BSN, RN",
        preferredName: "Sarah",
        email: "sarah.chen.rn@example.com",
        phone: "+234 802 345 6789",
        city: "Lagos",
        country: "Nigeria",
        currentLocation: "Lagos, Nigeria",
        eligibleCountries: ["Nigeria"],
        workAuthorization: "Licensed Registered Nurse in Nigeria; eligible for international healthcare contracts with visa sponsorship",
        remotePreference: "ONSITE_OK",
        relocationWillingness: true,
        linkedIn: "https://linkedin.com/in/sarah-chen-bsn-rn"
      },
      currentWork: [
        {
          id: "cw_nurse_1",
          employerOrContext: "St. Nicholas Hospital",
          role: "Senior Staff Nurse (ICU & Critical Care)",
          responsibilities: ["1:2 patient ratio in adult ICU", "Arterial line and central venous pressure monitoring", "Mechanical ventilator protocol management", "Medication titration"],
          projects: ["Hospital Sepsis Reduction Working Group", "Clinical Mentorship Residency"],
          objectives: ["Maintain zero medication administration error rate", "Reduce door-to-antibiotic interval for septic patients"],
          challenges: ["Managing high-acuity multisystem organ failure during staffing surges"],
          achievements: ["Zero medication administration errors over 24 months in ICU"],
          toolsTechnologies: ["Cerner EHR", "Dräger Ventilators", "Alaris Infusion Pumps", "Philips Intellivue Monitors"],
          status: "LIVE_SHIPPED"
        }
      ],
      industryDomains: [
        { id: "id_rn_1", industry: "Healthcare & Hospital Care", subIndustry: "Inpatient Critical Care", domain: "Adult Intensive Care Unit (ICU)", periodOfExperience: "2022 - Present", exposureType: "DIRECT_OPERATIONAL", depthOfExperience: "DEEP", evidence: "St. Nicholas Hospital ICU Charge Nurse shifts" },
        { id: "id_rn_2", industry: "Healthcare & Emergency Care", subIndustry: "Acute Emergency Medicine", domain: "Emergency Severity Index (ESI) Triage", periodOfExperience: "2020 - 2022", exposureType: "DIRECT_OPERATIONAL", depthOfExperience: "DEEP", evidence: "Lagoon Hospital Emergency Department" }
      ],
      achievements: [
        { id: "ach_rn_1", title: "Zero Medication Administration Errors Over 24-Month ICU Tenure", category: "OPERATIONAL", metric: "10,000+ doses administered with 0 adverse drug events", context: "High-risk intravenous vasoactive and sedative medication administration in adult ICU", evidence: "Hospital pharmacy clinical quality audits" },
        { id: "ach_rn_2", title: "18-Minute Reduction in Emergency Triage Door-to-Treatment Time", category: "EFFICIENCY", metric: "-18 minutes door-to-treatment", context: "Lagoon Hospital Emergency Department triage workflow redesign", evidence: "Lagoon Hospital annual clinical review" }
      ],
      challengesSolutions: [
        {
          id: "cs_rn_1",
          challenge: "Rapid Identification of Occult Sepsis in Post-Operative Patients",
          context: "Post-surgical ICU patients occasionally exhibited subtle vital changes preceding rapid septic shock deterioration.",
          constraints: ["High patient acuity", "Strict antibiotic timing windows (within 60 mins)"],
          optionsConsidered: ["Wait for physician rounds (rejected due to delay risk)", "Institute nurse-driven early sepsis warning protocol with stat lactate draws (chosen)"],
          decisionOrAction: "Collaborated with ICU clinical director to implement standardized nurse-initiated sepsis triage checklists.",
          reasoning: "Early bedside nurse escalation reduces septic shock mortality significantly.",
          solution: "Standardized q2h mean arterial pressure and urine output alerts paired with bedside point-of-care lactate testing.",
          tradeoff: "Required additional documentation steps for nursing staff, but detected shock early.",
          result: "Identified 14 occult sepsis cases early in year 1, preventing septic shock escalation in 12 patients.",
          evidence: "St. Nicholas Quality Improvement Report 2023",
          measurementState: "MEASURED"
        }
      ],
      leadershipOwnership: [
        { id: "lo_rn_1", title: "Charge Nurse for 12-Bed Intensive Care Unit", ownershipType: "TEAM_LEADERSHIP", description: "Directed shift nursing staff, managed bed allocations, and led multidisciplinary clinical rounds.", evidence: "St. Nicholas shift rosters" },
        { id: "lo_rn_2", title: "Residency Preceptor for Graduate Nurses", ownershipType: "MENTORING", description: "Mentored and evaluated 6 graduate nurse residents through intensive care onboarding.", evidence: "Clinical preceptor evaluations" }
      ],
      claimsDiscipline: {
        supportedClaims: [
          "5 years documented acute clinical hospital nursing",
          "BSN degree from accredited university",
          "Active Registered Nurse license",
          "ACLS, BLS, and PALS certifications"
        ],
        unsupportedClaims: [
          "Does not hold Physician (MD) or Surgeon credentials",
          "Does not hold Advanced Practice Registered Nurse (NP/CRNA) license",
          "No technology or software engineering experience"
        ],
        missingEvidence: [],
        missingMetrics: [],
        unverifiedInformation: [],
        candidateRestrictions: [
          "Do not present for physician or surgical roles",
          "Do not present for tech product management or coding roles"
        ],
        excludedPresentations: ["Physician", "Product Manager", "Software Engineer"],
        verificationRequired: []
      },
      strictBoundaries: [
        "Do not claim Physician or Surgeon credentials",
        "Do not claim tech product management or coding experience",
        "Never invent clinical trial principal investigator credentials"
      ]
    },
    updatedAt: new Date().toISOString()
  },
  cvVariants: [
    {
      id: "cv_nurse_icu",
      fileName: "Sarah_Chen_ICU_Critical_Care_CV.pdf",
      userDefinedName: "ICU Critical Care Specialist CV",
      description: "Focused on adult intensive care, ventilator management, hemodynamic monitoring, and code resuscitation.",
      rawText: "Sarah Chen BSN RN - Critical Care ICU Specialist CV. 5 years acute care experience, ACLS/BLS certified, 1:2 patient ratio ICU management.",
      parsedSections: [
        { title: "Summary", content: "BSN RN with extensive ICU critical care experience managing complex post-operative and septic patients." }
      ],
      highlightedSkills: ["ICU Critical Care", "Ventilator Management", "Hemodynamics", "ACLS"],
      highlightedExperiences: ["St. Nicholas Hospital ICU"],
      isActive: true,
      uploadedAt: "2026-10-01T10:00:00Z",
      updatedAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "cv_nurse_er",
      fileName: "Sarah_Chen_Emergency_Triage_CV.pdf",
      userDefinedName: "Emergency Department Triage Nurse CV",
      description: "Focused on high-volume emergency room triage, acute trauma, and code response.",
      rawText: "Sarah Chen BSN RN - Emergency Room Staff Nurse CV. ESI triage certified, rapid trauma intake, acute cardiac and stroke response.",
      parsedSections: [
        { title: "Summary", content: "Emergency Department Staff Nurse experienced in rapid triage, trauma stabilization, and emergency medication." }
      ],
      highlightedSkills: ["ESI Emergency Triage", "Trauma Stabilization", "Code Blue Response"],
      highlightedExperiences: ["Lagoon Hospital Emergency Department"],
      isActive: true,
      uploadedAt: "2026-10-01T10:00:00Z",
      updatedAt: "2026-10-01T10:00:00Z"
    }
  ],
  preferences: {
    targetRoles: ["Registered Nurse", "ICU Staff Nurse", "Critical Care Nurse", "Emergency Department Nurse", "Clinical Nurse Lead"],
    targetSeniority: ["Staff Nurse", "Senior Staff Nurse", "Charge Nurse"],
    preferredIndustries: ["Hospital Inpatient Care", "Emergency Medicine", "Intensive Care Units"],
    excludedIndustries: ["Home Health Aide", "Sales Rep", "Non-Clinical Administration"],
    preferredLocations: ["Lagos, Nigeria", "United Kingdom (with visa sponsorship)", "Canada (with express entry/sponsorship)"],
    remotePreference: "ONSITE_OK",
    eligibleCountries: ["Nigeria"],
    workAuthorizations: ["Nigeria Registered Nurse License"],
    salaryExpectation: "Standard hospital clinical compensation",
    excludedJobTypes: ["Unlicensed Caregiver", "Commission Sales"],
    maxApplicationFee: 0,
    willingToRelocate: true,
    notes: "Requires genuine clinical hospital positions. Do not apply to non-clinical sales or software roles."
  }
};

// -------------------------------------------------------------
// PRESET C: Full-Stack Software Engineer
// -------------------------------------------------------------
export const PRESET_SOFTWARE_ENGINEER: CandidatePreset = {
  id: "preset_swe",
  name: "Candidate C (Full-Stack Software Engineer)",
  profession: "Software Engineer",
  description: "TypeScript, Node.js, React, PostgreSQL, distributed systems, cloud infrastructure.",
  careerPathways: [
    {
      id: "pathway_swe_01",
      title: "Platform & Distributed Backend Engineer",
      roleFamily: "Backend Engineering",
      targetSeniority: "Senior Backend Engineer / Staff",
      rationale: "Supported by high-throughput payment webhook processing (450 req/sec), Redis distributed locking, and PostgreSQL schema optimization at PaySync.",
      supportingEvidence: [
        "PaySync Technologies: 450 req/sec payment service with 99.98% uptime in Node.js and PostgreSQL",
        "Redis distributed locking and database indexing migrations"
      ],
      gaps: [],
      isApproved: true,
      confidence: "HIGH",
      source: "USER_DEFINED",
      createdAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "pathway_swe_02",
      title: "Full-Stack Web Application Architect",
      roleFamily: "Full-Stack Engineering",
      targetSeniority: "Senior Full-Stack Engineer",
      rationale: "Supported by production React, TypeScript, Next.js client portal serving 35,000 monthly active users at CloudScale Africa.",
      supportingEvidence: [
        "CloudScale Africa: Enterprise portal with React, TypeScript, and Docker container deployments",
        "REST and GraphQL API architecture with OAuth2 flows"
      ],
      gaps: [],
      isApproved: true,
      confidence: "HIGH",
      source: "USER_DEFINED",
      createdAt: "2026-10-01T10:00:00Z"
    },
    {
      id: "pathway_swe_03",
      title: "Engineering Squad Technical Lead",
      roleFamily: "Engineering Leadership",
      targetSeniority: "Tech Lead",
      rationale: "Grounded in leading 4 backend engineers and production release sign-off authority at PaySync.",
      supportingEvidence: [
        "PaySync Technologies: Mentored junior engineers, established CI/CD testing pipelines"
      ],
      gaps: [],
      isApproved: true,
      confidence: "HIGH",
      source: "USER_DEFINED",
      createdAt: "2026-10-01T10:00:00Z"
    }
  ],
  masterCV: {
    id: "mcv_swe_01",
    sourceProfileId: "profile_swe_01",
    title: "Master Technical Curriculum Vitae — David Oladipo",
    candidateName: "David Oladipo",
    contactInfo: "david.oladipo.dev@example.com · Lagos, Nigeria / Worldwide Remote",
    professionalSummary: "Senior Full-Stack Software Engineer with 6 years building distributed cloud web services, high-throughput REST/GraphQL APIs, and resilient React/TypeScript frontends. Proven track record scaling fintech backend systems to 450 req/sec with 99.98% uptime.",
    sections: [
      {
        heading: "Core Technical Stack",
        items: [
          "Languages: TypeScript, JavaScript, Python, SQL",
          "Backend: Node.js, Express, PostgreSQL, Redis, REST, GraphQL",
          "Frontend: React, Next.js, Tailwind CSS, State Management",
          "Cloud & DevOps: AWS (Solutions Architect Certified), Docker, CI/CD, Git"
        ]
      },
      {
        heading: "Production Engineering Experience",
        items: [
          "PaySync Technologies (2022 - Present) — Senior Backend & Platform Engineer: Scaled payment webhook processing pipeline to 450 req/sec; distributed Redis locks; mentored 4 engineers.",
          "CloudScale Africa (2019 - 2022) — Full-Stack Developer: Built client-facing web application portal used by 35,000 active monthly business users."
        ]
      }
    ],
    fullMarkdown: `# David Oladipo — Senior Full-Stack Software Engineer
**AWS Certified Solutions Architect** | **Contact:** david.oladipo.dev@example.com

## Summary
Senior Full-Stack Software Engineer with 6 years building distributed cloud web services in TypeScript, Node.js, PostgreSQL, and React.

## Experience
### PaySync Technologies — Senior Backend & Platform Engineer (2022 - Present)
* Architected high-throughput payment webhook processing service handling 450+ req/sec in Node.js and PostgreSQL.
* Implemented distributed locking via Redis to prevent race conditions during concurrent financial transactions.
* Mentored 4 engineers and established automated GitHub Actions CI/CD.

### CloudScale Africa — Full-Stack Developer (2019 - 2022)
* Developed responsive web portal in React, TypeScript, and Next.js serving 35,000 MAUs.
* Dockerized deployments on AWS ECS and GCP Cloud Run.
`,
    candidateApproved: true,
    generatedAt: "2026-10-01T10:00:00Z",
    updatedAt: "2026-10-01T10:00:00Z"
  },
  masterProfile: {
    id: "profile_swe_01",
    candidateName: "David Oladipo",
    primaryProfession: "Software Engineer",
    corePositioning: "Senior Full-Stack Engineer with 6 years building distributed cloud web services, high-throughput REST/GraphQL APIs, and resilient React/TypeScript frontends.",
    workingMethod: "Requirement Architecture -> Schema Design -> TDD Unit Testing -> Clean Modular Code -> CI/CD Pipeline Deployment -> Observability & Monitoring.",
    location: "Nigeria / Remote (Worldwide)",
    workAuthorisation: "Nigeria (Remote international contractor)",
    rawText: `Master Job Profile: Senior Full-Stack Software Engineer
Summary: 6 years building production systems in TypeScript, Node.js, Python, PostgreSQL, and React. Extensive background in cloud infrastructure (AWS/GCP), Docker, Redis, and event-driven microservices.

Employment:
1. PaySync Technologies - Senior Backend & Platform Engineer (2022 - Present):
- Architected high-throughput payment webhook processing service handling 450+ req/sec in Node.js and PostgreSQL.
- Implemented distributed locking via Redis to prevent race conditions during concurrent financial transactions.
- Designed database migrations, connection pooling, and optimized SQL query execution plans.
- Mentored junior engineers, established automated CI/CD testing pipelines with GitHub Actions.

2. CloudScale Africa - Full-Stack Developer (2019 - 2022):
- Developed responsive web applications using React, TypeScript, Tailwind CSS, and Next.js.
- Integrated third-party REST APIs, GraphQL endpoints, and OAuth2 authentication flows.
- Automated Docker container deployments on Google Cloud Run and AWS ECS.`,
    structuredData: {
      employmentHistory: [
        {
          role: "Senior Backend & Platform Engineer",
          organization: "PaySync Technologies",
          period: "2022 - Present",
          responsibilities: ["High-throughput API development", "Database indexing & schema design", "Redis caching & locks", "CI/CD pipelines"],
          achievements: ["Scaled transaction processing pipeline to 450 req/sec with 99.98% uptime"],
          skills: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS"]
        },
        {
          role: "Full-Stack Developer",
          organization: "CloudScale Africa",
          period: "2019 - 2022",
          responsibilities: ["React and TypeScript frontend architecture", "REST/GraphQL API integrations", "Dockerized deployments"],
          achievements: ["Built client-facing portal used by 35,000 active monthly business users"],
          skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST APIs"]
        }
      ],
      projectsOrProducts: [
        {
          id: "proj_swe_paysync",
          name: "PaySync High-Throughput Webhook Engine",
          headline: "Distributed Event Processing Platform",
          role: "Senior Backend Engineer",
          context: "Payment reconciliation pipeline handling financial webhooks with Redis distributed locking and idempotent database transitions.",
          bullets: [
            "Processed 450+ req/sec during peak financial traffic with zero race conditions.",
            "Architected Redis locking and PostgreSQL schema partitioning."
          ],
          capabilities: ["Distributed Systems", "Redis Locking", "PostgreSQL Partitioning", "Idempotency"],
          keywords: ["backend", "distributed", "node", "postgresql", "redis", "fintech"]
        }
      ],
      skills: [
        { category: "Languages & Frameworks", items: ["TypeScript", "JavaScript", "Python", "Node.js", "React", "Next.js", "Express"] },
        { category: "Databases & Infrastructure", items: ["PostgreSQL", "Redis", "Docker", "AWS", "GCP", "CI/CD", "Git"] }
      ],
      tools: ["VS Code", "Docker", "PostgreSQL", "Redis", "AWS CloudWatch", "GitHub Actions"],
      domains: ["FinTech", "Cloud Infrastructure", "B2B SaaS", "Developer Platforms"],
      certifications: [
        { id: "cert_swe_1", name: "AWS Certified Solutions Architect - Associate", issuingOrganization: "Amazon Web Services", dateObtained: "2023", status: "ACTIVE" }
      ],
      education: [
        { id: "edu_swe_1", qualification: "Bachelor of Science", degree: "B.Sc.", fieldOfStudy: "Computer Science", institution: "University of Lagos", startDate: "2015", endDate: "2019", year: "2019", location: "Lagos, Nigeria" }
      ],
      personalDetails: {
        fullName: "David Oladipo",
        preferredName: "David",
        email: "david.oladipo.dev@example.com",
        phone: "+234 803 456 7890",
        city: "Lagos",
        country: "Nigeria",
        currentLocation: "Lagos, Nigeria",
        eligibleCountries: ["Nigeria"],
        workAuthorization: "Authorized to work in Nigeria; available for worldwide remote contractor agreements",
        remotePreference: "REMOTE_ONLY",
        relocationWillingness: false,
        gitHub: "https://github.com/davidoladipo-dev",
        linkedIn: "https://linkedin.com/in/david-oladipo-swe"
      },
      currentWork: [
        {
          id: "cw_swe_1",
          employerOrContext: "PaySync Technologies",
          role: "Senior Backend & Platform Engineer",
          responsibilities: ["Architect high-throughput webhook engine", "Maintain 99.98% platform SLA", "Database query optimization and index tuning", "Mentoring 4 squad engineers"],
          projects: ["PaySync Core Engine", "Redis Distributed Lock Manager", "Automated Load Testing Suite"],
          objectives: ["Support 1,000 req/sec target by Q4", "Reduce p99 API response latency under 45ms"],
          challenges: ["Preventing transaction deadlocks during concurrent account balancing"],
          achievements: ["Maintained 99.98% uptime across 18 months of production operation"],
          toolsTechnologies: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS ECS", "Terraform"],
          status: "LIVE_SHIPPED"
        }
      ],
      industryDomains: [
        { id: "id_swe_1", industry: "Financial Technology", subIndustry: "Payment Gateways & Processing", domain: "High-Throughput Webhooks & Ledger Integrity", periodOfExperience: "2022 - Present", exposureType: "DIRECT_OPERATIONAL", depthOfExperience: "DEEP", evidence: "PaySync Technologies platform architecture" },
        { id: "id_swe_2", industry: "Cloud Infrastructure", subIndustry: "Developer Tools", domain: "Containerized Microservices & CI/CD", periodOfExperience: "2019 - Present", exposureType: "DIRECT_OPERATIONAL", depthOfExperience: "DEEP", evidence: "CloudScale Africa Docker & AWS deployments" }
      ],
      achievements: [
        { id: "ach_swe_1", title: "Scaled Payment Webhook Processing to 450 Req/Sec at 99.98% Uptime", category: "OPERATIONAL", metric: "450 req/sec, 99.98% uptime", context: "PaySync distributed Node.js/PostgreSQL infrastructure", evidence: "AWS CloudWatch and Datadog production metrics" },
        { id: "ach_swe_2", title: "Reduced P99 Database Query Latency by 64% via Composite Indexing", category: "EFFICIENCY", metric: "-64% p99 latency (180ms to 65ms)", context: "PostgreSQL transaction history queries", evidence: "pg_stat_statements query execution profiles" }
      ],
      challengesSolutions: [
        {
          id: "cs_swe_1",
          challenge: "Concurrent Ledger Update Collisions Under Peak Holiday Load",
          context: "Simultaneous payment webhooks attempted to mutate the same merchant balance ledger, causing database row-lock contention and 504 gateway timeouts.",
          constraints: ["Absolute ledger balance precision required (zero floating-point drift)", "No data loss tolerated"],
          optionsConsidered: ["Optimistic locking with retries (caused excessive retry overhead)", "Distributed Redis locks with sequential FIFO queues (chosen)"],
          decisionOrAction: "Implemented merchant-partitioned FIFO queues backed by Redis locks with TTL leases.",
          reasoning: "Guarantees serial ledger execution per merchant account while maintaining parallel processing across distinct accounts.",
          solution: "BullMQ queue architecture with Redis distributed lock manager and transactional PostgreSQL inserts.",
          tradeoff: "Added a Redis dependency to the processing tier, requiring cluster failover monitoring.",
          result: "Eliminated lock contention completely; p99 latency dropped from 1,200ms to 42ms under load.",
          evidence: "PaySync Engineering Architecture Postmortem #412",
          measurementState: "MEASURED"
        }
      ],
      leadershipOwnership: [
        { id: "lo_swe_1", title: "Squad Tech Lead for 4 Backend Engineers", ownershipType: "TECHNICAL_OWNERSHIP", description: "Conducted architecture reviews, established pull request standards, and held production deploy sign-off authority.", evidence: "GitHub pull request review history" }
      ],
      claimsDiscipline: {
        supportedClaims: [
          "6 years production full-stack & backend software engineering",
          "B.Sc. in Computer Science",
          "AWS Solutions Architect certification",
          "Production TypeScript, Node.js, and PostgreSQL expertise"
        ],
        unsupportedClaims: [
          "Does not claim Executive VP or Director of Engineering titles",
          "Does not claim medical, clinical, or nursing experience",
          "Does not claim non-technical marketing or sales credentials"
        ],
        missingEvidence: [],
        missingMetrics: [],
        unverifiedInformation: [],
        candidateRestrictions: [
          "Do not present for non-technical sales or medical roles",
          "Do not present for executive VP/C-suite roles"
        ],
        excludedPresentations: ["Executive VP", "Registered Nurse", "Outbound Sales SDR"],
        verificationRequired: []
      },
      strictBoundaries: [
        "Do not claim executive management (VP/Director)",
        "Do not claim nursing, clinical, or medical credentials"
      ]
    },
    updatedAt: new Date().toISOString()
  },
  cvVariants: [
    {
      id: "cv_swe_platform",
      fileName: "David_Oladipo_Platform_Backend_CV.pdf",
      userDefinedName: "Platform & Backend Engineer CV",
      description: "Focused on Node.js, distributed databases, high-throughput APIs, and cloud infrastructure.",
      rawText: "David Oladipo - Senior Backend & Platform Engineer CV. Node.js, TypeScript, PostgreSQL, Redis, distributed microservices.",
      parsedSections: [{ title: "Summary", content: "Senior Platform Engineer specialized in distributed systems and scalable API architectures." }],
      highlightedSkills: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "AWS"],
      highlightedExperiences: ["PaySync Technologies Backend Platform"],
      isActive: true,
      uploadedAt: "2026-10-01T10:00:00Z",
      updatedAt: "2026-10-01T10:00:00Z"
    }
  ],
  preferences: {
    targetRoles: ["Senior Software Engineer", "Backend Engineer", "Full-Stack Engineer", "Platform Engineer"],
    targetSeniority: ["Senior", "Lead", "Staff"],
    preferredIndustries: ["FinTech", "B2B SaaS", "Developer Tools", "Cloud Infrastructure"],
    excludedIndustries: ["Gambling", "Pure Outbound Sales"],
    preferredLocations: ["Nigeria", "Remote Worldwide", "EMEA"],
    remotePreference: "REMOTE_ONLY",
    eligibleCountries: ["Nigeria"],
    workAuthorizations: ["Nigeria"],
    salaryExpectation: "$70,000 - $110,000 / year",
    excludedJobTypes: ["Commission-Only", "Non-technical roles"],
    maxApplicationFee: 0,
    willingToRelocate: false,
    notes: "Requires hands-on engineering position in TypeScript/Node/Python."
  }
};

export const ALL_CANDIDATE_PRESETS: CandidatePreset[] = [
  PRESET_PRODUCT_MANAGER,
  PRESET_CLINICAL_NURSE,
  PRESET_SOFTWARE_ENGINEER
];
