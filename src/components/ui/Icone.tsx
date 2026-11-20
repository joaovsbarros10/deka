/** Ícones de traço simples, desenhados aqui (sem biblioteca nem fonte de terceiros). */
const caminhos = {
  voz: ['M11 5 6 9H3v6h3l5 4V5z', 'M15.5 8.5a5 5 0 0 1 0 7', 'M18.5 5.5a9 9 0 0 1 0 13'],
  mudo: ['M11 5 6 9H3v6h3l5 4V5z', 'M22 9l-6 6', 'M16 9l6 6'],
  movimento: ['M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0'],
  parado: ['M9 6v12', 'M15 6v12'],
  repetir: ['M3 12a9 9 0 1 0 3-6.7', 'M3 4v5h5'],
  esquerda: ['M19 12H5', 'M11 18l-6-6 6-6'],
  direita: ['M5 12h14', 'M13 6l6 6-6 6'],
  indice: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3.5 6h.01', 'M3.5 12h.01', 'M3.5 18h.01'],
  cadeado: ['M7 11V8a5 5 0 0 1 10 0v3', 'M5 11h14v10H5z'],
  certo: ['M20 6 9 17l-5-5'],
  alerta: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7.5v5.5', 'M12 16.5h.01'],
  dica: ['M9 18h6', 'M10 21.5h4', 'M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.6V16h6v-.1c0-.6.3-1.2.8-1.6A6.5 6.5 0 0 0 12 2.5z'],
  fechar: ['M18 6 6 18', 'M6 6l12 12'],
  casa: ['M3 11 12 3l9 8', 'M5.5 9.5V21h13V9.5'],
  trilha: ['M4 19c4 0 4-6 8-6s4-6 8-6', 'M4 19h.01', 'M20 7h.01'],
} as const;

export type NomeIcone = keyof typeof caminhos;

export function Icone({ nome, tamanho = 20 }: { nome: NomeIcone; tamanho?: number }) {
  return (
    <svg
      className="icone"
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {caminhos[nome].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
