import { IS_ABSTRACT, NOT_IMPLEMENTED } from '../constants/error.js'

export class BaseLoader {
  constructor () {
    if (new.target === BaseLoader) {
      throw new Error(IS_ABSTRACT(this.constructor.name))
    }
    this.progress = 0
  }

  async load (options = {}) {
    const { onProgress, ...otherOptions } = options

    this.progress = 0

    const result = await this._work({
      progressCallback: progress => {
        this.progress = progress
        if (onProgress) onProgress(progress)
      },
      ...otherOptions
    })

    return result
  }

  async _work ({ progressCallback, ...args }) {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, '_work'))
  }
}
