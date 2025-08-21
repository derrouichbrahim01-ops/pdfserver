export interface PDFFile {
  id: string;
  name: string;
  file: File;
  size: number;
  uploadDate: Date;
  thumbnail?: string;
  pages?: number;
}

export interface ConversionJob {
  id: string;
  fileId: string;
  fileName: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export type ConversionFormat = 'png' | 'jpg' | 'txt' | 'docx';