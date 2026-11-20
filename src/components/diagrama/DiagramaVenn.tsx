/**
 * Diagrama de Venn em SVG, gerado dos mesmos dados do texto (RF-05, RN-10).
 * A e B nunca se distinguem só pela cor: cada círculo leva sua letra e o
 * contorno de B é tracejado (seção 8).
 */
import { useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { Destaque, RecursoVisual } from '../../content/tipos';
import { diferenca } from '../../domain/conjuntos';
import { fichaPertinencia } from '../../domain/descricao';
import { textos } from '../../content/textos';
import { ALTURA_CHIP, calcularLayout, type Chip, type Circulo, type Formato } from './layout';

interface Props {
  recurso: RecursoVisual;
  destaque?: Destaque;
  mini?: boolean;
  /** Texto alternativo; sem ele, o SVG é decorativo (aria-hidden). */
  rotulo?: string;
}

type EstadoChip = 'normal' | 'ativo' | 'apagado' | 'alerta';

const LIMITE_RETRATO = 520;

function naRegiao(chip: Chip, d: Extract<Destaque, { tipo: 'regiao' }>): boolean {
  const em = chip.chave.split('|');
  const [x, y] = d.de;
  switch (d.operacao) {
    case 'uniao':
      return em.includes(x) || em.includes(y);
    case 'intersecao':
      return em.includes(x) && em.includes(y);
    case 'diferenca':
      return em.includes(x) && !em.includes(y);
  }
}

/** Escolhe o formato pela largura real do espaço: retrato abaixo de 520 px. */
function useFormato(): [RefObject<HTMLDivElement | null>, Formato] {
  const ref = useRef<HTMLDivElement>(null);
  const [formato, setFormato] = useState<Formato>(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 'retrato' : 'paisagem',
  );
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setFormato(el.clientWidth > 0 && el.clientWidth < LIMITE_RETRATO ? 'retrato' : 'paisagem');
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, formato];
}

