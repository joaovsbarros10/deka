/** Barra "Etapa X de 9", índice da trilha (RF-19) e passos da lição. */
import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Conceito, Etapa } from '../../content/tipos';
import { textos } from '../../content/textos';
import { Icone } from './Icone';

export function BarraProgresso({ atual, total }: { atual: number; total: number }) {
  const rotulo = textos.trilha.etapaDe(atual, total);
  return (
    <div className="progresso">
      <span className="progresso__texto">{rotulo}</span>
      <div
        className="progresso__trilho"
        role="progressbar"
        aria-label={rotulo}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={atual}
      >
        <div className="progresso__preenchido" style={{ transform: `scaleX(${atual / total})` }} />
      </div>
    </div>
  );
}

export function PassosDaLicao({ etapas, atual }: { etapas: readonly Etapa[]; atual: number }) {
  return (
    <ol className="passos" aria-label={textos.trilha.parteDe(atual, etapas.length)}>
      {etapas.map((e, i) => {
        const n = i + 1;
        const estado = n < atual ? 'feito' : n === atual ? 'atual' : 'futuro';
        return (
          <li key={i} className={`passos__item passos__item--${estado}`} aria-current={n === atual ? 'step' : undefined}>
            {estado === 'feito' ? <Icone nome="certo" tamanho={14} /> : <span className="passos__num">{n}</span>}
            <span className="passos__nome">{textos.trilha.nomesEtapas[e.tipo]}</span>
          </li>
        );
      })}
    </ol>
  );
}

interface IndiceProps {
  conceitos: readonly Conceito[];
  atual: number;
  liberado: (ordem: number) => boolean;
}

export function IndiceTrilha({ conceitos, atual, liberado }: IndiceProps) {
  const [aberto, setAberto] = useState(false);
  const painelId = useId();
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false);
        botao.current?.focus();
      }
    };
    document.addEventListener('pointerdown', fora);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', fora);
      document.removeEventListener('keydown', esc);
    };
  }, [aberto]);

  return (
    <div className="indice" ref={raiz}>
      <button
        ref={botao}
        type="button"
        className="botao botao--contorno-claro botao--compacto"
        aria-expanded={aberto}
        aria-controls={painelId}
        onClick={() => setAberto((a) => !a)}
      >
        <Icone nome={aberto ? 'fechar' : 'indice'} />
        {textos.controles.indice}
      </button>
      <div id={painelId} className="indice__painel" hidden={!aberto}>
        <ol>
          {conceitos.map((c) => {
            const ok = liberado(c.ordem);
            const eAtual = c.ordem === atual;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className={`indice__item${eAtual ? ' indice__item--atual' : ''}`}
                  disabled={!ok}
                  aria-current={eAtual ? 'page' : undefined}
                  onClick={() => {
                    setAberto(false);
                    navigate(`/trilha/${c.ordem}/1`);
                  }}
                >
                  <span className="indice__simbolo" aria-hidden="true">
                    {c.simbolo}
                  </span>
                  <span className="indice__textos">
                    <span className="indice__num">{textos.trilha.conceito(c.ordem)}</span>
                    <span className="indice__titulo">{c.titulo}</span>
                  </span>
                  {!ok && (
                    <span className="indice__estado">
                      <Icone nome="cadeado" tamanho={16} />
                      <span>{textos.trilha.bloqueado}</span>
                    </span>
                  )}
                  {eAtual && <span className="indice__estado indice__estado--atual">{textos.trilha.atual}</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
