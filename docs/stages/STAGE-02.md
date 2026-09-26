# Stage 2 — Primeiro Tsunami

## Objetivo

Criar a primeira onda de tsunami funcional dentro do Bedrock, com início controlado, deslocamento progressivo e inundação básica.

## Implementado

- Comando de teste `!tsunami`;
- Comando `!tsunami stop`;
- Onda nasce a uma distância configurada do jogador;
- A direção da onda é calculada a partir da direção que o jogador está olhando;
- Frente da onda avança progressivamente;
- Largura e altura configuráveis;
- Crista levemente curva nas laterais;
- Água é colocada progressivamente conforme a frente avança;
- Água permanece atrás da frente para formar a primeira área inundada;
- Partículas de respingo;
- Som básico da onda;
- Proteção contra duas ondas simultâneas para o mesmo jogador;
- Sistema separado em módulo para permitir evolução nas próximas etapas.

## Compatibilidade

- Alvo mínimo do projeto: Minecraft Bedrock 1.21.100.
- Dependência: `@minecraft/server` 1.11.0.

A implementação usa APIs oficiais de script para atualizar o mundo e colocar blocos progressivamente. A documentação oficial registra `Dimension.setBlockType` para alterar blocos e `system.runInterval` para loops periódicos. citeturn0search0turn0search4

## Como testar

1. Ative o Behavior Pack e o Resource Pack do projeto.
2. Entre em um mundo de teste.
3. Confirme a mensagem da Stage 2.
4. Olhe na direção em que você quer que a onda venha.
5. Digite:
   `!tsunami`
6. Aguarde a onda se aproximar.
7. Para interromper:
   `!tsunami stop`

## Critério de conclusão

A Stage 2 somente será considerada concluída depois de teste real no Bedrock confirmando:

- [ ] Pack carrega sem erro;
- [ ] `!tsunami` é reconhecido;
- [ ] Onda aparece na distância inicial;
- [ ] Onda se desloca progressivamente;
- [ ] Água é criada atrás da frente;
- [ ] Onda respeita largura/altura configuradas;
- [ ] `!tsunami stop` interrompe a simulação;
- [ ] Não há erro de script durante o teste.

## Limitações intencionais desta etapa

Ainda não é a física completa do projeto. Nesta etapa não há:

- pressão baseada em profundidade;
- corrente física;
- empurrão de entidades;
- detritos;
- destruição;
- refluxo;
- múltiplas ondas;
- adaptação ao relevo.

Esses sistemas entram nas etapas posteriores.

## Status

🟡 Implementada — aguardando teste real no Bedrock.
