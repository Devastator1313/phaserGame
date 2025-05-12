import Phaser from 'phaser'
import CONFIG from '../config.js'

class MainMenu extends Phaser.Scene {
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
  }
}

export default MainMenu
