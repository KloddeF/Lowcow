class Pit {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  clone() { return new Pit({ x: this.x, y: this.y }); }
  toJSON() { return { x: this.x, y: this.y }; }
  isAt(x, y) { return this.x === x && this.y === y; }

  render(ctx, C) {
    //потом убрать
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(this.x * C, this.y * C, C, C);
  }
}