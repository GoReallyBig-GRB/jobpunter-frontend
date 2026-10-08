import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon, 
  Unlink, 
  Undo, 
  Redo, 
  Download, 
  Copy, 
  Check, 
  Save, 
  FileText, 
  Eye, 
  Code, 
  Indent, 
  Outdent,
  Minus
} from 'lucide-react';
import { parseMarkdownToStructuredCV, generateDocxBlob, generatePdfBlob, downloadBlob } from '../utils/documentExporter';

interface DocumentEditorProps {
  initialContent: string; // Markdown or plain text
  documentTitle?: string;
  candidateName?: string;
  onSave?: (content: string) => void;
  readOnly?: boolean;
  className?: string;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialContent,
  documentTitle = 'Document',
  candidateName = 'Candidate',
  onSave,
  readOnly = false,
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(initialContent);
  const [viewMode, setViewMode] = useState<'visual' | 'markdown'>('visual');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Convert markdown to HTML for contenteditable
  const markdownToHtml = (md: string): string => {
    let html = md;
    
    // Headings
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-zinc-900 border-b border-zinc-300 pb-1 mb-3 mt-4">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-zinc-800 border-b border-zinc-200 pb-0.5 mb-2 mt-4 uppercase tracking-wide">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-semibold text-zinc-800 mb-1 mt-3">$1</h3>');
    
    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/__(.*?)__/gim, '<u>$1</u>');

    // Links [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>');

    // Horizontal Rule
    html = html.replace(/^---$/gim, '<hr class="my-4 border-zinc-300" />');

    // Lists
    const lines = html.split('\n');
    let inList = false;
    let listType: 'ul' | 'ol' = 'ul';
    const processedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isBullet = line.match(/^(\*|-)\s+(.*)/);
      const isNumbered = line.match(/^(\d+)\.\s+(.*)/);

