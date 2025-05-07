import { INVALID_ARGUMENT, IS_ABSTRACT, NOT_IMPLEMENTED } from '../constants/error.js'

export class MapDirector {
  constructor (builder, progressCallback = () => {}) {
    if (new.target === MapDirector) {
      throw new Error(IS_ABSTRACT(this.constructor.name));
    }
    if (!builder) {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `builder: ${builder.constructor.name}`))
    }
    if (typeof this.progressCallback !== 'function') {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `progressCallback: ${typeof progressCallback}`))
    }

    this.builder = builder
    this.progressCallback = progressCallback
  }

  construct () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'construct'))
  }

  updateProgress (progress) {
    if (typeof this.progressCallback === 'function') {
      this.progressCallback(progress)
    }
  }
}
