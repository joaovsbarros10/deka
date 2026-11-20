/** ConteudoRepositorio: a porta única de acesso ao conteúdo. */
import { falas } from './falas';
import { perguntas } from './perguntas';
import { textos } from './textos';
import { trilha } from './trilha';
import type { Conceito, Pergunta } from './tipos';

export const ConteudoRepositorio = {
  trilha,
  perguntas,
  falas,
  textos,
  totalConceitos: trilha.length,
  ordemConceitos: trilha.map((c) => c.id),
  conceito(ordem: number): Conceito | undefined {
    return trilha.find((c) => c.ordem === ordem);
  },
  conceitoPorId(id: string): Conceito | undefined {
    return trilha.find((c) => c.id === id);
  },
  pergunta(id: string): Pergunta | undefined {
    return perguntas.find((p) => p.id === id);
  },
};

export type { Conceito, Pergunta } from './tipos';
