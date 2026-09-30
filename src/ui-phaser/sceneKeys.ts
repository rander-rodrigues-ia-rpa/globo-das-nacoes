export const SCENES = {
  boot: 'boot',
  title: 'title',
  heroSelect: 'hero-select',
  intro: 'intro',
  worldMap: 'world-map',
  altar: 'altar',
  epilogue: 'epilogue',
} as const;

export const levelSceneKey = (levelId: string) => `level:${levelId}`;
