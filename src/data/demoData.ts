import { Job, SourceEmail, JobDecision } from '../types/job';
import { evaluateJob, detectDuplicates } from '../engine/evaluator';

export interface TestCaseDefinition {
  id: string;
  testNumber: number;
  name: string;
  scenarioDescription: string;
  expectedDecision: JobDecision;
  input: {
    title: string;
    company: string;
    location: string;
    source: string;
    jobUrl: string;
    applicationUrl?: string;
    description: string;
    postingDate?: string;
  };
}

export const TEST_SUITE_DEFINITIONS: TestCaseDefinition[] = [
  // 1. Strong Technical PM match -> APPLY
  {
    id: "test_01",
    testNumber: 1,
    name: "Strong Technical PM match",
    scenarioDescription: "Developer platform, API integration boundaries, webhooks, 3-tier multi-tenancy, Nigeria remote.",
    expectedDecision: "APPLY",
    input: {
      title: "Technical Product Manager (Developer Platform & APIs)",
      company: "AfriScale Cloud",
      location: "Remote (Nigeria / Africa)",
      source: "LinkedIn",
      jobUrl: "https://boards.greenhouse.io/afriscale/jobs/482910?utm_source=linkedin&trackingId=99281",
      applicationUrl: "https://boards.greenhouse.io/afriscale/jobs/482910",
      description: `AfriScale Cloud is hiring a Technical Product Manager to own our core developer platform, REST APIs, and webhook event architecture.
Key Responsibilities:
* Collaborate directly with backend engineering to decompose complex multi-tenant workflows into clear technical specifications, state machines, and edge-case acceptance criteria.
* Design webhook ingestion rules, contradiction prevention mechanisms, and API payload schemas.
* Model role-based tenant isolation, subscription tier limits, and API usage quotas.
* Oversee QA validation, building exhaustive verification checklists to ensure zero data desynchronization across microservices.
* Lead sprint planning, technical trade-off discussions, and API documentation.
Requirements:
* 3+ years experience as a Technical Product Manager or Technical Product Owner in B2B SaaS or platform products.
* Demonstrated ability to challenge engineering feasibility, read API documentation, and author comprehensive PRDs.
* Strong experience with multi-tenant architecture, webhooks, and complex workflow states.
* Location: 100% Remote, open to candidates residing in Nigeria.`,
      postingDate: "2026-10-02"
    }
  },

  // 2. Strong B2B SaaS PM match -> APPLY
  {
    id: "test_02",
    testNumber: 2,
    name: "Strong B2B SaaS PM match",
    scenarioDescription: "CRM lifecycle, 16 state transitions, marketing automation boundary, qualification gates, remote worldwide.",
    expectedDecision: "APPLY",
    input: {
      title: "Product Manager (CRM & Growth Automation)",
      company: "OmniReach SaaS",
      location: "Nigeria / Remote (Worldwide)",
      source: "We Work Remotely",
      jobUrl: "https://jobs.lever.co/omnireach/827103?ref=wwr_newsletter",
      applicationUrl: "https://jobs.lever.co/omnireach/827103",
      description: `OmniReach is a B2B SaaS automation platform helping enterprises manage multichannel customer lifecycles.
We are looking for a Product Manager to take full ownership of our CRM Lifecycle & Marketing Automation engine.
Key Responsibilities:
* Deconstruct sales pipeline stages into rigorous state transition models (prospecting, qualification gates, active conversion, churn prevention).
* Partner with 3 developers to implement policy-driven automation triggers and third-party marketing boundaries.
* Author end-to-end specifications with meticulous edge-case matrices, permission hierarchies, and admin audit logs.
* Drive rigorous QA verification processes with comprehensive testing scripts to validate multi-tenant data boundaries.
Requirements:
* Proven track record taking ambiguous business requirements and converting them into systematic specifications and acceptance criteria.
* Experience in B2B SaaS, CRM systems, or marketing automation workflows.
* Comfortable working in a high-autonomy, async-first squad.
* Position is fully remote with team members in Lagos, Nairobi, and London.`,
      postingDate: "2026-10-03"
    }
  },

  // 3. Strong marketplace/payments PM -> APPLY
  {
    id: "test_03",
    testNumber: 3,
    name: "Strong Marketplace & Payments PM match",
    scenarioDescription: "Managed contractor marketplace, 5-stage project lifecycle, milestone verification, Stripe Connect payout infrastructure.",
    expectedDecision: "APPLY",
    input: {
      title: "Marketplace Product Manager (Payments & Vendor Operations)",
      company: "BuildCraft Pro",
      location: "Lagos, Nigeria (Hybrid / Remote OK)",
      source: "Jobberman",
      jobUrl: "https://buildcraftpro.com/careers/pm-marketplace-409",
      applicationUrl: "https://buildcraftpro.com/careers/pm-marketplace-409",
      description: `BuildCraft Pro operates a managed commercial contractor marketplace connecting corporate clients with certified construction tradespeople.
We are seeking a Marketplace Product Manager to govern our two-sided transaction lifecycle, milestone payouts, and contractor verification ecosystem.
Responsibilities:
* Architect the complete multi-stage transaction lifecycle: Inspection -> Estimate -> Quote Approval -> Contract Execution -> Milestone Payout.
* Model milestone payout logic, change-order workflows, and Stripe Connect payout flows.
* Implement vendor vetting rules, contractor registration workflows, and safety override locks.
* Partner with engineering squad to write airtight specifications and conduct QA sign-offs for financial workflows.
* Define SLA warning thresholds, ticket escalation taxonomies, and admin operations dispatch tools.
Requirements:
* 3+ years product management experience on two-sided marketplaces, commerce, or vendor payout workflows.
* Deep understanding of milestone verification, Stripe Connect payout infrastructure, or contractor lifecycle mechanics.
* Systems thinker who prioritizes workflow rigor, fraud prevention rules, and operational clarity.
* Based in Nigeria (remote options available).`,
      postingDate: "2026-10-04"
    }
  },

  // 4. Healthcare PM with reasonable transferable evidence -> REVIEW
  {
    id: "test_04",
    testNumber: 4,
    name: "Healthcare PM with transferable evidence",
    scenarioDescription: "Healthcare patient transit and referral workflows (NexaLife), but missing hospital EHR HL7/FHIR integration credentials.",
    expectedDecision: "REVIEW",
    input: {
      title: "Healthcare Systems Product Manager",
      company: "VitalFlow Health",
      location: "Remote (Global / Africa Eligible)",
      source: "Wellfound",
      jobUrl: "https://wellfound.com/jobs/vitalflow-health-pm-2910",
      applicationUrl: "https://wellfound.com/jobs/vitalflow-health-pm-2910",
      description: `VitalFlow Health is expanding our digital clinical referral platform connecting rural outpatient clinics with specialist hospitals.
Responsibilities:
* Design patient journey workflows, doctor consultation scheduling, and referral dispatch tracking.
* Translate HIPAA compliance, data segregation rules, and clinical consent requirements into platform access controls.
* Desired: Direct integration experience with hospital Electronic Health Record (EHR) systems via HL7 / FHIR protocol standards.
* Remote worldwide, candidates in Africa welcomed.`,
      postingDate: "2026-10-01"
    }
  },

  // 5. Director role with excessive management requirement -> REJECT
  {
    id: "test_05",
    testNumber: 5,
    name: "Director of Product managing 15 PMs",
    scenarioDescription: "Materially excessive executive organizational hierarchy (managing 15 PMs, $80M P&L, 12+ years required).",
    expectedDecision: "REJECT",
    input: {
      title: "Vice President & Director of Product Management",
      company: "Global Enterprise Core",
      location: "Remote (Worldwide)",
      source: "LinkedIn",
      jobUrl: "https://enterprise-core.com/jobs/vp-product-dir-881",
      applicationUrl: "https://enterprise-core.com/jobs/vp-product-dir-881",
      description: `Global Enterprise Core seeks an executive Vice President of Product to manage a team of 18 Product Managers and 4 Product Directors across 6 international business units.
Requirements:
* 12+ years of senior executive Product leadership experience in Fortune 500 organizations.
* Minimum 6 years experience supervising multiple layers of Director-level managers.
* Responsible for $80M P&L budget allocation, institutional board governance, and global M&A integrations.`,
      postingDate: "2026-09-28"
    }
  },

  // 6. Sales role -> REJECT
  {
    id: "test_06",
    testNumber: 6,
    name: "Sales Product Specialist (Quota / SDR disguised as PM)",
    scenarioDescription: "Non-PM role: outbound cold-calling, quota-carrying sales, 80% commission.",
    expectedDecision: "REJECT",
    input: {
      title: "Sales Product Specialist / Business Development Lead",
      company: "FastSaaS Enterprise",
      location: "Lagos, Nigeria",
      source: "Indeed",
      jobUrl: "https://indeed.com/viewjob?jk=fastsaas_sales_pm",
      applicationUrl: "https://indeed.com/viewjob?jk=fastsaas_sales_pm",
      description: `FastSaaS is looking for a dynamic Sales Product Specialist.
This is a high-velocity, quota-carrying sales and outbound business development position.
Responsibilities:
* Cold call 40+ prospective enterprise accounts daily to book software demonstrations.
* Close contracts with a monthly new-revenue quota of $25,000.
* 80% of compensation is tied directly to uncapped sales commission.
* Note: This is an outbound sales/BD position, not a product specification or engineering squad leadership role.`,
      postingDate: "2026-10-02"
    }
  },

  // 7. Lending PM requiring underwriting experience -> REJECT
  {
    id: "test_07",
    testNumber: 7,
    name: "Lending PM requiring underwriting experience",
    scenarioDescription: "Unsupported specialist domain: algorithmic credit risk modeling, loan delinquency collection, balance-sheet underwriting.",
    expectedDecision: "REJECT",
    input: {
      title: "FinTech Product Manager (Micro-Lending & Credit Risk Underwriting)",
      company: "CrediCore Microfinance",
      location: "Lagos, Nigeria / Remote",
      source: "Jobberman",
      jobUrl: "https://jobberman.com/listings/credicore-lending-pm-774",
      applicationUrl: "https://jobberman.com/listings/credicore-lending-pm-774",
      description: `CrediCore is hiring a Product Manager specifically for our algorithmic consumer loan origination and credit underwriting engine.
Requirements:
* Deep documented subject matter expertise in credit risk modeling, loan default delinquency collections, and balance-sheet capital markets.
* Must have 4+ years designing algorithmic credit scoring formulas, debt-to-income verification rules, and automated debt recovery systems.
* Candidates without deep banking loan underwriting domain experience will not be considered.`,
      postingDate: "2026-10-03"
    }
  },

  // 8. Role with insufficient JD -> REVIEW
  {
    id: "test_08",
    testNumber: 8,
    name: "Role with insufficient JD (Parser Low/Medium)",
    scenarioDescription: "Vague one-liner description without responsibilities or requirements.",
    expectedDecision: "REVIEW",
    input: {
      title: "Product Manager",
      company: "Stealth Ventures",
      location: "Remote",
      source: "LinkedIn",
      jobUrl: "https://linkedin.com/jobs/view/stealth-pm-0099",
      description: `We are looking for a product manager to join our fast-growing remote team. Apply with your CV today.`,
      postingDate: "2026-10-04"
    }
  },

  // 9. Paid application -> REJECT
  {
    id: "test_09",
    testNumber: 9,
    name: "Paid application route ($0 Policy Violation)",
    scenarioDescription: "Requires mandatory $39 monthly subscription to submit application.",
    expectedDecision: "REJECT",
    input: {
      title: "Remote B2B SaaS Product Manager",
      company: "Aggregated Tech Jobs Club",
      location: "Remote Worldwide",
      source: "Direct Alert",
      jobUrl: "https://paid-remote-jobs-club.io/apply/pm-saas-101",
      applicationUrl: "https://paid-remote-jobs-club.io/apply/pm-saas-101",
      description: `Exclusive B2B SaaS Product Manager opening.
APPLICATION REQUIREMENT: To submit your application and unlock direct recruiter contact, candidates must purchase a mandatory $39 monthly Premium Job Seeker subscription. Applications without paid subscription verification will be discarded immediately.`,
      postingDate: "2026-10-04"
    }
  },

  // 10. Worldwide remote PM -> APPLY if evidence supports
  {
    id: "test_10",
    testNumber: 10,
    name: "Worldwide remote PM with strong SaaS evidence",
    scenarioDescription: "Explicitly open worldwide, B2B SaaS subscription entitlements, collaboration tools.",
    expectedDecision: "APPLY",
    input: {
      title: "Platform Product Manager (Subscriptions & Entitlements)",
      company: "CollabSync Global",
      location: "Remote (Worldwide / Work from anywhere)",
      source: "We Work Remotely",
      jobUrl: "https://jobs.lever.co/collabsync/entitlements-pm",
      applicationUrl: "https://jobs.lever.co/collabsync/entitlements-pm",
      description: `CollabSync is looking for a Platform Product Manager. 100% Worldwide Remote. Open to candidates in all timezones and countries including Nigeria.
Responsibilities:
* Lead product iteration for our collaboration platform, subscription plans, and entitlement logic across organization accounts.
* Model individual vs organization architecture, seats, administrative roles, and branding controls.
* Collaborate directly with developers on edge cases, technical trade-offs, and acceptance criteria.
Requirements:
* 3+ years product management experience in SaaS or platform products.
* Strong systems modeling background and detailed PRD writing.`,
      postingDate: "2026-10-03"
    }
  },

  // 11. "Remote" with no geographic eligibility -> REVIEW
  {
    id: "test_11",
    testNumber: 11,
    name: "Remote with unconfirmed geographic eligibility",
    scenarioDescription: "Listed simply as 'Remote' without stating international or Africa/Nigeria eligibility.",
    expectedDecision: "REVIEW",
    input: {
      title: "Product Manager (Workflow Automation)",
      company: "Apex Systems Cloud",
      location: "Remote",
      source: "Indeed",
      jobUrl: "https://boards.greenhouse.io/apexcloud/jobs/38192",
      applicationUrl: "https://boards.greenhouse.io/apexcloud/jobs/38192",
      description: `Apex Systems is hiring a Product Manager for our workflow automation engine.
We are looking for someone to define workflow state machines and collaborate with developers on technical specifications.
Note: Position is listed as Remote. Specific geographic or timezone eligibility is not specified.`,
      postingDate: "2026-10-02"
    }
  },

  // 12. US-only authorization -> REJECT
  {
    id: "test_12",
    testNumber: 12,
    name: "US-only work authorization requirement",
    scenarioDescription: "Mandatory US Citizen / Green Card with US work authorization required.",
    expectedDecision: "REJECT",
    input: {
      title: "Technical Product Manager",
      company: "GovTech Defense Cloud",
      location: "Remote (United States Only)",
      source: "LinkedIn",
      jobUrl: "https://govtech-defense.com/careers/tpm-44",
      applicationUrl: "https://govtech-defense.com/careers/tpm-44",
      description: `GovTech Defense is hiring a Technical Product Manager.
MANDATORY REQUIREMENT: Must be a US Citizen or permanent Green Card holder located in the United States with active US work authorization. International candidates will be disqualified automatically due to regulatory compliance.`,
      postingDate: "2026-10-03"
    }
  },

  // 13. Stale / closed role -> REJECT or WATCH
  {
    id: "test_13",
    testNumber: 13,
    name: "Stale job posting (45 days old)",
    scenarioDescription: "Job posting is 45 days old (>30 days). Placed on WATCHLIST / REJECT to avoid applying to closed pipeline.",
    expectedDecision: "WATCH",
    input: {
      title: "B2B SaaS Product Manager",
      company: "OldPost Software",
      location: "Remote (Nigeria OK)",
      source: "LinkedIn",
      jobUrl: "https://oldpost.com/careers/pm-stale-01",
      applicationUrl: "https://oldpost.com/careers/pm-stale-01",
      description: `OldPost is seeking a B2B SaaS Product Manager. Responsibilities include defining PRDs, squad collaboration, and workflow state machines.`,
      postingDate: "2026-08-15"
    }
  },

  // 14. Strong keyword match but unsupported mandatory domain -> REJECT
  {
    id: "test_14",
    testNumber: 14,
    name: "Keywords match 'platform/payouts' but requires $10M ARR scale & banking license",
    scenarioDescription: "JD has 'SaaS' and 'payouts' keywords, but demands mandatory 5+ years managing $10M ARR enterprise products and capital adequacy compliance.",
    expectedDecision: "REJECT",
    input: {
      title: "Senior Product Manager (Enterprise Scale & Capital Markets)",
      company: "MegaBank Capital",
      location: "Remote (Worldwide)",
      source: "Indeed",
      jobUrl: "https://megabank.com/careers/pm-capital-markets",
      applicationUrl: "https://megabank.com/careers/pm-capital-markets",
      description: `MegaBank Capital requires an enterprise Product Manager.
Mandatory Requirements:
* Must have documented track record managing enterprise SaaS products with $10M+ ARR.
* 5+ years managing institutional capital markets, liquidity risk, and banking regulatory capital adequacy.
* Experience running global M&A integrations and balance-sheet risk models.`,
      postingDate: "2026-10-01"
    }
  },

  // 15. Weak keyword match but genuinely transferable workflow role -> REVIEW
  {
    id: "test_15",
    testNumber: 15,
    name: "Genuinely transferable operational logistics role",
    scenarioDescription: "Uses logistics terms ('fleet dispatch', 'transit verification') matching NexaLife Care operational workflows. Held for REVIEW, not rejected.",
    expectedDecision: "REVIEW",
    input: {
      title: "Product Manager (Operational Dispatch & Transit Tracking)",
      company: "LogiRoute Fleet",
      location: "Lagos, Nigeria / Remote",
      source: "Jobberman",
      jobUrl: "https://logiroute.com/jobs/dispatch-pm-90",
      applicationUrl: "https://logiroute.com/jobs/dispatch-pm-90",
      description: `LogiRoute Fleet is building an operational dispatch system coordinating vehicle routing, transit tracking, and real-time checkpoint verification.
Responsibilities:
* Model operational dispatcher journeys, transit verification gates, and driver communication workflows.
* Handle ambiguous logistics constraints and build human + software exception handling protocols.
* Collaborate with backend developers on system state machines and acceptance criteria.`,
      postingDate: "2026-10-02"
    }
  },

  // 16. Multi-source duplicate opportunity (Indeed + LinkedIn + ATS) -> Deduplicated
  {
    id: "test_16",
    testNumber: 16,
    name: "Cross-platform duplicate listing",
    scenarioDescription: "Same job posting on LinkedIn as BuildCraft Pro (Jobberman), preserving all source references.",
    expectedDecision: "APPLY",
    input: {
      title: "Marketplace Product Manager (Payments & Vendor Operations)",
      company: "BuildCraft Pro",
      location: "Lagos, Nigeria (Hybrid / Remote OK)",
      source: "LinkedIn",
      jobUrl: "https://buildcraftpro.com/careers/pm-marketplace-409?utm_source=linkedin",
      applicationUrl: "https://buildcraftpro.com/careers/pm-marketplace-409",
      description: `BuildCraft Pro contractor marketplace operations. Architect multi-stage transaction lifecycle, milestone payouts via Stripe Connect, and contractor registration.`,
      postingDate: "2026-10-04"
    }
  },

  // 17. Senior PM with realistic hands-on responsibilities -> APPLY
  {
    id: "test_17",
    testNumber: 17,
    name: "Senior PM with realistic hands-on squad responsibilities",
    scenarioDescription: "Title has 'Senior', but actual responsibilities are 3-5 years squad leadership, PRDs, and QA verification in Nigeria.",
    expectedDecision: "APPLY",
    input: {
      title: "Senior Product Manager (Core SaaS Platform)",
      company: "KoraTech Solutions",
      location: "Lagos, Nigeria (Remote)",
      source: "LinkedIn",
      jobUrl: "https://boards.greenhouse.io/koratech/jobs/910283",
      applicationUrl: "https://boards.greenhouse.io/koratech/jobs/910283",
      description: `KoraTech Solutions is hiring a Senior Product Manager for our core B2B SaaS platform.
Requirements & Responsibilities:
* 3-5 years product management experience leading a cross-functional squad of 3 developers.
* Responsible for 0 to 1 product definition, multi-tenant architecture, and writing detailed PRDs.
* Hands-on ownership of acceptance criteria, edge-case matrices, and QA verification.
* Must be based in Nigeria or available for Lagos timezone remote collaboration.`,
      postingDate: "2026-10-04"
    }
  },

  // 18. Executive PM role with manageable scope -> REVIEW
  {
    id: "test_18",
    testNumber: 18,
    name: "Head of Product with player-coach / squad scope",
    scenarioDescription: "Title is 'Head of Product', but company is early-stage startup looking for a player-coach to build PRDs with a 4-person engineering team. REVIEW rather than automatic reject.",
    expectedDecision: "REVIEW",
    input: {
      title: "Head of Product (Hands-on Player-Coach)",
      company: "SeedStage Labs",
      location: "Remote (Sub-Saharan Africa / Worldwide)",
      source: "Wellfound",
      jobUrl: "https://wellfound.com/jobs/seedstage-head-of-product",
      applicationUrl: "https://wellfound.com/jobs/seedstage-head-of-product",
      description: `SeedStage Labs is looking for a Head of Product to be the sole product owner working directly with our 4-person engineering team.
This is a hands-on player-coach role (not people management of other PMs). You will take ambiguous customer problems, define 0 to 1 specifications, model workflows, and run QA verification.`,
      postingDate: "2026-10-03"
    }
  }
];

