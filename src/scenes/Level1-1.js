import TilemapScene from './Tutorial/TilemapScene.js'

// Bring in player character
import LittleGuy from '../sprites/littleGuy.js'

class Stage1Scene extends TilemapScene {
  preload () {
    // Load images
    this.load.image('background', 'assets/skies/background.png')
    this.load.spritesheet('platformTiles', 'assets/tilesets/platformPack_tilesheet.png',
      { frameWidth: 64, frameHeight: 64 })

    // Load main character spritesheet
    this.load.spritesheet('littleGuy', 'assets/sprites/littleGuyJump.png',
      { frameWidth: 16, frameHeight: 16 })

    // Load JSON data
    this.load.tilemapTiledJSON('mapData', 'assets/tilemaps/ExampleStage1.json')

    // Pre-load the entire audio sprite
    this.load.audioSprite('gameAudio', 'assets/audio/gameAudioSprite.json', [
      'assets/audio/gameAudioSprite.ogg',
      'assets/audio/gameAudioSprite.m4a',
      'assets/audio/gameAudioSprite.mp3',
      'assets/audio/gameAudioSprite.ac3'
    ])
  }

  create () {
    // Adds background image
    const background = this.add.image(0, 0, 'background')
    background.setOrigin(0, 0)

    // Parse JSON into map
    this.parseTilemapJson('mapData')

    // Create any tilesets
    this.createTileset('platformPack', 'platformTiles')

    // Parse tile layers
    this.platformLayer = this.createTileLayer('Platforms', true)
    this.blockLayer = this.createTileLayer('Blocks', true)

    // Parse object layers
    this.spikes = this.parseObjectLayer('Spikes', 'platformTiles', 70, {
      allowGravity: false,
      immovable: true,
      createCallback: (spike) => {
        spike.body.setSize(64, 34)
        spike.body.setOffset(34, 63)
      }
    })

    // Scale our background
    background.setScale(
      this.mapData.widthInPixels / background.width,
      this.mapData.heightInPixels / background.height
    )

    // Make little guy
    this.littleGuy = new LittleGuy(this, 50, 300)
    this.littleGuy.setScale(3, 3)
    this.cameras.main.startFollow(this.littleGuy, false, 0.1)

    // Turn on layer collisions
    this.physics.add.collider(this.littleGuy, this.platformLayer)
    this.physics.add.collider(this.littleGuy, this.blockLayer)
    this.physics.add.collider(this.littleGuy, this.spikes, this.spikeHit, null, this)

    // Create basic cursors
    this.cursors = this.input.keyboard.createCursorKeys()

    // Load and play background music
    this.music = this.sound.addAudioSprite('gameAudio')
    this.music.play('Stage1', { volume: 0.05 })
  }

  spikeHit () {
    this.littleGuy.reset(50, 300)
  }

  update () {
    const direction = { x: 0, y: 0 }
    if (this.cursors.space.isDown) {
      direction.y -= 1
    }
    if (this.cursors.right.isDown) {
      direction.x += 1
    }
    if (this.cursors.left.isDown) {
      direction.x -= 1
    }

    this.littleGuy.move(direction.x, direction.y)
    if (this.cursors.space.isDown) {
      this.littleGuy.jump()
    }

    this.littleGuy.resolveState()
  }
}

export default Stage1Scene
