import { DEFAULT_LAND_TILE_TEXTURE } from '../../constants/assets.js'
import { Vector2 } from '../../math/Vector2.js'
import { BiomeEvaluator } from './BiomeEvaluator.js'

export class CoastlineEvaluator extends BiomeEvaluator {
  constructor (biomeContext) {
    super(biomeContext)
    // Coastline Evaluator is the first example of our semantic evaluators
    // expensive call for sure but it should provide ample information about the tileset to create
    // an informed texture
    this.allTiles = this.biomeContext.args

    this.height = this.allTiles.length
    this.width = this.allTiles[0].length

    this._initPerimeter()
    console.log(this.perimeter)
  }

  evaluate (tile) {
    if (this._isRightNeighbor(tile)) {
      return this.biomeContext.textureIds[ Math.random() * this.biomeContext.textureIds.length | 0]
    }
  }

  _isAdjacentToLand (tile) {
    return (
      this._isNorthOfLand(tile) ||
      this._isEastOfLand(tile) ||
      this._isWestOfLand(tile) ||
      this._isSouthOfLand(tile)
    )
  }

  _isRightNeighbor (tile) {
      const { x, y } = tile.grid
      const nx = x + 1
      const ny = y
      if (ny < 0 || ny >= this.height || nx < 0 || nx >= this.width) return false
      const neighbor = this.allTiles[ny][nx]
      return neighbor?.textureId === DEFAULT_LAND_TILE_TEXTURE
  }

  _checkNeighbor (tile, perimeterDirection) {
    const { x, y } = tile.grid
    const nx = x + 1
    const ny = y + 1
    if (ny < 0 || ny >= this.height || nx < 0 || nx >= this.width) return false

    const neighbor = this.allTiles[ny][nx]
    return neighbor?.textureId === DEFAULT_LAND_TILE_TEXTURE
  }

  _isNorthOfLand (tile) {
    return this._checkNeighbor(tile, this.perimeter[0])
  }

  _isEastOfLand (tile) {
    return this._checkNeighbor(tile, this.perimeter[1])
  }

  _isWestOfLand (tile) {
    return this._checkNeighbor(tile, this.perimeter[2])
  }

  _isSouthOfLand (tile) {
    return this._checkNeighbor(tile, this.perimeter[3])
  }

  _initPerimeter () {
    const bounds = this.biomeContext.bounds

    const minX = bounds.getMinX()
    const maxX = bounds.getMaxX()
    const minY = bounds.getMinY()
    const maxY = bounds.getMaxY()

    const maxDistance = Math.max(
      Math.abs(minX) + Math.abs(minY),
      Math.abs(minX) + Math.abs(maxY),
      Math.abs(maxX) + Math.abs(minY),
      Math.abs(maxX) + Math.abs(maxY)
    )

    this.perimeter = []
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if ((x !== 0 || y !== 0) && Math.abs(x) + Math.abs(y) === maxDistance) {
          this.perimeter.push(new Vector2(x, y))
        }
      }
    }

    if (this.perimeter.length !== 4) {
      throw new Error(`Evaluator bounds should be able to be converted into a perimeter! Bounds: x: ${minX}, ${maxX} | y: ${minY}, ${maxY}`)
    }
  }
}
