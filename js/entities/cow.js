class Cow {
  constructor({ x, y, dir = 'right' }) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  clone() {
    return new Cow({ x: this.x, y: this.y, dir: this.dir });
  }

  toJSON() {
    return { x: this.x, y: this.y, dir: this.dir };
  }

  isAt(x, y) {
    return this.x === x && this.y === y;
  }

  render(ctx, C) {
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(this.x * C + 3, this.y * C + 3, C - 6, C - 6);
  }
}