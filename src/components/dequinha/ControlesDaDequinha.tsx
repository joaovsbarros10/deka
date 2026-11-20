/** Botões de alternância Voz e Movimento: em todas as telas, ≥ 44×44 px, com aria-pressed. */
import { textos } from '../../content/textos';
import { usePreferencias } from '../../app/PreferenciasProvider';
import { Icone } from '../ui/Icone';

export function ControlesDaDequinha() {
  const { voz, movimento, alternarVoz, alternarMovimento } = usePreferencias();
  const t = textos.controles;
  return (
    <div className="controles" role="group" aria-label="Controles da Dequinha">
      <button
        type="button"
        className="alternancia"
        aria-pressed={voz}
        onClick={alternarVoz}
        title={`${t.voz} ${voz ? t.ligada : t.desligada}`}
      >
        <Icone nome={voz ? 'voz' : 'mudo'} />
        <span>{t.voz}</span>
      </button>
      <button
        type="button"
        className="alternancia"
        aria-pressed={movimento}
        onClick={alternarMovimento}
        title={`${t.movimento} ${movimento ? t.ligado : t.desligado}`}
      >
        <Icone nome={movimento ? 'movimento' : 'parado'} />
        <span>{t.movimento}</span>
      </button>
    </div>
  );
}
