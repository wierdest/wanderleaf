export class Body {
  /**
     *
     * @param {() => PIXI.Sprite } getSprite - A function to return the current sprite
     */
  constructor (getSprite) {
    if (typeof getSprite !== 'function') {
      throw new TypeError('Body expects getSprite function')
    }
    this.getSprite = getSprite
    this._x = 0
    this._y = 0
    this.weight = 1
    this.speed = 1.6
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

  move (dx, dy) {
    const sprite = this.getSprite()
    sprite.x += dx * this.speed
    sprite.y += dy * this.speed
    this._x = sprite.x
    this._y = sprite.y
  }

  refresh () {
    const sprite = this.getSprite()
    sprite.x = this._x
    sprite.y = this._y
  }
}
