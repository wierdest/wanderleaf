import { INVALID_ARGUMENT, IS_ABSTRACT, NOT_IMPLEMENTED, UNDEFINED } from '../constants/errors.js'
import { Vector2 } from '../math/Vector2.js'
import { Tile } from './Tile.js'

export class MapBuilder {
  constructor (size) {
    if (!(size instanceof Vector2)) {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `size: ${size.constructor.name}`))
    }
    if (new.target === MapBuilder) {
      throw new Error(IS_ABSTRACT(this.constructor.name))
    }

    this.screenWidth = size.x
    this.screenHeight = size.y
    this.bounds = undefined
    this.basicMapBiomeEvaluators = new Map()
    this.refinedMapBiomeEvaluators = new Map()
    this.tiles = []
  }

  init () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'init'))
  }

  initBasicMapBiomeEvaluator (name, biomeEvaluator) {
    this.basicMapBiomeEvaluators.set(name, biomeEvaluator)
  }

  buildBasicMapTiles (defaultTexture) {
    let gridY = 0
    let gridX = 0
    for (let y = -this.heightInTiles; y < this.heightInTiles; y++) {
      const row = []
      for (let x = -this.widthInTiles; x < this.widthInTiles; x++) {
        const tile = new Tile(
          '',
          new Vector2(x, y),
          new Vector2(this.tileWidth, this.tileHeight),
          new Vector2(gridX++, gridY)
        )
        const textureId = this._getBasicTileTextureId(tile) || defaultTexture
        tile.textureId = textureId
        row.push(tile)
      }
      this.tiles.push(row)
      gridX = 0
      gridY++
    }
    return this.tiles
  }

  _getBasicTileTextureId (tile) {
    for (const evaluator of this.basicMapBiomeEvaluators.values()) {
      const textureId = evaluator.evaluate(tile)
      if (textureId) return textureId
    }
  }
}
