import { INVALID_ARGUMENT } from '../constants/error.js'
import { Vector2 } from './Vector2.js'

export class Bounds {
  constructor (x, y = new Vector2(0, 0)) {
    if (!(x instanceof Vector2) || !(y instanceof Vector2)) {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `x: ${x.constructor.name}, y: ${y.constructor.name}`))
    }
    this.x = x
    this.y = y
  }

  getMinX () {
    return this.x.x
  }

  getMaxX () {
    return this.x.y
  }

  getMinY () {
    return this.y.x
  }

  getMaxY () {
    return this.y.y
  }

  getBorder () {
    return this.x
  }
}
