-- Distribuição híbrida: menor número de atendimentos em aberto;
-- desempate pela última atribuição mais antiga (NULL primeiro).
-- Gestor pode redistribuir; atendente não pode transferir sua carteira.

create function private.criar_atendimento_automatico()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  v_atendente uuid;
begin
  select p.id into v_atendente
  from public.perfis p
  where p.papel = 'atendente' and p.ativo and p.disponivel
  order by (
    select count(*) from public.atendimentos a
    where a.atendente_id = p.id
      and a.status not in ('concluido', 'perdido')
  ) asc, p.ultima_atribuicao_em asc nulls first, p.id
  limit 1
  for update of p skip locked;

  insert into public.atendimentos (lead_id, atendente_id, status)
  values (
    new.id, v_atendente,
    case when v_atendente is null then 'aguardando_atribuicao' else 'novo' end
  );

  if v_atendente is not null then
    update public.perfis
    set ultima_atribuicao_em = clock_timestamp()
    where id = v_atendente;
  end if;

  return new;
end;
$$;

create function private.validar_redistribuicao()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.atendente_id is distinct from old.atendente_id then
    -- UPDATE direto por atendente autenticado é proibido,
    -- mesmo que alguém tente contornar o RPC.
    if (select auth.uid()) is not null and not (select private.eh_gestor()) then
      raise exception 'Somente gestores podem redistribuir atendimentos';
    end if;
    if new.atendente_id is not null and not exists (
      select 1 from public.perfis p
      where p.id = new.atendente_id and p.papel = 'atendente'
        and p.ativo and p.disponivel
    ) then
      raise exception 'O novo atendente deve estar ativo e disponível';
    end if;
    if new.status = 'aguardando_atribuicao' and new.atendente_id is not null then
      new.status := 'novo';
    end if;
  end if;
  return new;
end;
$$;

create function private.registrar_historico_atribuicao()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  v_anterior uuid;
  v_motivo text;
begin
  if tg_op = 'UPDATE' then
    v_anterior := old.atendente_id;
    if new.atendente_id is not distinct from old.atendente_id then
      return new;
    end if;
    v_motivo := nullif(current_setting('crm.motivo_redistribuicao', true), '');
  else
    v_anterior := null;
    if new.atendente_id is null then
      return new;
    end if;
    v_motivo := 'Distribuição automática na entrada do lead';
  end if;

  insert into public.historico_atribuicoes
    (atendimento_id, atendente_anterior_id, atendente_novo_id,
     alterado_por, tipo, motivo)
  values
    (new.id, v_anterior, new.atendente_id,
     case when tg_op = 'INSERT' then null else (select auth.uid()) end,
     case when tg_op = 'INSERT' then 'automatica' else 'manual' end,
     coalesce(v_motivo, 'Redistribuição realizada pelo gestor'));

  if tg_op = 'UPDATE' and new.atendente_id is not null then
    update public.perfis set ultima_atribuicao_em = clock_timestamp()
    where id = new.atendente_id;
  end if;
  return new;
end;
$$;

create trigger leads_atendimento_automatico after insert on public.leads
for each row execute function private.criar_atendimento_automatico();

create trigger atendimentos_validar_transferencia before update of atendente_id
on public.atendimentos for each row
execute function private.validar_redistribuicao();

create trigger atendimentos_historico_inicial after insert on public.atendimentos
for each row execute function private.registrar_historico_atribuicao();

create trigger atendimentos_historico_transferencia after update of atendente_id
on public.atendimentos for each row
execute function private.registrar_historico_atribuicao();

-- RPC chamável por Lovable após login do gestor.
-- SECURITY INVOKER: permanece sujeito à política de UPDATE de atendimentos.
create function public.redistribuir_atendimento(
  p_atendimento_id uuid,
  p_novo_atendente_id uuid,
  p_motivo text default null
)
returns uuid language plpgsql security invoker set search_path = ''
as $$
declare
  v_id uuid;
begin
  if (select auth.uid()) is null or not (select private.eh_gestor()) then
    raise exception 'Apenas o gestor pode redistribuir';
  end if;
  if p_novo_atendente_id is null then
    raise exception 'Selecione um atendente';
  end if;
  if not exists (
    select 1 from public.perfis p
    where p.id = p_novo_atendente_id
      and p.papel = 'atendente' and p.ativo and p.disponivel
  ) then
    raise exception 'Atendente inexistente ou indisponível';
  end if;
  perform set_config('crm.motivo_redistribuicao', coalesce(p_motivo, ''), true);

  update public.atendimentos
  set atendente_id = p_novo_atendente_id
  where id = p_atendimento_id
    and atendente_id is distinct from p_novo_atendente_id
  returning id into v_id;

  if v_id is null then
    raise exception 'Atendimento inexistente ou já atribuído a esse usuário';
  end if;
  return v_id;
end;
$$;

revoke all on function public.redistribuir_atendimento(uuid, uuid, text) from public, anon;
grant execute on function public.redistribuir_atendimento(uuid, uuid, text) to authenticated;

-- Privilégios de funções internas não são concedidos à API.
revoke all on function private.criar_atendimento_automatico() from public, anon, authenticated;
revoke all on function private.validar_redistribuicao() from public, anon, authenticated;
revoke all on function private.registrar_historico_atribuicao() from public, anon, authenticated;
