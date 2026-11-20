# DEKA

Site educativo de Teoria dos Conjuntos e linguagem lógica para o Ensino Médio, guiado pela
mascote **Dequinha**. Sem login e sem banco de dados: tudo roda no navegador.
Implementa a v1.0 descrita em `DEKA — Documentação Técnica e UML.pdf`.

Jornada: tela inicial → apresentação da Dequinha → trilha de 9 módulos (8 conceitos + linguagem
lógica) → transição → quiz de 10 perguntas → resultado.

## Como rodar

```bash
npm install
npm run dev          # http://localhost:5173
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | valida o conteúdo, roda os testes, checa os tipos e gera `dist/` |
| `npm run test` | testes do domínio e do conteúdo (Vitest) |
| `npm run validar:conteudo` | regras V-01 a V-12 sobre `src/content` |
| `npm run roteiro:voz` | gera `docs/roteiro-de-voz.md` e `.csv` com todas as falas a gravar |
| `npm run lint` | checagem de tipos (TypeScript estrito) |
| `npm run preview` | serve o `dist/` gerado |

O `dist/` é estático e usa rotas por hash, então pode ser publicado na Vercel (ou em qualquer
hospedagem estática) sem configuração extra.

## Estrutura

```
public/
  marca/       logo (fundo transparente, versões rosa e branca) e favicon
  dequinha/    arte da Dequinha
  audio/       voz da Dequinha, um arquivo por fala
src/
  app/         rotas, layout e provedores (fluxo, áudio, Voz/Movimento)
  pages/       Home, Apresentacao, Licao, Transicao, Quiz, Resultado, NaoEncontrada
  components/  dequinha/, diagrama/ (Venn em SVG), quiz/, ui/
  domain/      conjuntos, afirmações, quiz, desempenho, máquina de estados (TypeScript puro)
  content/     trilha, perguntas, falas, textos da interface, marca  ← o revisor edita aqui
  validacao/   regras V-01 a V-12
  styles/      tokens.css (cores da seção 8), global, dequinha, diagrama, paginas
  tests/       testes do domínio e do conteúdo
scripts/validar-conteudo.ts
```

## Editar o conteúdo

Textos, perguntas e falas ficam em `src/content`. Depois de editar, rode `npm run validar:conteudo`.

- Resultados de operações nunca são digitados à mão: nas falas, escreva `{{A ∪ B}}`, `{{A ∩ B}}`,
  `{{A − B}}`, `{{A}}` ou `{{#A}}` (quantidade), e o domínio calcula a partir dos conjuntos do
  conceito. Mudar um conjunto muda o texto e o diagrama juntos (RN-10).
- As afirmações da prática e dos quadros são julgadas pelo domínio; o validador recusa um valor
  de verdade errado.

## Voz da Dequinha

As 87 falas da Dequinha (trilha, desafio, dicas, erros e resultado) têm áudio em `public/audio`,
um arquivo por fala. O roteiro com o texto de cada uma está em
[docs/roteiro-de-voz.md](docs/roteiro-de-voz.md); `npm run roteiro:voz` o atualiza e
`npm run validar:conteudo` confere se todos os arquivos existem.

O áudio só toca depois do primeiro clique, toque ou tecla do estudante. Fala sem arquivo
fica só em texto, sem erro.

## Arte da Dequinha

Existe uma pose só. As 6 expressões (neutra, acenando, comemorando, pensativa, incentivando,
apontando) usam a mesma arte e variam por gestos em CSS (só `transform` e `opacity`) e por pequenos
detalhes (confete, balão de pensamento, brilhos, setas). Se chegarem artes por expressão, basta
trocar o nome do arquivo de cada uma em `src/content/marca.ts`.

## Decisões de implementação

- **Visual**: inspirado na referência enviada (faixas de cor cheias em magenta, vinho e grafite,
  títulos fortes, pílulas e cartões com glifo gigante), usando o rosa real da logo (`#E42A5C`).
  Os tokens foram recalculados para contraste WCAG AA: o rosa da logo só aparece em formas grandes;
  texto e botões usam tons mais escuros.
- **Fonte**: Nunito, hospedada no próprio site. Os símbolos ∈ ∉ ⊂ ⊄ ⊃ ∪ ∩ − ∅ vêm de um recorte
  da DejaVu Sans (`src/assets/fontes`, licença livre, ~3 KB), porque a Nunito não os tem.
- **Diagramas**: gerados em SVG a partir dos dados. Em telas estreitas os círculos são empilhados
  na vertical, para o texto continuar legível no celular.
- **Fora desta entrega**: testes de ponta a ponta com Playwright, axe e Lighthouse (a jornada foi
  verificada manualmente no navegador, em desktop e em 375 px), ESLint/Prettier e publicação na Vercel.
