import { Body } from './Body.js'
import { Controllable } from './controls/Controllable.js'
import { STATE } from './constants/states.js'
import { DIRECTION } from './constants/controls.js'

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
    this.direction = DIRECTION.DOWN
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
      if (this.state === STATE.JUMP) {
        this.body.jump()
      }
      if (this.state === STATE.IDLE) {
        this.hasAppliedJumpFrame10 = false
        this.hasAppliedJumpFrame5 = false
      }
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
      const isRunning = this.actionState === STATE.RUN
      const isRunningJumping = this.actionState === STATE.RUNNINGJUMP
      const runState = isRunningJumping ? STATE.RUNNINGJUMP : STATE.RUN
      this.changeState(isRunning || isRunningJumping ? runState : STATE.WALK)

      if (this.canMove(dx, dy)) {
        this.body.move(dx, dy, isRunning || isRunningJumping)
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
    if (this.state === STATE.RUN && key === 'JUMP') {
      this.actionState = STATE.RUNNINGJUMP
      return
    }

    this.actionState = STATE[`${key}`]
    // Only allow jump if in IDLE
    if (this.state === STATE.IDLE) {
      if (
        this.actionState === STATE.JUMP ||
        this.actionState === STATE.MELEE
      ) {
        return this.changeState(this.actionState)
      }
    }

    if (this.state === STATE.IDLE && this.actionState === STATE.MELEE) {
      return this.changeState(this.actionState)
    }
  }

  onActionStop (key) {
    if (key === 'JUMP') return

    this.actionState = STATE.EMPTY

    if (key === 'MELEE') {
      this.changeState(STATE.IDLE)
    }
  }

  update () {
    if (this.state === STATE.JUMP) {
      if (!this.hasAppliedJumpFrame5 && this.animator.anim.currentFrame === 5) {
        this.hasAppliedJumpFrame5 = true
      }

      if (!this.hasAppliedJumpFrame10 && this.animator.anim.currentFrame === 10) {
        this.hasAppliedJumpFrame10 = true
        this.changeState(STATE.IDLE)
      }
    }

    if (this.state === STATE.RUNNINGJUMP) {
      if (this.animator.anim.currentFrame === 7) {
        this.actionState = STATE.RUN
        this.changeState(STATE.RUN)
      }
    }

    return { shouldJump: this.hasAppliedJumpFrame5 }
  }
}
