import Phaser from 'phaser'
// import CONFIG from '../config.js'

class LittleGuySprite extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'littleGuy', 1)

    if (!LittleGuySprite.animInitialized) {
      LittleGuySprite.setupAnim(scene)
    }
    scene.add.existing(this)
  }
}

LittleGuySprite.animInitialized = false
LittleGuySprite.setupAnim = (scene) => {
  scene.anims.create({
    key: 'littleGuyJumpAnim',
    frameRate: 10,
    repeat: 0,
    frames: scene.anims.generateFrameNumbers('littleGuy', { start: 0, end: 8 })
  })
}

export default LittleGuySprite
