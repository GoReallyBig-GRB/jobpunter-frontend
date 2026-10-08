import { getAccessToken } from './firebase';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  htmlLink?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
}

const CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

/**
 * Lists upcoming calendar events from the primary calendar.
 */
export async function listCalendarEvents(maxResults: number = 20): Promise<CalendarEvent[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required. Please sign in with Google to access Google Calendar.');

  const now = new Date().toISOString();
  const url = `${CALENDAR_API_URL}?timeMin=${encodeURIComponent(now)}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Google Calendar error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.items || [];
}

/**
 * Creates a new interview or deadline event in Google Calendar.
 * (MANDATORY: Requires explicit user confirmation dialog before calling)
 */
export async function createCalendarEvent(
  title: string,
  startTime: string,
  endTime: string,
  description?: string,
  location?: string
): Promise<CalendarEvent> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required.');

  const eventPayload = {
    summary: title,
    description: description || 'Scheduled via JobPunter',
    location: location || '',
    start: {
      dateTime: startTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: endTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 },
        { method: 'popup', minutes: 10 }
      ]
    }
  };

  const res = await fetch(CALENDAR_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventPayload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to create calendar event');
  }

  return await res.json();
}

/**
 * Deletes an event from Google Calendar.
 * (MANDATORY: Requires explicit user confirmation dialog before calling)
 */
export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required.');

  const res = await fetch(`${CALENDAR_API_URL}/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to delete calendar event');
  }

  return true;
}
