import { BaseLoader } from './loaders/BaseLoader.js'
import { SpriteAnimator } from './SpriteAnimator.js'
import { SpriteLoader } from './SpriteLoader.js'

/**
 *  StatesLoader: creates SpriteAnimators for all entities and states in the entityStateMapArray
 */

export class StatesLoader extends BaseLoader {
  constructor (entityStateMapArray) {
    super()
    this.entityStateMap = entityStateMapArray
    this.spriteLoader = new SpriteLoader()
  }

  async _work ({ progressCallback }) {
    return await this.loadAllStatesForEntities(progressCallback)
  }

  async loadAllStatesForEntities (progressCallback) {
    const allStatesForEntities = []
    const results = await Promise.all(this.entityStateMap.map(async (item) => {
      const animators = await this._loadStates(progressCallback, item)
      return { entity: item.entity.name, animators }
    }))

    allStatesForEntities.push(...results)

    return allStatesForEntities
  }

  async _loadStates (progressCallback, entityStateMapItem) {
    const animators = []
    for (const state of entityStateMapItem.states) {
      const animations = await this.spriteLoader.load({ progressCallback, entity: entityStateMapItem.entity.name, state: state.name })
      animators.push(new SpriteAnimator(entityStateMapItem.entity.container, animations, state.name, state.defaultDirection))
    }
    return animators
  }
}
