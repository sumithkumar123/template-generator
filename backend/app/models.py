from pydantic import BaseModel
from typing import List

class GenerateRequest(BaseModel):
    """
    Defines the structure for the /generate API request.
    """
    template: List[str]
    filenames: List[str]

class GenerateResponse(BaseModel):
    """
    Defines the structure for the /generate API response.
    """
    document: str
