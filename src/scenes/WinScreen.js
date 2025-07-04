import Phaser from 'phaser'
import CONFIG from '../config.js'

class WinScreen extends Phaser.Scene {
  init () {
    this.loadingText = this.add.text(
      CONFIG.DEFAULT_WIDTH / 2,
      CONFIG.DEFAULT_HEIGHT / 2,
      'Loading ...', { font: '16pt Arial', color: '#FFFFFF', align: 'center' }
    )
    this.loadingText.setOrigin(0.5, 0.5)
  }

  preload () {
    // Load the image assets needed for THIS scene
    this.load.image('background', 'assets/skies/background.png')
  }

  create () {
    this.canContinue = false
    this.timer = this.time.addEvent({ callback: this.onTimerEnd, delay: 2000 })
    // this.timedEvent = this.time.delayedCall(3000, this.onEvent, [], this);

    // Remove loading text
    this.loadingText.destroy()

    // Add background image
    const winScreen = this.add.image(CONFIG.DEFAULT_WIDTH / 2, CONFIG.DEFAULT_HEIGHT / 2, 'background')
    winScreen.setScale(
      CONFIG.DEFAULT_WIDTH / winScreen.width,
      CONFIG.DEFAULT_HEIGHT / winScreen.height
    )
    this.winText = this.add.text(
      CONFIG.DEFAULT_WIDTH / 2,
      CONFIG.DEFAULT_HEIGHT / 2,
      'You Win!', { font: '32pt Arial', color: '#000000', align: 'center' }
    )
    this.winText.setOrigin(0.5, 0.5)

    this.input.keyboard.on('keyup', this.keyReleased, this)
  }

  keyReleased () {
    if (WinScreen.canContinue) {
      // console.log('Key released')
      this.scene.start('MainMenu')
      WinScreen.canContinue = false
      // this.music.stop()
    }
  }

  onTimerEnd () {
    WinScreen.canContinue = true
  }
}

export default WinScreen
