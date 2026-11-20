/** Recurso visual de uma etapa ou pergunta: diagrama, listagem e diagrama, ou quadro de símbolos. */
import type { QuadroSimbolos as Quadro, RecursoVisual as Recurso } from '../../content/tipos';
import { descreverRecurso, legendasDoDestaque } from '../../domain/descricao';
import { DiagramaVenn } from './DiagramaVenn';
import { Icone } from '../ui/Icone';

function QuadroSimbolos({ quadro }: { quadro: Quadro }) {
  return (
    <figure className="quadro">
      <figcaption className="quadro__titulo">{quadro.titulo}</figcaption>
      <div className="quadro__rolagem">
        <table>
          <thead>
            <tr>
              {quadro.colunas.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quadro.linhas.map((l, i) => (
              <tr key={i} className={l.tom ? `quadro__linha--${l.tom}` : undefined}>
                {l.celulas.map((cel, j) => (
                  <td key={j} className={j === (quadro.colunaAfirmacao ?? -1) || /^[∈∉⊂⊄⊃]$/.test(cel) ? 'quadro__mat' : undefined}>
                    {j === 0 && l.tom && (
                      <span className={`quadro__selo quadro__selo--${l.tom}`}>
                        <Icone nome={l.tom === 'certo' ? 'certo' : 'fechar'} tamanho={16} />
                        <span className="sr-only">{l.tom === 'certo' ? 'Uso certo: ' : 'Erro comum: '}</span>
                      </span>
                    )}
                    {cel}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {quadro.nota && <p className="quadro__nota">{quadro.nota}</p>}
    </figure>
  );
}

export function RecursoVisual({ recurso }: { recurso: Recurso }) {
  if (recurso.tipo === 'quadro-simbolos') {
    return recurso.quadro ? <QuadroSimbolos quadro={recurso.quadro} /> : null;
  }
  const alt = descreverRecurso(recurso);
  const legendas =
    recurso.destaque.tipo === 'pertinencia' ? [] : legendasDoDestaque(recurso.destaque, recurso.conjuntos);
  const comparar = recurso.comparar;
  return (
    <figure className={`recurso${comparar ? ' recurso--comparar' : ''}`}>
      <div className="recurso__principal">
        <DiagramaVenn recurso={recurso} rotulo={alt} />
        {legendas.length > 0 && (
          <figcaption className="recurso__legendas">
            {legendas.map((l) => (
              <span key={l} className="formula">
                {l}
              </span>
            ))}
          </figcaption>
        )}
      </div>
      {comparar && (
        <div className="recurso__secundario">
          <DiagramaVenn recurso={recurso} destaque={comparar} mini />
          <div className="recurso__legendas">
            {legendasDoDestaque(comparar, recurso.conjuntos).map((l) => (
              <span key={l} className="formula formula--suave">
                {l}
              </span>
            ))}
          </div>
        </div>
      )}
    </figure>
  );
}
