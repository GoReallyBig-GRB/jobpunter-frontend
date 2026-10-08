import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Upload, 
  AlertTriangle, 
  Copy, 
  Check, 
  Download, 
  Compass, 
  ShieldCheck, 
  Layers, 
  Edit3, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { extractDocumentText } from '../utils/documentExtractor';
import { parseMarkdownToStructuredCV, generateDocxBlob, generatePdfBlob, downloadBlob } from '../utils/documentExporter';
import { CareerPathway, CVVariant } from '../types/job';

export const CVStudioView: React.FC = () => {
  const {
    masterProfile,
    preferences,
    careerPathways,
    cvVariants,
    masterCV,
    generateCareerPathwaysWithAI,
    addCareerPathway,
    toggleApprovePathway,
    deleteCareerPathway,
    generateMasterCVWithAI,
    updateMasterCV,
    generateCVVariantForPathway,
    addCVVariant,
    updateCVVariant,
    deleteCVVariant,
    importCVWithConflictCheck
  } = useJobs();

  const [activeTab, setActiveTab] = useState<'pathways' | 'master_cv' | 'variants'>('pathways');
  const [isGeneratingPathways, setIsGeneratingPathways] = useState(false);
  const [isGeneratingMasterCV, setIsGeneratingMasterCV] = useState(false);
  const [isGeneratingVariant, setIsGeneratingVariant] = useState<string | null>(null);
  
  // Custom pathway modal / form state
  const [showAddPathway, setShowAddPathway] = useState(false);
  const [newPathwayTitle, setNewPathwayTitle] = useState('');
  const [newPathwayRoleFamily, setNewPathwayRoleFamily] = useState('');
  const [newPathwaySeniority, setNewPathwaySeniority] = useState('');
  const [newPathwayRationale, setNewPathwayRationale] = useState('');
  const [newPathwayEvidence, setNewPathwayEvidence] = useState('');

  // CV Upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadConflicts, setUploadConflicts] = useState<string[] | null>(null);
  const [isImportingCV, setIsImportingCV] = useState(false);

  // Master CV edit state
  const [isEditingMasterCV, setIsEditingMasterCV] = useState(false);
  const [masterCVText, setMasterCVText] = useState(masterCV?.fullMarkdown || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Variant edit state
  const [isEditingVariant, setIsEditingVariant] = useState(false);
  const [variantEditText, setVariantEditText] = useState('');

  // Selected CV Variant for inspection
  const [selectedVariantId, setSelectedVariantId] = useState<string>(cvVariants[0]?.id || '');
  const currentVariant = cvVariants.find(v => v.id === selectedVariantId) || cvVariants[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadMasterCVDocx = async () => {
    const text = masterCVText || masterCV?.fullMarkdown || '';
    const parsed = parseMarkdownToStructuredCV(text, masterProfile.candidateName);
    const blob = await generateDocxBlob(parsed);
    downloadBlob(blob, `${masterProfile.candidateName.replace(/\s+/g, '_')}_Master_CV.docx`);
  };

  const handleDownloadMasterCVPdf = () => {
    const text = masterCVText || masterCV?.fullMarkdown || '';
    const parsed = parseMarkdownToStructuredCV(text, masterProfile.candidateName);
    const blob = generatePdfBlob(parsed);
    downloadBlob(blob, `${masterProfile.candidateName.replace(/\s+/g, '_')}_Master_CV.pdf`);
  };

  const handleDownloadVariantDocx = async (v: CVVariant) => {
    const text = isEditingVariant ? variantEditText : v.rawText;
    const parsed = parseMarkdownToStructuredCV(text, masterProfile.candidateName);
    const blob = await generateDocxBlob(parsed);
    downloadBlob(blob, `${masterProfile.candidateName.replace(/\s+/g, '_')}_${v.userDefinedName.replace(/\s+/g, '_')}.docx`);
  };

  const handleDownloadVariantPdf = (v: CVVariant) => {
    const text = isEditingVariant ? variantEditText : v.rawText;
    const parsed = parseMarkdownToStructuredCV(text, masterProfile.candidateName);
    const blob = generatePdfBlob(parsed);
    downloadBlob(blob, `${masterProfile.candidateName.replace(/\s+/g, '_')}_${v.userDefinedName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSaveVariant = () => {
    if (!currentVariant) return;
    updateCVVariant(currentVariant.id, { rawText: variantEditText });
    setIsEditingVariant(false);
  };

  const handleDiscoverPathways = async () => {
    setIsGeneratingPathways(true);
    try {
      await generateCareerPathwaysWithAI();
    } finally {
      setIsGeneratingPathways(false);
    }
  };

  const handleCreatePathway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPathwayTitle.trim()) return;

    addCareerPathway({
      title: newPathwayTitle.trim(),
      roleFamily: newPathwayRoleFamily.trim() || masterProfile.primaryProfession,
      targetSeniority: newPathwaySeniority.trim() || "Senior",
      rationale: newPathwayRationale.trim() || "User defined career direction grounded in Master Profile.",
      supportingEvidence: newPathwayEvidence.split('\n').map(s => s.trim()).filter(Boolean),
      gaps: [],
      isApproved: true,
      confidence: "HIGH",
      source: "USER_DEFINED"
    });

    setNewPathwayTitle('');
    setNewPathwayRoleFamily('');
    setNewPathwaySeniority('');
    setNewPathwayRationale('');
    setNewPathwayEvidence('');
    setShowAddPathway(false);
  };

  const handleGenerateMasterCV = async () => {
    setIsGeneratingMasterCV(true);
    try {
      const generated = await generateMasterCVWithAI();
      setMasterCVText(generated.fullMarkdown);
    } finally {
      setIsGeneratingMasterCV(false);
    }
  };

  const handleSaveMasterCV = () => {
    updateMasterCV({ fullMarkdown: masterCVText, professionalSummary: masterCVText.slice(0, 250) });
    setIsEditingMasterCV(false);
  };

  const handleGenerateVariant = async (pathwayId: string) => {
    setIsGeneratingVariant(pathwayId);
    try {
      const v = await generateCVVariantForPathway(pathwayId);
      setSelectedVariantId(v.id);
      setActiveTab('variants');
    } finally {
      setIsGeneratingVariant(null);
    }
  };

  const handleImportCV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadContent.trim()) return;

    setIsImportingCV(true);
    try {
      const res = await importCVWithConflictCheck(uploadFileName || 'Imported_Candidate_CV.txt', uploadContent);
      if (res.conflicts.length > 0) {
        setUploadConflicts(res.conflicts);
      } else {
        setShowUploadModal(false);
        setUploadContent('');
        setUploadFileName('');
        setUploadConflicts(null);
        setSelectedVariantId(res.variant.id);
        setActiveTab('variants');
      }
    } finally {
      setIsImportingCV(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900 text-white rounded-lg p-5 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              CV Studio &amp; Career Directions
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-400 font-mono">
              Candidate: <strong>{masterProfile.candidateName}</strong> ({masterProfile.primaryProfession})
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-1">
            Evidence Presentation Layer (Zero Fabrication Architecture)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            The Master Job Profile is the factual source of truth. CVs organize and emphasize approved candidate evidence for specific career pathways without inventing qualifications.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded hover:bg-zinc-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Existing CV</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('pathways')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'pathways'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>1. Career Pathways ({careerPathways.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('master_cv')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'master_cv'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>2. Master CV (Comprehensive)</span>
          </button>

          <button
            onClick={() => setActiveTab('variants')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'variants'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>3. CV Variant Library ({cvVariants.length})</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: CAREER PATHWAYS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'pathways' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Career Pathway Discovery &amp; Editorial Control</h3>
              <p className="text-xs text-zinc-500">
                AI discovers plausible directions from your Master Profile. <strong>You decide</strong> which pathways are approved and active for matching and CV generation.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDiscoverPathways}
                disabled={isGeneratingPathways}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isGeneratingPathways ? 'Discovering...' : 'Discover with AI'}</span>
              </button>
              <button
                onClick={() => setShowAddPathway(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Custom Pathway</span>
              </button>
            </div>
          </div>

          {/* Pathways Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerPathways.map((pathway) => (
              <div 
                key={pathway.id}
                className={`bg-white rounded-lg border p-4 space-y-3 transition-all ${
                  pathway.isApproved 
                    ? 'border-emerald-300 shadow-xs ring-1 ring-emerald-200' 
                    : 'border-zinc-200 bg-zinc-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900">{pathway.title}</h4>
                      {pathway.isApproved ? (
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                          Pending Review
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono mt-0.5">
                      {pathway.roleFamily} · Target Seniority: {pathway.targetSeniority}
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    pathway.source === 'USER_DEFINED' ? 'bg-zinc-100 text-zinc-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {pathway.source}
                  </span>
                </div>

                <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-2.5 rounded border border-zinc-100">
                  {pathway.rationale}
                </p>

                {pathway.supportingEvidence.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-700 block mb-1">
                      Supporting Master Profile Evidence:
                    </span>
                    <ul className="text-xs text-zinc-600 space-y-1">
                      {pathway.supportingEvidence.map((ev, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pathway.gaps && pathway.gaps.length > 0 && (
                  <div className="bg-amber-50 p-2 rounded border border-amber-200 text-xs text-amber-900">
                    <span className="font-semibold block mb-0.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Identified Gaps / Constraints:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {pathway.gaps.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleApprovePathway(pathway.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                        pathway.isApproved
                          ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {pathway.isApproved ? 'Revoke Approval' : 'Approve Pathway'}
                    </button>
                    {pathway.isApproved && (
                      <button
                        onClick={() => handleGenerateVariant(pathway.id)}
                        disabled={isGeneratingVariant === pathway.id}
                        className="px-3 py-1 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded transition-colors"
                      >
                        {isGeneratingVariant === pathway.id ? 'Generating...' : 'Generate CV Variant'}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => deleteCareerPathway(pathway.id)}
                    className="text-zinc-400 hover:text-rose-600 p-1"
                    title="Delete Pathway"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: MASTER CV */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'master_cv' && (
        <div className="space-y-4">
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Comprehensive Master CV</h3>
              <p className="text-xs text-zinc-500">
                A complete, unedited repository of all verified experience and capabilities. Editable and fully controlled by you.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateMasterCV}
                disabled={isGeneratingMasterCV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isGeneratingMasterCV ? 'Synthesizing...' : 'Re-Generate from Profile'}</span>
              </button>

              {isEditingMasterCV ? (
                <button
                  onClick={handleSaveMasterCV}
                  className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 rounded transition-colors"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMasterCVText(masterCV?.fullMarkdown || '');
                    setIsEditingMasterCV(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 rounded transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Markdown</span>
                </button>
              )}

              <button
                onClick={() => handleCopy(masterCVText || masterCV?.fullMarkdown || '', 'mcv')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 rounded transition-colors"
              >
                {copiedKey === 'mcv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'mcv' ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadMasterCVDocx}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                title="Download formatted Microsoft Word .docx"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOCX</span>
              </button>

              <button
                onClick={handleDownloadMasterCVPdf}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded transition-colors"
                title="Download formatted Adobe PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-zinc-300 p-6 shadow-xs">
            {isEditingMasterCV ? (
              <textarea
                value={masterCVText}
                onChange={(e) => setMasterCVText(e.target.value)}
                rows={22}
                className="w-full font-mono text-xs p-4 bg-zinc-50 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            ) : (
              <div className="prose prose-xs max-w-none text-zinc-800 font-mono whitespace-pre-wrap leading-relaxed">
                {masterCV?.fullMarkdown || masterCVText || 'Click "Re-Generate from Profile" to synthesize the initial Master CV.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: CV VARIANT LIBRARY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'variants' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Variants List */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono">
                Approved CV Variants ({cvVariants.length})
              </h3>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3 h-3" /> Upload
              </button>
            </div>

            <div className="space-y-2">
              {cvVariants.map(v => {
                const isSelected = v.id === selectedVariantId;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                        : 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="font-bold text-xs">{v.userDefinedName}</div>
                    <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {v.description || v.fileName}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-zinc-800 text-emerald-300' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {v.isActive ? 'Active' : 'Archived'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Variant Preview & Details */}
          <div className="md:col-span-2 bg-white rounded-lg border border-zinc-300 p-5 space-y-4 shadow-xs">
            {currentVariant ? (
              <>
                <div className="flex items-start justify-between border-b border-zinc-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">{currentVariant.userDefinedName}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">{currentVariant.fileName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditingVariant ? (
                      <button
                        onClick={handleSaveVariant}
                        className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 rounded transition-colors"
                      >
                        Save Variant
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setVariantEditText(currentVariant.rawText);
                          setIsEditingVariant(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 rounded transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(isEditingVariant ? variantEditText : currentVariant.rawText, 'variant')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded transition-colors"
                    >
                      {copiedKey === 'variant' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'variant' ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadVariantDocx(currentVariant)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                      title="Download formatted Microsoft Word .docx"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>DOCX</span>
                    </button>

                    <button
                      onClick={() => handleDownloadVariantPdf(currentVariant)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded transition-colors"
                      title="Download formatted Adobe PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={() => deleteCVVariant(currentVariant.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded"
                      title="Delete Variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider font-mono block mb-1">
                      Emphasized Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentVariant.highlightedSkills?.map((s, i) => (
                        <span key={i} className="text-xs font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider font-mono block mb-1">
                      Document Content &amp; Evidence Grounding:
                    </span>
                    {isEditingVariant ? (
                      <textarea
                        rows={16}
                        value={variantEditText}
                        onChange={(e) => setVariantEditText(e.target.value)}
                        className="w-full font-mono text-xs p-3 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      />
                    ) : (
                      <div className="bg-zinc-50 p-4 rounded border border-zinc-200 text-xs font-mono text-zinc-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                        {currentVariant.rawText}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-zinc-400 text-xs">
                No CV variants available. Generate one from an approved career pathway or upload an existing document.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Custom Pathway */}
      {showAddPathway && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h3 className="text-sm font-bold text-zinc-900">Define Custom Career Pathway</h3>
              <button onClick={() => setShowAddPathway(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>

            <form onSubmit={handleCreatePathway} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Pathway Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technical Product Manager (Developer APIs)"
                  value={newPathwayTitle}
                  onChange={(e) => setNewPathwayTitle(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Role Family</label>
                  <input
                    type="text"
                    placeholder="e.g. Product Management"
                    value={newPathwayRoleFamily}
                    onChange={(e) => setNewPathwayRoleFamily(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Target Seniority</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior / Staff"
                    value={newPathwaySeniority}
                    onChange={(e) => setNewPathwaySeniority(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Pathway Rationale &amp; Positioning</label>
                <textarea
                  rows={2}
                  placeholder="Explain why your experience naturally supports this direction..."
                  value={newPathwayRationale}
                  onChange={(e) => setNewPathwayRationale(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Supporting Evidence Bullets (one per line)</label>
                <textarea
                  rows={3}
                  placeholder="Paste specific verifiable projects, platforms, or skills..."
                  value={newPathwayEvidence}
                  onChange={(e) => setNewPathwayEvidence(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPathway(false)}
                  className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded"
                >
                  Create &amp; Approve Pathway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Existing CV */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-zinc-700" />
                Upload Existing CV Document
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>

            <form onSubmit={handleImportCV} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Choose File (.pdf, .docx, .txt)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const result = await extractDocumentText(file);
                        setUploadFileName(result.fileName);
                        setUploadContent(result.extractedText);
                      } catch (err) {
                        alert(`Failed to extract text from file: ${err instanceof Error ? err.message : String(err)}`);
                      }
                    }}
                    className="text-xs text-zinc-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-zinc-300 file:text-xs file:font-medium file:bg-zinc-100 hover:file:bg-zinc-200 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Document File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Candidate_Technical_Resume_2026.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Extracted / Raw CV Text *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste or inspect the extracted text of your existing resume or CV here..."
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  className="w-full p-2 font-mono text-xs bg-zinc-50 border border-zinc-300 rounded focus:outline-none"
                />
              </div>

              {uploadConflicts && uploadConflicts.length > 0 && (
                <div className="bg-amber-50 p-3 rounded border border-amber-300 text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    Conflict Detection Warning (Section 15)
                  </div>
                  <p className="text-[11px] text-amber-800">
                    This CV mentions items that appear to conflict with your Master Profile boundaries:
                  </p>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5">
                    {uploadConflicts.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-amber-700 pt-1 font-mono">
                    The Master Job Profile remains the factual source of truth.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImportingCV}
                  className="px-4 py-2 font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded disabled:opacity-50"
                >
                  {isImportingCV ? 'Validating...' : 'Import to Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
