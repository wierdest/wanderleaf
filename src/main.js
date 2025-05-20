import { Application, Text, TextStyle, Assets } from 'pixi.js'
import { ArrowControls } from './game/ArrowControls.js'
import { Player } from './game/Player.js'
import { Character } from './game/Character.js'
import { StatesLoader } from './game/StatesLoader.js'
import { STATE } from './game/constants/states.js'
import { Vector2 } from './game/math/Vector2.js'
import { Bounds } from './game/math/Bounds.js'
import { LoadingBar } from './game/LoadingBar.js'
import { StageManager } from './game/StageManager.js'
import { IsometricMapBuilder } from './game/IsometricMapBuilder.js'
import { IsometricMapDirector } from './game/IsometricMapDirector.js'
import { GameMap } from './game/GameMap.js'
import { MapTextureLoader } from './game/MapTextureLoader.js'
import { ActionControls } from './game/ActionControls.js'
import { DIRECTION } from './game/constants/controls.js'

const app = new Application()

async function setup () {
  await app.init({ resizeTo: window, backgroundColor: '#172038' })
  document.body.appendChild(app.canvas)
}

(async () => {
  await setup()
  const screenSize = new Vector2(app.screen.width, app.screen.height)

  // StageManager
  const stageManager = new StageManager(app.stage)
  const mapContainer = stageManager.addNewContainer('map')
  const playerContainer = stageManager.addNewContainer('player')
  const uiContainer = stageManager.addNewContainer('ui')

  // UI
  // load the font
  await Assets.load('/assets/font/upheavtt.ttf')

  const uiTextStyle = new TextStyle({
    fontFamily: 'upheavtt',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fill: 'white',
    stroke: { color: 'black', width: 2 },
    dropShadow: {
      color: '#000000',
      blur: 3,
      angle: Math.PI / 3,
      distance: 3
    },
    wordWrap: true,
    wordWrapWidth: 600
  })

  const barSize = new Vector2(300, 20)
  const barPos = new Vector2((screenSize.x - barSize.x) / 2, screenSize.y - barSize.y * 2)

  const loadingBar = new LoadingBar({ container: uiContainer, size: barSize, pos: barPos, textStyle: uiTextStyle })

  // TODO Replace progressCallbacks with ui
  const mapLoaderProgressCallback = (message, progress) => loadingBar.update(message, progress)

  const mapBuilder = new IsometricMapBuilder(screenSize)

  const mapDirector = new IsometricMapDirector(mapBuilder, mapLoaderProgressCallback)

  const tiles = await mapDirector.construct()

  const mapBasicTextureLoader = new MapTextureLoader(app.renderer, tiles)

  const mapRenderTexture = await mapBasicTextureLoader.load({ progressCallback: mapLoaderProgressCallback })

  const map = new GameMap(mapContainer, mapRenderTexture, screenSize)

  // Map controls for scroll
  const mapArrowControls = new ArrowControls(map)
  mapArrowControls.attach()

  mapDirector.refine().then(() => {
    console.log('Finished refining map!!')
  })

  // Loads a  character
  const entities = [
    {
      entity: {
        name: 'character',
        container: playerContainer
      },
      states: [
        { name: STATE.IDLE, defaultDirection: DIRECTION.DOWN },
        { name: STATE.WALK, defaultDirection: DIRECTION.DOWN },
        { name: STATE.RUN, defaultDirection: DIRECTION.DOWN },
        { name: STATE.JUMP, defaultDirection: DIRECTION.DOWN },
        { name: STATE.RUNNINGJUMP, defaultDirection: DIRECTION.DOWN },
        { name: STATE.MELEE, defaultDirection: DIRECTION.DOWN }
      ]
    }
  ]

  loadingBar.update('Carregando estados do jogador', 0.1)

  const entityLoaderProgressCallback = (progressString, progress) => loadingBar.update(progressString, progress)

  const stateLoader = new StatesLoader(entities)

  const loadedStatesPerEntity = await stateLoader.load({ progressCallback: entityLoaderProgressCallback })

  const playerAnimators = loadedStatesPerEntity.find(i => i.entity === 'character').animators

  const playerInitialPosition = new Vector2(app.screen.width / 2, app.screen.height / 2)

  const playerXBounds = new Vector2(app.screen.width / 5, app.screen.width - app.screen.width / 8)
  const playerYBounds = new Vector2(app.screen.height / 5, app.screen.height - app.screen.height / 8)
  const playerBounds = new Bounds(playerXBounds, playerYBounds)

  const player = new Player(new Character(), playerAnimators, playerInitialPosition, playerBounds)

  // Player controls

  const arrowControls = new ArrowControls(player)

  arrowControls.attach()

  const actionControls = new ActionControls(player)

  actionControls.attach()

  // Map knows about the player so it allows movement

  map.setPlayer(player)

  // TODO create a Game class or a SceneManager
  // TODO design start / loading screen

  // LoadingBar
  const barWidth = 300
  const barX = (app.screen.width - barWidth) / 2

  criarInstrucoesDoPrototipo(uiTextStyle, barX, uiContainer)

  app.ticker.add(() => {
    map.update()
    const { shouldJump } = player.update()
    player.body.update(shouldJump)
  })
})()

function criarInstrucoesDoPrototipo (style, x, container) {
  const mensagens = [
    '-> SETAS movem o personagem na tela',
    '-> SHIFT ESQUERDO enquanto move para correr',
    '-> ESPAÇO para pular.',
    '-> ESPAÇO enquanto corre para pular ao correr.',
    '-> TECLA "E" para socar (melee attack)'
  ]

  for (let i = 0; i < mensagens.length; i++) {
    const text = new Text({
      text: mensagens[i],
      style
    })
    text.x = x
    text.y = text.height * i
    container.addChild(text)
  }
}
