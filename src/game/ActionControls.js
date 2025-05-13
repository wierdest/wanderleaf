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
    if (!Object.values(ACTION_KEYS).includes(event.code)) return

    this.pressedKeys.add(event.code)

    if (typeof this.target?.onActionInput === 'function') {
      this.target.onActionInput(event.code)
    }
  }

  handleKeyUp (event) {
    this.pressedKeys.delete(event.code)

    if (!Object.values(ACTION_KEYS).includes(event.code)) return

    if (typeof this.target?.onActionStop === 'function') {
      this.target.onActionStop(event.code)
    }
  }
}
