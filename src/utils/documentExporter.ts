import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { jsPDF } from 'jspdf';

export interface ParsedCVDocument {
  name: string;
  contactLine?: string;
  summaryTitle?: string;
  summaryText?: string;
  sections: {
    heading: string;
    subsections?: {
      title: string;
      subtitle?: string;
      date?: string;
      bullets: string[];
    }[];
    paragraphs?: string[];
  }[];
}

/**
 * Parses markdown CV text into canonical structured document representation
 */
export function parseMarkdownToStructuredCV(rawText: string, defaultName: string = 'Candidate'): ParsedCVDocument {
  const lines = rawText.split('\n');
  let name = defaultName;
  let contactLine = '';
  let summaryText = '';
  const sections: ParsedCVDocument['sections'] = [];

  let currentSection: ParsedCVDocument['sections'][0] | null = null;
  let currentSub: NonNullable<ParsedCVDocument['sections'][0]['subsections']>[0] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Heading 1: Candidate Name
    if (line.startsWith('# ')) {
      name = line.replace(/^#\s+/, '').replace(/\s*—.*$/, '').replace(/\s*–.*$/, '').trim();
      continue;
    }

    // Contact info (bold or with location)
    if (line.includes('**Location:**') || line.includes('Location:') || (line.includes('@') && !currentSection)) {
      contactLine = line.replace(/\*\*/g, '').trim();
      continue;
    }

    // Heading 2: Section Heading
    if (line.startsWith('## ')) {
      const heading = line.replace(/^##\s+/, '').trim();
      currentSub = null;
      currentSection = { heading, subsections: [], paragraphs: [] };
      sections.push(currentSection);
      continue;
    }

    // Heading 3: Subsection (Role/Company or Project)
    if (line.startsWith('### ')) {
      const subHeading = line.replace(/^###\s+/, '').trim();
      if (!currentSection) {
        currentSection = { heading: 'Experience', subsections: [], paragraphs: [] };
        sections.push(currentSection);
      }
      currentSub = { title: subHeading, bullets: [] };
      currentSection.subsections?.push(currentSub);
      continue;
    }

    // Bullet points
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const bullet = line.replace(/^[*\-]\s+/, '').trim();
      if (currentSub) {
        currentSub.bullets.push(bullet);
      } else if (currentSection) {
        if (!currentSection.subsections) currentSection.subsections = [];
        if (currentSection.subsections.length === 0) {
          currentSection.subsections.push({ title: '', bullets: [bullet] });
        } else {
          currentSection.subsections[currentSection.subsections.length - 1].bullets.push(bullet);
        }
      }
      continue;
    }

    // Normal paragraph text
    if (currentSection) {
      if (currentSection.heading.toLowerCase().includes('summary')) {
        summaryText = (summaryText ? summaryText + ' ' : '') + line;
      } else if (currentSub) {
        if (!currentSub.subtitle) {
          currentSub.subtitle = line;
        } else {
          currentSub.bullets.push(line);
        }
      } else {
        currentSection.paragraphs?.push(line);
      }
    } else {
      summaryText = (summaryText ? summaryText + ' ' : '') + line;
    }
  }

  return {
    name,
    contactLine,
    summaryText,
    sections
  };
}

/**
 * Generates an executive DOCX document from structured CV representation
 */
export async function generateDocxBlob(parsed: ParsedCVDocument): Promise<Blob> {
  const children: Paragraph[] = [];

  // 1. Candidate Header
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: parsed.name,
          bold: true,
          size: 36, // 18pt
          font: 'Calibri'
        })
      ]
    })
  );

  // 2. Contact details
  if (parsed.contactLine) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: parsed.contactLine,
            size: 20, // 10pt
            color: '555555',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // 3. Professional Summary
  if (parsed.summaryText) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: { color: '2B579A', space: 4, style: BorderStyle.SINGLE, size: 8 }
        },
        children: [
          new TextRun({
            text: 'PROFESSIONAL SUMMARY',
            bold: true,
            size: 24, // 12pt
            color: '1A365D',
            font: 'Calibri'
          })
        ]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: parsed.summaryText,
            size: 21,
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // 4. Sections & Experience
  for (const section of parsed.sections) {
    if (section.heading.toLowerCase().includes('summary') && parsed.summaryText) continue;

    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: { color: '2B579A', space: 4, style: BorderStyle.SINGLE, size: 8 }
        },
        children: [
          new TextRun({
            text: section.heading.toUpperCase(),
            bold: true,
            size: 24,
            color: '1A365D',
            font: 'Calibri'
          })
        ]
      })
    );

    // Paragraphs
    if (section.paragraphs) {
      for (const p of section.paragraphs) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: p,
                size: 21,
                font: 'Calibri'
              })
            ]
          })
        );
      }
    }

    // Subsections
    if (section.subsections) {
      for (const sub of section.subsections) {
        if (sub.title) {
          children.push(
            new Paragraph({
              spacing: { before: 140, after: 60 },
              children: [
                new TextRun({
                  text: sub.title,
                  bold: true,
                  size: 22,
                  color: '222222',
                  font: 'Calibri'
                })
              ]
            })
          );
        }

        if (sub.subtitle) {
          children.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({
                  text: sub.subtitle,
                  italics: true,
                  size: 20,
                  color: '444444',
                  font: 'Calibri'
                })
              ]
            })
          );
        }

        // Bullets
        for (const bullet of sub.bullets) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 21,
                  font: 'Calibri'
                })
              ]
            })
          );
        }
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children
      }
    ]
  });

  return await Packer.toBlob(doc);
}

