import { getAccessToken } from './firebase';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  modifiedTime?: string;
  size?: string;
  iconLink?: string;
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3';

/**
 * Lists files in Google Drive.
 */
export async function listDriveFiles(query?: string, pageSize: number = 20): Promise<DriveFile[]> {
  const token = await getAccessToken('drive');
  if (!token) throw new Error('Authentication required. Please sign in with Google to access Google Drive.');

  let q = "trashed = false";
  if (query) {
    q += ` and (${query})`;
  }

  const url = `${DRIVE_API_URL}/files?pageSize=${pageSize}&fields=files(id,name,mimeType,webViewLink,modifiedTime,size,iconLink)&q=${encodeURIComponent(q)}&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Google Drive error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Gets or creates a dedicated "JobPunter Career Materials" folder in Google Drive.
 */
export async function getOrCreateJobPunterFolder(): Promise<string> {
  const token = await getAccessToken('drive');
  if (!token) throw new Error('Authentication required. Please sign in with Google to access Google Drive.');

  // Check if folder already exists
  const listUrl = `${DRIVE_API_URL}/files?q=${encodeURIComponent("name = 'JobPunter Career Materials' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)`;
  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (listRes.ok) {
    const listData = await listRes.json();
    if (listData.files && listData.files.length > 0) {
      return listData.files[0].id;
    }
  }

  // Create folder
  const createRes = await fetch(`${DRIVE_API_URL}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'JobPunter Career Materials',
      mimeType: 'application/vnd.google-apps.folder'
    })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to create JobPunter folder in Google Drive');
  }

  const createdData = await createRes.json();
  return createdData.id;
}

/**
 * Uploads a document (Markdown, Plain Text, or Document Blob) to Google Drive.
 */
export async function uploadFileToDrive(
  fileName: string,
  content: string | Blob,
  mimeType: string = 'text/plain',
  folderId?: string
): Promise<DriveFile> {
  const token = await getAccessToken('drive');
  if (!token) throw new Error('Authentication required. Please sign in with Google to access Google Drive.');

  const targetFolderId = folderId || await getOrCreateJobPunterFolder();

  const metadata = {
    name: fileName,
    mimeType: mimeType,
    parents: [targetFolderId]
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

  if (typeof content === 'string') {
    form.append('file', new Blob([content], { type: mimeType }));
  } else {
    form.append('file', content);
  }

  const res = await fetch(`${UPLOAD_API_URL}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,modifiedTime`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to upload file to Google Drive: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Reads text content of a file from Google Drive.
 */
export async function downloadFileContent(fileId: string): Promise<string> {
  const token = await getAccessToken('drive');
  if (!token) throw new Error('Authentication required.');

  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    // If it's a Google Doc, export it as plain text
    const exportRes = await fetch(`${DRIVE_API_URL}/files/${fileId}/export?mimeType=text/plain`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (exportRes.ok) {
      return await exportRes.text();
    }
    throw new Error(`Failed to download file from Google Drive: ${res.statusText}`);
  }

  return await res.text();
}

/**
 * Deletes a file from Google Drive (Mandatory user confirmation must be handled prior to invocation).
 */
export async function deleteDriveFile(fileId: string): Promise<boolean> {
  const token = await getAccessToken('drive');
  if (!token) throw new Error('Authentication required.');

  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete file from Google Drive');
  }

  return true;
}
