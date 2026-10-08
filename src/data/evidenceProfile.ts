export interface EvidenceProduct {
  id: string;
  name: string;
  headline: string;
  role: string;
  status: string; // e.g. "testing-stage product", "live product"
  context: string;
  bullets: string[];
  bestFor: string[];
  capabilities: string[];
  keywords: string[];
  cautionNotes?: string;
}

export interface CandidateCV {
  id: 'CORE_PM' | 'TECHNICAL_PM' | 'SAAS_B2B_PM' | 'MARKETPLACE_PAYMENTS_PM';
  title: string;
  targetRoleTypes: string[];
  summary: string;
  primaryEvidence: string[];
  coreCompetencies: string[];
  evidenceRationale: string;
}

export const CANDIDATE_PROFILE = {
  name: "Product Manager (Candidate Master Profile)",
  corePositioning: "Taking ambiguous business problems and turning them into explicit systems of rules, workflows, decisions and specifications that engineering can implement.",
  workingMethod: "Understand problem -> decompose -> find viable solutions -> model workflows -> challenge scope/feasibility -> bring engineering in early -> refine against technical reality -> write PRD/spec -> build/review -> QA/refine.",
  location: "Nigeria (Open to Nigeria-based or Remote roles permitting Nigerian candidates)",
  workAuthorisation: "Nigeria (Requires roles without foreign right-to-work restrictions)",
  
  strongestCapabilities: [
    "Ambiguity handling and problem decomposition",
    "Workflow and state modelling (actors, permissions, gates, rules, exceptions, dependencies)",
    "Technical feasibility and early engineering collaboration",
    "Detailed product specifications (PRDs, edge cases, acceptance criteria)",
    "Rigorous QA and validation (edge cases, contradiction detection, state transitions)",
    "B2B SaaS, CRM and multi-tenancy architecture",
    "Automation, integrations, APIs and webhook boundaries",
    "Managed marketplaces, contractor registration and payout infrastructure",
    "Internal and admin tooling with role-based access control",
    "Human + software operational workflows",
    "Compliance-driven product behaviour"
  ],

  strictBoundaries: [
    "Never invent customer adoption, revenue, market share, or product-market fit",
    "Never claim commercial traction, $10M ARR, or quantified scale not documented in evidence",
    "Never claim unsupported years of PM experience (e.g. 8+ years executive leadership)",
    "Never claim formal certifications or professional licenses (e.g. legal HIPAA officer, FDA)",
    "Never claim software engineering degrees or production coding experience",
    "Never describe NexaLife Care as legally HIPAA certified (frame as HIPAA and privacy requirements translated into product behaviour)",
    "Never convert transferable evidence into claimed direct experience",
    "Never manufacture a fit or use buzzwords to mask a material requirement gap"
  ]
};

/**
 * Section 5: The Candidate's Actual Evidence Hierarchy (Tier 1: Direct Evidence)
 * Strictly conservative wording adhering to Section 6 (no overstatement).
 */
