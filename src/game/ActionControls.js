import { ACTION_KEYS } from './constants/controls.js'
import { BaseControls } from './controls/BaseControls.js'

export class ActionControls extends BaseControls {
  constructor (target) {
    super(target)
    this.pressedKeys = new Set()
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  attach () {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  detach () {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  handleKeyDown (event) {
    const actionKey = Object.keys(ACTION_KEYS).find(key => ACTION_KEYS[key] === event.code)
    if (!actionKey) return

    this.pressedKeys.add(actionKey)

    if (typeof this.target?.onActionInput === 'function') {
      this.target.onActionInput(actionKey)
    }
  }

  handleKeyUp (event) {
    const actionKey = Object.keys(ACTION_KEYS).find(key => ACTION_KEYS[key] === event.code)
    if (!actionKey) return

    this.pressedKeys.delete(actionKey)

    if (typeof this.target?.onActionStop === 'function') {
      this.target.onActionStop(actionKey)
    }
  }
}
