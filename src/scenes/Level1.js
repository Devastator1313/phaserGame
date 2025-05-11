import Phaser from 'phaser'
import CONFIG from '../config.js'

import LittleGuy from '../sprites/littleGuy.js'

class Level1 extends Phaser.Scene {
  preload () {
    // Loading is done in 'MainMenu'
    // - 'sky' is background image
    // - 'red' is our particle
    // - 'logo' is the phaser3 logo
  }

  create () {
    // Setup variables with world bounds
    const worldWidth = CONFIG.DEFAULT_WIDTH * 1.5
    const worldHeight = CONFIG.DEFAULT_HEIGHT

    // Add background image
    const sky = this.add.image(CONFIG.DEFAULT_WIDTH / 2, CONFIG.DEFAULT_HEIGHT / 2, 'sky')
    sky.setScale(
      CONFIG.DEFAULT_WIDTH / sky.width * 1.5,
      CONFIG.DEFAULT_HEIGHT / sky.height
    )

    // Create and configure a particle emitter
    const emitter = this.add.particles(0, 0, 'red', {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    })

    // Create and animate the logo
    this.littleGuy = new LittleGuy(this, 200, 200)
    this.littleGuy.setScale(10, 10)
    // const logo = this.physics.add.image(400, 100, 'logo')
    // logo.setVelocity(100, 200)
    // logo.setBounce(1, 1)
    // logo.setCollideWorldBounds(true)
    // logo.body.onWorldBounds = true

    // Play sound when we hit the world bounds
    this.physics.world.on('worldbounds', () => { this.sfx.play('hitSound') }, this)

    // Adjust world bounds for physics and camera
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight)
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight)
    this.cameras.main.startFollow(this.littleGuy, false, 0.1)
    this.cameras.main.setDeadzone(worldWidth * 0.25, worldHeight)

    // Make the particle emitter follow the logo
    emitter.startFollow(this.littleGuy)

    // Add a callback when a key is released
    // this.input.keyboard.on('keyup', this.keyReleased, this)

    // Load and play background music
    // this.music = this.sound.addAudioSprite('gameAudio')
    // this.music.play('freeVertexStudioTrack2')

    // Create a sound instance for sfx
    // this.sfx = this.sound.addAudioSprite('gameAudio')
    this.cursors = this.input.keyboard.createCursorKeys()

    this.scene.run('HUDScene')
  }

  update () {
    let xDir = 0
    if (this.cursors.right.isDown) {
      xDir += 1
    }
    if (this.cursors.left.isDown) {
      xDir -= 1
    }
    // if (this.cursors.up.isDown) {
    //   direction.y -= 1
    // }
    // if (this.cursors.down.isDown) {
    //   direction.y += 1
    // }
    this.littleGuy.move(xDir)
    if (this.cursors.space.isDown) {
      this.littleGuy.jump()
    }

    this.littleGuy.resolveState()
  }

  // keyReleased () {
  //   console.log('Key released')
  //   this.scene.start('MainMenu')
  //   this.scene.stop('HUDScene')
  //   this.music.stop()
  // }
}

export default Level1
