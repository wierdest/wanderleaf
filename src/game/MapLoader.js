import { TILESIZE } from './constants/dimension.js'
import { IsometricMapTextureCreator } from './IsometricMapTextureCreator.js'
import { BaseLoader } from './loaders/BaseLoader.js'
import { BiomeContext } from './mapbuilding/BiomeContext.js'
import { LakeEvaluator } from './mapbuilding/LakeEvaluator.js'
import { OceanEvaluator } from './mapbuilding/OceanEvaluator.js'
import { Bounds } from './math/Bounds.js'
import { Vector2 } from './math/Vector2.js'
import { SpriteLoader } from './SpriteLoader.js'

export class MapLoader extends BaseLoader {
  constructor (renderer, size) {
    super()
    this.screenWidth = size.x
    this.screenHeight = size.y
    this.renderer = renderer
  }

  async _work (progressCallback) {
    progressCallback(0.1)
    // TODO this code should be inside an injected Director, coming from a Builder.
    const isoWidth = TILESIZE * Math.sqrt(3) / 2
    const isoHeight = TILESIZE

    const widthInTiles = Math.ceil(this.screenWidth * 1.5 / isoWidth) + 4
    const heightInTiles = Math.ceil(this.screenHeight * 1.5 / isoHeight) + 4
    const oceanBounds = new Bounds(
      new Vector2(-widthInTiles, widthInTiles),
      new Vector2(-heightInTiles * 2, heightInTiles * 2)
    )
    const spritesheet = await SpriteLoader.loadAtlasTexturesForEntity('map')
    progressCallback(0.4)

    const biomeEvaluators = []
    const oceanContext = new BiomeContext(oceanBounds, ['tile101', ...Array.from({ length: 3 }, (_, i) => `tile${82 + i}`)])
    const oceanEvaluator = new OceanEvaluator(oceanContext)
    biomeEvaluators.push(oceanEvaluator)

    const lakeBounds = new Bounds(new Vector2(-18, -14))
    const lakeContext = new BiomeContext(lakeBounds, ['tile104'], 18, 1)
    const lakeEvaluator = new LakeEvaluator(lakeContext)
    biomeEvaluators.push(lakeEvaluator)

    progressCallback(0.7)

    const isometricMapTextureCreator = new IsometricMapTextureCreator(
      this.renderer,
      spritesheet,
      isoWidth,
      isoHeight,
      widthInTiles,
      heightInTiles * 2,
      biomeEvaluators
    )

    const mapRenderTexture = isometricMapTextureCreator.create()
    progressCallback(1.0)

    return mapRenderTexture
  }
}
