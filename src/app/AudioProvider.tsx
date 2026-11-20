/**
 * Voz da Dequinha (RF-22). Um único elemento de áudio, reaproveitado a cada
 * fala. Nada toca antes do primeiro clique, toque ou tecla do estudante;
 * mudar de etapa interrompe o áudio; se o arquivo faltar ou falhar, nada trava
 * e o texto continua completo no balão.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Fala } from '../content/tipos';
import { usePreferencias } from './PreferenciasProvider';
import { temArquivoDeAudio } from './audios';

interface AudioCtx {
  /** Define a fala atual: para a anterior e toca a nova, se tiver áudio e se puder. */
  falar: (fala: Fala | null) => void;
  /** Repete a fala atual; liga a Voz se estiver desligada. */
  ouvirDeNovo: () => void;
  /** Libera o áudio no iOS/Android; chamado no primeiro gesto do estudante. */
  desbloquear: () => void;
  falando: boolean;
}

const Ctx = createContext<AudioCtx | null>(null);

/** WAV silencioso de 0,1 s, gerado aqui mesmo, para liberar o elemento de áudio. */
function wavSilencioso(): string {
  const n = 800;
  const buf = new ArrayBuffer(44 + n);
  const v = new DataView(buf);
  const txt = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  txt(0, 'RIFF');
  v.setUint32(4, 36 + n, true);
  txt(8, 'WAVE');
  txt(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true);
  v.setUint32(28, 8000, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  txt(36, 'data');
  v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
  let bin = '';
  new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
  return `data:audio/wav;base64,${btoa(bin)}`;
}

const urlDoAudio = (arquivo: string) => `${import.meta.env.BASE_URL}audio/${arquivo}`;

export function AudioProvider({ children }: { children: ReactNode }) {
  const { voz, ligarVoz } = usePreferencias();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const silencioRef = useRef<string>('');
  const desbloqueadoRef = useRef(false);
  const falaRef = useRef<Fala | null>(null);
  const vozRef = useRef(voz);
  const [falando, setFalando] = useState(false);

  const elemento = useCallback(() => {
    if (!audioRef.current) {
      const el = new Audio();
      el.preload = 'none';
      const parou = () => setFalando(false);
      el.addEventListener('playing', () => setFalando(el.src !== silencioRef.current));
      el.addEventListener('pause', parou);
      el.addEventListener('ended', parou);
      el.addEventListener('error', parou);
      el.addEventListener('emptied', parou);
      audioRef.current = el;
      silencioRef.current = wavSilencioso();
    }
    return audioRef.current;
  }, []);

  const tocar = useCallback(
    (arquivo: string) => {
      const el = elemento();
      el.muted = false;
      el.src = urlDoAudio(arquivo);
      el.currentTime = 0;
      el.play().catch(() => setFalando(false));
    },
    [elemento],
  );

  const parar = useCallback(() => {
    const el = audioRef.current;
    if (el && !el.paused) el.pause();
    setFalando(false);
  }, []);

  const desbloquear = useCallback(() => {
    if (desbloqueadoRef.current) return;
    desbloqueadoRef.current = true;
    const el = elemento();
    if (!el.paused) return;
    const silencio = silencioRef.current;
    el.muted = true;
    el.src = silencio;
    el.play()
      .then(() => {
        if (el.src === silencio) el.pause();
      })
      .catch(() => undefined)
      .finally(() => {
        if (el.src === silencio) el.muted = false;
      });
  }, [elemento]);

  // Primeiro gesto do estudante libera o áudio (fase de captura: roda antes dos botões).
  useEffect(() => {
    const eventos = ['pointerup', 'touchend', 'click', 'keydown'] as const;
    const aoGesto = () => {
      desbloquear();
      eventos.forEach((e) => window.removeEventListener(e, aoGesto, true));
    };
    eventos.forEach((e) => window.addEventListener(e, aoGesto, true));
    return () => eventos.forEach((e) => window.removeEventListener(e, aoGesto, true));
  }, [desbloquear]);

  // Desligar a Voz silencia na hora.
  useEffect(() => {
    vozRef.current = voz;
    if (!voz) parar();
  }, [voz, parar]);

  const falar = useCallback(
    (fala: Fala | null) => {
      falaRef.current = fala;
      parar();
      // Só toca se o arquivo existir em public/audio; sem ele, a fala fica só em texto.
      if (!fala || !temArquivoDeAudio(fala.audio) || !vozRef.current || !desbloqueadoRef.current) return;
      tocar(fala.audio);
    },
    [parar, tocar],
  );

  const ouvirDeNovo = useCallback(() => {
    const fala = falaRef.current;
    if (!fala || !temArquivoDeAudio(fala.audio)) return;
    if (!vozRef.current) {
      vozRef.current = true;
      ligarVoz();
    }
    desbloquear();
    tocar(fala.audio);
  }, [desbloquear, ligarVoz, tocar]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const valor = useMemo(
    () => ({ falar, ouvirDeNovo, desbloquear, falando }),
    [falar, ouvirDeNovo, desbloquear, falando],
  );
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useAudio(): AudioCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAudio fora do AudioProvider');
  return v;
}

/** Faz a Dequinha falar a fala dada enquanto o componente estiver na tela. */
export function useFala(fala: Fala | null) {
  const { falar } = useAudio();
  const chave = fala ? `${fala.texto}|${fala.audio ?? ''}` : '';
  const falaRef = useRef(fala);
  falaRef.current = fala;
  useEffect(() => {
    falar(falaRef.current);
  }, [chave, falar]);
}
