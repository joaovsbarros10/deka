import { describe, expect, it } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { trilha } from '../../content/trilha';
import { perguntas } from '../../content/perguntas';
import { falas } from '../../content/falas';
import { marca } from '../../content/marca';
import { validarConteudo } from '../../validacao/validarConteudo';
import type { Conceito, Pergunta } from '../../content/tipos';

const pastaPublic = fileURLToPath(new URL('../../../public', import.meta.url));
const listar = (pasta: string): string[] =>
  readdirSync(pasta).flatMap((n) => {
    const c = join(pasta, n);
    return statSync(c).isDirectory() ? listar(c) : [relative(pastaPublic, c).replace(/\\/g, '/')];
  });

const base = { trilha, perguntas, falas };

describe('validação de conteúdo (V-01 a V-12)', () => {
  it('o conteúdo real passa sem erros, com logo e arte em public', () => {
    const r = validarConteudo({ ...base, marca, arquivosPublic: listar(pastaPublic) });
    expect(r.erros).toEqual([]);
  });

  it('V-06: incluir a 11ª pergunta falha (T-09)', () => {
    const onze: Pergunta[] = [...perguntas, { ...perguntas[0], id: 'P11' }];
    const r = validarConteudo({ ...base, perguntas: onze });
    expect(r.erros.some((e) => e.startsWith('V-06'))).toBe(true);
  });

  it('V-02: conceito sem uma etapa derruba o build (T-13)', () => {
    const t: Conceito[] = trilha.map((c) =>
      c.ordem === 3 ? { ...c, etapas: c.etapas.filter((e) => e.tipo !== 'exemplo') } : c,
    );
    const r = validarConteudo({ ...base, trilha: t });
    expect(r.erros.some((e) => e.startsWith('V-02 conceito 3'))).toBe(true);
  });

  it('V-07: pergunta com duas corretas falha', () => {
    const p: Pergunta[] = perguntas.map((q) =>
      q.id === 'P1' ? { ...q, alternativas: q.alternativas.map((a) => ({ ...a, correta: true })) } : q,
    );
    expect(validarConteudo({ ...base, perguntas: p }).erros.some((e) => e.startsWith('V-07 pergunta P1'))).toBe(true);
  });

  it('V-08: errada igual ao resultado (com repetição) é recusada', () => {
    const p: Pergunta[] = perguntas.map((q) =>
      q.id === 'P7'
        ? {
            ...q,
            alternativas: q.alternativas.map((a) =>
              a.id === 'a' ? { ...a, conjunto: ['natação', 'futsal', 'futsal'] } : a,
            ),
          }
        : q,
    );
    expect(validarConteudo({ ...base, perguntas: p }).erros.some((e) => e.startsWith('V-08 pergunta P7'))).toBe(true);
  });

  it('V-09: afirmação marcada com o valor errado é recusada (T-14)', () => {
    const t: Conceito[] = trilha.map((c) =>
      c.ordem === 9
        ? {
            ...c,
            etapas: c.etapas.map((e) =>
              e.tipo === 'pratica'
                ? { ...e, afirmacoes: e.afirmacoes!.map((a, i) => (i === 2 ? { ...a, verdadeira: true } : a)) }
                : e,
            ),
          }
        : c,
    );
    const erros = validarConteudo({ ...base, trilha: t }).erros;
    expect(erros.some((e) => e.includes('maçã ⊂ A'))).toBe(true);
  });

  it('V-12: arte ausente é erro; áudio ausente é só aviso', () => {
    const r = validarConteudo({ ...base, marca, arquivosPublic: ['marca/logo-deka.webp'] });
    expect(r.erros.some((e) => e.startsWith('V-12'))).toBe(true);
    expect(r.avisos.some((a) => a.includes('apresentacao.mp3'))).toBe(true);
  });

  it('banco tem exatamente 10 perguntas', () => {
    expect(perguntas).toHaveLength(10);
  });
});
