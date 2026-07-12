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
];
