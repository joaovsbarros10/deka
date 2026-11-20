/**
 * Geometria do diagrama de Venn. Cada elemento vai para a região certa porque
 * a pertinência é calculada pelo domínio (RN-10): mudar os dados muda o desenho.
 *
 * Dois formatos: 'paisagem' (600 de largura, círculos lado a lado) e 'retrato'
 * (360 de largura, círculos empilhados), para o texto continuar legível no celular.
 */
import type { Conjuntos } from '../../content/tipos';
import { criar, estaContido, intersecao, pertence } from '../../domain/conjuntos';

export type CorConjunto = 'a' | 'b' | 'c';
export type Formato = 'paisagem' | 'retrato';

export interface Circulo {
  nome: string;
  cx: number;
  cy: number;
  r: number;
  cor: CorConjunto;
  rotulo: { x: number; y: number };
}

export interface Chip {
  nome: string;
  x: number;
  y: number;
  largura: number;
  /** Nomes dos conjuntos que contêm o elemento, na ordem declarada, unidos por "|". */
  chave: string;
  fora: boolean;
}

export interface ItemListagem {
  texto: string;
  x: number;
  largura: number;
  ehElemento: boolean;
}

export interface Layout {
  largura: number;
  altura: number;
  circulos: Circulo[];
  chips: Chip[];
  legendaFora?: { x: number; y: number };
  listagem?: { y: number; itens: ItemListagem[] };
}

interface Ancora {
  x: number;
  y: number;
  eixo: 'v' | 'h';
}

export const ALTURA_CHIP = 34;
export const larguraChip = (t: string) => Math.round([...t].length * 9.2 + 30);
const larguraTexto = (t: string, px = 13) => Math.round([...t].length * px);
const CORES: CorConjunto[] = ['a', 'b', 'c'];

function empilhar(nomes: string[], a: Ancora, gap: number): { x: number; y: number }[] {
  if (a.eixo === 'v') {
    if (nomes.length > 4) {
      const metade = Math.ceil(nomes.length / 2);
      return nomes.map((_, i) => {
        const col = i < metade ? 0 : 1;
        const lin = col === 0 ? i : i - metade;
        const linhas = col === 0 ? metade : nomes.length - metade;
        return { x: a.x + (col === 0 ? -62 : 62), y: a.y + (lin - (linhas - 1) / 2) * gap };
      });
    }
    return nomes.map((_, i) => ({ x: a.x, y: a.y + (i - (nomes.length - 1) / 2) * gap }));
  }
  const ws = nomes.map(larguraChip);
  const total = ws.reduce((s, w) => s + w, 0) + (nomes.length - 1) * 16;
  let x = a.x - total / 2;
  return ws.map((w) => {
    const p = { x: x + w / 2, y: a.y };
    x += w + 16;
    return p;
  });
}

type Geo = [cx: number, cy: number, r: number, rx: number, ry: number];

