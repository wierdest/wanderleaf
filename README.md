# 🌿 Wanderleaf

## 📝 Características:
- Prova de conceito de jogo de exploração isométrico no navegador com mapas gerados proceduralmente.
- Utiliza: 
    - [PIXI.js](https://www.pixijs.com)
    - [simplex-noise](https://www.npmjs.com/package/simplex-noise)
    - [Express](https://expressjs.com/)
- Buildless
- Conformidade com StandardJS
- Aderente ao Sonarway

## 🎯 Objetivos:
- Praticar desenvolvimento e arquitetura de software em um contexto sem pressão com o qual que tenho o mínimo de familiaridade.
- Distrair a cabeça
- Implementar conexão com um modelo de IA local (a princípio um modelo acessível com ollama)
- Utilizar a conexão para que o usuário crie a história do jogo proceduralmente
- Deploy em um container em uma plataforma como RunPod

## 🚀 Kickoff:
 - npm update
 - npm run start

## 🛠️ Histórias de Desenvolvimento
Wanderleaf é a prova de conceito de jogo de exploração isométrico, sendo assim...

## 🧙‍♂️ Personagem Jogador
Wanderleaf precisa de um personagem jogador com movimentação em 8 direções.

Um jogador desse tipo, como objeto de jogo, é basicamente uma FSM (finite state machine - máquina de estados finitos) e uma coleção de animators. A essa estrutura básica, podemos adicionar algo como um **Character**, responsável pelos dados narrativos do jogo e um **Body** para lidar com o movimento, controle e posição na tela.

Com isso em mente, iniciamos a implementação a partir de:

Um enum  **Direction** e um enum **State**, fundamentais para controlar o comportamento do personagem.

Em seguida iniciamos a implementação de um animator para lidar com a animação do personagem conforme os estados. A implementação levou à:

criação do script utilitário **character-atlas-gen.js** para extrair as informações dos frames a partir dos assets PNG e transformá-las em um atlas.json, capaz de ser lido

criação do **SpriteLoader** para carregar as texturas a partir dos atlases e transformá-las em `PIXI.Spritesheet` com animations que utilizamos em `PIXI.AnimatedSprite`.

implementação do **SpriteAnimator**, que representa cada um dos estados animados que um objeto de jogo possui.

implementação de um **StatesLoader** para carregar e gerenciar os estados das entidades no jogo, incluindo o personagem jogador.


## 🎮 Controles
Para permitir que o jogador explore o mundo de Wanderleaf caminhando pelo mapa, criamos um sistema de controle básico.

Pensando nisso, criamos uma **BaseControls**, responsável por disponibilizar a interação conectando eventos de input do navegador a um alvo injetado via dependência.

Em seguida, criamos a classe **Controllable**, que representa o alvo que pode receber e reagir aos controles.

Para tornar o sistema funcional, implementamos uma classe concreta, o **ArrowControls**, permitindo que tanto o mapa quanto o jogador possam ser controlados de maneira unificada. Nesse sentido, o que acontece atualmente é: 
os objetos **Controllable** implementam um método **canMove(dx, dy)**, para controlar a possibilidade de movimento. O **GameMap** recebe uma referência ao **Player**, e usa o método **canMove** desse controllable para decidir quando pode executar o scroll. O **Player**, por sua vez, implementa o método conferindo se sua posição é próxima a margem, fazendo com que pare de se movimentar, cedendo o movimento ao mapa.


## 🗺️ Mapa
Wanderleaf precisa de algo como um mapa infinito, então estamos aproveitando o `TilingSprite` do PIXI para dar essa sensação de continuidade.

No início, em um estágio bem prototípico, utilizávamos imagens prontas para formar o mapa. No entanto, isso rapidamente se mostrou limitado para as nossas necessidades de expansão e variedade.

Após implementarmos o jogador, decidimos evoluir o sistema de mapas: começamos a gerar mapas a partir de um tileset e de um spritesheet. Com isso, surgiram algumas necessidades técnicas específicas.

Primeiro, criamos um script utilitário **tileset-atlas-gen.js**, responsável por extrair informações de frames diretamente do asset PNG do tileset. Em seguida, desenvolvi o **IsometricMapTextureCreator**, que gera a textura do mapa em formato isométrico para alimentar o nosso objeto `TilingSprite` (ou seja, o mapa visível no jogo).

Além disso, introduzimos o **BiomeContext**, uma estrutura para armazenar informações sobre os tiles e fornecer dados para os avaliadores de bioma, aplicando o padrão de projeto Strategy.

Implementamos também o **BiomeEvaluator**, que avalia se um determinado tile pertence a um bioma específico. Com base nesse sistema, criamos avaliadores concretos, como o **LakeEvaluator** e o **OceanEvaluator**, para gerar uma textura inicial rudimentar que já define áreas de lago, oceano e terra no mapa.

Por cima disso, adicionamos um `PIXI.ColorMatrixFilter` para simular de modo rudimentar a passagem de tempo.

## 🛣️ Próximos passos...

A próxima história [em desenvolvimento] é relacionada a refinamento da textura do mapa, a partir do carregamento em etapas, e a construção de uma tela inicial do protótipo.

Para dar início a isso, foi necessário verificar algumas ferramentas que `PIXI.js` oferece, nomeadamente `PIXI.Text` (incluindo o carregamento de uma fonte) e `PIXI.Graphics`

O próximo passo é desacoplar os containers dos objetos de jogo, para que possamos gerenciar a ordem de renderização.

Isso fará com que sejamos capazes de renderizar elementos de UI e HUD e elementos de jogo separadamente.

Provavelmente implementaremos algo como GameManager ou Game, para organizar as cenas e sua renderização.

Criaremos o protótipo da tela inicial.

Utilizaremos a presença dessa tela inicial como ponto de partida para refinar o carregamento do mapa (trazendo o fator de intencionalidade que o tileset precisa) e adicionar o resto dos estados do jogador.

Aproveitaremos a oportunidade para expandir os controles, incluindo taps, clicks e movimento do mouse.

