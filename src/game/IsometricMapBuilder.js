import { DEFAULT_LAND_TILE_TEXTURE } from './constants/assets.js'
import { TILESIZE } from './constants/dimension.js'
import { INVALID_ARGUMENT, UNDEFINED } from './constants/errors.js'
import { BiomeContext } from './mapbuilding/BiomeContext.js'
import { CoastlineEvaluator } from './mapbuilding/evaluators/CoastlineEvaluator.js'
import { LakeEvaluator } from './mapbuilding/evaluators/LakeEvaluator.js'
import { OceanEvaluator } from './mapbuilding/evaluators/OceanEvaluator.js'
import { MapBuilder } from './mapbuilding/MapBuilder.js'
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

    this.initBasicMapBiomeEvaluator(
      'ocean',
      new OceanEvaluator(
        new BiomeContext(
          this.bounds,
          ['tile101']
        )
      )
    )

    this.initBasicMapBiomeEvaluator(
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

    this.tiles = this.buildBasicMapTiles(DEFAULT_LAND_TILE_TEXTURE)

    // freeze a copy of the basic map tiles to pass to evaluators
    this.frozenTiles = this._freezeTiles()

    this.initRefinedBiomeEvaluator(
      'coastline',
      new CoastlineEvaluator(
        new BiomeContext(
          // TODO these bounds should be how broad the coastline should reach
          new Bounds(new Vector2(-2, 2), new Vector2(-2, 2)),
          Array.from({ length: 3 }, (_, i) => `tile${82 + i}`),
          ...this.frozenTiles
        )
      )
    )
  }

  async buildRefinedTiles (refinementEvaluatorName) {
    switch (refinementEvaluatorName) {
      case 'coastline':
        return await this.refine('coastline',
          (flatTiles) => flatTiles.filter((t) => t.textureId === 'tile101')
        )
      case 'highland':
        throw new Error(UNDEFINED('HighlandEvaluator', 'Ainda não implementamos!'))
      case 'vegetation':
        throw new Error(UNDEFINED('VegetationEvaluator', 'Ainda não implementamos!'))
      default:
        throw new Error(INVALID_ARGUMENT(this.constructor.name, 'refinementEvaluator'))
    }
  }
}
