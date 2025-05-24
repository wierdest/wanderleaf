import { TILESIZE } from './constants/dimension.js'
import { BiomeContext } from './mapbuilding/BiomeContext.js'
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

    this.basicMapSteps = [
      {
        label: 'Construindo oceano...',
        fn: () => {
          this.initBiomeEvaluator(
            'ocean',
            new OceanEvaluator(
              new BiomeContext(
                this.bounds,
                ['tile101', ...Array.from({ length: 3 }, (_, i) => `tile${82 + i}`)]
              )
            )
          )
        }
      },
      {
        label: 'Construindo lago...',
        fn: () => {
          this.initBiomeEvaluator(
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
        }
      },
      {
        label: 'Finalizando tiles...',
        fn: () => {
          this.tiles = this.buildTiles()
        }
      }
    ]

    this.refinementSteps = [
      {
        label: 'Aplicando litoral...',
        fn: this.applyCoastline.bind(this)
      },
      {
        label: 'Aplicando terras altas...',
        fn: this.applyHighlands.bind(this)
      },
      {
        label: 'Aplicando vegetação...',
        fn: this.applyVegetation.bind(this)
      }
    ]
  }

  buildBasicMap (progressCallback) {
    const totalSteps = this.basicMapSteps.length
    for (let i = 0; i < totalSteps; i++) {
      this.basicMapSteps[i].fn()
      const progress = (i + 1) / (totalSteps + 1)
      progressCallback(this.basicMapSteps[i].label, progress)
    }
  }

  async buildRefinedMap (progressCallback) {
    const totalSteps = this.refinementSteps.length
    for (let i = 0; i < totalSteps; i++) {
      const step = this.refinementSteps[i]
      const progress = 0.1 + (0.2 * (i + 1)) / (totalSteps + 1)
      progressCallback(step.label, progress)
      await step.fn()
    }
  }

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
