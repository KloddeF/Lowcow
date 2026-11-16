class NegativeCow {
  constructor({ x, y, dir = 'down', min = null, max = null, steps = null }) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.min = min;
    this.max = max;
    this.steps = steps;           
  }

  clone() {
    return new NegativeCow({
      x: this.x, y: this.y, dir: this.dir,
      min: this.min, max: this.max, steps: this.steps,
    });
  }

  toJSON() {
    return {
      x: this.x, y: this.y, dir: this.dir,
      min: this.min, max: this.max, steps: this.steps,
    };
  }

  isAt(x, y) { return this.x === x && this.y === y; }

  canMove() {
    if (this.steps !== null && this.steps <= 0) return false;
    return true;
  }

  move() {
    if (!this.canMove()) return;

    const v = DIRECTIONS[this.dir];
    const nx = this.x + v.dx;
    const ny = this.y + v.dy;

    const lo = this.min ?? 1;
    const hi = this.max ?? (this.dir === 'up' || this.dir === 'down'
      ? CONFIG.ROWS - 2
      : CONFIG.COLS - 2);

    const pos = (v.dx !== 0) ? nx : ny;
    if (pos < lo || pos > hi) return;

    this.x = nx;
    this.y = ny;

    if (this.steps !== null) this.steps -= 1;
  }

  render(ctx, C) {
    //потом убрать
    ctx.fillStyle = '#b33a3a';
    ctx.fillRect(this.x * C + 3, this.y * C + 3, C - 6, C - 6);
  }
}