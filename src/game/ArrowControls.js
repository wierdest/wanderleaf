import { BaseControls } from './controls/BaseControls.js'
import { ARROW_CONTROLS, DIRECTION_MAP } from './constants/controls.js'

export class ArrowControls extends BaseControls {
  constructor (target) {
    super(target)
    this.target = target
    this.pressedKeys = new Set()
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.loop = this.loop.bind(this)
    this.pressDuration = 0
  }

  attach () {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    requestAnimationFrame(this.loop)
  }

  detach () {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  handleKeyDown (event) {
    if (!Object.values(ARROW_CONTROLS).includes(event.key)) return

    if (event.key === ARROW_CONTROLS.LEFT && this.pressedKeys.has(ARROW_CONTROLS.RIGHT)) {
      this.pressedKeys.delete(ARROW_CONTROLS.RIGHT)
    }

    if (event.key === ARROW_CONTROLS.RIGHT && this.pressedKeys.has(ARROW_CONTROLS.LEFT)) {
      this.pressedKeys.delete(ARROW_CONTROLS.LEFT)
    }

    if (event.key === ARROW_CONTROLS.UP && this.pressedKeys.has(ARROW_CONTROLS.DOWN)) {
      this.pressedKeys.delete(ARROW_CONTROLS.DOWN)
    }

    if (event.key === ARROW_CONTROLS.DOWN && this.pressedKeys.has(ARROW_CONTROLS.UP)) {
      this.pressedKeys.delete(ARROW_CONTROLS.UP)
    }

    this.pressedKeys.add(event.key)
  }

  handleKeyUp (event) {
    this.pressedKeys.delete(event.key)
    this.pressDuration = 0
    if (this.pressedKeys.size === 0) {
      this._emitStop()
    }
  }

  loop () {
    if (this.pressedKeys.size > 0) {
      this.pressDuration++
      this._emitInput()
    }
    requestAnimationFrame(this.loop)
  }

  _emitInput () {
    let dx = 0; let dy = 0
    if (this.pressedKeys.has('ArrowLeft')) dx += -1
    if (this.pressedKeys.has('ArrowRight')) dx += 1
    if (this.pressedKeys.has('ArrowUp')) dy += -1
    if (this.pressedKeys.has('ArrowDown')) dy += 1

    if (typeof this.target?.onControlInput === 'function') {
      this.target.onControlInput(dx, dy, this.pressDuration, this._getDirectionFromVector(dx, dy))
    }
  }

  _emitStop () {
    if (typeof this.target?.onControlStop === 'function') {
      this.target.onControlStop()
    }
  }

  _getDirectionFromVector (dx, dy) {
    return DIRECTION_MAP[`${dx},${dy}`] || null
  }
}
