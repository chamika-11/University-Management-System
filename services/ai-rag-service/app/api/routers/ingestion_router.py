from fastapi import APIRouter
router = APIRouter()

@router.post("/")
def ingest_document(file_path: str):
    return {"status": "ingestion_queued", "file": file_path}
