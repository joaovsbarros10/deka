/**
 * A Dequinha (RF-21). Uma pose de arte; cada expressão ganha um gesto em CSS
 * (só transform e opacity) que roda uma vez ao aparecer, um respiro leve em
 * repouso e um balanço suave enquanto a voz toca. Com o Movimento desligado
 * ou prefers-reduced-motion, fica parada na pose da expressão.
 */
import type { Expressao } from '../../content/tipos';
import { marca } from '../../content/marca';
import { textos } from '../../content/textos';

interface Props {
  expressao: Expressao;
  falando?: boolean;
  tamanho?: 'grande' | 'medio' | 'avatar';
  /** Muda quando a fala muda, para o gesto rodar de novo. */
  gatilho?: string | number;
  className?: string;
}

function Decoracao({ expressao }: { expressao: Expressao }) {
  switch (expressao) {
    case 'comemorando':
      return (
        <span className="dq__deco dq__confete" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <i key={i} />
          ))}
        </span>
      );
    case 'pensativa':
      return (
        <span className="dq__deco dq__pensamento" aria-hidden="true">
          <i />
          <i />
          <b>?</b>
        </span>
      );
    case 'incentivando':
      return (
        <span className="dq__deco dq__brilhos" aria-hidden="true">
          <i>✦</i>
          <i>✦</i>
          <i>✦</i>
        </span>
      );
    case 'apontando':
      return (
        <span className="dq__deco dq__seta" aria-hidden="true">
          <i />
          <i />
        </span>
      );
    case 'acenando':
      return (
        <span className="dq__deco dq__aceno" aria-hidden="true">
          <i />
          <i />
        </span>
      );
    default:
      return null;
  }
}

export function Dequinha({ expressao, falando = false, tamanho = 'medio', gatilho, className = '' }: Props) {
  return (
    <div
      className={`dq dq--${tamanho} dq--${expressao}${falando ? ' dq--falando' : ''} ${className}`}
      role="img"
      aria-label={`${textos.dequinha.rotulo}, ${textos.dequinha.expressoes[expressao]}`}
    >
      <div className="dq__entrada">
        <div className="dq__gesto" key={`${expressao}-${gatilho ?? ''}`}>
          <div className="dq__respiro">
            <div className="dq__voz">
              <img
                className="dq__arte"
                src={`${import.meta.env.BASE_URL}${marca.dequinha[expressao]}`}
                alt=""
                width={640}
                height={413}
                draggable={false}
                decoding="async"
              />
            </div>
          </div>
          <Decoracao expressao={expressao} />
        </div>
      </div>
    </div>
  );
}
