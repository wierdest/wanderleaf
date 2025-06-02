import { BiomeEvaluator } from './mapbuilding/BiomeEvaluator.js'

export class HighlandEvaluator extends BiomeEvaluator {
  constructor (biomeContext, type) {
    super(biomeContext, type)
    this.mapTiles = this.biomeContext.args[0]
    this.height = this.mapTiles.length
    this.width = this.mapTiles[0].length
  }

  evaluate (tile) {
    
  }
}