/**
 * Generates an executive PDF document from structured CV representation
 */
export function generatePdfBlob(parsed: ParsedCVDocument): Blob {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 45;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = 45;
    }
  };

  // 1. Candidate Name Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text(parsed.name, pageWidth / 2, y, { align: 'center' });
  y += 20;

  // 2. Contact details
  if (parsed.contactLine) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(parsed.contactLine, pageWidth / 2, y, { align: 'center' });
    y += 18;
  }

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // 3. Professional Summary
  if (parsed.summaryText) {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 54, 93);
    doc.text('PROFESSIONAL SUMMARY', margin, y);
    y += 4;
    doc.setDrawColor(43, 87, 154);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    const summaryLines = doc.splitTextToSize(parsed.summaryText, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 12 + 10;
  }

  // 4. Sections
  for (const section of parsed.sections) {
    if (section.heading.toLowerCase().includes('summary') && parsed.summaryText) continue;

    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 54, 93);
    doc.text(section.heading.toUpperCase(), margin, y);
    y += 4;
    doc.setDrawColor(43, 87, 154);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    // Paragraphs
    if (section.paragraphs) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      for (const p of section.paragraphs) {
        checkPageBreak(25);
        const pLines = doc.splitTextToSize(p, contentWidth);
        doc.text(pLines, margin, y);
        y += pLines.length * 12 + 6;
      }
    }

    // Subsections
    if (section.subsections) {
      for (const sub of section.subsections) {
        if (sub.title) {
          checkPageBreak(25);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          doc.text(sub.title, margin, y);
          y += 12;
        }

        if (sub.subtitle) {
          checkPageBreak(18);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9);
          doc.setTextColor(90, 90, 90);
          doc.text(sub.subtitle, margin, y);
          y += 11;
        }

        // Bullets
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        for (const bullet of sub.bullets) {
          checkPageBreak(20);
          const bulletLines = doc.splitTextToSize(bullet, contentWidth - 14);
          doc.text('•', margin + 2, y);
          doc.text(bulletLines, margin + 12, y);
          y += bulletLines.length * 11 + 4;
        }
        y += 4;
      }
    }
    y += 6;
  }

  return doc.output('blob');
}

/**
 * Helper to download Blob to user's device
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
