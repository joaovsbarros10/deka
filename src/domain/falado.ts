/**
 * Texto falado: adapta uma fala para a voz da Dequinha. Símbolos matemáticos
 * viram palavras ("B ⊂ A" → "B está contido em A") e conjuntos escritos por
 * listagem viram frases ("{futsal, natação}" → "o conjunto com futsal e natação").
 * Quando a conversão automática não soa natural, a fala traz um texto falado próprio.
 */

const ENTRE_TERMOS: Record<string, string> = {
  '∈': 'pertence a',
  '∉': 'não pertence a',
  '⊂': 'está contido em',
  '⊆': 'está contido em',
  '⊄': 'não está contido em',
  '⊃': 'contém',
  '∪': 'união',
  '∩': 'interseção',
  '−': 'menos',
};

const NOME_DO_SIMBOLO: Record<string, string> = {
  '∈': 'pertence',
  '∉': 'não pertence',
  '⊂': 'está contido',
  '⊆': 'está contido',
  '⊄': 'não está contido',
  '⊃': 'contém',
  '∪': 'união',
  '∩': 'interseção',
  '−': 'menos',
};

const SIMBOLOS = '∈∉⊂⊆⊄⊃∪∩−';

/** "maçã, banana, uva" → "maçã, banana e uva" */
function listaFalada(lista: string): string {
  const itens = lista
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (itens.length <= 1) return itens.join('');
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
}

export function textoFalado(texto: string): string {
  let t = texto;

  // Conjuntos por listagem. Depois de dois-pontos, basta a lista: "cesta A: maçã, banana e uva".
  t = t.replace(/:\s*\{([^{}]+)\}/g, (_, lista: string) => `: ${listaFalada(lista)}`);
  t = t.replace(/\{\s*\}/g, 'o conjunto vazio');
  t = t.replace(/∅/g, 'o conjunto vazio');
  t = t.replace(/\{([^{}]+)\}/g, (_, lista: string) => `o conjunto com ${listaFalada(lista)}`);

  // Igualdade.
  t = t.replace(/\s=\s/g, ' é igual a ');

  // Símbolo entre dois termos, quando o da direita é o nome de um conjunto (uma letra maiúscula).
  t = t.replace(new RegExp(`\\s([${SIMBOLOS}])\\s(?=[A-Z]\\b)`, 'g'), (_, s: string) => ` ${ENTRE_TERMOS[s]} `);

  // Símbolo entre parênteses logo depois da palavra que ele representa: "'pertence' (∈)".
  t = t.replace(new RegExp(`\\s*\\(\\s*[${SIMBOLOS}](?:\\s*,\\s*[${SIMBOLOS}])*\\s*\\)`, 'g'), '');

  // "o símbolo ∈" → "o símbolo de pertence"
  t = t.replace(new RegExp(`(símbolos?)\\s([${SIMBOLOS}])`, 'g'), (_, p: string, s: string) => `${p} de ${NOME_DO_SIMBOLO[s]}`);

  // Símbolos soltos.
  t = t.replace(new RegExp(`[${SIMBOLOS}]`, 'g'), (s) => `o símbolo de ${NOME_DO_SIMBOLO[s]}`);

  // Contrações e acabamento.
  t = t
    .replace(/\ba o\b/g, 'ao')
    .replace(/\bem o\b/g, 'no')
    .replace(/\bde o\b/g, 'do')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
  t = t.replace(/(^|[.!?]\s+)([a-zà-ú])/g, (_, antes: string, letra: string) => antes + letra.toUpperCase());
  return t;
}

/** Símbolos que sobraram depois da conversão (o validador avisa). */
export function simbolosRestantes(texto: string): string[] {
  return [...new Set(texto.match(new RegExp(`[${SIMBOLOS}∅{}]`, 'g')) ?? [])];
}
