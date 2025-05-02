import { FillGradient, Graphics } from 'pixi.js'

export class LoadingBar {
  constructor (app, x, y, width, height) {
    this.app = app

    this.fullWidth = width

    this.background = new Graphics()
      .rect(0, 0, width, height)
      .fill('white')
      .stroke({ color: 'black', width: 2 })

    this.background.position.set(x, y)

    const foregroundGradient = new FillGradient({
      type: 'linear',
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
      colorStops: [
        { offset: 0, color: 'yellow' },
        { offset: 1, color: 'green' }
      ]
    })

    this.foreground = new Graphics()
      .rect(0, 0, width, height)
      .fill(foregroundGradient)
    this.foreground.position.set(x, y)

    this.app.stage.addChild(this.background)
    this.app.stage.addChild(this.foreground)
  }

  update (progress) {
    this.foreground.width = this.fullWidth * progress
  }

  destroy () {
    this.app.stage.removeChild(this.background)
    this.app.stage.removeChild(this.foreground)
    this.foregroundGradient.destroy()
    this.foreground.destroy()
    this.background.destroy()
  }
}
