import { SourceEmail, Job, ParserConfidence } from '../types/job';
import { evaluateJob, detectDuplicates, RawJobInput } from './evaluator';

export interface EmailParseResult {
  sourceEmail: SourceEmail;
  detectedSource: string;
  isJobAlert: boolean;
  isMultiJobAlert: boolean;
  extractedJobs: RawJobInput[];
  parsingStatus: 'PROCESSED' | 'PARSING_REQUIRED' | 'FAILED';
  notes: string;
}

/**
 * Detect alert source from email subject or content
 */
export function detectEmailSource(subject: string, content: string, sender: string): string {
  const combined = `${subject} ${content} ${sender}`.toLowerCase();
  if (combined.includes('indeed')) return 'Indeed';
  if (combined.includes('linkedin')) return 'LinkedIn';
  if (combined.includes('jobberman')) return 'Jobberman';
  if (combined.includes('weworkremotely') || combined.includes('we work remotely')) return 'We Work Remotely';
  if (combined.includes('wellfound') || combined.includes('angel.co')) return 'Wellfound';
  if (combined.includes('greenhouse')) return 'Greenhouse';
  if (combined.includes('lever')) return 'Lever';
  return 'Direct Alert';
}

/**
 * Check if the text looks like a job alert email
 */
export function isJobAlertEmail(subject: string, content: string): boolean {
  const combined = `${subject} ${content}`.toLowerCase();
  const alertKeywords = [
    'job alert', 'jobs alert', 'new jobs for you', 'recommended jobs', 
    'jobs matching', 'openings', 'hiring now', 'remote jobs', 'product manager',
    'view job', 'apply now', 'new job posting', 'opportunities for you'
  ];
  return alertKeywords.some(kw => combined.includes(kw));
}

/**
 * Parse an incoming email (supports single job alerts and multi-job digests)
 */
