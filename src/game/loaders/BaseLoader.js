import { NOT_IMPLEMENTED } from '../constants/error.js'

export class BaseLoader {
  constructor () {
    this.progress = 0
  }

  async load (onProgress) {
    this.progress = 0
    const result = await this._work(progress => {
      this.progress = progress
      if (onProgress) onProgress(progress)
    })
    this.progress = 1
    if (onProgress) onProgress(1)
    return result
  }

  async _work (progressCallback) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'work'))
  }
}
