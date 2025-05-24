import { MapDirector } from './mapbuilding/MapDirector.js'

export class IsometricMapDirector extends MapDirector {
  async construct () {
    this.updateProgress = this.updateProgress.bind(this)
    this.updateProgress('Iniciando construção...', 0)

    this.builder.init()

    this.builder.buildBasicMap(this.updateProgress)

    this.updateProgress('Construiu mapa básico!', 0.95)

    return this.builder.tiles
  }

  async refine () {
    this.builder.buildRefinedMap(this.updateProgress)

    this.updateProgress('Refinamento do mapa concluído!', 1)
  }
}
