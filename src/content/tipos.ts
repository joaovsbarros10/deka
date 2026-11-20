/**
 * Tipos do conteúdo da DEKA (seção 10 da documentação).
 * O conteúdo é dado, não código: lições, perguntas e falas vivem nesta pasta
 * e são conferidos pelo validador (scripts/validar-conteudo.ts) a cada build.
 */

export type Expressao =
  | 'neutra'
  | 'acenando'
  | 'comemorando'
  | 'pensativa'
  | 'incentivando'
  | 'apontando';

export type Faixa = 'alta' | 'media' | 'baixa';

export type TipoEtapa =
  | 'gancho'
  | 'explicacao'
  | 'visual'
  | 'exemplo'
  | 'comparativo'
  | 'pratica'
  | 'sintese';

export interface Fala {
  /**
   * Texto do balão. Aceita {n} e {total} (falas finais), {dica} e {explicacao}
   * (falas do quiz) e expressões de conjuntos entre chaves duplas, calculadas
   * pelo domínio: {{A}}, {{#A}}, {{A ∪ B}}, {{A ∩ B}}, {{A − B}}.
   */
  texto: string;
  /**
   * Texto que a Dequinha fala no áudio, quando a conversão automática do texto
   * (símbolos em palavras) não soa natural. Aceita as mesmas expressões {{ }}.
   */
  falado?: string;
  expressao: Expressao;
  /** Arquivo em public/audio (MP3 ou M4A). Sem ele, a fala fica só em texto. */
  audio?: string;
}

/** Conjuntos nomeados, ex.: { A: ['vôlei', 'futsal'], B: [...] }. */
export type Conjuntos = Readonly<Record<string, readonly string[]>>;

export type Operacao = 'uniao' | 'intersecao' | 'diferenca';

export type Destaque =
  | { tipo: 'nenhum' }
  /** diferenca = de[0] − de[1] */
  | { tipo: 'regiao'; operacao: Operacao; de: readonly [string, string] }
  /** Uma ficha "x ∈ A" ou "x ∉ A" por elemento; o símbolo é calculado. */
  | { tipo: 'pertinencia'; conjunto: string; elementos: readonly string[] }
  /** "B ⊂ A" ou "C ⊄ A" para cada contido; o símbolo é calculado. */
  | { tipo: 'inclusao'; continente: string; contidos: readonly string[] }
  /** Etiqueta "elemento" em cada um e o contador "A tem n elementos". */
  | { tipo: 'contagem'; conjunto: string };

export interface LinhaQuadro {
  celulas: readonly string[];
  /** Linhas de "erro comum" ou "uso certo" ganham ícone e texto, não só cor. */
  tom?: 'certo' | 'errado';
}

export interface QuadroSimbolos {
  titulo: string;
  colunas: readonly string[];
  linhas: readonly LinhaQuadro[];
  /**
   * Coluna com afirmações ("maçã ∈ A"). O validador julga cada uma com os
   * conjuntos do recurso: linha 'errado' tem de ser falsa; as demais, verdadeiras.
   */
  colunaAfirmacao?: number;
  nota?: string;
}

export interface RecursoVisual {
  tipo: 'diagrama' | 'listagem-e-diagrama' | 'quadro-simbolos';
  conjuntos: Conjuntos;
  /** Elementos desenhados fora de todos os conjuntos (ex.: abacaxi). */
  foraDeTodos?: readonly string[];
  /** Legenda dos elementos de fora (ex.: "não está na cesta A"). */
  legendaFora?: string;
  destaque: Destaque;
  /** Segundo diagrama, menor, para comparar (ex.: B − A ao lado de A − B). */
  comparar?: Destaque;
  /** Obrigatório no tipo 'quadro-simbolos'. */
  quadro?: QuadroSimbolos;
  /** Se ausente, o componente gera a partir dos dados e do destaque. */
  textoAlternativo?: string;
}

export interface Afirmacao {
  /** Forma "esquerda símbolo direita", ex.: "abacaxi ∉ A". */
  texto: string;
  verdadeira: boolean;
  explicacao: string;
}

export interface Etapa {
  tipo: TipoEtapa;
  /** O que a Dequinha diz nesta etapa. */
  fala: Fala;
  /** Obrigatório em 'visual' e 'comparativo'. */
  recurso?: RecursoVisual;
  /** Só em 'gancho' (2 ou 3 opções, sem certo nem errado). */
  opcoes?: readonly string[];
  /** Só em 'gancho', igual para qualquer opção (RN-02). */
  respostaAoGancho?: Fala;
  /** Só em 'pratica' (módulo de lógica). */
  afirmacoes?: readonly Afirmacao[];
}

export interface Conceito {
  /** ex.: 'intersecao' */
  id: string;
  /** 1 a 9 */
  ordem: number;
  titulo: string;
  /** Símbolo de capa do conceito (cards e índice). */
  simbolo: string;
  /** Uma linha: o que o estudante consegue ao final. */
  objetivo: string;
  modulo: 'conjuntos' | 'logica';
  /** Conjuntos usados nas expressões {{ }} das falas. */
  conjuntos: Conjuntos;
  etapas: readonly Etapa[];
}

export interface Alternativa {
  id: string;
  texto: string;
  correta: boolean;
  /** Em perguntas de operação, o conjunto que a alternativa representa. */
  conjunto?: readonly string[];
}

export interface Pergunta {
  /** ex.: 'P7' */
  id: string;
  /** Deve existir na trilha. */
  conceitoId: string;
  enunciado: string;
  recurso?: RecursoVisual;
  /** 2 a 4, exatamente 1 correta. */
  alternativas: readonly Alternativa[];
  /** RF-20 */
  dica: string;
  /** RF-10; abre com "Quase lá!" */
  explicacaoErro: string;
  /** Versões para a voz, quando a conversão automática não soa natural. */
  explicacaoErroFalada?: string;
  dicaFalada?: string;
  verificacao?: { operacao: Operacao; a: readonly string[]; b: readonly string[] };
}

export interface BancoFalas {
  apresentacao: Fala;
  transicao: Fala;
  /** Sorteadas a cada acerto. */
  acertos: readonly Fala[];
  /** Usa {explicacao}. */
  erro: Fala;
  /** Usa {dica}. */
  dica: Fala;
  inicioPergunta: Fala;
  guardaRota: Fala;
  naoEncontrada: Fala;
  /** Usam {n} e {total}; o áudio é gravado sem os números. */
  finais: Readonly<Record<Faixa, Fala>>;
}
