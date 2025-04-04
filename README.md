# 📄 DocGenius AI - Intelligent Document Q&A System

DocGenius AI is an AI-powered document understanding system that allows users to upload documents and ask questions in natural language. The system processes documents, generates embeddings, and retrieves context-aware responses using advanced AI models.

## Flow Diagram

![Image](https://github.com/user-attachments/assets/c6e0e958-5825-42f8-9490-ff35536fc2e2)
---

## 📌 Features
✅ **Automated Documentation Ingestion** (Supports PDF, DOCX, TXT, HTML)  
✅ **AI-Powered Q&A Interface** (Natural language interactions with documentation)  
✅ **Contextual Understanding** (Session memory for seamless interactions)  
✅ **API & Third-Party Integration** (REST API for embedding into applications)  
✅ **Multi-Language Support** (For global accessibility)  

---

## 🏗️ System Architecture

Below is an overview of the system's architecture:  

![Architecture Diagram](./docs/image.png)  



---

## 🛠️ Tech Stack

### **Frontend (User Interaction Layer)**
- React.js 
- Tailwind CSS / Material UI (Styling)
- Axios (API requests)

### **Backend (Application Layer)**
- Node.js (Express.js) / Python (FastAPI)
- JWT for authentication
- LangChain for AI-driven processing



### **Database (Storage Layer)**
-  MongoDB for user data
- Redis for caching
- faiss
- S3 / Local Storage for document uploads

---

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/neha089/DocGenius.git
cd DocGenius

# Backend
cd Server
npm install
npm start

# Frontend
cd Client
npm install
npm run dev

#modal
cd Modal
uvicorn main:app --reload --port 8000

