import { INVALID_ARGUMENT, IS_ABSTRACT, NOT_IMPLEMENTED } from '../../constants/errors.js'
import { BiomeContext } from '../BiomeContext.js'

export class BiomeEvaluator {
  constructor (context) {
    if (!(context instanceof BiomeContext)) {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `context: ${context.constructor.name}`))
    }
    if (new.target === BiomeEvaluator) {
      throw new Error(IS_ABSTRACT(this.constructor.name))
    }
    this.biomeContext = context
  }

  evaluate (tile) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'evaluate'))
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
          this.perimeter.push([x, y])
        }
      }
    }
  }
}
