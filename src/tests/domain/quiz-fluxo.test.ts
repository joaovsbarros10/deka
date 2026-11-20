import { describe, expect, it } from 'vitest';
import {
  acertos,
  avancar,
  concluida,
  criarSessao,
  embaralhar,
  pedirDica,
  perguntaAtual,
  respondida,
  responder,
  type Sorteador,
} from '../../domain/quiz';
import { calcularDesempenho, faixaPorDesempenho } from '../../domain/desempenho';
import {
  conceitoLiberado,
  estadoInicial,
  fluxoReducer,
  podeAbrirQuiz,
  podeVerResultado,
} from '../../domain/fluxo';
import { perguntas } from '../../content/perguntas';
import { trilha } from '../../content/trilha';

/** Sorteador determinístico (LCG). */
function sorteador(semente = 42): Sorteador {
  let s = semente;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const correta = (s: ReturnType<typeof criarSessao>) => perguntaAtual(s)!.alternativas.find((a) => a.correta)!.id;
const errada = (s: ReturnType<typeof criarSessao>) => perguntaAtual(s)!.alternativas.find((a) => !a.correta)!.id;
const ordem = trilha.map((c) => c.id);

describe('sessão do quiz', () => {
  it('embaralhar mantém os itens', () => {
    const r = embaralhar([1, 2, 3, 4, 5], sorteador());
    expect([...r].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('o estudante responde 10 perguntas (RF-09)', () => {
    expect(criarSessao(perguntas, { sortear: sorteador() }).perguntas).toHaveLength(10);
  });

  it('nunca passa de 10 perguntas, mesmo com banco maior (RN-03)', () => {
    const banco = [...perguntas, { ...perguntas[0], id: 'P11' }];
    expect(criarSessao(banco, { sortear: sorteador() }).perguntas).toHaveLength(10);
  });

  it('as alternativas travam depois da resposta (RF-10)', () => {
    let s = criarSessao(perguntas, { sortear: sorteador() });
    const certa = correta(s);
    s = responder(s, errada(s));
    expect(respondida(s)).toBe(true);
    const depois = responder(s, certa);
    expect(depois).toBe(s);
    expect(acertos(s)).toBe(0);
  });

  it('só avança depois do feedback (RF-11)', () => {
    let s = criarSessao(perguntas, { sortear: sorteador() });
    expect(avancar(s).indice).toBe(0);
    s = responder(s, correta(s));
    expect(avancar(s).indice).toBe(1);
  });

  it('dica: no máximo 1 vez, só antes de responder, sem mudar acertos (RF-20)', () => {
    let s = criarSessao(perguntas, { sortear: sorteador() });
    s = pedirDica(s);
    const segunda = pedirDica(s);
    expect(segunda).toBe(s);
    expect(s.dicasUsadas).toEqual([perguntaAtual(s)!.id]);
    s = responder(s, correta(s));
    expect(acertos(s)).toBe(1);
  });

  it('refazer muda a ordem das alternativas de cada pergunta (T-18)', () => {
    const primeira = criarSessao(perguntas, { sortear: sorteador(1) });
    const nova = criarSessao(perguntas, { sortear: sorteador(1), anterior: primeira });
    nova.perguntas.forEach((p, i) => {
      const antes = primeira.perguntas[i].alternativas.map((a) => a.id).join();
      expect(p.alternativas.map((a) => a.id).join()).not.toBe(antes);
    });
    expect(nova.respostas).toEqual([]);
  });

  it('percorre o quiz inteiro e conclui', () => {
    let s = criarSessao(perguntas, { sortear: sorteador() });
    for (let i = 0; i < s.perguntas.length; i++) {
      s = responder(s, i === 1 ? errada(s) : correta(s));
      s = avancar(s);
    }
    expect(concluida(s)).toBe(true);
    const d = calcularDesempenho(s, ordem);
    expect(d).toEqual({ acertos: 9, total: 10, faixa: 'alta', conceitosParaRever: ['elementos'] });
  });
});

describe('desempenho (RF-16)', () => {
  it('limites das faixas: 49%, 50%, 79% e 80%', () => {
    expect(faixaPorDesempenho(49, 100)).toBe('baixa');
    expect(faixaPorDesempenho(50, 100)).toBe('media');
    expect(faixaPorDesempenho(79, 100)).toBe('media');
    expect(faixaPorDesempenho(80, 100)).toBe('alta');
    expect(faixaPorDesempenho(4, 5)).toBe('alta');
    expect(faixaPorDesempenho(0, 0)).toBe('baixa');
  });
});

describe('fluxo da aplicação (Figura 10)', () => {
  it('guarda de rota: o quiz só abre depois da teoria (RF-15, RN-01)', () => {
    const e = estadoInicial();
    expect(podeAbrirQuiz(e)).toBe(false);
    const sessao = criarSessao(perguntas, { sortear: sorteador() });
    expect(fluxoReducer(e, { tipo: 'INICIAR_QUIZ', sessao })).toBe(e);
    const concluida = fluxoReducer(e, { tipo: 'CONCLUIR_TEORIA' });
    expect(podeAbrirQuiz(concluida)).toBe(true);
    expect(fluxoReducer(concluida, { tipo: 'INICIAR_QUIZ', sessao }).fase).toBe('quiz');
  });

  it('conceito n+1 fica bloqueado até concluir o n; link direto libera os anteriores (RF-03, D-12)', () => {
    let e = estadoInicial();
    expect(conceitoLiberado(e, 2)).toBe(false);
    e = fluxoReducer(e, { tipo: 'CONCLUIR_CONCEITO', conceito: 1 });
    expect(conceitoLiberado(e, 2)).toBe(true);
    expect(conceitoLiberado(e, 3)).toBe(false);
    e = fluxoReducer(e, { tipo: 'ABRIR_ETAPA', conceito: 6, etapa: 2 });
    expect(e.maiorConceitoLiberado).toBe(6);
    expect(e.conceitoAtual).toBe(6);
    expect(e.etapaAtual).toBe(2);
    expect(conceitoLiberado(e, 7)).toBe(false);
  });

  it('resultado só depois do quiz concluído', () => {
    let e = fluxoReducer(estadoInicial(), { tipo: 'CONCLUIR_TEORIA' });
    const sessao = criarSessao(perguntas, { sortear: sorteador() });
    e = fluxoReducer(e, { tipo: 'INICIAR_QUIZ', sessao });
    expect(podeVerResultado(e)).toBe(false);
    expect(fluxoReducer(e, { tipo: 'VER_RESULTADO' })).toBe(e);
    for (let i = 0; i < 10; i++) {
      e = fluxoReducer(e, { tipo: 'RESPONDER', alternativaId: correta(e.quiz!) });
      e = fluxoReducer(e, { tipo: 'PROXIMA_PERGUNTA' });
    }
    expect(podeVerResultado(e)).toBe(true);
    expect(fluxoReducer(e, { tipo: 'VER_RESULTADO' }).fase).toBe('resultado');
  });
});
