import { INVALID_ARGUMENT, IS_ABSTRACT, NOT_IMPLEMENTED, UNDEFINED } from '../constants/errors.js'
import { deepFreeze } from '../helpers/deepFreeze.js'
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
    this.frozenTiles = []
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

  initRefinedBiomeEvaluator (name, biomeEvaluator) {
    this.refinedMapBiomeEvaluators.set(name, biomeEvaluator)
  }

  async buildRefinedTiles () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'buildRefinedTiles'))
  }

  async refine (refinementEvaluatorName, refinementCallback, evaluatorOptions) {
    const evaluator = this.refinedMapBiomeEvaluators.get(refinementEvaluatorName)
    if (!evaluator) {
      throw new Error(UNDEFINED('biomeEvaluator', `Evaluator "${refinementEvaluatorName}" not found`))
    }

    evaluator.setOptions(evaluatorOptions)

    // flatten array
    const flat = this.tiles.flat()

    // filter according to the concrete implementation
    const filtered = await refinementCallback(flat)

    for (const tile of filtered) {
      const refined = this._getRefinedTileTextureId(tile, evaluator)
      tile.textureId = refined || tile.textureId
    }

    evaluator.clearOptions()
  }

  _getRefinedTileTextureId (tile, evaluator) {
    const textureId = evaluator.evaluate(tile)
    if (textureId) return textureId
  }

  _freezeTiles () {
    return deepFreeze(this.tiles.map(row => row.map(tile => ({ ...tile }))))
  }
}
