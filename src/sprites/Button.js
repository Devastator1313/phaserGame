import Phaser from 'phaser'

class Button extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture, normalFrame, clickedFrame, hoveredFrame = -1) {
    super(scene, x, y, texture, normalFrame)
    this.normalFrame = normalFrame
    this.clickedFrame = clickedFrame
    this.hoveredFrame = hoveredFrame
    this.setInteractive()

    this.on('pointerdown', function (event) {
      this.setFrame(clickedFrame)
    }, this)

    this.on('pointerout', function (event) {
      this.setFrame(normalFrame)
    }, this)

    this.on('pointerin', function (event) {
      if (hoveredFrame >= 0) {
        this.setFrame(hoveredFrame)
      }
    })

    this.on('pointerup', function (event) {
      if (this.frame.name === 1) {
        this.onClicked()
      }
      this.setFrame(normalFrame)
    }, this)

    scene.add.existing(this)
  }

  onClicked () {}
}

export default Button
