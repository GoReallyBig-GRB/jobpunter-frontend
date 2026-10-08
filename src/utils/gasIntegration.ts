import { Job, SourceEmail } from '../types/job';

/**
 * Generates copy-paste ready Google Apps Script (.gs) code
 * that runs inside Google Apps Script (script.google.com) to automate Gmail alert harvesting.
 */
export function generateGoogleAppsScriptCode(webhookUrl?: string): string {
  const targetUrl = webhookUrl || "https://your-deployed-applet-url.run.app/api/ingest";

  return `/**
 * ====================================================================
 * Zero-Cost Job Hunter — Google Apps Script Gmail Pipeline Bridge
 * ====================================================================
 * Instructions:
 * 1. Open Google Sheets -> Extensions -> Apps Script (script.google.com)
 * 2. Paste this complete script into Code.gs
 * 3. Run 'setupTrigger()' once to harvest alerts automatically every 4 hours.
 * 4. Or run 'harvestJobAlertsManual()' to run immediately.
 * 5. Cost: $0 (Runs entirely within free Google Workspace / Gmail limits).
 * ====================================================================
 */

const CONFIG = {
  // Gmail search query targeting legitimate product management alerts
  GMAIL_QUERY: 'label:inbox (from:indeed.com OR from:linkedin.com OR from:jobberman.com OR from:weworkremotely.com OR from:wellfound.com) ("product manager" OR "product owner" OR "technical product manager") newer_than:2d',
  PROCESSED_LABEL: 'JobHunter/Processed',
  MAX_EMAILS_PER_RUN: 15,
  // Optional Webhook endpoint to push directly to Zero-Cost Job Hunter
  WEBHOOK_URL: '${targetUrl}'
};

/**
 * Main harvesting function
 */
function harvestJobAlerts() {
  const label = getOrCreateLabel(CONFIG.PROCESSED_LABEL);
  const threads = GmailApp.search(CONFIG.GMAIL_QUERY, 0, CONFIG.MAX_EMAILS_PER_RUN);
  
  if (threads.length === 0) {
    Logger.log("No new job alert emails found matching query.");
    return;
  }

  const harvestedPayloads = [];

  for (let i = 0; i < threads.length; i++) {
    const thread = threads[i];
    const messages = thread.getMessages();
    const lastMsg = messages[messages.length - 1];

    const payload = {
      sender: lastMsg.getFrom(),
      subject: lastMsg.getSubject(),
      receivedDate: lastMsg.getDate().toISOString(),
      rawContent: lastMsg.getPlainBody() || lastMsg.getBody()
    };

    harvestedPayloads.push(payload);

    // Mark as processed so we don't duplicate next run
    thread.addLabel(label);
  }

  Logger.log("Harvested " + harvestedPayloads.length + " job alert emails.");

  // Save to Active Google Sheet for offline zero-cost storage
  saveToGoogleSheet(harvestedPayloads);

  // Optional: Post to Webhook if configured
  if (CONFIG.WEBHOOK_URL && !CONFIG.WEBHOOK_URL.includes("your-deployed-applet")) {
    try {
      const options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({ emails: harvestedPayloads }),
        muteHttpExceptions: true
      };
      const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
      Logger.log("Webhook response code: " + response.getResponseCode());
    } catch (err) {
      Logger.log("Webhook dispatch error: " + err.message);
    }
  }
}

/**
 * Saves harvested emails into the active Google Sheet in the required schema
 */
function saveToGoogleSheet(emails) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Discovered_Alerts");
  if (!sheet) {
    sheet = ss.insertSheet("Discovered_Alerts");
    sheet.appendRow(["Timestamp", "Sender", "Subject", "Body Length", "Raw Content"]);
    sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#f3f4f6");
  }

  emails.forEach(function(email) {
    sheet.appendRow([
      email.receivedDate,
      email.sender,
      email.subject,
      email.rawContent.length,
      email.rawContent.substring(0, 5000)
    ]);
  });
}

function getOrCreateLabel(name) {
  let label = GmailApp.getUserLabelByName(name);
  if (!label) {
    label = GmailApp.createLabel(name);
  }
  return label;
}

/**
 * Set up automated trigger every 4 hours ($0 cost)
 */
function setupTrigger() {
  ScriptApp.newTrigger('harvestJobAlerts')
    .timeBased()
    .everyHours(4)
    .create();
  Logger.log("Trigger created successfully: Running every 4 hours.");
}
`;
}

