# Stage 1 — Fundação

## Objetivo
Criar a base funcional do addon: Behavior Pack, Resource Pack, manifests, Script API, configuração e logs.

## Implementado
- Behavior Pack;
- Resource Pack;
- manifests;
- dependência da Script API;
- entrada JavaScript;
- configuração inicial;
- logger;
- mensagem de inicialização;
- limites iniciais da futura simulação.

## Compatibilidade
Alvo mínimo: Minecraft Bedrock 1.21.100.
A dependência inicial usa @minecraft/server 1.11.0, uma API estável da linha 1.21.

## Não implementado
Tsunami, onda, corrente, inundação, detritos e destruição estrutural.

## Critério de conclusão
Os dois packs carregam e scripts/main.js executa sem erro, exibindo a mensagem da Stage 1 no primeiro spawn.

Status: 🟢 Implementação inicial concluída; aguarda teste no Bedrock.
