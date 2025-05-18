import { Container } from 'pixi.js'
import { CONTAINER_ALREADY_EXISTS, CONTAINER_DOES_NOT_EXIST, IS_SINGLETON, NOT_INITIALIZED } from './constants/errors.js'

export class StageManager {
  static #instance = null

  constructor (stage) {
    if (StageManager.#instance) {
      throw new Error(IS_SINGLETON(this.constructor.name))
    }
    this.stage = stage
    this.containers = new Map()
    StageManager.#instance = this
  }

  static getInstance () {
    if (!StageManager.#instance) {
      throw new Error(NOT_INITIALIZED(this.constructor.name))
    }
    return StageManager.#instance
  }

  addNewContainer (name) {
    if (this.containers.has(name)) {
      throw new Error(CONTAINER_ALREADY_EXISTS(name))
    }
    const container = new Container()
    this.stage.addChild(container)
    this.containers.set(name, container)
    return container
  }

  _getContainer (name) {
    const container = this.containers.get(name)
    if (!container) {
      throw new Error(CONTAINER_DOES_NOT_EXIST(name))
    }
    return container
  }

  setContainerOrder (name, index) {
    const container = this._getContainer(name)
    this.stage.setChildIndex(container, index)
  }

  setContainerVisibility (name, visible) {
    const container = this._getContainer(name)
    container.visible = visible
  }

  removeContainer (name) {
    const container = this._getContainer(name)
    this.stage.removeChild(container)
    this.containers.delete(name)
  }
}
