-- Verificação de estrutura e RLS; executar no SQL Editor depois das migrations.
-- É leitura/validação: não cria leads nem modifica dados.
do $$
declare
  tabelas text[] := array[
    'perfis','series_escolares','turnos','informacoes_escola','leads',
    'atendimentos','interacoes','historico_atribuicoes','visitas','tarefas'
  ];
  faltantes text;
  sem_rls text;
begin
  select string_agg(t.nome, ', ') into faltantes
  from unnest(tabelas) as t(nome)
  where to_regclass('public.' || t.nome) is null;
  if faltantes is not null then
    raise exception 'Tabelas ausentes: %', faltantes;
  end if;

  select string_agg(c.relname, ', ') into sem_rls
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = any(tabelas)
    and not c.relrowsecurity;
  if sem_rls is not null then
    raise exception 'RLS desativada: %', sem_rls;
  end if;

  if to_regprocedure('public.redistribuir_atendimento(uuid,uuid,text)') is null then
    raise exception 'RPC redistribuir_atendimento não encontrada';
  end if;
  if to_regclass('public.v_dashboard_atendimentos') is null then
    raise exception 'View de dashboard não encontrada';
  end if;
  raise notice 'OK: 10 tabelas, RLS, RPC e view de dashboard presentes';
end;
$$;

-- Verificar manualmente as políticas e grants pelo Dashboard:
-- 1) Sem login: nenhuma tabela do CRM deve ser acessível;
-- 2) Atendente: vê somente leads e atendimentos da própria carteira;
-- 3) Atendente: não consegue trocar atendente_id;
-- 4) Gestor: redistribui via RPC e gera linha no histórico;
-- 5) Sem atendente disponível: novo lead entra em aguardando_atribuicao.
