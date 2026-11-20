/**
 * Quiz gamificado (RF-08 a RF-11, RF-20). Cada pergunta mostra degraus de
 * progresso, enunciado, alternativas e a Dequinha. Depois de escolher, as
 * alternativas travam e o feedback aparece; não há avanço automático.
 */
import { useEffect, useRef, useState } from 'react';
import { Navigate, useBlocker, useNavigate, useParams } from 'react-router';
import { ConteudoRepositorio } from '../content';
import type { Fala } from '../content/tipos';
import { podeAbrirQuiz } from '../domain/fluxo';
import { concluida, perguntaAtual, respostaDe, type SessaoQuiz } from '../domain/quiz';
import { preencher } from '../domain/expressoes';
import { audioDaDica, audioDoErro } from '../content/vozes';
import { useFluxo } from '../app/FluxoProvider';
import { useAudio, useFala } from '../app/AudioProvider';
import { Dequinha } from '../components/dequinha/Dequinha';
import { Balao } from '../components/dequinha/Balao';
import { RecursoVisual } from '../components/diagrama/RecursoVisual';
import { Alternativa, ConfirmarSaida, Degraus } from '../components/quiz/PecasDoQuiz';
import { Icone } from '../components/ui/Icone';

const LETRAS = ['A', 'B', 'C', 'D'];
const idsDeSessao = new WeakMap<SessaoQuiz['perguntas'], number>();
let proximoId = 1;
const idDaSessao = (s: SessaoQuiz) => {
  if (!idsDeSessao.has(s.perguntas)) idsDeSessao.set(s.perguntas, proximoId++);
  return idsDeSessao.get(s.perguntas)!;
};

export function Quiz() {
  const { n } = useParams();
  const { estado } = useFluxo();
  // Guarda de rota (RF-15): sem teoria concluída, volta à trilha com a fala da Dequinha.
  if (!podeAbrirQuiz(estado)) {
    return <Navigate to={`/trilha/${estado.maiorConceitoLiberado}/1`} replace state={{ guarda: true }} />;
  }
  const s = estado.quiz;
  if (!s) return <Navigate to="/transicao" replace />;
  if (Number(n) !== s.indice + 1) return <Navigate to={`/quiz/${s.indice + 1}`} replace />;
  return <PerguntaAtual key={`${idDaSessao(s)}-${s.indice}`} sessao={s} />;
}

function PerguntaAtual({ sessao: s }: { sessao: SessaoQuiz }) {
  const navigate = useNavigate();
  const { dispatch } = useFluxo();
  const { falando } = useAudio();
  const { falas, textos } = ConteudoRepositorio;
  const t = textos.quiz;
  const p = perguntaAtual(s)!;
  const resposta = respostaDe(s, p.id);
  const dicaUsada = s.dicasUsadas.includes(p.id);
  const ultima = s.indice === s.perguntas.length - 1;
  const [variante, setVariante] = useState(0);
  const proxRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    dispatch({ tipo: 'IR_PARA_FASE', fase: 'quiz' });
  }, [dispatch]);

  const fala: Fala = resposta
    ? resposta.correta
      ? falas.acertos[variante % falas.acertos.length]
      : { ...falas.erro, texto: preencher(falas.erro.texto, { explicacao: p.explicacaoErro }), audio: audioDoErro(p.id) }
    : dicaUsada
      ? { ...falas.dica, texto: preencher(falas.dica.texto, { dica: p.dica }), audio: audioDaDica(p.id) }
      : falas.inicioPergunta;
  useFala(fala);

  const escolher = (id: string) => {
    if (resposta) return;
    setVariante(Math.floor(Math.random() * falas.acertos.length));
    dispatch({ tipo: 'RESPONDER', alternativaId: id });
  };

  // Depois do feedback, o foco vai para "Próxima pergunta".
  const respondida = !!resposta;
  useEffect(() => {
    if (respondida) proxRef.current?.focus();
  }, [respondida]);

  const seguir = () => {
    if (ultima) {
      dispatch({ tipo: 'VER_RESULTADO' });
      navigate('/resultado');
    } else {
      dispatch({ tipo: 'PROXIMA_PERGUNTA' });
      navigate(`/quiz/${s.indice + 2}`, { replace: true });
    }
  };

  // Sair do quiz pede confirmação (D-12); o Modo Apresentação é a exceção.
  const emAndamento = !concluida(s);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      emAndamento &&
      currentLocation.pathname !== nextLocation.pathname &&
      !nextLocation.pathname.startsWith('/quiz') &&
      nextLocation.pathname !== '/resultado',
  );
  useEffect(() => {
    if (!emAndamento) return;
    const aviso = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', aviso);
    return () => window.removeEventListener('beforeunload', aviso);
  }, [emAndamento]);

  const tom = resposta ? (resposta.correta ? 'certo' : 'quase') : 'padrao';

  return (
    <>
      <section className="faixa faixa--grafite quiz-topo">
        <div className="container quiz-topo__grade">
          <div>
            <p className="selo selo--claro">{t.rotulo}</p>
            <h1 data-foco tabIndex={-1}>
              {t.perguntaDe(s.indice + 1, s.perguntas.length)}
            </h1>
          </div>
          <Degraus total={s.perguntas.length} respondidas={s.respostas.length} atual={s.indice} />
        </div>
      </section>

      <section className="faixa faixa--blush quiz-corpo">
        <div className="container quiz-grade">
          <article className="cartao pergunta" aria-labelledby="enunciado">
            <h2 id="enunciado" className="pergunta__enunciado">
              {p.enunciado}
            </h2>
            {p.recurso && (
              <div className="pergunta__recurso">
                <RecursoVisual recurso={p.recurso} />
              </div>
            )}
            <ol className="alternativas">
              {p.alternativas.map((a, i) => (
                <Alternativa
                  key={a.id}
                  alternativa={a}
                  letra={LETRAS[i]}
                  travada={!!resposta}
                  escolhida={resposta?.alternativaId === a.id}
                  onEscolher={() => escolher(a.id)}
                />
              ))}
            </ol>
          </article>

          <aside className="reacao" aria-label="Dequinha">
            <Dequinha expressao={fala.expressao} falando={falando} gatilho={fala.texto} />
            <Balao
              texto={fala.texto}
              audio={fala.audio}
              ponta="cima"
              tom={tom}
              antes={
                resposta && (
                  <p className={`status status--${tom}`}>
                    <Icone nome={resposta.correta ? 'certo' : 'alerta'} tamanho={18} />
                    {resposta.correta ? t.acertou : t.quaseLa}
                  </p>
                )
              }
            />
            <div className="reacao__acoes">
              {!resposta && (
                <button
                  type="button"
                  className="botao botao--contorno"
                  onClick={() => dispatch({ tipo: 'PEDIR_DICA' })}
                  disabled={dicaUsada}
                >
                  <Icone nome="dica" />
                  {dicaUsada ? t.dicaUsada : t.pedirDica}
                </button>
              )}
              {resposta && (
                <button ref={proxRef} type="button" className="botao botao--primario" onClick={seguir}>
                  {ultima ? t.verResultado : t.proxima}
                  <Icone nome="direita" />
                </button>
              )}
            </div>
          </aside>
        </div>
      </section>

      <ConfirmarSaida
        aberto={blocker.state === 'blocked'}
        onFicar={() => blocker.reset?.()}
        onSair={() => blocker.proceed?.()}
      />
    </>
  );
}
