import os
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.llms import CTransformers

UPLOAD_DIR = "uploads/"
VECTOR_DIR = "vectorstore/"

# Use free HuggingFace embedding model
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Load LLaMA model using ctransformers
llm = CTransformers(
    model="D:/TalkEase/TalkEase/model/saved_model/llama-2-7b-chat.Q4_K_M.gguf",  # ⬅️ Update this path
    model_type="llama",
    config={"max_new_tokens": 512, "temperature": 0.7}
)

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

    print("\n🔍 Top Relevant Chunks:")
    for idx, doc in enumerate(relevant_docs):
        print(f"\n--- Chunk {idx+1} ---")
        print(doc.page_content[:300])
        print("Metadata:", doc.metadata)

    # Prepare full context
    context = "\n".join([doc.page_content for doc in relevant_docs])
    context = context[:2000]  # LLaMA context limit

    print("\n📄 Final Context Sent to LLaMA:")
    print(context)

    # Format prompt for LLaMA
    prompt = f"""### Context:\n{context}\n\n### Question:\n{query}\n\n### Answer:"""

    response = llm(prompt)
    return {
        "answer": response.strip(),
        "context": context,
        "chunks_used": len(relevant_docs)
    }
