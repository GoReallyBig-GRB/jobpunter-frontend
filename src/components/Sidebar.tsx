import React from 'react';
import { useJobs } from '../context/JobContext';
import { 
  LayoutDashboard,
  UserCheck, 
  Compass, 
  FileText, 
  Sliders, 
  Inbox, 
  Briefcase, 
  AlertCircle, 
  Send, 
  Layers, 
  FolderGit2, 
  Activity, 
  CheckSquare, 
  Cpu, 
  Settings,
  ChevronRight,
  ShieldCheck,
  User,
  ShieldAlert,
  SlidersHorizontal,
  Cloud
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'master_profile'
  | 'career_pathways'
  | 'cv_library'
  | 'preferences'
  | 'ingestion'
  | 'jobs'
  | 'review'
  | 'ready'
  | 'pipeline'
  | 'materials'
  | 'evidence_library'
  | 'health'
  | 'tests'
  | 'ai_providers'
  | 'google_workspace'
  | 'settings'
  | 'admin';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenUploadModal: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUploadModal
}) => {
  const { jobs, sourceEmails, masterProfile, activePresetId } = useJobs();

  const reviewCount = jobs.filter(j => j.decision === 'REVIEW' && j.status === 'REVIEW').length;
  const readyCount = jobs.filter(j => j.status === 'READY_TO_APPLY').length;
  const digestUnparsedCount = sourceEmails.filter(e => e.processedStatus === 'PARSING_REQUIRED').length;
  const appliedCount = jobs.filter(j => ['APPLIED', 'INTERVIEW', 'OFFER'].includes(j.status)).length;

  const candidateGroups: NavGroup[] = [
    {
      groupName: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      groupName: 'PROFILE & EVIDENCE',
      items: [
        { id: 'master_profile', label: 'Master Career Profile', icon: User },
        { id: 'cv_library', label: 'CV Studio & Variants', icon: FileText },
        { id: 'preferences', label: 'Career Preferences', icon: Sliders },
        { id: 'evidence_library', label: 'Evidence Library', icon: FolderGit2 },
        { id: 'health', label: 'Evidence Health', icon: Activity }
      ]
    },
    {
      groupName: 'OPPORTUNITIES',
      items: [
        { 
          id: 'ingestion', 
          label: 'Job Discovery & Ingestion', 
          icon: Inbox,
          badge: digestUnparsedCount > 0 ? digestUnparsedCount : undefined,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        { 
          id: 'review', 
          label: 'Review Queue', 
          icon: AlertCircle,
          badge: reviewCount > 0 ? reviewCount : undefined,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        { id: 'jobs', label: 'Job Pool', icon: Briefcase }
      ]
    },
    {
      groupName: 'APPLICATIONS',
      items: [
        { 
          id: 'ready', 
          label: 'Ready to Apply (Packages)', 
          icon: Send,
          badge: readyCount > 0 ? readyCount : undefined,
          badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        { 
          id: 'pipeline', 
          label: 'Application Pipeline', 
          icon: Layers,
          badge: appliedCount > 0 ? appliedCount : undefined,
          badgeColor: 'bg-indigo-100 text-indigo-800'
        }
      ]
    },
    {
      groupName: 'WORKSPACE & CLOUD',
      items: [
        { 
          id: 'google_workspace', 
          label: 'Google Workspace & Cloud', 
          icon: Cloud 
        }
      ]
    }
  ];

  const hasCandidate = masterProfile && masterProfile.candidateName && masterProfile.candidateName.trim().length > 0;

  return (
    <aside className="w-64 bg-zinc-900 text-zinc-300 flex flex-col shrink-0 border-r border-zinc-800 select-none h-screen overflow-hidden">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-white tracking-wide uppercase">JobPunter</h1>
            <p className="text-[10px] text-zinc-400 font-mono">Precision Opportunity &amp; Application Engine</p>
          </div>
        </div>
      </div>

      {/* Candidate Status Card */}
      <div className="p-3 border-b border-zinc-800/80 bg-zinc-950/40 shrink-0">
        <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1 flex items-center justify-between">
          <span>Active Profile</span>
          <button 
            onClick={onOpenUploadModal}
            className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Import File
          </button>
        </div>
        {hasCandidate ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
              {masterProfile.candidateName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-zinc-100 truncate">{masterProfile.candidateName}</p>
              <p className="text-[11px] text-zinc-400 truncate">{masterProfile.primaryProfession}</p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-amber-400/90 py-0.5">
            No profile configured
          </div>
        )}
      </div>

      {/* Navigation Links with Dedicated Vertical Scrollbar (Section 19) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium scrollbar-thin scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600">
        {candidateGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <div className="px-2.5 text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-semibold">
              {group.groupName}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left group ${
                      isActive 
                        ? 'bg-emerald-500/15 text-emerald-300 font-semibold shadow-xs' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-300'
                      }`} />
                      <span className="truncate text-xs">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                        item.badgeColor || 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Restricted Admin Control Plane (Section 20 & 21) */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950/80 shrink-0">
        <button
          onClick={() => setActiveTab('admin')}
          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'admin'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-zinc-800'
          }`}
          title="Restricted System Control Plane for governing AI tasks, prompts, and integrations"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Admin Control Plane</span>
          </div>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            Control
          </span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-500 flex items-center justify-between shrink-0">
        <span>JobPunter</span>
        <span className="text-emerald-400 font-semibold">Candidate in Control</span>
      </div>
    </aside>
  );
};
