import React, { useState, useCallback } from 'react';
import axios from 'axios';

// Simple SVG Icons for UI
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ChatPanel = ({ 
  template, setTemplate, uploadedFiles, setUploadedFiles, onGenerate, onGetQuestions, 
  onExportPPTX, onDeleteFile, isLoading, apiBaseUrl, tone, setTone, style, setStyle,
  clarifyingQuestions, showQuestions, setShowQuestions, filesList, loadFilesList
}) => {
  const [chatInput, setChatInput] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    setUploadError('');
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // The backend returns the filenames it saved.
      // We store the original File objects to keep metadata.
      setUploadedFiles(prevFiles => [...prevFiles, ...files]);
      loadFilesList(); // Refresh files list
    } catch (error) {
      console.error('File upload failed:', error);
      setUploadError(error.response?.data?.detail || 'File upload failed. Please try again.');
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const command = chatInput.toLowerCase().trim();
    
    // Enhanced logic handler for conversational commands
    if (command.startsWith('add')) {
      const section = chatInput.substring(4).trim();
      if (section) setTemplate([...template, section]);
    } else if (command.startsWith('remove')) {
      const section = chatInput.substring(7).trim();
      setTemplate(template.filter(s => s.toLowerCase() !== section.toLowerCase()));
    } else if (command === 'clear') {
      setTemplate([]);
    } else if (command.startsWith('move')) {
      // Handle moving sections: "move section_name to position"
      const parts = command.split(' to ');
      if (parts.length === 2) {
        const sectionName = parts[0].replace('move ', '').trim();
        const position = parseInt(parts[1].trim()) - 1;
        const currentIndex = template.findIndex(s => s.toLowerCase().includes(sectionName));
        if (currentIndex !== -1 && position >= 0 && position < template.length) {
          const newTemplate = [...template];
          const [movedSection] = newTemplate.splice(currentIndex, 1);
          newTemplate.splice(position, 0, movedSection);
          setTemplate(newTemplate);
        }
      }
    } else {
      // For any other input, treat it as adding a new section
      setTemplate([...template, chatInput.trim()]);
    }
    
    setChatInput('');
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'technical', label: 'Technical' },
    { value: 'persuasive', label: 'Persuasive' }
  ];

  const styleOptions = [
    { value: 'analytical', label: 'Analytical' },
    { value: 'narrative', label: 'Narrative' },
    { value: 'executive', label: 'Executive Summary' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'bullet-points', label: 'Bullet Points' }
  ];

  return (
    <div className="w-1/3 h-screen bg-white p-6 flex flex-col shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="flex-grow flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Template Studio</h1>
        <p className="text-sm text-gray-500 mb-6">Define your report structure and upload source files.</p>
        
        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-md font-semibold text-gray-700 mb-2">1. Upload Sources</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
               <UploadIcon />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>Upload files</span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    multiple={true}
                    accept=".pdf,.docx,.xlsx,.xls,.pptx,.txt" 
                    onChange={handleFileUpload} 
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOCX, XLSX, PPTX up to 10MB</p>
            </div>
          </div>
           {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
           
           {/* Enhanced file display with delete option */}
           <div className="mt-4 max-h-32 overflow-y-auto">
             {uploadedFiles.map((file, index) => (
               <div key={index} className="flex items-center justify-between text-sm text-gray-700 bg-gray-100 p-2 rounded-md mb-1">
                 <span className="truncate">{file.name}</span>
                 <button 
                   onClick={() => onDeleteFile(file.name)}
                   className="text-red-500 hover:text-red-700 ml-2"
                   title="Delete file"
                 >
                   <DeleteIcon />
                 </button>
               </div>
             ))}
           </div>
        </div>

        {/* Tone and Style Configuration */}
        <div className="mb-6">
          <label className="block text-md font-semibold text-gray-700 mb-2">2. Writing Style</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tone</label>
              <select 
                value={tone} 
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {toneOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Style</label>
              <select 
                value={style} 
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {styleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Conversational Template Section */}
        <div className="flex-grow flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-md font-semibold text-gray-700">3. Define Template</label>
            <button
              onClick={onGetQuestions}
              disabled={isLoading || uploadedFiles.length === 0}
              className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              <QuestionIcon />
              Get AI Questions
            </button>
          </div>
          
          <div className="flex-grow bg-gray-50 p-3 rounded-md border border-gray-200 overflow-y-auto min-h-32">
            {template.length > 0 ? (
              template.map((section, index) => (
                <div key={index} className="bg-white p-2 mb-2 rounded shadow-sm text-gray-800 flex items-center justify-between">
                  <span>{index + 1}. {section}</span>
                  <button
                    onClick={() => setTemplate(template.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 ml-2"
                    title="Remove section"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Your template is empty. Add sections below.</p>
            )}
          </div>
          
          <form onSubmit={handleChatSubmit} className="mt-4">
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type 'add Section Name', 'remove Section', or 'clear'"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>
        </div>

        {/* Clarifying Questions Modal */}
        {showQuestions && clarifyingQuestions && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-blue-800">AI Clarifying Questions</h3>
              <button 
                onClick={() => setShowQuestions(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-blue-700 whitespace-pre-wrap">
              {clarifyingQuestions}
            </div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <button 
          onClick={onGenerate}
          disabled={isLoading || uploadedFiles.length === 0 || template.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-md transition duration-200"
        >
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
        
        <button 
          onClick={onExportPPTX}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          {isLoading ? 'Exporting...' : 'Export to PowerPoint'}
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;