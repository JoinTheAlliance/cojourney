import chalk, { type ForegroundColor } from 'chalk'

class Logger {
  frameChar = '*'

  log (
    message: string,
    {
      title = '',
      frame = false,
      color = 'white'
    }: {
      title?: string
      frame?: boolean
      color?: typeof ForegroundColor
    }
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const coloredMessage = chalk[color](message)
    if (frame) {
      const framedMessage = this.frameMessage(coloredMessage, title)
      console.log(framedMessage)
    } else {
      console.log(coloredMessage)
    }
  }

  warn (message: string, options = {}) {
    this.log(message, { ...options, color: 'yellow' })
  }

  error (message: string, options = {}) {
    this.log(message, { ...options, color: 'red' })
  }

  frameMessage (message: string, title: string) {
    const lines = message.split('\n')
    const maxLength = Math.max(
      ...lines.map((line: string) => line.length),
      title.length
    )
    const topFrame = title
      ? this.frameChar.repeat(maxLength + 4) +
        '\n' +
        this.frameChar +
        ' ' +
        title +
        ' '.repeat(maxLength - title.length + 1) +
        this.frameChar
      : this.frameChar.repeat(maxLength + 4)
    const bottomFrame = this.frameChar.repeat(maxLength + 4)
    const framedLines = lines.map(
      (line: string) =>
        `${this.frameChar} ${line} ${' '.repeat(maxLength - line.length)} ${this.frameChar}`
    )
    return [topFrame, ...framedLines, bottomFrame].join('\n')
  }
}

export default new Logger()
