// Bring in the phaser library
import Phaser from 'phaser'

import CONFIG from './config.js'

import MainMenu from './scenes/MainMenu.js'
import Level1 from './scenes/Level1.js'
import Level1_1 from './scenes/Level1-1.js'
import WinScreen from './scenes/WinScreen.js'
import LoseScreen from './scenes/LoseScreen.js'
import HUD from './scenes/HUD.js'

const config = {
  // Configure Phaser graphics settings
  type: Phaser.AUTO,
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    width: CONFIG.DEFAULT_WIDTH,
    height: CONFIG.DEFAULT_HEIGHT
  },

  // Configure physics settings
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: CONFIG.DEFAULT_GRAVITY },
      debug: __DEV__
    }
  },
  render: {
    pixelArt: true,
    antialias: false
  }
}

// Initialize the base phaser game object (must always be done once)
const game = new Phaser.Game(config)

// Add and auto-starting ExampleScene
game.scene.add('MainMenu', MainMenu)
game.scene.add('Level1', Level1)
game.scene.add('Level1-1', Level1_1)
game.scene.add('WinScreen', WinScreen)
game.scene.add('LoseScreen', LoseScreen)
game.scene.add('HUDScene', HUD)
game.scene.start('MainMenu')
