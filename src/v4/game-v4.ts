import blessed from 'blessed'
import { AlienEnemy } from './alient-enemy-v4'
import { SpaceCraft } from './space-craft-v4'

export class Game {
  labelTextTimeGui: blessed.Widgets.TextElement
  labelTextPointsGui: blessed.Widgets.TextElement
  timeStore = 0
  pointsStore = 0

  screenGui: blessed.Widgets.Screen

  spaceCraft: SpaceCraft
  alienEnemy: AlienEnemy

  consoleWidth: number
  consoleHeight: number

  constructor() {
    this.screenGui = blessed.screen({
      smartCSR: true,
    })

    this.consoleWidth = ~~this.screenGui.width
    this.consoleHeight = ~~this.screenGui.height

    this.labelTextTimeGui = blessed.text({
      content: `TIME: ${this.timeStore}`,
      top: 0,
      let: 0,
      style: {
        fg: 'green',
      },
    })
    this.screenGui.append(this.labelTextTimeGui)

    this.pointsStore = 0
    this.labelTextPointsGui = blessed.text({
      content: `POINTS: ${this.pointsStore}`,
      top: 0,
      right: 0,
      fg: 'green',
      width: 15,
    })
    this.screenGui.append(this.labelTextPointsGui)

    this.spaceCraft = new SpaceCraft({ consoleHeight: this.consoleHeight, consoleWidth: this.consoleWidth })
    this.screenGui.append(this.spaceCraft.gui)

    this.alienEnemy = new AlienEnemy({ consoleHeight: this.consoleHeight, consoleWidth: this.consoleWidth })
    this.screenGui.append(this.alienEnemy.gui)
  }

  starTimeGame() {
    setInterval(() => {
      this.timeStore += 1
      this.labelTextTimeGui.content = `Time: ${this.timeStore}`
      this.screenGui.render()
    }, 1000)
  }

  addPoint() {
    this.pointsStore += 1
    this.labelTextPointsGui.content = `POINTS: ${this.pointsStore}`
    this.screenGui.render()
  }

  start() {
    this.starTimeGame()

    this.screenGui.key(['left', 'right'], (ch, key) => {
      if (key.name === 'left') {
        this.spaceCraft.moveLeft()
      }

      if (key.name === 'right') {
        this.spaceCraft.moveRight()
      }

      this.screenGui.render()
    })

    const moveEnemyGuiRandomInInterval = () => {
      this.alienEnemy.moveEnemyGuiRandom()
      this.screenGui.render()
    }

    let enemyInterval = setInterval(moveEnemyGuiRandomInInterval, 100)

    this.screenGui.key(['a'], (ch, key) => {
      const missileGui = this.spaceCraft.createMissile()
      this.screenGui.append(missileGui)

      // Mueve el misil hacia arriba en intervalos de tiempo
      const missileInterval = setInterval(() => {
        missileGui.top = ~~missileGui.top - 6
        this.screenGui.render()

        const positionLeftMissile = ~~missileGui.left
        // valida si el disparo hace colisión con el enemigo
        if (
          this.alienEnemy.isLive &&
          this.alienEnemy.gui.left < missileGui.left &&
          ~~this.alienEnemy.gui.left > positionLeftMissile - 10
        ) {
          clearInterval(enemyInterval)

          this.alienEnemy.dead()
          this.addPoint()

          setTimeout(() => {
            this.alienEnemy.respawn()
            enemyInterval = setInterval(moveEnemyGuiRandomInInterval, 100)
          }, 3000)
        }

        // Si el misil llega al límite superior de la consola, elimínalo y detén el intervalo
        if (missileGui.top < 0) {
          clearInterval(missileInterval)
          this.screenGui.remove(missileGui)
        }
      }, 100)
    })

    this.screenGui.key(['C-c'], () => {
      process.exit(0)
    })
    this.screenGui.render()
  }
}
