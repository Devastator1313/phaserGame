import Phaser from 'phaser'
// import CONFIG from '../config.js'

class SlimeSprite extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'slime', 1)

    if (!SlimeSprite.animInitialized) {
      SlimeSprite.setupAnim(scene)
    }
    scene.add.existing(this)
  }
}

SlimeSprite.animInitialized = false
SlimeSprite.setupAnim = (scene) => {
  console.log('Creating slime animation')
  scene.anims.create({
    key: 'slimeAnim',
    frameRate: 8,
    repeat: -1,
    frames: scene.anims.generateFrameNumbers('slime', { start: 0, end: 3 })
  })
}

export default SlimeSprite
