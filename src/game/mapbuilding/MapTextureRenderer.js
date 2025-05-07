import { AbstractRenderer, Container } from 'pixi.js'
import { INVALID_ARGUMENT, IS_ABSTRACT, NOT_IMPLEMENTED } from '../constants/error.js'

export class MapTextureRenderer {
  constructor (renderer, spritesheet, tiles) {
    if (!(renderer instanceof AbstractRenderer)) {
      throw new Error(INVALID_ARGUMENT(this.constructor.name, `renderer: ${typeof context}`))
    }
    if (new.target === MapTextureRenderer) {
      throw new Error(IS_ABSTRACT(this.constructor.name))
    }
    this.renderer = renderer
    this.spritesheet = spritesheet
    this.mapTiles = tiles
    this.container = new Container()
  }

  render () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'render'))
  }

  _fillTextureContainer () {
    throw new Error(NOT_IMPLEMENTED(this.constructor.name, 'render'))
  }
}
