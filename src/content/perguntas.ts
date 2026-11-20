/**
 * Banco de 10 perguntas do quiz (seção 7): uma por conceito dos oito primeiros
 * e duas de linguagem lógica. A ordem das alternativas é embaralhada a cada tentativa.
 */
import type { Pergunta } from './tipos';

const ANA = ['vôlei', 'futsal', 'natação'] as const;
const BRUNO = ['futsal', 'natação', 'basquete'] as const;
const ESPORTES = { A: ANA, B: BRUNO };

export const perguntas: readonly Pergunta[] = [
  {
    id: 'P1',
    conceitoId: 'conjuntos',
    enunciado: 'Qual das opções descreve um conjunto bem definido?',
    alternativas: [
      { id: 'a', texto: 'Os filmes legais.', correta: false },
      { id: 'b', texto: 'As músicas bonitas.', correta: false },
      { id: 'c', texto: 'Os alunos da sua sala com mais de 16 anos.', correta: true },
      { id: 'd', texto: 'Os esportes divertidos.', correta: false },
    ],
    dica: 'Um conjunto precisa de um critério que qualquer pessoa consiga conferir.',
    explicacaoErro:
      "Quase lá! 'Legal', 'bonito' e 'divertido' dependem de opinião. Um conjunto precisa de um critério claro, como 'ter mais de 16 anos', que qualquer pessoa consegue conferir.",
  },
  {
    id: 'P2',
    conceitoId: 'elementos',
    enunciado: 'Sendo A = {2, 4, 6, 8}, quantos elementos tem A?',
    alternativas: [
      { id: 'a', texto: '3', correta: false },
      { id: 'b', texto: '4', correta: true },
      { id: 'c', texto: '8', correta: false },
      { id: 'd', texto: '20', correta: false },
    ],
    dica: 'Conte cada número separado por vírgula.',
    explicacaoErro:
      'Quase lá! Cada número listado é um elemento. Os elementos de A são 2, 4, 6 e 8, então A tem 4 elementos. O valor dos números não muda a contagem.',
  },
  {
    id: 'P3',
    conceitoId: 'pertinencia',
    enunciado: 'Sendo A = {maçã, banana, uva}, qual afirmação é verdadeira?',
    alternativas: [
      { id: 'a', texto: 'abacaxi ∈ A', correta: false },
      { id: 'b', texto: 'banana ∈ A', correta: true },
      { id: 'c', texto: 'uva ∉ A', correta: false },
      { id: 'd', texto: 'maçã ∉ A', correta: false },
    ],
    dica: '∈ quer dizer "pertence". O elemento precisa estar dentro das chaves.',
    dicaFalada: 'o símbolo de pertence quer dizer que o elemento está no conjunto. Ele precisa aparecer dentro das chaves.',
    explicacaoErro:
      "Quase lá! O símbolo ∈ significa 'pertence'. Só a banana, entre essas opções, está mesmo em A, então banana ∈ A. Para o abacaxi, que não está em A, o certo seria abacaxi ∉ A.",
    explicacaoErroFalada:
      'Quase lá! O símbolo de pertence quer dizer que o elemento está no conjunto. Entre essas opções, só a banana está mesmo em A, então banana pertence a A. Para o abacaxi, que não está em A, o certo seria abacaxi não pertence a A.',
  },
  {
    id: 'P4',
    conceitoId: 'representacao',
    enunciado:
      'O diagrama mostra um círculo A com os números 1, 3 e 5 dentro. Como escrevemos esse conjunto listando seus elementos?',
    recurso: {
      tipo: 'diagrama',
      conjuntos: { A: ['1', '3', '5'] },
      destaque: { tipo: 'nenhum' },
    },
    alternativas: [
      { id: 'a', texto: 'A = {1, 3, 5}', correta: true },
      { id: 'b', texto: 'A = (1, 3, 5)', correta: false },
      { id: 'c', texto: 'A = [1, 3, 5]', correta: false },
      { id: 'd', texto: 'A = {1, 5}', correta: false },
    ],
    dica: 'Para listar os elementos de um conjunto usamos chaves.',
    explicacaoErro:
      'Quase lá! Na listagem, os elementos ficam entre chaves { } e separados por vírgulas. O diagrama mostra 1, 3 e 5, então A = {1, 3, 5}.',
    explicacaoErroFalada:
      'Quase lá! Na listagem, os elementos ficam entre chaves e separados por vírgulas. O diagrama mostra 1, 3 e 5, então A igual a, abre chaves, 1, 3, 5, fecha chaves.',
  },
  {
    id: 'P5',
    conceitoId: 'inclusao',
    enunciado: 'Sendo A = {maçã, banana, uva} e B = {maçã, banana}, qual afirmação é verdadeira?',
    recurso: {
      tipo: 'diagrama',
      conjuntos: { A: ['maçã', 'banana', 'uva'], B: ['maçã', 'banana'] },
      destaque: { tipo: 'nenhum' },
    },
    alternativas: [
      { id: 'a', texto: 'B ∈ A', correta: false },
      { id: 'b', texto: 'maçã ⊂ A', correta: false },
      { id: 'c', texto: 'B ⊂ A', correta: true },
      { id: 'd', texto: 'A ⊂ B', correta: false },
    ],
    dica: '⊂ liga um conjunto a outro conjunto. Todos os elementos de B estão em A?',
    explicacaoErro:
      'Quase lá! Pertinência (∈) liga elemento a conjunto; inclusão (⊂) liga conjunto a conjunto. Maçã e banana, todos os elementos de B, também estão em A, então B ⊂ A. Já A ⊂ B é falsa, porque a uva está em A e não está em B.',
  },
  {
    id: 'P6',
    conceitoId: 'uniao',
    enunciado:
      'Sendo A = {vôlei, futsal, natação} e B = {futsal, natação, basquete}, quanto é A ∪ B?',
    recurso: { tipo: 'diagrama', conjuntos: ESPORTES, destaque: { tipo: 'nenhum' } },
    alternativas: [
      { id: 'a', texto: '{futsal, natação}', correta: false, conjunto: ['futsal', 'natação'] },
      {
        id: 'b',
        texto: '{vôlei, futsal, natação, basquete}',
        correta: true,
        conjunto: ['vôlei', 'futsal', 'natação', 'basquete'],
      },
      { id: 'c', texto: '{vôlei, basquete}', correta: false, conjunto: ['vôlei', 'basquete'] },
      {
        id: 'd',
        texto: '{vôlei, futsal, natação}',
        correta: false,
        conjunto: ['vôlei', 'futsal', 'natação'],
      },
    ],
    dica: 'A união junta tudo o que está em A ou em B, sem repetir.',
    explicacaoErro:
      'Quase lá! A união reúne todos os elementos de A, de B ou dos dois, citando cada um uma vez só. Juntando tudo, A ∪ B = {vôlei, futsal, natação, basquete}.',
    verificacao: { operacao: 'uniao', a: ANA, b: BRUNO },
  },
  {
    id: 'P7',
    conceitoId: 'intersecao',
    enunciado: 'Com os mesmos A e B, quais esportes pertencem a A ∩ B?',
    recurso: { tipo: 'diagrama', conjuntos: ESPORTES, destaque: { tipo: 'nenhum' } },
    alternativas: [
      { id: 'a', texto: '{vôlei}', correta: false, conjunto: ['vôlei'] },
      { id: 'b', texto: '{basquete}', correta: false, conjunto: ['basquete'] },
      { id: 'c', texto: '{futsal, natação}', correta: true, conjunto: ['futsal', 'natação'] },
      {
        id: 'd',
        texto: '{vôlei, futsal, natação, basquete}',
        correta: false,
        conjunto: ['vôlei', 'futsal', 'natação', 'basquete'],
      },
    ],
    dica: 'Procure o que aparece nos dois conjuntos ao mesmo tempo.',
    explicacaoErro:
      'Quase lá! Lembre-se: a interseção reúne os elementos que aparecem nos dois conjuntos. Futsal e natação estão em A e em B, então A ∩ B = {futsal, natação}.',
    verificacao: { operacao: 'intersecao', a: ANA, b: BRUNO },
  },
  {
    id: 'P8',
    conceitoId: 'diferenca',
    enunciado: 'Com os mesmos A e B, quanto é A − B?',
    recurso: { tipo: 'diagrama', conjuntos: ESPORTES, destaque: { tipo: 'nenhum' } },
    alternativas: [
      { id: 'a', texto: '{vôlei}', correta: true, conjunto: ['vôlei'] },
      { id: 'b', texto: '{basquete}', correta: false, conjunto: ['basquete'] },
      { id: 'c', texto: '{futsal, natação}', correta: false, conjunto: ['futsal', 'natação'] },
      { id: 'd', texto: '{vôlei, basquete}', correta: false, conjunto: ['vôlei', 'basquete'] },
    ],
    dica: 'A − B é o que está em A e não está em B.',
    explicacaoErro:
      'Quase lá! A − B guarda só o que está em A e não está em B. Futsal e natação também estão em B, então saem, e sobra vôlei. Repare que B − A seria {basquete}: a ordem importa.',
    verificacao: { operacao: 'diferenca', a: ANA, b: BRUNO },
  },
  {
    id: 'P9',
    conceitoId: 'logica',
    enunciado: 'Qual expressão em palavras corresponde a C ⊄ A?',
    alternativas: [
      { id: 'a', texto: 'C pertence a A.', correta: false },
      { id: 'b', texto: 'C não pertence a A.', correta: false },
      { id: 'c', texto: 'C está contido em A.', correta: false },
      { id: 'd', texto: 'C não está contido em A.', correta: true },
    ],
    dica: 'O traço sobre o símbolo nega a relação.',
    dicaFalada: 'o tracinho que corta o símbolo nega a relação.',
    explicacaoErro:
      "Quase lá! O símbolo ⊂ lê-se 'está contido em' e o traço o nega: ⊄ é 'não está contido em'. 'Pertence' e 'não pertence' usam ∈ e ∉.",
    explicacaoErroFalada:
      'Quase lá! O símbolo de está contido se lê está contido em, e o tracinho que corta o símbolo nega a relação: cortado, ele se lê não está contido em. Pertence e não pertence usam outros símbolos, os da pertinência.',
  },
  {
    id: 'P10',
    conceitoId: 'logica',
    enunciado: 'Sendo A = {1, 2, 3}, qual afirmação está escrita de forma incorreta?',
    alternativas: [
      { id: 'a', texto: '2 ∈ A', correta: false },
      { id: 'b', texto: '5 ∉ A', correta: false },
      { id: 'c', texto: '{1, 2} ⊂ A', correta: false },
      { id: 'd', texto: '3 ⊂ A', correta: true },
    ],
    dica: '⊂ só liga conjuntos. O número 3 é um conjunto?',
    explicacaoErro:
      'Quase lá! O 3 é um elemento, não um conjunto, então o certo é 3 ∈ A. O símbolo ⊂ só liga conjuntos, como em {1, 2} ⊂ A.',
    explicacaoErroFalada:
      'Quase lá! O 3 é um elemento, e não um conjunto, então o certo é 3 pertence a A. O símbolo de está contido só liga conjuntos, como em: o conjunto com 1 e 2 está contido em A.',
  },
];
