import blessed from 'blessed'

export class SpaceCraft {
  widthInCharacters = 4
  consoleWidth: number
  consoleHeight: number
  speedSpaceCraft = 4
  imagen = `
 .'.
 |o|
.'o'.
|.-.|
'   '
`
  gui: blessed.Widgets.TextElement

  canItBeMoved(newPosition: number): boolean {
    const isLimitScreen =
      newPosition >= this.widthInCharacters && newPosition <= this.consoleWidth - this.widthInCharacters
    return isLimitScreen
  }

  createMissile() {
    const missileGui = blessed.text({
      content: '*',
      top: this.gui.top,
      left: ~~this.gui.left - 1,
      width: 1,
      height: 1,
      style: {
        fg: 'white',
      },
    })

    return missileGui
  }

  moveLeft() {
    const newPosition = ~~this.gui.left - this.speedSpaceCraft
    if (!this.canItBeMoved(newPosition)) {
      return
    }
    this.gui.left = newPosition
  }

  moveRight() {
    const newPosition = ~~this.gui.left + this.speedSpaceCraft
    if (!this.canItBeMoved(newPosition)) {
      return
    }
    this.gui.left = newPosition
  }

  constructor(arg: { consoleWidth: number; consoleHeight: number }) {
    const { consoleWidth, consoleHeight } = arg

    this.consoleWidth = consoleWidth
    this.consoleHeight = consoleHeight

    this.gui = blessed.text({
      content: this.imagen,
      top: consoleHeight - 6,
      left: Math.round(consoleWidth / 2),
      width: 5,
      height: 8,
      style: {
        fg: 'white',
      },
    })
  }
}
