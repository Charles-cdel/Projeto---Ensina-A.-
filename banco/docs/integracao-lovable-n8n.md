# Contratos iniciais — Lovable, Supabase e n8n

Este arquivo documenta a integração **planejada**, não endpoints já implantados.

## Acesso do Lovable (interno)

- Login: Supabase Auth.
- Listar carteira: \`atendimentos\` com relação a \`leads\`, respeitando RLS.
- Cadastrar interessado autenticado: inserir em \`leads\`; o gatilho gera \`atendimentos\` automaticamente.
- Atualizar status: \`atendimentos.status\`.
- Registrar conversa: inserir \`interacoes\`.
- Redistribuir (gestor): RPC \`redistribuir_atendimento\`.

Exemplo para o gestor logado:

\`\`\`ts
const { data, error } = await supabase.rpc("redistribuir_atendimento", {
  p_atendimento_id: atendimentoId,
  p_novo_atendente_id: atendenteId,
  p_motivo: "Redistribuição por ausência"
});
\`\`\`

Exemplo para registrar um lead **por atendente autenticado**:

\`\`\`ts
const { data, error } = await supabase
  .from("leads")
  .insert({
    nome_responsavel: "Responsável de teste",
    telefone: "85999999999",
    canal: "presencial",
    mensagem_inicial: "Interesse em matrícula"
  })
  .select("id")
  .single();
\`\`\`

**Observação:** após a criação, a pessoa que registrou o lead pode não ter acesso a ele: o roteamento automático atribui a carteira a outro atendente. Isso é intencional.

## Formulário público e agente de IA (fase seguinte)

O navegador anônimo **não** possui permissão para inserir diretamente nas tabelas pessoais do CRM. Criar uma Supabase Edge Function ou serviço backend com:
- Validação de nome, telefone, consentimento e canal;
- Rate limit, tratamento anti-spam e logs sem dados sensíveis;
- Credencial privilegiada armazenada somente como segredo no servidor;
- Inserção em \`leads\` (o trigger distribui automaticamente);
- Resposta ao frontend contendo apenas confirmação/identificador não sensível.

O n8n poderá chamar a mesma API segura para \`registrar_interesse\` e consultar \`informacoes_escola\`, \`series_escolares\` e \`turnos\` conforme regras de acesso. Não dar ao agente acesso geral aos contatos de alunos.

## Critérios de aceite do banco

- [ ] SQL instalado no projeto correto; seed e smoke executados.
- [ ] Gestor e três atendentes criados no Supabase Auth.
- [ ] Atendentes indisponíveis nunca recebem novos leads.
- [ ] Menor carga e desempate por atribuição mais antiga verificados.
- [ ] Sem atendentes disponíveis, nova entrada fica na fila.
- [ ] Apenas gestor redistribui e o histórico recebe a alteração.
- [ ] Dois usuários de atendimento não conseguem ler carteiras um do outro.
- [ ] Nenhuma chave secreta foi adicionada ao GitHub/Lovable.
