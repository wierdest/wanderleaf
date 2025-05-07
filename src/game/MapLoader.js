import { IsometricMapBuilder } from './IsometricMapBuilder.js'
import { IsometricMapTextureRenderer } from './IsometricMapTextureRenderer.js'
import { BaseLoader } from './loaders/BaseLoader.js'
import { BiomeContext } from './mapbuilding/BiomeContext.js'
import { LakeEvaluator } from './mapbuilding/LakeEvaluator.js'
import { OceanEvaluator } from './mapbuilding/OceanEvaluator.js'
import { SpriteLoader } from './SpriteLoader.js'
import { Vector2 } from './math/Vector2.js'
import { Bounds } from './math/Bounds.js'

export class MapLoader extends BaseLoader {
  constructor (renderer, size) {
    super()
    this.size = size
    this.renderer = renderer
  }

  async _work (progressCallback) {
    progressCallback(0.1)

    // TODO this code should come from a Director
    const builder = new IsometricMapBuilder(this.size)

    builder.init()

    const spritesheet = await SpriteLoader.loadAtlasTexturesForEntity('map')

    progressCallback(0.4)

    // Build ocean
    builder.initBiomeEvaluator(
      'ocean',
      new OceanEvaluator(
        new BiomeContext(
          builder.bounds,
          ['tile101', ...Array.from({ length: 3 }, (_, i) => `tile${82 + i}`)]
        )
      ))

    progressCallback(0.5)

    // Build a lake
    builder.initBiomeEvaluator(
      'lake',
      new LakeEvaluator(
        new BiomeContext(
          new Bounds(new Vector2(-18, -14)),
          ['tile104'],
          18,
          1
        )
      )
    )

    progressCallback(0.7)

    const mapTiles = builder.buildTiles()

    const isometricMapTextureRenderer = new IsometricMapTextureRenderer(this.renderer, spritesheet, mapTiles)

    const mapRenderTexture = isometricMapTextureRenderer.render()

    progressCallback(1.0)

    return mapRenderTexture
  }
}
