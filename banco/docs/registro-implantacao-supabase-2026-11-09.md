# Registro de implantação — CRM Ensina Aí / Supabase

**Data da implantação:** 09/11/2026  
**Projeto Supabase:** `Banco de dados - EnsinaA.Í`  
**Project ref:** `ezghervwmtqcsngwkjvv`  
**Repositório:** `Charles-cdel/Projeto---Ensina-A.-`  
**Ambiente:** projeto Supabase remoto; aplicação Lovable e n8n ainda não validadas de ponta a ponta

## 1. Objetivo

Registrar a primeira implantação do banco PostgreSQL do CRM escolar Ensina Aí, cujo código-fonte SQL já estava versionado em `supabase/migrations/`.

## 2. Migrations aplicadas

As três migrations existentes foram aplicadas ao projeto remoto, em sequência, e retornaram sucesso.

| Arquivo do repositório | Versão registrada no banco |
| --- | --- |
| `20261109223131_20261109214500_estrutura_inicial.sql` | `20261109223131` |
| `20261109223133_20261109214600_politicas_rls.sql` | `20261109223133` |
| `20261109223135_20261109214700_distribuicao_automatica.sql` | `20261109223135` |

**Correção preparada em GitHub:** os arquivos receberam prefixos iguais às versões registradas remotamente; os nomes originais foram preservados após o segundo `_`. O SQL é o mesmo, nenhuma migration foi reaplicada e o banco remoto não foi modificado. Confirme o status do check **Supabase Preview** após mesclar o PR de correção. Não execute `supabase db push` sem revisar `supabase migration list`.

## 3. Estrutura implantada

**Dez tabelas em `public`:**

- `perfis` — gestor e atendentes vinculados a `auth.users`;
- `series_escolares` e `turnos` — catálogos de oferta;
- `informacoes_escola` — dados institucionais;
- `leads` — interessados na matrícula;
- `atendimentos` — carteira, responsável e status;
- `interacoes` — histórico de contato;
- `historico_atribuicoes` — auditoria de atribuições;
- `visitas` — visitas à escola;
- `tarefas` — pendências do atendimento.

A implantação também inclui políticas RLS, triggers, a view `v_dashboard_atendimentos` com `security_invoker` e o RPC `redistribuir_atendimento(uuid, uuid, text)`.

### Distribuição híbrida prevista pelo código

Ao cadastrar um lead, um trigger cria o atendimento e atribui um atendente ativo e disponível com menor quantidade de atendimentos em aberto; o desempate usa a atribuição mais antiga. Se ninguém estiver disponível, o atendimento fica aguardando atribuição. O gestor pode redistribuir via RPC e o histórico da atribuição é registrado.

**Essa regra foi implantada, mas ainda necessita de testes funcionais com sessões e perfis reais.**

## 4. Evidências da verificação

Uma consulta à estrutura e aos metadados do banco retornou:

| Item | Resultado |
| --- | --- |
| Tabelas em `public` | 10 |
| Tabelas com RLS habilitada | 10 |
| Políticas RLS | 25 |
| Triggers da aplicação | 10 |
| RPC de redistribuição | Presente |
| View de indicadores | Presente |
| Grants de tabelas do CRM ao papel `anon` | 0 |
| Alertas do advisor de segurança | 0 |
| Registros nas tabelas do CRM no momento da conferência | 0 |

O advisor de performance encontrou **8 chaves estrangeiras sem índices dedicados** e **10 índices ainda não utilizados** (o banco estava vazio). Avaliar os índices à medida que forem implementadas consultas e cargas reais; não remover índices simplesmente por ausência de uso em banco recém-criado.

## 5. O que permanece pendente

- [ ] Criar usuários de teste em Supabase Auth: um gestor e três atendentes.
- [ ] Cadastrar os perfis vinculados aos UUIDs de Auth, sem criar dados pessoais fictícios no repositório.
- [ ] Executar `supabase/tests/smoke.sql` e registrar o resultado.
- [ ] Testar com usuários autenticados: isolamento da carteira por RLS, gestão e impedimento de acesso anônimo.
- [ ] Testar lead novo, distribuição por menor carga, ausência de atendente disponível e redistribuição pelo gestor.
- [x] Alinhar prefixos dos arquivos às versões do histórico remoto; validar resultado do check Supabase Preview após o merge.
- [ ] Confirmar catálogo de séries, turnos e dados da escola antes de carregar `seed.sql`.
- [ ] Integrar a aplicação Lovable usando somente a chave publicável e autenticação apropriada.
- [ ] Integrar n8n/webhooks por backend ou Edge Function segura (sem chave secreta no frontend).
- [ ] Revisar LGPD, consentimento, retenção, controle de abuso e acesso aos dados de menores antes da produção.

## 6. Referências do repositório

- [Estrutura e migrations](../supabase/README.md)
- [Modelo de dados](modelo-dados.md)
- [Guia Lovable/n8n](integracao-lovable-n8n.md)

> Este registro documenta o que foi verificado no momento da implantação; não equivale a aprovação de segurança para uso em produção com dados de famílias.
