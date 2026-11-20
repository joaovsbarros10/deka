/** Liga a máquina de estados do domínio (domain/fluxo) à interface. */
import { createContext, useCallback, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import { estadoInicial, fluxoReducer, type EstadoApp, type EventoFluxo } from '../domain/fluxo';
import { criarSessao } from '../domain/quiz';
import { ConteudoRepositorio } from '../content';

interface Fluxo {
  estado: EstadoApp;
  dispatch: Dispatch<EventoFluxo>;
  /** Cria uma sessão nova (10 perguntas) e abre o quiz. */
  iniciarQuiz: () => void;
}

const Ctx = createContext<Fluxo | null>(null);

export function FluxoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(fluxoReducer, undefined, () => estadoInicial());

  const iniciarQuiz = useCallback(() => {
    const sessao = criarSessao(ConteudoRepositorio.perguntas, {
      sortear: Math.random,
      anterior: estado.quiz,
    });
    dispatch({ tipo: 'INICIAR_QUIZ', sessao });
  }, [estado.quiz]);

  const valor = useMemo(() => ({ estado, dispatch, iniciarQuiz }), [estado, iniciarQuiz]);
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useFluxo(): Fluxo {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFluxo fora do FluxoProvider');
  return v;
}
