class Arrow {
  constructor({ x, y, dir }) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  clone() {
    return new Arrow({ x: this.x, y: this.y, dir: this.dir });
  }

  toJSON() {
    return { x: this.x, y: this.y, dir: this.dir };
  }

  isAt(x, y) {
    return this.x === x && this.y === y;
  }

  render(ctx, C) {
    ctx.fillStyle = 'rgba(127, 90, 240, 0.35)';
    ctx.fillRect(this.x * C, this.y * C, C, C);

    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.floor(C * 0.7)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      DIRECTIONS[this.dir].label,
      this.x * C + C / 2,
      this.y * C + C / 2 + 1
    );
  }
}