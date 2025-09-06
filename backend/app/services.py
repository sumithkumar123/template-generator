import os
from openai import OpenAI
import docx
import fitz  # PyMuPDF

# --- Configuration ---
# IMPORTANT: Set your OpenAI API key in your environment variables.
# For a hackathon, you can temporarily hardcode it here, but it's not recommended.
# client = OpenAI(api_key="YOUR_OPENAI_API_KEY")
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
UPLOAD_DIRECTORY = "uploads"


def parse_document(filename: str) -> str:
    """
    Parses the content of an uploaded file (PDF or DOCX).
    Adds citation markers for page/paragraph numbers.
    """
    filepath = os.path.join(UPLOAD_DIRECTORY, filename)
    content_parts = []
    
    try:
        if filename.lower().endswith(".pdf"):
            doc = fitz.open(filepath)
            for page_num, page in enumerate(doc):
                text = page.get_text("text")
                if text.strip():
                    content_parts.append(f"[START PAGE {page_num + 1}]\n{text}\n[END PAGE {page_num + 1}]")
            doc.close()
        
        elif filename.lower().endswith(".docx"):
            doc = docx.Document(filepath)
            for para_num, para in enumerate(doc.paragraphs):
                if para.text.strip():
                    content_parts.append(f"[START PARA {para_num + 1}]\n{para.text}\n[END PARA {para_num + 1}]")

        else:
            # Simple text file fallback
            with open(filepath, 'r', encoding='utf-8') as f:
                content_parts.append(f.read())
                
    except Exception as e:
        print(f"Error parsing {filename}: {e}")
        return f"Error parsing file: {filename}"

    return "\n".join(content_parts)


def generate_report_section(section_title: str, context: str) -> str:
    """
    Calls the AI model to generate content for a specific section of the template.
    This function embodies the core AI logic.
    """
    system_prompt = """
    You are a world-class business consultant and your task is to generate a section of a report.
    - You will be given a section title and the full context from source documents.
    - Your response MUST be based ONLY on the provided context.
    - You MUST include evidence-backed citations after every statement or claim.
    - Citations should reference the source, like this: [cite: filename, page X] or [cite: filename, para X].
    - The response should be in well-structured Markdown format.
    """
    
    user_prompt = f"""
    Generate the content for the section: "{section_title}".

    Here is the full context from the source documents:
    ---
    {context}
    ---
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # Use a powerful model for high-quality output
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return f"Error generating section: {section_title}"


def create_final_document(template: list[str], filenames: list[str]) -> str:
    """
    Orchestrates the document creation process.
    1. Parses all source files to create a combined context.
    2. Iterates through the template sections, generating content for each.
    3. Assembles the final report.
    """
    # 1. Create Combined Context
    full_context = []
    for filename in filenames:
        parsed_text = parse_document(filename)
        full_context.append(f"[START DOCUMENT: {filename}]\n{parsed_text}\n[END DOCUMENT: {filename}]")
    
    combined_context = "\n\n".join(full_context)
    
    # 2. Generate Each Section
    document_parts = []
    for section in template:
        # Add section title
        document_parts.append(f"## {section}\n")
        
        # Generate section content
        section_content = generate_report_section(section, combined_context)
        document_parts.append(section_content)
        document_parts.append("\n---\n") # Separator
        
    return "\n".join(document_parts)
