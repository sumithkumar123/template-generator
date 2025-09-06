from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router as api_router

app = FastAPI(
    title="AI-Powered Template Generation Engine",
    description="Hackathon project to generate evidence-backed reports from source documents.",
    version="1.0.0"
)

# --- Middleware ---
# This is crucial for allowing the React frontend to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers to frontend
    allow_origin_regex="http://localhost:.*"  # Allow localhost origins for frontend dev
)

# --- Routes ---
app.include_router(api_router, prefix="/api")

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the AI Template Generation Engine API"}
