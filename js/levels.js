// Definicije nivoa. Sve koordinate su u world prostoru (1280x720).
// pipe.dir — smer u kome je okrenut otvor cevi ('down' = cev visi sa vrha ekrana,
// 'left' = cev ulazi sa desne ivice).

export const LEVELS = [
  {
    id: 'toranj',
    name: 'Prvi toranj',
    sub: 'Gradi uvis, kuglica po kuglica.',
    required: 4,
    total: 14,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
    ],
    killY: 1000,
    pipe: { x: 640, y: 165, dir: 'down' },
    initial: {
      nodes: [[570, 645], [710, 645], [640, 535]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#7ec8e3', '#cfeecf'],
    hills: [
      { color: '#8fbf6a', y: 560, amp: 55, freq: 1.6 },
      { color: '#6ca84f', y: 610, amp: 35, freq: 2.3 },
    ],
    ground: '#4a7a35',
    groundTop: '#5d9442',
  },
  {
    id: 'provalija',
    name: 'Provalija',
    sub: 'Premosti jaz — pazi da se most ne sruči.',
    required: 5,
    total: 20,
    platforms: [
      { x: -200, y: 600, w: 640, h: 320 },   // leva strana (do x=440)
      { x: 840, y: 600, w: 640, h: 320 },    // desna strana
    ],
    killY: 880,
    pipe: { x: 985, y: 475, dir: 'left' },
    initial: {
      nodes: [[290, 585], [420, 585], [355, 478]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#e8a87c', '#f7e3b0'],
    hills: [
      { color: '#c98a5e', y: 540, amp: 60, freq: 1.4 },
      { color: '#a86f47', y: 590, amp: 40, freq: 2.1 },
    ],
    ground: '#7a5230',
    groundTop: '#94663e',
  },
  {
    id: 'do-neba',
    name: 'Do neba',
    sub: 'Uzak oslonac, visok cilj. Ravnoteža je sve.',
    required: 6,
    total: 18,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
      { x: 555, y: 590, w: 170, h: 80 },     // uski pijedestal
    ],
    killY: 1000,
    pipe: { x: 640, y: 100, dir: 'down' },
    initial: {
      nodes: [[578, 575], [702, 575], [640, 470]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#3d4a7a', '#8a6f9e'],
    hills: [
      { color: '#4a3d66', y: 570, amp: 65, freq: 1.3 },
      { color: '#3a2f52', y: 615, amp: 40, freq: 2.0 },
    ],
    ground: '#2c2440',
    groundTop: '#3b3054',
  },
  {
    id: 'most-preko-reke',
    name: 'Most preko reke',
    sub: 'Široka reka. Gradi most na drugu obalu.',
    required: 7,
    total: 20,
    platforms: [
      { x: -200, y: 610, w: 620, h: 320 },   // leva obala (do x=420)
      { x: 900, y: 610, w: 580, h: 320 },    // desna obala (od x=900)
    ],
    killY: 900,
    pipe: { x: 930, y: 555, dir: 'left' },
    initial: {
      nodes: [[270, 596], [390, 596], [330, 492]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#6fb7c4', '#bfe6d9'],
    hills: [
      { color: '#3f8f8a', y: 520, amp: 50, freq: 1.5 },
      { color: '#2f6f6a', y: 575, amp: 35, freq: 2.2 },
    ],
    ground: '#2c5a55',
    groundTop: '#3d7a72',
  },
  {
    id: 'duboki-kanjon',
    name: 'Duboki kanjon',
    sub: 'Još širi jaz — i dve obale na različitoj visini.',
    required: 8,
    total: 20,
    platforms: [
      { x: -200, y: 560, w: 560, h: 380 },   // leva, viša obala (do x=360)
      { x: 920, y: 620, w: 560, h: 300 },    // desna, niža obala (od x=920)
    ],
    killY: 900,
    pipe: { x: 990, y: 560, dir: 'left' },
    initial: {
      nodes: [[210, 546], [330, 546], [270, 442]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#d98c5a', '#f3d199'],
    hills: [
      { color: '#b06a3a', y: 490, amp: 55, freq: 1.4 },
      { color: '#8f5228', y: 550, amp: 38, freq: 2.0 },
    ],
    ground: '#7a4a28',
    groundTop: '#96602f',
  },
  {
    id: 'nebeski-toranj',
    name: 'Nebeski toranj',
    sub: 'Uzan pijedestal, cev visoko u oblacima.',
    required: 9,
    total: 19,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
      { x: 585, y: 560, w: 110, h: 100 },    // uzan pijedestal
    ],
    killY: 1000,
    pipe: { x: 640, y: 110, dir: 'down' },
    initial: {
      nodes: [[600, 545], [680, 545], [640, 448]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#8fb8e8', '#e8f2ff'],
    hills: [
      { color: '#a9c4e0', y: 560, amp: 60, freq: 1.3 },
      { color: '#8fb0d4', y: 610, amp: 38, freq: 2.0 },
    ],
    ground: '#5f7a9a',
    groundTop: '#7a94b4',
  },
  {
    id: 'preko-zida',
    name: 'Preko zida',
    sub: 'Zid na putu — popni se i pređi preko njega.',
    required: 10,
    total: 20,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
      { x: 560, y: 360, w: 180, h: 300 },    // visok zid (prepreka)
    ],
    killY: 1000,
    pipe: { x: 900, y: 450, dir: 'left' },
    initial: {
      nodes: [[340, 645], [460, 645], [400, 540]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#5a4a7a', '#b08fb0'],
    hills: [
      { color: '#4a3a66', y: 560, amp: 60, freq: 1.4 },
      { color: '#382a52', y: 610, amp: 40, freq: 2.1 },
    ],
    ground: '#2e2444',
    groundTop: '#40355c',
  },
  {
    id: 'veliki-ambis',
    name: 'Veliki ambis',
    sub: 'Najširi ponor i cev visoko. Ni jedna kap suvišna.',
    required: 11,
    total: 20,
    platforms: [
      { x: -200, y: 600, w: 540, h: 320 },   // leva ivica (do x=340)
      { x: 940, y: 600, w: 540, h: 320 },    // desna ivica (od x=940)
    ],
    killY: 900,
    pipe: { x: 995, y: 445, dir: 'left' },
    initial: {
      nodes: [[190, 586], [310, 586], [250, 482]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#7a3a3a', '#c47a5a'],
    hills: [
      { color: '#5a2828', y: 520, amp: 60, freq: 1.3 },
      { color: '#3e1a1a', y: 575, amp: 42, freq: 2.0 },
    ],
    ground: '#3a1e18',
    groundTop: '#5a2e22',
  },
];
