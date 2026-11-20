import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const PASTA_AUDIO = fileURLToPath(new URL('./public/audio', import.meta.url));

/**
 * Módulo virtual "virtual:audios": a lista de áudios que existem em public/audio.
 * Assim a Dequinha só tenta tocar o que existe; fala sem arquivo fica só em texto.
 * Em desenvolvimento, colocar ou tirar um arquivo da pasta recarrega a página.
 */
function audiosDisponiveis(): Plugin {
  const id = 'virtual:audios';
  const resolvido = `\0${id}`;
  const listar = () =>
    existsSync(PASTA_AUDIO) ? readdirSync(PASTA_AUDIO).filter((f) => /\.(mp3|m4a)$/i.test(f)) : [];
  return {
    name: 'deka-audios-disponiveis',
    resolveId: (fonte) => (fonte === id ? resolvido : undefined),
    load: (modulo) => (modulo === resolvido ? `export default ${JSON.stringify(listar())};` : undefined),
    configureServer(server) {
      server.watcher.add(PASTA_AUDIO);
      const mudou = (arquivo: string) => {
        if (!resolve(arquivo).toLowerCase().startsWith(PASTA_AUDIO.toLowerCase())) return;
        const mod = server.moduleGraph.getModuleById(resolvido);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', mudou);
      server.watcher.on('unlink', mudou);
    },
  };
}

// Site estático: caminhos relativos funcionam em qualquer hospedagem (Vercel, GitHub Pages, pasta local).
export default defineConfig({
  plugins: [react(), audiosDisponiveis()],
  base: './',
  test: {
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
  },
});