export function parseJobAlertEmail(
  rawSubject: string = '',
  rawContent: string = '',
  rawSender: string = 'alerts@jobplatform.com'
): EmailParseResult {
  const safeSubject = rawSubject || '';
  const safeContent = rawContent || '';
  const emailId = `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const source = detectEmailSource(safeSubject, safeContent, rawSender);
  const isAlert = isJobAlertEmail(safeSubject, safeContent);

  // Check for multi-job markers (e.g., "18 new jobs", "17 more jobs", bullet lists of jobs)
  const multiJobMatch = safeSubject.match(/(\d+)\s+(?:new\s+)?(?:jobs|openings|roles|product manager)/i) ||
                        safeContent.match(/(\d+)\s+more\s+(?:product manager|remote|jobs)/i);
  
  const hasMultipleHeadings = (safeContent.match(/###|Role:|Position:|Job \d+:/gi) || []).length > 1;
  const isMultiJobAlert = Boolean(multiJobMatch || hasMultipleHeadings || safeContent.split(/\n\s*---+\s*\n/).length > 2);

  // If clearly a multi-job digest, attempt structured splitting
  if (isMultiJobAlert) {
    const extractedJobs: RawJobInput[] = [];

    // Strategy 1: Delimiter split by '---' or markdown '###' or numbered jobs
    let chunks: string[] = [];
    if (safeContent.includes('---')) {
      chunks = safeContent.split(/\n\s*---+\s*\n/).filter(c => c.trim().length > 30);
    } else if (safeContent.includes('###')) {
      chunks = safeContent.split(/###/).filter(c => c.trim().length > 30);
    } else {
      // Split by double line breaks if each has job-like pattern
      chunks = safeContent.split(/\n\s*\n\s*\n/).filter(c => c.trim().length > 30);
    }

    for (const chunk of chunks) {
      const parsed = extractSingleJobFromText(chunk, source);
      if (parsed.title && (parsed.company || parsed.jobUrl || parsed.description)) {
        parsed.sourceEmailId = emailId;
        extractedJobs.push(parsed);
      }
    }

    // If we couldn't parse at least 2 distinct valid jobs despite being a multi-job email
    if (extractedJobs.length === 0 || (multiJobMatch && extractedJobs.length === 1)) {
      return {
        sourceEmail: {
          id: emailId,
          source,
          sender: rawSender,
          subject: rawSubject,
          receivedDate: new Date().toISOString(),
          rawContent,
          processedStatus: 'PARSING_REQUIRED',
          extractedJobCount: 0,
          notes: `Detected multi-job digest (e.g. '${rawSubject}'). Cannot reliably separate individual listings without risking inaccurate scoring. Human parsing review required.`
        },
        detectedSource: source,
        isJobAlert: true,
        isMultiJobAlert: true,
        extractedJobs: [],
        parsingStatus: 'PARSING_REQUIRED',
        notes: "Digest contains multiple bundled opportunities that require manual inspection or delimited breakdown."
      };
    }

    return {
      sourceEmail: {
        id: emailId,
        source,
        sender: rawSender,
        subject: rawSubject,
        receivedDate: new Date().toISOString(),
        rawContent,
        processedStatus: 'PROCESSED',
        extractedJobCount: extractedJobs.length,
        notes: `Successfully separated ${extractedJobs.length} individual job listings from multi-job digest.`
      },
      detectedSource: source,
      isJobAlert: true,
      isMultiJobAlert: true,
      extractedJobs,
      parsingStatus: 'PROCESSED',
      notes: `Extracted ${extractedJobs.length} distinct jobs from alert.`
    };
  }

  // Single job alert parsing
  const singleJob = extractSingleJobFromText(safeContent, source, safeSubject);
  singleJob.sourceEmailId = emailId;

  const status = (singleJob.title && singleJob.company) ? 'PROCESSED' : 'PARSING_REQUIRED';

  return {
    sourceEmail: {
      id: emailId,
      source,
      sender: rawSender,
      subject: safeSubject,
      receivedDate: new Date().toISOString(),
      rawContent: safeContent,
      processedStatus: status,
      extractedJobCount: 1,
      notes: status === 'PROCESSED' ? 'Single job opportunity extracted.' : 'Missing essential fields (Title or Company). Marked PARSING REQUIRED.'
    },
    detectedSource: source,
    isJobAlert: isAlert,
    isMultiJobAlert: false,
    extractedJobs: [singleJob],
    parsingStatus: status,
    notes: status === 'PROCESSED' ? 'Clean single job extracted.' : 'Low structure in single email body.'
  };
}

/**
 * Extract structured attributes from a text chunk
 */
export function extractSingleJobFromText(
  text: string = '', 
  defaultSource: string = 'Direct',
  fallbackSubject?: string
): RawJobInput {
  const safeText = text || '';
  const lines = safeText.split('\n').map(l => l.trim()).filter(Boolean);

  let title = "";
  let company = "";
  let location = "Remote";
  let jobUrl = "";
  let description = "";

  // Try regex patterns for standard field keys
  for (const line of lines) {
    const lower = line.toLowerCase();
    
    // Title patterns
    if (!title) {
      const titleMatch = line.match(/(?:title|role|position):\s*(.+)/i);
      if (titleMatch) {
        title = titleMatch[1].trim();
        continue;
      }
    }

    // Company patterns
    if (!company) {
      const compMatch = line.match(/(?:company|employer|organisation|organization):\s*(.+)/i);
      if (compMatch) {
        company = compMatch[1].trim();
        continue;
      }
    }

    // Location patterns
    if (location === "Remote") {
      const locMatch = line.match(/(?:location|geography|workplace):\s*(.+)/i);
      if (locMatch) {
        location = locMatch[1].trim();
        continue;
      }
    }

    // URL patterns
    if (!jobUrl) {
      const urlMatch = line.match(/https?:\/\/[^\s\)]+/i);
      if (urlMatch) {
        jobUrl = urlMatch[0].trim();
        continue;
      }
    }
  }

  // Fallbacks if field labels weren't present
  if (!title && lines.length > 0) {
    // If first line has "Product Manager" or similar
    if (/product|manager|lead|owner/i.test(lines[0])) {
      title = lines[0].replace(/^#+\s*/, '').trim();
    } else if (fallbackSubject && /product|manager|lead|owner/i.test(fallbackSubject)) {
      // E.g. "Product Manager at Paga"
      const subMatch = fallbackSubject.match(/(.+?)\s+(?:at|@)\s+(.+)/i);
      if (subMatch) {
        title = subMatch[1].trim();
        company = subMatch[2].trim();
      } else {
        title = fallbackSubject.replace(/job alert:?/i, '').trim();
      }
    }
  }

  if (!company && lines.length > 1) {
    if (!/https?:|\/|requirements/i.test(lines[1]) && lines[1].length < 60) {
      company = lines[1].replace(/^(?:at|@)\s*/i, '').trim();
    }
  }

  // Description is the full text or paragraphs
  description = text.trim();

  return {
    title,
    company,
    location,
    source: defaultSource,
    jobUrl,
    description
  };
}