      if (isBullet) {
        if (!inList) {
          processedLines.push('<ul class="list-disc list-inside space-y-1 my-2 pl-2">');
          inList = true;
          listType = 'ul';
        }
        processedLines.push(`<li class="text-zinc-700">${isBullet[2]}</li>`);
      } else if (isNumbered) {
        if (!inList) {
          processedLines.push('<ol class="list-decimal list-inside space-y-1 my-2 pl-2">');
          inList = true;
          listType = 'ol';
        }
        processedLines.push(`<li class="text-zinc-700">${isNumbered[2]}</li>`);
      } else {
        if (inList) {
          processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
        }
        if (line.trim().length > 0 && !line.startsWith('<h') && !line.startsWith('<hr')) {
          processedLines.push(`<p class="my-2 text-zinc-700 leading-relaxed">${line}</p>`);
        } else {
          processedLines.push(line);
        }
      }
    }
    if (inList) {
      processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
    }

    return processedLines.join('\n');
  };

  // Convert HTML back to clean Markdown
  const htmlToMarkdown = (htmlNode: HTMLElement): string => {
    let md = '';
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        md += node.textContent;
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();

        switch (tag) {
          case 'h1':
            md += '\n\n# ';
            Array.from(el.childNodes).forEach(walk);
            md += '\n\n';
            break;
          case 'h2':
            md += '\n\n## ';
            Array.from(el.childNodes).forEach(walk);
            md += '\n\n';
            break;
          case 'h3':
            md += '\n\n### ';
            Array.from(el.childNodes).forEach(walk);
            md += '\n\n';
            break;
          case 'p':
            md += '\n\n';
            Array.from(el.childNodes).forEach(walk);
            md += '\n';
            break;
          case 'strong':
          case 'b':
            md += '**';
            Array.from(el.childNodes).forEach(walk);
            md += '**';
            break;
          case 'em':
          case 'i':
            md += '*';
            Array.from(el.childNodes).forEach(walk);
            md += '*';
            break;
          case 'u':
            md += '__';
            Array.from(el.childNodes).forEach(walk);
            md += '__';
            break;
          case 'a':
            const href = el.getAttribute('href') || '';
            md += '[';
            Array.from(el.childNodes).forEach(walk);
            md += `](${href})`;
            break;
          case 'ul':
            md += '\n';
            Array.from(el.childNodes).forEach(walk);
            md += '\n';
            break;
          case 'ol':
            md += '\n';
            Array.from(el.childNodes).forEach(walk);
            md += '\n';
            break;
          case 'li':
            md += '\n* ';
            Array.from(el.childNodes).forEach(walk);
            break;
          case 'hr':
            md += '\n\n---\n\n';
            break;
          case 'br':
            md += '\n';
            break;
          default:
            Array.from(el.childNodes).forEach(walk);
        }
      }
    };

    walk(htmlNode);
    return md.replace(/\n{3,}/g, '\n\n').trim();
  };

  // Sync initial content
  useEffect(() => {
    setContent(initialContent);
    if (editorRef.current && viewMode === 'visual') {
      editorRef.current.innerHTML = markdownToHtml(initialContent);
    }
  }, [initialContent]);

  // Execute formatting command in document
  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (readOnly) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleEditorInput();
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const updatedMarkdown = htmlToMarkdown(editorRef.current);
      setContent(updatedMarkdown);
      setIsSaved(false);
    }
  };

  const handleApplyLink = () => {
    if (!linkUrl.trim()) return;
    const url = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') 
      ? linkUrl.trim() 
      : `https://${linkUrl.trim()}`;

    if (linkText.trim()) {
      document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${linkText}</a>`);
    } else {
      execCmd('createLink', url);
    }
    setIsLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
    handleEditorInput();
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDocx = async () => {
    const parsed = parseMarkdownToStructuredCV(content, candidateName);
    const blob = await generateDocxBlob(parsed);
    downloadBlob(blob, `${documentTitle.replace(/\s+/g, '_')}.docx`);
  };

  const handleDownloadPdf = () => {
    const parsed = parseMarkdownToStructuredCV(content, candidateName);
    const blob = generatePdfBlob(parsed);
    downloadBlob(blob, `${documentTitle.replace(/\s+/g, '_')}.pdf`);
  };

  const toggleViewMode = () => {
    if (viewMode === 'visual') {
      // Switching to markdown
      if (editorRef.current) {
        setContent(htmlToMarkdown(editorRef.current));
      }
      setViewMode('markdown');
    } else {
      // Switching to visual
      setViewMode('visual');
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = markdownToHtml(content);
        }
      }, 50);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-zinc-300 shadow-xs overflow-hidden flex flex-col ${className}`}>
      {/* Editor Toolbar */}
      <div className="bg-zinc-50 border-b border-zinc-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-1">
          {viewMode === 'visual' && !readOnly && (
            <>
              {/* Headings */}
              <div className="flex items-center border-r border-zinc-300 pr-1 mr-1 gap-0.5">
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<h1>')}
                  title="Title / Heading 1"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<h2>')}
                  title="Heading 2 (Section)"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<h3>')}
                  title="Heading 3 (Role/Item)"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<p>')}
                  title="Paragraph / Body text"
                  className="px-1.5 py-1 text-xs font-semibold rounded hover:bg-zinc-200 text-zinc-700"
                >
                  Body
                </button>
              </div>

              {/* Text Styles */}
              <div className="flex items-center border-r border-zinc-300 pr-1 mr-1 gap-0.5">
                <button
                  type="button"
                  onClick={() => execCmd('bold')}
                  title="Bold (Ctrl+B)"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors font-bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('italic')}
                  title="Italic (Ctrl+I)"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('underline')}
                  title="Underline (Ctrl+U)"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              {/* Lists */}
              <div className="flex items-center border-r border-zinc-300 pr-1 mr-1 gap-0.5">
                <button
                  type="button"
                  onClick={() => execCmd('insertUnorderedList')}
                  title="Bullet List"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('insertOrderedList')}
                  title="Numbered List"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('outdent')}
                  title="Decrease Indent"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <Outdent className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('indent')}
                  title="Increase Indent"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <Indent className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Alignment */}
              <div className="flex items-center border-r border-zinc-300 pr-1 mr-1 gap-0.5">
                <button
                  type="button"
                  onClick={() => execCmd('justifyLeft')}
                  title="Align Left"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('justifyCenter')}
                  title="Align Center"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('justifyRight')}
                  title="Align Right"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              {/* Links & Divider */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(true)}
                  title="Insert Hyperlink"
                  className="p-1.5 rounded hover:bg-zinc-200 text-blue-600 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('unlink')}
                  title="Remove Link"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-500 transition-colors"
                >
                  <Unlink className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('insertHorizontalRule')}
                  title="Insert Divider"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('undo')}
                  title="Undo"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-500 transition-colors"
                >
                  <Undo className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('redo')}
                  title="Redo"
                  className="p-1.5 rounded hover:bg-zinc-200 text-zinc-500 transition-colors"
                >
                  <Redo className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* View Mode Switcher */}
          <button
            type="button"
            onClick={toggleViewMode}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition-colors ml-1"
          >
            {viewMode === 'visual' ? (
              <>
                <Code className="w-3.5 h-3.5 text-zinc-500" />
                <span>Markdown</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Rich Document</span>
              </>
            )}
          </button>
        </div>

        {/* Export & Save Buttons */}
        <div className="flex items-center gap-2">
          {onSave && !readOnly && (
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                isSaved 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved' : 'Save Document'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white border border-zinc-300 rounded text-zinc-700 hover:bg-zinc-50 transition-colors"
            title="Copy Text to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadDocx}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded transition-colors"
            title="Download formatted DOCX Microsoft Word file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOCX</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded transition-colors"
            title="Download formatted PDF file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-6 sm:p-8 bg-zinc-100 flex-1 overflow-y-auto min-h-[460px] max-h-[700px]">
        {/* Printable White Sheet Canvas */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-zinc-200 p-8 sm:p-12 min-h-[550px]">
          {viewMode === 'visual' ? (
            <div
              ref={editorRef}
              contentEditable={!readOnly}
              onInput={handleEditorInput}
              suppressContentEditableWarning
              className="outline-none text-zinc-800 font-sans text-sm leading-relaxed prose prose-zinc max-w-none focus:ring-0"
              style={{ minHeight: '480px' }}
            />
          ) : (
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setIsSaved(false);
              }}
              readOnly={readOnly}
              rows={24}
              className="w-full font-mono text-xs p-4 bg-zinc-50 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed text-zinc-800"
            />
          )}
        </div>
      </div>

      {/* Insert Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-300 max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <span>Insert Hyperlink</span>
              </h4>
              <button 
                onClick={() => setIsLinkModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Destination URL *</label>
                <input
                  type="url"
                  placeholder="https://example.com/project"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded text-xs focus:ring-1 focus:ring-zinc-900"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Display Text (optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty to use highlighted text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded text-xs focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyLink}
                disabled={!linkUrl.trim()}
                className="px-3.5 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded hover:bg-zinc-800 disabled:opacity-50"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
