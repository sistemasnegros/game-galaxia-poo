export class Utils {
  static genRandomNumRange(min: number, max: number) {
    const numeroAleatorio = Math.random()
    const numeroEnRango = numeroAleatorio * (max - min) + min
    return numeroEnRango
  }

  static genRandomNumRangeInt(min: number, max: number) {
    const numeroAleatorio = Math.random()
    const numeroEnRango = numeroAleatorio * (max - min) + min
    return Math.round(numeroEnRango)
  }
}
