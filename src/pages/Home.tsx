/** Tela inicial (RF-01): identidade, proposta curta e o botão para iniciar. A Dequinha ainda não aparece. */
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ConteudoRepositorio } from '../content';
import { useFluxo } from '../app/FluxoProvider';
import { useAudio, useFala } from '../app/AudioProvider';
import { Icone } from '../components/ui/Icone';

export function Home() {
  const navigate = useNavigate();
  const { dispatch } = useFluxo();
  const { desbloquear } = useAudio();
  const t = ConteudoRepositorio.textos.inicio;
  useFala(null);

  useEffect(() => {
    dispatch({ tipo: 'IR_PARA_FASE', fase: 'home' });
  }, [dispatch]);

  // O primeiro clique libera o áudio (RF-22) e leva à apresentação da Dequinha (RF-02).
  const iniciar = () => {
    desbloquear();
    dispatch({ tipo: 'INICIAR' });
    navigate('/apresentacao');
  };

  return (
    <>
      <section className="faixa faixa--rosa heroi">
        <div className="container heroi__grade">
          <div className="heroi__texto">
            <p className="selo">{t.selo}</p>
            <h1 data-foco tabIndex={-1}>
              {t.titulo}
            </h1>
            <p className="heroi__proposta">{t.proposta}</p>
            <button type="button" className="botao botao--claro botao--grande" onClick={iniciar}>
              {t.botao}
              <Icone nome="direita" />
            </button>
            <p className="heroi__nota">{t.nota}</p>
          </div>
          <div className="heroi__arte" aria-hidden="true">
            <div className="heroi__circulos">
              <span />
              <span />
              <b>∈ ⊂ ∪ ∩</b>
            </div>
            <p className="heroi__slogan">
              <span>{t.slogan[0]}</span>
              <strong>{t.slogan[1]}</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="faixa faixa--vinho" aria-labelledby="assuntos">
        <div className="container centro">
          <h2 id="assuntos">{t.assuntosTitulo}</h2>
          <ul className="pilulas">
            {ConteudoRepositorio.trilha.map((c) => (
              <li key={c.id} className="pilula">
                {c.titulo}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="faixa faixa--branca" aria-labelledby="simbolos">
        <div className="container centro">
          <h2 id="simbolos" className="titulo-rosa">
            {t.simbolosTitulo}
          </h2>
          <p className="subtitulo">{t.simbolosSubtitulo}</p>
          <ul className="cartoes-simbolo">
            {t.simbolos.map((s) => (
              <li key={s.nome} className="cartao-simbolo">
                <span className="cartao-simbolo__glifo" aria-hidden="true">
                  {s.simbolo}
                </span>
                <strong className="cartao-simbolo__nome">{s.nome}</strong>
                <span className="cartao-simbolo__texto">{s.liga}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="faixa faixa--grafite" aria-labelledby="como">
        <div className="container centro">
          <h2 id="como">{t.comoTitulo}</h2>
          <p className="subtitulo subtitulo--claro">{t.comoSubtitulo}</p>
          <ol className="passos-home">
            {t.passos.map((p, i) => (
              <li key={p.titulo}>
                <span className="passos-home__num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="faixa faixa--blush chamada" aria-labelledby="chamada">
        <div className="container chamada__linha">
          <div>
            <h2 id="chamada">{t.chamadaTitulo}</h2>
            <p>{t.chamadaTexto}</p>
          </div>
          <button type="button" className="botao botao--primario botao--grande" onClick={iniciar}>
            {t.botao}
            <Icone nome="direita" />
          </button>
        </div>
      </section>
    </>
  );
}
