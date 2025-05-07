import { Sprite, RenderTexture } from 'pixi.js'
import { MapTextureRenderer } from './mapbuilding/MapTextureRenderer.js'

/**
 * This creates a render texture from a tileset.
 */

export class IsometricMapTextureRenderer extends MapTextureRenderer {
  render () {
    this._fillTextureContainer()
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

  _fillTextureContainer () {
    for (const row of this.mapTiles) {
      for (const tile of row) {
        const sprite = new Sprite(this.spritesheet.textures[tile.textureId])

        const offsetX = tile.pos.x * tile.size.x
        const offsetY = tile.pos.y * (tile.size.y * 0.25) + tile.size.y

        if (tile.pos.y % 2 !== 0) {
          sprite.x = offsetX + tile.size.x / 2
        } else {
          sprite.x = offsetX
        }
        sprite.y = offsetY
        this.container.addChild(sprite)
      }
    }
  }
}
