/**
 * npm run roteiro:voz — gera docs/roteiro-de-voz.md e docs/roteiro-de-voz.csv
 * com todas as falas da Dequinha: nome do arquivo, onde aparece e o texto a falar.
 * Rode de novo sempre que mudar um texto em src/content.
 */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { trilha } from '../src/content/trilha';
import { perguntas } from '../src/content/perguntas';
import { falas } from '../src/content/falas';
import { montarRoteiro } from '../src/validacao/roteiroDeVoz';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const pastaAudio = join(raiz, 'public', 'audio');
const pastaDocs = join(raiz, 'docs');
const existentes = new Set(existsSync(pastaAudio) ? readdirSync(pastaAudio) : []);
const itens = montarRoteiro({ trilha, perguntas, falas }, { completo: true });
const prontos = itens.filter((i) => existentes.has(i.arquivo)).length;

const celula = (t: string) => t.replace(/\|/g, '\\|');
const md: string[] = [
  '# Roteiro de voz da Dequinha',
  '',
  `${itens.length} falas · ${prontos} com áudio · ${itens.length - prontos} faltando.`,
  'Gerado por `npm run roteiro:voz` a partir de `src/content`. Não edite à mão: mude o conteúdo e gere de novo.',
  '',
  '## Como gerar os áudios',
  '',
  '1. Use sempre a mesma voz da Dequinha, com as mesmas configurações, para todas as falas.',
  '2. Copie o texto da coluna **O que a Dequinha fala** (não o da tela: ele já vem com os símbolos trocados por palavras).',
  '3. Salve cada áudio com o **nome exato** da coluna Arquivo, em MP3 (de preferência 128 kbps, mono), na pasta `public/audio/`.',
  '4. Com o site rodando (`npm run dev`), a página recarrega sozinha e a fala passa a tocar. Fala sem arquivo continua só em texto.',
  '5. Rode `npm run validar:conteudo` para ver o que ainda falta.',
  '',
  'Dicas: deixe uns 0,3 s de silêncio no começo e no fim, mantenha o mesmo volume em todos, e evite OGG e WebM (o Safari do iPhone pode não tocar).',
  'As falas finais do resultado são gravadas sem os números: "X de N acertos" aparece só na tela.',
  '',
  '| # | Arquivo | Status | Onde aparece | O que a Dequinha fala |',
  '| --- | --- | --- | --- | --- |',
  ...itens.map(
    (i, n) =>
      `| ${n + 1} | \`${i.arquivo}\` | ${existentes.has(i.arquivo) ? '✅ pronto' : '⬜ falta'} | ${celula(i.onde)} | ${celula(i.falado)} |`,
  ),
  '',
];
if (existentes.has('apresentacao.mp3')) {
  md.push(
    '> `apresentacao.mp3` é o arquivo `voice_preview_dekinha.mp3` enviado no início. Confira se ele diz exatamente o texto acima; se não, gere de novo com o mesmo nome.',
    '',
  );
}

const csv = [
  'numero;arquivo;onde;fala',
  ...itens.map((i, n) => [n + 1, i.arquivo, i.onde, i.falado].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')),
].join('\r\n');

mkdirSync(pastaDocs, { recursive: true });
writeFileSync(join(pastaDocs, 'roteiro-de-voz.md'), md.join('\n'), 'utf8');
writeFileSync(join(pastaDocs, 'roteiro-de-voz.csv'), `﻿${csv}\r\n`, 'utf8');
console.log(`Roteiro de voz: ${itens.length} falas (${prontos} com áudio). Arquivos em docs/roteiro-de-voz.md e .csv`);
