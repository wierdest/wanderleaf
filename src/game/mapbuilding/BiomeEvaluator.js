import { INVALID_ARGUMENT, IS_ABSTRACT, NOT_IMPLEMENTED } from '../constants/error.js'
import { BiomeContext } from './BiomeContext.js'

export class BiomeEvaluator {
  constructor (context) {
    if (!(context instanceof BiomeContext)) {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `context: ${context.constructor.name}`))
    }
    if (new.target === BiomeEvaluator) {
      throw new Error(IS_ABSTRACT(this.constructor.name))
    }
  }

  evaluate () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'evaluate'))
  }
}
