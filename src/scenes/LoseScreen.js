import Phaser from 'phaser'
import CONFIG from '../config.js'

class LoseScreen extends Phaser.Scene {
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
    // const winScreen = this.add.image(CONFIG.DEFAULT_WIDTH / 2, CONFIG.DEFAULT_HEIGHT / 2, 'background')
    // winScreen.setScale(
    //   CONFIG.DEFAULT_WIDTH / winScreen.width,
    //   CONFIG.DEFAULT_HEIGHT / winScreen.height
    // )
    this.loseText = this.add.text(
      CONFIG.DEFAULT_WIDTH / 2,
      CONFIG.DEFAULT_HEIGHT / 2,
      'You Lose', { font: '32pt Arial', color: '#FFFFFF', align: 'center' }
    )
    this.loseText.setOrigin(0.5, 0.5)

    this.input.keyboard.on('keyup', this.keyReleased, this)
  }

  keyReleased () {
    if (LoseScreen.canContinue) {
      // console.log('Key released')
      this.scene.start('MainMenu')
      LoseScreen.canContinue = false
      // this.music.stop()
    }
  }

  onTimerEnd () {
    console.log(LoseScreen.canContinue)
    // console.log('onTimerEnd')
    LoseScreen.canContinue = true
    console.log(LoseScreen.canContinue)
    // console.log(this)
  }
}

export default LoseScreen
