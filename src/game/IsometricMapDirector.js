import { BiomeContext } from './mapbuilding/BiomeContext.js'
import { LakeEvaluator } from './mapbuilding/LakeEvaluator.js'
import { MapDirector } from './mapbuilding/MapDirector.js'
import { OceanEvaluator } from './mapbuilding/OceanEvaluator.js'
import { Bounds } from './math/Bounds.js'
import { Vector2 } from './math/Vector2.js'

export class IsometricMapDirector extends MapDirector {
  construct () {
    this.updateProgress(0.2)

    this.builder.init()

    this.updateProgress(0.3)

    // Build ocean
    this.builder.initBiomeEvaluator(
      'ocean',
      new OceanEvaluator(
        new BiomeContext(
          this.builder.bounds,
          ['tile101', ...Array.from({ length: 3 }, (_, i) => `tile${82 + i}`)]
        )
      )
    )

    this.updateProgress(0.5)

    // Build a lake
    this.builder.initBiomeEvaluator(
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

    this.updateProgress(0.7)

    // Build and return tiles
    this.tiles = this.builder.buildTiles()

    // At this point, tiles is a basic organization of the map, now it's time to start refining it
    // we need to start asynchronous work on it

    return this.tiles
  }

  async refine () {
    const refinementSteps = [
      this.applyCoastline.bind(this),
      this.applyHighlands.bind(this),
      this.applyVegetation.bind(this)
    ]
    for (let i = 0; i < refinementSteps.length; i++) {
      await refinementSteps[i]()
      const progress = 0.8 + (0.2 * (i + 1)) / refinementSteps.length
      this.updateProgress(progress)
    }

    console.log('Refinement complete')
  }

  // These are all stubs, we are going to implement it for real later

  async applyCoastline () {
    // TODO really implement this
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Aplicou ajuste adicionando costa')
        resolve()
      }, 1000)
    })
  }

  async applyHighlands () {
    // TODO really implement this
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Imagine que terminou de aplicar ajuste adicionando planaltos e aŕeas elevadas')
        resolve()
      }, 2000)
    })
  }

  async applyVegetation () {
    // TODO really implement this
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Imagine que terminou de aplicar ajuste adicionando vegetação')
        resolve()
      }, 3000)
    })
  }
}
