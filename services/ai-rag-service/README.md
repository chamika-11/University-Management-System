# AI/RAG Service (Python)

FastAPI service handling context-grounded Q&A, syllabus parsing, and academic assistance.

## Key Stack Components
- **Framework:** FastAPI
- **LLM Orchestration:** LangChain / LlamaIndex
- **Vector DB Client:** Qdrant Client
- **Background Tasks:** Celery + Redis (for ingestion tasks)
- **Primary Cache:** Redis

## Processing Flow
1. Receives `ContentPublished` events (triggered by course file updates).
2. Background Celery workers fetch the PDF/Markdown from MinIO/S3.
3. Documents are parsed, chunked, and embedded using SentenceTransformers or OpenAI embeddings.
4. Vector vectors are upserted into Qdrant namespaces.
5. Inquiries hitting `/api/v1/ai/chat` query Qdrant for semantic match, format prompt context, and query the LLM.
