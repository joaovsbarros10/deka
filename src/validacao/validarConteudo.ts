/**
 * Regras da validação de conteúdo V-01 a V-12 (seção 10).
 * Erros derrubam o build; avisos só listam o problema.
 */
import type {
  BancoFalas,
  Conceito,
  Conjuntos,
  Destaque,
  Fala,
  Pergunta,
  RecursoVisual,
  TipoEtapa,
} from '../content/tipos';
import { criar, iguais, operar } from '../domain/conjuntos';
import { analisarAfirmacao, julgar, misturaTipos } from '../domain/afirmacoes';
import { conferirExpressoes, resolverExpressoes } from '../domain/expressoes';
import { descreverRecurso } from '../domain/descricao';
import { simbolosRestantes } from '../domain/falado';
import { montarRoteiro } from './roteiroDeVoz';

export interface Relatorio {
  erros: string[];
  avisos: string[];
}

export interface EntradaValidacao {
  trilha: readonly Conceito[];
  perguntas: readonly Pergunta[];
  falas: BancoFalas;
  marca?: { logo: string; logoBranca: string; dequinha: Record<string, string> };
  /** Caminhos relativos a public/ (ex.: "audio/apresentacao.mp3"). Sem ele, V-12 é pulada. */
  arquivosPublic?: readonly string[];
}

const ETAPAS_CONJUNTOS: TipoEtapa[] = ['gancho', 'explicacao', 'visual', 'exemplo', 'sintese'];
const ETAPAS_INCLUSAO: TipoEtapa[] = ['gancho', 'explicacao', 'visual', 'exemplo', 'comparativo', 'sintese'];
const ETAPAS_LOGICA: TipoEtapa[] = ['gancho', 'explicacao', 'visual', 'exemplo', 'pratica', 'sintese'];
const LIMITE_PALAVRAS = 60;

const contarPalavras = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

function nomesNoDestaque(d: Destaque): string[] {
  switch (d.tipo) {
    case 'nenhum':
      return [];
    case 'regiao':
      return [...d.de];
    case 'pertinencia':
    case 'contagem':
      return [d.conjunto];
    case 'inclusao':
      return [d.continente, ...d.contidos];
  }
}

function conferirRecurso(r: RecursoVisual, onde: string, erros: string[]) {
  // V-05: o destaque só cita conjuntos declarados e elementos que existem
  const declarados = Object.keys(r.conjuntos);
  for (const d of [r.destaque, ...(r.comparar ? [r.comparar] : [])]) {
    for (const nome of nomesNoDestaque(d)) {
      if (!declarados.includes(nome)) erros.push(`V-05 ${onde}: destaque cita o conjunto "${nome}", que não está no recurso`);
    }
    if (d.tipo === 'pertinencia') {
      const existentes = new Set(criar([...Object.values(r.conjuntos).flat(), ...(r.foraDeTodos ?? [])]));
      for (const e of d.elementos) {
        if (!existentes.has(e.normalize('NFC'))) erros.push(`V-05 ${onde}: o elemento destacado "${e}" não aparece no diagrama`);
      }
    }
  }
  if (r.tipo === 'quadro-simbolos' && !r.quadro) erros.push(`V-04 ${onde}: quadro-simbolos sem quadro`);
  if (r.tipo !== 'quadro-simbolos' && declarados.length === 0) erros.push(`V-04 ${onde}: diagrama sem conjuntos`);
  if (r.tipo !== 'quadro-simbolos' && declarados.length > 3) erros.push(`V-04 ${onde}: diagrama com mais de 3 conjuntos`);

  // V-09 (quadros): a coluna de afirmações bate com o valor calculado pelo domínio
  const q = r.quadro;
  if (q && q.colunaAfirmacao !== undefined) {
    for (const linha of q.linhas) {
      const texto = linha.celulas[q.colunaAfirmacao];
      if (!texto || !analisarAfirmacao(texto)) {
        erros.push(`V-09 ${onde}: "${texto}" não tem a forma "esquerda símbolo direita"`);
        continue;
      }
      try {
        const valor = julgar(texto, r.conjuntos);
        const esperado = linha.tom !== 'errado';
        if (valor !== esperado)
          erros.push(`V-09 ${onde}: "${texto}" é ${valor ? 'verdadeira' : 'falsa'}, mas a linha diz o contrário`);
      } catch (e) {
        erros.push(`V-09 ${onde}: ${(e as Error).message}`);
      }
    }
  }

  // V-11: todo diagrama gera um texto alternativo não vazio
  if (!descreverRecurso(r).trim()) erros.push(`V-11 ${onde}: texto alternativo vazio`);
}

function conferirFala(f: Fala | undefined, onde: string, conjuntos: Conjuntos, rel: Relatorio) {
  if (!f || !f.texto.trim()) {
    rel.erros.push(`${onde}: fala vazia`);
    return;
  }
  for (const e of conferirExpressoes(f.texto, conjuntos)) rel.erros.push(`V-13 ${onde}: ${e}`);
  if (f.falado) for (const e of conferirExpressoes(f.falado, conjuntos)) rel.erros.push(`V-13 ${onde} (falado): ${e}`);
}

