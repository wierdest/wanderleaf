import { TilingSprite, Container, ColorMatrixFilter, Graphics } from 'pixi.js'
import { Controllable } from './controls/Controllable.js'

export class GameMap extends Controllable {
  constructor (app, mapTexture) {
    super()
    this.app = app
    this.container = new Container()

    this.background = new Graphics()
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill('0x172038')

    this.tilingSprite = new TilingSprite({
      texture: mapTexture,
      width: app.screen.width,
      height: app.screen.height

    })

    this.scrollSpeed = 1.6

    this.container.addChild(this.background)
    this.container.addChild(this.tilingSprite)
    app.stage.addChild(this.container)

    // a simple color filter

    this.lightFilter = new ColorMatrixFilter()

    this.container.filters = [this.lightFilter]

    this.lightFactor = Math.PI / 2
  }

  update () {
    this.lightFactor += 0.01
    const { matrix } = this.lightFilter

    // index 10: blue to blue multiplier
    matrix[10] = Math.cos(this.lightFactor) * 0.6
  }

  onControlInput (dx, dy) {
    if (this.canMove(dx, dy)) {
      this.tilingSprite.tilePosition.x -= dx * this.scrollSpeed
      this.tilingSprite.tilePosition.y -= dy * this.scrollSpeed
    }
  }

  onControlStop () {

  }

  canMove (dx, dy) {
    return !this._player?.canMove(dx, dy)
  }

  setPlayer (player) {
    this._player = player
  }
}
