# Overview

AI-Powered Template Generation Engine is a comprehensive full-stack application that enables users to upload multimodal documents (PDF, DOCX, XLSX, PPTX, TXT) and generate evidence-backed reports using AI. The system features an enhanced conversational interface with AI-powered scope clarification, customizable tone and style settings, and real-time preview with advanced export capabilities including PowerPoint generation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with Vite as the build tool
- **Styling**: Tailwind CSS for utility-first styling with custom Inter font
- **Component Structure**: Enhanced split-view layout with advanced ChatPanel and PreviewPanel
- **Advanced Features**: Tone/style selection, AI clarifying questions, file management with delete functionality
- **HTTP Client**: Axios for API communication with the backend
- **Export Capabilities**: Multi-format export (PDF, DOCX, PPTX) with enhanced formatting
- **Markdown Rendering**: React-markdown with custom citation rendering and enhanced styling

## Backend Architecture
- **Framework**: FastAPI for high-performance async API development
- **API Design**: Comprehensive RESTful endpoints including `/upload`, `/generate`, `/clarify`, `/export/pptx`, `/files`, and health checks
- **Multimodal Processing**: Advanced document parsing supporting PDF, DOCX, XLSX, PPTX, and text files
- **AI Integration**: Enhanced OpenAI integration with tone and style customization
- **Citation System**: Comprehensive citation tracking across all file types (pages, slides, sheets, paragraphs)
- **Data Models**: Enhanced Pydantic models supporting tone, style, and advanced template structures

## Document Processing Pipeline
- **Enhanced Upload Handler**: Supports multiple file formats with validation and file management
- **Advanced Parser Service**: Multi-format parsing with format-specific citation tracking
- **AI Services**: OpenAI GPT integration with tone/style customization and clarifying questions
- **Content Assembly**: Advanced template processing with real-time preview and multiple export formats
- **PowerPoint Generation**: Automated PPTX creation from generated content with proper formatting

## Authentication and Security
- **CORS Configuration**: Wildcard origins for development (should be restricted in production)
- **File Validation**: Basic file type checking and error handling
- **Environment Variables**: OpenAI API key management through environment configuration

# Enhanced Features Implemented

## Core Requirements Fulfilled
✅ **Multimodal Input Support**: PDF, DOCX, XLSX, PPTX, TXT files with comprehensive parsing
✅ **Dynamic Template Engine**: Real-time conversational template modification and management
✅ **Evidence-Backed Outputs**: All content includes proper citations with source tracking
✅ **Scope Clarification**: AI-powered clarifying questions to improve document quality
✅ **Traceability**: Complete mapping between source content and generated sections
✅ **Multiple Output Formats**: PDF, DOCX, and PPTX export capabilities
✅ **Tone and Style Customization**: Professional, casual, formal, technical, and persuasive tones
✅ **Advanced UI**: Enhanced dashboard with file management and template visualization

## Brownie Points Achieved
🏆 **PowerPoint Support**: Both input parsing and output generation for PPTX files
🏆 **Enhanced Citations**: Comprehensive source grounding with format-specific references

# External Dependencies

## AI Services
- **OpenAI GPT API**: Advanced AI service with tone and style customization
- **API Key Management**: Environment variable configuration for secure access

## Document Processing Libraries
- **PyMuPDF (fitz)**: PDF text extraction and page-level content parsing
- **python-docx**: Microsoft Word document processing and paragraph extraction
- **python-pptx**: PowerPoint processing for both input parsing and output generation
- **openpyxl**: Excel file processing with sheet and cell-level parsing
- **Pillow**: Image processing for enhanced document handling
- **Python built-in libraries**: Text file handling for additional format support

## Frontend Libraries
- **React 18+**: Modern React with advanced hooks for state management
- **Vite**: Fast development server and build tool with enhanced configuration
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Axios**: Promise-based HTTP client for API communication
- **React-markdown**: Enhanced markdown rendering with custom citation components
- **jsPDF**: Client-side PDF generation
- **docx**: Advanced Word document generation with formatting
- **file-saver**: File download utility for exports

## Backend Infrastructure
- **FastAPI**: Modern Python web framework with automatic API documentation
- **Uvicorn**: ASGI server for running the FastAPI application
- **Python-multipart**: File upload handling for multipart form data
- **Pydantic**: Data validation and serialization for API models

## Development Tools
- **ESLint**: JavaScript/React code linting and formatting
- **PostCSS**: CSS processing with Tailwind integration
- **Autoprefixer**: Automatic CSS vendor prefixing