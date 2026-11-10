-- Controle de acesso: gestor vê a operação; atendente vê apenas sua carteira.
-- O papel fica no banco, nunca em user_metadata editável pelo cliente.
create function private.eh_gestor()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.perfis p
    where p.id = (select auth.uid()) and p.papel = 'gestor' and p.ativo
  );
$$;
revoke all on function private.eh_gestor() from public, anon;
grant execute on function private.eh_gestor() to authenticated;

create policy perfis_ler on public.perfis for select to authenticated
  using (id = (select auth.uid()) or (select private.eh_gestor()));
create policy perfis_editar on public.perfis for update to authenticated
  using ((id = (select auth.uid()) and ativo) or (select private.eh_gestor()))
  with check ((id = (select auth.uid()) and ativo) or (select private.eh_gestor()));

create policy series_ler on public.series_escolares for select to authenticated using (true);
create policy series_inserir on public.series_escolares for insert to authenticated
  with check ((select private.eh_gestor()));
create policy series_editar on public.series_escolares for update to authenticated
  using ((select private.eh_gestor())) with check ((select private.eh_gestor()));

create policy turnos_ler on public.turnos for select to authenticated using (true);
create policy turnos_inserir on public.turnos for insert to authenticated
  with check ((select private.eh_gestor()));
create policy turnos_editar on public.turnos for update to authenticated
  using ((select private.eh_gestor())) with check ((select private.eh_gestor()));

create policy escola_ler on public.informacoes_escola for select to authenticated using (true);
create policy escola_inserir on public.informacoes_escola for insert to authenticated
  with check ((select private.eh_gestor()));
create policy escola_editar on public.informacoes_escola for update to authenticated
  using ((select private.eh_gestor())) with check ((select private.eh_gestor()));

-- A leitura de leads é condicionada ao atendimento atribuído. Leads sem
-- atendente ficam visíveis ao gestor até serem distribuídos.
create policy leads_ler on public.leads for select to authenticated
  using (
    (select private.eh_gestor()) or exists (
      select 1 from public.atendimentos a
      where a.lead_id = leads.id and a.atendente_id = (select auth.uid())
    )
  );
create policy leads_inserir on public.leads for insert to authenticated
  with check (
    criado_por = (select auth.uid()) and exists (
      select 1 from public.perfis p
      where p.id = (select auth.uid()) and p.ativo
    )
  );
create policy leads_editar on public.leads for update to authenticated
  using (
    (select private.eh_gestor()) or exists (
      select 1 from public.atendimentos a
      where a.lead_id = leads.id and a.atendente_id = (select auth.uid())
    )
  )
  with check (
    (select private.eh_gestor()) or exists (
      select 1 from public.atendimentos a
      where a.lead_id = leads.id and a.atendente_id = (select auth.uid())
    )
  );

create policy atendimentos_ler on public.atendimentos for select to authenticated
  using ((select private.eh_gestor()) or atendente_id = (select auth.uid()));
create policy atendimentos_editar on public.atendimentos for update to authenticated
  using ((select private.eh_gestor()) or atendente_id = (select auth.uid()))
  with check ((select private.eh_gestor()) or atendente_id = (select auth.uid()));

create policy interacoes_ler on public.interacoes for select to authenticated
  using ((select private.eh_gestor()) or exists (
    select 1 from public.atendimentos a
    where a.id = interacoes.atendimento_id and a.atendente_id = (select auth.uid())
  ));
create policy interacoes_inserir on public.interacoes for insert to authenticated
  with check (
    autor_id = (select auth.uid()) and tipo <> 'automacao'
    and ((select private.eh_gestor()) or exists (
      select 1 from public.atendimentos a
      where a.id = interacoes.atendimento_id and a.atendente_id = (select auth.uid())
    ))
  );

create policy historico_ler on public.historico_atribuicoes for select to authenticated
  using ((select private.eh_gestor()));

create policy visitas_ler on public.visitas for select to authenticated
  using ((select private.eh_gestor()) or exists (
    select 1 from public.atendimentos a
    where a.id = visitas.atendimento_id and a.atendente_id = (select auth.uid())
  ));
create policy visitas_inserir on public.visitas for insert to authenticated
  with check (
    criada_por = (select auth.uid()) and
    ((select private.eh_gestor()) or exists (
      select 1 from public.atendimentos a
      where a.id = visitas.atendimento_id and a.atendente_id = (select auth.uid())
    ))
  );
create policy visitas_editar on public.visitas for update to authenticated
  using ((select private.eh_gestor()) or exists (
    select 1 from public.atendimentos a
    where a.id = visitas.atendimento_id and a.atendente_id = (select auth.uid())
  ))
  with check ((select private.eh_gestor()) or exists (
    select 1 from public.atendimentos a
    where a.id = visitas.atendimento_id and a.atendente_id = (select auth.uid())
  ));

create policy tarefas_ler on public.tarefas for select to authenticated
  using ((select private.eh_gestor()) or exists (
    select 1 from public.atendimentos a
    where a.id = tarefas.atendimento_id and a.atendente_id = (select auth.uid())
  ));
create policy tarefas_inserir on public.tarefas for insert to authenticated
  with check (
    criada_por = (select auth.uid())
    and ((select private.eh_gestor()) or
      (responsavel_id = (select auth.uid()) and exists (
        select 1 from public.atendimentos a
        where a.id = tarefas.atendimento_id and a.atendente_id = (select auth.uid())
      )))
  );
create policy tarefas_editar on public.tarefas for update to authenticated
  using ((select private.eh_gestor()) or exists (
    select 1 from public.atendimentos a
    where a.id = tarefas.atendimento_id and a.atendente_id = (select auth.uid())
  ))
  with check ((select private.eh_gestor()) or
    (responsavel_id = (select auth.uid()) and exists (
      select 1 from public.atendimentos a
      where a.id = tarefas.atendimento_id and a.atendente_id = (select auth.uid())
    )));

-- SECURITY INVOKER garante que o dashboard respeite a RLS das tabelas-base.
create view public.v_dashboard_atendimentos
with (security_invoker = true)
as
select a.atendente_id, a.status, count(*)::integer as total
from public.atendimentos a
group by a.atendente_id, a.status;
revoke all on public.v_dashboard_atendimentos from anon, authenticated;
grant select on public.v_dashboard_atendimentos to authenticated;
