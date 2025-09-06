import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List

from .services import create_final_document, ask_clarifying_questions, export_to_pptx
from .models import GenerateRequest, GenerateResponse, ClarifyRequest, ClarifyResponse

router = APIRouter()
UPLOAD_DIRECTORY = "uploads"

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Handles file uploads. Saves files to the 'uploads' directory.
    Supports PDF, DOCX, XLSX, XLS, PPTX files.
    """
    filenames = []
    supported_extensions = ['.pdf', '.docx', '.xlsx', '.xls', '.pptx', '.txt']
    
    for file in files:
        # Check file extension
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in supported_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type: {file.filename}. Supported types: {', '.join(supported_extensions)}"
            )
        
        file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        try:
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())
            filenames.append(file.filename)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Could not save file: {file.filename}. Error: {e}")
            
    return JSONResponse(content={"filenames": filenames, "message": f"Successfully uploaded {len(filenames)} files"}, status_code=200)


@router.post("/generate", response_model=GenerateResponse)
async def generate_document_endpoint(request: GenerateRequest):
    """
    Enhanced endpoint to generate the document with tone and style support.
    """
    try:
        final_document = create_final_document(
            template=request.template, 
            filenames=request.filenames,
            tone=request.tone,
            style=request.style
        )
        return GenerateResponse(document=final_document)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate document. Error: {e}")


@router.post("/clarify", response_model=ClarifyResponse)
async def get_clarifying_questions(request: ClarifyRequest):
    """
    AI-powered endpoint to generate clarifying questions based on template and files.
    """
    try:
        questions = ask_clarifying_questions(
            template=request.template,
            filenames=request.filenames
        )
        return ClarifyResponse(questions=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate clarifying questions. Error: {e}")


@router.get("/files")
async def list_uploaded_files():
    """
    Lists all currently uploaded files.
    """
    try:
        files = []
        if os.path.exists(UPLOAD_DIRECTORY):
            for filename in os.listdir(UPLOAD_DIRECTORY):
                file_path = os.path.join(UPLOAD_DIRECTORY, filename)
                if os.path.isfile(file_path):
                    file_size = os.path.getsize(file_path)
                    files.append({
                        "name": filename,
                        "size": file_size,
                        "type": os.path.splitext(filename)[1].lower()
                    })
        return JSONResponse(content={"files": files}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list files. Error: {e}")


@router.delete("/files/{filename}")
async def delete_file(filename: str):
    """
    Deletes a specific uploaded file.
    """
    try:
        file_path = os.path.join(UPLOAD_DIRECTORY, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            return JSONResponse(content={"message": f"File {filename} deleted successfully"}, status_code=200)
        else:
            raise HTTPException(status_code=404, detail=f"File {filename} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file. Error: {e}")


@router.post("/export/pptx")
async def export_document_to_pptx(request: GenerateRequest):
    """
    Exports the generated document to PowerPoint format.
    """
    try:
        # First generate the document
        document_content = create_final_document(
            template=request.template, 
            filenames=request.filenames,
            tone=request.tone,
            style=request.style
        )
        
        # Then export to PPTX
        pptx_path = export_to_pptx(document_content, "generated_report")
        filename = os.path.basename(pptx_path)
        
        return JSONResponse(content={
            "message": "PowerPoint presentation generated successfully",
            "filename": filename,
            "path": pptx_path
        }, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export to PowerPoint. Error: {e}")


@router.get("/health")
async def health_check():
    """
    Health check endpoint to verify API status.
    """
    return JSONResponse(content={"status": "healthy", "message": "AI Template Generation Engine API is running"}, status_code=200)