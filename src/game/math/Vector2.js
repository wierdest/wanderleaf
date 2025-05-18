import { INVALID_ARGUMENT } from '../constants/errors.js'

export class Vector2 {
  constructor (x, y) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `x: ${x}, y: ${y}`))
    }
    this.x = x
    this.y = y
  }
}
