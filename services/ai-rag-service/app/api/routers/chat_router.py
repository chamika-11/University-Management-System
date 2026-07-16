from fastapi import APIRouter
router = APIRouter()

@router.post("/")
def chat_query(query: str):
    return {"response": "This is a placeholder grounded response.", "sources": []}
