import blessed from 'blessed'
import { Utils } from './utils'

export class AlienEnemy {
  consoleWidth: number
  consoleHeight: number

  liveImage = `
         __
       _|  |_
     _|      |_
    |  _    _  |
    | |_|  |_| |
 _  |  _    _  |  _
|_|_|_| |__| |_|_|_|
  |_|_        _|_|
    |_|      |_|
`
  deadImage = `
         __
       _|  |_   
     _|      |_
    |  _   _   |
    |  X   X   |
 _  |  _    _  |  _
|_|_|_| |__| |_|_|_|
  |_|_        _|_|
    |_|      |_|
`
  gui: blessed.Widgets.TextElement
  isLive: boolean
  colors = ['red', 'blue', 'yellow', 'purple', 'green', 'orange']

  moveEnemyGuiRandom() {
    const posEnemy = Utils.genRandomNumRangeInt(2, this.consoleWidth - 20)

    this.gui.left = posEnemy
  }

  dead() {
    this.isLive = false
    this.gui.content = this.deadImage
    setTimeout(() => this.gui.hide(), 1000)
  }

  changeColor() {
    this.gui.style.fg = this.colors[Utils.genRandomNumRangeInt(0, 5)]
  }

  respawn() {
    this.changeColor()
    this.isLive = true
    this.gui.content = this.liveImage
    this.gui.show()
  }

  constructor(arg: { consoleWidth: number; consoleHeight: number }) {
    const { consoleWidth, consoleHeight } = arg
    this.isLive = true
    this.consoleWidth = consoleWidth
    this.consoleHeight = consoleHeight

    this.gui = blessed.text({ content: this.liveImage, top: 0, left: Math.round(this.consoleWidth / 2) - 8 })
    this.changeColor()
  }
}
