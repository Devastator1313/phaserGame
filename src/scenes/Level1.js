import Phaser from 'phaser'
import TilemapScene from './Tutorial/TilemapScene.js'
import CONFIG from '../config.js'

// Bring in player character
import LittleGuy from '../sprites/littleGuy.js'

class Level1Scene extends TilemapScene {
  init () {
    this.loadingText = this.add.text(
      CONFIG.DEFAULT_WIDTH / 2,
      CONFIG.DEFAULT_HEIGHT / 2,
      'Loading ...', { font: '16pt Arial', color: '#FFFFFF', align: 'center' }
    )
    this.loadingText.setOrigin(0.5, 0.5)
  }

  preload () {
    // Load images
    this.load.image('background', 'assets/skies/background.png')
    this.load.spritesheet('platformTiles', 'assets/tilesets/platformPack_tilesheet.png',
      { frameWidth: 64, frameHeight: 64 })

    // Load main character spritesheet
    this.load.spritesheet('littleGuy', 'assets/sprites/littleGuyJump.png',
      { frameWidth: 16, frameHeight: 16 })

    // Load JSON data
    this.load.tilemapTiledJSON('mapData', 'assets/tilemaps/Level1.json')

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
    // Adds background image
    const background = this.add.image(0, 0, 'background')
    background.setOrigin(0, 0)

    this.hasKey = false
    this.doorOpen = false
    this.winConditionMet = false
    this.loseConditionMet = false
    this.spawnPoint = new Phaser.Math.Vector2(50, 950)

    // Parse JSON into map
    this.parseTilemapJson('mapData')

    // Create any tilesets
    this.createTileset('platformPack', 'platformTiles')

    // Parse tile layers
    this.platformLayer = this.createTileLayer('Platforms', true)
    this.blockLayer = this.createTileLayer('Blocks', true)
    this.grassLayer = this.createTileLayer('Grass', false)

    // Parse object layers
    this.spikes = this.parseObjectLayer('Spikes', 'platformTiles', 70, {
      allowGravity: false,
      immovable: true,
      createCallback: (spike) => {
        spike.body.setSize(64, 34)
        spike.body.setOffset(34, 63)
      }
    })
    this.doors = this.parseObjectLayer('Doors', 'platformTiles', 79, {
      allowGravity: false,
      immovable: true,
      createCallback: (door) => {
        door.body.setSize(64, 64)
        door.body.setOffset(32, 32)
      }
    })
    this.keys = this.parseObjectLayer('Keys', 'platformTiles', 63, {
      allowGravity: false,
      immovable: true,
      createCallback: (key) => {
        key.body.setSize(64, 64)
        key.body.setOffset(32, 32)
      }
    })

    // Scale our background
    background.setScale(
      this.mapData.widthInPixels / background.width,
      this.mapData.heightInPixels / background.height
    )

    // Make little guy
    this.littleGuy = new LittleGuy(this, this.spawnPoint.x, this.spawnPoint.y)
    this.littleGuy.setScale(5, 5)
    this.cameras.main.startFollow(this.littleGuy, false, 0.1)

    this.physics.world.TILE_BIAS = 64

    // Turn on layer collisions
    this.physics.add.collider(this.littleGuy, this.platformLayer)
    this.physics.add.collider(this.littleGuy, this.blockLayer)
    this.physics.add.collider(this.littleGuy, this.spikes, this.spikeHit, null, this)
    this.physics.add.collider(this.littleGuy, this.doors, this.doorHit, null, this)
    this.physics.add.collider(this.littleGuy, this.keys, this.keyHit, null, this)

    // Create basic cursors
    this.cursors = this.input.keyboard.createCursorKeys()

    // Load and play background music
    this.music = this.sound.addAudioSprite('gameAudio')
    this.music.play('Stage1', { volume: 0.05 })

    // Start the overlaid HUD scene
    this.scene.run('HUDScene', this.littleGuy)
  }

  spikeHit () {
    if (!this.littleGuy.invincible) {
      this.littleGuy.reset(this.spawnPoint.x, this.spawnPoint.y - 15)
      this.littleGuy.livesLeft -= 1
      this.events.emit('playerHealthChanged', this.littleGuy.livesLeft)
      if (this.littleGuy.livesLeft <= 0) {
        this.loseConditionMet = true
        if (this.loseConditionMet) {
          this.scene.start('LoseScreen')
          this.scene.stop('HUDScene')
          this.music.stop()
        }
      }
    }
  }

  doorHit () {
    if (this.hasKey) {
      this.doorOpen = true
    }
    if (this.doorOpen) {
      this.winConditionMet = true
    }
    if (this.winConditionMet) {
      this.scene.start('WinScreen')
      this.scene.stop('HUDScene')
      this.music.stop()
    }
  }

  keyHit () {
    this.hasKey = true
    // console.log('key hit')
    // this.mapData.replaceByIndex(63, 62)
    this.keys.children.entries[0].setFrame(62)
  }

  update () {
    const direction = { x: 0 }
    if (this.cursors.right.isDown) {
      direction.x += 1
    }
    if (this.cursors.left.isDown) {
      direction.x -= 1
    }

    if (!this.littleGuy.dashing) {
      this.littleGuy.move(direction.x)
    } else {
      let velMultiplier
      if (this.littleGuy.facing === 'left') {
        velMultiplier = -1
      } else {
        velMultiplier = 1
      }
      this.littleGuy.setVelocityX(velMultiplier * CONFIG.DASH_FORCE)
    }
    if (this.cursors.space.isDown) {
      this.littleGuy.jump()
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.shift)) {
      this.littleGuy.dash()
    }

    this.littleGuy.resolveState()
    // this.anims.update()
  }
}

export default Level1Scene
