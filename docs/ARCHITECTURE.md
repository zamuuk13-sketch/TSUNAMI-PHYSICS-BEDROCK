# 🧩 Arquitetura

O projeto seguirá uma arquitetura híbrida.

## Simulação por setores

Somente áreas relevantes para o tsunami terão processamento intenso.

## Estados da água

- normal
- tsunami
- corrente
- turbulento
- refluxo
- estagnado pós-tsunami

## Entidades físicas

Jogadores, mobs, barcos e detritos poderão receber forças, velocidade, resistência e estados físicos.

## Estruturas

Estruturas importantes poderão possuir massa, resistência, altura, largura, centro de massa, integridade e estabilidade.

## Física em cadeia

Exemplo planejado:

tsunami → árvore → casa → detrito → jogador

## Performance

O sistema deve evitar loops globais pesados, limitar entidades ativas e reduzir cálculos fora da área afetada.
