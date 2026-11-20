/**
 * Julgamento de afirmações da linguagem lógica (RF-14, V-09, RN-08).
 * ∈ e ∉ ligam elemento a conjunto; ⊂, ⊄ e ⊃ ligam conjunto a conjunto.
 * Afirmação que mistura os tipos (elemento com ⊂, conjunto com ∈) é falsa.
 */
import type { Conjuntos } from '../content/tipos';
import { criar, estaContido, pertence } from './conjuntos';

export type Relacao = '∈' | '∉' | '⊂' | '⊄' | '⊃';

export interface AfirmacaoAnalisada {
  esquerda: string;
  relacao: Relacao;
  direita: string;
}

type Termo = { tipo: 'conjunto'; elementos: string[] } | { tipo: 'elemento'; valor: string };

export function analisarAfirmacao(texto: string): AfirmacaoAnalisada | null {
  const m = texto.trim().match(/^(.+?)\s*([∈∉⊂⊄⊃])\s*(.+)$/u);
  if (!m) return null;
  return { esquerda: m[1].trim(), relacao: m[2] as Relacao, direita: m[3].trim() };
}

function lerTermo(t: string, conjuntos: Conjuntos): Termo {
  if (t in conjuntos) return { tipo: 'conjunto', elementos: criar(conjuntos[t]) };
  const literal = t.match(/^\{(.*)\}$/);
  if (literal) {
    const itens = literal[1].trim() === '' ? [] : literal[1].split(',');
    return { tipo: 'conjunto', elementos: criar(itens) };
  }
  return { tipo: 'elemento', valor: t };
}

/** Valor de verdade calculado pelo domínio. Lança erro se o texto não tiver a forma esperada. */
export function julgar(texto: string, conjuntos: Conjuntos): boolean {
  const a = analisarAfirmacao(texto);
  if (!a) throw new Error(`afirmação fora da forma "esquerda símbolo direita": ${texto}`);
  const esq = lerTermo(a.esquerda, conjuntos);
  const dir = lerTermo(a.direita, conjuntos);
  if (dir.tipo !== 'conjunto') throw new Error(`o lado direito de "${texto}" não é um conjunto`);

  switch (a.relacao) {
    case '∈':
      return esq.tipo === 'elemento' && pertence(esq.valor, dir.elementos);
    case '∉':
      return esq.tipo === 'elemento' && !pertence(esq.valor, dir.elementos);
    case '⊂':
      return esq.tipo === 'conjunto' && estaContido(esq.elementos, dir.elementos);
    case '⊄':
      return esq.tipo === 'conjunto' && !estaContido(esq.elementos, dir.elementos);
    case '⊃':
      return esq.tipo === 'conjunto' && estaContido(dir.elementos, esq.elementos);
  }
}

/** Verdadeiro se a afirmação liga tipos errados (ex.: "maçã ⊂ A", "B ∈ A"). */
export function misturaTipos(texto: string, conjuntos: Conjuntos): boolean {
  const a = analisarAfirmacao(texto);
  if (!a) return false;
  const esq = lerTermo(a.esquerda, conjuntos);
  const deElemento = a.relacao === '∈' || a.relacao === '∉';
  return deElemento ? esq.tipo === 'conjunto' : esq.tipo === 'elemento';
}
