import { createNoise2D } from 'simplex-noise'
import { BiomeEvaluator } from './BiomeEvaluator.js'

export class OceanEvaluator extends BiomeEvaluator {
  constructor (biomeContext) {
    super(biomeContext)
    this.biomeContext = biomeContext
    this.noise2D = createNoise2D()

    this.minY = this.biomeContext.bounds.getMinY()
    this.maxY = this.biomeContext.bounds.getMaxY()

    this.minX = this.biomeContext.bounds.getMinX()
    this.maxX = this.biomeContext.bounds.getMaxX()
  }

  evaluate (x, y) {
    this._updateBands(x, y)

    if (this._isCoast(x, y)) {
      const shallowIndex = 1 + Math.floor(Math.random() * 3)
      return this.biomeContext.textureIds[shallowIndex]
    }

    if (this._isWithinBand(x, y)) {
      return this.biomeContext.textureIds[0]
    }
  }

  // TODO move this to a coastline evaluator
  // Then this evaluator shall be used in the refinement process, so we can implement the full
  // step of evaluating tiles => generating texture => switching map texture
  // this will lay the grounds for the rest of the refinement process
  _isCoast (x, y) {
    const shallowMargin = 2

    const inTopShallow = y >= this.minY + this.topBand - shallowMargin && y <= this.minY + this.topBand
    const inBottomShallow = y <= this.maxY - this.bottomBand + shallowMargin && y >= this.maxY - this.bottomBand
    const inLeftShallow = x >= this.minX + this.leftBand - shallowMargin * 0.2 && x <= this.minX + this.leftBand
    const inRightShallow = x <= this.maxX - this.rightBand + shallowMargin * 0.2 && x >= this.maxX - this.rightBand

    return inTopShallow || inBottomShallow || inLeftShallow || inRightShallow
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
