-- Catálogo de séries para desenvolvimento, baseado no escopo informado
-- (Educação Infantil a partir de 1 ano até o 3º ano do Ensino Médio).
-- Confirmar nomenclatura de cada turma com a escola antes de publicar ao público.
insert into public.series_escolares (nome, nivel, ordem) values
  ('Educação Infantil — 1 ano', 'educacao_infantil', 1),
  ('Educação Infantil — 2 anos', 'educacao_infantil', 2),
  ('Educação Infantil — 3 anos', 'educacao_infantil', 3),
  ('Educação Infantil — 4 anos', 'educacao_infantil', 4),
  ('Educação Infantil — 5 anos', 'educacao_infantil', 5),
  ('1º ano do Fundamental', 'fundamental_i', 6),
  ('2º ano do Fundamental', 'fundamental_i', 7),
  ('3º ano do Fundamental', 'fundamental_i', 8),
  ('4º ano do Fundamental', 'fundamental_i', 9),
  ('5º ano do Fundamental', 'fundamental_i', 10),
  ('6º ano do Fundamental', 'fundamental_ii', 11),
  ('7º ano do Fundamental', 'fundamental_ii', 12),
  ('8º ano do Fundamental', 'fundamental_ii', 13),
  ('9º ano do Fundamental', 'fundamental_ii', 14),
  ('1º ano do Ensino Médio', 'ensino_medio', 15),
  ('2º ano do Ensino Médio', 'ensino_medio', 16),
  ('3º ano do Ensino Médio', 'ensino_medio', 17)
on conflict (nome) do nothing;

-- Turnos, preços, endereço e dados institucionais não foram presumidos.
-- Cadastre essas informações após confirmação com a escola.
-- Cadastre perfis SOMENTE depois de criar usuários reais no Supabase Auth.
