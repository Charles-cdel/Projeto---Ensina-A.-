# Banco de dados — Ensina Aí (Supabase)

Este diretório contém a parte inicial do **CRM escolar**, independente do frontend gerado pelo Lovable.

## Estrutura

- \`migrations/20261109214500_estrutura_inicial.sql\`: 10 tabelas, FKs, validações, índices, RLS ativada e permissões iniciais.
- \`migrations/20261109214600_politicas_rls.sql\`: políticas de acesso de gestor e atendente e view de indicadores.
- \`migrations/20261109214700_distribuicao_automatica.sql\`: triggers da fila, auditoria e RPC de redistribuição.
- \`seed.sql\`: séries escolares ilustrativas, sem dados pessoais.
- \`tests/smoke.sql\`: verificação básica da estrutura e RLS.

## Implantação verificada — 09/11/2026

- Projeto de destino: **Banco de dados - EnsinaA.Í** (`ezghervwmtqcsngwkjvv`), na conexão Supabase **ENSINA-AÍ**.
- As 3 migrations listadas acima **já foram aplicadas com sucesso** no banco remoto. Não executá-las novamente nesse projeto.
- Validação estrutural: **10 tabelas** em `public`, todas com RLS, **25 políticas**, view `v_dashboard_atendimentos` e RPC `redistribuir_atendimento` presentes. A auditoria de segurança retornou **0 alertas**.
- As tabelas estavam vazias no momento da verificação. **Não foram realizados testes de autorização com usuários reais**, distribuição de leads ou fluxo Lovable/n8n.
- O advisor de desempenho apontou **8 FKs sem índice dedicado**; os alertas de índices não utilizados são esperados com banco vazio.

### Atenção ao histórico de migrations

A integração aplicou as migrations sob as versões **20261109223131**, **20261109223133** e **20261109223135** no histórico remoto, enquanto os arquivos usam os prefixos **20261109214500**, **20261109214600** e **20261109214700**. **Não execute `supabase db push` automaticamente** antes de reconciliar cuidadosamente o histórico local e remoto (`supabase migration list` / fluxo oficial de `migration repair`), pois o CLI pode interpretar esses arquivos como pendentes. Preserve os arquivos SQL já versionados.

## Próximos passos

1. Em **Authentication > Users**, crie os usuários da equipe (1 gestor e 3 atendentes) em ambiente de teste.
6. Depois de criados os usuários, cadastre os perfis via SQL Editor, substituindo os UUIDs reais:

\`\`\`sql
insert into public.perfis (id, nome, papel, disponivel)
values
  ('UUID_DO_GESTOR', 'Gestor', 'gestor', false),
  ('UUID_ATENDENTE_1', 'Atendente 1', 'atendente', true),
  ('UUID_ATENDENTE_2', 'Atendente 2', 'atendente', true),
  ('UUID_ATENDENTE_3', 'Atendente 3', 'atendente', true);
\`\`\`

3. Execute `seed.sql` apenas se desejar carregar séries ilustrativas; não foram inseridas séries nessa implantação.
4. Confirme turnos e informações reais da escola antes de preenchê-los. Configure login no Lovable e conecte o projeto usando a URL e a chave **publishable**.
5. Rode `tests/smoke.sql` e execute **testes funcionais** com sessões separadas de gestor e atendentes, verificando visibilidade da carteira, criação de leads, fila, transferência e histórico.
6. Antes de usar dados de famílias reais, valide o fluxo público em backend/Edge Function, controles de abuso e adequação à LGPD.

## Regras de negócio

- Novos leads criam automaticamente um atendimento.
- A distribuição escolhe o atendente **ativo e disponível** com menos atendimentos em aberto.
- Empates: quem recebeu um lead há mais tempo (NULL primeiro).
- Se não houver candidato, o atendimento fica \`aguardando_atribuicao\`.
- **Somente gestor** pode mudar o responsável. A função \`redistribuir_atendimento\` registra a alteração no histórico por trigger.
- O gestor vê toda a operação; cada atendente acessa somente sua carteira.
- Dados de menores não devem ser colocados em seeds, logs ou em um repositório público.

## Cuidados de segurança

O formulário público, o agente n8n e webhooks devem passar por uma **Edge Function/servidor autenticado**, com validação, rate limit e proteção contra abuso. Não conceda \`INSERT\` anônimo direto em \`leads\`, porque a tabela contém dados pessoais. A chave \`secret\` (ou legada \`service_role\`) deve ficar só no ambiente de backend/n8n, nunca no Lovable. Configure regras de retenção, consentimento, acesso e exclusão de dados conforme a LGPD antes do uso com famílias reais.
