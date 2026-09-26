# 🌊 TSUNAMI PHYSICS — Minecraft Bedrock

Um addon de Minecraft Bedrock focado em simular tsunamis de forma dinâmica e progressiva.

## Objetivo

Criar uma simulação que combine avanço progressivo da água, correntes, inundação, detritos físicos, impactos, destruição estrutural, refluxo e eventos ambientais.

O projeto não pretende transformar cada bloco do mundo em uma entidade física. A arquitetura usará uma abordagem híbrida, com setores de simulação, água/blocos quando necessário, entidades físicas e níveis de integridade.

## Status atual

**Stage 0 — Organização do projeto**

Esta etapa prepara documentação, arquitetura, roadmap e estrutura de diretórios. A simulação do tsunami começa na Stage 1.

## Roadmap

1. Fundação
2. Primeiro Tsunami
3. Água e Inundação
4. Física do Jogador
5. Sistema de Detritos
6. Impacto dos Detritos
7. Árvores Físicas
8. Estruturas Físicas
9. Física em Cadeia
10. Costa e Terreno
11. Refluxo
12. Terremoto Submarino
13. Sistema de Alerta
14. NPCs e Vilas
15. Visual e Áudio
16. Mega Tsunami
17. Tsunami Lab
18. Otimização
19. Mapas de Teste
20. Versão 1.0

Veja docs/ROADMAP.md e docs/stages/ para detalhes.

## Estrutura

- behavior_pack/ — lógica do addon
- resource_pack/ — recursos visuais e sonoros
- config/ — configurações
- docs/ — documentação
- tests/ — cenários de teste
- tools/ — ferramentas auxiliares
- build/ — arquivos gerados

## Regra de desenvolvimento

Cada etapa deve ter uma base funcional e testável antes de avançarmos para a próxima.

---
Tsunami Physics • Minecraft Bedrock
