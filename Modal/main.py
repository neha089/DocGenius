from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from qa_chain import process_and_save_doc, ask_question

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print("📁 Received file:", file.filename)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    process_and_save_doc(file_path)
    print("✅ File processed and saved:", file_path)
    return {"message": "File uploaded and processed successfully"}

@app.post("/ask")
async def ask(question: str = Form(...)):
    print("❓ Received question:", question)
    result = ask_question(question)
    print("✅ Answer:", result["answer"])
    return {
        "answer": result["answer"],
        "context_used": result["context"],
        "chunk_count": result["chunks_used"]
    }

@app.get("/")
async def root():
    return {"message": "Hello, World!"}