export const EVIDENCE_LIBRARY: EvidenceProduct[] = [
  {
    id: "marketgrowthos",
    name: "MarketGrowthOS",
    headline: "Multi-tenant CRM and Growth Operations SaaS",
    role: "Product Owner (working directly with a three-person development team)",
    status: "Testing-stage product",
    context: "Defined 0 to 1 SaaS product specifications, multi-tenant architecture, and CRM lifecycle states for sales and growth operations.",
    bullets: [
      "0 to 1 SaaS product definition, scoping, and roadmap prioritization.",
      "Three-tier multi-tenant architecture with tenant isolation and permission boundaries.",
      "CRM lifecycle modelling with 16 valid state transitions.",
      "Two-step qualification gate and policy-driven conversion logic.",
      "Mautic integration boundary and marketing automation workflows.",
      "Scope control and detailed specifications authored across 15 functional modules.",
      "1,200+ line QA checklist including webhook contradiction detection to prevent data desynchronization.",
      "Direct daily collaboration with a three-person development team throughout build and review.",
      "Testing-stage product: rigorous architectural specifications and QA verification."
    ],
    bestFor: [
      "B2B SaaS",
      "CRM systems",
      "Technical Product Management",
      "Growth workflows",
      "Marketing automation",
      "Integrations and API boundaries",
      "Multi-tenancy architecture",
      "QA and edge-case specifications",
      "Complex workflow systems"
    ],
    capabilities: [
      "0 to 1 SaaS product definition",
      "Three-tier multi-tenant architecture",
      "16-state CRM lifecycle transitions",
      "Two-step qualification gate",
      "Mautic integration boundary",
      "1,200+ line QA checklist"
    ],
    keywords: [
      "crm", "b2b", "saas", "multi-tenant", "api", "webhooks", "mautic", "lifecycle", 
      "qualification gate", "permissions", "developer", "specs", "prd", "qa"
    ]
  },
  {
    id: "nexalife",
    name: "NexaLife Care",
    headline: "Healthcare Referral-to-Care and Patient Transit Platform",
    role: "Product Manager (Operational and Compliance Workflows)",
    status: "Live product",
    context: "Designed patient journey workflows, transit tracking, and operational compliance translating privacy rules into software controls.",
    bullets: [
      "Live healthcare referral-to-care platform connecting patients, clinics, and transit providers.",
      "Ambiguous and high-constraint discovery in healthcare operational workflows.",
      "Modelled both self-managed and assisted patient journeys with conditional fallbacks.",
      "Human + software operating model coordinating dispatchers, drivers, and clinic staff.",
      "HIPAA and privacy requirements translated into product behaviour, access controls, and compliance gates.",
      "Referral, clinic matching, appointment, transportation, and verification workflows.",
      "Trip Monitor feature enabling real-time transit dispatch verification and post-consultation audit checks."
    ],
    bestFor: [
      "Complex operational workflows",
      "Healthcare referral workflows",
      "Operational and transit platforms",
      "Verification and audit gates",
      "Access controls and permissions",
      "Compliance-driven product behaviour",
      "Human + software operating models"
    ],
    cautionNotes: "Do not describe as legally HIPAA certified. Frame as: 'HIPAA and privacy requirements translated into product behaviour and access controls'.",
    capabilities: [
      "Self-managed and assisted patient journeys",
      "Human + software operating model",
      "HIPAA privacy requirements translated into product behaviour",
      "Clinical verification gates",
      "Transit tracking and dispatch workflows"
    ],
    keywords: [
      "healthcare", "healthtech", "patient", "clinical", "referral", "compliance", 
      "hipaa", "privacy", "dispatch", "verification", "audit", "human-assisted"
    ]
  },
  {
    id: "urcalls",
    name: "UrCalls",
    headline: "Video Communication and Collaboration SaaS Product",
    role: "Product Manager (Platform and Monetization)",
    status: "Live SaaS product",
    context: "Owned product iteration for live video communications, webinar features, subscription entitlement logic, and collaborative tools.",
    bullets: [
      "Live SaaS video communication product handling meetings and collaborative sessions.",
      "Webinar product and monetization workflows.",
      "Subscription plans and entitlement logic across account tiers.",
      "Individual vs organization architecture with seats, roles, administration, and branding.",
      "Referral and affiliate network mechanics.",
      "AI Notes feature for automated post-meeting structured summaries.",
      "Product iteration and live product ownership collaborating with engineering on real-time considerations."
    ],
    bestFor: [
      "SaaS platforms",
      "B2B SaaS",
      "Collaboration software",
      "Subscription plans and entitlement logic",
      "Platform administration and roles",
      "AI-assisted meeting summaries",
      "Live product iteration"
    ],
    capabilities: [
      "Subscription plans and entitlement logic",
      "Individual vs organization architecture",
      "Seats, roles, and administration",
      "Webinar product monetization",
      "AI Notes summarization",
      "Live SaaS product iteration"
    ],
    keywords: [
      "video", "collaboration", "saas", "subscriptions", "entitlements", 
      "roles", "admin", "webinar", "ai notes", "referral", "live product"
    ]
  },
  {
    id: "zenith",
    name: "Zenith Property Repairs",
    headline: "Managed Commercial Marketplace and Contractor Ecosystem",
    role: "Marketplace Product Manager",
    status: "Operational platform",
    context: "Designed managed marketplace lifecycle connecting property owners, contractors, and admin teams with milestone payout logic.",
    bullets: [
      "Managed marketplace governing two-sided contractor and property owner transactions.",
      "AI-assisted repair classification with inspection tiers, safety overrides, and severity rules.",
      "Five-stage project lifecycle: inspection -> estimate -> quote -> contract -> project.",
      "Milestone verification and payout logic.",
      "Change-order workflows and dispute reconciliation.",
      "Contractor registration and vetting workflows.",
      "Stripe Connect payout infrastructure and billing reconciliation.",
      "Support taxonomy, SLA rules, and operational escalation workflows.",
      "Comprehensive QA and validation suites for financial and operational state transitions."
    ],
    bestFor: [
      "Managed marketplaces (two-sided)",
      "Contractor registration and vetting",
      "Milestone verification and payout logic",
      "Stripe Connect payout infrastructure",
      "Change-order workflows",
      "AI-assisted classification and safety overrides",
      "Support taxonomy, SLA, and operational escalation",
      "QA and validation"
    ],
    capabilities: [
      "Managed marketplace governance",
      "Milestone verification and payout logic",
      "Stripe Connect payout infrastructure",
      "AI-assisted classification with safety overrides",
      "Contractor registration and vetting",
      "Support taxonomy and SLA escalation"
    ],
    keywords: [
      "marketplace", "payments", "payouts", "contractor", "vetting", "stripe connect", 
      "milestone", "change-order", "inspection", "sla", "escalation", "qa"
    ]
  }
];

