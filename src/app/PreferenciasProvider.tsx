/**
 * Botões Voz e Movimento (seção 8). Começam ligados; o Movimento começa
 * desligado se o sistema pedir menos movimento. O estado fica só em memória
 * e vale até recarregar a página (D-12).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface Preferencias {
  voz: boolean;
  movimento: boolean;
  alternarVoz: () => void;
  ligarVoz: () => void;
  alternarMovimento: () => void;
}

const Ctx = createContext<Preferencias | null>(null);

const sistemaPedeMenosMovimento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function PreferenciasProvider({ children }: { children: ReactNode }) {
  const [voz, setVoz] = useState(true);
  const [movimento, setMovimento] = useState(() => !sistemaPedeMenosMovimento());

  useEffect(() => {
    document.documentElement.dataset.movimento = movimento ? 'ligado' : 'desligado';
  }, [movimento]);

  const alternarVoz = useCallback(() => setVoz((v) => !v), []);
  const ligarVoz = useCallback(() => setVoz(true), []);
  const alternarMovimento = useCallback(() => setMovimento((m) => !m), []);

  const valor = useMemo(
    () => ({ voz, movimento, alternarVoz, ligarVoz, alternarMovimento }),
    [voz, movimento, alternarVoz, ligarVoz, alternarMovimento],
  );
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function usePreferencias(): Preferencias {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePreferencias fora do PreferenciasProvider');
  return v;
}
