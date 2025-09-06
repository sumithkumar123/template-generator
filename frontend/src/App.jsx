import React, { useState } from 'react';
import axios from 'axios';
import ChatPanel from './components/ChatPanel';
import PreviewPanel from './components/PreviewPanel';

// --- Configuration ---
const API_BASE_URL = 'http://127.0.0.1:8000/api'; // FastAPI backend URL

function App() {
  const [template, setTemplate] = useState(['Executive Summary', 'Key Findings', 'Conclusion']);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one source document.');
      return;
    }
    if (template.length === 0) {
      setError('Please define at least one section in your template.');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedDocument('');

    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, {
        template: template,
        filenames: uploadedFiles.map(f => f.name),
      });
      setGeneratedDocument(response.data.document);
    } catch (err) {
      console.error("Generation failed:", err);
      setError('Failed to generate the document. Please check the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Left Panel: Chat & Controls */}
      <ChatPanel
        template={template}
        setTemplate={setTemplate}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        apiBaseUrl={API_BASE_URL}
      />
      
      {/* Right Panel: Document Preview */}
      <PreviewPanel
        document={generatedDocument}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default App;
