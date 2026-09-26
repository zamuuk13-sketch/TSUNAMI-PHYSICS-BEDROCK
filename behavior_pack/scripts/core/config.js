export const TSUNAMI_CONFIG = {
  enabled: true,
  debug: true,
  maxActiveSectors: 64,
  maxActiveDebris: 128,
  tickInterval: 1,

  stage2: {
    startDistance: 36,
    width: 11,
    height: 5,
    length: 42,
    speedBlocksPerStep: 1,
    tickInterval: 2,
    baseOffset: -1,
    water: "minecraft:water"
  },

  stage3: {
    terrainScanUp: 8,
    terrainScanDown: 16,
    floodDepth: 1,
    floodSpreadRadius: 18,
    maxFloodCellsPerTick: 90,
    maxWaterBlocksPerTick: 240,
    allowWaterReplace: true,
    playerPhysics: true,
    swimLevel: 1,
    wadeLevel: 2,
    drag: 0.18,
    strongCurrentDrag: 0.32,
    currentPull: 0.055,
    maxCurrentSpeed: 0.75,
    verticalBuoyancy: 0.045,
    surfaceRecovery: 0.12,
    sprintPenalty: 0.35,
    underwaterPenalty: 0.55,
    physicsTickInterval: 1
  }
};
