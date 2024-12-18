import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAuth } from '../contexts/AuthContext';
import { Download, Eye } from 'lucide-react';

// Set worker path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const notes = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Complete guide to JavaScript basics and advanced concepts',
    url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', // Example PDF
  },
  {
    title: 'React Best Practices',
    description: 'Learn React patterns and optimization techniques',
    url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', // Example PDF
  },
];

export function Notes() {
  const { user } = useAuth();
  const [selectedPdf, setSelectedPdf] = React.useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Programming Notes</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <div key={note.title} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{note.title}</h3>
            <p className="text-gray-500 mb-4">{note.description}</p>
            <div className="flex space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => window.open(note.url, '_blank')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => setSelectedPdf(note.url)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </button>
                </>
              ) : (
                <p className="text-sm text-red-600">Sign in to access notes</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] overflow-auto">
            <Document file={selectedPdf}>
              <Page pageNumber={1} />
            </Document>
            <button
              onClick={() => setSelectedPdf(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}