import { BiomeContext } from './mapbuilding/BiomeContext.js'
import { LakeEvaluator } from './mapbuilding/LakeEvaluator.js'
import { MapDirector } from './mapbuilding/MapDirector.js'
import { OceanEvaluator } from './mapbuilding/OceanEvaluator.js'
import { Bounds } from './math/Bounds.js'
import { Vector2 } from './math/Vector2.js'

export class IsometricMapDirector extends MapDirector {
  async construct () {
    this.updateProgress('Iniciando construção...', 0)

    this.builder.init()

    const buildSteps = [
      {
        label: 'Construindo oceano...',
        fn: () => {
          this.builder.initBiomeEvaluator(
            'ocean',
            new OceanEvaluator(
              new BiomeContext(
                this.builder.bounds,
                ['tile101', ...Array.from({ length: 3 }, (_, i) => `tile${82 + i}`)]
              )
            )
          )
        }
      },
      {
        label: 'Construindo lago...',
        fn: () => {
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
        }
      },
      {
        label: 'Finalizando tiles...',
        fn: () => {
          this.tiles = this.builder.buildTiles()
        }
      }
    ]

    const totalSteps = buildSteps.length
    for (let i = 0; i < totalSteps; i++) {
      buildSteps[i].fn()
      const progress = (i + 1) / (totalSteps + 1)
      this.updateProgress(buildSteps[i].label, progress)
      // await new Promise(resolve => setTimeout(resolve, 400))
    }

    this.updateProgress('Construiu mapa básico!', 0.95)

    return this.tiles
  }

  async refine () {
    const refinementSteps = [
      this.applyCoastline.bind(this),
      this.applyHighlands.bind(this),
      this.applyVegetation.bind(this)
    ]
    for (let i = 0; i < refinementSteps.length; i++) {
      const progress = 0.1 + (0.2 * (i + 1)) / refinementSteps.length
      this.updateProgress('Refinando mapa...', progress)
      await refinementSteps[i]()
    }

    this.updateProgress('Refinamento do mapa concluído!', 1)
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
