import { createNoise2D } from 'simplex-noise'
import { BiomeEvaluator } from './mapbuilding/BiomeEvaluator.js'
import { OCEAN_WATER } from './constants/assets.js'

export class OceanEvaluator extends BiomeEvaluator {
  constructor (biomeContext, type) {
    super(biomeContext, type)
    this.noise2D = createNoise2D()

    this.minY = this.biomeContext.bounds.getMinY()
    this.maxY = this.biomeContext.bounds.getMaxY()

    this.minX = this.biomeContext.bounds.getMinX()
    this.maxX = this.biomeContext.bounds.getMaxX()
  }

  evaluate (tile) {
    const { x, y } = tile.pos
    this._updateBands(x, y)

    if (this._isWithinBand(x, y)) {
      return OCEAN_WATER
    }
  }

  _isWithinBand (x, y) {
    return (
      ((y >= this.minY) && (y <= (this.minY + this.topBand))) ||
      ((y <= this.maxY) && (y >= (this.maxY - this.bottomBand))) ||
      ((x >= this.minX) && (x <= (this.minX + this.leftBand))) ||
      ((x <= this.maxX) && (x >= (this.maxX - this.rightBand)))
    )
  }

  _getBandAt (x, y) {
    const noise = this.noise2D(x * 0.1, y * 0.02)
    const minBand = 3
    const maxBand = 18
    const bandWidth = Math.floor((noise + 1) / 2 * maxBand)
    return Math.max(minBand, Math.min(bandWidth, maxBand))
  }

  _updateBands (x, y) {
    this.topBand = this._getBandAt(x, this.minY)
    this.bottomBand = this._getBandAt(x, this.maxY)
    this.leftBand = this._getBandAt(this.minX, y)
    this.rightBand = this._getBandAt(this.maxX, y)
  }
}
