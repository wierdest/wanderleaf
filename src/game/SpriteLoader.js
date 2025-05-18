import { Assets, Spritesheet } from 'pixi.js'
import { ASSETS, ATLASES } from './constants/assets.js'
import { FAILED_TO_FETCH_MANIFEST } from './constants/errors.js'
import { BaseLoader } from './loaders/BaseLoader.js'
/**
 * Sprite Loader = loads the sprites for each state[direction].animations
 * Notice it is not a singleton
 */
export class SpriteLoader extends BaseLoader {
  async _work ({ progressCallback, entity, state, filename }) {
    if (filename && entity) {
      return await this._loadSprite(entity, filename)
    }

    if (state && entity) {
      return await this._loadAnimationAtlasesForEntityState(progressCallback, entity, state)
    }

    if (entity) {
      return await this._loadAtlasTexturesForEntity(entity)
    }
  }

  async _loadAtlasTexturesForEntity (entity) {
    const basePath = `/${ASSETS}/${entity}/${ATLASES}/`
    const manifest = await this._loadManifest(basePath)
    const file = manifest[0]
    const atlasUrl = `${basePath}${file}`
    return this._loadAtlasIntoSpritesheet(atlasUrl)
  }

  async _loadAtlasIntoSpritesheet (url) {
    const atlas = await fetch(url).then(res => res.json())
    const imagePath = new URL(atlas.meta.image, window.location.origin + url).href
    const texture = await Assets.load(imagePath)
    const spritesheet = new Spritesheet(texture, atlas)
    await spritesheet.parse()
    return spritesheet
  }

  async _loadAnimationAtlasesForEntityState (progressCallback, entity, state) {
    const basePath = `/${ASSETS}/${entity}/${state}/${ATLASES}/`
    const manifest = await this._loadManifest(basePath)
    const animations = {}

    let progress = 0.1
    const progressString = `${entity} ${state}`
    progressCallback(progressString, progress)

    const totalFiles = manifest.length

    let completedFiles = 0
    for (const file of manifest) {
      const atlasUrl = `${basePath}${file}`
      const spritesheet = await this._loadAtlasIntoSpritesheet(atlasUrl)

      for (const [key, value] of Object.entries(spritesheet.animations)) {
        animations[key] = value
      }
      completedFiles++
      progress = Math.floor((completedFiles / totalFiles) * 10) / 10
      progressCallback(progressString, progress)
    }

    progressCallback(progressString, 1)
    return animations
  }

  async _loadSprite (entity, filename) {
    const path = `/${ASSETS}/${entity}/${filename}`
    try {
      const texture = await Assets.load(path)
      return texture
    } catch (e) {
      throw new Error(`Failed to load sprite at ${path}: ${e}`)
    }
  }

  async _loadManifest (basePath) {
    const manifestUrl = `${basePath}manifest.json`
    try {
      return await fetch(manifestUrl).then(res => res.json())
    } catch (e) {
      throw new Error(`${FAILED_TO_FETCH_MANIFEST(manifestUrl)} : ${e}`)
    }
  }
}
