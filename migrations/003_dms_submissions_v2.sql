-- Substitui o modelo de dms_submissions das migrations 001/002 (4 dimensões, escala 1-5),
-- que ficou obsoleto e nunca chegou a ser usado pelo frontend atual.
-- Modelo atual: 7 pilares, score 0-100, calculado no client (frontend/src/lib/scoring.ts).

create extension if not exists pgcrypto;

create table if not exists dms_submissions (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    email text not null,
    empresa text not null,
    cargo text not null,
    setor text not null,
    porte text not null,
    respostas jsonb not null,
    score_por_pilar jsonb not null,
    score_fundacao int not null,
    score_prontidao int not null,
    score_final int not null,
    faixa text not null,
    created_at timestamptz not null default now()
);

alter table dms_submissions enable row level security;

-- O client grava direto do browser com a chave anon: só INSERT, nunca leitura/edição.
create policy "dms_submissions_insert_anon"
    on dms_submissions
    for insert
    to anon
    with check (true);
