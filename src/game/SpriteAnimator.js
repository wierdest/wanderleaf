import { AnimatedSprite } from 'pixi.js'
import { DIRECTION } from './constants/controls.js'

export class SpriteAnimator {
  constructor (container, animations, name, defaultDirection, noLoop) {
    this.container = container

    this.currentDirection = defaultDirection

    this.sprites = {}
    for (const dir of Object.values(DIRECTION)) {
      const anim = new AnimatedSprite(animations[dir])
      anim.animationSpeed = 0.1666
      anim.visible = false
      anim.scale = 0.5
      anim.loop = !noLoop
      this.sprites[dir] = anim
      this.container.addChild(anim)
    }

    this.anim = this.sprites[this.currentDirection]

    this.name = name
  }

  hasDirectionChange (newDirection) {
    return this.currentDirection !== newDirection
  }

  face (newDirection) {
    if (!this.hasDirectionChange(newDirection)) {
      return
    }
    this.sprites[this.currentDirection].visible = false
    this.currentDirection = newDirection
    this.anim = this.sprites[this.currentDirection]
    this.anim.visible = true
    this.anim.play()
  }

  play () {
    this.anim.currentFrame = 0
    this.anim.visible = true
    this.anim.play()
  }

  stop () {
    this.anim.stop()
    this.anim.visible = false
  }
}
