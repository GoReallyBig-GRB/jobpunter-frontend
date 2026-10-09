import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Job, MasterProfile, JobPreferences, CVVariant } from '../types/job';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider with full Workspace scopes
export const googleAuthProvider = new GoogleAuthProvider();

// Scopes matching user request
const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

WORKSPACE_SCOPES.forEach(scope => {
  googleAuthProvider.addScope(scope);
});

// Flag to track sign-in in progress
let isSigningIn = false;

// IN-MEMORY ONLY access token cache (CRITICAL: Do NOT store in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

/**
 * Validates connection to Firestore on application boot as required by Firebase skill
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connection test succeeded.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline. Offline persistence remains active.');
    } else {
      console.log('[Firebase] Firestore test ping (document may not exist yet, connection is valid).');
    }
    return false;
  }
}

// Automatically ping connection
testFirestoreConnection();

/**
 * Initializes Firebase Auth state listener.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If user is logged in but in-memory token is absent (e.g., page refresh),
        // notify that Workspace token needs a refresh or interactive sign-in
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Performs Google Sign-In with popup and caches OAuth token in-memory.
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleAuthProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to acquire OAuth access token from Google.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieves the currently active in-memory access token.
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Sets or clears the in-memory access token manually if needed.
 */
export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Signs out from Firebase and wipes in-memory token.
 */
export const logoutUser = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * -------------------------------------------------------------
 * Firestore Cloud Persistence Layer for JobPunter
 * -------------------------------------------------------------
 */

export interface CloudSyncResult {
  success: boolean;
  timestamp: string;
  count?: number;
  message?: string;
}

/**
 * Saves candidate Master Profile to Firestore under `/users/{uid}/profile/current`
 */
export async function syncProfileToFirestore(userId: string, profile: MasterProfile): Promise<CloudSyncResult> {
  try {
    const profileRef = doc(db, 'users', userId, 'profile', 'current');
    await setDoc(profileRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return {
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Profile synchronized with Firebase Cloud'
    };
  } catch (err: any) {
    console.error('syncProfileToFirestore error:', err);
    return { success: false, timestamp: new Date().toISOString(), message: err.message };
  }
}

/**
 * Loads candidate Master Profile from Firestore
 */
export async function loadProfileFromFirestore(userId: string): Promise<MasterProfile | null> {
  try {
    const profileRef = doc(db, 'users', userId, 'profile', 'current');
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      return snap.data() as MasterProfile;
    }
    return null;
  } catch (err) {
    console.error('loadProfileFromFirestore error:', err);
    return null;
  }
}

/**
 * Syncs jobs batch to Firestore under `/users/{uid}/jobs/{jobId}`
 */
export async function syncJobsToFirestore(userId: string, jobs: Job[]): Promise<CloudSyncResult> {
  try {
    const batch = writeBatch(db);
    // Write in chunks if needed; up to 500 operations per batch
    const slice = jobs.slice(0, 450);
    for (const job of slice) {
      const jobRef = doc(db, 'users', userId, 'jobs', job.id);
      batch.set(jobRef, {
        ...job,
        syncedAt: new Date().toISOString()
      }, { merge: true });
    }
    await batch.commit();

    return {
      success: true,
      timestamp: new Date().toISOString(),
      count: slice.length,
      message: `Synchronized ${slice.length} jobs to Firestore`
    };
  } catch (err: any) {
    console.error('syncJobsToFirestore error:', err);
    return { success: false, timestamp: new Date().toISOString(), message: err.message };
  }
}

/**
 * Loads all jobs from Firestore under `/users/{uid}/jobs`
 */
export async function loadJobsFromFirestore(userId: string): Promise<Job[]> {
  try {
    const jobsCol = collection(db, 'users', userId, 'jobs');
    const snap = await getDocs(jobsCol);
    const jobs: Job[] = [];
    snap.forEach(docSnap => {
      jobs.push(docSnap.data() as Job);
    });
    return jobs;
  } catch (err) {
    console.error('loadJobsFromFirestore error:', err);
    return [];
  }
}

/**
 * Syncs user preferences to Firestore
 */
export async function syncPreferencesToFirestore(userId: string, prefs: JobPreferences): Promise<CloudSyncResult> {
  try {
    const prefRef = doc(db, 'users', userId, 'preferences', 'current');
    await setDoc(prefRef, {
      ...prefs,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true, timestamp: new Date().toISOString() };
  } catch (err: any) {
    return { success: false, timestamp: new Date().toISOString(), message: err.message };
  }
}

/**
 * Loads preferences from Firestore
 */
export async function loadPreferencesFromFirestore(userId: string): Promise<JobPreferences | null> {
  try {
    const prefRef = doc(db, 'users', userId, 'preferences', 'current');
    const snap = await getDoc(prefRef);
    if (snap.exists()) {
      return snap.data() as JobPreferences;
    }
    return null;
  } catch (err) {
    return null;
  }
}
