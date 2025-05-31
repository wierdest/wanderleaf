import { COASTAL_FLAT_SLAB, COASTAL_ROUND_ROCKS, COASTAL_RUGGED_SLAB, COASTAL_SUBMERGED_ROCKS, COASTAL_SUBMERGED_ROCKS_SMALL, DEFAULT_LAND_TILE_TEXTURE, OCEAN_WAVES, WATER_SPARKLES } from '../../constants/assets.js'
import { BiomeEvaluator } from './BiomeEvaluator.js'

export class NorthwesternCoastEvaluator extends BiomeEvaluator {
  constructor (biomeContext) {
    super(biomeContext)
    this.allTiles = this.biomeContext.args
    this.height = this.allTiles.length
    this.width = this.allTiles[0].length
  }

  evaluate (tile) {
    const { x, y } = tile.grid

    if (this._isNeighbour(x, y, 1, 0)) {
      return this._chooseSlab()
    }

    if (this._isNeighbour(x, y, 2, 0)) {
      return this._chooseRuggedSlabOrRock()
    }

    if (this._isNeighbour(x, y, 3, 0)) {
      return this._chooseSparkleOrWave()
    }

    if (this._isNeighbour(x, y, 4, 0)) {
      return Math.random() < 0.03 ? this._chooseSubmergedRock() : Math.random() < 0.08 ? this._chooseSparkle() : tile.textureId
    }

    if (this._isNeighbour(x, y, 5, 0)) {
      return Math.random() < 0.03 ? this._chooseSubmergedRockSmall() : Math.random() < 0.08 ? this._chooseSparkle() : tile.textureId
    }

    if (this._isNeighbour(x, y, 7, 1)) {
      return Math.random() < 0.4 ? this._chooseSparkleOrWave() : tile.textureId
    }
  }

  _isNeighbour (x, y, dx, dy) {
    const nx = x + dx
    const ny = y + dy
    if (ny < 0 || ny >= this.height || nx < 0 || nx >= this.width) return false
    const neighbor = this.allTiles[ny][nx]
    return neighbor?.textureId === DEFAULT_LAND_TILE_TEXTURE
  }

  _chooseSlab () {
    return Math.random() < 0.3 ? COASTAL_RUGGED_SLAB : COASTAL_FLAT_SLAB
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
}
