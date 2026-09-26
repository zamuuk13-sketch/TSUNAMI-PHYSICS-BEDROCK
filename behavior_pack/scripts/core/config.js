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
    allowWaterReplace: true
  }
};
