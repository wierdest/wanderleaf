import { DEFAULT_LAND_TILE_TEXTURE, OCEAN_WATER } from './constants/assets.js'
import { TILESIZE } from './constants/dimension.js'
import { INVALID_ARGUMENT, UNDEFINED } from './constants/errors.js'
import { BiomeContext } from './mapbuilding/BiomeContext.js'
import { SoftCoastlineEvaluator } from './SoftCoastlineEvaluator.js'
import { LakeEvaluator } from './LakeEvaluator.js'
import { OceanEvaluator } from './OceanEvaluator.js'
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
          this.bounds
        )
      )
    )

    this.initBasicMapBiomeEvaluator(
      'lake',
      new LakeEvaluator(
        new BiomeContext(
          new Bounds(new Vector2(-18, -14)),
          18,
          1
        )
      )
    )

    this.tiles = this.buildBasicMapTiles(DEFAULT_LAND_TILE_TEXTURE)
    this.primeMeridian = this.tiles[0].length / 2
    this.equator = this.tiles.length / 2

    // freeze a copy of the basic map tiles to pass to evaluators
    this.frozenTiles = this._freezeTiles()

    this.initRefinedBiomeEvaluator(
      'soft-coast',
      new SoftCoastlineEvaluator(
        new BiomeContext(
          undefined,
          this.frozenTiles
        )
      )
    )
  }

  async buildRefinedTiles (mapRegion) {
    switch (mapRegion) {
      case 'northwestern-coast':
        return await this.refine(
          'soft-coast',
          (flatTiles) => this._filterNorthwesternOcean(flatTiles),
          { yDir: 1 }
        )
      case 'northeastern-coast':
        return await this.refine(
          'soft-coast',
          (flatTiles) => this._filterNortheasternOcean(flatTiles),
          { xDir: -1 }
        )
      case 'vegetation':
        throw new Error(UNDEFINED('VegetationEvaluator', 'Ainda não implementamos!'))
      default:
        throw new Error(INVALID_ARGUMENT(this.constructor.name, 'refinementEvaluator'))
    }
  }

  _filterNorthwesternOcean (flatTiles) {
    return flatTiles.filter((t) => t.textureId === OCEAN_WATER && t.grid.x < this.primeMeridian / 4 && t.grid.y < this.equator)
  }

  _filterSouthwesternOcean (flatTiles) {
    return flatTiles.filter((t) => t.textureId === OCEAN_WATER && t.grid.x < this.primeMeridian / 4 && t.grid.y > this.equator)
  }

  _filterNortheasternOcean (flatTiles) {
    return flatTiles.filter((t) => t.textureId === OCEAN_WATER && t.grid.x > this.primeMeridian * 1.5 && t.grid.y < this.equator
    )
  }

  _filterSoutheasternOcean (flatTiles) {
    return flatTiles.filter((t) => t.textureId === OCEAN_WATER && t.grid.x > this.primeMeridian * 1.5 && t.grid.y > this.equator
    )
  }
}
