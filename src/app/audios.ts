import disponiveis from 'virtual:audios';

const existentes = new Set(disponiveis);

/** Verdadeiro se o arquivo de áudio da fala existe em public/audio. */
export const temArquivoDeAudio = (arquivo?: string): arquivo is string => !!arquivo && existentes.has(arquivo);
