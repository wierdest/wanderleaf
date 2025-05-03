import { SpriteAnimator } from './SpriteAnimator.js'
import { SpriteLoader } from './SpriteLoader.js'

/**
 *  StatesLoader: creates SpriteAnimators for all entities and states in the entityStateMapArray
 */

export class StatesLoader {
  constructor (entityStateMapArray) {
    this.entityStateMap = entityStateMapArray
  }

  async loadAllStatesForEntities () {
    const allStatesForEntities = []
    const results = await Promise.all(this.entityStateMap.map(async (item) => {
      const animators = await this._loadStates(item)
      return { entity: item.entity.name, animators }
    }))

    allStatesForEntities.push(...results)

    return allStatesForEntities
  }

  async _loadStates (entityStateMapItem) {
    const animators = []
    for (const state of entityStateMapItem.states) {
      const animations = await SpriteLoader.loadAnimationAtlasesForEntityState(entityStateMapItem.entity.name, state.name)
      animators.push(new SpriteAnimator(entityStateMapItem.entity.container, animations, state.name, state.defaultDirection))
    }
    return animators
  }
}
