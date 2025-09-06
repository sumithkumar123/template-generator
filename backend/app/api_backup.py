import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List

from .services import create_final_document
from .models import GenerateRequest, GenerateResponse

router = APIRouter()
UPLOAD_DIRECTORY = "uploads"

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Handles file uploads. Saves files to the 'uploads' directory.
    """
    filenames = []
    for file in files:
        file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        try:
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())
            filenames.append(file.filename)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Could not save file: {file.filename}. Error: {e}")
            
    return JSONResponse(content={"filenames": filenames}, status_code=200)


@router.post("/generate", response_model=GenerateResponse)
async def generate_document_endpoint(request: GenerateRequest):
    """
    The main endpoint to generate the document based on a template and uploaded files.
    """
    try:
        final_document = create_final_document(template=request.template, filenames=request.filenames)
        return GenerateResponse(document=final_document)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate document. Error: {e}")
