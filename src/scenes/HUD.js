import Phaser from 'phaser'
import CONFIG from '../config.js'

class HUDScene extends Phaser.Scene {
  preload () {
    this.load.spritesheet('platformTiles', 'assets/tilesets/platformPack_tilesheet.png',
      { frameWidth: 64, frameHeight: 64 })
  }

  create (littleGuy) {
    this.hearts = []
    // this.infoText = this.add.text(
    //   CONFIG.DEFAULT_WIDTH - 10,
    //   CONFIG.DEFAULT_HEIGHT - 10,
    //   'INFORMATION but realer', { font: '16pt Arial', color: '#FF0000', align: 'center' }
    // )
    // this.infoText.setOrigin(1, 1)

    this.updateUI(littleGuy.livesLeft)
    this.scene.get('Level1').events.on('playerHealthChanged', this.onPlayerHealthChanged, this)
  }

  onPlayerHealthChanged (livesLeft) {
    this.updateUI(livesLeft)
  }

  updateUI (livesLeft) {
    // The sprites will stay on-screen unless you destroy them, even if you empty the array
    this.hearts.forEach((element) => {
      element.destroy()
    })
    this.hearts = []
    for (let i = 0; i < livesLeft; ++i) {
      const heart = this.add
        .sprite(CONFIG.DEFAULT_WIDTH - (30 * (i + 1)) - 50, 25, 'platformTiles', 67)
        .setOrigin(0)
      this.hearts.push(heart)
    }
  }
}

export default HUDScene
