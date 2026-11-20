/**
 * Operações de conjuntos (seção 10). Todas puras, sem efeitos colaterais.
 * Os elementos são textos normalizados em NFC, sem repetição, na ordem de aparição.
 */
import type { Operacao } from '../content/tipos';

export type Conjunto = readonly string[];

const normalizar = (s: string) => s.normalize('NFC').trim();

/** Normaliza e remove repetições, mantendo a ordem de aparição. */
export function criar(elementos: Iterable<string>): string[] {
  const vistos = new Set<string>();
  const saida: string[] = [];
  for (const bruto of elementos) {
    const e = normalizar(bruto);
    if (!vistos.has(e)) {
      vistos.add(e);
      saida.push(e);
    }
  }
  return saida;
}

export function uniao(a: Conjunto, b: Conjunto): string[] {
  return criar([...a, ...b]);
}

export function intersecao(a: Conjunto, b: Conjunto): string[] {
  const emB = new Set(criar(b));
  return criar(a).filter((x) => emB.has(x));
}

export function diferenca(a: Conjunto, b: Conjunto): string[] {
  const emB = new Set(criar(b));
  return criar(a).filter((x) => !emB.has(x));
}

export function pertence(x: string, a: Conjunto): boolean {
  return criar(a).includes(normalizar(x));
}

/** Verdadeiro se todo elemento de a está em b (vale a igualdade: A ⊂ A). */
export function estaContido(a: Conjunto, b: Conjunto): boolean {
  const emB = new Set(criar(b));
  return criar(a).every((x) => emB.has(x));
}

/** Igualdade como conjunto: ignora ordem e repetição. */
export function iguais(a: Conjunto, b: Conjunto): boolean {
  return estaContido(a, b) && estaContido(b, a);
}

/** As três regiões do diagrama de dois conjuntos. */
export function regioes(a: Conjunto, b: Conjunto) {
  return { soA: diferenca(a, b), ambos: intersecao(a, b), soB: diferenca(b, a) };
}

export function operar(op: Operacao, a: Conjunto, b: Conjunto): string[] {
  switch (op) {
    case 'uniao':
      return uniao(a, b);
    case 'intersecao':
      return intersecao(a, b);
    case 'diferenca':
      return diferenca(a, b);
  }
}

export const SIMBOLO_OPERACAO: Record<Operacao, string> = {
  uniao: '∪',
  intersecao: '∩',
  diferenca: '−',
};

export const NOME_OPERACAO: Record<Operacao, string> = {
  uniao: 'união',
  intersecao: 'interseção',
  diferenca: 'diferença',
};

/** Texto com chaves e vírgulas, usado no feedback: "{futsal, natação}". Vazio vira ∅. */
export function formatar(c: Conjunto): string {
  const elems = criar(c);
  return elems.length === 0 ? '∅' : `{${elems.join(', ')}}`;
}

/** "maçã, banana e uva" — para textos alternativos e legendas. */
export function porExtenso(c: Conjunto): string {
  const elems = criar(c);
  if (elems.length === 0) return 'nenhum elemento';
  if (elems.length === 1) return elems[0];
  return `${elems.slice(0, -1).join(', ')} e ${elems[elems.length - 1]}`;
}
