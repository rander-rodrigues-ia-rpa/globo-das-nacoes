// API pública do núcleo do jogo. Frontends importam apenas daqui.
export * from './domain/ids';
export * from './domain/heroes';
export * from './events/Emitter';
export * from './levels/LevelDefinition';
export * from './levels/LevelCatalog';
export * from './levels/LevelRun';
export * from './levels/campaign';
export * from './ports/SaveRepository';
export * from './ports/Presentation';
export * from './session/SaveData';
export * from './session/GameSession';
export * from './altar/GlobeAssembly';
