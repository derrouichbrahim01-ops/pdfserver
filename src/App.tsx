import React from 'react';
import { FileText, Zap, Shield } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { FileCard } from './components/FileCard';
import { ConversionQueue } from './components/ConversionQueue';
import { SearchBar } from './components/SearchBar';
import { usePDFManager } from './hooks/usePDFManager';

function App() {
  const {
    files,
    conversions,
    searchTerm,
    setSearchTerm,
    addFiles,
    removeFile,
    convertFile,
  } = usePDFManager();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PDF Manager Pro</h1>
                <p className="text-sm text-gray-600">Convert & manage your PDF files effortlessly</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <span>Fast Conversion</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure Processing</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload PDF Files</h2>
              <FileUpload onFilesAdded={addFiles} />
            </section>

            {/* Search and File Management */}
            {files.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Files ({files.length})
                  </h2>
                  <div className="w-64">
                    <SearchBar
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      placeholder="Search PDF files..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onRemove={removeFile}
                      onConvert={convertFile}
                    />
                  ))}
                </div>

                {files.length === 0 && searchTerm && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No files match your search.</p>
                  </div>
                )}
              </section>
            )}

            {files.length === 0 && !searchTerm && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF files yet</h3>
                <p className="text-gray-600">Upload your first PDF file to get started</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Conversion Queue */}
            <ConversionQueue conversions={conversions} />

            {/* Features Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Formats</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">PNG</span>
                  </div>
                  <span className="text-sm text-gray-700">High-quality images</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">JPG</span>
                  </div>
                  <span className="text-sm text-gray-700">Compressed images</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">TXT</span>
                  </div>
                  <span className="text-sm text-gray-700">Plain text extraction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-orange-600">DOCX</span>
                  </div>
                  <span className="text-sm text-gray-700">Word documents</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            {(files.length > 0 || conversions.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Files</span>
                    <span className="text-sm font-medium text-gray-900">{files.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Conversions</span>
                    <span className="text-sm font-medium text-gray-900">{conversions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm font-medium text-green-600">
                      {conversions.filter(c => c.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;