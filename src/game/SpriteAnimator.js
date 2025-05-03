import { AnimatedSprite } from 'pixi.js'
import { Direction } from './enums/Direction.js'

export class SpriteAnimator {
  constructor (container, animations, name, defaultDirection) {
    this.container = container

    this.currentDirection = defaultDirection

    this.sprites = {}
    for (const dir of Object.values(Direction)) {
      const anim = new AnimatedSprite(animations[dir])
      anim.animationSpeed = 0.1666
      anim.visible = false
      anim.scale = 0.5
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
    this.anim.visible = true
    this.anim.play()
    this.container.addChild(this.anim)
  }

  stop () {
    this.anim.stop()
    this.anim.visible = false
  }
}
