# Banco de dados — Ensina Aí (Supabase)

Este diretório contém a parte inicial do **CRM escolar**, independente do frontend gerado pelo Lovable.

## Estrutura

- \`migrations/20261109214500_estrutura_inicial.sql\`: 10 tabelas, FKs, validações, índices, RLS ativada e permissões iniciais.
- \`migrations/20261109214600_politicas_rls.sql\`: políticas de acesso de gestor e atendente e view de indicadores.
- \`migrations/20261109214700_distribuicao_automatica.sql\`: triggers da fila, auditoria e RPC de redistribuição.
- \`seed.sql\`: séries escolares ilustrativas, sem dados pessoais.
- \`tests/smoke.sql\`: verificação básica da estrutura e RLS.

## Aplicação em um projeto Supabase

1. Crie/identifique o **projeto Supabase destinado a este CRM** e faça backup antes de aplicar em uma base que já contenha tabelas.
2. No **SQL Editor**, execute os três arquivos de \`migrations/\` **uma única vez**, em ordem crescente, ou use o fluxo oficial do Supabase CLI (\`supabase db push\`) após vincular o projeto.
3. Execute \`seed.sql\` se desejar carregar a nomenclatura inicial das séries.
4. Execute \`tests/smoke.sql\` e confira a mensagem de sucesso.
5. Em **Authentication > Users**, crie os usuários reais da equipe (1 gestor, 3 atendentes).
6. Depois de criados os usuários, cadastre os perfis via SQL Editor, substituindo os UUIDs reais:

\`\`\`sql
insert into public.perfis (id, nome, papel, disponivel)
values
  ('UUID_DO_GESTOR', 'Gestor', 'gestor', false),
  ('UUID_ATENDENTE_1', 'Atendente 1', 'atendente', true),
  ('UUID_ATENDENTE_2', 'Atendente 2', 'atendente', true),
  ('UUID_ATENDENTE_3', 'Atendente 3', 'atendente', true);
\`\`\`

7. Confirme os turnos e os dados da escola antes de cadastrá-los. Configure login no Lovable e conecte o projeto via URL + chave **publishable**.
8. Faça os cenários de teste do arquivo \`tests/smoke.sql\` com perfis de teste, antes de cadastrar dados reais.

**Atenção:** Esses arquivos estão versionados no GitHub; **isso não significa que as migrations já foram executadas no projeto Supabase**. Não aplique migrations em um projeto existente sem verificar se há conflitos de nomes.

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
