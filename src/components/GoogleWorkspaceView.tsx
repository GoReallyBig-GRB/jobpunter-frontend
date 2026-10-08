import React, { useState, useEffect } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  initAuth, 
  googleSignIn, 
  logoutUser, 
  getAccessToken,
  syncJobsToFirestore,
  loadJobsFromFirestore,
  syncProfileToFirestore,
  loadProfileFromFirestore,
  testFirestoreConnection
} from '../services/firebase';
import { 
  listDriveFiles, 
  uploadFileToDrive, 
  deleteDriveFile, 
  DriveFile 
} from '../services/googleDriveService';
import { 
  searchGmailMessages, 
  sendEmail, 
  GmailMessageSummary 
} from '../services/gmailService';
import { 
  listCalendarEvents, 
  createCalendarEvent, 
  deleteCalendarEvent, 
  CalendarEvent 
} from '../services/googleCalendarService';
import { 
  listTasks, 
  createGoogleTask, 
  updateTaskStatus, 
  deleteGoogleTask, 
  GoogleTask 
} from '../services/googleTasksService';
import { ActionConfirmModal } from './ActionConfirmModal';
import { 
  FolderGit2, 
  Mail, 
  Calendar, 
  CheckSquare, 
  Database, 
  UploadCloud, 
  DownloadCloud, 
  RefreshCw, 
  ExternalLink, 
  Trash2, 
  Plus, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { User } from 'firebase/auth';

type WorkspaceTab = 'drive' | 'gmail' | 'calendar' | 'tasks' | 'firebase';

export const GoogleWorkspaceView: React.FC = () => {
  const { 
    jobs, 
    masterProfile, 
    preferences, 
    masterCV, 
    cvVariants, 
    ingestEmailAlert,
    updateMasterProfile 
  } = useJobs();

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('drive');

  // Drive State
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  // Gmail State
  const [gmailMessages, setGmailMessages] = useState<GmailMessageSummary[]>([]);
  const [isGmailLoading, setIsGmailLoading] = useState(false);
  const [gmailQuery, setGmailQuery] = useState('subject:job OR subject:career OR from:linkedin OR from:indeed');
  const [ingestedMessageIds, setIngestedMessageIds] = useState<Set<string>>(new Set());
  
  // Gmail Compose State
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [newInterviewTitle, setNewInterviewTitle] = useState('');
  const [newInterviewJobId, setNewInterviewJobId] = useState('');
  const [newInterviewDate, setNewInterviewDate] = useState('');
  const [newInterviewTime, setNewInterviewTime] = useState('10:00');
  const [newInterviewNotes, setNewInterviewNotes] = useState('');

  // Tasks State
  const [googleTasks, setGoogleTasks] = useState<GoogleTask[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Firebase Sync State
  const [firestoreStatus, setFirestoreStatus] = useState<string>('Connected');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Confirmation Modal State (MANDATORY per workspace integration skill)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: async () => {}
  });

  // Track Auth State on Mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasToken(!!token);
        setIsAuthLoading(false);
      },
      () => {
        setCurrentUser(null);
        setHasToken(false);
        setIsAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch data when authenticated and tab changes
  useEffect(() => {
    if (hasToken) {
      if (activeTab === 'drive') loadDrive();
      if (activeTab === 'gmail') loadGmail();
      if (activeTab === 'calendar') loadCalendar();
      if (activeTab === 'tasks') loadTasks();
    }
  }, [hasToken, activeTab]);

  const handleSignIn = async () => {
    setAuthError(null);
    setIsAuthLoading(true);
    try {
      const res = await googleSignIn();
      setCurrentUser(res.user);
      setHasToken(true);
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    setCurrentUser(null);
    setHasToken(false);
    setDriveFiles([]);
    setGmailMessages([]);
    setCalendarEvents([]);
    setGoogleTasks([]);
  };

  // ==========================================
  // GOOGLE DRIVE HANDLERS
  // ==========================================
  const loadDrive = async () => {
    setIsDriveLoading(true);
    try {
      const files = await listDriveFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleExportCVToDrive = async (type: 'master' | 'variant') => {
    let content = '';
    let name = '';

    if (type === 'master') {
      content = masterCV?.fullMarkdown || '# Master CV\n\n' + (masterProfile.corePositioning || masterProfile.rawText || '');
      name = `${masterProfile.candidateName.replace(/\s+/g, '_')}_Master_CV.md`;
    } else {
      const variant = cvVariants.find(v => v.id === selectedVariantId) || cvVariants[0];
      if (!variant) return;
      content = variant.rawText;
      const variantName = variant.userDefinedName || variant.fileName || 'Tailored';
      name = `${masterProfile.candidateName.replace(/\s+/g, '_')}_${variantName.replace(/\s+/g, '_')}_CV.md`;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Export Document to Google Drive',
      description: `Create and save "${name}" to your Google Drive in the "JobPunter Career Materials" folder?\n\nSize: ~${Math.round(content.length / 1024 * 10) / 10} KB`,
      confirmLabel: 'Upload to Drive',
      isDestructive: false,
      action: async () => {
        setIsDriveLoading(true);
        try {
          await uploadFileToDrive(name, content, 'text/markdown');
          await loadDrive();
        } catch (e: any) {
          alert('Upload failed: ' + e.message);
        } finally {
          setIsDriveLoading(false);
        }
      }
    });
  };

  const handleDeleteDriveFile = (file: DriveFile) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete File from Google Drive',
      description: `Are you sure you want to permanently delete "${file.name}" from your Google Drive?\n\nThis action cannot be undone.`,
      confirmLabel: 'Delete File',
      isDestructive: true,
      action: async () => {
        try {
          await deleteDriveFile(file.id);
          await loadDrive();
        } catch (e: any) {
          alert('Delete failed: ' + e.message);
        }
      }
    });
  };

  // ==========================================
  // GMAIL HANDLERS
  // ==========================================
  const loadGmail = async (query = gmailQuery) => {
    setIsGmailLoading(true);
    try {
      const msgs = await searchGmailMessages(query, 12);
      setGmailMessages(msgs);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGmailLoading(false);
    }
  };

  const handleIngestFromGmail = (msg: GmailMessageSummary) => {
    const result = ingestEmailAlert(msg.subject, msg.bodyText || msg.snippet, msg.from);
    setIngestedMessageIds(prev => new Set([...prev, msg.id]));
    alert(`Successfully processed "${msg.subject}". Extracted ${result.createdJobs.length} potential opportunity.`);
  };

  const handleSendEmailPrompt = () => {
    if (!composeTo || !composeSubject || !composeBody) {
      alert('Please fill in recipient email, subject, and message content.');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Confirm Send Email via Gmail',
      description: `Send the following email from your connected Gmail account?\n\nTo: ${composeTo}\nSubject: ${composeSubject}\n\nContent:\n${composeBody.slice(0, 300)}${composeBody.length > 300 ? '...' : ''}`,
      confirmLabel: 'Send Email',
      isDestructive: false,
      action: async () => {
        try {
          await sendEmail(composeTo, composeSubject, composeBody);
          alert('Email sent successfully!');
          setShowCompose(false);
          setComposeTo('');
          setComposeSubject('');
          setComposeBody('');
        } catch (e: any) {
          alert('Failed to send email: ' + e.message);
        }
      }
    });
  };

  // ==========================================
  // CALENDAR HANDLERS
  // ==========================================
  const loadCalendar = async () => {
    setIsCalendarLoading(true);
    try {
      const events = await listCalendarEvents();
      setCalendarEvents(events);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsCalendarLoading(false);
    }
  };

  const handleScheduleInterview = () => {
    if (!newInterviewTitle || !newInterviewDate) {
      alert('Please enter an interview title and date.');
      return;
    }

    const startIso = new Date(`${newInterviewDate}T${newInterviewTime}:00`).toISOString();
    const endDate = new Date(`${newInterviewDate}T${newInterviewTime}:00`);
    endDate.setHours(endDate.getHours() + 1);
    const endIso = endDate.toISOString();

    setConfirmModal({
      isOpen: true,
      title: 'Schedule Interview in Google Calendar',
      description: `Create an interview event on your Google Calendar?\n\nTitle: ${newInterviewTitle}\nDate & Time: ${new Date(startIso).toLocaleString()}\nNotes: ${newInterviewNotes || 'None'}`,
      confirmLabel: 'Confirm & Schedule',
      isDestructive: false,
      action: async () => {
        try {
          await createCalendarEvent(
            `Interview: ${newInterviewTitle}`,
            startIso,
            endIso,
            newInterviewNotes
          );
          setNewInterviewTitle('');
          setNewInterviewDate('');
          setNewInterviewNotes('');
          await loadCalendar();
          alert('Interview scheduled in your Google Calendar!');
        } catch (e: any) {
          alert('Failed to schedule: ' + e.message);
        }
      }
    });
  };

  const handleDeleteCalendarEvent = (event: CalendarEvent) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Calendar Event',
      description: `Are you sure you want to remove "${event.summary}" from your Google Calendar?`,
      confirmLabel: 'Remove Event',
      isDestructive: true,
      action: async () => {
        try {
          await deleteCalendarEvent(event.id);
          await loadCalendar();
        } catch (e: any) {
          alert('Delete failed: ' + e.message);
        }
      }
    });
  };

  // ==========================================
  // GOOGLE TASKS HANDLERS
  // ==========================================
  const loadTasks = async () => {
    setIsTasksLoading(true);
    try {
      const items = await listTasks();
      setGoogleTasks(items);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsTasksLoading(false);
    }
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    setConfirmModal({
      isOpen: true,
      title: 'Add Google Task',
      description: `Add "${newTaskTitle}" to your Google Tasks?${newTaskDueDate ? `\nDue Date: ${newTaskDueDate}` : ''}`,
      confirmLabel: 'Create Task',
      isDestructive: false,
      action: async () => {
        try {
          await createGoogleTask(newTaskTitle, 'Created via JobPunter', newTaskDueDate || undefined);
          setNewTaskTitle('');
          setNewTaskDueDate('');
          await loadTasks();
        } catch (e: any) {
          alert('Failed to create task: ' + e.message);
        }
      }
    });
  };

  const handleToggleTask = async (task: GoogleTask) => {
    const isCompleted = task.status === 'completed';
    try {
      await updateTaskStatus(task.id, !isCompleted);
      setGoogleTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: isCompleted ? 'needsAction' : 'completed' } : t));
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleDeleteTask = (task: GoogleTask) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Google Task',
      description: `Are you sure you want to remove "${task.title}" from Google Tasks?`,
      confirmLabel: 'Delete Task',
      isDestructive: true,
      action: async () => {
        try {
          await deleteGoogleTask(task.id);
          await loadTasks();
        } catch (e: any) {
          alert('Failed to delete task: ' + e.message);
        }
      }
    });
  };

  // ==========================================
  // FIREBASE CLOUD PERSISTENCE HANDLERS
  // ==========================================
  const handleBackupToFirestore = async () => {
    if (!currentUser) {
      alert('Please sign in to backup data to Firebase Cloud.');
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const [profileRes, jobsRes] = await Promise.all([
        syncProfileToFirestore(currentUser.uid, masterProfile),
        syncJobsToFirestore(currentUser.uid, jobs)
      ]);

      if (profileRes.success && jobsRes.success) {
        setSyncMessage(`Successfully backed up ${jobs.length} jobs and Master Profile to Firebase Firestore.`);
      } else {
        setSyncMessage(`Backup completed with warnings: ${profileRes.message || ''} ${jobsRes.message || ''}`);
      }
    } catch (err: any) {
      setSyncMessage('Firestore backup failed: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRestoreFromFirestore = async () => {
    if (!currentUser) return;

    setConfirmModal({
      isOpen: true,
      title: 'Restore Data from Firebase Cloud',
      description: `This will load candidate profile and job documents from your Firebase Cloud database into JobPunter.\n\nContinue?`,
      confirmLabel: 'Restore Data',
      isDestructive: false,
      action: async () => {
        setIsSyncing(true);
        try {
          const [cloudProfile, cloudJobs] = await Promise.all([
            loadProfileFromFirestore(currentUser.uid),
            loadJobsFromFirestore(currentUser.uid)
          ]);

          if (cloudProfile) {
            updateMasterProfile(cloudProfile);
          }
          setSyncMessage(`Restored from Firestore: Profile loaded, ${cloudJobs.length} jobs retrieved.`);
        } catch (err: any) {
          setSyncMessage('Restore failed: ' + err.message);
        } finally {
          setIsSyncing(false);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Workspace Authentication & Header Banner */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5" />
                Google Workspace &amp; Firebase Cloud
              </span>
              <span className="text-xs font-mono text-zinc-400">Zero-Cost Infrastructure</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              Google Workspace Ecosystem &amp; Cloud Database
            </h1>
            <p className="text-xs text-zinc-600 max-w-2xl">
              Seamlessly connect Google Drive for CV dossiers, Gmail for automatic job alert ingestion, Google Calendar for interview scheduling, Google Tasks for application checklists, and Firebase Firestore for cloud persistence.
            </p>
          </div>

          {/* Google Sign-in / User Profile Card */}
          <div className="shrink-0">
            {currentUser && hasToken ? (
              <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || ''} className="w-9 h-9 rounded-full border border-zinc-300" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                    {currentUser.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-zinc-900 leading-tight">{currentUser.displayName || 'Google Account'}</p>
                  <p className="text-[11px] text-zinc-500 font-mono truncate max-w-[180px]">{currentUser.email}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="ml-2 px-2.5 py-1 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded border border-zinc-300 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* Official Google Sign In Button per skill specification */
              <button
                onClick={handleSignIn}
                disabled={isAuthLoading}
                className="inline-flex items-center gap-3 px-4 py-2.5 bg-white border border-zinc-300 hover:border-zinc-400 rounded-lg shadow-xs hover:shadow-sm text-zinc-700 font-medium text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isAuthLoading ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {authError && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('drive')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === 'drive'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Google Drive</span>
          {driveFiles.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'drive' ? 'bg-blue-700 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
              {driveFiles.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('gmail')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === 'gmail'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Gmail Job Alerts</span>
          {gmailMessages.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'gmail' ? 'bg-rose-700 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
              {gmailMessages.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === 'calendar'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Google Calendar</span>
          {calendarEvents.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'calendar' ? 'bg-amber-700 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
              {calendarEvents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === 'tasks'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Google Tasks</span>
          {googleTasks.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'tasks' ? 'bg-emerald-700 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
              {googleTasks.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('firebase')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === 'firebase'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Firebase Cloud Sync</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs">
        {/* =======================================================
            TAB 1: GOOGLE DRIVE
           ======================================================= */}
        {activeTab === 'drive' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div>
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-blue-600" />
                  Google Drive Dossier Repository
                </h3>
                <p className="text-xs text-zinc-500">
                  Store and organize your master CV, role variants, and cover letter documents directly in Google Drive.
                </p>
              </div>

              {hasToken && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportCVToDrive('master')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Export Master CV
                  </button>

                  {cvVariants.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <select
                        value={selectedVariantId || (cvVariants[0]?.id || '')}
                        onChange={(e) => setSelectedVariantId(e.target.value)}
                        className="bg-zinc-100 text-xs border border-zinc-200 rounded-lg px-2 py-1.5 font-medium"
                      >
                        {cvVariants.map(v => (
                          <option key={v.id} value={v.id}>{v.userDefinedName || v.fileName || 'CV Variant'}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleExportCVToDrive('variant')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                        Export Variant
                      </button>
                    </div>
                  )}

                  <button
                    onClick={loadDrive}
                    disabled={isDriveLoading}
                    className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                    title="Refresh files"
                  >
                    <RefreshCw className={`w-4 h-4 ${isDriveLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {!hasToken ? (
              <div className="text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
                <FolderGit2 className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-zinc-800">Google Drive Connection Inactive</h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-4">
                  Sign in with your Google account above to browse your Google Drive files and export tailored CV variants directly to the cloud.
                </p>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
                >
                  Connect Google Drive
                </button>
              </div>
            ) : isDriveLoading ? (
              <div className="text-center py-12 text-xs text-zinc-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                Loading files from Google Drive...
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 rounded-lg border border-zinc-200">
                <p className="text-xs text-zinc-600 font-medium">No files found in Google Drive.</p>
                <p className="text-[11px] text-zinc-400 mt-1">Use the "Export Master CV" button above to upload your first document.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-lg overflow-hidden">
                {driveFiles.map((file) => (
                  <div key={file.id} className="p-3.5 flex items-center justify-between hover:bg-zinc-50/80 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 truncate">{file.name}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : ''} · {file.mimeType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open in Drive</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteDriveFile(file)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            TAB 2: GMAIL JOB ALERTS
           ======================================================= */}
        {activeTab === 'gmail' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div>
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-rose-600" />
                  Gmail Inbound Job Alert Bridge
                </h3>
                <p className="text-xs text-zinc-500">
                  Search live alert emails from LinkedIn, Indeed, and recruiters, and ingest opportunities straight into JobPunter.
                </p>
              </div>

              {hasToken && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCompose(!showCompose)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Compose Outreach
                  </button>
                  <button
                    onClick={() => loadGmail()}
                    disabled={isGmailLoading}
                    className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                    title="Refresh Gmail"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGmailLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* Compose Drawer if active */}
            {showCompose && hasToken && (
              <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider font-mono">
                    Compose Outreach / Follow-up Email
                  </h4>
                  <span className="text-[10px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Confirmation required before send
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Recipient email (recruiter@company.com)"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="w-full text-xs bg-white border border-rose-200 rounded-lg px-3 py-2 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Subject (e.g., Application Follow-up: Senior PM Role)"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="w-full text-xs bg-white border border-rose-200 rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Email body text..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full text-xs bg-white border border-rose-200 rounded-lg p-3 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowCompose(false)}
                    className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-200 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmailPrompt}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Review &amp; Send
                  </button>
                </div>
              </div>
            )}

            {/* Search Query Filter */}
            {hasToken && (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={gmailQuery}
                    onChange={(e) => setGmailQuery(e.target.value)}
                    placeholder="Search query (e.g. from:linkedin OR 'product manager')"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
                <button
                  onClick={() => loadGmail(gmailQuery)}
                  className="w-full sm:w-auto px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
                >
                  Search Gmail
                </button>
              </div>
            )}

            {!hasToken ? (
              <div className="text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
                <Mail className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-zinc-800">Gmail Ingestion Inactive</h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-4">
                  Connect your Gmail account to automatically scan for job alerts and 1-click ingest opportunities directly into your pipeline.
                </p>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
                >
                  Connect Gmail
                </button>
              </div>
            ) : isGmailLoading ? (
              <div className="text-center py-12 text-xs text-zinc-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-600" />
                Searching Gmail inbox for job alerts...
              </div>
            ) : gmailMessages.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 rounded-lg border border-zinc-200">
                <p className="text-xs text-zinc-600 font-medium">No job alerts matched your query.</p>
                <p className="text-[11px] text-zinc-400 mt-1">Try broadening the search query above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {gmailMessages.map((msg) => {
                  const isIngested = ingestedMessageIds.has(msg.id);
                  return (
                    <div key={msg.id} className="p-4 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 truncate max-w-[200px]">
                            {msg.from}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {new Date(msg.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 truncate">{msg.subject}</h4>
                        <p className="text-[11px] text-zinc-500 line-clamp-2">{msg.snippet}</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isIngested ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Ingested
                          </span>
                        ) : (
                          <button
                            onClick={() => handleIngestFromGmail(msg)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Ingest to Pool
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            TAB 3: GOOGLE CALENDAR
           ======================================================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div>
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  Google Calendar Interview Timeline
                </h3>
                <p className="text-xs text-zinc-500">
                  Track upcoming screening calls, technical rounds, and interview milestones synced directly with Google Calendar.
                </p>
              </div>

              {hasToken && (
                <button
                  onClick={loadCalendar}
                  disabled={isCalendarLoading}
                  className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  title="Refresh calendar"
                >
                  <RefreshCw className={`w-4 h-4 ${isCalendarLoading ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            {hasToken && (
              <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-amber-950 uppercase font-mono tracking-wider">
                  Schedule New Interview or Milestone
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Interview title (e.g. Acme Corp Technical Round)"
                    value={newInterviewTitle}
                    onChange={(e) => setNewInterviewTitle(e.target.value)}
                    className="text-xs bg-white border border-amber-200 rounded-lg px-3 py-2 focus:outline-none"
                  />
                  <input
                    type="date"
                    value={newInterviewDate}
                    onChange={(e) => setNewInterviewDate(e.target.value)}
                    className="text-xs bg-white border border-amber-200 rounded-lg px-3 py-2 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={newInterviewTime}
                    onChange={(e) => setNewInterviewTime(e.target.value)}
                    className="text-xs bg-white border border-amber-200 rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Notes, interviewer names, or meeting link..."
                    value={newInterviewNotes}
                    onChange={(e) => setNewInterviewNotes(e.target.value)}
                    className="flex-1 text-xs bg-white border border-amber-200 rounded-lg px-3 py-2 focus:outline-none"
                  />
                  <button
                    onClick={handleScheduleInterview}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs shrink-0 cursor-pointer"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            )}

            {!hasToken ? (
              <div className="text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
                <Calendar className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-zinc-800">Google Calendar Inactive</h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-4">
                  Connect your Google Calendar to manage interview rounds, schedule milestones, and sync application deadlines.
                </p>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors cursor-pointer shadow-xs"
                >
                  Connect Calendar
                </button>
              </div>
            ) : isCalendarLoading ? (
              <div className="text-center py-12 text-xs text-zinc-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-600" />
                Loading calendar events...
              </div>
            ) : calendarEvents.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 rounded-lg border border-zinc-200">
                <p className="text-xs text-zinc-600 font-medium">No upcoming events found on your calendar.</p>
                <p className="text-[11px] text-zinc-400 mt-1">Schedule an interview using the form above.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-lg overflow-hidden">
                {calendarEvents.map((evt) => (
                  <div key={evt.id} className="p-3.5 flex items-center justify-between hover:bg-zinc-50/80 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 truncate">{evt.summary}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          {evt.start.dateTime ? new Date(evt.start.dateTime).toLocaleString() : evt.start.date}
                          {evt.location ? ` · ${evt.location}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {evt.htmlLink && (
                        <a
                          href={evt.htmlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50 rounded transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteCalendarEvent(evt)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Remove event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            TAB 4: GOOGLE TASKS
           ======================================================= */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div>
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                  Google Tasks Application Checklist
                </h3>
                <p className="text-xs text-zinc-500">
                  Manage career preparation to-dos, recruiter follow-ups, and interview homework synced with Google Tasks.
                </p>
              </div>

              {hasToken && (
                <button
                  onClick={loadTasks}
                  disabled={isTasksLoading}
                  className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  title="Refresh tasks"
                >
                  <RefreshCw className={`w-4 h-4 ${isTasksLoading ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            {hasToken && (
              <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-emerald-950 uppercase font-mono tracking-wider">
                  Add Application Action Item
                </h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Task title (e.g. Review system design architecture for Stripe interview)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 text-xs bg-white border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none"
                  />
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="text-xs bg-white border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none"
                  />
                  <button
                    onClick={handleAddTask}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs shrink-0 cursor-pointer"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            )}

            {!hasToken ? (
              <div className="text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
                <CheckSquare className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-zinc-800">Google Tasks Inactive</h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-4">
                  Connect your Google account to create and manage application tasks, follow-up reminders, and interview prep lists.
                </p>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                >
                  Connect Google Tasks
                </button>
              </div>
            ) : isTasksLoading ? (
              <div className="text-center py-12 text-xs text-zinc-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                Loading tasks from Google Tasks...
              </div>
            ) : googleTasks.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 rounded-lg border border-zinc-200">
                <p className="text-xs text-zinc-600 font-medium">No tasks found.</p>
                <p className="text-[11px] text-zinc-400 mt-1">Add your first task above.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-lg overflow-hidden">
                {googleTasks.map((t) => {
                  const isDone = t.status === 'completed';
                  return (
                    <div key={t.id} className="p-3.5 flex items-center justify-between hover:bg-zinc-50/80 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => handleToggleTask(t)}
                          className="w-4 h-4 text-emerald-600 rounded border-zinc-300 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isDone ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                            {t.title}
                          </p>
                          {t.due && (
                            <p className="text-[11px] text-zinc-400 font-mono">
                              Due: {new Date(t.due).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteTask(t)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            TAB 5: FIREBASE CLOUD PERSISTENCE
           ======================================================= */}
        {activeTab === 'firebase' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div>
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  Firebase Cloud Firestore Sync
                </h3>
                <p className="text-xs text-zinc-500">
                  Persistent cloud database storage for candidate profiles, evaluated jobs, custom CV variants, and application history.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Firestore Rules ABAC Enforced
                </span>
              </div>
            </div>

            {/* Cloud Status Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Local Jobs Tracked</span>
                <p className="text-2xl font-bold text-zinc-900">{jobs.length}</p>
                <p className="text-[11px] text-zinc-500">Active opportunities in pool</p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Candidate Dossier</span>
                <p className="text-base font-bold text-zinc-900 truncate">{masterProfile.candidateName || 'Unnamed'}</p>
                <p className="text-[11px] text-zinc-500">{cvVariants.length} CV Variants configured</p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Cloud Auth State</span>
                <p className="text-sm font-bold text-zinc-900 truncate">
                  {currentUser ? currentUser.email : 'Unauthenticated'}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Firestore Region: europe-west2</p>
              </div>
            </div>

            {syncMessage && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{syncMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
                Cloud Synchronization Actions
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBackupToFirestore}
                  disabled={!currentUser || isSyncing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isSyncing ? 'Synchronizing...' : 'Backup Local Pool to Firebase Cloud'}</span>
                </button>

                <button
                  onClick={handleRestoreFromFirestore}
                  disabled={!currentUser || isSyncing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <DownloadCloud className="w-4 h-4 text-indigo-600" />
                  <span>Restore from Firebase Cloud</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                Security note: All documents are stored in user-isolated paths (/users/{`{userId}`}/...) protected by ABAC Firestore security rules.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory User Confirmation Modal */}
      <ActionConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmLabel={confirmModal.confirmLabel}
        isDestructive={confirmModal.isDestructive}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={async () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          await confirmModal.action();
        }}
      />
    </div>
  );
};
