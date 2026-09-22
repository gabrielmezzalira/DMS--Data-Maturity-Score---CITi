import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.schemas import SubmissionRequest, SubmissionResult
from app.calculator import calculate

router = APIRouter()


@router.post("/submissions", response_model=SubmissionResult, status_code=201)
def create_submission(body: SubmissionRequest):
    calc = calculate(body.respostas)
    submission_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    db = get_db()
    db.table("dms_submissions").insert({
        "id": submission_id,
        "empresa": body.empresa,
        "contato_nome": body.contato_nome,
        "contato_email": body.contato_email,
        "contato_cargo": body.contato_cargo,
        "respostas": body.respostas,
        "nivel_infraestrutura": calc["nivel_infraestrutura"],
        "nivel_governanca": calc["nivel_governanca"],
        "nivel_cultura": calc["nivel_cultura"],
        "nivel_ia": calc["nivel_ia"],
        "nivel_fundacao": calc["nivel_fundacao"],
        "nivel_prontidao": calc["nivel_prontidao"],
        "nivel_final": calc["nivel_final"],
        "red_flags": calc["red_flags"],
        "created_at": now,
    }).execute()

    return SubmissionResult(
        id=submission_id,
        nivel_final=calc["nivel_final"],
        nivel_fundacao=calc["nivel_fundacao"],
        nivel_prontidao=calc["nivel_prontidao"],
        perfil={
            "infraestrutura": calc["nivel_infraestrutura"],
            "governanca": calc["nivel_governanca"],
            "cultura": calc["nivel_cultura"],
            "ia": calc["nivel_ia"],
        },
        created_at=now,
    )


@router.get("/submissions/{submission_id}", response_model=SubmissionResult)
def get_submission(submission_id: str):
    db = get_db()
    result = (
        db.table("dms_submissions")
        .select("*")
        .eq("id", submission_id)
        .maybe_single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Preenchimento não encontrado")
    row = result.data
    return SubmissionResult(
        id=row["id"],
        nivel_final=row["nivel_final"],
        nivel_fundacao=row["nivel_fundacao"],
        nivel_prontidao=row["nivel_prontidao"],
        perfil={
            "infraestrutura": row["nivel_infraestrutura"],
            "governanca": row["nivel_governanca"],
            "cultura": row["nivel_cultura"],
            "ia": row["nivel_ia"],
        },
        created_at=row["created_at"],
    )
