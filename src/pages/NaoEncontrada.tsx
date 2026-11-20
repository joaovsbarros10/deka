/** Rota que não existe: tela amigável com a Dequinha e um botão para o início. */
import { useNavigate } from 'react-router';
import { ConteudoRepositorio } from '../content';
import { useAudio, useFala } from '../app/AudioProvider';
import { Dequinha } from '../components/dequinha/Dequinha';
import { Balao } from '../components/dequinha/Balao';
import { Icone } from '../components/ui/Icone';

export function NaoEncontrada() {
  const navigate = useNavigate();
  const { falando } = useAudio();
  const fala = ConteudoRepositorio.falas.naoEncontrada;
  const t = ConteudoRepositorio.textos.naoEncontrada;
  useFala(fala);
  return (
    <section className="faixa faixa--blush palco">
      <div className="container palco__grade">
        <Dequinha expressao={fala.expressao} falando={falando} tamanho="grande" className="palco__dequinha" />
        <div className="palco__texto">
          <h1 data-foco tabIndex={-1}>
            {t.titulo}
          </h1>
          <Balao texto={fala.texto} audio={fala.audio} />
          <button type="button" className="botao botao--primario botao--grande" onClick={() => navigate('/')}>
            <Icone nome="casa" />
            {t.botao}
          </button>
        </div>
      </div>
    </section>
  );
}
