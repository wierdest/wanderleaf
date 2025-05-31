import { INVALID_ARGUMENT } from '../constants/errors.js'
import { Vector2 } from '../math/Vector2.js'

export class Tile {
  constructor (textureId, pos, size, grid) {
    if (typeof textureId !== 'string' || !(pos instanceof Vector2) || !(size instanceof Vector2) || !(grid instanceof Vector2)) {
      throw new Error(
        INVALID_ARGUMENT(
          this.constructor.name,
                `textureId: ${typeof textureId}, pos: ${pos?.constructor?.name}, size: ${size?.constructor?.name}, grid: ${size?.constructor?.name}`
        )
      )
    }
    this.textureId = textureId
    this.pos = pos
    this.size = size
    this.grid = grid
  }
}
