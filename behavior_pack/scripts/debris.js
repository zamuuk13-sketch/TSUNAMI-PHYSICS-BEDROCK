import { ItemStack } from "@minecraft/server";

const DEBRIS_TAG = "tsunami_physics_debris";

const MATERIALS = {
  "minecraft:oak_log": { mass: 4.0, drag: 0.08 },
  "minecraft:spruce_log": { mass: 4.0, drag: 0.08 },
  "minecraft:birch_log": { mass: 4.0, drag: 0.08 },
  "minecraft:jungle_log": { mass: 4.0, drag: 0.08 },
  "minecraft:acacia_log": { mass: 4.0, drag: 0.08 },
  "minecraft:dark_oak_log": { mass: 4.0, drag: 0.08 },
  "minecraft:mangrove_log": { mass: 4.5, drag: 0.08 },
  "minecraft:cherry_log": { mass: 4.0, drag: 0.08 },
  "minecraft:oak_planks": { mass: 2.2, drag: 0.12 },
  "minecraft:spruce_planks": { mass: 2.2, drag: 0.12 },
  "minecraft:birch_planks": { mass: 2.2, drag: 0.12 },
  "minecraft:jungle_planks": { mass: 2.2, drag: 0.12 },
  "minecraft:acacia_planks": { mass: 2.2, drag: 0.12 },
  "minecraft:dark_oak_planks": { mass: 2.2, drag: 0.12 },
  "minecraft:mangrove_planks": { mass: 2.2, drag: 0.12 },
  "minecraft:cherry_planks": { mass: 2.2, drag: 0.12 },
  "minecraft:dirt": { mass: 2.8, drag: 0.16 },
  "minecraft:grass_block": { mass: 3.2, drag: 0.14 },
  "minecraft:sand": { mass: 1.6, drag: 0.22 },
  "minecraft:gravel": { mass: 1.8, drag: 0.20 },
  "minecraft:cobblestone": { mass: 3.8, drag: 0.10 },
  "minecraft:stone": { mass: 4.5, drag: 0.08 },
  "minecraft:brick_block": { mass: 4.2, drag: 0.09 }
};

function materialFor(typeId) {
  return MATERIALS[typeId] ?? { mass: 2.0, drag: 0.16 };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeSetProperty(entity, id, value) {
  try {
    entity.setDynamicProperty(id, value);
  } catch {}
}

function safeGetVelocity(entity) {
  try {
    return entity.getVelocity();
  } catch {
    return { x: 0, y: 0, z: 0 };
  }
}

export function spawnDebris(dimension, location, typeId, incoming, options = {}) {
  const cfg = {
    maxSpeed: 1.15,
    initialPush: 0.10,
    upwardImpulse: 0.04,
    ...options
  };

  const material = materialFor(typeId);

  try {
    const stack = new ItemStack(typeId, 1);
    const entity = dimension.spawnItem(stack, {
      x: location.x + 0.5,
      y: location.y + 0.35,
      z: location.z + 0.5
    });

    entity.addTag(DEBRIS_TAG);
    safeSetProperty(entity, "tsunami:debris", true);
    safeSetProperty(entity, "tsunami:mass", material.mass);
    safeSetProperty(entity, "tsunami:drag", material.drag);
    safeSetProperty(entity, "tsunami:material", typeId);

    entity.applyImpulse({
      x: incoming.x * cfg.initialPush,
      y: cfg.upwardImpulse,
      z: incoming.z * cfg.initialPush
    });

    return entity;
  } catch {
    return undefined;
  }
}

export function updateDebris(wave) {
  const cfg = wave.cfg;
  const entities = wave.dimension.getEntities({
    tags: [DEBRIS_TAG],
    location: wave.start,
    maxDistance: Math.max(48, cfg.length + cfg.floodSpreadRadius + 12)
  });

  for (const debris of entities) {
    if (!debris.isValid) continue;

    let velocity = safeGetVelocity(debris);
    const mass = Number(debris.getDynamicProperty("tsunami:mass")) || 2;
    const drag = Number(debris.getDynamicProperty("tsunami:drag")) || 0.16;

    const inWater = isWaterNear(wave, debris.location);
    if (!inWater) continue;

    const depthFactor = waterDepthFactor(wave, debris.location);
    const force = (cfg.debrisCurrentForce / Math.max(1, mass)) * depthFactor;

    const targetX = velocity.x * (1 - drag) + wave.incoming.x * force;
    const targetZ = velocity.z * (1 - drag) + wave.incoming.z * force;

    const horizontal = Math.sqrt(targetX * targetX + targetZ * targetZ);
    let nextX = targetX;
    let nextZ = targetZ;

    if (horizontal > cfg.debrisMaxSpeed) {
      const scale = cfg.debrisMaxSpeed / horizontal;
      nextX *= scale;
      nextZ *= scale;
    }

    const impulseScale = clamp(cfg.debrisImpulseScale, 0.05, 1);
    try {
      debris.applyImpulse({
        x: (nextX - velocity.x) * impulseScale,
        y: 0,
        z: (nextZ - velocity.z) * impulseScale
      });
    } catch {}
  }
}

function isWaterNear(wave, location) {
  const x = Math.floor(location.x);
  const y = Math.floor(location.y);
  const z = Math.floor(location.z);

  for (let dy = -1; dy <= 1; dy++) {
    const block = wave.dimension.getBlock({ x, y: y + dy, z });
    if (block?.isLiquid && block.typeId === "minecraft:water") return true;
  }

  return false;
}

function waterDepthFactor(wave, location) {
  const x = Math.floor(location.x);
  const z = Math.floor(location.z);
  let depth = 0;

  for (let y = Math.floor(location.y); y >= Math.floor(location.y) - 8; y--) {
    const block = wave.dimension.getBlock({ x, y, z });
    if (!block?.isLiquid || block.typeId !== "minecraft:water") break;
    depth++;
  }

  return clamp(0.5 + depth * 0.15, 0.5, 1.5);
}

export function isDebris(entity) {
  try {
    return entity.hasTag(DEBRIS_TAG);
  } catch {
    return false;
  }
}
