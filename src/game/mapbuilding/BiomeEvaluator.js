import { INVALID_ARGUMENT, IS_ABSTRACT, NOT_IMPLEMENTED } from '../constants/errors.js'
import { BiomeContext } from './BiomeContext.js'

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

  setRefinementSteps (options) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'setOptions'))
  }

  clearRefinementSteps () {
    this.steps = []
  }

  evaluate (tile) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'evaluate'))
  }

  _isNeighbor (x, y, dx, dy) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, '_isNeighbor'))
  }

  _isInBlob (x, y) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, '_isInBlob'))
  }

  _isWithinBand (x, y) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, '_isWithinBand'))
  }

  _getBandAt (x, y) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, '_getBandAt'))
  }

  _updateBands (x, y) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, '_updateBands'))
  }
}