export function validarConteudo(entrada: EntradaValidacao): Relatorio {
  const rel: Relatorio = { erros: [], avisos: [] };
  const { trilha, perguntas, falas } = entrada;

  // V-01
  if (trilha.length !== 9) rel.erros.push(`V-01: a trilha tem ${trilha.length} conceitos, e não 9`);
  trilha.forEach((c, i) => {
    if (c.ordem !== i + 1) rel.erros.push(`V-01: o conceito "${c.id}" tem ordem ${c.ordem}, esperado ${i + 1}`);
    if ((c.modulo === 'logica') !== (c.ordem === 9))
      rel.erros.push(`V-01: o módulo "logica" só pode aparecer no conceito 9 (conceito ${c.ordem})`);
  });
  const ids = trilha.map((c) => c.id);
  if (new Set(ids).size !== ids.length) rel.erros.push('V-01: há ids de conceito repetidos');

  for (const c of trilha) {
    const onde = `conceito ${c.ordem}`;
    // V-02
    const esperado = c.modulo === 'logica' ? ETAPAS_LOGICA : c.ordem === 5 ? ETAPAS_INCLUSAO : ETAPAS_CONJUNTOS;
    const tipos = c.etapas.map((e) => e.tipo);
    if (tipos.join() !== esperado.join())
      rel.erros.push(`V-02 ${onde}: etapas [${tipos.join(', ')}], esperado [${esperado.join(', ')}]`);

    c.etapas.forEach((e, i) => {
      const ondeEtapa = `${onde}, etapa ${i + 1} (${e.tipo})`;
      conferirFala(e.fala, ondeEtapa, c.conjuntos, rel);
      // V-03
      if (e.tipo === 'gancho') {
        const n = e.opcoes?.length ?? 0;
        if (n < 2 || n > 3) rel.erros.push(`V-03 ${ondeEtapa}: o gancho tem ${n} opções, esperado 2 ou 3`);
        if (!e.respostaAoGancho) rel.erros.push(`V-03 ${ondeEtapa}: falta a resposta da Dequinha ao gancho`);
        else conferirFala(e.respostaAoGancho, `${ondeEtapa}, resposta`, c.conjuntos, rel);
      }
      // V-04
      if ((e.tipo === 'visual' || e.tipo === 'comparativo') && !e.recurso)
        rel.erros.push(`V-04 ${ondeEtapa}: falta o recurso visual`);
      if (e.recurso) conferirRecurso(e.recurso, ondeEtapa, rel.erros);
      // V-09
      if (e.tipo === 'pratica') {
        const afs = e.afirmacoes ?? [];
        if (afs.length < 3) rel.erros.push(`V-09 ${ondeEtapa}: a prática tem ${afs.length} afirmações, mínimo 3`);
        const conj = e.recurso?.conjuntos ?? c.conjuntos;
        for (const a of afs) {
          if (!analisarAfirmacao(a.texto)) {
            rel.erros.push(`V-09 ${ondeEtapa}: "${a.texto}" não tem a forma "esquerda símbolo direita"`);
            continue;
          }
          try {
            const valor = julgar(a.texto, conj);
            if (valor !== a.verdadeira)
              rel.erros.push(`V-09 ${ondeEtapa}: "${a.texto}" é ${valor ? 'verdadeira' : 'falsa'} pelo domínio, mas está marcada como ${a.verdadeira ? 'verdadeira' : 'falsa'}`);
            if (misturaTipos(a.texto, conj) && a.verdadeira)
              rel.erros.push(`V-09 ${ondeEtapa}: "${a.texto}" mistura elemento e conjunto e tem de ser falsa (RN-08)`);
          } catch (err) {
            rel.erros.push(`V-09 ${ondeEtapa}: ${(err as Error).message}`);
          }
        }
      }
      // V-10 (aviso)
      if (e.tipo === 'explicacao' || e.tipo === 'sintese') {
        const n = contarPalavras(resolverSeguro(e.fala.texto, c.conjuntos));
        if (n > LIMITE_PALAVRAS) rel.avisos.push(`V-10 ${ondeEtapa}: ${n} palavras (diretriz: até ${LIMITE_PALAVRAS})`);
      }
    });
  }

  // V-06
  if (perguntas.length < 1 || perguntas.length > 10)
    rel.erros.push(`V-06: o banco tem ${perguntas.length} perguntas; o limite é de 1 a 10`);
  const idsP = perguntas.map((p) => p.id);
  if (new Set(idsP).size !== idsP.length) rel.erros.push('V-06: há ids de pergunta repetidos');

  for (const p of perguntas) {
    const onde = `pergunta ${p.id}`;
    // V-07
    const n = p.alternativas.length;
    if (n < 2 || n > 4) rel.erros.push(`V-07 ${onde}: ${n} alternativas; esperado de 2 a 4`);
    const corretas = p.alternativas.filter((a) => a.correta).length;
    if (corretas !== 1) rel.erros.push(`V-07 ${onde}: ${corretas} alternativas corretas; esperado exatamente 1`);
    const idsA = p.alternativas.map((a) => a.id);
    if (new Set(idsA).size !== idsA.length) rel.erros.push(`V-07 ${onde}: ids de alternativa repetidos`);
    if (!p.dica.trim()) rel.erros.push(`V-07 ${onde}: sem dica`);
    if (!p.explicacaoErro.trim()) rel.erros.push(`V-07 ${onde}: sem explicação de erro`);
    if (!ids.includes(p.conceitoId)) rel.erros.push(`V-07 ${onde}: o conceito "${p.conceitoId}" não existe na trilha`);
    if (!p.enunciado.trim()) rel.erros.push(`V-07 ${onde}: enunciado vazio`);
    // V-08
    if (p.verificacao) {
      const { operacao, a, b } = p.verificacao;
      const calculado = operar(operacao, a, b);
      for (const alt of p.alternativas) {
        if (!alt.conjunto) {
          rel.erros.push(`V-08 ${onde}: a alternativa ${alt.id} não informa o conjunto que representa`);
          continue;
        }
        const igual = iguais(alt.conjunto, calculado);
        if (alt.correta && !igual) rel.erros.push(`V-08 ${onde}: a alternativa correta não é igual ao resultado calculado`);
        if (!alt.correta && igual) rel.erros.push(`V-08 ${onde}: a alternativa errada ${alt.id} é igual ao resultado calculado`);
      }
    }
    if (p.recurso) conferirRecurso(p.recurso, onde, rel.erros);
  }

  // Falas fixas
  const fixas: [string, Fala][] = [
    ['apresentacao', falas.apresentacao],
    ['transicao', falas.transicao],
    ['erro', falas.erro],
    ['dica', falas.dica],
    ['inicioPergunta', falas.inicioPergunta],
    ['guardaRota', falas.guardaRota],
    ['naoEncontrada', falas.naoEncontrada],
    ...falas.acertos.map((f, i) => [`acerto ${i + 1}`, f] as [string, Fala]),
    ...Object.entries(falas.finais).map(([k, f]) => [`final ${k}`, f] as [string, Fala]),
  ];
  if (falas.acertos.length < 1) rel.erros.push('falas: é preciso ao menos uma fala de acerto');
  for (const [nome, f] of fixas) conferirFala(f, `fala ${nome}`, {}, rel);
  if (!falas.erro.texto.includes('{explicacao}')) rel.erros.push('falas: a fala de erro precisa de {explicacao}');
  if (!falas.dica.texto.includes('{dica}')) rel.erros.push('falas: a fala de dica precisa de {dica}');

  // V-12
  const roteiro = montarRoteiro({ trilha, perguntas, falas });
  const nomes = roteiro.map((i) => i.arquivo);
  const repetidos = nomes.filter((n, i) => nomes.indexOf(n) !== i);
  if (repetidos.length) rel.erros.push(`V-12: arquivos de áudio repetidos: ${[...new Set(repetidos)].join(', ')}`);
  for (const item of roteiro) {
    if (!/\.(mp3|m4a)$/i.test(item.arquivo)) rel.avisos.push(`V-12: o áudio "${item.arquivo}" não é MP3 nem M4A`);
    const sobras = simbolosRestantes(item.falado);
    if (sobras.length)
      rel.avisos.push(`V-12 ${item.arquivo}: o texto falado ainda tem ${sobras.join(' ')}; escreva um texto falado próprio`);
  }
  if (entrada.arquivosPublic) {
    const arquivos = new Set(entrada.arquivosPublic.map((a) => a.replace(/\\/g, '/')));
    const m = entrada.marca;
    if (m) {
      for (const f of [m.logo, m.logoBranca]) if (!arquivos.has(f)) rel.erros.push(`V-12: a logo "${f}" não existe em public`);
      for (const [exp, f] of Object.entries(m.dequinha))
        if (!arquivos.has(f)) rel.erros.push(`V-12: a arte da Dequinha "${exp}" (${f}) não existe em public`);
    }
    const citados = new Set(nomes.map((n) => `audio/${n}`));
    const faltam = nomes.filter((n) => !arquivos.has(`audio/${n}`));
    if (faltam.length)
      rel.avisos.push(
        `V-12: faltam ${faltam.length} de ${nomes.length} áudios (essas falas ficam só em texto; veja docs/roteiro-de-voz.md): ${faltam.slice(0, 6).join(', ')}${faltam.length > 6 ? '…' : ''}`,
      );
    for (const a of arquivos) {
      if (a.startsWith('audio/') && !citados.has(a)) rel.avisos.push(`V-12: o arquivo "${a}" não é citado por nenhuma fala`);
    }
  }

  return rel;
}

function resolverSeguro(texto: string, conjuntos: Conjuntos): string {
  try {
    return resolverExpressoes(texto, conjuntos);
  } catch {
    return texto;
  }
}
