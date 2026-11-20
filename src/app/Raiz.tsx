/** Layout raiz: provedores, cabeçalho, conteúdo, rodapé e barra do Modo Apresentação. */
import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { PreferenciasProvider } from './PreferenciasProvider';
import { AudioProvider } from './AudioProvider';
import { FluxoProvider } from './FluxoProvider';
import { Cabecalho, Rodape } from '../components/ui/Cabecalho';

function Layout() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const primeira = useRef(true);

  // A cada troca de tela ou etapa: volta ao topo e move o foco para o título (risco da seção 16).
  useEffect(() => {
    window.scrollTo(0, 0);
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    const alvo = main.current?.querySelector<HTMLElement>('[data-foco]');
    alvo?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="app">
      <button type="button" className="pular" onClick={() => main.current?.focus()}>
        Pular para o conteúdo
      </button>
      <Cabecalho />
      <main id="conteudo" ref={main} tabIndex={-1} className="principal">
        <Outlet />
      </main>
      <Rodape />
    </div>
  );
}

export function Raiz() {
  return (
    <PreferenciasProvider>
      <AudioProvider>
        <FluxoProvider>
          <Layout />
        </FluxoProvider>
      </AudioProvider>
    </PreferenciasProvider>
  );
}
