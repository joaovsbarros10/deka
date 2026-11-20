import { describe, expect, it } from 'vitest';
import { conferirExpressoes, preencher, resolverExpressoes } from '../../domain/expressoes';
import { analisarAfirmacao, julgar, misturaTipos } from '../../domain/afirmacoes';
import { descreverRecurso, fichaInclusao, fichaPertinencia, legendasDoDestaque } from '../../domain/descricao';

const ESPORTES = { A: ['vôlei', 'futsal', 'natação'], B: ['futsal', 'natação', 'basquete'] };
const FRUTAS = { A: ['maçã', 'banana', 'uva'], B: ['maçã', 'banana'], C: ['maçã', 'abacaxi'] };

describe('expressões nas falas (RN-10)', () => {
  it('calcula resultados e contagens', () => {
    expect(resolverExpressoes('A ∪ B = {{A ∪ B}}.', ESPORTES)).toBe(
      'A ∪ B = {vôlei, futsal, natação, basquete}.',
    );
    expect(resolverExpressoes('{{A ∩ B}} e {{B − A}}', ESPORTES)).toBe('{futsal, natação} e {basquete}');
    expect(resolverExpressoes('tem {{#A ∪ B}} elementos', ESPORTES)).toBe('tem 4 elementos');
    expect(resolverExpressoes('A = {{A}}', ESPORTES)).toBe('A = {vôlei, futsal, natação}');
  });
  it('mantém chaves simples e acusa conjunto não declarado', () => {
    expect(resolverExpressoes('vazio: { } ou ∅', ESPORTES)).toBe('vazio: { } ou ∅');
    expect(conferirExpressoes('{{A ∪ Z}}', ESPORTES)).toHaveLength(1);
    expect(conferirExpressoes('{{A ∪ B}}', ESPORTES)).toHaveLength(0);
  });
  it('preenche variáveis conhecidas e preserva as outras', () => {
    expect(preencher('{n} de {total}', { n: 4, total: 5 })).toBe('4 de 5');
    expect(preencher('{basquete}', { n: 1 })).toBe('{basquete}');
  });
});

describe('julgar afirmações (RF-14, V-09, RN-08)', () => {
  it('as quatro afirmações da prática', () => {
    expect(julgar('abacaxi ∉ A', FRUTAS)).toBe(true);
    expect(julgar('C ⊂ A', FRUTAS)).toBe(false);
    expect(julgar('maçã ⊂ A', FRUTAS)).toBe(false);
    expect(julgar('C ⊄ B', FRUTAS)).toBe(true);
  });
  it('pertinência, inclusão e "contém"', () => {
    expect(julgar('banana ∈ B', FRUTAS)).toBe(true);
    expect(julgar('B ⊂ A', FRUTAS)).toBe(true);
    expect(julgar('A ⊂ B', FRUTAS)).toBe(false);
    expect(julgar('A ⊃ B', FRUTAS)).toBe(true);
    expect(julgar('A ⊂ A', FRUTAS)).toBe(true);
  });
  it('misturar tipos é sempre falso', () => {
    expect(julgar('B ∈ A', FRUTAS)).toBe(false);
    expect(julgar('B ∉ A', FRUTAS)).toBe(false);
    expect(julgar('maçã ⊄ A', FRUTAS)).toBe(false);
    expect(misturaTipos('maçã ⊂ A', FRUTAS)).toBe(true);
    expect(misturaTipos('B ∈ A', FRUTAS)).toBe(true);
    expect(misturaTipos('banana ∈ A', FRUTAS)).toBe(false);
  });
  it('aceita conjuntos escritos por listagem (P10)', () => {
    const N = { A: ['1', '2', '3'] };
    expect(julgar('{1, 2} ⊂ A', N)).toBe(true);
    expect(julgar('3 ⊂ A', N)).toBe(false);
    expect(julgar('2 ∈ A', N)).toBe(true);
    expect(julgar('5 ∉ A', N)).toBe(true);
  });
  it('recusa texto fora da forma', () => {
    expect(analisarAfirmacao('banana pertence a A')).toBeNull();
    expect(() => julgar('banana pertence a A', FRUTAS)).toThrow();
  });
});

describe('fichas, legendas e texto alternativo (RF-05, V-11)', () => {
  it('fichas calculadas', () => {
    expect(fichaPertinencia('banana', 'A', FRUTAS)).toBe('banana ∈ A');
    expect(fichaPertinencia('abacaxi', 'A', FRUTAS)).toBe('abacaxi ∉ A');
    expect(fichaInclusao('B', 'A', FRUTAS)).toBe('B ⊂ A');
    expect(fichaInclusao('C', 'A', FRUTAS)).toBe('C ⊄ A');
  });
  it('legenda do destaque de região', () => {
    expect(
      legendasDoDestaque({ tipo: 'regiao', operacao: 'diferenca', de: ['B', 'A'] }, ESPORTES),
    ).toEqual(['B − A = {basquete}']);
  });
  it('texto alternativo descreve a região destacada', () => {
    const alt = descreverRecurso({
      tipo: 'diagrama',
      conjuntos: ESPORTES,
      destaque: { tipo: 'regiao', operacao: 'intersecao', de: ['A', 'B'] },
    });
    expect(alt).toContain('interseção A ∩ B');
    expect(alt).toContain('futsal e natação');
  });
  it('texto alternativo da inclusão cita o elemento de fora', () => {
    const alt = descreverRecurso({
      tipo: 'diagrama',
      conjuntos: FRUTAS,
      destaque: { tipo: 'inclusao', continente: 'A', contidos: ['B', 'C'] },
    });
    expect(alt).toContain('B ⊂ A');
    expect(alt).toContain('C ⊄ A, porque abacaxi está em C e fora de A');
  });
});
