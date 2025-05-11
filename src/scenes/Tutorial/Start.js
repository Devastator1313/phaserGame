import Phaser from 'phaser'
import CONFIG from '../../config.js'
import Witch from '../../sprites/Tutorial/witch.js'
import Slime from '../../sprites/Tutorial/slime.js'
import LittleGuy from '../../sprites/littleGuy.js'

class StartScene extends Phaser.Scene {
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
    this.load.image('StartScreen', 'assets/StartScreen.png')

    // Load the image assets needed for 'ExampleScene'
    this.load.image('sky', 'assets/skies/space3.png')
    this.load.image('logo', 'assets/sprites/phaser3-logo.png')
    this.load.image('red', 'assets/particles/red.png')

    this.load.spritesheet('witch', 'assets/sprites/WitchWalk.png',
      { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('slime', 'assets/sprites/Slime.png',
      { frameWidth: 32, frameHeight: 42 })
    this.load.spritesheet('littleGuy', 'assets/sprites/littleGuyJump.png',
      { frameWidth: 16, frameHeight: 16 })

    // Pre-load the entire audio sprite
    this.load.audioSprite('gameAudio', 'assets/audio/gameAudioSprite.json', [
      'assets/audio/gameAudioSprite.ogg',
      'assets/audio/gameAudioSprite.m4a',
      'assets/audio/gameAudioSprite.mp3',
      'assets/audio/gameAudioSprite.ac3'
    ])

    // DEBUG: Fake loading lots of data
    // for (let i = 0; i < 300; i++) {
    //   this.load.image('sky' + i, 'assets/skies/space3.png')
    // }
  }

  create () {
    // Remove loading text
    this.loadingText.destroy()

    // Add background image
    const startScreen = this.add.image(CONFIG.DEFAULT_WIDTH / 2, CONFIG.DEFAULT_HEIGHT / 2, 'StartScreen')
    startScreen.setScale(
      CONFIG.DEFAULT_WIDTH / startScreen.width,
      CONFIG.DEFAULT_HEIGHT / startScreen.height
    )

    // Add a callback when a key is released
    // this.input.keyboard.on('keyup', this.keyReleased, this)

    // Load and play background music
    // this.music = this.sound.addAudioSprite('gameAudio')
    // this.music.play('freeVertexStudioTrack1')

    // Add some sprites
    this.witch = new Witch(this, 100, 100)
    this.witch.setScale(3, 3)
    this.witch1 = new Witch(this, 150, 100)
    this.witch2 = new Witch(this, 200, 100)
    this.witch3 = new Witch(this, 250, 100)
    this.slime = new Slime(this, 300, 300)
    this.littleGuy = new LittleGuy(this, 400, 400)
    this.littleGuy2 = new LittleGuy(this, 800, 400)
    this.littleGuy.setScale(10, 10)
    this.littleGuy2.setScale(10, 10)

    // Start the animation
    // this.witch.anims.play('witchWalkDown')
    this.witch1.anims.play('witchWalkUp')
    this.witch2.anims.play('witchWalkHoriz')
    this.witch3.anims.play('witchWalkHoriz')
    this.witch3.setFlipX(true)
    this.slime.anims.play('slimeAnim')
    this.littleGuy.anims.play('littleGuyJumpAnim')
    this.littleGuy2.anims.play('littleGuyWalkAnim')

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update () {
    const direction = { x: 0, y: 0 }
    if (this.cursors.right.isDown) {
      direction.x += 1
    }
    if (this.cursors.left.isDown) {
      direction.x -= 1
    }
    if (this.cursors.up.isDown) {
      direction.y -= 1
    }
    if (this.cursors.down.isDown) {
      direction.y += 1
    }
    this.witch.move(direction.x, direction.y)
  }

  keyReleased () {
    console.log('Key released')
    this.scene.start('ExampleScene')
    this.music.stop()
  }
}

export default StartScene
