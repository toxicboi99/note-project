import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Image, File, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const tools = [
  {
    id: 'pdf-editor',
    title: 'PDF Editor',
    description: 'Edit PDF files online',
    icon: FileText,
    api: 'https://api.pdf-editor.example.com',
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert images to PDF format',
    icon: Image,
    api: 'https://api.image-converter.example.com',
  },
  {
    id: 'pdf-to-docx',
    title: 'PDF to DOCX',
    description: 'Convert PDF files to Word documents',
    icon: File,
    api: 'https://api.pdf-converter.example.com',
  },
  {
    id: 'answer-search',
    title: 'Answer Searcher',
    description: 'Find answers to programming questions',
    icon: Search,
    api: 'https://api.stackoverflow.com/2.3/search',
  },
];

export function Tools() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleToolClick = async (tool: typeof tools[0]) => {
    if (!user) {
      toast.error('Please sign in to use this tool');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${tool.title} launched successfully!`);
    } catch (error) {
      toast.error('Failed to launch tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Development Tools</h1>
        <p className="mt-4 text-lg text-gray-500">
          Access our collection of development tools and utilities
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <tool.icon className="h-8 w-8 text-indigo-600" />
              <h3 className="ml-4 text-lg font-medium text-gray-900">{tool.title}</h3>
            </div>
            <p className="mt-4 text-gray-500">{tool.description}</p>
            <button
              onClick={() => handleToolClick(tool)}
              disabled={loading || !user}
              className={`mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Loading...' : 'Launch Tool'}
            </button>
          </div>
        ))}
      </div>

      {!user && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Please sign in to access these tools
        </div>
      )}
    </div>
  );
}