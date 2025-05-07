import { TILESIZE } from './constants/dimension.js'
import { BiomeContext } from './mapbuilding/BiomeContext.js'
import { LakeEvaluator } from './mapbuilding/LakeEvaluator.js'
import { MapBuilder } from './mapbuilding/MapBuilder.js'
import { OceanEvaluator } from './mapbuilding/OceanEvaluator.js'
import { Bounds } from './math/Bounds.js'
import { Vector2 } from './math/Vector2.js'

export class IsometricMapBuilder extends MapBuilder {
  init () {
    this.tileWidth = TILESIZE * Math.sqrt(3) / 2
    this.tileHeight = TILESIZE

    this.widthInTiles = Math.ceil(this.screenWidth * 1.5 / this.tileWidth) + 4
    this.heightInTiles = Math.ceil(this.screenHeight * 1.5 / this.tileHeight) + 4

    this.heightInTiles *= 2

    this.bounds = new Bounds(
      new Vector2(-this.widthInTiles, this.widthInTiles),
      new Vector2(-this.heightInTiles, this.heightInTiles)
    )
  }

  initBiomeEvaluators () {
    const oceanContext = new BiomeContext(this.bounds, ['tile101', ...Array.from({ length: 3 }, (_, i) => `tile${82 + i}`)])
    const oceanEvaluator = new OceanEvaluator(oceanContext)
    this.biomeEvaluators.push(oceanEvaluator)

    const lakeBounds = new Bounds(new Vector2(-18, -14))
    const lakeContext = new BiomeContext(lakeBounds, ['tile104'], 18, 1)
    const lakeEvaluator = new LakeEvaluator(lakeContext)
    this.biomeEvaluators.push(lakeEvaluator)
  }
}
