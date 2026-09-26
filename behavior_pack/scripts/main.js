import { world, system } from "@minecraft/server";
import { startTsunami, stopTsunami, isTsunamiActive } from "./tsunami.js";

const STAGE = "Stage 2";

function log(message) {
  console.warn("[Tsunami Physics][Stage 2] " + message);
}

system.run(() => {
  log("Script API carregada.");
  log("Primeiro tsunami funcional inicializado.");
});

world.afterEvents.playerSpawn.subscribe((event) => {
  if (!event.initialSpawn) return;
  event.player.sendMessage("§b[Tsunami Physics] §fStage 2 carregada.");
  event.player.sendMessage("§7Use §f!tsunami §7para testar a primeira onda.");
  event.player.sendMessage("§7Use §f!tsunami stop §7para parar uma onda ativa.");
});

world.afterEvents.chatSend.subscribe((event) => {
  const message = event.message.trim().toLowerCase();

  if (message !== "!tsunami" && message !== "!tsunami stop") return;

  if (message === "!tsunami stop") {
    if (stopTsunami(event.sender)) {
      event.sender.sendMessage("§b[Tsunami Physics] §fOnda interrompida.");
    } else {
      event.sender.sendMessage("§7Nenhuma onda ativa.");
    }
    return;
  }

  if (isTsunamiActive(event.sender)) {
    event.sender.sendMessage("§e[Tsunami Physics] §fJá existe uma onda ativa para este jogador.");
    return;
  }

  startTsunami(event.sender);
});
