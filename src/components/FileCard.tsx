import React, { useState } from 'react';
import { FileText, Download, Trash2, Image, FileType, Settings } from 'lucide-react';
import { PDFFile, ConversionFormat } from '../types';

interface FileCardProps {
  file: PDFFile;
  onRemove: (fileId: string) => void;
  onConvert: (fileId: string, format: ConversionFormat) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onRemove, onConvert }) => {
  const [showConversionMenu, setShowConversionMenu] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleConvert = (format: ConversionFormat) => {
    onConvert(file.id, format);
    setShowConversionMenu(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 truncate" title={file.name}>
              {file.name}
            </h3>
            <p className="text-sm text-gray-500">
              {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => onRemove(file.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setShowConversionMenu(!showConversionMenu)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Convert</span>
          </button>

          {showConversionMenu && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-2">
                <button
                  onClick={() => handleConvert('png')}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <Image className="w-4 h-4 text-green-600" />
                  <span>Convert to PNG</span>
                </button>
                <button
                  onClick={() => handleConvert('jpg')}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <Image className="w-4 h-4 text-blue-600" />
                  <span>Convert to JPG</span>
                </button>
                <button
                  onClick={() => handleConvert('txt')}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <FileType className="w-4 h-4 text-gray-600" />
                  <span>Convert to TXT</span>
                </button>
                <button
                  onClick={() => handleConvert('docx')}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span>Convert to DOCX</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};