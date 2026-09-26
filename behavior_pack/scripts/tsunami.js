import { system } from "@minecraft/server";

const ACTIVE = new Map();

const DEFAULTS = {
  startDistance: 36,
  width: 11,
  height: 5,
  length: 42,
  speedBlocksPerStep: 1,
  tickInterval: 2,
  baseOffset: -1,
  water: "minecraft:water"
};

function normalize(x, z) {
  const length = Math.sqrt((x * x) + (z * z)) || 1;
  return { x: x / length, z: z / length };
}

function perpendicular(dir) {
  return { x: -dir.z, z: dir.x };
}

function safeSetWater(dimension, x, y, z) {
  try {
    dimension.setBlockType({ x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) }, DEFAULTS.water);
    return true;
  } catch {
    return false;
  }
}

function particle(dimension, location) {
  try {
    dimension.spawnParticle("minecraft:water_splash", location);
  } catch {}
}

export function startTsunami(player, options = {}) {
  if (!player || !player.isValid) return false;
  if (ACTIVE.has(player.id)) return false;

  const cfg = { ...DEFAULTS, ...options };
  const view = player.getViewDirection();
  const incoming = normalize(-view.x, -view.z);
  const side = perpendicular(incoming);

  const start = {
    x: player.location.x - incoming.x * cfg.startDistance,
    y: player.location.y,
    z: player.location.z - incoming.z * cfg.startDistance
  };

  const wave = {
    id: player.id,
    dimension: player.dimension,
    player,
    cfg,
    incoming,
    side,
    front: 0,
    start,
    baseY: Math.floor(player.location.y) + cfg.baseOffset,
    tickCount: 0,
    finished: false
  };

  ACTIVE.set(player.id, wave);
  player.sendMessage("§b[Tsunami Physics] §fTsunami iniciado.");
  player.sendMessage(`§7Onda: §f${cfg.height} blocos §7| largura: §f${cfg.width} §7| distância: §f${cfg.startDistance}`);

  wave.runId = system.runInterval(() => updateWave(wave), cfg.tickInterval);
  return true;
}

function updateWave(wave) {
  if (!wave.player?.isValid || wave.finished) {
    stopWave(wave);
    return;
  }

  const cfg = wave.cfg;
  wave.front += cfg.speedBlocksPerStep;
  wave.tickCount++;

  // The front is built progressively. Existing water remains behind it,
  // creating the first simple inundation footprint for later physics stages.
  for (let forward = 0; forward < cfg.speedBlocksPerStep; forward++) {
    const distance = wave.front + forward;
    const centerX = wave.start.x + wave.incoming.x * distance;
    const centerZ = wave.start.z + wave.incoming.z * distance;

    for (let lateral = -Math.floor(cfg.width / 2); lateral <= Math.floor(cfg.width / 2); lateral++) {
      const x = centerX + wave.side.x * lateral;
      const z = centerZ + wave.side.z * lateral;

      // A simple curved crest: highest near the center of the wave.
      const edge = Math.abs(lateral) / Math.max(1, Math.floor(cfg.width / 2));
      const localHeight = Math.max(1, Math.round(cfg.height * (1 - edge * 0.35)));

      for (let y = 0; y < localHeight; y++) {
        safeSetWater(wave.dimension, x, wave.baseY + y, z);
      }

      if (wave.tickCount % 3 === 0) {
        particle(wave.dimension, { x, y: wave.baseY + localHeight, z });
      }
    }
  }

  if (wave.tickCount % 10 === 0) {
    try {
      wave.dimension.playSound(
        "ambient.weather.rain",
        { x: wave.start.x + wave.incoming.x * wave.front, y: wave.baseY + cfg.height, z: wave.start.z + wave.incoming.z * wave.front },
        { volume: 0.9, pitch: 0.65 }
      );
    } catch {}
  }

  if (wave.front >= cfg.length) {
    wave.player.sendMessage("§b[Tsunami Physics] §fPrimeira onda concluída.");
    stopWave(wave);
  }
}

function stopWave(wave) {
  if (wave.finished) return;
  wave.finished = true;
  if (wave.runId !== undefined) system.clearRun(wave.runId);
  ACTIVE.delete(wave.id);
}

export function stopTsunami(player) {
  const wave = ACTIVE.get(player.id);
  if (!wave) return false;
  stopWave(wave);
  return true;
}

export function isTsunamiActive(player) {
  return ACTIVE.has(player.id);
}
