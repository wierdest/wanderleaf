import { Assets, Spritesheet } from 'pixi.js'
import { ASSETS, ATLASES } from './constants/assets.js'
import { FAILED_TO_FETCH_MANIFEST } from './constants/error.js'
/**
 * Sprite Loader = loads the sprites for each state[direction].animations
 * Notice it is not a singleton
 */
export class SpriteLoader {
  static async loadAtlasTexturesForEntity (entity) {
    const basePath = `/${ASSETS}/${entity}/${ATLASES}/`
    const manifest = await this._loadManifest(basePath)
    const file = manifest[0]
    const atlasUrl = `${basePath}${file}`
    return this._loadAtlasIntoSpritesheet(atlasUrl)
  }

  static async _loadAtlasIntoSpritesheet (url) {
    const atlas = await fetch(url).then(res => res.json())
    const imagePath = new URL(atlas.meta.image, window.location.origin + url).href
    const texture = await Assets.load(imagePath)
    const spritesheet = new Spritesheet(texture, atlas)
    await spritesheet.parse()
    return spritesheet
  }

  static async loadAnimationAtlasesForEntityState (entity, state) {
    const basePath = `/${ASSETS}/${entity}/${state}/${ATLASES}/`
    const manifest = await this._loadManifest(basePath)
    const animations = {}
    for (const file of manifest) {
      const atlasUrl = `${basePath}${file}`
      const spritesheet = await this._loadAtlasIntoSpritesheet(atlasUrl)

      for (const [key, value] of Object.entries(spritesheet.animations)) {
        animations[key] = value
      }
    }

    return animations
  }

  static async loadSprite (entity, filename) {
    const path = `/${ASSETS}/${entity}/${filename}`
    try {
      const texture = await Assets.load(path)
      return texture
    } catch (e) {
      throw new Error(`Failed to load sprite at ${path}: ${e}`)
    }
  }

  static async _loadManifest (basePath) {
    const manifestUrl = `${basePath}manifest.json`
    try {
      return await fetch(manifestUrl).then(res => res.json())
    } catch (e) {
      throw new Error(`${FAILED_TO_FETCH_MANIFEST(manifestUrl)} : ${e}`)
    }
  }
}
