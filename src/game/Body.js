import { INVALID_ARGUMENT } from './constants/errors.js'
import { GRAVITY, JUMP_STRENGTH, SPEED } from './constants/physics.js'

export class Body {
  /**
     *
     * @param {() => PIXI.Sprite } getSprite - A function to return the current sprite
     */
  constructor (getSprite) {
    if (typeof getSprite !== 'function') {
      throw new TypeError(INVALID_ARGUMENT(super.constructor.name, 'getSprite'))
    }
    this.getSprite = getSprite
    this._x = 0
    this._y = 0
    this.weight = 1
    this.speed = SPEED
    this.walkSpeed = this.speed
    this.runningSpeed = this.speed * 2

    this.verticalVelocity = 0
    this.gravity = GRAVITY
    this._groundY = this._y
    this.jumpStrength = JUMP_STRENGTH
    this.hasJumped = false
    this.isJumping = false
  }

  setPosition (x, y) {
    this._x = x
    this._y = y
    const sprite = this.getSprite()
    sprite.x = x
    sprite.y = y
  }

  getPosition () {
    const sprite = this.getSprite()
    return { x: sprite.x, y: sprite.y }
  }

  move (dx, dy, isRunning) {
    const sprite = this.getSprite()
    const speed = isRunning ? this.runningSpeed : this.walkSpeed
    sprite.x += dx * speed
    sprite.y += dy * speed
    this._x = sprite.x
    this._y = sprite.y
  }

  refresh () {
    const sprite = this.getSprite()
    sprite.x = this._x
    sprite.y = this._y
  }

  jump () {
    this.hasJumped = false
    if (!this.isJumping) {
      this.verticalVelocity = -this.jumpStrength
      this.isJumping = true
      this._groundY = this._y
    }
  }

  update (shouldJump) {
    if (shouldJump && !this.hasJumped) {
      const sprite = this.getSprite()
      this.verticalVelocity += this.gravity
      sprite.y += this.verticalVelocity

      if (sprite.y >= this._groundY) {
        this._y = this._groundY
        sprite.y = this._y
        this.verticalVelocity = 0
        this.hasJumped = true
        this.isJumping = false
      }
    }
  }
}
