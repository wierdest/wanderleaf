import { INVALID_ARGUMENT, NOT_IMPLEMENTED } from '../constants/error.js'
import { BiomeContext } from './BiomeContext.js'

export class BiomeEvaluator {
  constructor (context) {
    if (!(context instanceof BiomeContext)) {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `context: ${typeof context}`))
    }
  }

  evaluate () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'evaluate'))
  }
}
