/**
 * Balão de fala: texto real, sempre completo, anunciado pelo leitor de tela
 * (aria-live="polite"). "Ouvir de novo" aparece quando a fala tem áudio.
 */
import type { ReactNode } from 'react';
import { textos } from '../../content/textos';
import { useAudio } from '../../app/AudioProvider';
import { temArquivoDeAudio } from '../../app/audios';
import { Icone } from '../ui/Icone';

interface Props {
  texto: string;
  /** Arquivo de áudio da fala; "Ouvir de novo" só aparece se ele existir. */
  audio?: string;
  /** Lado para onde aponta a ponta do balão (onde está a Dequinha). */
  ponta?: 'esquerda' | 'cima' | 'nenhuma';
  tom?: 'padrao' | 'certo' | 'quase';
  antes?: ReactNode;
  className?: string;
}

export function Balao({ texto, audio, ponta = 'esquerda', tom = 'padrao', antes, className = '' }: Props) {
  const { ouvirDeNovo, falando } = useAudio();
  return (
    <div className={`balao balao--ponta-${ponta} balao--${tom} ${className}`}>
      {antes}
      <p className="balao__texto" aria-live="polite">
        {texto}
      </p>
      {temArquivoDeAudio(audio) && (
        <button type="button" className="botao-ouvir" onClick={ouvirDeNovo}>
          <Icone nome={falando ? 'voz' : 'repetir'} tamanho={18} />
          {textos.controles.ouvirDeNovo}
        </button>
      )}
    </div>
  );
}
