import { IsometricMapBuilder } from './IsometricMapBuilder.js'
import { IsometricMapTextureRenderer } from './IsometricMapTextureRenderer.js'
import { BaseLoader } from './loaders/BaseLoader.js'

import { SpriteLoader } from './SpriteLoader.js'
import { IsometricMapDirector } from './IsometricMapDirector.js'

export class MapLoader extends BaseLoader {
  constructor (renderer, size) {
    super()
    this.size = size
    this.renderer = renderer
  }

  async _work (progressCallback) {
    progressCallback(0.1)

    // TODO this code should come from a Director
    const spritesheet = await SpriteLoader.loadAtlasTexturesForEntity('map')

    const builder = new IsometricMapBuilder(this.size)

    const director = new IsometricMapDirector(builder, progressCallback)

    const basicMapTiles = director.construct()

    const isometricMapTextureRenderer = new IsometricMapTextureRenderer(this.renderer, spritesheet, basicMapTiles)

    const mapRenderTexture = isometricMapTextureRenderer.render()

    await director.refine().then(() => {
      console.log('O mapa terminou de ser renderizado com todos os refinamentos')
    })


    progressCallback(1.0)

    return mapRenderTexture
  }
}
