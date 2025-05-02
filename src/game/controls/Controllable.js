import { NOT_IMPLEMENTED } from '../constants/error.js'

export class Controllable {
  onControlInput (dx, dy, pressDuration, direction) {
    throw new Error(NOT_IMPLEMENTED(this.contructor.name, 'onControlInput'))
  }

  onControlStop () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'onControlStop'))
  }

  getMovementThreshold () {
    throw new Error(NOT_IMPLEMENTED(this.contructor.name, 'movementThreshold'))
  }

  canMove (dx, dy) {
    throw new Error(NOT_IMPLEMENTED(this.contructor.name, 'movementThreshold'))
  }
}
