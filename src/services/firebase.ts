import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export type WorkspaceIntegration = 'drive' | 'gmail' | 'calendar' | 'tasks';

const WORKSPACE_SCOPES: Record<WorkspaceIntegration, string[]> = {
  drive: [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.file'
  ],
  gmail: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send'
  ],
  calendar: ['https://www.googleapis.com/auth/calendar.events'],
  tasks: ['https://www.googleapis.com/auth/tasks']
};

// Workspace tokens remain in memory and are isolated by integration.
const accessTokens: Partial<Record<WorkspaceIntegration, string>> = {};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => onAuthStateChanged(auth, (user: User | null) => {
  if (user) {
    onAuthSuccess?.(user, '');
  } else {
    for (const integration of Object.keys(accessTokens) as WorkspaceIntegration[]) {
      delete accessTokens[integration];
    }
    onAuthFailure?.();
  }
});

/** Sign in to JobPunter without requesting access to Google Workspace data. */
export const googleSignIn = async (): Promise<{ user: User }> => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return { user: result.user };
};

/** Request consent only for the Workspace integration the user chose to connect. */
export const connectGoogleWorkspace = async (
  integration: WorkspaceIntegration
): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('Sign in to JobPunter before connecting a Google Workspace integration.');
  }

  const provider = new GoogleAuthProvider();
  for (const scope of WORKSPACE_SCOPES[integration]) provider.addScope(scope);
  provider.setCustomParameters({ prompt: 'consent select_account' });

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential?.accessToken) {
    throw new Error('Google did not return an access token for this integration.');
  }
  accessTokens[integration] = credential.accessToken;
};

export const getAccessToken = async (
  integration: WorkspaceIntegration
): Promise<string | null> => accessTokens[integration] ?? null;

/** Sign out and clear all in-memory Workspace tokens. */
export const logoutUser = async () => {
  await signOut(auth);
  for (const integration of Object.keys(accessTokens) as WorkspaceIntegration[]) {
    delete accessTokens[integration];
  }
};
