import Phaser from 'phaser'
import CONFIG from '../config.js'
import Button from '../sprites/Button.js'

// import LittleGuy from '../sprites/littleGuy.js'

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
    // Load the image assets needed for 'Level1'
    this.load.image('sky', 'assets/skies/space3.png')
    this.load.image('logo', 'assets/sprites/phaser3-logo.png')
    this.load.image('red', 'assets/particles/red.png')

    this.load.spritesheet('littleGuy', 'assets/sprites/littleGuyJump.png',
      { frameWidth: 16, frameHeight: 16 })

    this.load.spritesheet('startButton', 'assets/sprites/startButton.png',
      { frameWidth: 32, frameHeight: 16 }
    )

    // Pre-load the entire audio sprite
    this.load.audioSprite('gameAudio', 'assets/audio/gameAudioSprite.json', [
      'assets/audio/gameAudioSprite.ogg',
      'assets/audio/gameAudioSprite.m4a',
      'assets/audio/gameAudioSprite.mp3',
      'assets/audio/gameAudioSprite.ac3'
    ])
  }

  create () {
    // Remove loading text
    this.loadingText.destroy()

    // Load and play background music
    this.music = this.sound.addAudioSprite('gameAudio')
    this.music.play('BGMTrack1')

    // Create start button
    this.startButton = new Button(this, CONFIG.DEFAULT_WIDTH / 2, CONFIG.DEFAULT_HEIGHT / 2, 'startButton', 0, 1)

    // Not quite sure why you have to do this.scene.scene instead of this.scene here
    this.startButton.onClicked = function (scene = this.scene.scene) {
      scene.start('Level1')
      scene.scene.music.stop()
    }
    this.startButton.setScale(5)
  }
}

export default MainMenu
