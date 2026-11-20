/**
 * Nome do arquivo de áudio de cada fala (um arquivo por fala, em public/audio).
 * O roteiro de voz (npm run roteiro:voz) lista todos com o texto a ser falado.
 */
import type { TipoEtapa } from './tipos';

export const audioDaEtapa = (ordem: number, tipo: TipoEtapa) => `c${ordem}-${tipo}.mp3`;
export const audioDaRespostaAoGancho = (ordem: number) => `c${ordem}-gancho-resposta.mp3`;
export const audioDoErro = (perguntaId: string) => `${perguntaId.toLowerCase()}-erro.mp3`;
export const audioDaDica = (perguntaId: string) => `${perguntaId.toLowerCase()}-dica.mp3`;
