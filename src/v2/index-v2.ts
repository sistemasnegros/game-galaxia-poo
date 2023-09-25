import blessed from 'blessed'

function main() {
  const screen = blessed.screen({
    smartCSR: true,
  })

  const consoleWidth = ~~screen.width
  const consoleHeight = ~~screen.height

  let pointsValues = 0
  const points = blessed.text({
    content: `POINTS: ${pointsValues}`,
    top: 0,
    right: 0,
    fg: 'green',
    width: 15,
  })

  screen.append(points)

  const iconPlayer = `
 .'.
 |o|
.'o'.
|.-.|
'   '
`

  const spacecraft = blessed.text({
    content: iconPlayer,
    top: consoleHeight - 6,
    left: Math.round(consoleWidth / 2),
    width: 5,
    height: 8,
    style: {
      fg: 'white',
    },
  })

  const speed = 4

  screen.append(spacecraft)

  screen.key(['left', 'right', 'up', 'down'], (ch, key) => {
    // Guarda las coordenadas actuales
    let newLeft = ~~spacecraft.left
    let newTop = ~~spacecraft.top

    switch (key.name) {
      case 'left':
        newLeft -= speed
        break
      case 'right':
        newLeft += speed
        break
    }

    // Verifica si las nuevas coordenadas están dentro de los límites de la consola
    if (newLeft >= 0 && newLeft < consoleWidth - 4 && newTop >= 0 && newTop < consoleHeight - 5) {
      spacecraft.left = newLeft
      spacecraft.top = newTop
    }

    screen.render()
  })

  // Sale de la aplicación con Ctrl+C
  screen.key(['C-c'], () => {
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
  const enemy = blessed.text({ content: iconEnemy, top: 0, left: Math.round(consoleWidth / 2) - 8 })

  screen.append(enemy)
  const movingEnemy = () => {
    const posEnemy = Math.round(genRandomNumRange(2, consoleWidth - 20))
    enemy.left = posEnemy
    screen.render()
  }

  let enemyInterval = setInterval(movingEnemy, 100)

  // =============================
  // Time games
  // =============================
  let time = 0
  const timeText = blessed.text({
    content: `TIME: ${time}`,
    top: 0,
    let: 0,
    style: {
      fg: 'green',
    },
  })

  screen.append(timeText)

  const timeInterval = setInterval(() => {
    time += 1
    timeText.content = `Time: ${time}`
  }, 1000)

  let enemyDestroy = false

  // =================================
  // shooting
  // =================================
  screen.key(['a'], (ch, key) => {
    const missile = blessed.text({
      content: '*',
      top: 0,
      left: 0,
      width: 1,
      height: 1,
      style: {
        fg: 'white',
      },
    })

    missile.top = spacecraft.top
    missile.left = ~~spacecraft.left + 2
    screen.append(missile)

    // Mueve el misil hacia arriba en intervalos de tiempo
    const missileInterval = setInterval(() => {
      const posTop = ~~missile.top
      missile.top = posTop - 6
      screen.render()

      // valida si el disparo hace colision con el enemigo
      if (!enemyDestroy && enemy.left < missile.left && ~~enemy.left > ~~missile.left - 10) {
        clearInterval(enemyInterval)
        enemy.content = iconEnemyRIP
        setTimeout(() => enemy.hide(), 1000)
        setTimeout(() => {
          enemyDestroy = false
          enemy.content = iconEnemy
          enemy.show()
          pointsValues += 1
          points.content = `POINTS: ${pointsValues}`
          screen.render()
          enemyInterval = setInterval(movingEnemy, 100)
        }, 3000)
        enemyDestroy = true
      }

      // Si el misil llega al límite superior de la consola, elimínalo y detén el intervalo
      if (missile.top < 0) {
        clearInterval(missileInterval)
        screen.remove(missile)
      }
    }, 100)
  })

  screen.render()
}

main()
