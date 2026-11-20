/**
 * Lição (conceitos 1 a 8) e módulo de linguagem lógica (9). Cada etapa é uma
 * entrada do histórico: o Voltar do navegador volta uma etapa (seção 11).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ConteudoRepositorio } from '../content';
import type { Conceito, Fala } from '../content/tipos';
import { resolverExpressoes } from '../domain/expressoes';
import { conceitoLiberado, TOTAL_CONCEITOS } from '../domain/fluxo';
import { useFluxo } from '../app/FluxoProvider';
import { useAudio, useFala } from '../app/AudioProvider';
import { Dequinha } from '../components/dequinha/Dequinha';
import { Balao } from '../components/dequinha/Balao';
import { RecursoVisual } from '../components/diagrama/RecursoVisual';
import { BarraProgresso, IndiceTrilha, PassosDaLicao } from '../components/ui/Trilha';
import { Icone } from '../components/ui/Icone';
import { NaoEncontrada } from './NaoEncontrada';

const t = ConteudoRepositorio.textos.trilha;

export function Licao() {
  const params = useParams();
  const c = Number(params.conceito);
  const e = Number(params.etapa);
  const conceito = ConteudoRepositorio.conceito(c);
  const valido = !!conceito && Number.isInteger(e) && e >= 1 && e <= conceito.etapas.length;
  const { dispatch } = useFluxo();

  useEffect(() => {
    if (valido) dispatch({ tipo: 'ABRIR_ETAPA', conceito: c, etapa: e });
  }, [valido, c, e, dispatch]);

  if (!valido || !conceito) return <NaoEncontrada />;
  return <EtapaDaLicao key={`${c}-${e}`} conceito={conceito} numero={e} />;
}

function alvoDeTecladoLivre(alvo: EventTarget | null): boolean {
  const el = alvo as HTMLElement | null;
  if (!el) return true;
  if (el.closest('input, textarea, select, [contenteditable="true"], dialog[open], .indice__painel')) return false;
  return true;
}

function EtapaDaLicao({ conceito, numero }: { conceito: Conceito; numero: number }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { estado, dispatch } = useFluxo();
  const { falando } = useAudio();
  const etapa = conceito.etapas[numero - 1];
  const total = conceito.etapas.length;
  const ultimo = numero === total;

  const [escolha, setEscolha] = useState<number | null>(null);
  const [julgadas, setJulgadas] = useState<Record<number, boolean>>({});
  const [avisoGuarda, setAvisoGuarda] = useState(
    () => !!(location.state as { guarda?: boolean } | null)?.guarda,
  );

  // A resposta ao gancho é igual para qualquer opção (RN-02).
  const falaBase: Fala = escolha !== null && etapa.respostaAoGancho ? etapa.respostaAoGancho : etapa.fala;
  const fala = useMemo(
    () => ({ ...falaBase, texto: resolverExpressoes(falaBase.texto, conceito.conjuntos) }),
    [falaBase, conceito.conjuntos],
  );
  const guarda = ConteudoRepositorio.falas.guardaRota;
  // Com o aviso da guarda de rota na tela, a Dequinha fala o aviso; ao fechar, fala a etapa.
  useFala(avisoGuarda ? guarda : fala);

  const proximo = () => {
    if (!ultimo) {
      navigate(`/trilha/${conceito.ordem}/${numero + 1}`);
    } else if (conceito.ordem < TOTAL_CONCEITOS) {
      dispatch({ tipo: 'CONCLUIR_CONCEITO', conceito: conceito.ordem });
      navigate(`/trilha/${conceito.ordem + 1}/1`);
    } else {
      dispatch({ tipo: 'CONCLUIR_TEORIA' });
      navigate('/transicao');
    }
  };
  const voltar = numero > 1 ? () => navigate(`/trilha/${conceito.ordem}/${numero - 1}`) : undefined;

  // Setas ← e → navegam (RF-06); avançar nunca exige responder.
  const acoes = useRef({ proximo, voltar });
  acoes.current = { proximo, voltar };
  useEffect(() => {
    const tecla = (ev: KeyboardEvent) => {
      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) return;
      if (!alvoDeTecladoLivre(ev.target)) return;
      if (ev.key === 'ArrowRight') {
        ev.preventDefault();
        acoes.current.proximo();
      } else if (ev.key === 'ArrowLeft' && acoes.current.voltar) {
        ev.preventDefault();
        acoes.current.voltar();
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, []);

  const rotuloProximo = !ultimo ? t.proximo : conceito.ordem < TOTAL_CONCEITOS ? t.proximoConceito : t.concluirTrilha;

  return (
    <>
      <section className="faixa faixa--vinho licao-topo">
        <div className="container">
          <div className="licao-topo__linha">
            <BarraProgresso atual={conceito.ordem} total={TOTAL_CONCEITOS} />
            <IndiceTrilha
              conceitos={ConteudoRepositorio.trilha}
              atual={conceito.ordem}
              liberado={(o) => conceitoLiberado(estado, o)}
            />
          </div>
          <div className="licao-topo__titulo">
            <span className="licao-topo__glifo" aria-hidden="true">
              {conceito.simbolo}
            </span>
            <div>
              <p className="selo selo--claro">{t.conceito(conceito.ordem)}</p>
              <h1>{conceito.titulo}</h1>
            </div>
          </div>
          <PassosDaLicao etapas={conceito.etapas} atual={numero} />
        </div>
      </section>

      <section className="faixa faixa--blush licao-corpo">
        <div className="container">
          {avisoGuarda && (
            <div className="aviso" role="status">
              <Dequinha expressao={guarda.expressao} tamanho="avatar" />
              <p>{guarda.texto}</p>
              <button type="button" className="botao botao--contorno botao--compacto" onClick={() => setAvisoGuarda(false)}>
                {t.fecharAviso}
              </button>
            </div>
          )}

          <div className="cena">
            <div className="cena__dequinha">
              <Dequinha expressao={fala.expressao} falando={falando} gatilho={fala.texto} />
            </div>
            <div className="cena__balao">
              <h2 className="sr-only" data-foco tabIndex={-1}>
                {t.parteDe(numero, total)}: {t.nomesEtapas[etapa.tipo]}
              </h2>
              <p className="cena__etapa" aria-hidden="true">
                {t.nomesEtapas[etapa.tipo]}
              </p>
              <Balao texto={fala.texto} audio={fala.audio} />
            </div>

            <div className="cena__conteudo">
              {etapa.tipo === 'gancho' && etapa.opcoes && (
                <div className="cartao gancho">
                  <p className="gancho__instrucao">{t.escolhaOpcao}</p>
                  <div className="gancho__opcoes">
                    {etapa.opcoes.map((o, i) => (
                      <button
                        key={o}
                        type="button"
                        className="opcao"
                        aria-pressed={escolha === i}
                        onClick={() => setEscolha(i)}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(etapa.tipo === 'explicacao' || etapa.tipo === 'sintese') && (
                <div className={`cartao cartao-conceito cartao-conceito--${etapa.tipo}`}>
                  <span className="cartao-conceito__glifo" aria-hidden="true">
                    {conceito.simbolo}
                  </span>
                  <div>
                    <p className="cartao-conceito__rotulo">
                      {etapa.tipo === 'sintese' ? t.paraGuardar : t.aoFinal}
                    </p>
                    <p className="cartao-conceito__texto">
                      {etapa.tipo === 'sintese' ? conceito.titulo : conceito.objetivo}
                    </p>
                  </div>
                </div>
              )}

              {etapa.recurso && (
                <div className="cartao cartao--recurso">
                  <RecursoVisual recurso={etapa.recurso} />
                </div>
              )}

              {etapa.tipo === 'pratica' && etapa.afirmacoes && (
                <div className="cartao pratica">
                  <p className="pratica__selo">{t.semNota}</p>
                  <ul className="pratica__lista">
                    {etapa.afirmacoes.map((a, i) => {
                      const r = julgadas[i];
                      const acertou = r === undefined ? null : r === a.verdadeira;
                      return (
                        <li key={a.texto} className="pratica__item">
                          <p className="formula formula--grande">{a.texto}</p>
                          <div className="pratica__botoes" role="group" aria-label={`Julgue a afirmação ${a.texto}`}>
                            <button
                              type="button"
                              className="opcao opcao--compacta"
                              aria-pressed={r === true}
                              onClick={() => setJulgadas((j) => ({ ...j, [i]: true }))}
                            >
                              {t.verdadeira}
                            </button>
                            <button
                              type="button"
                              className="opcao opcao--compacta"
                              aria-pressed={r === false}
                              onClick={() => setJulgadas((j) => ({ ...j, [i]: false }))}
                            >
                              {t.falsa}
                            </button>
                          </div>
                          <p className={`pratica__retorno${acertou === null ? '' : acertou ? ' pratica__retorno--certo' : ' pratica__retorno--quase'}`} aria-live="polite">
                            {acertou !== null && (
                              <>
                                <Icone nome={acertou ? 'certo' : 'alerta'} tamanho={18} />
                                <strong>{acertou ? t.praticaCerta : t.praticaErrada}</strong> {a.explicacao}
                              </>
                            )}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <nav className="navegacao" aria-label="Navegação da lição">
                {voltar ? (
                  <button type="button" className="botao botao--contorno" onClick={voltar}>
                    <Icone nome="esquerda" />
                    {t.voltar}
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" className="botao botao--primario" onClick={proximo}>
                  {rotuloProximo}
                  <Icone nome="direita" />
                </button>
              </nav>
              <p className="navegacao__dica">{t.atalhoTeclado}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
