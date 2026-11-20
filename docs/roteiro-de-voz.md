# Roteiro de voz da Dequinha

87 falas · 87 com áudio · 0 faltando.
Gerado por `npm run roteiro:voz` a partir de `src/content`. Não edite à mão: mude o conteúdo e gere de novo.

## Como gerar os áudios

1. Use sempre a mesma voz da Dequinha, com as mesmas configurações, para todas as falas.
2. Copie o texto da coluna **O que a Dequinha fala** (não o da tela: ele já vem com os símbolos trocados por palavras).
3. Salve cada áudio com o **nome exato** da coluna Arquivo, em MP3 (de preferência 128 kbps, mono), na pasta `public/audio/`.
4. Com o site rodando (`npm run dev`), a página recarrega sozinha e a fala passa a tocar. Fala sem arquivo continua só em texto.
5. Rode `npm run validar:conteudo` para ver o que ainda falta.

Dicas: deixe uns 0,3 s de silêncio no começo e no fim, mantenha o mesmo volume em todos, e evite OGG e WebM (o Safari do iPhone pode não tocar).
As falas finais do resultado são gravadas sem os números: "X de N acertos" aparece só na tela.

| # | Arquivo | Status | Onde aparece | O que a Dequinha fala |
| --- | --- | --- | --- | --- |
| 1 | `apresentacao.mp3` | ✅ pronto | Apresentação da Dequinha | Oi! Eu sou a Dequinha e vou acompanhar você nesta jornada. Vamos aprender Teoria dos Conjuntos e Lógica com explicações, exemplos e imagens. Preparado? Então vamos começar! |
| 2 | `c1-gancho.mp3` | ✅ pronto | Conceito 1 (O que são conjuntos?) · Pergunta | Na sua playlist, você junta as músicas de algum jeito? Por estilo, por artista? |
| 3 | `c1-gancho-resposta.mp3` | ✅ pronto | Conceito 1 (O que são conjuntos?) · Pergunta, depois da escolha | Misturar tudo também é um jeito! Mas, quando juntamos coisas seguindo um critério claro, temos o que a matemática chama de conjunto. |
| 4 | `c1-explicacao.mp3` | ✅ pronto | Conceito 1 (O que são conjuntos?) · Explicação | Um conjunto é um grupo de coisas reunidas por um critério claro. O critério diz exatamente o que entra e o que fica de fora, como em 'as frutas da cesta A'. Se não dá para conferir o critério, não temos um conjunto bem definido. |
| 5 | `c1-visual.mp3` | ✅ pronto | Conceito 1 (O que são conjuntos?) · Imagem | Dentro do círculo estão as frutas da cesta A: maçã, banana e uva. O abacaxi está na mesa, por isso aparece do lado de fora, com a borda pontilhada. |
| 6 | `c1-exemplo.mp3` | ✅ pronto | Conceito 1 (O que são conjuntos?) · Exemplo | Critério: ser fruta da cesta A. Maçã, banana e uva estão na cesta, então entram. O abacaxi está na mesa, então fica de fora. A cadeira nem é fruta, então também fica de fora. |
| 7 | `c1-sintese.mp3` | ✅ pronto | Conceito 1 (O que são conjuntos?) · Síntese | Conjunto é um grupo com um critério claro: quem cumpre o critério entra, quem não cumpre fica de fora. |
| 8 | `c2-gancho.mp3` | ✅ pronto | Conceito 2 (Elementos de um conjunto) · Pergunta | Pense na sua turma. Cada colega faz parte dela. Que nome você daria a cada 'peça' da turma? |
| 9 | `c2-gancho-resposta.mp3` | ✅ pronto | Conceito 2 (Elementos de um conjunto) · Pergunta, depois da escolha | Todos esses nomes funcionam no dia a dia! Na matemática, a palavra oficial é elemento. |
| 10 | `c2-explicacao.mp3` | ✅ pronto | Conceito 2 (Elementos de um conjunto) · Explicação | Cada objeto que pertence a um conjunto é um elemento dele. No conjunto A das frutas da cesta, maçã, banana e uva são elementos. A ordem em que listamos os elementos não muda o conjunto. |
| 11 | `c2-visual.mp3` | ✅ pronto | Conceito 2 (Elementos de um conjunto) · Imagem | Cada fruta dentro do círculo é um elemento de A. Contando um por um, sem repetir, A tem 3 elementos. |
| 12 | `c2-exemplo.mp3` | ✅ pronto | Conceito 2 (Elementos de um conjunto) · Exemplo | B é o conjunto dos dias da semana cujo nome começa com 's'. Segunda-feira, sexta-feira e sábado cumprem o critério. Então B tem 3 elementos. |
| 13 | `c2-sintese.mp3` | ✅ pronto | Conceito 2 (Elementos de um conjunto) · Síntese | Elemento é cada integrante do conjunto. Para contar os elementos, conte os integrantes, sem repetir. |
| 14 | `c3-gancho.mp3` | ✅ pronto | Conceito 3 (Pertinência e não pertinência) · Pergunta | Você está na lista de chamada da sua turma? E o diretor da escola, está? |
| 15 | `c3-gancho-resposta.mp3` | ✅ pronto | Conceito 3 (Pertinência e não pertinência) · Pergunta, depois da escolha | Repare que sempre dá para dizer se alguém está ou não está em um grupo. A matemática tem símbolos para isso. |
| 16 | `c3-explicacao.mp3` | ✅ pronto | Conceito 3 (Pertinência e não pertinência) · Explicação | A pertinência liga um elemento a um conjunto. Se o elemento está no conjunto, ele pertence, e usamos o símbolo de pertence. Se não está, não pertence, e usamos o símbolo de não pertence. Quando aparece maçã, o símbolo e a letra A, lemos: maçã pertence a A. |
| 17 | `c3-visual.mp3` | ✅ pronto | Conceito 3 (Pertinência e não pertinência) · Imagem | Veja as fichas: a banana está dentro do círculo A, e o abacaxi está do lado de fora. Cada ficha liga um elemento ao conjunto A. |
| 18 | `c3-exemplo.mp3` | ✅ pronto | Conceito 3 (Pertinência e não pertinência) · Exemplo | Sendo A igual ao conjunto com maçã, banana e uva: a banana está em A, logo banana pertence a A. O abacaxi não está em A, logo abacaxi não pertence a A. Nos dois casos o símbolo liga um elemento a um conjunto. |
| 19 | `c3-sintese.mp3` | ✅ pronto | Conceito 3 (Pertinência e não pertinência) · Síntese | O símbolo de pertence e o símbolo de não pertence respondem à pergunta: esse elemento está nesse conjunto? |
| 20 | `c4-gancho.mp3` | ✅ pronto | Conceito 4 (Representação de conjuntos) · Pergunta | Como você contaria a um colega, por escrito, quais frutas estão na cesta? |
| 21 | `c4-gancho-resposta.mp3` | ✅ pronto | Conceito 4 (Representação de conjuntos) · Pergunta, depois da escolha | Os dois jeitos existem na matemática! Vamos conhecer cada um. |
| 22 | `c4-explicacao.mp3` | ✅ pronto | Conceito 4 (Representação de conjuntos) · Explicação | Há duas formas de representar um conjunto. Na listagem, escrevemos os elementos entre chaves, separados por vírgulas. O conjunto A fica assim: A igual a, abre chaves, maçã, banana, uva, fecha chaves. No diagrama, desenhamos uma curva fechada e colocamos os elementos dentro dela. |
| 23 | `c4-visual.mp3` | ✅ pronto | Conceito 4 (Representação de conjuntos) · Imagem | Em cima, a listagem; embaixo, o diagrama. As linhas ligam cada elemento nas duas formas: é o mesmo conjunto A. |
| 24 | `c4-exemplo.mp3` | ✅ pronto | Conceito 4 (Representação de conjuntos) · Exemplo | B é o conjunto dos números pares maiores que 0 e menores que 8. Na listagem: B igual a, abre chaves, 2, 4, 6, fecha chaves. No diagrama: um círculo B com 2, 4 e 6 dentro. É o mesmo conjunto escrito de dois jeitos. |
| 25 | `c4-sintese.mp3` | ✅ pronto | Conceito 4 (Representação de conjuntos) · Síntese | A listagem diz os elementos com chaves e vírgulas; o diagrama mostra os elementos dentro do conjunto. Um conjunto sem elementos é o conjunto vazio, escrito com chaves sem nada dentro, ou com o símbolo de vazio: um círculo cortado por um traço. |
| 26 | `c5-gancho.mp3` | ✅ pronto | Conceito 5 (Inclusão e não inclusão) · Pergunta | Todo mundo do time de futsal da sala também é da sala. E todo mundo da sala é do time de futsal? |
| 27 | `c5-gancho-resposta.mp3` | ✅ pronto | Conceito 5 (Inclusão e não inclusão) · Pergunta, depois da escolha | O time cabe dentro da sala, mas a sala não cabe dentro do time. Essa ideia de um grupo dentro de outro é a inclusão. |
| 28 | `c5-explicacao.mp3` | ✅ pronto | Conceito 5 (Inclusão e não inclusão) · Explicação | A inclusão liga um conjunto a outro conjunto. Se todos os elementos de B também são elementos de A, dizemos que B está contido em A, e usamos o símbolo de está contido. Se algum elemento de B não está em A, B não está contido em A, e o símbolo aparece cortado. |
| 29 | `c5-visual.mp3` | ✅ pronto | Conceito 5 (Inclusão e não inclusão) · Imagem | B, o conjunto com maçã e banana, fica inteiro dentro de A. Já C, com maçã e abacaxi, cruza a borda de A: o abacaxi, em destaque, está em C e fica fora de A. |
| 30 | `c5-exemplo.mp3` | ✅ pronto | Conceito 5 (Inclusão e não inclusão) · Exemplo | Todos os elementos de B, maçã e banana, estão em A, logo B está contido em A. Também podemos dizer o contrário: A contém B. Em C, o abacaxi não está em A, logo C não está contido em A. |
| 31 | `c5-comparativo.mp3` | ✅ pronto | Conceito 5 (Inclusão e não inclusão) · Comparativo | Guarde: o símbolo de pertence liga elemento a conjunto; o símbolo de está contido liga conjunto a conjunto. |
| 32 | `c5-sintese.mp3` | ✅ pronto | Conceito 5 (Inclusão e não inclusão) · Síntese | Pertinência é um elemento dentro de um conjunto. Inclusão é um conjunto dentro de outro. São ideias diferentes, com símbolos diferentes. |
| 33 | `c6-gancho.mp3` | ✅ pronto | Conceito 6 (União) · Pergunta | Você e um colega vão montar uma lista com todos os lanches que os dois trouxeram. O que entra na lista? |
| 34 | `c6-gancho-resposta.mp3` | ✅ pronto | Conceito 6 (União) · Pergunta, depois da escolha | Juntar tudo, sem repetir, é exatamente a ideia de união. |
| 35 | `c6-explicacao.mp3` | ✅ pronto | Conceito 6 (União) · Explicação | A união de A e B reúne todos os elementos que estão em A, em B ou nos dois. Escrevemos A união B. Um elemento que aparece nos dois conjuntos entra uma vez só. |
| 36 | `c6-visual.mp3` | ✅ pronto | Conceito 6 (União) · Imagem | A, com vôlei, futsal e natação, são os esportes da Ana. B, com futsal, natação e basquete, são os do Bruno. Na união, as três regiões ficam destacadas ao mesmo tempo. |
| 37 | `c6-exemplo.mp3` | ✅ pronto | Conceito 6 (União) · Exemplo | A união B é igual ao conjunto com vôlei, futsal, natação e basquete. Futsal e natação estão nos dois conjuntos, mas aparecem uma vez só. A união tem 4 elementos. |
| 38 | `c6-sintese.mp3` | ✅ pronto | Conceito 6 (União) · Síntese | União é tudo o que está em A ou em B, ou nos dois. |
| 39 | `c7-gancho.mp3` | ✅ pronto | Conceito 7 (Interseção) · Pergunta | A Ana e o Bruno querem marcar um treino juntos. Qual esporte eles podem escolher? |
| 40 | `c7-gancho-resposta.mp3` | ✅ pronto | Conceito 7 (Interseção) · Pergunta, depois da escolha | Vamos conferir! Só dá para escolher um esporte que os dois praticam. O que fica na sobreposição dos grupos é a interseção. |
| 41 | `c7-explicacao.mp3` | ✅ pronto | Conceito 7 (Interseção) · Explicação | A interseção de A e B contém só os elementos que pertencem a A e também a B. Escrevemos A interseção B. No diagrama, é a região onde os círculos se sobrepõem. |
| 42 | `c7-visual.mp3` | ✅ pronto | Conceito 7 (Interseção) · Imagem | Só a região do meio fica destacada: é onde estão os esportes que a Ana e o Bruno praticam. As outras regiões ficam esmaecidas. |
| 43 | `c7-exemplo.mp3` | ✅ pronto | Conceito 7 (Interseção) · Exemplo | A interseção B é igual ao conjunto com futsal e natação. Vôlei só está em A e basquete só está em B, então os dois ficam de fora. |
| 44 | `c7-sintese.mp3` | ✅ pronto | Conceito 7 (Interseção) · Síntese | Interseção é o que está nos dois conjuntos ao mesmo tempo. |
| 45 | `c8-gancho.mp3` | ✅ pronto | Conceito 8 (Diferença) · Pergunta | A Ana quer saber quais esportes ela pratica que o Bruno não pratica. Como você chamaria essa lista? |
| 46 | `c8-gancho-resposta.mp3` | ✅ pronto | Conceito 8 (Diferença) · Pergunta, depois da escolha | Tirar do grupo da Ana o que também é do Bruno é o que chamamos de diferença. |
| 47 | `c8-explicacao.mp3` | ✅ pronto | Conceito 8 (Diferença) · Explicação | A diferença A menos B contém os elementos que pertencem a A e não pertencem a B. Lemos 'A menos B'. Atenção: B menos A é outro conjunto, então a ordem importa. |
| 48 | `c8-visual.mp3` | ✅ pronto | Conceito 8 (Diferença) · Imagem | No diagrama maior, só a parte de A fora de B fica destacada: é A menos B. No menor, o destaque muda de lado: é B menos A. |
| 49 | `c8-exemplo.mp3` | ✅ pronto | Conceito 8 (Diferença) · Exemplo | A menos B é igual ao conjunto com vôlei, porque futsal e natação também estão em B e saem. Já B menos A é igual ao conjunto com basquete. Veja que A menos B e B menos A não são iguais. |
| 50 | `c8-sintese.mp3` | ✅ pronto | Conceito 8 (Diferença) · Síntese | A menos B é o que está em A e não está em B. Trocar a ordem muda o resultado. |
| 51 | `c9-gancho.mp3` | ✅ pronto | Módulo de lógica (Linguagem lógica) · Pergunta | 'Banana pertence a A.' Uma frase assim pode ser verdadeira ou falsa? |
| 52 | `c9-gancho-resposta.mp3` | ✅ pronto | Módulo de lógica (Linguagem lógica) · Pergunta, depois da escolha | Uma afirmação sobre conjuntos é verdadeira ou falsa, e só olhando os elementos dá para saber qual. Vamos aprender a ler e a julgar essas frases. |
| 53 | `c9-explicacao.mp3` | ✅ pronto | Módulo de lógica (Linguagem lógica) · Explicação | Quatro expressões aparecem sempre: 'pertence', 'não pertence', 'está contido' e 'não está contido'. Use o símbolo de pertence e o símbolo de não pertence entre um elemento e um conjunto. Use o símbolo de está contido e o símbolo de não está contido entre dois conjuntos. |
| 54 | `c9-visual.mp3` | ✅ pronto | Módulo de lógica (Linguagem lógica) · Imagem | Use este quadro como tradutor: a expressão em palavras, o símbolo e o que cada um liga. |
| 55 | `c9-exemplo.mp3` | ✅ pronto | Módulo de lógica (Linguagem lógica) · Exemplo | Com A igual ao conjunto com maçã, banana e uva, B igual ao conjunto com maçã e banana e C igual ao conjunto com maçã e abacaxi: banana pertence a B é verdadeira, porque banana é elemento de B. B está contido em A é verdadeira, porque todos os elementos de B estão em A. Já A está contido em B é falsa, porque a uva está em A e não está em B. |
| 56 | `c9-pratica.mp3` | ✅ pronto | Módulo de lógica (Linguagem lógica) · Prática | Agora é sua vez: marque Verdadeira ou Falsa em cada afirmação. Aqui não vale nota, é só para treinar. |
| 57 | `c9-sintese.mp3` | ✅ pronto | Módulo de lógica (Linguagem lógica) · Síntese | Para julgar uma afirmação, veja primeiro se ela liga elemento a conjunto ou conjunto a conjunto. Depois confira os elementos. |
| 58 | `guarda-rota.mp3` | ✅ pronto | Guarda de rota (quiz aberto antes da trilha) | Opa! O desafio só abre depois da trilha. Vamos terminar o que falta? |
| 59 | `transicao.mp3` | ✅ pronto | Transição para o desafio | Muito bem! Agora que concluímos nossa trilha, chegou a hora de treinar tudo o que aprendemos. Vamos para o desafio? |
| 60 | `inicio-pergunta.mp3` | ✅ pronto | Quiz · início de cada pergunta | Leia com calma e escolha uma alternativa. Se travar, peça uma dica! |
| 61 | `acerto-1.mp3` | ✅ pronto | Quiz · acerto (variação 1, sorteada) | Isso mesmo! Você identificou corretamente. Vamos para a próxima? |
| 62 | `acerto-2.mp3` | ✅ pronto | Quiz · acerto (variação 2, sorteada) | Boa! É exatamente isso. |
| 63 | `acerto-3.mp3` | ✅ pronto | Quiz · acerto (variação 3, sorteada) | Mandou bem! Você pegou a ideia. |
| 64 | `p1-erro.mp3` | ✅ pronto | Quiz · P1 · resposta errada | Quase lá! 'Legal', 'bonito' e 'divertido' dependem de opinião. Um conjunto precisa de um critério claro, como 'ter mais de 16 anos', que qualquer pessoa consegue conferir. Observe o exemplo e tente usar essa ideia na próxima. |
| 65 | `p1-dica.mp3` | ✅ pronto | Quiz · P1 · dica | Psiu! Uma pista: Um conjunto precisa de um critério que qualquer pessoa consiga conferir. |
| 66 | `p2-erro.mp3` | ✅ pronto | Quiz · P2 · resposta errada | Quase lá! Cada número listado é um elemento. Os elementos de A são 2, 4, 6 e 8, então A tem 4 elementos. O valor dos números não muda a contagem. Observe o exemplo e tente usar essa ideia na próxima. |
| 67 | `p2-dica.mp3` | ✅ pronto | Quiz · P2 · dica | Psiu! Uma pista: Conte cada número separado por vírgula. |
| 68 | `p3-erro.mp3` | ✅ pronto | Quiz · P3 · resposta errada | Quase lá! O símbolo de pertence quer dizer que o elemento está no conjunto. Entre essas opções, só a banana está mesmo em A, então banana pertence a A. Para o abacaxi, que não está em A, o certo seria abacaxi não pertence a A. Observe o exemplo e tente usar essa ideia na próxima. |
| 69 | `p3-dica.mp3` | ✅ pronto | Quiz · P3 · dica | Psiu! Uma pista: o símbolo de pertence quer dizer que o elemento está no conjunto. Ele precisa aparecer dentro das chaves. |
| 70 | `p4-erro.mp3` | ✅ pronto | Quiz · P4 · resposta errada | Quase lá! Na listagem, os elementos ficam entre chaves e separados por vírgulas. O diagrama mostra 1, 3 e 5, então A igual a, abre chaves, 1, 3, 5, fecha chaves. Observe o exemplo e tente usar essa ideia na próxima. |
| 71 | `p4-dica.mp3` | ✅ pronto | Quiz · P4 · dica | Psiu! Uma pista: Para listar os elementos de um conjunto usamos chaves. |
| 72 | `p5-erro.mp3` | ✅ pronto | Quiz · P5 · resposta errada | Quase lá! Pertinência liga elemento a conjunto; inclusão liga conjunto a conjunto. Maçã e banana, todos os elementos de B, também estão em A, então B está contido em A. Já A está contido em B é falsa, porque a uva está em A e não está em B. Observe o exemplo e tente usar essa ideia na próxima. |
| 73 | `p5-dica.mp3` | ✅ pronto | Quiz · P5 · dica | Psiu! Uma pista: o símbolo de está contido liga um conjunto a outro conjunto. Todos os elementos de B estão em A? |
| 74 | `p6-erro.mp3` | ✅ pronto | Quiz · P6 · resposta errada | Quase lá! A união reúne todos os elementos de A, de B ou dos dois, citando cada um uma vez só. Juntando tudo, A união B é igual ao conjunto com vôlei, futsal, natação e basquete. Observe o exemplo e tente usar essa ideia na próxima. |
| 75 | `p6-dica.mp3` | ✅ pronto | Quiz · P6 · dica | Psiu! Uma pista: A união junta tudo o que está em A ou em B, sem repetir. |
| 76 | `p7-erro.mp3` | ✅ pronto | Quiz · P7 · resposta errada | Quase lá! Lembre-se: a interseção reúne os elementos que aparecem nos dois conjuntos. Futsal e natação estão em A e em B, então A interseção B é igual ao conjunto com futsal e natação. Observe o exemplo e tente usar essa ideia na próxima. |
| 77 | `p7-dica.mp3` | ✅ pronto | Quiz · P7 · dica | Psiu! Uma pista: Procure o que aparece nos dois conjuntos ao mesmo tempo. |
| 78 | `p8-erro.mp3` | ✅ pronto | Quiz · P8 · resposta errada | Quase lá! A menos B guarda só o que está em A e não está em B. Futsal e natação também estão em B, então saem, e sobra vôlei. Repare que B menos A seria o conjunto com basquete: a ordem importa. Observe o exemplo e tente usar essa ideia na próxima. |
| 79 | `p8-dica.mp3` | ✅ pronto | Quiz · P8 · dica | Psiu! Uma pista: A menos B é o que está em A e não está em B. |
| 80 | `p9-erro.mp3` | ✅ pronto | Quiz · P9 · resposta errada | Quase lá! O símbolo de está contido se lê está contido em, e o tracinho que corta o símbolo nega a relação: cortado, ele se lê não está contido em. Pertence e não pertence usam outros símbolos, os da pertinência. Observe o exemplo e tente usar essa ideia na próxima. |
| 81 | `p9-dica.mp3` | ✅ pronto | Quiz · P9 · dica | Psiu! Uma pista: o tracinho que corta o símbolo nega a relação. |
| 82 | `p10-erro.mp3` | ✅ pronto | Quiz · P10 · resposta errada | Quase lá! O 3 é um elemento, e não um conjunto, então o certo é 3 pertence a A. O símbolo de está contido só liga conjuntos, como em: o conjunto com 1 e 2 está contido em A. Observe o exemplo e tente usar essa ideia na próxima. |
| 83 | `p10-dica.mp3` | ✅ pronto | Quiz · P10 · dica | Psiu! Uma pista: o símbolo de está contido só liga conjuntos. O número 3 é um conjunto? |
| 84 | `final-alta.mp3` | ✅ pronto | Resultado · 80% ou mais de acertos | Você chegou ao fim do desafio e mandou muito bem! Continue praticando e revisando. Estou orgulhosa de você! |
| 85 | `final-media.mp3` | ✅ pronto | Resultado · de 50% a 79% de acertos | Você chegou ao fim do desafio e está no caminho certo! Dê uma olhada nos conceitos sugeridos e tente de novo. Com treino, você vai ficar cada vez melhor em Teoria dos Conjuntos e Lógica. Estou torcendo por você! |
| 86 | `final-baixa.mp3` | ✅ pronto | Resultado · menos de 50% de acertos | Você chegou ao fim do desafio, e isso já conta muito! Todo mundo começa devagar: revise com calma os conceitos sugeridos e tente de novo quando quiser. Eu estou aqui com você! |
| 87 | `nao-encontrada.mp3` | ✅ pronto | Página não encontrada | Hum, não encontrei essa página. Que tal voltar para o início e seguir a trilha comigo? |

> `apresentacao.mp3` é o arquivo `voice_preview_dekinha.mp3` enviado no início. Confira se ele diz exatamente o texto acima; se não, gere de novo com o mesmo nome.
