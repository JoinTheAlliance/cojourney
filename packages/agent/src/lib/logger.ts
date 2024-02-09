import chalk from 'chalk';

class Logger {
  frameChar: string = '*';

  log(message: any, { title = '', frame = false, color = 'white' } = {}): void {
    const coloredMessage = (chalk as any)[color](message);
    if (frame) {
      const framedMessage = this.frameMessage(coloredMessage, title);
      console.log(framedMessage);
    } else {
      console.log(coloredMessage);
    }
  }

  warn(message: any, options = {}) {
    this.log(message, { ...options, color: 'yellow' });
  }

  error(message: any, options = {}) {
    this.log(message, { ...options, color: 'red' });
  }

  frameMessage(message: string, title: string | any[]) {
    const lines = message.split('\n');
    const maxLength = Math.max(...lines.map((line: string | any[]) => line.length), title.length);
    const topFrame = title
      ? this.frameChar.repeat(maxLength + 4) + '\n' + this.frameChar + ' ' + title + ' '.repeat(maxLength - title.length + 1) + this.frameChar
      : this.frameChar.repeat(maxLength + 4);
    const bottomFrame = this.frameChar.repeat(maxLength + 4);
    const framedLines = lines.map((line: string | any[]) => `${this.frameChar} ${line} ${' '.repeat(maxLength - line.length)} ${this.frameChar}`);
    return [topFrame, ...framedLines, bottomFrame].join('\n');
  }
}

export default new Logger();