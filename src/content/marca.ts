/**
 * Arquivos da marca e da Dequinha em public/ (seção 8).
 * Hoje existe uma pose só da Dequinha: as 6 expressões usam a mesma arte e
 * variam pelo movimento em CSS. Quando chegarem artes por expressão, basta
 * trocar o nome do arquivo de cada uma aqui.
 */
import type { Expressao } from './tipos';

export const marca = {
  logo: 'marca/logo-deka.webp',
  logoBranca: 'marca/logo-deka-branca.webp',
  /** Proporção da arte (largura / altura), igual em todas as expressões. */
  proporcaoDequinha: 640 / 413,
  dequinha: {
    neutra: 'dequinha/dequinha.webp',
    acenando: 'dequinha/dequinha.webp',
    comemorando: 'dequinha/dequinha.webp',
    pensativa: 'dequinha/dequinha.webp',
    incentivando: 'dequinha/dequinha.webp',
    apontando: 'dequinha/dequinha.webp',
  } satisfies Record<Expressao, string>,
} as const;
