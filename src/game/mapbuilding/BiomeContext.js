import { INVALID_ARGUMENT } from '../constants/errors.js'
import { Bounds } from '../math/Bounds.js'

export class BiomeContext {
  constructor (bounds, ...args) {
    if ((bounds) && !(bounds instanceof Bounds)) {
      throw new Error(
        INVALID_ARGUMENT(
          this.constructor.name,
                    `bounds: ${bounds?.constructor?.name}}`
        )
      )
    }
    this.bounds = bounds
    this.args = args
  }
}
