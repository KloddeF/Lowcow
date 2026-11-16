class Game {
    constructor(canvas, level) {
        this.canvas = canvas;

        const dpr = window.devicePixelRatio || 1;
        const logicalW = CONFIG.COLS * CONFIG.CELL;
        const logicalH = CONFIG.ROWS * CONFIG.CELL;

        canvas.width = logicalW * dpr;
        canvas.height = logicalH * dpr;
        canvas.style.width = logicalW + 'px';
        canvas.style.height = logicalH + 'px';

        this.ctx = canvas.getContext('2d');
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.level = level.clone();
        this.cow = this.level.cow.clone();
        this.cow.dir = this.level.startDir;
        this.cups = this.level.cups.map(c => ({ ...c }));
        this.walls = this.level.walls.map(w => w.clone());
        this.arrows = this.level.arrows.map(a => a.clone());
        this.arrowsAllowed = this.level.arrowsAllowed;

        // новые сущности
        this.pits = this.level.pits.map(p => p.clone());
        this.dynamicWalls = this.level.dynamicWalls.map(w => w.clone());
        this.negativeCows = this.level.negativeCows.map(n => n.clone());

        this.collected = new Set();

        this.running = false;
        this.won = false;
        this.lost = false;
        this.loseReason = null;
        this.selectedDir = null;
        this.timerId = null;

        this._listeners = [];
        this._winListeners = [];
        this._loseListeners = [];

        this.render();
    }

    onChange(fn) { this._listeners.push(fn); return this; }
    onWin(fn) { this._winListeners.push(fn); return this; }
    onLose(fn) { this._loseListeners.push(fn); return this; }
    _emit() { for (const fn of this._listeners) fn(this); }
    _emitWin() { for (const fn of this._winListeners) fn(this); }
    _emitLose() { for (const fn of this._loseListeners) fn(this); }

    get arrowsLeft() { return this.arrowsAllowed - this.arrows.length; }
    get cupsTotal() { return this.cups.length; }
    get cupsCollected() { return this.collected.size; }

    isWall(x, y) { return this.walls.some(w => w.isAt(x, y)); }
    arrowAt(x, y) { return this.arrows.find(a => a.isAt(x, y)) || null; }

    dynamicWallAt(x, y) { return this.dynamicWalls.find(w => w.isAt(x, y)) || null; }
    pitAt(x, y) { return this.pits.find(p => p.isAt(x, y)) || null; }
    negativeCowAt(x, y) { return this.negativeCows.find(n => n.isAt(x, y)) || null; }

    cupIndexAt(x, y) { return this.cups.findIndex(c => c.x === x && c.y === y); }
    isCupAt(x, y) { return this.cupIndexAt(x, y) !== -1; }
    isCupCollected(i) { return this.collected.has(i); }

    canPlaceArrow(x, y) {
        if (this.running || this.won || this.lost) return false;
        if (x < 0 || x >= CONFIG.COLS || y < 0 || y >= CONFIG.ROWS) return false;
        if (this.isWall(x, y)) return false;
        if (this.arrowAt(x, y)) return false;
        if (this.cow.isAt(x, y)) return false;
        if (this.isCupAt(x, y)) return false;
        if (this.arrowsLeft <= 0) return false;
        return true;
    }

    setSelectedDir(dir) {
        this.selectedDir = (this.selectedDir === dir) ? null : dir;
        this._emit();
    }

    placeArrow(x, y, dir = this.selectedDir) {
        if (!dir || !this.canPlaceArrow(x, y)) return false;
        this.arrows.push(new Arrow({ x, y, dir }));
        this.render(); this._emit();
        return true;
    }

    removeArrow(x, y) {
        if (this.running || this.won || this.lost) return false;
        const i = this.arrows.findIndex(a => a.isAt(x, y));
        if (i === -1) return false;
        this.arrows.splice(i, 1);
        this.render(); this._emit();
        return true;
    }

    handleCellClick(x, y) {
        if (this.running || this.won || this.lost) return;
        if (this.arrowAt(x, y)) { this.removeArrow(x, y); return; }
        if (this.selectedDir) this.placeArrow(x, y, this.selectedDir);
    }

    start() {
        if (this.running || this.won || this.lost) return;
        this.running = true;
        const vec = DIRECTIONS[this.cow.dir];
        this.timerId = setInterval(() => this._step(vec), CONFIG.TICK_MS);
        this._emit();
    }

    stop() {
        if (this.timerId) { clearInterval(this.timerId); this.timerId = null; }
        if (this.running) { this.running = false; this._emit(); }
    }

    _lose(reason) {
        if (this.lost || this.won) return;
        this.lost = true;
        this.loseReason = reason;
        this.stop();
        this.render();
        this._emitLose();
    }

    _step(vec) {
        if (this.lost || this.won) return;

        for (const w of this.dynamicWalls) w.move();
        for (const n of this.negativeCows) n.move();

        // злая корова приехала на клетку коровы - проигрыш
        if (this.negativeCowAt(this.cow.x, this.cow.y)) { this._lose('negativeCow'); return; }

        const nx = this.cow.x + vec.dx;
        const ny = this.cow.y + vec.dy;

        if (nx < 0 || nx >= CONFIG.COLS || ny < 0 || ny >= CONFIG.ROWS) { this.stop(); return; }
        if (this.isWall(nx, ny)) { this.stop(); return; }
        if (this.dynamicWallAt(nx, ny)) { this.stop(); return; }

        this.cow.x = nx;
        this.cow.y = ny;

        if (this.pitAt(nx, ny)) { this._lose('pit'); return; }
        if (this.negativeCowAt(nx, ny)) { this._lose('negativeCow'); return; }

        //сбор кубка
        const cupIdx = this.cupIndexAt(nx, ny);
        if (cupIdx !== -1 && !this.isCupCollected(cupIdx)) {
            this.collected.add(cupIdx);
            this._emit();
        }

        this.render();

        if (this.collected.size === this.cups.length) {
            this.won = true;
            this.stop();
            this._emitWin();
            return;
        }

        const arrow = this.arrowAt(this.cow.x, this.cow.y);
        if (arrow) {
            this.cow.dir = arrow.dir;
            const newVec = DIRECTIONS[arrow.dir];
            clearInterval(this.timerId);
            this.timerId = setInterval(() => this._step(newVec), CONFIG.TICK_MS);
        }
    }

    render() {
        const ctx = this.ctx;
        const C = CONFIG.CELL;
        const logicalW = CONFIG.COLS * C;
        const logicalH = CONFIG.ROWS * C;

        // фон
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(0, 0, logicalW, logicalH);

        // сетка
        ctx.strokeStyle = '#33334a';
        ctx.lineWidth = 1;
        for (let x = 0; x <= CONFIG.COLS; x++) {
            ctx.beginPath();
            ctx.moveTo(x * C + 0.5, 0);
            ctx.lineTo(x * C + 0.5, logicalH);
            ctx.stroke();
        }
        for (let y = 0; y <= CONFIG.ROWS; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * C + 0.5);
            ctx.lineTo(logicalW, y * C + 0.5);
            ctx.stroke();
        }

        // кубки
        for (let i = 0; i < this.cups.length; i++) {
            if (this.collected.has(i)) continue;
            const c = this.cups[i];
            ctx.beginPath();
            ctx.arc(c.x * C + C / 2, c.y * C + C / 2, C * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = '#f2c94c';
            ctx.fill();
        }

        for (const p of this.pits) p.render(ctx, C);
        for (const w of this.dynamicWalls) w.render(ctx, C);
        for (const n of this.negativeCows) n.render(ctx, C);
        for (const w of this.walls) w.render(ctx, C);
        for (const a of this.arrows) a.render(ctx, C);

        this.cow.render(ctx, C);

        console.log('[render]', {
            cow: { x: this.cow.x, y: this.cow.y, dir: this.cow.dir },
            running: this.running,
            lost: this.lost,
            cups: `${this.collected.size}/${this.cups.length}`,
        });
    }
}