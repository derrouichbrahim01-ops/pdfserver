import { useState, useCallback } from 'react';
import { PDFFile, ConversionJob, ConversionFormat } from '../types';
import { convertPDFToFormat } from '../utils/pdfConverter';

export const usePDFManager = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [conversions, setConversions] = useState<ConversionJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addFiles = useCallback(async (newFiles: File[]) => {
    const pdfFiles: PDFFile[] = [];
    
    for (const file of newFiles) {
      if (file.type === 'application/pdf') {
        const pdfFile: PDFFile = {
          id: crypto.randomUUID(),
          name: file.name,
          file,
          size: file.size,
          uploadDate: new Date(),
        };
        pdfFiles.push(pdfFile);
      }
    }

    setFiles(prev => [...prev, ...pdfFiles]);
    return pdfFiles;
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setConversions(prev => prev.filter(job => job.fileId !== fileId));
  }, []);

  const convertFile = useCallback(async (fileId: string, format: ConversionFormat) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const jobId = crypto.randomUUID();
    const job: ConversionJob = {
      id: jobId,
      fileId,
      fileName: file.name,
      format,
      status: 'pending',
      progress: 0,
    };

    setConversions(prev => [...prev, job]);

    try {
      setConversions(prev => 
        prev.map(j => j.id === jobId ? { ...j, status: 'processing' as const } : j)
      );

      const result = await convertPDFToFormat(file.file, format, (progress) => {
        setConversions(prev => 
          prev.map(j => j.id === jobId ? { ...j, progress } : j)
        );
      });

      setConversions(prev => 
        prev.map(j => j.id === jobId ? { 
          ...j, 
          status: 'completed' as const, 
          progress: 100, 
          downloadUrl: result.downloadUrl 
        } : j)
      );
    } catch (error) {
      setConversions(prev => 
        prev.map(j => j.id === jobId ? { 
          ...j, 
          status: 'error' as const, 
          error: error instanceof Error ? error.message : 'Conversion failed' 
        } : j)
      );
    }
  }, [files]);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    files: filteredFiles,
    conversions,
    searchTerm,
    setSearchTerm,
    addFiles,
    removeFile,
    convertFile,
  };
};