export function DiagramaVenn({ recurso, destaque = recurso.destaque, mini = false, rotulo }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [caixa, formatoMedido] = useFormato();
  const formato: Formato = mini ? 'paisagem' : formatoMedido;
  const listagem = recurso.tipo === 'listagem-e-diagrama';
  const espacado = destaque.tipo === 'contagem' || destaque.tipo === 'pertinencia' || destaque.tipo === 'inclusao';
  const layout = useMemo(
    () => calcularLayout(recurso.conjuntos, recurso.foraDeTodos, { listagem, espacado, formato }),
    [recurso.conjuntos, recurso.foraDeTodos, listagem, espacado, formato],
  );
  const { largura: W, altura: H, circulos, chips } = layout;
  const porNome = (n: string) => circulos.find((c) => c.nome === n);

  // Elementos que ficam fora do continente na inclusão (ex.: abacaxi em C, fora de A).
  const alertas = new Set<string>(
    destaque.tipo === 'inclusao'
      ? destaque.contidos.flatMap((c) =>
          diferenca(recurso.conjuntos[c] ?? [], recurso.conjuntos[destaque.continente] ?? []),
        )
      : [],
  );

  const estadoDe = (chip: Chip): EstadoChip => {
    if (destaque.tipo === 'regiao') return naRegiao(chip, destaque) ? 'ativo' : 'apagado';
    if (destaque.tipo === 'inclusao') return alertas.has(chip.nome) ? 'alerta' : 'normal';
    if (destaque.tipo === 'pertinencia') {
      if (!destaque.elementos.includes(chip.nome)) return 'normal';
      return chip.chave.split('|').includes(destaque.conjunto) ? 'ativo' : 'alerta';
    }
    return 'normal';
  };

  /** Etiqueta presa embaixo do elemento: "elemento", "banana ∈ A", "fora de A". */
  const etiquetaDe = (chip: Chip): { texto: string; tipo: 'neutra' | 'sim' | 'nao' } | null => {
    if (destaque.tipo === 'contagem' && chip.chave.split('|').includes(destaque.conjunto))
      return { texto: textos.diagrama.elemento, tipo: 'neutra' };
    if (destaque.tipo === 'pertinencia' && destaque.elementos.includes(chip.nome)) {
      const texto = fichaPertinencia(chip.nome, destaque.conjunto, recurso.conjuntos);
      return { texto, tipo: texto.includes('∉') ? 'nao' : 'sim' };
    }
    if (destaque.tipo === 'inclusao' && alertas.has(chip.nome))
      return { texto: textos.diagrama.foraDe(destaque.continente), tipo: 'nao' };
    return null;
  };

  // Região destacada: máscara calculada a partir dos círculos.
  let realce: ReactNode = null;
  let mascara: ReactNode = null;
  if (destaque.tipo === 'regiao') {
    const [cx, cy] = [porNome(destaque.de[0]), porNome(destaque.de[1])];
    if (cx && cy) {
      const c = (k: Circulo, cor: string) => <circle key={k.nome + cor} cx={k.cx} cy={k.cy} r={k.r} fill={cor} />;
      const brancos = destaque.operacao === 'uniao' ? [cx, cy] : [cx];
      const pretos = destaque.operacao === 'diferenca' ? [cy] : [];
      mascara = (
        <mask id={`m${id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <rect x={0} y={0} width={W} height={H} fill="black" />
          {brancos.map((k) => c(k, 'white'))}
          {pretos.map((k) => c(k, 'black'))}
        </mask>
      );
      realce =
        destaque.operacao === 'intersecao' ? (
          <circle className="venn__realce" cx={cy.cx} cy={cy.cy} r={cy.r} mask={`url(#m${id})`} />
        ) : (
          <rect className="venn__realce" x={0} y={0} width={W} height={H} mask={`url(#m${id})`} />
        );
    }
  }

  const contidosDestacados = destaque.tipo === 'inclusao' ? destaque.contidos : [];

  return (
    <div ref={caixa} className={`venn-caixa${mini ? ' venn-caixa--mini' : ''}`}>
      <svg
        className={`venn venn--${formato}${mini ? ' venn--mini' : ''}`}
        viewBox={`0 0 ${W} ${H}`}
        role={rotulo ? 'img' : undefined}
        aria-label={rotulo}
        aria-hidden={rotulo ? undefined : true}
        focusable="false"
      >
        {mascara && <defs>{mascara}</defs>}

        {circulos.map((c) => (
          <circle key={`f${c.nome}`} className={`venn__fundo venn__fundo--${c.cor}`} cx={c.cx} cy={c.cy} r={c.r} />
        ))}
        {realce}
        {circulos.map((c) => (
          <circle
            key={`b${c.nome}`}
            className={`venn__borda venn__borda--${c.cor}${contidosDestacados.includes(c.nome) ? ' venn__borda--forte' : ''}`}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
          />
        ))}
        {circulos.map((c) => (
          <text key={`r${c.nome}`} className={`venn__rotulo venn__rotulo--${c.cor}`} x={c.rotulo.x} y={c.rotulo.y} textAnchor="middle" dy="0.35em">
            {c.nome}
          </text>
        ))}

        {layout.listagem && (
          <g className="venn__listagem">
            {layout.listagem.itens.map((it, i) => {
              const yl = layout.listagem!.y;
              if (!it.ehElemento) {
                return (
                  <text key={i} className="venn__simbolo" x={it.x} y={yl} textAnchor="middle" dy="0.35em">
                    {it.texto}
                  </text>
                );
              }
              const destino = chips.find((c) => c.nome === it.texto);
              return (
                <g key={i}>
                  {destino && (
                    <line className="venn__ligacao" x1={it.x} y1={yl + ALTURA_CHIP / 2} x2={destino.x} y2={destino.y - ALTURA_CHIP / 2} />
                  )}
                  <g className="venn__chip venn__chip--lista">
                    <rect x={it.x - it.largura / 2} y={yl - ALTURA_CHIP / 2} width={it.largura} height={ALTURA_CHIP} rx={ALTURA_CHIP / 2} />
                    <text x={it.x} y={yl} textAnchor="middle" dy="0.35em">
                      {it.texto}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        )}

        {chips.map((chip) => {
          const estado = estadoDe(chip);
          const etiqueta = etiquetaDe(chip);
          const we = etiqueta ? Math.round([...etiqueta.texto].length * 8.4 + 22) : 0;
          // Perto do topo, a etiqueta vai acima do elemento para não invadir outro círculo.
          const acima = chip.y < 90;
          return (
            <g key={chip.nome} className={`venn__chip venn__chip--${estado}${chip.fora ? ' venn__chip--fora' : ''}`}>
              <rect
                x={chip.x - chip.largura / 2}
                y={chip.y - ALTURA_CHIP / 2}
                width={chip.largura}
                height={ALTURA_CHIP}
                rx={ALTURA_CHIP / 2}
              />
              <text x={chip.x} y={chip.y} textAnchor="middle" dy="0.35em">
                {chip.nome}
              </text>
              {etiqueta && (
                <g className={`venn__etiqueta venn__etiqueta--${etiqueta.tipo}`}>
                  <rect x={chip.x - we / 2} y={chip.y + (acima ? -43 : 19)} width={we} height={24} rx={6} />
                  <text x={chip.x} y={chip.y + (acima ? -31 : 31)} textAnchor="middle" dy="0.35em">
                    {etiqueta.texto}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {layout.legendaFora && recurso.legendaFora && (
          <text className="venn__legenda" x={layout.legendaFora.x} y={layout.legendaFora.y} textAnchor="middle" dy="0.35em">
            {recurso.legendaFora}
          </text>
        )}
      </svg>
    </div>
  );
}
