/** Apresentação da Dequinha (RF-02): boas-vindas com voz e o papel da guia. */
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ConteudoRepositorio } from '../content';
import { useFluxo } from '../app/FluxoProvider';
import { useAudio, useFala } from '../app/AudioProvider';
import { Dequinha } from '../components/dequinha/Dequinha';
import { Balao } from '../components/dequinha/Balao';
import { Icone } from '../components/ui/Icone';

export function Apresentacao() {
  const navigate = useNavigate();
  const { dispatch } = useFluxo();
  const { falando } = useAudio();
  const fala = ConteudoRepositorio.falas.apresentacao;
  const t = ConteudoRepositorio.textos.apresentacao;
  useFala(fala);

  useEffect(() => {
    dispatch({ tipo: 'IR_PARA_FASE', fase: 'apresentacao' });
  }, [dispatch]);

  return (
    <section className="faixa faixa--blush palco">
      <div className="container palco__grade">
        <Dequinha expressao={fala.expressao} falando={falando} tamanho="grande" className="palco__dequinha" />
        <div className="palco__texto">
          <h1 data-foco tabIndex={-1}>
            {t.titulo}
          </h1>
          <Balao texto={fala.texto} audio={fala.audio} />
          <p className="palco__papel">{t.papel}</p>
          <button type="button" className="botao botao--primario botao--grande" onClick={() => navigate('/trilha/1/1')}>
            {t.botao}
            <Icone nome="direita" />
          </button>
        </div>
      </div>
    </section>
  );
}
