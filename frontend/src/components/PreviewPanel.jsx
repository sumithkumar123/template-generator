import React from 'react';
import ReactMarkdown from 'react-markdown';

const PreviewPanel = ({ document, isLoading, error }) => {
  // Enhanced markdown renderer with custom components
  const components = {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 pb-2 border-b-2 border-indigo-200 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 leading-7 mb-4 text-justify">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-none space-y-2 mb-4 ml-4">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="flex items-start text-gray-700">
        <span className="text-indigo-500 mr-3 mt-1">▪</span>
        <span className="flex-1">{children}</span>
      </li>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-gray-700">
        {children}
      </ol>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-800">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded text-sm">
        {children}
      </em>
    ),
    hr: () => (
      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <div className="mx-4 text-gray-400">⬥</div>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>
    ),
  };

  // Process document content to enhance citations
  const processContent = (content) => {
    if (!content) return content;
    
    // Enhanced citation pattern with hover tooltips
    return content.replace(
      /\[cite: ([^,]+), (page \d+|para \d+)\]/g,
      '<span class="citation-tag">📄 <span class="citation-text">$1, $2</span></span>'
    );
  };

  return (
    <div className="w-2/3 h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto">
      <div className="bg-white p-12 rounded-xl shadow-xl max-w-5xl mx-auto min-h-full border border-gray-200">
        {/* Header Section */}
        <div className="text-center mb-8 pb-6 border-b border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
            <span className="text-white text-2xl">📊</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Generated Report</h1>
          <p className="text-gray-500">AI-Powered Evidence-Backed Analysis</p>
          <div className="flex justify-center mt-4 space-x-4 text-sm text-gray-400">
            <span>🤖 AI Generated</span>
            <span>•</span>
            <span>📚 Evidence-Backed</span>
            <span>•</span>
            <span>🎯 Custom Template</span>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200"></div>
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Generating your professional report...</p>
            <p className="mt-2 text-gray-400 text-sm">Analyzing documents and creating content</p>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-red-800 font-semibold">Generation Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && !document && (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <span className="text-4xl text-gray-400">📝</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">Ready to Generate</h3>
              <p className="text-gray-500 mb-2">Your professional report will appear here</p>
              <p className="text-sm text-gray-400">Complete the setup on the left and click "Generate Document"</p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-sm text-gray-400">
              <div className="text-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-indigo-600">1</span>
                </div>
                <p>Upload Files</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-indigo-600">2</span>
                </div>
                <p>Design Template</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-indigo-600">3</span>
                </div>
                <p>Generate Report</p>
              </div>
            </div>
          </div>
        )}

        {document && (
          <div className="document-content">
            <article className="prose prose-lg max-w-none">
              <ReactMarkdown 
                components={components}
                children={processContent(document)}
              />
            </article>
          </div>
        )}
      </div>
      
      {/* Custom CSS for enhanced styling */}
      <style jsx>{`
        .citation-tag {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
          color: #4338ca;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          margin: 0 2px;
          border: 1px solid #c7d2fe;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .citation-tag:hover {
          background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
        }
        
        .citation-text {
          margin-left: 4px;
        }
        
        .document-content {
          line-height: 1.8;
        }
        
        .document-content h2 {
          page-break-after: avoid;
        }
        
        .document-content p {
          text-align: justify;
          hyphens: auto;
        }
      `}</style>
    </div>
  );
};

export default PreviewPanel;