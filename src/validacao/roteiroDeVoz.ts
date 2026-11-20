/**
 * Roteiro de voz: todas as falas da Dequinha, cada uma com o nome do arquivo de
 * áudio e o texto adaptado para ser falado. Usado pelo script `npm run roteiro:voz`
 * e pela validação V-12.
 */
import type { BancoFalas, Conceito, Conjuntos, Fala, Pergunta } from '../content/tipos';
import { textos } from '../content/textos';
import { audioDaDica, audioDoErro } from '../content/vozes';
import { preencher, resolverExpressoes } from '../domain/expressoes';
import { textoFalado } from '../domain/falado';

export interface ItemRoteiro {
  arquivo: string;
  /** Onde a fala aparece no site. */
  onde: string;
  /** Texto do balão, como aparece na tela. */
  tela: string;
  /** O que a Dequinha deve falar no áudio. */
  falado: string;
}

interface Entrada {
  trilha: readonly Conceito[];
  perguntas: readonly Pergunta[];
  falas: BancoFalas;
}

function resolverSeguro(texto: string, conjuntos: Conjuntos): string {
  try {
    return resolverExpressoes(texto, conjuntos);
  } catch {
    return texto;
  }
}

/**
 * Sem `completo`, lista só as falas que têm áudio ligado no conteúdo.
 * Com `completo`, lista todas as falas da Dequinha (trilha, quiz, dicas, erros,
 * resultado), cada uma com um nome de arquivo sugerido, para gravar.
 */
export function montarRoteiro({ trilha, perguntas, falas }: Entrada, opcoes: { completo?: boolean } = {}): ItemRoteiro[] {
  const completo = !!opcoes.completo;
  const itens: ItemRoteiro[] = [];
  const add = (
    onde: string,
    fala: Fala,
    conjuntos: Conjuntos = {},
    telaVars = {},
    faladoVars = telaVars,
    sugerido?: string,
  ) => {
    const arquivo = fala.audio ?? (completo ? sugerido : undefined);
    if (!arquivo) return;
    itens.push({
      arquivo,
      onde,
      tela: preencher(resolverSeguro(fala.texto, conjuntos), telaVars),
      falado: textoFalado(preencher(resolverSeguro(fala.falado ?? fala.texto, conjuntos), faladoVars)),
    });
  };

  add('Apresentação da Dequinha', falas.apresentacao, {}, {}, {}, 'apresentacao.mp3');

  for (const c of trilha) {
    const conceito = `${textos.trilha.conceito(c.ordem)} (${c.titulo})`;
    for (const e of c.etapas) {
      const etapa = textos.trilha.nomesEtapas[e.tipo];
      add(`${conceito} · ${etapa}`, e.fala, c.conjuntos, {}, {}, `c${c.ordem}-${e.tipo}.mp3`);
      if (e.respostaAoGancho) add(`${conceito} · ${etapa}, depois da escolha`, e.respostaAoGancho, c.conjuntos, {}, {}, `c${c.ordem}-gancho-resposta.mp3`);
    }
  }

  add('Guarda de rota (quiz aberto antes da trilha)', falas.guardaRota, {}, {}, {}, 'guarda-rota.mp3');
  add('Transição para o desafio', falas.transicao, {}, {}, {}, 'transicao.mp3');
  add('Quiz · início de cada pergunta', falas.inicioPergunta, {}, {}, {}, 'inicio-pergunta.mp3');
  falas.acertos.forEach((f, i) => add(`Quiz · acerto (variação ${i + 1}, sorteada)`, f, {}, {}, {}, `acerto-${i + 1}.mp3`));

  for (const p of perguntas) {
    const id = p.id.toLowerCase();
    add(`Quiz · ${p.id} · resposta errada`, { ...falas.erro, audio: audioDoErro(p.id) }, {}, { explicacao: p.explicacaoErro },
      { explicacao: p.explicacaoErroFalada ?? p.explicacaoErro }, `${id}-erro.mp3`);
    add(`Quiz · ${p.id} · dica`, { ...falas.dica, audio: audioDaDica(p.id) }, {}, { dica: p.dica }, { dica: p.dicaFalada ?? p.dica }, `${id}-dica.mp3`);
  }

  const faixas = { alta: '80% ou mais', media: 'de 50% a 79%', baixa: 'menos de 50%' } as const;
  for (const [faixa, fala] of Object.entries(falas.finais) as [keyof typeof faixas, Fala][]) {
    add(`Resultado · ${faixas[faixa]} de acertos`, fala, {}, { n: 'X', total: 'N' }, { n: 'X', total: 'N' }, `final-${faixa}.mp3`);
  }
  add('Página não encontrada', falas.naoEncontrada, {}, {}, {}, 'nao-encontrada.mp3');

  return itens;
}
