# Stage 4 — Física do Jogador

## Objetivo

Fazer a água do tsunami afetar diretamente o movimento do jogador, introduzindo resistência, arrasto, corrente e flutuação básica.

## Implementado

- Detecção de água nos pés;
- detecção de submersão da cabeça;
- estados de superfície/submersão;
- redução progressiva do movimento dentro da água;
- arrasto horizontal;
- corrente na direção de propagação da onda;
- limite de velocidade da corrente;
- impulso vertical de flutuação;
- mensagens ao entrar na água e ao ser submerso;
- estado individual do jogador;
- limpeza do estado ao finalizar a onda;
- parâmetros configuráveis para a física.

## Como testar

1. Entre no mundo de teste.
2. Inicie `!tsunami`.
3. Fique parado quando a água alcançar os pés.
4. Observe a dificuldade maior para manter o movimento.
5. Permita que a água cubra a cabeça.
6. Observe o arrasto e a tendência de ser levado na direção da onda.
7. Use `!tsunami stop` e confirme que a simulação termina normalmente.

## Critério de conclusão

- [ ] Stage 3 continua funcionando;
- [ ] Água nos pés altera o movimento;
- [ ] Submersão altera o movimento de forma mais forte;
- [ ] Corrente empurra o jogador;
- [ ] Corrente possui limite de velocidade;
- [ ] Existe flutuação vertical básica;
- [ ] Não há erro de script durante o teste.

## Limitações intencionais

Ainda não há:

- agarrar estruturas;
- dano por impacto;
- oxigênio customizado;
- corrente turbulenta;
- colisão física com detritos;
- animações customizadas.

## Status

🟡 Implementada — aguardando teste real no Bedrock.
