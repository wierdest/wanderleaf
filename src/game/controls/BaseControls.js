import { INVALID_ARGUMENT, IS_ABSTRACT, NOT_IMPLEMENTED } from '../constants/error.js'
import { Controllable } from './Controllable.js'

export class BaseControls {
  constructor (target) {
    if (!(target instanceof Controllable)) {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `controllable: ${target.constructor.name}`))
    }
    if (new.target === BaseControls) {
      throw new Error(IS_ABSTRACT(this.constructor.name))
    }
    this.target = target
  }

  attach () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'attach'))
  }

  detach () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'detach'))
  }
}