/**
 * Export jobs to clean CSV format
 */
export function exportJobsToCSV(jobs: Job[]): string {
  const headers = [
    "ID",
    "Company",
    "Title",
    "Score",
    "Decision",
    "Status",
    "Target CV",
    "Location",
    "Remote Status",
    "Source",
    "All Sources",
    "Job URL",
    "Application Route",
    "Parser Confidence",
    "Posting Date",
    "Hard Rejections",
    "Review Reasons",
    "Created Date"
  ];

  const rows = jobs.map(j => [
    j.id,
    `"${(j.company || '').replace(/"/g, '""')}"`,
    `"${(j.title || '').replace(/"/g, '""')}"`,
    j.score.total,
    j.decision,
    j.status,
    j.targetCV,
    `"${(j.location || '').replace(/"/g, '""')}"`,
    j.remoteEligibility,
    `"${(j.source || '').replace(/"/g, '""')}"`,
    `"${(j.allSources?.join('; ') || j.source).replace(/"/g, '""')}"`,
    `"${(j.jobUrl || '').replace(/"/g, '""')}"`,
    j.applicationRoute,
    j.parserConfidence,
    j.postingDate,
    `"${(j.hardRejectionReasons.join(' | ')).replace(/"/g, '""')}"`,
    `"${(j.reviewReasons.join(' | ')).replace(/"/g, '""')}"`,
    j.createdAt
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Export full state to JSON format
 */
export function exportStateToJSON(jobs: Job[], emails: SourceEmail[]): string {
  return JSON.stringify({
    version: "1.0",
    exportedAt: new Date().toISOString(),
    jobsCount: jobs.length,
    emailsCount: emails.length,
    jobs,
    emails
  }, null, 2);
}

/**
 * Parse uploaded CSV into raw job records
 */
export function parseCSVToJobs(csvText: string): Array<{
  title: string;
  company: string;
  location?: string;
  source?: string;
  jobUrl?: string;
  description?: string;
}> {
  const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  // Parse header line
  const headerLine = lines[0];
  const headers = splitCSVLine(headerLine).map(h => h.toLowerCase().trim().replace(/['"]/g, ''));

  const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('role') || h.includes('position'));
  const companyIdx = headers.findIndex(h => h.includes('company') || h.includes('employer') || h.includes('org'));
  const locationIdx = headers.findIndex(h => h.includes('location') || h.includes('remote') || h.includes('city'));
  const sourceIdx = headers.findIndex(h => h.includes('source') || h.includes('platform'));
  const urlIdx = headers.findIndex(h => h.includes('url') || h.includes('link'));
  const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('detail') || h.includes('responsibilit'));

  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const row = splitCSVLine(lines[i]);
    const title = titleIdx !== -1 ? row[titleIdx]?.trim() : row[0]?.trim();
    const company = companyIdx !== -1 ? row[companyIdx]?.trim() : row[1]?.trim();

    if (title || company) {
      results.push({
        title: title || "Product Manager",
        company: company || "Undisclosed Company",
        location: locationIdx !== -1 ? row[locationIdx]?.trim() : "Remote",
        source: sourceIdx !== -1 ? row[sourceIdx]?.trim() : "CSV Import",
        jobUrl: urlIdx !== -1 ? row[urlIdx]?.trim() : "",
        description: descIdx !== -1 ? row[descIdx]?.trim() : ""
      });
    }
  }

  return results;
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
