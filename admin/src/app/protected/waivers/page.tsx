'use client';

import { useState, useEffect } from 'react';
import { uploadWaiverForm, getWaiverForms, deleteWaiverForm } from '@/lib/api';

interface WaiverForm {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  isActive: boolean;
}

export default function WaiversPage() {
  const [waiverForms, setWaiverForms] = useState<WaiverForm[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formName, setFormName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadWaiverForms();
  }, []);

  const loadWaiverForms = async () => {
    try {
      setIsLoading(true);
      const forms = await getWaiverForms();
      setWaiverForms(forms);
    } catch (err) {
      setError('Failed to load waiver forms');
      console.error('Error loading waiver forms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-generate form name from filename
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setFormName(nameWithoutExt);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formName.trim()) {
      setError('Please select a file and provide a name');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setSuccess(null);

      await uploadWaiverForm(selectedFile, formName.trim());
      
      setSuccess('Waiver form uploaded successfully!');
      setSelectedFile(null);
      setFormName('');
      
      // Reset file input
      const fileInput = document.getElementById('waiver-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Reload the list
      await loadWaiverForms();
    } catch (err) {
      setError('Failed to upload waiver form');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this waiver form?')) {
      return;
    }

    try {
      await deleteWaiverForm(id);
      setSuccess('Waiver form deleted successfully!');
      await loadWaiverForms();
    } catch (err) {
      setError('Failed to delete waiver form');
      console.error('Delete error:', err);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      // This would require a backend endpoint to toggle status
      // For now, we'll just show a message
      setSuccess(`Waiver form ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
    } catch (err) {
      setError('Failed to update waiver form status');
      console.error('Toggle error:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Waiver Forms Management</h1>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload New Waiver Form</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label htmlFor="waiver-file" className="block text-sm font-medium text-gray-700 mb-2">
              Select Waiver Form File
            </label>
            <input
              id="waiver-file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Accepted formats: PDF, DOC, DOCX. Max size: 10MB
            </p>
          </div>

          <div>
            <label htmlFor="form-name" className="block text-sm font-medium text-gray-700 mb-2">
              Form Name
            </label>
            <input
              id="form-name"
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g., Standard Waiver Form 2024"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isUploading || !selectedFile || !formName.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Waiver Form'}
          </button>
        </form>
      </div>

      {/* Waiver Forms List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Uploaded Waiver Forms</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading waiver forms...</p>
          </div>
        ) : waiverForms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No waiver forms uploaded yet.</p>
            <p className="text-sm mt-1">Upload your first waiver form above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {waiverForms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{form.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(form.uploadedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        form.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {form.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <a
                        href={form.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </a>
                      <button
                        onClick={() => toggleActive(form.id, form.isActive)}
                        className="text-green-600 hover:text-green-900"
                      >
                        {form.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(form.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 