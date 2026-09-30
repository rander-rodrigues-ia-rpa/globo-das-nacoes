import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guarda da arquitetura: o núcleo (src/core) e o conteúdo (src/content) não podem
 * depender do frontend nem do navegador. É isso que permite trocar o Phaser no futuro.
 */
const FORBIDDEN = [
  { pattern: /from\s+['"]phaser['"]/, reason: 'importa o Phaser' },
  { pattern: /from\s+['"][./]*(ui-phaser|platform)\//, reason: 'importa camada externa' },
  { pattern: /\b(window|document|localStorage|speechSynthesis)\./, reason: 'usa API do navegador' },
];

function filesIn(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesIn(path) : path.endsWith('.ts') ? [path] : [];
  });
}

describe('arquitetura', () => {
  for (const layer of ['src/core', 'src/content']) {
    it(`${layer} é independente de frontend e plataforma`, () => {
      const violations = filesIn(layer).flatMap((file) => {
        const source = readFileSync(file, 'utf8');
        return FORBIDDEN.filter(({ pattern }) => pattern.test(source)).map(({ reason }) => `${file}: ${reason}`);
      });
      expect(violations).toEqual([]);
    });
  }
});
