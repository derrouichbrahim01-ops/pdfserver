import React from 'react';
import { CheckCircle, XCircle, Loader2, Download } from 'lucide-react';
import { ConversionJob } from '../types';

interface ConversionQueueProps {
  conversions: ConversionJob[];
}

export const ConversionQueue: React.FC<ConversionQueueProps> = ({ conversions }) => {
  if (conversions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Queue</h2>
      <div className="space-y-3">
        {conversions.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {job.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {job.status === 'error' && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                {(job.status === 'pending' || job.status === 'processing') && (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {job.fileName} → {job.format.toUpperCase()}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {job.status} {job.status === 'processing' && `(${job.progress}%)`}
                </p>
                {job.error && (
                  <p className="text-xs text-red-600">{job.error}</p>
                )}
              </div>
            </div>

            {job.status === 'processing' && (
              <div className="w-24">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>
            )}

            {job.status === 'completed' && job.downloadUrl && (
              <button
                onClick={() => window.open(job.downloadUrl, '_blank')}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};