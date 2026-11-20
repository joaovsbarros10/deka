/** Transição para o quiz (RF-07): só depois da última etapa da lógica, ou no Modo Apresentação. */
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ConteudoRepositorio } from '../content';
import { podeAbrirQuiz } from '../domain/fluxo';
import { useFluxo } from '../app/FluxoProvider';
import { useAudio, useFala } from '../app/AudioProvider';
import { Dequinha } from '../components/dequinha/Dequinha';
import { Balao } from '../components/dequinha/Balao';
import { Icone } from '../components/ui/Icone';

export function Transicao() {
  const { estado } = useFluxo();
  if (!podeAbrirQuiz(estado)) {
    return <Navigate to={`/trilha/${estado.maiorConceitoLiberado}/1`} replace state={{ guarda: true }} />;
  }
  return <TransicaoConteudo />;
}

function TransicaoConteudo() {
  const navigate = useNavigate();
  const { dispatch, iniciarQuiz } = useFluxo();
  const { falando } = useAudio();
  const fala = ConteudoRepositorio.falas.transicao;
  const t = ConteudoRepositorio.textos.transicao;
  useFala(fala);

  useEffect(() => {
    dispatch({ tipo: 'IR_PARA_FASE', fase: 'transicao' });
  }, [dispatch]);

  return (
    <section className="faixa faixa--rosa palco palco--rosa">
      <div className="container palco__grade">
        <Dequinha expressao={fala.expressao} falando={falando} tamanho="grande" className="palco__dequinha" />
        <div className="palco__texto">
          <h1 data-foco tabIndex={-1}>
            {t.titulo}
          </h1>
          <Balao texto={fala.texto} audio={fala.audio} />
          <p className="palco__papel">{t.texto}</p>
          <div className="acoes">
            <button
              type="button"
              className="botao botao--claro botao--grande"
              onClick={() => {
                iniciarQuiz();
                navigate('/quiz/1');
              }}
            >
              {t.botao}
              <Icone nome="direita" />
            </button>
            <button type="button" className="botao botao--contorno-claro" onClick={() => navigate('/trilha/1/1')}>
              <Icone nome="trilha" />
              {t.rever}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
