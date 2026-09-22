from pydantic import BaseModel, field_validator
from typing import Optional


class SubmissionRequest(BaseModel):
    empresa: str
    contato_nome: str
    contato_email: str
    contato_cargo: str
    respostas: dict[str, int]

    @field_validator("respostas")
    @classmethod
    def validate_respostas(cls, v: dict[str, int]) -> dict[str, int]:
        expected = {f"q{i}" for i in range(1, 21)}
        if set(v.keys()) != expected:
            raise ValueError("Todas as 20 respostas são obrigatórias (q1 a q20)")
        for key, val in v.items():
            if val not in (1, 2, 3, 4):
                raise ValueError(f"{key}: resposta deve ser 1, 2, 3 ou 4")
        return v


class DimensionProfile(BaseModel):
    infraestrutura: int
    governanca: int
    cultura: int
    ia: int


class SubmissionResult(BaseModel):
    id: str
    nivel_final: int
    nivel_fundacao: int
    nivel_prontidao: int
    perfil: DimensionProfile
    created_at: str


class QuestionOption(BaseModel):
    valor: int
    label: str


class Question(BaseModel):
    id: str
    bloco: str
    ordem: int
    pergunta: str
    subtexto: Optional[str]
    opcoes: list[QuestionOption]
    versao: int
