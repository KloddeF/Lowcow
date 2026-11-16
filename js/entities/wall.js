class Wall {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Wall({ x: this.x, y: this.y });
  }

  toJSON() {
    return { x: this.x, y: this.y };
  }

  isAt(x, y) {
    return this.x === x && this.y === y;
  }

  render(ctx, C) {
    ctx.fillStyle = '#555568';
    ctx.fillRect(this.x * C, this.y * C, C, C);
  }
}