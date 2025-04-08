# qa_chain.py
import os
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
from typing import Optional
from transformers import pipeline

UPLOAD_DIR = "uploads/"
VECTOR_DIR = "vectorstore/"

# Use free HuggingFace embedding model
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# QA pipeline using HuggingFace transformers (DistilBERT)
qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

def process_and_save_doc(file_path):
    loader = PyMuPDFLoader(file_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(documents)

    vectorstore = FAISS.from_documents(chunks, embedding_model)
    vectorstore.save_local(VECTOR_DIR)

def load_retriever():
    vectorstore = FAISS.load_local(VECTOR_DIR, embedding_model, allow_dangerous_deserialization=True)
    return vectorstore.as_retriever()

def ask_question(query: str):
    retriever = load_retriever()
    relevant_docs = retriever.get_relevant_documents(query)

    # Concatenate all context chunks for the QA pipeline
    context = "\n".join([doc.page_content for doc in relevant_docs])
    
    # Limit context to 1000 tokens (for smaller models)
    context = context[:1000]

    result = qa_pipeline({
        'context': context,
        'question': query
    })

    return result['answer']
