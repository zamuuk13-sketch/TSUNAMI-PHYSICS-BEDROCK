# Stage 3 — Água e Inundação

## Objetivo

Transformar a primeira onda da Stage 2 em uma inundação que respeita o terreno, ocupa áreas baixas e se espalha gradualmente sem substituir blocos sólidos.

## Implementado

- Leitura do terreno com `Dimension.getBlock()`;
- identificação de blocos sólidos, ar e líquidos;
- crista da onda adaptada à altura local do terreno;
- água colocada somente em espaços vazios ou água existente;
- inundação persistente atrás da frente da onda;
- células de inundação com fila de propagação;
- propagação para os quatro lados;
- preferência por vales e terrenos mais baixos;
- tolerância de um bloco para atravessar pequenas elevações;
- limite de células processadas por atualização;
- limite de blocos de água criados por atualização;
- configuração própria da Stage 3.

A API oficial do Bedrock documenta `Dimension.getBlock()` para consultar blocos e `setBlockType()` para modificar blocos; a classe `Block` também fornece `isAir`, `isLiquid` e `typeId`, usados nesta etapa. citeturn0search0turn0search1turn0search3

## Como testar

1. Use o mesmo mundo de teste da Stage 2.
2. Ative o Behavior Pack atualizado.
3. Posicione o jogador perto de uma área com terreno irregular.
4. Olhe na direção desejada.
5. Execute `!tsunami`.
6. Observe a onda atravessando terrenos de alturas diferentes.
7. Observe se a água se mantém em áreas baixas e começa a ocupar os espaços vazios atrás da frente.
8. Teste também `!tsunami stop`.

## Critério de conclusão

A Stage 3 só será concluída depois de teste real confirmando:

- [ ] Pack carrega sem erro;
- [ ] Stage 2 continua funcionando;
- [ ] Onda acompanha diferentes alturas do terreno;
- [ ] Água não substitui blocos sólidos comuns;
- [ ] Água se espalha para áreas vizinhas;
- [ ] Vales e áreas baixas recebem água;
- [ ] Inundação acontece progressivamente;
- [ ] Limites de processamento evitam crescimento ilimitado por tick;
- [ ] `!tsunami stop` continua funcionando;
- [ ] Não há erro de script durante o teste.

## Limitações intencionais

Ainda não há nesta etapa:

- pressão baseada em profundidade;
- corrente física sobre entidades;
- destruição de blocos;
- detritos;
- refluxo;
- múltiplas ondas;
- abertura física de portas/janelas.

## Status

🟡 Implementada — aguardando teste real no Bedrock.
