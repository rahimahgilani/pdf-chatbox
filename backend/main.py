import os
from pydantic import BaseModel
from app.pdf_processor import pdf_chunking
from app.rag_chain import rag_chain_pipeline
from fastapi import FastAPI, UploadFile, File
from app.vector_store import create_vector_store, load_vector_store

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "data", "uploads")

class Prompt(BaseModel):
    message: str

@app.post("/upload")
async def create_upload_file(file: UploadFile):
    if file.content_type != "application/pdf":
        return {"error": "Invalid file type. Please upload a PDF file."}
    if file.filename == "":
        return {"error": "No file uploaded. Please select a PDF file to upload."}
    contents = await file.read()
    save_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(save_path, "wb") as f:
        f.write(contents)

    chunks = pdf_chunking(save_path)
    vector_store = create_vector_store(chunks)
    return {"message": "File uploaded and processed successfully."}

@app.post("/chat")
async def chat_response(prompt: Prompt): 
    if prompt.message == "":
        return {"error": "No prompt. Please enter text."}

    vector_store = load_vector_store()

    response = rag_chain_pipeline(vector_store, prompt.message)
    return response
