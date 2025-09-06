from pydantic import BaseModel
from typing import List, Optional

class GenerateRequest(BaseModel):
    """
    Enhanced structure for the /generate API request with tone and style support.
    """
    template: List[str]
    filenames: List[str]
    tone: Optional[str] = "professional"
    style: Optional[str] = "analytical"

class GenerateResponse(BaseModel):
    """
    Defines the structure for the /generate API response.
    """
    document: str

class ClarifyRequest(BaseModel):
    """
    Request model for getting clarifying questions.
    """
    template: List[str]
    filenames: List[str]

class ClarifyResponse(BaseModel):
    """
    Response model for clarifying questions.
    """
    questions: str

class TemplateSection(BaseModel):
    """
    Model for individual template sections with ordering.
    """
    title: str
    order: int
    description: Optional[str] = None

class EnhancedTemplateRequest(BaseModel):
    """
    Enhanced template structure for better organization.
    """
    sections: List[TemplateSection]
    global_tone: Optional[str] = "professional"
    global_style: Optional[str] = "analytical"
    target_audience: Optional[str] = None
    purpose: Optional[str] = None