import { Link } from 'react-router';
import { marca } from '../../content/marca';
import { textos } from '../../content/textos';

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="container cabecalho__linha">
        <Link to="/" className="cabecalho__marca" aria-label={`${textos.marca.nome}, início`}>
          <img src={`${import.meta.env.BASE_URL}${marca.logo}`} alt={textos.marca.altLogo} width={520} height={176} />
        </Link>
      </div>
    </header>
  );
}

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="container rodape__linha">
        <img
          className="rodape__logo"
          src={`${import.meta.env.BASE_URL}${marca.logoBranca}`}
          alt={textos.marca.altLogo}
          width={520}
          height={176}
          loading="lazy"
        />
        <p>{textos.rodape.texto}</p>
      </div>
    </footer>
  );
}
