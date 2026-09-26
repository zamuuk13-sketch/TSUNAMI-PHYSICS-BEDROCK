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
  water: "minecraft:water",

  // Stage 3 — terrain-aware flooding
  terrainScanUp: 8,
  terrainScanDown: 16,
  floodDepth: 1,
  floodSpreadRadius: 18,
  maxFloodCellsPerTick: 90,
  maxWaterBlocksPerTick: 240,
  allowWaterReplace: true
};

function normalize(x, z) {
  const length = Math.sqrt((x * x) + (z * z)) || 1;
  return { x: x / length, z: z / length };
}

function perpendicular(dir) {
  return { x: -dir.z, z: dir.x };
}

function blockAt(dimension, x, y, z) {
  try {
    return dimension.getBlock({
      x: Math.floor(x),
      y: Math.floor(y),
      z: Math.floor(z)
    });
  } catch {
    return undefined;
  }
}

function canBecomeWater(block) {
  if (!block) return false;
  if (block.isAir) return true;
  if (block.isLiquid) return block.typeId === "minecraft:water";
  return false;
}

function safeSetWater(dimension, x, y, z) {
  const block = blockAt(dimension, x, y, z);
  if (!canBecomeWater(block)) return false;

  try {
    dimension.setBlockType(
      { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) },
      DEFAULTS.water
    );
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

// Finds the top of terrain while ignoring air and liquid.
// This prevents Stage 3 from treating previously placed tsunami water
// as terrain and lets the flood continue across the same area.
function getTerrainTop(dimension, x, startY, cfg) {
  const top = Math.floor(startY) + cfg.terrainScanUp;
  const bottom = Math.floor(startY) - cfg.terrainScanDown;

  for (let y = top; y >= bottom; y--) {
    const block = blockAt(dimension, x, y, 0);
    if (!block) continue;
  }

  return findTerrainTopAt(dimension, x, startY, cfg);
}

function findTerrainTopAt(dimension, x, z, startY, cfg) {
  const top = Math.floor(startY) + cfg.terrainScanUp;
  const bottom = Math.floor(startY) - cfg.terrainScanDown;

  for (let y = top; y >= bottom; y--) {
    const block = blockAt(dimension, x, y, z);
    if (!block) continue;
    if (block.isAir || block.isLiquid) continue;
    return y;
  }

  return undefined;
}

function key(x, z) {
  return x + "," + z;
}

function addFloodCell(wave, x, z, waterSurfaceY) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const k = key(ix, iz);

  const previous = wave.floodCells.get(k);
  if (previous === undefined || waterSurfaceY > previous) {
    wave.floodCells.set(k, waterSurfaceY);
    wave.floodQueue.push({ x: ix, z: iz });
  }
}

function seedFlood(wave, centerX, centerZ, width, waterSurfaceY) {
  const radius = Math.floor(width / 2);
  for (let lateral = -radius; lateral <= radius; lateral++) {
    const x = Math.round(centerX + wave.side.x * lateral);
    const z = Math.round(centerZ + wave.side.z * lateral);
    addFloodCell(wave, x, z, waterSurfaceY);
  }
}

function processFlood(wave) {
  const cfg = wave.cfg;
  let processed = 0;
  let placed = 0;

  while (
    wave.floodQueue.length > 0 &&
    processed < cfg.maxFloodCellsPerTick &&
    placed < cfg.maxWaterBlocksPerTick
  ) {
    const cell = wave.floodQueue.shift();
    const k = key(cell.x, cell.z);
    const waterSurface = wave.floodCells.get(k);

    if (waterSurface === undefined) continue;
    processed++;

    const terrainY = findTerrainTopAt(
      wave.dimension,
      cell.x,
      cell.z,
      wave.baseY + cfg.height,
      cfg
    );

    if (terrainY === undefined) continue;

    // Water occupies only air above terrain.
    // This makes the flood follow hills, valleys and depressions instead
    // of replacing solid terrain.
    const targetSurface = Math.max(terrainY + cfg.floodDepth, waterSurface);

    for (let y = terrainY + 1; y <= targetSurface; y++) {
      if (placed >= cfg.maxWaterBlocksPerTick) break;
      if (safeSetWater(wave.dimension, cell.x, y, cell.z)) placed++;
    }

    // Spread only when the neighboring terrain is reachable by the
    // current water surface. This creates basic valley/channel behavior.
    const neighbors = [
      { x: cell.x + 1, z: cell.z },
      { x: cell.x - 1, z: cell.z },
      { x: cell.x, z: cell.z + 1 },
      { x: cell.x, z: cell.z - 1 }
    ];

    for (const next of neighbors) {
      const distanceFromOrigin = Math.sqrt(
        Math.pow(next.x - wave.start.x, 2) +
        Math.pow(next.z - wave.start.z, 2)
      );

      if (distanceFromOrigin > wave.front + cfg.floodSpreadRadius) continue;

      const nextTerrain = findTerrainTopAt(
        wave.dimension,
        next.x,
        next.z,
        wave.baseY + cfg.height,
        cfg
      );

      if (nextTerrain === undefined) continue;

      // A one-block tolerance allows water to cross small rises while
      // still preferring low terrain.
      if (nextTerrain <= waterSurface + 1) {
        addFloodCell(wave, next.x, next.z, waterSurface);
      }
    }
  }
}

