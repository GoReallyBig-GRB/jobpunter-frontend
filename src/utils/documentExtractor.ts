import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export interface DocumentExtractionResult {
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'text';
  fileSize: number;
  extractedText: string;
  metadata: {
    pageCount?: number;
    wordCount: number;
    charCount: number;
    extractedAt: string;
  };
}

/**
 * Extracts plain text from a PDF ArrayBuffer using pdfjs-dist with fallback.
 */
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<{ text: string; pageCount: number }> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      useSystemFonts: true
    });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(Boolean);
      pageTexts.push(strings.join(' '));
    }

    return {
      text: pageTexts.join('\n\n'),
      pageCount: numPages
    };
  } catch (err) {
    console.warn('pdfjs extraction error, attempting stream fallback:', err);
    // Fallback: simple text stream scan from uncompressed blocks in PDF
    const bytes = new Uint8Array(arrayBuffer);
    const latin1 = new TextDecoder('latin1').decode(bytes);
    const textMatches = latin1.match(/\(([^\)\\]{2,})\)[\s]*Tj/g) || [];
    const extracted = textMatches.map(m => m.replace(/\(?\)?[\s]*Tj/g, '').replace(/\\/g, '')).join(' ');
    
    if (extracted.trim().length > 50) {
      return { text: extracted, pageCount: 1 };
    }
    throw new Error(`Unable to parse PDF text: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Extracts plain text from a DOCX ArrayBuffer using mammoth.
 */
async function extractTextFromDOCX(arrayBuffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

/**
 * Universal document extractor supporting real PDF, DOCX, and TXT files.
 */
export async function extractDocumentText(file: File): Promise<DocumentExtractionResult> {
  const fileName = file.name;
  const fileSize = file.size;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  let fileType: 'pdf' | 'docx' | 'txt' = 'txt';
  let extractedText = '';
  let pageCount: number | undefined;

  const arrayBuffer = await file.arrayBuffer();

  if (extension === 'pdf' || file.type === 'application/pdf') {
    fileType = 'pdf';
    const pdfRes = await extractTextFromPDF(arrayBuffer);
    extractedText = pdfRes.text;
    pageCount = pdfRes.pageCount;
  } else if (
    extension === 'docx' || 
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    fileType = 'docx';
    extractedText = await extractTextFromDOCX(arrayBuffer);
  } else {
    // Treat as TXT / Markdown
    fileType = 'txt';
    const textDecoder = new TextDecoder('utf-8');
    extractedText = textDecoder.decode(arrayBuffer);
  }

  const trimmed = extractedText.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = trimmed.length;

  return {
    fileName,
    fileType,
    fileSize,
    extractedText: trimmed,
    metadata: {
      pageCount,
      wordCount,
      charCount,
      extractedAt: new Date().toISOString()
    }
  };
}
