import React from 'react';
import ReactMarkdown from 'react-markdown';

const PreviewPanel = ({ document, isLoading, error }) => {
  return (
    <div className="w-2/3 h-screen bg-gray-100 p-8 overflow-y-auto">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-4xl mx-auto min-h-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Generated Document</h2>
        
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!isLoading && !error && !document && (
          <div className="text-center text-gray-500 py-16">
            <p className="mb-2">Your generated report will appear here.</p>
            <p className="text-sm">Complete the steps on the left and click "Generate Document".</p>
          </div>
        )}

        {document && (
          <article className="prose lg:prose-xl">
            <ReactMarkdown>{document}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
