import { world, system } from "@minecraft/server";

const PROJECT = "Tsunami Physics";
const STAGE = "Stage 1";

function log(message) {
  console.warn("[Tsunami Physics][Stage 1] " + message);
}

system.run(() => {
  log("Script API carregada com sucesso.");
  log("Fundação do addon inicializada.");
});

world.afterEvents.playerSpawn.subscribe((event) => {
  if (!event.initialSpawn) return;
  event.player.sendMessage("§b[Tsunami Physics] §fStage 1 carregada.");
  event.player.sendMessage("§7Fundação do sistema ativa. O tsunami será implementado nas próximas etapas.");
});
