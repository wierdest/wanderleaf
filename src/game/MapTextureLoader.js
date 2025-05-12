import { IsometricMapTextureRenderer } from './IsometricMapTextureRenderer.js'
import { BaseLoader } from './loaders/BaseLoader.js'
import { SpriteLoader } from './SpriteLoader.js'

export class MapTextureLoader extends BaseLoader {
  constructor (renderer, tiles) {
    super()
    this.tiles = tiles
    this.renderer = renderer
    this.spriteLoader = new SpriteLoader()
  }

  async _work ({ progressCallback }) {
    const spritesheet = await this.spriteLoader.load({ entity: 'map' })
    const isometricMapTextureRenderer = new IsometricMapTextureRenderer(this.renderer, spritesheet, this.tiles)
    const texture = isometricMapTextureRenderer.render()
    progressCallback('Carregou textura do mapa!', 1)
    return texture
  }
}
