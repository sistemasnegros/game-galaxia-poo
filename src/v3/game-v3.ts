import blessed from 'blessed'

export class Game {
  start() {
    const screenGui = blessed.screen({
      smartCSR: true,
    })

    const consoleWidth = ~~screenGui.width
    const consoleHeight = ~~screenGui.height

    let pointsStore = 0
    const labelTextPointsGui = blessed.text({
      content: `POINTS: ${pointsStore}`,
      top: 0,
      right: 0,
      fg: 'green',
      width: 15,
    })

    screenGui.append(labelTextPointsGui)

    const iconPlayer = `
 .'.
 |o|
.'o'.
|.-.|
'   '
`

    const spaceCraftGui = blessed.text({
      content: iconPlayer,
      top: consoleHeight - 6,
      left: Math.round(consoleWidth / 2),
      width: 5,
      height: 8,
      style: {
        fg: 'white',
      },
    })

    const speedSpaceCraftGui = 4

    screenGui.append(spaceCraftGui)

    screenGui.key(['left', 'right', 'up', 'down'], (ch, key) => {
      let newLeft = ~~spaceCraftGui.left
      let newTop = ~~spaceCraftGui.top

      switch (key.name) {
        case 'left':
          newLeft -= speedSpaceCraftGui
          break
        case 'right':
          newLeft += speedSpaceCraftGui
          break
      }

      // Verifica si las nuevas coordenadas están dentro de los límites de la consola
      if (newLeft >= 0 && newLeft < consoleWidth - 4 && newTop >= 0 && newTop < consoleHeight - 5) {
        spaceCraftGui.left = newLeft
        spaceCraftGui.top = newTop
      }

      screenGui.render()
    })

    // Sale de la aplicación con Ctrl+C
    screenGui.key(['C-c'], () => {
      process.exit(0)
    })

    function genRandomNumRange(min: number, max: number) {
      const numeroAleatorio = Math.random()
      const numeroEnRango = numeroAleatorio * (max - min) + min
      return numeroEnRango
    }

    // ===========================
    // Enemy
    // ===========================
    const iconEnemy = `
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
    const iconEnemyRIP = `
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
    const enemyGui = blessed.text({ content: iconEnemy, top: 0, left: Math.round(consoleWidth / 2) - 8 })

    screenGui.append(enemyGui)

    const moveEnemyGuiRandom = () => {
      const posEnemy = Math.round(genRandomNumRange(2, consoleWidth - 20))
      enemyGui.left = posEnemy
      screenGui.render()
    }

    let enemyInterval = setInterval(moveEnemyGuiRandom, 100)

    // =============================
    // Time games
    // =============================
    let timeStore = 0
    const labelTextTimeGui = blessed.text({
      content: `TIME: ${timeStore}`,
      top: 0,
      let: 0,
      style: {
        fg: 'green',
      },
    })

    screenGui.append(labelTextTimeGui)

    const timeInterval = setInterval(() => {
      timeStore += 1
      labelTextTimeGui.content = `Time: ${timeStore}`
    }, 1000)

    let enemyDestroy = false

    // =================================
    // shooting
    // =================================
    screenGui.key(['a'], (ch, key) => {
      const missileGui = blessed.text({
        content: '*',
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        style: {
          fg: 'white',
        },
      })

      // La posición del misil debe ser encima de la ubicación de la naves
      missileGui.top = spaceCraftGui.top
      missileGui.left = ~~spaceCraftGui.left + 2
      screenGui.append(missileGui)

      // Mueve el misil hacia arriba en intervalos de tiempo
      const missileInterval = setInterval(() => {
        const posTop = ~~missileGui.top
        missileGui.top = posTop - 6
        screenGui.render()

        const positionLeftMissile = ~~missileGui.left
        // valida si el disparo hace colisión con el enemigo
        if (!enemyDestroy && enemyGui.left < missileGui.left && ~~enemyGui.left > positionLeftMissile - 10) {
          clearInterval(enemyInterval)
          enemyGui.content = iconEnemyRIP
          setTimeout(() => enemyGui.hide(), 1000)
          setTimeout(() => {
            enemyDestroy = false
            enemyGui.content = iconEnemy
            enemyGui.show()
            pointsStore += 1
            labelTextPointsGui.content = `POINTS: ${pointsStore}`
            screenGui.render()
            enemyInterval = setInterval(moveEnemyGuiRandom, 100)
          }, 3000)
          enemyDestroy = true
        }

        // Si el misil llega al límite superior de la consola, elimínalo y detén el intervalo
        if (missileGui.top < 0) {
          clearInterval(missileInterval)
          screenGui.remove(missileGui)
        }
      }, 100)
    })

    screenGui.render()
  }
}
