import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatPanel from './components/ChatPanel';
import PreviewPanel from './components/PreviewPanel';

// --- Configuration ---
const API_BASE_URL = '/api'; // FastAPI backend URL - proxy through Vite

function App() {
  const [template, setTemplate] = useState(['Executive Summary', 'Key Findings', 'Conclusion']);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New state for enhanced features
  const [tone, setTone] = useState('professional');
  const [style, setStyle] = useState('analytical');
  const [clarifyingQuestions, setClarifyingQuestions] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const [filesList, setFilesList] = useState([]);

  // Load uploaded files list on component mount
  useEffect(() => {
    loadFilesList();
  }, []);

  const loadFilesList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files`);
      setFilesList(response.data.files);
    } catch (err) {
      console.error("Failed to load files list:", err);
    }
  };

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
        tone: tone,
        style: style
      });
      setGeneratedDocument(response.data.document);
    } catch (err) {
      console.error("Generation failed:", err);
      setError('Failed to generate the document. Please check the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetQuestions = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one source document first.');
      return;
    }
    if (template.length === 0) {
      setError('Please define at least one section in your template.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/clarify`, {
        template: template,
        filenames: uploadedFiles.map(f => f.name)
      });
      setClarifyingQuestions(response.data.questions);
      setShowQuestions(true);
    } catch (err) {
      console.error("Failed to get clarifying questions:", err);
      setError('Failed to get clarifying questions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPPTX = async () => {
    if (!generatedDocument) {
      setError('Please generate a document first before exporting to PowerPoint.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/export/pptx`, {
        template: template,
        filenames: uploadedFiles.map(f => f.name),
        tone: tone,
        style: style
      });
      
      // Show success message
      alert(`PowerPoint presentation "${response.data.filename}" generated successfully!`);
      
      // Refresh files list
      loadFilesList();
    } catch (err) {
      console.error("PowerPoint export failed:", err);
      setError('Failed to export to PowerPoint.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (filename) => {
    try {
      await axios.delete(`${API_BASE_URL}/files/${filename}`);
      // Remove from uploaded files list
      setUploadedFiles(uploadedFiles.filter(f => f.name !== filename));
      // Refresh files list
      loadFilesList();
    } catch (err) {
      console.error("Failed to delete file:", err);
      setError('Failed to delete file.');
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
        onGetQuestions={handleGetQuestions}
        onExportPPTX={handleExportPPTX}
        onDeleteFile={handleDeleteFile}
        isLoading={isLoading}
        apiBaseUrl={API_BASE_URL}
        tone={tone}
        setTone={setTone}
        style={style}
        setStyle={setStyle}
        clarifyingQuestions={clarifyingQuestions}
        showQuestions={showQuestions}
        setShowQuestions={setShowQuestions}
        filesList={filesList}
        loadFilesList={loadFilesList}
      />
      
      {/* Right Panel: Document Preview */}
      <PreviewPanel
        document={generatedDocument}
        isLoading={isLoading}
        error={error}
        onExportPPTX={handleExportPPTX}
        tone={tone}
        style={style}
      />
    </div>
  );
}

export default App;