import os
class Settings:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ai_rag_db")
    QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
    LLM_API_KEY = os.getenv("LLM_API_KEY", "")
settings = Settings()
