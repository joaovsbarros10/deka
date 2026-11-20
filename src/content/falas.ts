/**
 * Falas fixas da Dequinha (seção 7). A Dequinha fala no feminino.
 * Cada fala tem um arquivo de áudio em public/audio; enquanto o arquivo não
 * existe, a fala fica só em texto. As falas de erro e de dica são montadas por
 * pergunta, com os arquivos p1-erro.mp3, p1-dica.mp3… (content/vozes.ts).
 */
import type { BancoFalas } from './tipos';

export const falas: BancoFalas = {
  apresentacao: {
    texto:
      'Oi! Eu sou a Dequinha e vou acompanhar você nesta jornada. Vamos aprender Teoria dos Conjuntos e Lógica com explicações, exemplos e imagens. Preparado? Então vamos começar!',
    expressao: 'acenando',
    audio: 'apresentacao.mp3',
  },
  transicao: {
    texto:
      'Muito bem! Agora que concluímos nossa trilha, chegou a hora de treinar tudo o que aprendemos. Vamos para o desafio?',
    expressao: 'comemorando',
    audio: 'transicao.mp3',
  },
  acertos: [
    {
      texto: 'Isso mesmo! Você identificou corretamente. Vamos para a próxima?',
      expressao: 'comemorando',
      audio: 'acerto-1.mp3',
    },
    { texto: 'Boa! É exatamente isso.', expressao: 'comemorando', audio: 'acerto-2.mp3' },
    { texto: 'Mandou bem! Você pegou a ideia.', expressao: 'comemorando', audio: 'acerto-3.mp3' },
  ],
  erro: {
    texto: '{explicacao} Observe o exemplo e tente usar essa ideia na próxima.',
    expressao: 'incentivando',
  },
  dica: {
    texto: 'Psiu! Uma pista: {dica}',
    expressao: 'pensativa',
  },
  inicioPergunta: {
    texto: 'Leia com calma e escolha uma alternativa. Se travar, peça uma dica!',
    expressao: 'pensativa',
    audio: 'inicio-pergunta.mp3',
  },
  guardaRota: {
    texto: 'Opa! O desafio só abre depois da trilha. Vamos terminar o que falta?',
    expressao: 'apontando',
    audio: 'guarda-rota.mp3',
  },
  naoEncontrada: {
    texto: 'Hum, não encontrei essa página. Que tal voltar para o início e seguir a trilha comigo?',
    expressao: 'pensativa',
    audio: 'nao-encontrada.mp3',
  },
  // O áudio das falas finais é gravado sem os números: "X de N acertos" aparece só na tela.
  finais: {
    alta: {
      texto:
        'Você chegou ao fim do desafio e mandou muito bem: {n} de {total} acertos! Continue praticando e revisando. Estou orgulhosa de você!',
      falado:
        'Você chegou ao fim do desafio e mandou muito bem! Continue praticando e revisando. Estou orgulhosa de você!',
      expressao: 'comemorando',
      audio: 'final-alta.mp3',
    },
    media: {
      texto:
        'Você chegou ao fim do desafio e está no caminho certo: {n} de {total} acertos! Dê uma olhada nos conceitos sugeridos e tente de novo. Com treino, você vai ficar cada vez melhor em Teoria dos Conjuntos e Lógica. Estou torcendo por você!',
      falado:
        'Você chegou ao fim do desafio e está no caminho certo! Dê uma olhada nos conceitos sugeridos e tente de novo. Com treino, você vai ficar cada vez melhor em Teoria dos Conjuntos e Lógica. Estou torcendo por você!',
      expressao: 'incentivando',
      audio: 'final-media.mp3',
    },
    baixa: {
      texto:
        'Você chegou ao fim do desafio, e isso já conta muito! {n} de {total} acertos. Todo mundo começa devagar: revise com calma os conceitos sugeridos e tente de novo quando quiser. Eu estou aqui com você!',
      falado:
        'Você chegou ao fim do desafio, e isso já conta muito! Todo mundo começa devagar: revise com calma os conceitos sugeridos e tente de novo quando quiser. Eu estou aqui com você!',
      expressao: 'incentivando',
      audio: 'final-baixa.mp3',
    },
  },
};
