import { SpriteAnimator } from './SpriteAnimator.js'
import { SpriteLoader } from './SpriteLoader.js'

/**
 *  StatesLoader: creates SpriteAnimators for all entities and states in the entityStateMapArray
 */

export class StatesLoader {
  constructor (app, entityStateMapArray) {
    this.app = app
    this.entitityStateMap = entityStateMapArray
  }

  async loadAllStatesForEntities () {
    const allStatesForEntities = []
    const results = await Promise.all(this.entitityStateMap.map(async (item) => {
      const animators = await this._loadStates(item)
      return { entity: item.entity, animators }
    }))

    allStatesForEntities.push(...results)

    return allStatesForEntities
  }

  async _loadStates (entityStateMapItem) {
    const animators = []
    for (const state of entityStateMapItem.states) {
      const animations = await SpriteLoader.loadAnimationAtlasesForEntityState(entityStateMapItem.entity, state.name)
      animators.push(new SpriteAnimator(this.app, animations, state.name, state.defaultDirection))
    }
    return animators
  }
}
