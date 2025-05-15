import { Body } from './Body.js'
import { Controllable } from './controls/Controllable.js'
import { STATE } from './constants/state.js'

export class Player extends Controllable {
  constructor (character, animators, initialPosition, bounds) {
    super()
    this.character = character
    // this code is going to be moved to the FSM!!!...
    this.animators = new Map(animators.map(a => [a.name, a]))
    this.state = STATE.IDLE
    this.actionState = STATE.EMPTY
    this.animator = this.animators.get(this.state)
    this.body = new Body(() => this.animator.anim)
    this.body.setPosition(initialPosition.x, initialPosition.y)
    this.animator.play()

    this.screenWidthMargin = bounds.getMinX()
    this.screenWidthLimit = bounds.getMaxX()
    this.screenHeightMargin = bounds.getMinY()
    this.screenHeightLimit = bounds.getMaxY()
  }

  changeState (newState) {
    if (this.state !== newState) {
      this.animator.stop()
      this.state = newState
      this.animator = this.animators.get(this.state)
      this.animator.face(this.direction)
      if (this.animator.hasDirectionChange()) {
        this.body.refresh()
      }
      this.animator.play()
    }
  }

  onControlInput (dx, dy, pressDuration, direction) {
    // player is a controllable and should decide what to do with it
    this.direction = direction
    if (this.direction) {
      this.animator.face(this.direction)
      if (this.animator.hasDirectionChange()) {
        this.body.refresh()
      }
    }

    if (pressDuration > this.getMovementThreshold()) {
      this.changeState(STATE.WALK)

      if (this.canMove(dx, dy)) {
        this.body.move(dx, dy)
      }
    }
  }

  onControlStop () {
    this.changeState(STATE.IDLE)
  }

  getMovementThreshold () {
    return this.body.weight
  }

  canMove (dx, dy) {
    const { x, y } = this.body.getPosition()
    const speed = this.body.speed
    const newX = x + dx * speed
    const newY = y + dy * speed

    return (
      newX > this.screenWidthMargin &&
            newX < this.screenWidthLimit &&
            newY > this.screenHeightMargin &&
            newY < this.screenHeightLimit
    )
  }

  onActionInput (key) {
    // TODO implement this for real
    console.log(`Pressionou a tecla ${key}`)
    this.actionState = STATE[`${key}`]
  }

  onActionStop (key) {
    // TODO implement this fr
    console.log(`Largou a tecla ${key}`)
    this.actionState = STATE.EMPTY
  }
}
