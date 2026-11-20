/**
 * npm run validar:conteudo — roda V-01 a V-12 sobre a pasta src/content.
 * Falha (código 1) se houver erro; avisos só aparecem na saída.
 */
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { trilha } from '../src/content/trilha';
import { perguntas } from '../src/content/perguntas';
import { falas } from '../src/content/falas';
import { marca } from '../src/content/marca';
import { validarConteudo } from '../src/validacao/validarConteudo';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const pastaPublic = join(raiz, 'public');

function listar(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? listar(caminho) : [relative(pastaPublic, caminho).replace(/\\/g, '/')];
  });
}

const { erros, avisos } = validarConteudo({
  trilha,
  perguntas,
  falas,
  marca,
  arquivosPublic: listar(pastaPublic),
});

for (const a of avisos) console.warn(`  aviso  ${a}`);
for (const e of erros) console.error(`  ERRO   ${e}`);
console.log(
  `\nValidação de conteúdo: ${trilha.length} módulos, ${perguntas.length} perguntas — ${erros.length} erro(s), ${avisos.length} aviso(s).`,
);
process.exit(erros.length > 0 ? 1 : 0);
