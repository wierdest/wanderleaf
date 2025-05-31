import { MapDirector } from './mapbuilding/MapDirector.js'

export class IsometricMapDirector extends MapDirector {
  async construct () {
    this.updateProgress = this.updateProgress.bind(this)
    this.updateProgress('Iniciando construção...', 0)

    this.builder.init()

    this.updateProgress('Construiu mapa básico!', 0.95)

    return this.builder.tiles
  }

  async refine (refinementEvaluatorName) {
    await this.builder.buildRefinedTiles(refinementEvaluatorName)
    this.updateProgress(`Estágio de refinamento concluído: ${refinementEvaluatorName}`, 1)
    return this.builder.tiles
  }
}
