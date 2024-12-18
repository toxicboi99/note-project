import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function Dashboard() {
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [codeSnippets, setCodeSnippets] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    // Load PDFs
    const { data: pdfData } = await supabase
      .from('pdfs')
      .select('*')
      .order('created_at', { ascending: false });

    // Load code snippets
    const { data: snippetData } = await supabase
      .from('code_snippets')
      .select('*')
      .order('created_at', { ascending: false });

    if (pdfData) setPdfs(pdfData);
    if (snippetData) setCodeSnippets(snippetData);
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `pdfs/${fileName}`;

    try {
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('pdfs')
        .insert([
          {
            title: file.name,
            url: publicUrl,
            size: file.size,
          },
        ]);

      if (dbError) throw dbError;

      toast.success('PDF uploaded successfully');
      loadData();
    } catch (error) {
      toast.error('Error uploading PDF');
    }
  };

  const handleAddCodeSnippet = async () => {
    const { error } = await supabase
      .from('code_snippets')
      .insert([
        {
          title: 'New Snippet',
          language: 'javascript',
          code: '// Add your code here',
        },
      ]);

    if (error) {
      toast.error('Error adding snippet');
    } else {
      toast.success('Snippet added successfully');
      loadData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        
        {/* PDFs Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">PDFs</h2>
            <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              <Upload className="inline-block w-4 h-4 mr-2" />
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handlePdfUpload}
              />
            </label>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="font-medium">{pdf.title}</h3>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => {/* Handle delete */}}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Snippets Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Code Snippets</h2>
            <button
              onClick={handleAddCodeSnippet}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Snippet
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4">
            {codeSnippets.map((snippet) => (
              <div key={snippet.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="font-medium">{snippet.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Language: {snippet.language}
                </p>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => {/* Handle delete */}}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}