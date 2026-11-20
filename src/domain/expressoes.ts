/**
 * Expressões de conjuntos dentro das falas: {{A}}, {{#A}}, {{A ∪ B}}, {{#A ∩ B}}…
 * Assim, todo resultado exibido no texto é calculado pelo domínio (RN-10):
 * mudar um conjunto no arquivo de conteúdo muda texto e diagrama juntos.
 */
import type { Conjuntos, Operacao } from '../content/tipos';
import { criar, formatar, operar, porExtenso } from './conjuntos';

/**
 * {{A ∪ B}} → "{vôlei, futsal, …}"   {{#A}} → "3"
 * {{lista A}} → "maçã, banana e uva"   {{chaves A}} → "abre chaves, maçã, banana, uva, fecha chaves"
 * (as duas últimas servem ao texto falado da Dequinha)
 */
const PADRAO = /\{\{\s*(#|lista\s+|chaves\s+)?\s*([^{}]+?)\s*\}\}/g;
const OPERADORES: Record<string, Operacao> = {
  '∪': 'uniao',
  '∩': 'intersecao',
  '−': 'diferenca',
  '-': 'diferenca',
};

function avaliar(expr: string, conjuntos: Conjuntos): string[] {
  const m = expr.match(/^(\S+)\s*([∪∩−-])\s*(\S+)$/);
  if (m) {
    const [, x, op, y] = m;
    if (!(x in conjuntos)) throw new Error(`conjunto "${x}" não declarado`);
    if (!(y in conjuntos)) throw new Error(`conjunto "${y}" não declarado`);
    return operar(OPERADORES[op], conjuntos[x], conjuntos[y]);
  }
  const nome = expr.trim();
  if (!(nome in conjuntos)) throw new Error(`conjunto "${nome}" não declarado`);
  return criar(conjuntos[nome]);
}

/** Substitui as expressões {{ }} pelos resultados calculados. */
export function resolverExpressoes(texto: string, conjuntos: Conjuntos): string {
  return texto.replace(PADRAO, (_, modo: string | undefined, expr: string) => {
    const resultado = avaliar(expr, conjuntos);
    const m = modo?.trim();
    if (m === '#') return String(resultado.length);
    if (m === 'lista') return porExtenso(resultado);
    if (m === 'chaves')
      return resultado.length ? `abre chaves, ${resultado.join(', ')}, fecha chaves` : 'abre e fecha chaves';
    return formatar(resultado);
  });
}

/** Lista os problemas das expressões de um texto (usado pelo validador). */
export function conferirExpressoes(texto: string, conjuntos: Conjuntos): string[] {
  const erros: string[] = [];
  for (const m of texto.matchAll(PADRAO)) {
    try {
      avaliar(m[2], conjuntos);
    } catch (e) {
      erros.push(`${m[0]}: ${(e as Error).message}`);
    }
  }
  return erros;
}

/** Preenche variáveis simples: {n}, {total}, {dica}, {explicacao}. */
export function preencher(texto: string, vars: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (inteiro, nome: string) =>
    nome in vars ? String(vars[nome]) : inteiro,
  );
}
