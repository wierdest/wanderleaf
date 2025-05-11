import { FillGradient, Graphics, Text } from 'pixi.js'

export class LoadingBar {
  constructor ({ container, pos, size, textStyle }) {
    this.container = container

    const width = size.x
    const height = size.y

    this.x = pos.x
    const y = pos.y

    this.fullWidth = width

    this.background = new Graphics()
      .rect(0, 0, width, height)
      .fill('white')
      .stroke({ color: 'black', width: 2 })

    this.background.position.set(this.x, y)

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

    this.foreground.position.set(this.x, y)

    this.message = new Text({
      text: 'Carregando...',
      textStyle
    })

    this.message.x = (this.x + width / 2) - this.message.width / 2
    this.message.y = (y - height - this.message.height)

    this.percentage = new Text({
      text: '',
      textStyle
    })

    this.percentage.x = (this.x + width / 2) - this.percentage.width / 2
    this.percentage.y = this.message.y + this.message.height / 2 + 7

    this.currentMessage = ''
    this.typedCount = 0
    this.typingSpeed = 1

    this.container.addChild(this.message)
    this.container.addChild(this.percentage)
    this.container.addChild(this.background)
    this.container.addChild(this.foreground)
  }

  update (message, progress) {
    this.foreground.width = this.fullWidth * progress
    this.percentage.text = `${Math.round(progress * 100)}`
    this.setMessage(message)
    this.updateTyping()
  }

  setMessage(message) {
    if (message !== this.currentMessage) {
      this.currentMessage = message
      this.typedCount = 0
      this.message.text = ''
    }
  }

  updateTyping() {
    if (this.typedCount < this.currentMessage.length) {
      this.typedCount += this.typingSpeed
      const shown = this.currentMessage.slice(0, Math.floor(this.typedCount))
      this.message.text = shown
      this.message.x = (this.x + this.fullWidth / 2) - this.message.width / 2
    }
  }

  destroy () {
    this.container.removeChild(this.background)
    this.container.removeChild(this.foreground)
    this.foregroundGradient.destroy()
    this.foreground.destroy()
    this.background.destroy()
  }
}
