class DynamicWall {
  constructor({ x, y, dir = 'down', min = null, max = null, steps = null }) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.min = min;
    this.max = max;
    this.steps = steps;         
  }

  clone() {
    return new DynamicWall({
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

  // true, если стена ещё может двигаться
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

    // потратили шаг
    if (this.steps !== null) this.steps -= 1;
  }

  render(ctx, C) {
    //потом убрать
    ctx.fillStyle = '#7a7a90';
    ctx.fillRect(this.x * C, this.y * C, C, C);

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.font = `${Math.floor(C * 0.5)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      DIRECTIONS[this.dir].label,
      this.x * C + C / 2,
      this.y * C + C / 2 + 1
    );
  }
}