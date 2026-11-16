class Level {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.cow = new Cow(data.cow);
    this.cups = data.cups.map(c => ({ ...c }));
    this.startDir = data.startDir || 'right';
    this.arrowsAllowed = data.arrowsAllowed;

    this.walls = Level.borderWalls(data.walls || []);
    this.arrows = (data.arrows || []).map(a => new Arrow(a));

    this.pits = (data.pits || []).map(p => new Pit(p));
    this.dynamicWalls = (data.dynamicWalls || []).map(w => new DynamicWall(w));
    this.negativeCows = (data.negativeCows || []).map(n => new NegativeCow(n));
  }

  clone() {
    return new Level({
      id: this.id,
      name: this.name,
      cow: this.cow.toJSON(),
      cups: this.cups.map(c => ({ ...c })),
      startDir: this.startDir,
      walls: this.walls.map(w => w.toJSON()),
      arrows: this.arrows.map(a => a.toJSON()),
      arrowsAllowed: this.arrowsAllowed,
      pits: this.pits.map(p => p.toJSON()),
      dynamicWalls: this.dynamicWalls.map(w => w.toJSON()),
      negativeCows: this.negativeCows.map(n => n.toJSON()),
    });
  }

  get cupsTotal() { return this.cups.length; }

  static borderWalls(extraWalls = []) {
    const walls = [];
    const seen = new Set();

    const push = (x, y) => {
      const key = `${x},${y}`;
      if (seen.has(key)) return;
      seen.add(key);
      walls.push(new Wall({ x, y }));
    };

    for (let x = 0; x < CONFIG.COLS; x++) {
      push(x, 0);
      push(x, CONFIG.ROWS - 1);
    }
    for (let y = 1; y < CONFIG.ROWS - 1; y++) {
      push(0, y);
      push(CONFIG.COLS - 1, y);
    }
    for (const w of extraWalls) push(w.x, w.y);

    return walls;
  }
}