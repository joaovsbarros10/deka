/** Tela final (RF-12, RF-16, RF-18): "X de N acertos", mensagem por faixa e conceitos para rever. */
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ConteudoRepositorio } from '../content';
import { concluida, type SessaoQuiz } from '../domain/quiz';
import { calcularDesempenho } from '../domain/desempenho';
import { preencher } from '../domain/expressoes';
import { useFluxo } from '../app/FluxoProvider';
import { useAudio, useFala } from '../app/AudioProvider';
import { Dequinha } from '../components/dequinha/Dequinha';
import { Balao } from '../components/dequinha/Balao';
import { Icone } from '../components/ui/Icone';

export function Resultado() {
  const { estado } = useFluxo();
  // A tela fica com a sessão concluída com que abriu: "Refazer o quiz" cria uma sessão
  // nova antes de navegar, e a guarda não pode mandar o estudante para o início nesse meio-tempo.
  const [s] = useState(() => estado.quiz);
  if (!s || !concluida(s)) {
    return <Navigate to="/" replace />;
  }
  return <ResultadoConteudo sessao={s} />;
}

function ResultadoConteudo({ sessao }: { sessao: SessaoQuiz }) {
  const navigate = useNavigate();
  const { dispatch, iniciarQuiz } = useFluxo();
  const { falando } = useAudio();
  const { falas, textos, ordemConceitos } = ConteudoRepositorio;
  const t = textos.resultado;
  const d = calcularDesempenho(sessao, ordemConceitos);
  const base = falas.finais[d.faixa];
  const fala = { ...base, texto: preencher(base.texto, { n: d.acertos, total: d.total }) };
  useFala(fala);

  useEffect(() => {
    dispatch({ tipo: 'IR_PARA_FASE', fase: 'resultado' });
  }, [dispatch]);

  return (
    <>
      <section className={`faixa faixa--rosa resultado-topo resultado-topo--${d.faixa}`}>
        <div className="container palco__grade">
          <Dequinha expressao={fala.expressao} falando={falando} tamanho="grande" className="palco__dequinha" />
          <div className="palco__texto">
            <p className="selo">{t.titulo}</p>
            <h1 className="placar" data-foco tabIndex={-1}>
              <span className="placar__n">{d.acertos}</span>
              <span className="placar__de"> de {d.total}</span>
              <span className="placar__rotulo"> acertos</span>
            </h1>
            <Balao texto={fala.texto} audio={fala.audio} />
          </div>
        </div>
      </section>

      <section className="faixa faixa--branca" aria-labelledby="rever">
        <div className="container centro">
          <h2 id="rever" className="titulo-rosa">
            {t.reverTitulo}
          </h2>
          {d.conceitosParaRever.length > 0 ? (
            <>
              <p className="subtitulo">{t.reverTexto}</p>
              <ul className="cartoes-simbolo cartoes-simbolo--rever">
                {d.conceitosParaRever.map((id) => {
                  const c = ConteudoRepositorio.conceitoPorId(id)!;
                  return (
                    <li key={id} className="cartao-simbolo">
                      <span className="cartao-simbolo__glifo" aria-hidden="true">
                        {c.simbolo}
                      </span>
                      <strong className="cartao-simbolo__nome">{c.titulo}</strong>
                      <span className="cartao-simbolo__texto">{textos.trilha.conceito(c.ordem)}</span>
                      <button
                        type="button"
                        className="botao botao--escuro botao--compacto"
                        onClick={() => navigate(`/trilha/${c.ordem}/1`)}
                        aria-label={`${t.reverConceito}: ${c.titulo}`}
                      >
                        {t.reverConceito}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="subtitulo">{t.tudoCerto}</p>
          )}
          <div className="acoes acoes--centro">
            <button
              type="button"
              className="botao botao--primario botao--grande"
              onClick={() => {
                iniciarQuiz();
                navigate('/quiz/1');
              }}
            >
              <Icone nome="repetir" />
              {t.refazer}
            </button>
            <button type="button" className="botao botao--contorno botao--grande" onClick={() => navigate('/trilha/1/1')}>
              <Icone nome="trilha" />
              {t.reverTrilha}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
