import { describe, expect, it } from 'vitest';
import { simbolosRestantes, textoFalado } from '../../domain/falado';
import { resolverExpressoes } from '../../domain/expressoes';
import { montarRoteiro } from '../../validacao/roteiroDeVoz';
import { trilha } from '../../content/trilha';
import { perguntas } from '../../content/perguntas';
import { falas } from '../../content/falas';

describe('texto falado (símbolos viram palavras)', () => {
  it('relações entre termos', () => {
    expect(textoFalado('Logo banana ∈ A e abacaxi ∉ A.')).toBe('Logo banana pertence a A e abacaxi não pertence a A.');
    expect(textoFalado('B ⊂ A, C ⊄ A e A ⊃ B.')).toBe('B está contido em A, C não está contido em A e A contém B.');
  });
  it('operações e resultados por listagem', () => {
    expect(textoFalado('A ∪ B = {vôlei, futsal, natação, basquete}.')).toBe(
      'A união B é igual ao conjunto com vôlei, futsal, natação e basquete.',
    );
    expect(textoFalado('Já B − A = {basquete}.')).toBe('Já B menos A é igual ao conjunto com basquete.');
    expect(textoFalado('Escrevemos A ∩ B.')).toBe('Escrevemos A interseção B.');
  });
  it('símbolos soltos e entre parênteses', () => {
    expect(textoFalado('∈ e ∉ respondem à pergunta')).toBe(
      'O símbolo de pertence e o símbolo de não pertence respondem à pergunta',
    );
    expect(textoFalado("'pertence' (∈) e 'não pertence' (∉)")).toBe("'pertence' e 'não pertence'");
    expect(textoFalado('liga elemento a conjunto (∈, ∉).')).toBe('Liga elemento a conjunto.');
    expect(textoFalado('O símbolo ⊂ só liga conjuntos.')).toBe('O símbolo de está contido só liga conjuntos.');
  });
  it('lista depois de dois-pontos e conjunto escrito com chaves dentro de outro', () => {
    expect(textoFalado('as frutas da cesta A: {maçã, banana, uva}.')).toBe('As frutas da cesta A: maçã, banana e uva.');
    expect(textoFalado('como em {1, 2} ⊂ A')).toBe('Como no conjunto com 1 e 2 está contido em A');
  });
  it('expressões próprias da voz', () => {
    const c = { A: ['maçã', 'banana', 'uva'] };
    expect(resolverExpressoes('A igual a, {{chaves A}}.', c)).toBe('A igual a, abre chaves, maçã, banana, uva, fecha chaves.');
    expect(resolverExpressoes('com {{lista A}}', c)).toBe('com maçã, banana e uva');
  });
});

describe('roteiro de voz', () => {
  const roteiro = montarRoteiro({ trilha, perguntas, falas });

  it('toda fala da trilha e do quiz tem um arquivo de áudio próprio', () => {
    const nomes = roteiro.map((i) => i.arquivo);
    expect(nomes).toHaveLength(87);
    expect(new Set(nomes).size).toBe(nomes.length);
    expect(nomes).toContain('c3-explicacao.mp3');
    expect(nomes).toContain('p7-dica.mp3');
    expect(nomes).toContain('final-media.mp3');
  });

  it('nenhum texto falado sobra com símbolo matemático', () => {
    for (const item of roteiro) expect(simbolosRestantes(item.falado), item.arquivo).toEqual([]);
  });

  it('as falas finais são gravadas sem os números', () => {
    for (const item of roteiro.filter((i) => i.arquivo.startsWith('final-'))) {
      expect(item.falado).not.toMatch(/\d|\{n\}|\{total\}/);
      expect(item.tela).toContain('X de N');
    }
  });
});
