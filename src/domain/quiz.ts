/**
 * Sessão do quiz (RF-08 a RF-11, RF-18, RF-20). Pura: o sorteador entra por
 * parâmetro, para o teste ser determinístico.
 */
import type { Alternativa, Pergunta } from '../content/tipos';

export type Sorteador = () => number;

export const LIMITE_PERGUNTAS = 10;

export interface Resposta {
  perguntaId: string;
  alternativaId: string;
  correta: boolean;
}

export interface SessaoQuiz {
  /** Já selecionadas (até 10) e com alternativas embaralhadas. */
  perguntas: Pergunta[];
  indice: number;
  respostas: Resposta[];
  /** Ids de pergunta; no máximo uma dica por pergunta. */
  dicasUsadas: string[];
}

/** Fisher–Yates com sorteador injetado. */
export function embaralhar<T>(itens: readonly T[], sortear: Sorteador): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(sortear() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

const mesmaOrdem = (a: readonly Alternativa[], b: readonly Alternativa[]) =>
  a.length === b.length && a.every((x, i) => x.id === b[i].id);

/**
 * Cria uma sessão nova. Se houver sessão anterior (Refazer o quiz), a ordem
 * das alternativas de cada pergunta muda em relação a ela (T-18).
 */
export function criarSessao(
  banco: readonly Pergunta[],
  opcoes: { sortear: Sorteador; anterior?: SessaoQuiz | null },
): SessaoQuiz {
  const selecionadas = banco.slice(0, LIMITE_PERGUNTAS);
  const perguntas = selecionadas.map((p) => {
    let alternativas = embaralhar(p.alternativas, opcoes.sortear);
    const antes = opcoes.anterior?.perguntas.find((q) => q.id === p.id)?.alternativas;
    if (antes && alternativas.length > 1 && mesmaOrdem(alternativas, antes)) {
      alternativas = [...alternativas.slice(1), alternativas[0]];
    }
    return { ...p, alternativas };
  });
  return { perguntas, indice: 0, respostas: [], dicasUsadas: [] };
}

export function perguntaAtual(s: SessaoQuiz): Pergunta | undefined {
  return s.perguntas[s.indice];
}

export function respostaDe(s: SessaoQuiz, perguntaId: string): Resposta | undefined {
  return s.respostas.find((r) => r.perguntaId === perguntaId);
}

export function respondida(s: SessaoQuiz): boolean {
  const p = perguntaAtual(s);
  return !!p && !!respostaDe(s, p.id);
}

export function concluida(s: SessaoQuiz): boolean {
  return s.respostas.length === s.perguntas.length;
}

/** Depois de escolher, as alternativas travam: uma segunda resposta é ignorada. */
export function responder(s: SessaoQuiz, alternativaId: string): SessaoQuiz {
  const p = perguntaAtual(s);
  if (!p || respostaDe(s, p.id)) return s;
  const alt = p.alternativas.find((a) => a.id === alternativaId);
  if (!alt) return s;
  return {
    ...s,
    respostas: [...s.respostas, { perguntaId: p.id, alternativaId, correta: alt.correta }],
  };
}

/** No máximo 1 dica por pergunta e só antes de responder. Não altera os acertos. */
export function pedirDica(s: SessaoQuiz): SessaoQuiz {
  const p = perguntaAtual(s);
  if (!p || s.dicasUsadas.includes(p.id) || respostaDe(s, p.id)) return s;
  return { ...s, dicasUsadas: [...s.dicasUsadas, p.id] };
}

/** Só avança depois do feedback; não há avanço automático (RF-11). */
export function avancar(s: SessaoQuiz): SessaoQuiz {
  if (!respondida(s) || s.indice >= s.perguntas.length - 1) return s;
  return { ...s, indice: s.indice + 1 };
}

export function acertos(s: SessaoQuiz): number {
  return s.respostas.filter((r) => r.correta).length;
}
