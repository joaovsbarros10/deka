/**
 * A trilha: 8 conceitos de Teoria dos Conjuntos e o módulo de linguagem lógica
 * (seção 7). As frutas e os esportes são os dados reais que o diagrama usa
 * (RN-10): mudar um conjunto aqui muda texto e imagem juntos.
 *
 * Expressões entre chaves duplas, como {{A ∪ B}}, são calculadas pelo domínio.
 */
import type { Conceito, Conjuntos } from './tipos';
import { audioDaEtapa, audioDaRespostaAoGancho } from './vozes';

const FRUTAS = ['maçã', 'banana', 'uva'] as const;

const CESTA: Conjuntos = { A: FRUTAS };
const INCLUSAO: Conjuntos = {
  A: FRUTAS,
  B: ['maçã', 'banana'],
  C: ['maçã', 'abacaxi'],
};
/** A = esportes da Ana, B = esportes do Bruno. */
const ESPORTES: Conjuntos = {
  A: ['vôlei', 'futsal', 'natação'],
  B: ['futsal', 'natação', 'basquete'],
};

const conceitos: readonly Conceito[] = [
  {
    id: 'conjuntos',
    ordem: 1,
    titulo: 'O que são conjuntos?',
    simbolo: '{ }',
    objetivo: 'Explicar que um conjunto agrupa elementos por um critério claro',
    modulo: 'conjuntos',
    conjuntos: CESTA,
    etapas: [
      {
        tipo: 'gancho',
        fala: {
          texto: 'Na sua playlist, você junta as músicas de algum jeito? Por estilo, por artista?',
          expressao: 'pensativa',
        },
        opcoes: ['Por estilo', 'Por artista', 'Misturo tudo'],
        respostaAoGancho: {
          texto:
            'Misturar tudo também é um jeito! Mas, quando juntamos coisas seguindo um critério claro, temos o que a matemática chama de conjunto.',
          expressao: 'incentivando',
        },
      },
      {
        tipo: 'explicacao',
        fala: {
          texto:
            "Um conjunto é um grupo de coisas reunidas por um critério claro. O critério diz exatamente o que entra e o que fica de fora, como em 'as frutas da cesta A'. Se não dá para conferir o critério, não temos um conjunto bem definido.",
          expressao: 'neutra',
        },
      },
      {
        tipo: 'visual',
        fala: {
          texto:
            'Dentro do círculo estão as frutas da cesta A: {{A}}. O abacaxi está na mesa, por isso aparece do lado de fora, com a borda pontilhada.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: CESTA,
          foraDeTodos: ['abacaxi'],
          legendaFora: 'não está na cesta A',
          destaque: { tipo: 'nenhum' },
        },
      },
      {
        tipo: 'exemplo',
        fala: {
          texto:
            'Critério: ser fruta da cesta A. Maçã, banana e uva estão na cesta, então entram. O abacaxi está na mesa, então fica de fora. A cadeira nem é fruta, então também fica de fora.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: CESTA,
          foraDeTodos: ['abacaxi', 'cadeira'],
          legendaFora: 'ficam de fora da cesta A',
          destaque: { tipo: 'nenhum' },
        },
      },
      {
        tipo: 'sintese',
        fala: {
          texto:
            'Conjunto é um grupo com um critério claro: quem cumpre o critério entra, quem não cumpre fica de fora.',
          expressao: 'neutra',
        },
      },
    ],
  },

  {
    id: 'elementos',
    ordem: 2,
    titulo: 'Elementos de um conjunto',
    simbolo: 'a, b',
    objetivo: 'Identificar e contar os elementos',
    modulo: 'conjuntos',
    conjuntos: {
      A: FRUTAS,
      B: ['segunda-feira', 'sexta-feira', 'sábado'],
    },
    etapas: [
      {
        tipo: 'gancho',
        fala: {
          texto:
            "Pense na sua turma. Cada colega faz parte dela. Que nome você daria a cada 'peça' da turma?",
          expressao: 'pensativa',
        },
        opcoes: ['Integrante', 'Membro', 'Parte'],
        respostaAoGancho: {
          texto:
            'Todos esses nomes funcionam no dia a dia! Na matemática, a palavra oficial é elemento.',
          expressao: 'incentivando',
        },
      },
      {
        tipo: 'explicacao',
        fala: {
          texto:
            'Cada objeto que pertence a um conjunto é um elemento dele. No conjunto A das frutas da cesta, maçã, banana e uva são elementos. A ordem em que listamos os elementos não muda o conjunto.',
          expressao: 'neutra',
        },
      },
      {
        tipo: 'visual',
        fala: {
          texto:
            'Cada fruta dentro do círculo é um elemento de A. Contando um por um, sem repetir, A tem {{#A}} elementos.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: { A: FRUTAS },
          destaque: { tipo: 'contagem', conjunto: 'A' },
        },
      },
      {
        tipo: 'exemplo',
        fala: {
          texto:
            "B é o conjunto dos dias da semana cujo nome começa com 's'. Segunda-feira, sexta-feira e sábado cumprem o critério. Então B tem {{#B}} elementos.",
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: { B: ['segunda-feira', 'sexta-feira', 'sábado'] },
          destaque: { tipo: 'contagem', conjunto: 'B' },
        },
      },
      {
        tipo: 'sintese',
        fala: {
          texto:
            'Elemento é cada integrante do conjunto. Para contar os elementos, conte os integrantes, sem repetir.',
          expressao: 'neutra',
        },
      },
    ],
  },

  {
    id: 'pertinencia',
    ordem: 3,
    titulo: 'Pertinência e não pertinência',
    simbolo: '∈',
    objetivo: 'Usar ∈ e ∉ entre elemento e conjunto',
    modulo: 'conjuntos',
    conjuntos: CESTA,
    etapas: [
      {
        tipo: 'gancho',
        fala: {
          texto:
            'Você está na lista de chamada da sua turma? E o diretor da escola, está?',
          expressao: 'pensativa',
        },
        opcoes: ['Eu estou', 'O diretor não está', 'Depende da turma'],
        respostaAoGancho: {
          texto:
            'Repare que sempre dá para dizer se alguém está ou não está em um grupo. A matemática tem símbolos para isso.',
          expressao: 'incentivando',
        },
      },
      {
        tipo: 'explicacao',
        fala: {
          texto:
            "A pertinência liga um elemento a um conjunto. Se o elemento está no conjunto, ele pertence: usamos ∈. Se não está, não pertence: usamos ∉. Lemos 'maçã ∈ A' como 'maçã pertence a A'.",
          falado:
            'A pertinência liga um elemento a um conjunto. Se o elemento está no conjunto, ele pertence, e usamos o símbolo de pertence. Se não está, não pertence, e usamos o símbolo de não pertence. Quando aparece maçã, o símbolo e a letra A, lemos: maçã pertence a A.',
          expressao: 'neutra',
        },
      },
      {
        tipo: 'visual',
        fala: {
          texto:
            'Veja as fichas: a banana está dentro do círculo A, e o abacaxi está do lado de fora. Cada ficha liga um elemento ao conjunto A.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: CESTA,
          foraDeTodos: ['abacaxi'],
          destaque: { tipo: 'pertinencia', conjunto: 'A', elementos: ['banana', 'abacaxi'] },
        },
      },
      {
        tipo: 'exemplo',
        fala: {
          texto:
            'Sendo A = {{A}}: a banana está em A, logo banana ∈ A. O abacaxi não está em A, logo abacaxi ∉ A. Nos dois casos o símbolo liga um elemento a um conjunto.',
          falado:
            'Sendo A igual a {{A}}: a banana está em A, logo banana ∈ A. O abacaxi não está em A, logo abacaxi ∉ A. Nos dois casos o símbolo liga um elemento a um conjunto.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: CESTA,
          foraDeTodos: ['abacaxi'],
          destaque: { tipo: 'pertinencia', conjunto: 'A', elementos: ['banana', 'abacaxi'] },
        },
      },
      {
        tipo: 'sintese',
        fala: {
          texto: '∈ e ∉ respondem à pergunta: esse elemento está nesse conjunto?',
          expressao: 'neutra',
        },
      },
    ],
  },

  {
    id: 'representacao',
    ordem: 4,
    titulo: 'Representação de conjuntos',
    simbolo: '{…}',
    objetivo: 'Escrever o mesmo conjunto entre chaves e como diagrama',
    modulo: 'conjuntos',
    conjuntos: { A: FRUTAS, B: ['2', '4', '6'] },
    etapas: [
      {
        tipo: 'gancho',
        fala: {
          texto: 'Como você contaria a um colega, por escrito, quais frutas estão na cesta?',
          expressao: 'pensativa',
        },
        opcoes: ['Listando uma por uma', 'Desenhando', 'Os dois'],
        respostaAoGancho: {
          texto: 'Os dois jeitos existem na matemática! Vamos conhecer cada um.',
          expressao: 'incentivando',
        },
      },
      {
        tipo: 'explicacao',
        fala: {
          texto:
            'Há duas formas de representar um conjunto. Na listagem, escrevemos os elementos entre chaves, separados por vírgulas: A = {{A}}. No diagrama, desenhamos uma curva fechada e colocamos os elementos dentro dela.',
          falado:
            'Há duas formas de representar um conjunto. Na listagem, escrevemos os elementos entre chaves, separados por vírgulas. O conjunto A fica assim: A igual a, {{chaves A}}. No diagrama, desenhamos uma curva fechada e colocamos os elementos dentro dela.',
          expressao: 'neutra',
        },
      },
      {
        tipo: 'visual',
        fala: {
          texto:
            'Em cima, a listagem; embaixo, o diagrama. As linhas ligam cada elemento nas duas formas: é o mesmo conjunto A.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'listagem-e-diagrama',
          conjuntos: { A: FRUTAS },
          destaque: { tipo: 'nenhum' },
        },
      },
      {
        tipo: 'exemplo',
        fala: {
          texto:
            'B é o conjunto dos números pares maiores que 0 e menores que 8. Na listagem: B = {{B}}. No diagrama: um círculo B com 2, 4 e 6 dentro. É o mesmo conjunto escrito de dois jeitos.',
          falado:
            'B é o conjunto dos números pares maiores que 0 e menores que 8. Na listagem: B igual a, {{chaves B}}. No diagrama: um círculo B com {{lista B}} dentro. É o mesmo conjunto escrito de dois jeitos.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'listagem-e-diagrama',
          conjuntos: { B: ['2', '4', '6'] },
          destaque: { tipo: 'nenhum' },
        },
      },
      {
        tipo: 'sintese',
        fala: {
          texto:
            'A listagem diz os elementos com chaves e vírgulas; o diagrama mostra os elementos dentro do conjunto. Um conjunto sem elementos é o conjunto vazio, escrito { } ou ∅.',
          falado:
            'A listagem diz os elementos com chaves e vírgulas; o diagrama mostra os elementos dentro do conjunto. Um conjunto sem elementos é o conjunto vazio, escrito com chaves sem nada dentro, ou com o símbolo de vazio: um círculo cortado por um traço.',
          expressao: 'neutra',
        },
      },
    ],
  },

  {
    id: 'inclusao',
    ordem: 5,
    titulo: 'Inclusão e não inclusão',
    simbolo: '⊂',
    objetivo: 'Decidir se um conjunto está contido em outro e distinguir isso de pertinência',
    modulo: 'conjuntos',
    conjuntos: INCLUSAO,
    etapas: [
      {
        tipo: 'gancho',
        fala: {
          texto:
            'Todo mundo do time de futsal da sala também é da sala. E todo mundo da sala é do time de futsal?',
          expressao: 'pensativa',
        },
        opcoes: ['Sim', 'Não', 'Depende'],
        respostaAoGancho: {
          texto:
            'O time cabe dentro da sala, mas a sala não cabe dentro do time. Essa ideia de um grupo dentro de outro é a inclusão.',
          expressao: 'incentivando',
        },
      },
      {
        tipo: 'explicacao',
        fala: {
          texto:
            'A inclusão liga um conjunto a outro conjunto. Se todos os elementos de B também são elementos de A, B está contido em A: B ⊂ A. Se algum elemento de B não está em A, B não está contido em A: B ⊄ A.',
          falado:
            'A inclusão liga um conjunto a outro conjunto. Se todos os elementos de B também são elementos de A, dizemos que B está contido em A, e usamos o símbolo de está contido. Se algum elemento de B não está em A, B não está contido em A, e o símbolo aparece cortado.',
          expressao: 'neutra',
        },
      },
      {
        tipo: 'visual',
        fala: {
          texto:
            'B = {{B}} fica inteiro dentro de A. Já C = {{C}} cruza a borda de A: o abacaxi, em destaque, está em C e fica fora de A.',
          falado:
            'B, o conjunto com {{lista B}}, fica inteiro dentro de A. Já C, com {{lista C}}, cruza a borda de A: o abacaxi, em destaque, está em C e fica fora de A.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: INCLUSAO,
          destaque: { tipo: 'inclusao', continente: 'A', contidos: ['B', 'C'] },
        },
      },
      {
        tipo: 'exemplo',
        fala: {
          texto:
            'Todos os elementos de B, maçã e banana, estão em A, logo B ⊂ A. Também podemos dizer que A contém B: A ⊃ B. Em C, o abacaxi não está em A, logo C ⊄ A.',
          falado:
            'Todos os elementos de B, maçã e banana, estão em A, logo B está contido em A. Também podemos dizer o contrário: A contém B. Em C, o abacaxi não está em A, logo C não está contido em A.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: INCLUSAO,
          destaque: { tipo: 'inclusao', continente: 'A', contidos: ['B', 'C'] },
        },
      },
      {
        tipo: 'comparativo',
        fala: {
          texto: 'Guarde: ∈ liga elemento a conjunto; ⊂ liga conjunto a conjunto.',
          expressao: 'neutra',
        },
        recurso: {
          tipo: 'quadro-simbolos',
          conjuntos: INCLUSAO,
          destaque: { tipo: 'nenhum' },
          quadro: {
            titulo: 'Pertinência ou inclusão?',
            colunas: ['Escrita', 'O que liga', 'Nome'],
            colunaAfirmacao: 0,
            linhas: [
              { celulas: ['maçã ∈ A', 'elemento a conjunto', 'pertinência'], tom: 'certo' },
              { celulas: ['B ⊂ A', 'conjunto a conjunto', 'inclusão'], tom: 'certo' },
              {
                celulas: ['maçã ⊂ A', 'maçã não é conjunto', 'erro comum: o certo é maçã ∈ A'],
                tom: 'errado',
              },
              {
                celulas: ['B ∈ A', 'B não é uma das frutas de A', 'erro comum: o certo é B ⊂ A'],
                tom: 'errado',
              },
            ],
            nota: 'Todo conjunto está contido em si mesmo: A ⊂ A.',
          },
        },
      },
      {
        tipo: 'sintese',
        fala: {
          texto:
            'Pertinência é um elemento dentro de um conjunto. Inclusão é um conjunto dentro de outro. São ideias diferentes, com símbolos diferentes.',
          expressao: 'neutra',
        },
      },
    ],
  },

  {
    id: 'uniao',
    ordem: 6,
    titulo: 'União',
    simbolo: '∪',
    objetivo: 'Calcular A ∪ B',
    modulo: 'conjuntos',
    conjuntos: ESPORTES,
    etapas: [
      {
        tipo: 'gancho',
        fala: {
          texto:
            'Você e um colega vão montar uma lista com todos os lanches que os dois trouxeram. O que entra na lista?',
          expressao: 'pensativa',
        },
        opcoes: ['Só os meus', 'Só os dele', 'Todos juntos, sem repetir'],
        respostaAoGancho: {
          texto: 'Juntar tudo, sem repetir, é exatamente a ideia de união.',
          expressao: 'incentivando',
        },
      },
      {
        tipo: 'explicacao',
        fala: {
          texto:
            'A união de A e B reúne todos os elementos que estão em A, em B ou nos dois. Escrevemos A ∪ B. Um elemento que aparece nos dois conjuntos entra uma vez só.',
          expressao: 'neutra',
        },
      },
      {
        tipo: 'visual',
        fala: {
          texto:
            'A = {{A}} são os esportes da Ana, e B = {{B}}, os do Bruno. Na união, as três regiões ficam destacadas ao mesmo tempo.',
          falado:
            'A, com {{lista A}}, são os esportes da Ana. B, com {{lista B}}, são os do Bruno. Na união, as três regiões ficam destacadas ao mesmo tempo.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: ESPORTES,
          destaque: { tipo: 'regiao', operacao: 'uniao', de: ['A', 'B'] },
        },
      },
      {
        tipo: 'exemplo',
        fala: {
          texto:
            'A ∪ B = {{A ∪ B}}. Futsal e natação estão nos dois conjuntos, mas aparecem uma vez só. A união tem {{#A ∪ B}} elementos.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: ESPORTES,
          destaque: { tipo: 'regiao', operacao: 'uniao', de: ['A', 'B'] },
        },
      },
      {
        tipo: 'sintese',
        fala: {
          texto: 'União é tudo o que está em A ou em B, ou nos dois.',
          expressao: 'neutra',
        },
      },
    ],
  },

  {
    id: 'intersecao',
    ordem: 7,
    titulo: 'Interseção',
    simbolo: '∩',
    objetivo: 'Calcular A ∩ B',
    modulo: 'conjuntos',
    conjuntos: ESPORTES,
    etapas: [
      {
        tipo: 'gancho',
        fala: {
          texto:
            'A Ana e o Bruno querem marcar um treino juntos. Qual esporte eles podem escolher?',
          expressao: 'pensativa',
        },
        opcoes: ['Vôlei', 'Futsal', 'Basquete'],
        respostaAoGancho: {
          texto:
            'Vamos conferir! Só dá para escolher um esporte que os dois praticam. O que fica na sobreposição dos grupos é a interseção.',
          expressao: 'incentivando',
        },
      },
      {
        tipo: 'explicacao',
        fala: {
          texto:
            'A interseção de A e B contém só os elementos que pertencem a A e também a B. Escrevemos A ∩ B. No diagrama, é a região onde os círculos se sobrepõem.',
          expressao: 'neutra',
        },
      },
      {
        tipo: 'visual',
        fala: {
          texto:
            'Só a região do meio fica destacada: é onde estão os esportes que a Ana e o Bruno praticam. As outras regiões ficam esmaecidas.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: ESPORTES,
          destaque: { tipo: 'regiao', operacao: 'intersecao', de: ['A', 'B'] },
        },
      },
      {
        tipo: 'exemplo',
        fala: {
          texto:
            'A ∩ B = {{A ∩ B}}. Vôlei só está em A e basquete só está em B, então os dois ficam de fora.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: ESPORTES,
          destaque: { tipo: 'regiao', operacao: 'intersecao', de: ['A', 'B'] },
        },
      },
      {
        tipo: 'sintese',
        fala: {
          texto: 'Interseção é o que está nos dois conjuntos ao mesmo tempo.',
          expressao: 'neutra',
        },
      },
    ],
  },

  {
    id: 'diferenca',
    ordem: 8,
    titulo: 'Diferença',
    simbolo: '−',
    objetivo: 'Calcular A − B e perceber que a ordem importa',
    modulo: 'conjuntos',
    conjuntos: ESPORTES,
    etapas: [
      {
        tipo: 'gancho',
        fala: {
          texto:
            'A Ana quer saber quais esportes ela pratica que o Bruno não pratica. Como você chamaria essa lista?',
          expressao: 'pensativa',
        },
        opcoes: ['Os exclusivos da Ana', 'Os que são iguais', 'Todos os esportes'],
        respostaAoGancho: {
          texto:
            'Tirar do grupo da Ana o que também é do Bruno é o que chamamos de diferença.',
          expressao: 'incentivando',
        },
      },
      {
        tipo: 'explicacao',
        fala: {
          texto:
            "A diferença A − B contém os elementos que pertencem a A e não pertencem a B. Lemos 'A menos B'. Atenção: B − A é outro conjunto, então a ordem importa.",
          expressao: 'neutra',
        },
      },
      {
        tipo: 'visual',
        fala: {
          texto:
            'No diagrama maior, só a parte de A fora de B fica destacada: é A − B. No menor, o destaque muda de lado: é B − A.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: ESPORTES,
          destaque: { tipo: 'regiao', operacao: 'diferenca', de: ['A', 'B'] },
          comparar: { tipo: 'regiao', operacao: 'diferenca', de: ['B', 'A'] },
        },
      },
      {
        tipo: 'exemplo',
        fala: {
          texto:
            'A − B = {{A − B}}, porque futsal e natação também estão em B e saem. Já B − A = {{B − A}}. Veja que A − B e B − A não são iguais.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: ESPORTES,
          destaque: { tipo: 'regiao', operacao: 'diferenca', de: ['A', 'B'] },
          comparar: { tipo: 'regiao', operacao: 'diferenca', de: ['B', 'A'] },
        },
      },
      {
        tipo: 'sintese',
        fala: {
          texto: 'A − B é o que está em A e não está em B. Trocar a ordem muda o resultado.',
          expressao: 'neutra',
        },
      },
    ],
  },

  {
    id: 'logica',
    ordem: 9,
    titulo: 'Linguagem lógica',
    simbolo: 'V F',
    objetivo: 'Traduzir e julgar afirmações com ∈, ∉, ⊂ e ⊄',
    modulo: 'logica',
    conjuntos: INCLUSAO,
    etapas: [
      {
        tipo: 'gancho',
        fala: {
          texto: "'Banana pertence a A.' Uma frase assim pode ser verdadeira ou falsa?",
          expressao: 'pensativa',
        },
        opcoes: ['Sim, depende do conjunto A', 'Só verdadeira', 'Não sei'],
        respostaAoGancho: {
          texto:
            'Uma afirmação sobre conjuntos é verdadeira ou falsa, e só olhando os elementos dá para saber qual. Vamos aprender a ler e a julgar essas frases.',
          expressao: 'incentivando',
        },
      },
      {
        tipo: 'explicacao',
        fala: {
          texto:
            "Quatro expressões aparecem sempre: 'pertence' (∈), 'não pertence' (∉), 'está contido' (⊂) e 'não está contido' (⊄). Use ∈ e ∉ entre um elemento e um conjunto. Use ⊂ e ⊄ entre dois conjuntos.",
          expressao: 'neutra',
        },
      },
      {
        tipo: 'visual',
        fala: {
          texto: 'Use este quadro como tradutor: a expressão em palavras, o símbolo e o que cada um liga.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'quadro-simbolos',
          conjuntos: INCLUSAO,
          destaque: { tipo: 'nenhum' },
          quadro: {
            titulo: 'Quadro de tradução',
            colunas: ['Em palavras', 'Símbolo', 'O que liga', 'Exemplo'],
            colunaAfirmacao: 3,
            linhas: [
              { celulas: ['pertence', '∈', 'elemento e conjunto', 'banana ∈ A'] },
              { celulas: ['não pertence', '∉', 'elemento e conjunto', 'abacaxi ∉ A'] },
              { celulas: ['está contido', '⊂', 'conjunto e conjunto', 'B ⊂ A'] },
              { celulas: ['não está contido', '⊄', 'conjunto e conjunto', 'C ⊄ A'] },
            ],
          },
        },
      },
      {
        tipo: 'exemplo',
        fala: {
          texto:
            "Com A = {{A}}, B = {{B}} e C = {{C}}: 'banana ∈ B' é verdadeira, porque banana é elemento de B. 'B ⊂ A' é verdadeira, porque todos os elementos de B estão em A. 'A ⊂ B' é falsa, porque a uva está em A e não está em B.",
          falado:
            'Com A igual a {{A}}, B igual a {{B}} e C igual a {{C}}: banana pertence a B é verdadeira, porque banana é elemento de B. B está contido em A é verdadeira, porque todos os elementos de B estão em A. Já A está contido em B é falsa, porque a uva está em A e não está em B.',
          expressao: 'apontando',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: INCLUSAO,
          destaque: { tipo: 'inclusao', continente: 'B', contidos: ['A'] },
        },
      },
      {
        tipo: 'pratica',
        fala: {
          texto:
            'Agora é sua vez: marque Verdadeira ou Falsa em cada afirmação. Aqui não vale nota, é só para treinar.',
          expressao: 'pensativa',
        },
        recurso: {
          tipo: 'diagrama',
          conjuntos: INCLUSAO,
          destaque: { tipo: 'nenhum' },
        },
        afirmacoes: [
          {
            texto: 'abacaxi ∉ A',
            verdadeira: true,
            explicacao: 'Verdadeira: o abacaxi não é elemento de A.',
          },
          {
            texto: 'C ⊂ A',
            verdadeira: false,
            explicacao: 'Falsa: o abacaxi está em C e não está em A. O certo é C ⊄ A.',
          },
          {
            texto: 'maçã ⊂ A',
            verdadeira: false,
            explicacao: 'Falsa: maçã é elemento, e não conjunto. O certo é maçã ∈ A.',
          },
          {
            texto: 'C ⊄ B',
            verdadeira: true,
            explicacao: 'Verdadeira: o abacaxi está em C e não está em B.',
          },
        ],
      },
      {
        tipo: 'sintese',
        fala: {
          texto:
            'Para julgar uma afirmação, veja primeiro se ela liga elemento a conjunto (∈, ∉) ou conjunto a conjunto (⊂, ⊄). Depois confira os elementos.',
          expressao: 'neutra',
        },
      },
    ],
  },
];

/** Cada fala da trilha ganha o seu arquivo de áudio (c3-explicacao.mp3, c3-gancho-resposta.mp3…). */
export const trilha: readonly Conceito[] = conceitos.map((c) => ({
  ...c,
  etapas: c.etapas.map((e) => ({
    ...e,
    fala: { audio: audioDaEtapa(c.ordem, e.tipo), ...e.fala },
    ...(e.respostaAoGancho
      ? { respostaAoGancho: { audio: audioDaRespostaAoGancho(c.ordem), ...e.respostaAoGancho } }
      : {}),
  })),
}));
