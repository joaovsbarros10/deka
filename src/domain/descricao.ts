/**
 * Textos derivados dos dados de um recurso visual: fichas (∈/∉, ⊂/⊄),
 * legendas de resultado e o texto alternativo do diagrama (RF-05, V-11).
 * Tudo é calculado pelo domínio, nunca digitado à mão (RN-10).
 */
import type { Conjuntos, Destaque, RecursoVisual } from '../content/tipos';
import {
  criar,
  diferenca,
  estaContido,
  formatar,
  intersecao,
  operar,
  pertence,
  porExtenso,
  SIMBOLO_OPERACAO,
  NOME_OPERACAO,
} from './conjuntos';

export function fichaPertinencia(elemento: string, nome: string, conjuntos: Conjuntos): string {
  return `${elemento} ${pertence(elemento, conjuntos[nome] ?? []) ? '∈' : '∉'} ${nome}`;
}

export function fichaInclusao(contido: string, continente: string, conjuntos: Conjuntos): string {
  const ok = estaContido(conjuntos[contido] ?? [], conjuntos[continente] ?? []);
  return `${contido} ${ok ? '⊂' : '⊄'} ${continente}`;
}

/** Linhas de resultado exibidas sob o diagrama, ex.: "A ∩ B = {futsal, natação}". */
export function legendasDoDestaque(d: Destaque, conjuntos: Conjuntos): string[] {
  switch (d.tipo) {
    case 'regiao': {
      const [x, y] = d.de;
      const r = operar(d.operacao, conjuntos[x] ?? [], conjuntos[y] ?? []);
      return [`${x} ${SIMBOLO_OPERACAO[d.operacao]} ${y} = ${formatar(r)}`];
    }
    case 'inclusao':
      return d.contidos.map((c) => fichaInclusao(c, d.continente, conjuntos));
    case 'contagem': {
      const n = criar(conjuntos[d.conjunto] ?? []).length;
      return [`${d.conjunto} tem ${n} ${n === 1 ? 'elemento' : 'elementos'}`];
    }
    case 'pertinencia':
      return d.elementos.map((e) => fichaPertinencia(e, d.conjunto, conjuntos));
    case 'nenhum':
      return [];
  }
}

function descreverRelacoes(conjuntos: Conjuntos): string[] {
  const nomes = Object.keys(conjuntos);
  const frases: string[] = [];
  for (let i = 0; i < nomes.length; i++) {
    for (let j = i + 1; j < nomes.length; j++) {
      const [x, y] = [nomes[i], nomes[j]];
      const cx = conjuntos[x];
      const cy = conjuntos[y];
      if (estaContido(cy, cx)) frases.push(`${y} está desenhado inteiro dentro de ${x}`);
      else if (estaContido(cx, cy)) frases.push(`${x} está desenhado inteiro dentro de ${y}`);
      else if (intersecao(cx, cy).length > 0)
        frases.push(`${x} e ${y} se cruzam, e na sobreposição fica ${porExtenso(intersecao(cx, cy))}`);
      else frases.push(`${x} e ${y} não se tocam`);
    }
  }
  return frases;
}

function descreverDestaque(d: Destaque, conjuntos: Conjuntos): string {
  switch (d.tipo) {
    case 'nenhum':
      return '';
    case 'regiao': {
      const [x, y] = d.de;
      const r = operar(d.operacao, conjuntos[x] ?? [], conjuntos[y] ?? []);
      return `Destaque: a região da ${NOME_OPERACAO[d.operacao]} ${x} ${SIMBOLO_OPERACAO[d.operacao]} ${y}, com ${porExtenso(r)}.`;
    }
    case 'pertinencia':
      return `Fichas: ${d.elementos.map((e) => fichaPertinencia(e, d.conjunto, conjuntos)).join('; ')}.`;
    case 'inclusao': {
      const partes = d.contidos.map((c) => {
        const fora = diferenca(conjuntos[c] ?? [], conjuntos[d.continente] ?? []);
        const ficha = fichaInclusao(c, d.continente, conjuntos);
        return fora.length
          ? `${ficha}, porque ${porExtenso(fora)} está em ${c} e fora de ${d.continente}`
          : ficha;
      });
      return `Destaque: ${partes.join('; ')}.`;
    }
    case 'contagem': {
      const n = criar(conjuntos[d.conjunto] ?? []).length;
      return `Cada elemento de ${d.conjunto} tem a etiqueta "elemento". ${d.conjunto} tem ${n} elementos.`;
    }
  }
}

/** Texto alternativo gerado dos dados e do destaque (V-11). */
export function descreverRecurso(r: RecursoVisual): string {
  if (r.textoAlternativo) return r.textoAlternativo;
  if (r.tipo === 'quadro-simbolos') {
    if (!r.quadro) return '';
    const linhas = r.quadro.linhas.map((l) => l.celulas.join(', ')).join('. ');
    return `Quadro "${r.quadro.titulo}". Colunas: ${r.quadro.colunas.join(', ')}. ${linhas}.`;
  }
  const partes: string[] = [
    r.tipo === 'listagem-e-diagrama'
      ? 'Listagem e diagrama do mesmo conjunto, com linhas ligando cada elemento nas duas formas.'
      : 'Diagrama de conjuntos.',
  ];
  for (const [nome, elems] of Object.entries(r.conjuntos)) {
    partes.push(`${nome} = ${formatar(elems)}.`);
  }
  const rel = descreverRelacoes(r.conjuntos);
  if (rel.length) partes.push(`${rel.join('; ')}.`.replace(/^./, (c) => c.toUpperCase()));
  if (r.foraDeTodos?.length) {
    partes.push(
      `Fora dos conjuntos, com borda pontilhada: ${porExtenso(r.foraDeTodos)}${r.legendaFora ? ` (${r.legendaFora})` : ''}.`,
    );
  }
  const d = descreverDestaque(r.destaque, r.conjuntos);
  if (d) partes.push(d);
  if (r.comparar) {
    const c = descreverDestaque(r.comparar, r.conjuntos);
    if (c) partes.push(`Diagrama menor, para comparar. ${c}`);
  }
  return partes.join(' ');
}
