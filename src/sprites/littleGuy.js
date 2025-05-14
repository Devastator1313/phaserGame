import Phaser from 'phaser'
import CONFIG from '../config.js'

class LittleGuySprite extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, facing = 'right', state = 'idle', grounded = false, moving = false,
    jumpAnimPlaying = false, livesLeft = 3, dashCooldown = 1.5, canDash = true, dashing = false, dashDuration = 0.25,
    invincible = false, invincibilityDurationOnDeath = 0.1) {
    super(scene, x, y, 'littleGuy', 1)
    this.facing = facing
    this.defaultFacingValue = facing
    this.state = state
    this.grounded = grounded
    this.moving = moving
    this.jumpAnimPlaying = jumpAnimPlaying
    this.livesLeft = livesLeft
    // Cooldown on the player's dash, in seconds
    this.dashCooldown = dashCooldown
    this.canDash = canDash
    this.dashing = dashing
    // How long the dash lasts, in seconds
    this.dashDuration = dashDuration
    this.cursors = scene.input.keyboard.createCursorKeys()
    this.scene = scene
    this.invincible = invincible
    // Time player is invincible after they die, in seconds
    this.invincibilityDurationOnDeath = invincibilityDurationOnDeath

    if (!LittleGuySprite.animInitialized) {
      LittleGuySprite.setupAnim(scene)
    }

    // Enable physics
    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.setImmovable(true)
    this.body.setAllowGravity(true)
    this.body.setAllowDrag(true)
    this.body.setCollideWorldBounds(true)
    this.body.setSize(8, 8)

    this.on('animationcomplete', () => {
      if (this.anims.currentAnim.key === 'littleGuyJumpAnim') {
        this.jumpAnimPlaying = false
      }
    })

    // Add self to the given scene
    scene.add.existing(this)

    // Add audio context for sound effects
    this.sfx = scene.sound.addAudioSprite('gameAudio')
  }

  update (time, delta) {
    const direction = { x: 0 }
    if (this.cursors.right.isDown) {
      direction.x += 1
    }
    if (this.cursors.left.isDown) {
      direction.x -= 1
    }

    if (!this.dashing) {
      this.move(direction.x)
    } else {
      let velMultiplier
      if (this.facing === 'left') {
        velMultiplier = -1
      } else {
        velMultiplier = 1
      }
      this.setVelocityX(velMultiplier * CONFIG.DASH_FORCE)
    }
    if (this.cursors.space.isDown) {
      this.jump()
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.shift)) {
      this.dash()
    }

    this.resolveState()
    this.anims.update()
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
    this.setFlipX(this.facing === 'left')

    // console.log(this.state)
    // console.log(this.anims.currentAnim)
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

  dash () {
    if (this.canDash) {
      // this.setVelocityX((this.body.velocity.x + CONFIG.DASH_FORCE))
      this.dashCooldownTimer = this.scene.time.addEvent({ callback: this.onDashCooldownEnd, delay: this.dashCooldown * 1000, callbackScope: this })
      this.canDash = false
      this.dashTimer = this.scene.time.addEvent({ callback: this.onDashEnd, delay: this.dashDuration * 1000, callbackScope: this })
      this.dashing = true
    }
  }

  onDashCooldownEnd () {
    this.canDash = true
  }

  onDashEnd () {
    this.dashing = false
  }

  setInvincibility (value) {
    this.invincible = value
  }

  reset (x, y) {
    this.setInvincibility(true)
    this.invincibilityTimer = this.scene.time.addEvent({
      arguments: false,
      callback: this.setInvincibility,
      delay: this.invincibilityDurationOnDeath * 1000,
      callbackScope: this
    })
    this.facing = this.defaultFacingValues
    // Move player and stop all motion
    this.setVelocity(0, 0)
    this.setPosition(x, y)
    this.sfx.play('deathSound', { volume: 0.1 })
    this.dashing = false

    // Setup blink tween
    this.setAlpha(0)
    this.resetTween = this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 100,
      ease: 'Linear',
      repeat: 5
    })
  }
}

LittleGuySprite.animInitialized = false

LittleGuySprite.setupAnim = (scene) => {
  scene.anims.create({
    key: 'littleGuyJumpAnim',
    frameRate: 24,
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
    frames: scene.anims.generateFrameNumbers('littleGuy', { frames: [0] })
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
