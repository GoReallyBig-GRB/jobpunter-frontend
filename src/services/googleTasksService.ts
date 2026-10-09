import { getAccessToken } from './firebase';

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  completed?: string;
  updated?: string;
}

export interface GoogleTaskList {
  id: string;
  title: string;
  updated?: string;
}

const TASKS_API_URL = 'https://tasks.googleapis.com/tasks/v1';

/**
 * Lists user task lists.
 */
export async function listTaskLists(): Promise<GoogleTaskList[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required. Please sign in with Google to access Google Tasks.');

  const res = await fetch(`${TASKS_API_URL}/users/@me/lists`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Google Tasks error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.items || [];
}

/**
 * Gets or creates the primary "JobPunter Applications" task list.
 */
export async function getOrCreateJobPunterTaskList(): Promise<string> {
  const lists = await listTaskLists();
  const existing = lists.find(l => l.title === 'JobPunter Career Tasks' || l.title === 'JobPunter Applications');
  if (existing) return existing.id;

  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required.');

  // Create list
  const res = await fetch(`${TASKS_API_URL}/users/@me/lists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'JobPunter Career Tasks' })
  });

  if (res.ok) {
    const created = await res.json();
    return created.id;
  }

  // Fallback to primary default list
  return '@default';
}

/**
 * Lists tasks in a given task list.
 */
export async function listTasks(taskListId?: string): Promise<GoogleTask[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required.');

  const listId = taskListId || await getOrCreateJobPunterTaskList();
  const res = await fetch(`${TASKS_API_URL}/lists/${listId}/tasks?showCompleted=true&showHidden=true`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to fetch tasks');
  }

  const data = await res.json();
  return data.items || [];
}

/**
 * Creates a new task in Google Tasks.
 * (MANDATORY: Requires explicit user confirmation dialog before calling)
 */
export async function createGoogleTask(
  title: string,
  notes?: string,
  dueDateTime?: string,
  taskListId?: string
): Promise<GoogleTask> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required.');

  const listId = taskListId || await getOrCreateJobPunterTaskList();
  const payload: any = {
    title,
    notes: notes || 'Created via JobPunter'
  };

  if (dueDateTime) {
    // RFC 3339 format required by Google Tasks API
    payload.due = new Date(dueDateTime).toISOString();
  }

  const res = await fetch(`${TASKS_API_URL}/lists/${listId}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to create task');
  }

  return await res.json();
}

/**
 * Toggles or updates task status.
 */
export async function updateTaskStatus(
  taskId: string,
  completed: boolean,
  taskListId?: string
): Promise<GoogleTask> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required.');

  const listId = taskListId || await getOrCreateJobPunterTaskList();
  const payload = {
    status: completed ? 'completed' : 'needsAction'
  };

  const res = await fetch(`${TASKS_API_URL}/lists/${listId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error('Failed to update task status');
  }

  return await res.json();
}

/**
 * Deletes a task from Google Tasks.
 * (MANDATORY: Requires explicit user confirmation dialog before calling)
 */
export async function deleteGoogleTask(taskId: string, taskListId?: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required.');

  const listId = taskListId || await getOrCreateJobPunterTaskList();
  const res = await fetch(`${TASKS_API_URL}/lists/${listId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to delete task');
  }

  return true;
}
