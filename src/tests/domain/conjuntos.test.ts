import { describe, expect, it } from 'vitest';
import {
  criar,
  diferenca,
  estaContido,
  formatar,
  iguais,
  intersecao,
  operar,
  pertence,
  porExtenso,
  regioes,
  uniao,
} from '../../domain/conjuntos';

const A = ['vôlei', 'futsal', 'natação'];
const B = ['futsal', 'natação', 'basquete'];

describe('operações de conjuntos (seção 10)', () => {
  it('união sem repetir, na ordem de aparição', () => {
    expect(uniao(A, B)).toEqual(['vôlei', 'futsal', 'natação', 'basquete']);
  });
  it('interseção', () => {
    expect(intersecao(A, B)).toEqual(['futsal', 'natação']);
  });
  it('diferença: a ordem importa', () => {
    expect(diferenca(A, B)).toEqual(['vôlei']);
    expect(diferenca(B, A)).toEqual(['basquete']);
  });
  it('pertinência', () => {
    expect(pertence('futsal', A)).toBe(true);
    expect(pertence('basquete', A)).toBe(false);
  });
  it('inclusão admite igualdade (A ⊂ A)', () => {
    expect(estaContido(A, A)).toBe(true);
    expect(estaContido(['futsal'], A)).toBe(true);
    expect(estaContido(B, A)).toBe(false);
    expect(estaContido([], A)).toBe(true);
  });
  it('regiões do diagrama', () => {
    expect(regioes(A, B)).toEqual({ soA: ['vôlei'], ambos: ['futsal', 'natação'], soB: ['basquete'] });
  });
  it('normaliza em NFC e remove repetidos', () => {
    const decomposto = 'natação'; // "natação" com acentos combinantes
    expect(criar([decomposto, 'natação', ' natação '])).toEqual(['natação']);
    expect(pertence(decomposto, A)).toBe(true);
  });
  it('igualdade ignora ordem e repetição', () => {
    expect(iguais(['b', 'a', 'a'], ['a', 'b'])).toBe(true);
    expect(iguais(['a'], ['a', 'b'])).toBe(false);
  });
  it('formatar e por extenso', () => {
    expect(formatar(['futsal', 'natação'])).toBe('{futsal, natação}');
    expect(formatar([])).toBe('∅');
    expect(porExtenso(['maçã', 'banana', 'uva'])).toBe('maçã, banana e uva');
    expect(porExtenso(['uva'])).toBe('uva');
    expect(porExtenso([])).toBe('nenhum elemento');
  });
  it('operar despacha pela operação', () => {
    expect(operar('uniao', A, B)).toEqual(uniao(A, B));
    expect(operar('intersecao', A, B)).toEqual(intersecao(A, B));
    expect(operar('diferenca', A, B)).toEqual(diferenca(A, B));
  });
});
