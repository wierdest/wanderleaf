import { Body } from './Body.js'
import { Controllable } from './controls/Controllable.js'
import { State } from './enums/State.js'

export class Player extends Controllable {
  constructor (character, animators) {
    super()
    this.character = character
    // this code is going to be moved to the FSM!!!...
    this.animators = new Map(animators.map(a => [a.name, a]))
    this.state = State.IDLE
    this.animator = this.animators.get(this.state)
    this.body = new Body(() => this.animator.anim)
    this.body.setPosition(this.animator.app.screen.width / 2, this.animator.app.screen.height / 2)
    this.animator.play()

    this.screenWidthMargin = this.animator.app.screen.width / 5
    this.screenWidthLimit = this.animator.app.screen.width - this.animator.app.screen.width / 8
    this.screenHeightMargin = this.animator.app.screen.height / 5
    this.screenHeightLimit = this.animator.app.screen.height - this.animator.app.screen.height / 8
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
      this.changeState(State.WALK)

      if (this.canMove(dx, dy)) {
        this.body.move(dx, dy)
      }
    }
  }

  onControlStop () {
    this.changeState(State.IDLE)
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
}
