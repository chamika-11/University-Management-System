from fastapi import FastAPI
from app.api.routers import chat_router, ingestion_router

app = FastAPI(title="ULMS AI Assistant & RAG Service")

@app.get("/health")
def health():
    return {"status": "UP", "service": "ai-rag-service"}

app.include_router(chat_router.router, prefix="/api/v1/ai/chat", tags=["AI Chat"])
app.include_router(ingestion_router.router, prefix="/api/v1/ai/ingest", tags=["Document Ingestion"])
