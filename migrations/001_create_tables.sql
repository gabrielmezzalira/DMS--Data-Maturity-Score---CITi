create table if not exists dms_questions (
    id text primary key,
    bloco text not null,
    ordem int not null,
    pergunta text not null,
    subtexto text,
    opcoes jsonb not null,
    versao int not null default 1,
    ativa bool not null default true
);

create table if not exists dms_submissions (
    id uuid primary key,
    empresa text not null,
    contato_nome text not null,
    contato_email text not null,
    contato_cargo text not null,
    respostas jsonb not null,
    nivel_infraestrutura int not null,
    nivel_governanca int not null,
    nivel_cultura int not null,
    nivel_ia int not null,
    nivel_fundacao int not null,
    nivel_prontidao int not null,
    nivel_final int not null,
    red_flags jsonb not null default '[]',
    versao_questionario int not null default 1,
    origem text,
    created_at timestamptz not null default now()
);
