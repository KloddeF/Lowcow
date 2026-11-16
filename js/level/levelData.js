const LEVELS = [
  // =========== Уровень 1 ===========
  {
    id: 1,
    name: 'Уровень 1',
    cow: { x: 2, y: 10 },
    cups: [{ x: 11, y: 10 }],
    startDir: 'right',
    walls: [
      { x: 6, y: 10 },
      { x: 6, y: 9 },
    ],
    arrowsAllowed: 3,
    arrows: [],
    pits: [],
    dynamicWalls: [],
    negativeCows: [],
  },

  // =========== Уровень 2 ===========
  {
    id: 2,
    name: 'Уровень 2',
    cow: { x: 2, y: 17 },
    cups: [
      { x: 11, y: 2 },
      { x: 11, y: 13 },
      { x: 2, y: 5 },
    ],
    startDir: 'up',
    walls: [
      // горизонтальная стена сверху
      { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 },
      { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 9, y: 4 },
      { x: 10, y: 4 }, { x: 11, y: 4 }, { x: 12, y: 4 },

      // горизонтальная стена снизу
      { x: 4, y: 15 }, { x: 5, y: 15 }, { x: 6, y: 15 },
      { x: 7, y: 15 }, { x: 8, y: 15 }, { x: 9, y: 15 },
      { x: 10, y: 15 }, { x: 11, y: 15 }, { x: 12, y: 15 },

      // вертикальный столб
      { x: 7, y: 8 }, { x: 7, y: 9 },
      { x: 7, y: 10 }, { x: 7, y: 11 },

      // горизонтальная стена посередине
      { x: 1, y: 9 }, { x: 2, y: 10 }, { x: 3, y: 9 },
      { x: 4, y: 10 }, { x: 5, y: 9 }, { x: 6, y: 10 },
    ],
    arrowsAllowed: 5,
    arrows: [{ x: 11, y: 7, dir: 'left' }],
    pits: [],
    dynamicWalls: [],
    negativeCows: [],
  },

  // =========== Уровень 3  ===========
  {
    id: 3,
    name: 'Уровень 3 - Ямы',
    cow: { x: 2, y: 17 },
    cups: [
      { x: 11, y: 2 },
    ],
    startDir: 'right',
    walls: [
      { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 7, y: 14 },
      { x: 5, y: 6 },  { x: 6, y: 6 },  { x: 7, y: 6 },
    ],
    arrowsAllowed: 3,
    arrows: [],
    pits: [
      { x: 4, y: 17 },
      { x: 9, y: 17 },
      { x: 4, y: 2 },
      { x: 9, y: 2 },
    ],
    dynamicWalls: [],
    negativeCows: [],
  },

  // =========== Уровень 4  ===========
  {
    id: 4,
    name: 'Уровень 4 - Движуха',
    cow: { x: 2, y: 10 },
    cups: [
      { x: 11, y: 10 },
    ],
    startDir: 'right',
    walls: [
      { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 },
      { x: 6, y: 16 }, { x: 6, y: 17 }, { x: 6, y: 18 },
    ],
    arrowsAllowed: 3,
    arrows: [],
    pits: [],
    dynamicWalls: [
      { x: 6, y: 5, dir: 'down', steps: 5},
      { x: 9, y: 15, dir: 'up', steps: 5 },
    ],
    negativeCows: [],
  },

  // =========== Уровень 5  ===========
  {
    id: 5,
    name: 'Уровень 5 - ОСТОРОЖНО ЗЛЫЕ КОРОВЫ (ОЧЕНЬ СЛОЖНЫЙ УРОВНЕНЬ)',
    cow: { x: 2, y: 17 },
    cups: [
      { x: 11, y: 2 },
      { x: 11, y: 17 },
    ],
    startDir: 'up',
    walls: [
      { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 },
      { x: 7, y: 8 }, { x: 8, y: 8 }, { x: 9, y: 8 },

      { x: 4, y: 12 }, { x: 5, y: 12 }, { x: 6, y: 12 },
      { x: 7, y: 12 }, { x: 8, y: 12 }, { x: 9, y: 12 },
    ],
    arrowsAllowed: 7,
    arrows: [],
    pits: [
      { x: 2, y: 14 },
      { x: 11, y: 8 },
    ],
    negativeCows: [
      { x: 9, y: 10, dir: 'left', steps: 8 },
      { x: 4, y: 14, dir: 'right', steps: 8 },
    ],
  },
];