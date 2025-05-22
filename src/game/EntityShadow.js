import { Graphics } from 'pixi.js'
import { STATE } from './constants/states.js'

export class EntityShadow {
  constructor (container, body, offset) {
    this.body = body
    this.container = container
    this.offset = offset
    this.drawSimpleEllipseShadow(STATE.IDLE)
  }

  drawSimpleEllipseShadow (state) {
    const bodyPos = this.body.getPosition()
    const isSmall = state === STATE.JUMP || state === STATE.RUNNINGJUMP
    const width = isSmall ? this._getRandomInRange(5, 7, true) : this._getRandomInRange(10, 13, true)
    const height = isSmall ? this._getRandomInRange(3, 5, true) : this._getRandomInRange(8, 11, true)
    const alpha = 0.1 + Math.random() * 0.2
    const y = state === STATE.JUMP ? this.body.groundY + this.offset.y : bodyPos.y + this.offset.y

    this.shadow = new Graphics()
      .ellipse(bodyPos.x + this.offset.x, y, width, height)
      .fill({
        color: 0x000000,
        alpha
      })
    this.container.addChildAt(this.shadow, 0)
  }

  _getRandomInRange (min, max, ease = false) {
    const r = ease ? Math.pow(Math.random(), 1.5) : Math.random()
    return min + r * (max - min)
  }

  move (state) {
    this.shadow.destroy()
    this.drawSimpleEllipseShadow(state)
  }
}
