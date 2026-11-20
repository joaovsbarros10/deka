/** Resultado por desempenho (RF-16): faixa e conceitos para rever. */
import type { Faixa } from '../content/tipos';
import { acertos, type SessaoQuiz } from './quiz';

export interface Desempenho {
  acertos: number;
  total: number;
  faixa: Faixa;
  /** Ids de conceito das perguntas erradas, na ordem da trilha, sem repetir. */
  conceitosParaRever: string[];
}

/** 80% ou mais = alta; de 50% a 79% = média; menos de 50% = baixa. */
export function faixaPorDesempenho(certas: number, total: number): Faixa {
  if (total <= 0) return 'baixa';
  if (certas * 100 >= 80 * total) return 'alta';
  if (certas * 100 >= 50 * total) return 'media';
  return 'baixa';
}

export function calcularDesempenho(s: SessaoQuiz, ordemConceitos: readonly string[]): Desempenho {
  const certas = acertos(s);
  const total = s.perguntas.length;
  const errados = new Set(
    s.respostas
      .filter((r) => !r.correta)
      .map((r) => s.perguntas.find((p) => p.id === r.perguntaId)?.conceitoId)
      .filter((c): c is string => !!c),
  );
  return {
    acertos: certas,
    total,
    faixa: faixaPorDesempenho(certas, total),
    conceitosParaRever: ordemConceitos.filter((c) => errados.has(c)),
  };
}
