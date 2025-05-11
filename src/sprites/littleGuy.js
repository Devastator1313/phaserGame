import Phaser from 'phaser'
import CONFIG from '../config.js'

class LittleGuySprite extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, facing = 'right', state = 'idle', grounded = false, moving = false, jumpAnimPlaying = false) {
    super(scene, x, y, 'littleGuy', 1)
    this.facing = facing
    this.state = state
    this.grounded = grounded
    this.moving = moving
    this.jumpAnimPlaying = jumpAnimPlaying

    if (!LittleGuySprite.animInitialized) {
      LittleGuySprite.setupAnim(scene)
    }

    // Enable physics
    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.setImmovable(true)
    this.body.setAllowGravity(true)
    this.body.setAllowDrag(true)
    this.body.setCollideWorldBounds(true)

    this.on('animationcomplete', () => {
      if (this.anims.currentAnim.key === 'littleGuyJumpAnim') {
        this.jumpAnimPlaying = false
      }
    })

    // Add self to existing scene
    scene.add.existing(this)
  }

  resolveState () {
    if (this.body.onFloor()) {
      this.grounded = true
    } else {
      this.grounded = false
    }
    if (this.grounded) {
      if (this.moving) {
        this.state = 'walking'
        this.anims.play('littleGuyWalkAnim', true)
        if (this.facing === 'left') {
          this.setFlipX(true)
        } else {
          this.setFlipX(false)
        }
      } else {
        this.state = 'idle'
        this.anims.play('littleGuyIdleAnim', true)
      }
    } else {
      if (this.jumpAnimPlaying) {
        this.state = 'jumping'
      } else {
        this.state = 'falling'
        this.anims.play('littleGuyFallAnim', true)
      }
    }
    console.log(this.state)
  }

  move (x) {
    if (x < 0) {
      this.facing = 'left'
    } else if (x > 0) {
      this.facing = 'right'
    }
    if (Math.abs(x) > 0) {
      if (this.grounded) {
        this.setVelocityX(x * CONFIG.WALK_SPEED)
      } else {
        this.setVelocityX(x * CONFIG.WALK_SPEED * CONFIG.AIR_SPEED_MULTIPLIER)
      }
    } else {
      this.setVelocityX(0)
    }
    if (this.body.speed > 0.01) {
      this.moving = true
    } else {
      this.moving = false
    }
  }

  jump () {
    if (this.grounded) {
      this.anims.play('littleGuyJumpAnim', true)
      this.jumpAnimPlaying = true
      this.setVelocityY(this.body.velocity.y - CONFIG.JUMP_FORCE)
    }
  }
}

LittleGuySprite.animInitialized = false

LittleGuySprite.setupAnim = (scene) => {
  scene.anims.create({
    key: 'littleGuyJumpAnim',
    frameRate: 10,
    repeat: 0,
    frames: scene.anims.generateFrameNumbers('littleGuy', { start: 0, end: 5 })
  })
  scene.anims.create({
    key: 'littleGuyWalkAnim',
    frameRate: 5,
    repeat: -1,
    frames: scene.anims.generateFrameNumbers('littleGuy', { start: 0, end: 1 })
  })
  scene.anims.create({
    key: 'littleGuyIdleAnim',
    frameRate: 1,
    repeat: -1,
    frames: scene.anims.generateFrameNumbers('littleGuy', { start: 0, end: 0 })
  })
  scene.anims.create({
    key: 'littleGuyFallAnim',
    frameRate: 1,
    repeat: -1,
    frames: scene.anims.generateFrameNumbers('littleGuy', { start: 5, end: 5 })
  })
  LittleGuySprite.animInitialized = true
}

export default LittleGuySprite
