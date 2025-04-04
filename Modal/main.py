from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS config (allow frontend & backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Model API is running 🚀"}

