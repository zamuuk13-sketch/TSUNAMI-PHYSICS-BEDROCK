# Stage 5 — Sistema de Detritos

## Objetivo

Criar a primeira camada de objetos físicos carregados pela água, preparando a simulação para impactos e destruição nas próximas etapas.

## Implementado

- entidades de item usadas como detritos físicos;
- materiais iniciais: madeira, tábuas, terra, areia, cascalho, pedra e tijolos;
- massa individual por material;
- arrasto individual por material;
- impulso inicial na direção da onda;
- detritos recebem a corrente da água;
- velocidade máxima dos detritos;
- influência maior em água mais profunda;
- detritos permanecem como entidades após serem criados;
- identificação por tag e propriedades dinâmicas;
- limite de detritos por tsunami;
- geração progressiva, não instantânea.

A API oficial do Bedrock oferece Dimension.spawnItem() para criar uma pilha como entidade e Entity.applyImpulse() para alterar sua velocidade.

## Importante

A Stage 5 **não remove blocos do mapa ainda**.

Os detritos são gerados a partir de materiais encontrados na frente da onda para testar o sistema físico sem antecipar a destruição estrutural. A remoção de blocos, quebra de árvores e impactos com dano ficam para as etapas seguintes.

## Como testar

1. Inicie o mundo com o addon.
2. Execute `!tsunami`.
3. Espere a frente da onda alcançar terreno.
4. Observe itens/debris surgindo progressivamente.
5. Veja se os detritos são carregados pela água.
6. Compare materiais leves e pesados.
7. Observe se os detritos continuam existindo depois que a onda passa.
8. Execute `!tsunami stop`.

## Critério de conclusão

- [ ] Stage 4 continua funcionando.
- [ ] Detritos aparecem progressivamente.
- [ ] Detritos têm movimento próprio.
- [ ] Corrente consegue transportar os detritos.
- [ ] Materiais possuem massas diferentes.
- [ ] Existe limite de quantidade.
- [ ] Não há erro de script.
- [ ] Não há remoção indevida de blocos.

## Limitações intencionais

Ainda não há:

- dano por colisão;
- destruição de blocos;
- árvores físicas;
- casas físicas;
- fragmentação de estruturas;
- ricochete físico avançado;
- sistema de impacto;
- refluxo específico de detritos.

## Status

🟡 Implementada — aguardando teste real no Bedrock.
