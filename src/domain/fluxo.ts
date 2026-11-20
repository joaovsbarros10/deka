/**
 * Máquina de estados do fluxo da aplicação (Figura 10). Estado só em memória
 * (D-12): nada em localStorage, sessionStorage ou cookies.
 */
import {
  avancar,
  concluida,
  pedirDica,
  responder,
  type SessaoQuiz,
} from './quiz';

export const TOTAL_CONCEITOS = 9;

export type Fase = 'home' | 'apresentacao' | 'trilha' | 'transicao' | 'quiz' | 'resultado';

export interface EstadoApp {
  fase: Fase;
  /** 1 a 9 */
  conceitoAtual: number;
  /** Índice (1-based) dentro do conceito. */
  etapaAtual: number;
  /** Base do índice da trilha (RF-19). */
  maiorConceitoLiberado: number;
  /** Chave da guarda de rota (RF-15). */
  teoriaConcluida: boolean;
  quiz: SessaoQuiz | null;
}

export type EventoFluxo =
  | { tipo: 'INICIAR' }
  | { tipo: 'ABRIR_ETAPA'; conceito: number; etapa: number }
  | { tipo: 'CONCLUIR_CONCEITO'; conceito: number }
  | { tipo: 'CONCLUIR_TEORIA' }
  | { tipo: 'INICIAR_QUIZ'; sessao: SessaoQuiz }
  | { tipo: 'RESPONDER'; alternativaId: string }
  | { tipo: 'PEDIR_DICA' }
  | { tipo: 'PROXIMA_PERGUNTA' }
  | { tipo: 'VER_RESULTADO' }
  | { tipo: 'IR_PARA_FASE'; fase: Fase };

export function estadoInicial(): EstadoApp {
  return {
    fase: 'home',
    conceitoAtual: 1,
    etapaAtual: 1,
    maiorConceitoLiberado: 1,
    teoriaConcluida: false,
    quiz: null,
  };
}

const limitar = (n: number) => Math.min(TOTAL_CONCEITOS, Math.max(1, Math.trunc(n)));

export function fluxoReducer(estado: EstadoApp, evento: EventoFluxo): EstadoApp {
  switch (evento.tipo) {
    case 'INICIAR':
      return { ...estado, fase: 'apresentacao' };

    case 'ABRIR_ETAPA': {
      // Abrir um conceito por link direto ou ao recarregar libera os anteriores (D-12).
      const conceito = limitar(evento.conceito);
      return {
        ...estado,
        fase: 'trilha',
        conceitoAtual: conceito,
        etapaAtual: Math.max(1, Math.trunc(evento.etapa)),
        maiorConceitoLiberado: Math.max(estado.maiorConceitoLiberado, conceito),
      };
    }

    case 'CONCLUIR_CONCEITO':
      return {
        ...estado,
        maiorConceitoLiberado: Math.max(
          estado.maiorConceitoLiberado,
          limitar(evento.conceito + 1),
        ),
      };

    case 'CONCLUIR_TEORIA':
      return {
        ...estado,
        fase: 'transicao',
        teoriaConcluida: true,
        maiorConceitoLiberado: TOTAL_CONCEITOS,
      };

    case 'INICIAR_QUIZ':
      if (!podeAbrirQuiz(estado)) return estado;
      return { ...estado, fase: 'quiz', quiz: evento.sessao };

    case 'RESPONDER':
      if (!estado.quiz) return estado;
      return { ...estado, quiz: responder(estado.quiz, evento.alternativaId) };

    case 'PEDIR_DICA':
      if (!estado.quiz) return estado;
      return { ...estado, quiz: pedirDica(estado.quiz) };

    case 'PROXIMA_PERGUNTA':
      if (!estado.quiz) return estado;
      return { ...estado, quiz: avancar(estado.quiz) };

    case 'VER_RESULTADO':
      if (!estado.quiz || !concluida(estado.quiz)) return estado;
      return { ...estado, fase: 'resultado' };

    case 'IR_PARA_FASE':
      return { ...estado, fase: evento.fase };
  }
}

/** Guarda de rota (RF-15, RN-01): o quiz só abre depois da teoria. */
export function podeAbrirQuiz(estado: EstadoApp): boolean {
  return estado.teoriaConcluida;
}

export function podeVerResultado(estado: EstadoApp): boolean {
  return !!estado.quiz && concluida(estado.quiz);
}

/** Pela interface, um conceito só abre se já estiver liberado. */
export function conceitoLiberado(estado: EstadoApp, conceito: number): boolean {
  return conceito <= estado.maiorConceitoLiberado;
}
