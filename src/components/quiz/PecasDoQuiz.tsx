/** Peças do quiz: degraus de progresso, alternativa e diálogo de saída. */
import { useEffect, useRef } from 'react';
import type { Alternativa as Alt } from '../../content/tipos';
import { textos } from '../../content/textos';
import { Icone } from '../ui/Icone';

/**
 * Degraus: a mecânica própria da DEKA (RF-08). Uma escada que sobe a cada
 * pergunta respondida. Sem valores, sem prêmios e sem distinguir acerto de
 * erro, para ser desafio sem pressão.
 */
export function Degraus({ total, respondidas, atual }: { total: number; respondidas: number; atual: number }) {
  const t = textos.quiz;
  return (
    <ol className="degraus" aria-label={t.degraus}>
      {Array.from({ length: total }, (_, i) => {
        const estado = i < respondidas ? 'feito' : i === atual ? 'atual' : 'futuro';
        const status = estado === 'feito' ? 'respondida' : estado === 'atual' ? t.degrauStatus.atual : t.degrauStatus.futura;
        return (
          <li
            key={i}
            className={`degraus__degrau degraus__degrau--${estado}`}
            style={{ ['--altura' as string]: `${28 + (72 * (i + 1)) / total}%` }}
            aria-current={estado === 'atual' ? 'step' : undefined}
          >
            <span className="sr-only">
              {t.perguntaDe(i + 1, total)}: {status}
            </span>
            <span className="degraus__num" aria-hidden="true">
              {i + 1}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

interface AltProps {
  alternativa: Alt;
  letra: string;
  travada: boolean;
  escolhida: boolean;
  onEscolher: () => void;
}

export function Alternativa({ alternativa, letra, travada, escolhida, onEscolher }: AltProps) {
  const t = textos.quiz;
  let estado = '';
  if (travada) estado = alternativa.correta ? 'certa' : escolhida ? 'errada' : 'apagada';
  return (
    <li>
      <button
        type="button"
        className={`alternativa${estado ? ` alternativa--${estado}` : ''}`}
        onClick={onEscolher}
        disabled={travada}
        aria-pressed={travada ? escolhida : undefined}
      >
        <span className="alternativa__letra" aria-hidden="true">
          {letra}
        </span>
        <span className="alternativa__texto">
          <span className="sr-only">Alternativa {letra}: </span>
          {alternativa.texto}
        </span>
        {travada && alternativa.correta && (
          <span className="alternativa__selo alternativa__selo--certa">
            <Icone nome="certo" tamanho={16} /> {t.respostaCerta}
          </span>
        )}
        {travada && escolhida && !alternativa.correta && (
          <span className="alternativa__selo alternativa__selo--errada">
            <Icone nome="alerta" tamanho={16} /> {t.suaResposta}
          </span>
        )}
      </button>
    </li>
  );
}

/** Confirmação ao sair do quiz pela navegação do próprio site (D-12). */
export function ConfirmarSaida({ aberto, onFicar, onSair }: { aberto: boolean; onFicar: () => void; onSair: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = textos.quiz;
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal();
    if (!aberto && d.open) d.close();
  }, [aberto]);
  return (
    <dialog
      ref={ref}
      className="dialogo"
      aria-labelledby="dialogo-titulo"
      onCancel={(e) => {
        e.preventDefault();
        onFicar();
      }}
    >
      <h2 id="dialogo-titulo">{t.sairTitulo}</h2>
      <p>{t.sairTexto}</p>
      <div className="dialogo__acoes">
        <button type="button" className="botao botao--primario" onClick={onFicar} autoFocus>
          {t.sairFicar}
        </button>
        <button type="button" className="botao botao--contorno" onClick={onSair}>
          {t.sairConfirmar}
        </button>
      </div>
    </dialog>
  );
}
