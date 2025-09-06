import React from 'react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const PreviewPanel = ({ document, isLoading, error, onExportPPTX, tone, style }) => {
  // Export to PDF function with enhanced formatting
  const exportToPDF = () => {
    const pdf = new jsPDF();
    
    // Add title page
    pdf.setFontSize(24);
    pdf.text('Generated Report', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Tone: ${tone} | Style: ${style}`, 20, 45);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);
    
    // Clean content for PDF (remove markdown formatting)
    const cleanContent = document
      .replace(/## (.*)/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\[cite:.*?\]/g, '')
      .replace(/---/g, '')
      .replace(/\*/g, '•');
    
    const lines = pdf.splitTextToSize(cleanContent, 170);
    pdf.setFontSize(10);
    pdf.text(lines, 20, 70);
    
    pdf.save(`generated-report-${tone}-${style}.pdf`);
  };

  // Export to DOCX function with enhanced formatting
  const exportToDOCX = async () => {
    const sections = document.split('## ').filter(section => section.trim());
    const docElements = [];

    // Add title
    docElements.push(
      new Paragraph({
        children: [new TextRun({ text: "Generated Report", bold: true, size: 32 })],
        heading: HeadingLevel.TITLE,
        spacing: { before: 0, after: 400 }
      })
    );

    // Add metadata
    docElements.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Tone: ${tone} | Style: ${style}`, italics: true, size: 20 }),
          new TextRun({ text: `\nGenerated on: ${new Date().toLocaleDateString()}`, italics: true, size: 20 })
        ],
        spacing: { before: 200, after: 400 }
      })
    );

    sections.forEach(section => {
      const lines = section.split('\n');
      const title = lines[0];
      const content = lines.slice(1).join('\n');

      if (title) {
        docElements.push(
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          })
        );
      }

      const cleanContent = content
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\[cite:.*?\]/g, '')
        .replace(/---/g, '')
        .split('\n')
        .filter(line => line.trim());

      cleanContent.forEach(line => {
        if (line.trim()) {
          // Detect if line is a citation
          const isCitation = line.includes('[Source:');
          
          docElements.push(
            new Paragraph({
              children: [new TextRun({ 
                text: line.trim(), 
                italics: isCitation,
                size: isCitation ? 16 : 20
              })],
              spacing: { after: 200 }
            })
          );
        }
      });
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: docElements
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `generated-report-${tone}-${style}.docx`);
  };

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
      <p className="text-gray-700 leading-relaxed mb-4">
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-800">
        {children}
      </strong>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="mb-1">
        {children}
      </li>
    ),
    // Enhanced citation rendering
    code: ({ children }) => {
      const text = children?.toString() || '';
      if (text.startsWith('cite:')) {
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 ml-1">
            📄 {text.replace('cite:', '').trim()}
          </span>
        );
      }
      return (
        <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">
          {children}
        </code>
      );
    },
    hr: () => (
      <hr className="my-8 border-t-2 border-gray-200" />
    )
  };

  // Process document for better citation display
  const processedDocument = document
    .replace(/\[cite:(.*?)\]/g, '`cite:$1`')
    .replace(/\[Source:(.*?)\]/g, '`cite:$1`');

  return (
    <div className="w-2/3 h-screen bg-white flex flex-col">
      {/* Header with export options */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Document Preview</h2>
            <p className="text-sm text-gray-600">
              {tone && style && `${tone} tone • ${style} style`}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={exportToPDF}
              disabled={!document || isLoading}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 text-sm"
            >
              📄 Export PDF
            </button>
            <button
              onClick={exportToDOCX}
              disabled={!document || isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              📝 Export Word
            </button>
            <button
              onClick={onExportPPTX}
              disabled={!document || isLoading}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 text-sm"
            >
              📊 Export PowerPoint
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your document...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Generation Error</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">
                Please check your inputs and try again. If the problem persists, ensure your API key is configured correctly.
              </p>
            </div>
          </div>
        ) : document ? (
          <div className="p-8">
            {/* Document metadata */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Generated: {new Date().toLocaleString()}</span>
                <span>Words: ~{document.split(' ').length}</span>
                <span>Sections: {document.split('## ').length - 1}</span>
              </div>
            </div>

            {/* Document content */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown components={components}>
                {processedDocument}
              </ReactMarkdown>
            </div>

            {/* Footer with traceability info */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>🤖 Generated using AI-Powered Template Generation Engine</p>
                <p>📋 Template Configuration: {tone} tone, {style} style</p>
                <p>🔗 All statements are evidence-backed with source citations</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Generate</h3>
              <p className="text-gray-600 mb-4">
                Upload your source documents, define your template structure, and click "Generate Report" to create your document.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>✅ Supports PDF, Word, Excel, PowerPoint files</p>
                <p>✅ AI-powered content generation</p>
                <p>✅ Evidence-backed with citations</p>
                <p>✅ Export to multiple formats</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced CSS for better styling */}
      <style jsx>{`
        .prose {
          max-width: none;
        }
        .prose h2 {
          scroll-margin-top: 2rem;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default PreviewPanel;