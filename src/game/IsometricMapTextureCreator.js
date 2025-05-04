import { Container, Sprite, RenderTexture } from 'pixi.js'
import { DEFAULT_LAND_TILE_TEXTURE } from './constants/assets.js'

/**
 * This creates a render texture from a tileset.
 */

export class IsometricMapTextureCreator {
  constructor (renderer, spritesheet, isoWidth, isoHeight, widthInTiles, heightInTiles, biomeEvaluators) {
    this.renderer = renderer
    this.spritesheet = spritesheet

    // TODO move building code (_createTiles and dependencies) to a Builder
    // TODO this shall be IsometricMapTextureRenderer have the Director injected ?

    this.container = new Container()

    this.isoWidth = isoWidth
    this.isoHeight = isoHeight

    this.widthInTiles = widthInTiles
    this.heightInTiles = heightInTiles

    this.biomeEvaluators = biomeEvaluators
  }

  create (defaultLandTile = DEFAULT_LAND_TILE_TEXTURE) {
    this._createTiles(defaultLandTile)

    const bounds = this.container.getLocalBounds()

    this.container.x = -bounds.x
    this.container.y = -bounds.y

    const renderTexture = RenderTexture.create({
      width: bounds.width,
      height: bounds.height
    })

    this.renderer.render({ container: this.container, target: renderTexture })

    return renderTexture
  }

  _createTiles (defaultTile) {
    for (let y = -this.heightInTiles; y < this.heightInTiles; y++) {
      for (let x = -this.widthInTiles; x < this.widthInTiles; x++) {
        const tileTextureId = this._getTileTextureId(x, y) || defaultTile

        const tile = new Sprite(this.spritesheet.textures[tileTextureId])

        // stagger offset
        const offsetX = x * this.isoWidth
        const offsetY = y * (this.isoHeight * 0.25) + this.isoHeight

        // stagger odd rows by shifting their X position
        if (y % 2 !== 0) {
          tile.x = offsetX + this.isoWidth / 2
        } else {
          tile.x = offsetX
        }

        tile.y = offsetY

        this.container.addChild(tile)
      }
    }
  }

  _getTileTextureId (x, y) {
    for (const evaluator of this.biomeEvaluators) {
      const textureId = evaluator.evaluate(x, y)
      if (textureId) return textureId
    }
  }
}
