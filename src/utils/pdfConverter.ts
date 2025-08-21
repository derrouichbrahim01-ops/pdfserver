import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';
import { ConversionFormat } from '../types';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const convertPDFToFormat = async (
  file: File,
  format: ConversionFormat,
  onProgress: (progress: number) => void
): Promise<{ downloadUrl: string }> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  onProgress(10);

  switch (format) {
    case 'png':
    case 'jpg':
      return await convertToImage(pdf, format, file.name, numPages, onProgress);
    case 'txt':
      return await convertToText(pdf, file.name, numPages, onProgress);
    case 'docx':
      return await convertToDocx(pdf, file.name, numPages, onProgress);
    default:
      throw new Error('Unsupported format');
  }
};

const convertToImage = async (
  pdf: any,
  format: 'png' | 'jpg',
  fileName: string,
  numPages: number,
  onProgress: (progress: number) => void
): Promise<{ downloadUrl: string }> => {
  const images: Blob[] = [];
  
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const scale = 2.0;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), `image/${format}`, 0.95);
    });

    images.push(blob);
    onProgress(10 + (80 * i) / numPages);
  }

  if (images.length === 1) {
    const url = URL.createObjectURL(images[0]);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace('.pdf', '')}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  } else {
    // Create a zip file for multiple images
    const JSZip = await import('jszip');
    const zip = new JSZip.default();
    
    images.forEach((image, index) => {
      zip.file(`${fileName.replace('.pdf', '')}_page_${index + 1}.${format}`, image);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${fileName.replace('.pdf', '')}_images.zip`);
  }

  onProgress(100);
  return { downloadUrl: '#' };
};

const convertToText = async (
  pdf: any,
  fileName: string,
  numPages: number,
  onProgress: (progress: number) => void
): Promise<{ downloadUrl: string }> => {
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    onProgress(10 + (80 * i) / numPages);
  }

  const blob = new Blob([fullText], { type: 'text/plain' });
  saveAs(blob, `${fileName.replace('.pdf', '')}.txt`);

  onProgress(100);
  return { downloadUrl: '#' };
};

const convertToDocx = async (
  pdf: any,
  fileName: string,
  numPages: number,
  onProgress: (progress: number) => void
): Promise<{ downloadUrl: string }> => {
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
    onProgress(10 + (80 * i) / numPages);
  }

  // Simple HTML to DOCX conversion (basic)
  const htmlContent = `
    <html>
      <head><meta charset="utf-8"></head>
      <body>
        <pre>${fullText}</pre>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
  saveAs(blob, `${fileName.replace('.pdf', '')}.docx`);

  onProgress(100);
  return { downloadUrl: '#' };
};