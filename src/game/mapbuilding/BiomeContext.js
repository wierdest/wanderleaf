import { INVALID_ARGUMENT } from '../constants/errors.js'
import { Bounds } from '../math/Bounds.js'

export class BiomeContext {
  constructor (bounds, textureIds, ...args) {
    if (!(bounds instanceof Bounds) || !(textureIds instanceof Array)) {
      throw new Error(
        INVALID_ARGUMENT(
          this.constructor.name,
                    `bounds: ${bounds?.constructor?.name}, size: ${textureIds?.constructor?.name}`
        )
      )
    }
    this.bounds = bounds
    this.textureIds = textureIds
    this.args = args
  }
}
