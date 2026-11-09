# Ensina Aí — CRM Escolar com Inteligência Artificial

Projeto final da formação em **IA Generativa**. Solução de atendimento e acompanhamento de interessados em matrícula escolar, com **Lovable (aplicação web)**, **Supabase (banco de dados e autenticação)** e **n8n (agente de IA e automações)**.

## Status

**Etapa 1 — estrutura inicial do banco de dados versionada.** O frontend, as automações e a implantação do banco serão integrados nas próximas etapas.

## Pastas

\`\`\`text
supabase/
├── migrations/
│   ├── 20261109214500_estrutura_inicial.sql
│   ├── 20261109214600_politicas_rls.sql
│   └── 20261109214700_distribuicao_automatica.sql
├── seed.sql
├── tests/
│   └── smoke.sql
└── README.md
docs/
├── modelo-dados.md
└── integracao-lovable-n8n.md
.env.example
.gitignore
\`\`\`

## O que o banco já modela

- Cadastro de leads e suas origens: WhatsApp, Instagram, site e presencial;
- Séries escolares, turnos e informações da instituição;
- Atendimentos, histórico de interações, visitas e tarefas;
- Distribuição automática entre três atendentes por **menor carga de trabalho**, somente quando disponíveis; desempate por atribuição mais antiga;
- Gestor com permissão de redistribuição e auditoria;
- Políticas de acesso **RLS** para proteger dados pessoais.

**Comece em [supabase/README.md](supabase/README.md)** para instalar e testar. O [modelo de dados](docs/modelo-dados.md) explica os relacionamentos; o [guia de integração](docs/integracao-lovable-n8n.md) orienta a futura conexão com Lovable e n8n.

> Importante: o commit contém **estrutura e migrations**, não dados de produção. Para usar com famílias reais, é preciso configurar o projeto Supabase, validar a segurança do formulário público e as regras de privacidade/LGPD.
