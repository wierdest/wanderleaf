import { Application, Text, TextStyle, Assets, Container } from 'pixi.js'
import { GameMap } from './game/GameMap.js'
import { ArrowControls } from './game/ArrowControls.js'
import { Direction } from './game/enums/Direction.js'
import { Player } from './game/Player.js'
import { Character } from './game/Character.js'
import { StatesLoader } from './game/StatesLoader.js'
import { State } from './game/enums/State.js'
import { SpriteLoader } from './game/SpriteLoader.js'
import { IsometricMapTextureCreator } from './game/IsometricMapTextureCreator.js'
import { TILESIZE } from './game/constants/dimension.js'
import { Vector2 } from './game/math/Vector2.js'
import { Bounds } from './game/math/Bounds.js'
import { BiomeContext } from './game/mapbuilding/BiomeContext.js'
import { LakeEvaluator } from './game/mapbuilding/LakeEvaluator.js'
import { OceanEvaluator } from './game/mapbuilding/OceanEvaluator.js'
import { LoadingBar } from './game/LoadingBar.js'

const app = new Application()

async function setup () {
  await app.init({ resizeTo: window, backgroundColor: '#172038' })
  document.body.appendChild(app.canvas)
}

(async () => {
  await setup()

  // Decoupling rendering from game objects
  const playerContainer = new Container()
  const mapContainer = new Container()
  const uiContainer = new Container()

  app.stage.addChild(mapContainer)
  app.stage.addChild(playerContainer)
  app.stage.addChild(uiContainer)

  // Loads a very basic map:

  const mapSpritesheet = await SpriteLoader.loadAtlasTexturesForEntity('map')

  const isoWidth = TILESIZE * Math.sqrt(3) / 2
  const isoHeight = TILESIZE

  const widthInTiles = Math.ceil(app.screen.width * 1.5 / isoWidth) + 4
  const heightInTiles = (Math.ceil(app.screen.height * 1.5 / isoHeight) + 4)

  const xBounds = new Vector2(-widthInTiles, widthInTiles)
  const yBounds = new Vector2(-heightInTiles * 2, heightInTiles * 2)

  const biomeEvaluators = []

  const oceanBounds = new Bounds(xBounds, yBounds)

  const oceanContext = new BiomeContext(oceanBounds, ['tile101', ...Array.from({ length: 3 }, (_, i) => `tile${82 + i}`)])

  const oceanEvaluator = new OceanEvaluator(oceanContext)

  biomeEvaluators.push(oceanEvaluator)

  const lakeBounds = new Bounds(new Vector2(-18, -14))

  const lakeContext = new BiomeContext(lakeBounds, ['tile104'], 18, 1)

  const lakeEvaluator = new LakeEvaluator(lakeContext)

  biomeEvaluators.push(lakeEvaluator)

  const isometricMapTextureCreator =
    new IsometricMapTextureCreator(
      app,
      mapSpritesheet,
      isoWidth,
      isoHeight,
      widthInTiles,
      heightInTiles * 2,
      biomeEvaluators
    )

  const mapRenderTexture = isometricMapTextureCreator.create()

  const map = new GameMap(mapContainer, mapRenderTexture, app.screen.width, app.screen.height)

  // Map controls for scroll

  const mapArrowControls = new ArrowControls(map)

  mapArrowControls.attach()

  // Loads a  character with only 2 states
  const entities = [
    {
      entity: {
        name: 'character',
        container: playerContainer
      },
      states: [
        { name: State.IDLE, defaultDirection: Direction.DOWN },
        { name: State.WALK, defaultDirection: Direction.DOWN }
      ]
    }
  ]

  const stateLoader = new StatesLoader(entities)

  const loadedStatesPerEntity = await stateLoader.loadAllStatesForEntities()

  const playerAnimators = loadedStatesPerEntity.find(i => i.entity === 'character').animators

  const playerInitialPosition = new Vector2(app.screen.width / 2, app.screen.height / 2)

  const playerXBounds = new Vector2(app.screen.width / 5, app.screen.width - app.screen.width / 8)
  const playerYBounds = new Vector2(app.screen.height / 5, app.screen.height - app.screen.height / 8)
  const playerBounds = new Bounds(playerXBounds, playerYBounds)

  const player = new Player(new Character(), playerAnimators, playerInitialPosition, playerBounds)

  // Player controls

  const arrowControls = new ArrowControls(player)

  arrowControls.attach()

  // Map knows about the player so it allows movement

  map.setPlayer(player)

  // TODO create a Game class or a SceneManager
  // TODO design start / loading screen

  // LoadingBar
  const barWidth = 300
  const barHeight = 20
  const barX = (app.screen.width - barWidth) / 2
  const barY = (app.screen.height - barHeight * 2)

  const loadingBar = new LoadingBar(app, barX, barY, barWidth, barHeight)

  // Text
  // load the fonts
  await Assets.load('/assets/font/upheavtt.ttf')

  const style = new TextStyle({
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

  const textA = new Text({
    text: '',
    style
  })
  textA.x = (barX + barWidth / 2) - textA.width / 2
  textA.y = (barY - barHeight - textA.height)

  const textB = new Text({
    text: 'outra messagem!',
    style
  })
  textB.x = (barX + barWidth / 2) - textB.width / 2
  textB.y = textA.y + textA.height / 2 + 7

  const textZ = new Text({
    text: 'Use as setas para mover o personagem na tela',
    style
  })
  textZ.x = barX - textZ.width / 4
  textZ.y = 0

  uiContainer.addChild(textA)
  uiContainer.addChild(textB)
  uiContainer.addChild(textZ)

  let progress = 0
  let completedCycles = 0
  let typed = 0

  const messages = [
    'Carregando o resto dos assets do mapa...',
    '...Brincadeirinha! Isso é apenas uma prova de conceito!',
    'Confira o readme para mais informações!'
  ]

  let currentMessage = messages[completedCycles]

  const typeMessage = (progressPercent) => {
    const toType = Math.floor(progressPercent)
    if (toType > typed) {
      typed = toType
      textA.text = currentMessage.slice(0, typed)
      textA.x = (barX + barWidth / 2) - textA.width / 2
    }
  }

  app.ticker.add(() => {
    map.update()
    progress += 0.002

    if (progress >= 1) {
      progress = 0
      completedCycles++

      const index = completedCycles % messages.length
      currentMessage = messages[index]
      typed = 0
    }

    loadingBar.update(progress)
    const percentage = Math.round(progress * 100)
    textB.text = `${percentage}%`

    textB.x = (barX + barWidth / 2) - textB.width / 2

    typeMessage(percentage)
  })
})()