export function calcularLayout(
  conjuntos: Conjuntos,
  foraDeTodos: readonly string[] = [],
  opcoes: { listagem?: boolean; espacado?: boolean; formato?: Formato } = {},
): Layout {
  const retrato = opcoes.formato === 'retrato';
  const nomes = Object.keys(conjuntos);
  const idx = (n: string) => nomes.indexOf(n);
  const chaveDe = (el: string) => nomes.filter((n) => pertence(el, conjuntos[n])).join('|');
  const juntar = (...ns: string[]) => nomes.filter((n) => ns.includes(n)).join('|');
  const elementos = criar(nomes.flatMap((n) => conjuntos[n]));
  const fora = criar(foraDeTodos).filter((e) => !elementos.includes(e));
  const gap = opcoes.espacado ? 66 : 46;

  let largura = retrato ? 360 : 600;
  let altura = 360;
  const circulos: Circulo[] = [];
  const ancoras: Record<string, Ancora> = {};
  let ancoraFora: Ancora = { x: largura - 80, y: altura - 30, eixo: 'h' };
  let listagem: Layout['listagem'];

  const add = (nome: string, [cx, cy, r, rx, ry]: Geo) =>
    circulos.push({ nome, cx, cy, r, cor: CORES[idx(nome)] ?? 'a', rotulo: { x: rx, y: ry } });

  if (nomes.length === 1) {
    const [x] = nomes;
    const meio = largura / 2;
    if (opcoes.listagem) {
      altura = retrato ? 410 : 440;
      const cy = retrato ? 262 : 278;
      const r = retrato ? 138 : 140;
      add(x, [meio, cy, r, meio - r * 0.78 - (retrato ? 4 : 16), cy - r * 0.78]);
      ancoras[x] = { x: meio, y: cy, eixo: 'h' };
      const pecas: { texto: string; ehElemento: boolean }[] = [{ texto: `${x} = {`, ehElemento: false }];
      criar(conjuntos[x]).forEach((e, i, arr) => {
        pecas.push({ texto: e, ehElemento: true });
        if (i < arr.length - 1) pecas.push({ texto: ',', ehElemento: false });
      });
      pecas.push({ texto: '}', ehElemento: false });
      const larguras = pecas.map((p) => (p.ehElemento ? larguraChip(p.texto) : larguraTexto(p.texto)));
      const total = larguras.reduce((s, w) => s + w, 0) + (pecas.length - 1) * 5;
      let cursor = meio - total / 2;
      const itens = pecas.map((p, i) => {
        const it = { ...p, x: cursor + larguras[i] / 2, largura: larguras[i] };
        cursor += larguras[i] + 5;
        return it;
      });
      listagem = { y: 48, itens };
    } else if (retrato) {
      const r = 140;
      const cy = 24 + r;
      add(x, [meio, cy, r, 34, 34]);
      ancoras[x] = { x: meio, y: cy, eixo: 'v' };
      altura = cy + r + 20;
      if (fora.length) {
        const cabe = fora.reduce((s, e) => s + larguraChip(e) + 16, 0) < largura - 20;
        ancoraFora = cabe
          ? { x: meio, y: altura + 22, eixo: 'h' }
          : { x: meio, y: altura + 22 + ((fora.length - 1) * 50) / 2, eixo: 'v' };
        altura += (cabe ? 44 : fora.length * 50) + (opcoes.espacado ? 40 : 0) + 44;
      }
    } else {
      altura = opcoes.espacado ? 370 : 340;
      const cx = fora.length ? 272 : 300;
      const cy = altura / 2;
      add(x, [cx, cy, 138, cx - 138 * 0.78 - 14, cy - 138 * 0.78]);
      ancoras[x] = { x: cx, y: cy, eixo: 'v' };
      ancoraFora = { x: 500, y: cy - 6, eixo: 'v' };
    }
  } else if (nomes.length === 2) {
    const [x, y] = nomes;
    const yDentroDeX = estaContido(conjuntos[y], conjuntos[x]);
    const xDentroDeY = estaContido(conjuntos[x], conjuntos[y]);
    if (yDentroDeX || xDentroDeY) {
      const [continente, contido] = yDentroDeX ? [x, y] : [y, x];
      if (retrato) {
        add(continente, [180, 190, 165, 26, 34]);
        add(contido, [180, 232, 95, 112, 168]);
        ancoras[juntar(x, y)] = { x: 180, y: 236, eixo: 'v' };
        ancoras[continente] = { x: 180, y: 86, eixo: 'h' };
        altura = 370;
      } else {
        add(continente, [300, 180, 152, 300 - 152 * 0.74 - 18, 180 - 152 * 0.74]);
        add(contido, [255, 192, 92, 255 - 92 * 0.62, 192 - 92 * 0.62]);
        ancoras[juntar(x, y)] = { x: 262, y: 196, eixo: 'v' };
        ancoras[continente] = { x: 398, y: 180, eixo: 'v' };
      }
    } else if (intersecao(conjuntos[x], conjuntos[y]).length === 0) {
      if (retrato) {
        add(x, [180, 130, 112, 34, 34]);
        add(y, [180, 370, 112, 34, 274]);
        ancoras[x] = { x: 180, y: 130, eixo: 'v' };
        ancoras[y] = { x: 180, y: 370, eixo: 'v' };
        altura = 500;
      } else {
        add(x, [160, 180, 122, 160 - 122 * 0.78 - 10, 180 - 122 * 0.78]);
        add(y, [440, 180, 122, 440 + 122 * 0.78 + 10, 180 - 122 * 0.78]);
        ancoras[x] = { x: 160, y: 180, eixo: 'v' };
        ancoras[y] = { x: 440, y: 180, eixo: 'v' };
      }
    } else if (retrato) {
      add(x, [180, 140, 130, 34, 34]);
      add(y, [180, 290, 130, 34, 396]);
      ancoras[x] = { x: 180, y: 72, eixo: 'v' };
      ancoras[juntar(x, y)] = { x: 180, y: 215, eixo: 'v' };
      ancoras[y] = { x: 180, y: 358, eixo: 'v' };
      altura = 432;
    } else {
      add(x, [230, 180, 136, 112, 62]);
      add(y, [370, 180, 136, 488, 62]);
      ancoras[x] = { x: 164, y: 180, eixo: 'v' };
      ancoras[juntar(x, y)] = { x: 300, y: 180, eixo: 'v' };
      ancoras[y] = { x: 436, y: 180, eixo: 'v' };
    }
    if (fora.length) {
      ancoraFora = { x: largura / 2, y: altura + 12, eixo: 'h' };
      altura += 60;
    }
  } else {
    // 3 conjuntos: procura o arranjo "Y ⊂ X e Z cruza a borda de X" (conceito 5 e lógica).
    let arranjo: [string, string, string] | null = null;
    for (const X of nomes)
      for (const Y of nomes)
        for (const Z of nomes) {
          if (arranjo || X === Y || Y === Z || X === Z) continue;
          if (
            estaContido(conjuntos[Y], conjuntos[X]) &&
            !estaContido(conjuntos[Z], conjuntos[X]) &&
            intersecao(conjuntos[Z], conjuntos[X]).length > 0 &&
            !estaContido(conjuntos[X], conjuntos[Z])
          )
            arranjo = [X, Y, Z];
        }
    if (arranjo && retrato) {
      const [X, Y, Z] = arranjo;
      add(X, [180, 200, 165, 26, 44]);
      add(Y, [180, 180, 100, 112, 120]);
      add(Z, [180, 340, 105, 314, 424]);
      ancoras[X] = { x: 180, y: 58, eixo: 'h' };
      ancoras[juntar(X, Y)] = { x: 180, y: 150, eixo: 'v' };
      ancoras[juntar(X, Y, Z)] = { x: 180, y: 258, eixo: 'v' };
      ancoras[juntar(X, Z)] = { x: 180, y: 312, eixo: 'v' };
      ancoras[Z] = { x: 180, y: 404, eixo: 'v' };
      altura = 462;
      ancoraFora = { x: 300, y: 450, eixo: 'h' };
    } else if (arranjo) {
      const [X, Y, Z] = arranjo;
      altura = 390;
      add(X, [250, 190, 160, 96, 66]);
      add(Y, [228, 190, 118, 166, 126]);
      add(Z, [385, 190, 110, 478, 92]);
      ancoras[juntar(X, Y, Z)] = { x: 312, y: 190, eixo: 'v' };
      ancoras[juntar(X, Y)] = { x: 168, y: 190, eixo: 'v' };
      ancoras[juntar(X, Z)] = { x: 378, y: 190, eixo: 'v' };
      ancoras[X] = { x: 250, y: 52, eixo: 'h' };
      ancoras[Z] = { x: 452, y: 190, eixo: 'v' };
      ancoraFora = { x: 540, y: 360, eixo: 'h' };
    } else {
      largura = 600;
      altura = 420;
      const [p, q, r] = nomes;
      add(p, [240, 160, 120, 110, 50]);
      add(q, [360, 160, 120, 490, 50]);
      add(r, [300, 262, 120, 450, 370]);
      ancoras[p] = { x: 182, y: 128, eixo: 'v' };
      ancoras[q] = { x: 418, y: 128, eixo: 'v' };
      ancoras[r] = { x: 300, y: 330, eixo: 'v' };
      ancoras[juntar(p, q)] = { x: 300, y: 112, eixo: 'v' };
      ancoras[juntar(p, r)] = { x: 230, y: 240, eixo: 'v' };
      ancoras[juntar(q, r)] = { x: 370, y: 240, eixo: 'v' };
      ancoras[juntar(p, q, r)] = { x: 300, y: 196, eixo: 'v' };
      ancoraFora = { x: 80, y: 395, eixo: 'h' };
    }
  }

  // Agrupa os elementos por região e posiciona cada grupo na sua âncora.
  const grupos = new Map<string, string[]>();
  for (const e of elementos) {
    const k = chaveDe(e);
    grupos.set(k, [...(grupos.get(k) ?? []), e]);
  }
  const chips: Chip[] = [];
  for (const [chave, grupo] of grupos) {
    const ancora = ancoras[chave] ?? ancoraFora;
    empilhar(grupo, ancora, gap).forEach((p, i) =>
      chips.push({ nome: grupo[i], ...p, largura: larguraChip(grupo[i]), chave, fora: false }),
    );
  }
  let legendaFora: Layout['legendaFora'];
  if (fora.length) {
    const pos = empilhar(fora, ancoraFora, opcoes.espacado ? 66 : 50);
    pos.forEach((p, i) => chips.push({ nome: fora[i], ...p, largura: larguraChip(fora[i]), chave: '', fora: true }));
    const baixo = Math.max(...pos.map((p) => p.y));
    legendaFora = { x: ancoraFora.x, y: baixo + (opcoes.espacado ? 62 : 40) };
  }

  return { largura, altura, circulos, chips, legendaFora, listagem };
}
