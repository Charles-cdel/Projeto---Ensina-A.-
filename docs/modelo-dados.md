# Modelo de dados v0.1 — CRM escolar Ensina Aí

A escola recebe interessados via **WhatsApp** (inclusive a partir do Instagram), **site** e **atendimento presencial**. Há **3 atendentes** e **1 gestor**. A ferramenta web será feita no **Lovable**; o banco fica no **Supabase** e a automação/IA no **n8n**.

## Relacionamentos

\`\`\`mermaid
erDiagram
  AUTH_USERS ||--o| PERFIS : "possui"
  PERFIS ||--o{ LEADS : "cadastra"
  SERIES_ESCOLARES ||--o{ LEADS : "interesse"
  TURNOS ||--o{ LEADS : "interesse"
  LEADS ||--|| ATENDIMENTOS : "gera"
  PERFIS |o--o{ ATENDIMENTOS : "responsavel"
  ATENDIMENTOS ||--o{ INTERACOES : "registra"
  ATENDIMENTOS ||--o{ HISTORICO_ATRIBUICOES : "audita"
  ATENDIMENTOS ||--o{ VISITAS : "agenda"
  ATENDIMENTOS ||--o{ TAREFAS : "organiza"
  PERFIS |o--o{ TAREFAS : "executa"
\`\`\`

O modelo inicial inclui 10 tabelas próprias em \`public\` e usa \`auth.users\` do Supabase Auth. A view \`v_dashboard_atendimentos\` resume atendimentos por responsável e status, respeitando RLS.

| Tabela | Responsabilidade |
|---|---|
| \`perfis\` | Gestor/atendentes, disponibilidade e desempate |
| \`series_escolares\` | Séries e níveis de ensino |
| \`turnos\` | Turnos cadastrados pela escola |
| \`informacoes_escola\` | Conteúdo institucional consultável pelo agente |
| \`leads\` | Responsável, aluno, interesse, canal e consentimento |
| \`atendimentos\` | Etapa do funil e responsável atual |
| \`interacoes\` | Conversas, ligações, notas e automações |
| \`historico_atribuicoes\` | Trilho de auditoria das trocas de responsável |
| \`visitas\` | Agenda de visitas |
| \`tarefas\` | Pendências e próximos contatos |

## Fluxo

1. Um formulário, atendente ou automação registra um lead. Formulário público deverá chamar backend autenticado; não usar a chave privilegiada no navegador.
2. Trigger cria automaticamente um atendimento e escolhe menor carga entre atendentes disponíveis.
3. O atendente acompanha sua carteira, registra interações e organiza visitas/tarefas.
4. O gestor acompanha a fila, ativa/desativa disponibilidade e pode redistribuir via RPC.
5. O dashboard usa os atendimentos, sem duplicar os números em tabelas separadas.

## Campos e privacidade

\`leads\` separa \`nome_responsavel\` (contato) de \`nome_aluno\` e \`idade_aluno\` (opcionais). Evite coletar documentos, dados médicos ou outras informações desnecessárias. \`canal\` é a origem de aquisição e \`consentimento_contato\` indica aceitação quando aplicável.

Em produção será preciso definir: política de privacidade, período de retenção, remoção de dados, controles de acesso de usuários desligados, proteção do webhook e rotina de backup. Nenhum dado pessoal de alunos/responsáveis deve ficar no GitHub.

## Próximas integrações

- **Lovable:** Auth, leitura das tabelas e funções de operação interna. Publicar somente URL + chave publishable.
- **n8n:** consulta institucional, registro de leads por ferramenta backend, classificação/avisos e logging de interações.
- **Gestor:** preencher horários, turnos e informações confirmadas da escola antes de responder perguntas com IA.
