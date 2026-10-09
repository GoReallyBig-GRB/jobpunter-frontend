import { getAccessToken } from './firebase';

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  bodyText?: string;
}

const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1/users/me';

/**
 * Searches messages in candidate's Gmail inbox for job alerts and opportunities.
 */
export async function searchGmailMessages(query: string = 'subject:job OR subject:career OR from:linkedin OR from:indeed OR from:wellfound', maxResults: number = 15): Promise<GmailMessageSummary[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required. Please sign in with Google to access Gmail.');

  const listUrl = `${GMAIL_API_URL}/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
  const res = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gmail API error: ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.messages || data.messages.length === 0) {
    return [];
  }

  // Fetch details for each message in parallel
  const details = await Promise.all(
    data.messages.slice(0, 15).map(async (msg: { id: string }) => {
      try {
        return await getGmailMessageDetail(msg.id);
      } catch (e) {
        console.warn(`Failed to fetch email detail ${msg.id}:`, e);
        return null;
      }
    })
  );

  return details.filter((m): m is GmailMessageSummary => m !== null);
}

/**
 * Fetches detail of an individual Gmail message.
 */
export async function getGmailMessageDetail(messageId: string): Promise<GmailMessageSummary> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required.');

  const res = await fetch(`${GMAIL_API_URL}/messages/${messageId}?format=full`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch message ${messageId}`);
  }

  const data = await res.json();
  const headers = data.payload?.headers || [];

  const getHeader = (name: string) => {
    const found = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
    return found ? found.value : '';
  };

  const subject = getHeader('Subject') || '(No Subject)';
  const from = getHeader('From') || 'Unknown';
  const to = getHeader('To') || '';
  const date = getHeader('Date') || new Date().toISOString();

  // Extract body text
  let bodyText = '';
  if (data.payload?.body?.data) {
    bodyText = decodeBase64Url(data.payload.body.data);
  } else if (data.payload?.parts) {
    bodyText = extractTextFromParts(data.payload.parts);
  }

  return {
    id: data.id,
    threadId: data.threadId,
    subject,
    from,
    to,
    date,
    snippet: data.snippet || '',
    bodyText: bodyText || data.snippet || ''
  };
}

/**
 * Helper to decode base64url encoded Gmail data
 */
function decodeBase64Url(input: string): string {
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(escape(window.atob(base64)));
  } catch {
    return '';
  }
}

/**
 * Helper to recursively extract plain text from Gmail payload parts
 */
function extractTextFromParts(parts: any[]): string {
  let text = '';
  for (const part of parts) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      text += decodeBase64Url(part.body.data) + '\n';
    } else if (part.parts) {
      text += extractTextFromParts(part.parts);
    }
  }
  return text;
}

/**
 * Sends an email on behalf of user (e.g. outreach or application follow-up).
 * MANDATORY: Call this ONLY after explicit candidate confirmation dialog!
 */
export async function sendEmail(to: string, subject: string, bodyText: string): Promise<{ id: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required.');

  // Construct standard RFC 2822 message
  const emailLines = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${window.btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyText
  ];

  const rawMessage = emailLines.join('\r\n');
  const encodedRaw = window.btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch(`${GMAIL_API_URL}/messages/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: encodedRaw })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to send email via Gmail');
  }

  return await res.json();
}