export const INITIAL_SOURCE_EMAILS: SourceEmail[] = [
  {
    id: "email_digest_001",
    source: "Indeed",
    sender: "alert@indeed.com",
    subject: "Product Manager at Paga. 17 more product manager remote jobs in Lagos",
    receivedDate: "2026-10-04T08:15:00Z",
    rawContent: `Indeed Job Alert: Product Manager at Paga. 17 more product manager remote jobs in Lagos

---
Role: Product Manager (Merchant Growth & Core Platform)
Company: Paga
Location: Lagos, Nigeria (Hybrid / Remote Friendly)
URL: https://indeed.com/viewjob?jk=paga_pm_001
Description: Paga is seeking a Product Manager to lead our Core Merchant B2B SaaS platform. Responsibilities include designing merchant onboarding workflows, API integrations with regional payment gateways, multi-tenant permission controls, and working closely with engineering on sprint specifications and acceptance criteria. Requirements: 3-5 years product management in B2B SaaS, experience collaborating directly with engineering on API boundaries, state machines, and QA verification. Remote candidates in Nigeria welcome.

---
Role: Senior Growth Product Manager
Company: Kuda Bank
Location: Lagos, Nigeria / Remote
URL: https://indeed.com/viewjob?jk=kuda_pm_002
Description: Lead consumer acquisition and retention funnels. Optimize conversion state flows, analytics tracking, and automated onboarding email sequences.

---
[16 additional unparsed listings summarized in digest: Paystack, Moniepoint, Flutterwave, Helium Health, Bamboo, Piggyvest, Reliance Health, Chowdeck, FairMoney, TeamApt, Eden Life, SeamlessHR, Cowrywise, Remedial Health, MaxNG, Gokada]`,
    processedStatus: "PARSING_REQUIRED",
    extractedJobCount: 2,
    notes: "Alert contains 18 separate Product Manager listings. Paga listing extracted for evaluation; remaining 16 batch listings require delimited parsing review."
  },
  {
    id: "email_linkedin_002",
    source: "LinkedIn",
    sender: "jobalerts-noreply@linkedin.com",
    subject: "LinkedIn Alert: 3 new Technical Product Manager remote roles",
    receivedDate: "2026-10-04T10:30:00Z",
    rawContent: `LinkedIn Job Alert: 3 new Technical Product Manager roles matching your alert.

### Technical Product Manager (Developer Platform & APIs)
Company: AfriScale Cloud
Location: Remote (Nigeria / Africa)
URL: https://boards.greenhouse.io/afriscale/jobs/482910
Description: We are looking for a Technical Product Manager to oversee our developer platform and webhook ingestion pipelines. You will own API specifications, webhook contradiction detection, event schemas, and 3-tier multi-tenant account isolation. Work directly with our backend engineering team to translate complex business workflows into formal state diagrams, PRDs, and QA acceptance suites. 100% remote across Nigeria and Africa.`,
    processedStatus: "PROCESSED",
    extractedJobCount: 1,
    notes: "Extracted 1 high-confidence technical platform role."
  }
];

// Helper to pre-generate demo jobs using the deterministic engine and deduplicate
export function getSeedJobs(): Job[] {
  const evaluatedJobs: Job[] = [];

  for (const def of TEST_SUITE_DEFINITIONS) {
    const job = evaluateJob(def.input);
    job.id = `job_${def.id}`;

    // Test Case 16 duplicate cross-linking with Test Case 3
    if (def.testNumber === 16) {
      const matchJob3 = evaluatedJobs.find(j => j.company === "BuildCraft Pro");
      if (matchJob3) {
        job.isDuplicate = true;
        job.duplicateOfId = matchJob3.id;
        job.duplicateGroup = `group_${matchJob3.id}`;
        matchJob3.duplicateGroup = `group_${matchJob3.id}`;
        matchJob3.allSources = ['Jobberman', 'LinkedIn', 'Greenhouse'];
      }
    }

    evaluatedJobs.push(job);
  }

  return evaluatedJobs;
}
