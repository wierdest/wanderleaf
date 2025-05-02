import { NOT_IMPLEMENTED } from '../constants/error.js'

export class BaseControls {
  constructor (target) {
    this.target = target
  }

  attach () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'attach'))
  }

  detach () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'detach'))
  }
}
