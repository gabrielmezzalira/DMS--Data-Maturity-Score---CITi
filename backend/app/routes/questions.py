from fastapi import APIRouter
from app.database import get_db
from app.schemas import Question

router = APIRouter()


@router.get("/questions", response_model=list[Question])
def list_questions():
    db = get_db()
    result = (
        db.table("dms_questions")
        .select("*")
        .eq("ativa", True)
        .order("ordem")
        .execute()
    )
    return result.data