export const CV_VARIANTS: Record<string, CandidateCV> = {
  CORE_PM: {
    id: "CORE_PM",
    title: "Core Product Manager CV",
    targetRoleTypes: [
      "Product Manager",
      "Product Owner",
      "Platform PM",
      "Complex Workflow PM",
      "General PM"
    ],
    summary: "Product Manager specialized in taking ambiguous operational problems and decomposing them into explicit systems of rules, workflows, decisions, and specifications that engineering can build with confidence. Documented experience defining 0 to 1 SaaS products, multi-tenant workflows, and operational state engines.",
    primaryEvidence: ["MarketGrowthOS", "UrCalls", "Zenith Property Repairs", "NexaLife Care"],
    coreCompetencies: [
      "Ambiguity handling and problem decomposition",
      "Workflow and state machine modelling (16-state CRM, 5-stage marketplace)",
      "Early engineering collaboration on technical feasibility",
      "Exhaustive PRDs, edge cases, and acceptance criteria",
      "1,200+ line QA checklists and system verification",
      "Human + software operational handoffs"
    ],
    evidenceRationale: "Selected when the role prioritizes end-to-end product definition, requirement decomposition, cross-functional squad ownership, and specification rigor."
  },
  TECHNICAL_PM: {
    id: "TECHNICAL_PM",
    title: "Technical Product Manager CV",
    targetRoleTypes: [
      "Technical Product Manager",
      "Technical PM",
      "APIs and Platform PM",
      "Integrations PM",
      "Engineering-heavy PM"
    ],
    summary: "Technical Product Manager with hands-on experience specifying API boundaries, webhook contradiction detection, multi-tenant database isolation, and engineering feasibility. Proven track record working directly with engineering squads to resolve technical constraints into unambiguous product requirements.",
    primaryEvidence: ["MarketGrowthOS", "UrCalls", "Zenith Property Repairs"],
    coreCompetencies: [
      "API and webhook integration boundaries (contradiction detection, state consistency)",
      "Multi-tenant isolation and three-tier permission models",
      "Stripe Connect payout infrastructure and milestone verification logic",
      "Early engineering feasibility review and technical trade-off scoping",
      "Specification of edge cases, failovers, and acceptance criteria",
      "Systematic QA verification matrices"
    ],
    evidenceRationale: "Selected when the role explicitly centers on developer APIs, webhook architectures, technical specifications, or complex system integrations."
  },
  SAAS_B2B_PM: {
    id: "SAAS_B2B_PM",
    title: "SaaS / B2B Product Manager CV",
    targetRoleTypes: [
      "B2B SaaS Product Manager",
      "SaaS PM",
      "CRM Product Manager",
      "Marketing Automation PM",
      "Business Software PM"
    ],
    summary: "B2B SaaS Product Manager experienced in 0 to 1 product definition, CRM lifecycle automation, multi-tenancy, and subscription entitlement logic. Focused on decomposing complex sales and marketing workflows into clear state machines, qualification gates, and administrative controls.",
    primaryEvidence: ["MarketGrowthOS", "UrCalls"],
    coreCompetencies: [
      "0 to 1 B2B SaaS product definition and scope control",
      "Three-tier multi-tenant architecture and tenant isolation",
      "16-state CRM lifecycle and two-step qualification gates",
      "Marketing automation and Mautic boundary integration",
      "Subscription plans and entitlement logic across organization tiers",
      "Detailed specifications and 1,200-line QA verification"
    ],
    evidenceRationale: "Selected when the role focuses on B2B SaaS, CRM lifecycle, multi-tenant software, and subscription-based customer workflows."
  },
  MARKETPLACE_PAYMENTS_PM: {
    id: "MARKETPLACE_PAYMENTS_PM",
    title: "Marketplace and Payments Product Manager CV",
    targetRoleTypes: [
      "Marketplace Product Manager",
      "Payments PM",
      "Payouts PM",
      "Two-Sided Platform PM",
      "Commercial Operations PM"
    ],
    summary: "Marketplace Product Manager experienced in two-sided commercial workflows, contractor registration and vetting, and Stripe Connect payout infrastructure. Documented experience architecting multi-stage project lifecycles, milestone verification, and change-order resolution.",
    primaryEvidence: ["Zenith Property Repairs", "MarketGrowthOS"],
    coreCompetencies: [
      "Two-sided managed marketplace governance and operational workflows",
      "Five-stage project lifecycle: inspection -> estimate -> quote -> contract -> project",
      "Milestone verification and payout logic",
      "Stripe Connect payout infrastructure and change-order workflows",
      "Contractor registration, vetting, and safety override rules",
      "Support taxonomy, SLA metrics, and operational escalation"
    ],
    evidenceRationale: "Selected when the role centers on two-sided marketplaces, vendor/contractor ecosystems, or commercial milestone payout workflows."
  }
};
