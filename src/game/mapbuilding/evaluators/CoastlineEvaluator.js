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
  }

  evaluate (tile) {
    if (this._isAdjacentToLand(tile)) {
      return this.biomeContext.textureIds[0]
    }
  }

  _isAdjacentToLand (tile) {
    const { x, y } = tile.grid
    return this.perimeter.some(([dx, dy]) => {
      const nx = x + dx
      const ny = y + dy
      if (ny < 0 || ny >= this.height || nx < 0 || nx >= this.width) return false

      const neighbor = this.allTiles[ny][nx]
      return neighbor?.textureId === 'tile40'
    })
  }
}
