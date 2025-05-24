import { DEFAULT_LAND_TILE_TEXTURE } from '../constants/assets.js'
import { INVALID_ARGUMENT, IS_ABSTRACT, NOT_IMPLEMENTED, UNDEFINED } from '../constants/errors.js'
import { Vector2 } from '../math/Vector2.js'

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
    this.biomeEvaluators = new Map()
    this.basicMapSteps = []
    this.refinementSteps = []
    this.tiles = []
  }

  init () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'init'))
  }

  initBiomeEvaluator (name, biomeEvaluator) {
    if (!this.biomeEvaluators) {
      this.biomeEvaluators = new Map()
    }
    this.biomeEvaluators.set(name, biomeEvaluator)
  }

  buildBasicMap (progressCallback) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'buildBasicMap'))
  }

  async buildRefinedMap (progressCallback) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'buildRefinedMap'))
  }

  buildTiles () {
    for (let y = -this.heightInTiles; y < this.heightInTiles; y++) {
      const row = []
      for (let x = -this.widthInTiles; x < this.widthInTiles; x++) {
        const tile = { textureId: '', pos: new Vector2(0, 0), size: new Vector2(this.tileWidth, this.tileHeight) }
        tile.textureId = this._getTileTextureId(x, y) || DEFAULT_LAND_TILE_TEXTURE
        tile.pos.x = x
        tile.pos.y = y
        row.push(tile)
      }
      this.tiles.push(row)
    }
    return this.tiles
  }

  _getTileTextureId (x, y) {
    if (this.biomeEvaluators?.size === 0) {
      throw new Error(UNDEFINED('biomeEvaluators', 'Make sure you have implemented and called at least one initBiomeEvaluator'))
    }
    for (const evaluator of this.biomeEvaluators.values()) {
      const textureId = evaluator.evaluate(x, y)
      if (textureId) return textureId
    }
  }
}
