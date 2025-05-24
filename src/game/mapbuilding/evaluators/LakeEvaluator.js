import { createNoise2D } from 'simplex-noise'
import { BiomeEvaluator } from './BiomeEvaluator.js'

export class LakeEvaluator extends BiomeEvaluator {
  constructor (biomeContext) {
    super(biomeContext)
    this.biomeContext = biomeContext

    this.noise2D = createNoise2D()
    this.cx = this.biomeContext.bounds.getBorder().x
    this.cy = this.biomeContext.bounds.getBorder().y
    this.baseRadius = this.biomeContext.args[0]
    this.strength = this.biomeContext.args[1]
  }

  evaluate (x, y) {
    if (this._isInBlob(x, y)) {
      return this.biomeContext.textureIds[0]
    }
  }

  _isInBlob (x, y) {
    const dx = x - this.cx
    const dy = y - this.cy
    const d = Math.sqrt(dx * dx + dy * dy)

    const angle = Math.atan2(dy, dx)

    const noiseRadiusOffset = this.noise2D(Math.cos(angle), Math.sin(angle)) * this.baseRadius * 0.3

    const radius = this.baseRadius + noiseRadiusOffset

    return Math.max(0, 1 - (d / radius)) * this.strength
  }
}
