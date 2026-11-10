# Ensina Aí — CRM Escolar com Inteligência Artificial

Projeto final da formação em **IA Generativa**. Solução de atendimento e acompanhamento de interessados em matrícula escolar, com **Lovable (aplicação web)**, **Supabase (banco de dados e autenticação)** e **n8n (agente de IA e automações)**.

## Status

**Etapa 1 — banco de dados implantado no Supabase em 09/11/2026.** As 3 migrations foram aplicadas ao projeto `Banco de dados - EnsinaA.Í` (`ezghervwmtqcsngwkjvv`) e a estrutura foi verificada: 10 tabelas com RLS habilitada, 25 políticas, função de redistribuição e view de indicadores. Nenhum alerta no advisor de segurança. Ainda faltam criar usuários da equipe, testar os fluxos com sessões reais e conectar a aplicação Lovable e as automações n8n.

## Pastas

\`\`\`text
supabase/
├── migrations/
│   ├── 20261109223131_20261109214500_estrutura_inicial.sql
│   ├── 20261109223133_20261109214600_politicas_rls.sql
│   └── 20261109223135_20261109214700_distribuicao_automatica.sql
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

**Comece em [supabase/README.md](supabase/README.md)** para conferir o status da implantação e preparar os testes de autenticação. O [modelo de dados](docs/modelo-dados.md) explica os relacionamentos; o [guia de integração](docs/integracao-lovable-n8n.md) orienta a futura conexão com Lovable e n8n.

> Importante: o commit contém **estrutura e migrations**, não dados de produção. O Supabase já recebeu as migrations; antes de usar dados de famílias reais, é preciso criar e testar as contas da equipe, validar o formulário público e definir as regras de privacidade/LGPD.
