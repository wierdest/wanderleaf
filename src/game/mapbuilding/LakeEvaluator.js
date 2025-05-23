import { createNoise2D } from 'simplex-noise'
import { INVALID_ARGUMENT } from '../constants/errors.js'
import { BiomeEvaluator } from './BiomeEvaluator.js'

export class LakeEvaluator extends BiomeEvaluator {
  constructor (biomeContext) {
    super(biomeContext)

    if (
      !biomeContext?.args ||
            biomeContext.args.length < 2 ||
            typeof biomeContext.args[0] !== 'number' ||
            typeof biomeContext.args[1] !== 'number'
    ) {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `context args: ${JSON.stringify(biomeContext?.args)}`))
    }

    this.biomeContext = biomeContext

    this.noise2D = createNoise2D()
    this.cx = this.biomeContext.bounds.getBorder().x
    this.cy = this.biomeContext.bounds.getBorder().y
    this.baseRadius = this.biomeContext.args[0]
    this.strength = this.biomeContext.args[1]
  }

  evaluate (x, y) {
    if (this._isInBlob(x, y)) {
      // TODO evaluate for different ocean textures
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