function updateWave(wave) {
  if (!wave.player?.isValid || wave.finished) {
    stopWave(wave);
    return;
  }

  const cfg = wave.cfg;
  wave.front += cfg.speedBlocksPerStep;
  wave.tickCount++;

  for (let forward = 0; forward < cfg.speedBlocksPerStep; forward++) {
    const distance = wave.front + forward;
    const centerX = wave.start.x + wave.incoming.x * distance;
    const centerZ = wave.start.z + wave.incoming.z * distance;

    for (
      let lateral = -Math.floor(cfg.width / 2);
      lateral <= Math.floor(cfg.width / 2);
      lateral++
    ) {
      const x = centerX + wave.side.x * lateral;
      const z = centerZ + wave.side.z * lateral;

      const edge = Math.abs(lateral) / Math.max(1, Math.floor(cfg.width / 2));
      const localHeight = Math.max(
        1,
        Math.round(cfg.height * (1 - edge * 0.35))
      );

      // The crest now starts at the local terrain height instead of a
      // fixed Y coordinate, so the wave can cross uneven ground.
      const terrainY = findTerrainTopAt(
        wave.dimension,
        x,
        z,
        wave.baseY + cfg.height,
        cfg
      );

      const crestBase = terrainY === undefined ? wave.baseY : terrainY + 1;

      for (let y = 0; y < localHeight; y++) {
        if (safeSetWater(wave.dimension, x, crestBase + y, z)) {
          wave.blocksPlaced++;
        }
      }

      seedFlood(
        wave,
        x,
        z,
        1,
        crestBase + Math.max(1, Math.floor(localHeight * 0.65))
      );

      if (wave.tickCount % 3 === 0) {
        particle(wave.dimension, {
          x,
          y: crestBase + localHeight,
          z
        });
      }
    }
  }

  processFlood(wave);

  if (wave.tickCount % 10 === 0) {
    try {
      wave.dimension.playSound(
        "ambient.weather.rain",
        {
          x: wave.start.x + wave.incoming.x * wave.front,
          y: wave.baseY + cfg.height,
          z: wave.start.z + wave.incoming.z * wave.front
        },
        { volume: 0.9, pitch: 0.65 }
      );
    } catch {}
  }

  if (wave.front >= cfg.length) {
    wave.player.sendMessage("§b[Tsunami Physics] §fPrimeira onda concluída.");
    stopWave(wave);
  }
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
    blocksPlaced: 0,
    floodCells: new Map(),
    floodQueue: [],
    finished: false
  };

  ACTIVE.set(player.id, wave);

  player.sendMessage("§b[Tsunami Physics] §fTsunami iniciado.");
  player.sendMessage(
    `§7Onda: §f${cfg.height} blocos §7| largura: §f${cfg.width} §7| distância: §f${cfg.startDistance}`
  );
  player.sendMessage(
    "§7Stage 3: §fágua agora acompanha o terreno e se espalha pelas áreas baixas."
  );

  wave.runId = system.runInterval(
    () => updateWave(wave),
    cfg.tickInterval
  );

  return true;
}

function stopWave(wave) {
  if (wave.finished) return;
  wave.finished = true;

  if (wave.runId !== undefined) {
    system.clearRun(wave.runId);
  }

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
