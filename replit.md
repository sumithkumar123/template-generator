# Overview

AI-Powered Template Generation Engine is a full-stack application that enables users to upload documents (PDF, DOCX, TXT) and generate evidence-backed reports using AI. The system features a conversational chat interface for user commands and a live preview panel showing generated content with proper citations and source references.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with Vite as the build tool
- **Styling**: Tailwind CSS for utility-first styling with custom Inter font
- **Component Structure**: Split-view layout with ChatPanel for conversational commands and PreviewPanel for document preview
- **HTTP Client**: Axios for API communication with the backend
- **Markdown Rendering**: React-markdown for displaying formatted content

## Backend Architecture
- **Framework**: FastAPI for high-performance async API development
- **API Design**: RESTful endpoints with `/upload` for file handling and `/generate` for document creation
- **File Processing**: Multi-format document parsing supporting PDF (PyMuPDF), DOCX (python-docx), and text files
- **Citation System**: Automatic page/paragraph numbering for source attribution
- **Data Models**: Pydantic models for request/response validation and type safety

## Document Processing Pipeline
- **Upload Handler**: Saves files to temporary uploads directory with error handling
- **Parser Service**: Extracts text content with citation markers (page numbers for PDFs, paragraph numbers for DOCX)
- **AI Integration**: OpenAI GPT integration for intelligent content generation based on source materials
- **Content Assembly**: Combines parsed documents with user templates to create final reports

## Authentication and Security
- **CORS Configuration**: Wildcard origins for development (should be restricted in production)
- **File Validation**: Basic file type checking and error handling
- **Environment Variables**: OpenAI API key management through environment configuration

# External Dependencies

## AI Services
- **OpenAI GPT API**: Core AI service for content generation and document analysis
- **API Key Management**: Environment variable configuration for secure access

## Document Processing Libraries
- **PyMuPDF (fitz)**: PDF text extraction and page-level content parsing
- **python-docx**: Microsoft Word document processing and paragraph extraction
- **Python built-in libraries**: Text file handling for additional format support

## Frontend Libraries
- **React 18+**: Modern React with hooks for state management
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Axios**: Promise-based HTTP client for API communication
- **React-markdown**: Markdown rendering for formatted content display

## Backend Infrastructure
- **FastAPI**: Modern Python web framework with automatic API documentation
- **Uvicorn**: ASGI server for running the FastAPI application
- **Python-multipart**: File upload handling for multipart form data
- **Pydantic**: Data validation and serialization for API models

## Development Tools
- **ESLint**: JavaScript/React code linting and formatting
- **PostCSS**: CSS processing with Tailwind integration
- **Autoprefixer**: Automatic CSS vendor prefixing