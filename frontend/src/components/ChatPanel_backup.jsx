import React, { useState, useCallback } from 'react';
import axios from 'axios';

// Simple SVG Icons for UI
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const ChatPanel = ({ template, setTemplate, uploadedFiles, setUploadedFiles, onGenerate, isLoading, apiBaseUrl }) => {
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
    } catch (error) {
      console.error('File upload failed:', error);
      setUploadError('File upload failed. Please try again.');
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const command = chatInput.toLowerCase().trim();
    
    // This is a simplified logic handler for conversational commands.
    // A more advanced version could use an NLP library or another AI call.
    if (command.startsWith('add')) {
      const section = chatInput.substring(4).trim();
      if (section) setTemplate([...template, section]);
    } else if (command.startsWith('remove')) {
      const section = chatInput.substring(7).trim();
      setTemplate(template.filter(s => s.toLowerCase() !== section.toLowerCase()));
    } else if (command === 'clear') {
      setTemplate([]);
    } else {
      // For any other input, we can treat it as adding a new section.
      setTemplate([...template, chatInput.trim()]);
    }
    
    setChatInput('');
  };

  return (
    <div className="w-1/3 h-screen bg-white p-6 flex flex-col shadow-lg border-r border-gray-200">
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
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileUpload} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
            </div>
          </div>
           {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
           <div className="mt-4">
             {uploadedFiles.map((file, index) => (
               <div key={index} className="text-sm text-gray-700 bg-gray-100 p-2 rounded-md mb-1">
                 {file.name}
               </div>
             ))}
           </div>
        </div>

        {/* Conversational Template Section */}
        <div className="flex-grow flex flex-col">
          <label className="block text-md font-semibold text-gray-700 mb-2">2. Define Template</label>
          <div className="flex-grow bg-gray-50 p-3 rounded-md border border-gray-200 overflow-y-auto">
            {template.length > 0 ? (
              template.map((section, index) => (
                <div key={index} className="bg-white p-2 mb-2 rounded shadow-sm text-gray-800">{index + 1}. {section}</div>
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
              placeholder="Type 'add Section Name' or 'clear'"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>
        </div>
      </div>
      
      {/* Generate Button */}
      <div className="mt-6">
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {isLoading ? 'Generating...' : 'Generate Document'}
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
