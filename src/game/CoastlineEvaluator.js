import { COASTAL_FLAT_SLAB, COASTAL_ROUND_ROCKS, COASTAL_RUGGED_SLAB, COASTAL_SUBMERGED_ROCKS, COASTAL_SUBMERGED_ROCKS_SMALL, DEFAULT_LAND_TILE_TEXTURE, OCEAN_WAVES, ROCKS, WATER_SPARKLES } from './constants/assets.js'
import { BiomeEvaluator } from './mapbuilding/BiomeEvaluator.js'

export class CoastlineEvaluator extends BiomeEvaluator {
  constructor (biomeContext) {
    super(biomeContext)
    this.mapTiles = this.biomeContext.args[0]
    this.height = this.mapTiles.length
    this.width = this.mapTiles[0].length
  }

  setRefinementSteps (options) {
    this._direction = options.direction
    this.steps = [
      { distance: 1, result: (tile) => options.rocky ? this._chooseSlabOrRock() : this._chooseSlab() },
      { distance: 2, result: (tile) => this._chooseRuggedSlabOrRock() },
      { distance: 3, result: (tile) => this._chooseSparkleOrWave() },
      { distance: 4, result: (tile) => Math.random() < 0.03 ? this._chooseSubmergedRock() : this._chooseSparkleOrTileTexture(tile.textureId) },
      { distance: 5, result: (tile) => Math.random() < 0.03 ? this._chooseSubmergedRockSmall() : this._chooseSparkleOrTileTexture(tile.textureId) },
      { distance: 7, result: (tile) => Math.random() < 0.4 ? this._chooseSparkleOrWave() : tile.textureId }
    ]
  }

  evaluate (tile) {
    const { x, y } = tile.grid
    const [dx, dy] = this._direction
    for (const { distance, result } of this.steps) {
      const offsetX = dx * distance
      const offsetY = dy * distance
      if (this._isNeighbor(x, y, offsetX, offsetY)) {
        return result(tile)
      }
    }
  }

  _isNeighbor (x, y, dx, dy) {
    const nx = x + dx
    const ny = y + dy
    if (ny < 0 || ny >= this.height || nx < 0 || nx >= this.width) return false
    const neighbor = this.mapTiles[ny][nx]
    return neighbor?.textureId === DEFAULT_LAND_TILE_TEXTURE
  }

  _chooseSlab () {
    return Math.random() < 0.3 ? COASTAL_RUGGED_SLAB : COASTAL_FLAT_SLAB
  }

  _chooseRockySlab () {
    return Math.random() < 0.2 ? COASTAL_FLAT_SLAB : COASTAL_RUGGED_SLAB
  }

  _chooseSlabOrRock () {
    return Math.random() < 0.2 ? this._chooseRockySlab() : ROCKS[Math.floor(Math.random() * ROCKS.length)]
  }

  _chooseRuggedSlabOrRock () {
    return Math.random() < 0.3 ? COASTAL_RUGGED_SLAB : COASTAL_ROUND_ROCKS
  }

  _chooseSparkleOrWave () {
    return [...WATER_SPARKLES, ...OCEAN_WAVES][Math.floor(Math.random() * WATER_SPARKLES.length + OCEAN_WAVES.length)]
  }

  _chooseSubmergedRock () {
    return COASTAL_SUBMERGED_ROCKS[Math.floor(Math.random() * COASTAL_SUBMERGED_ROCKS.length)]
  }

  _chooseSubmergedRockSmall () {
    return COASTAL_SUBMERGED_ROCKS_SMALL[Math.floor(Math.random() * COASTAL_SUBMERGED_ROCKS_SMALL.length)]
  }

  _chooseSparkle () {
    return WATER_SPARKLES[Math.floor(Math.random() * WATER_SPARKLES.length)]
  }

  _chooseSparkleOrTileTexture (textureId) {
    return Math.random() < 0.08 ? this._chooseSparkle() : textureId
  }
}
