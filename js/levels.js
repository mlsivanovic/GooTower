// Definicije nivoa. Sve koordinate su u world prostoru (1280x720).
// pipe.dir — smer u kome je okrenut otvor cevi ('down' = cev visi sa vrha ekrana,
// 'left' = cev ulazi sa desne ivice).

export const LEVELS = [
  {
    id: 'toranj',
    name: 'Prvi toranj',
    sub: 'Gradi uvis, kuglica po kuglica.',
    decor: { sun: { x: 1050, y: 120, warm: true }, clouds: 4 },
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
    decor: { sun: { x: 1000, y: 140, warm: true }, clouds: 3, particles: 'leaves' },
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
    decor: { sun: { x: 1080, y: 100, warm: false }, stars: 36, clouds: 2 },
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
    decor: { sun: { x: 1040, y: 130, warm: true }, clouds: 5 },
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
    sub: 'Širok jaz — oslonac na steni po sredini pomaže.',
    decor: { sun: { x: 1060, y: 110, warm: true }, clouds: 2, props: [{ type: 'ruin', x: 1130, y: 620, s: 60 }] },
    required: 8,
    total: 22,
    platforms: [
      { x: -200, y: 560, w: 560, h: 380 },   // leva, viša obala (do x=360)
      { x: 920, y: 620, w: 560, h: 300 },    // desna, niža obala (od x=920)
      { x: 560, y: 585, w: 150, h: 360 },    // stena-oslonac na sredini jaza
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
    decor: { sun: { x: 1050, y: 120, warm: true }, clouds: 7 },
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
    decor: { sun: { x: 1080, y: 110, warm: false }, stars: 26, clouds: 2 },
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
    sub: 'Najširi ponor — preko jedne stene na sredini do cevi.',
    decor: { sun: null, particles: 'embers', props: [{ type: 'ruin', x: 120, y: 590, s: 55 }] },
    required: 12,
    total: 26,
    platforms: [
      { x: -200, y: 600, w: 540, h: 320 },   // leva ivica (do x=340)
      { x: 940, y: 600, w: 540, h: 320 },    // desna ivica (od x=940)
      { x: 580, y: 560, w: 120, h: 400 },    // stena-oslonac na sredini (jedan raspon ~240px sa svake strane)
    ],
    killY: 900,
    pipe: { x: 995, y: 520, dir: 'left' },
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
  {
    // inspirisano: "Tower of Goo" — klasična visoka kula
    id: 'kula-od-kuglica',
    name: 'Kula od kuglica',
    sub: 'Klasik: gradi visoku kulu do cevi u oblacima.',
    decor: { sun: { x: 1050, y: 120, warm: true }, clouds: 4, particles: 'leaves' },
    required: 13,
    total: 28,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
    ],
    killY: 1000,
    wind: 45,
    pipe: { x: 640, y: 118, dir: 'down' },
    initial: {
      nodes: [[560, 645], [720, 645], [640, 548]],
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
    // inspirisano: "Impale Sticky" — provlačenje pored sečiva
    id: 'nabij-na-trn',
    name: 'Nabij na trn',
    sub: 'Provuci konstrukciju kroz procep — sečivo = kraj.',
    decor: { sun: { x: 1030, y: 130, warm: true }, clouds: 3 },
    required: 8,
    total: 20,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
      { x: 250, y: 520, w: 150, h: 140 },    // pijedestal (polazna greda)
    ],
    killY: 1000,
    pipe: { x: 905, y: 485, dir: 'left' },
    hazards: [
      { x: 610, y: 405, r: 40 },            // gornje sečivo
      { x: 610, y: 565, r: 40 },            // donje sečivo (procep između njih)
    ],
    initial: {
      nodes: [[285, 505], [375, 505], [330, 412]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#9ad0c0', '#dff0d0'],
    hills: [
      { color: '#5aa885', y: 545, amp: 52, freq: 1.5 },
      { color: '#3f8062', y: 600, amp: 34, freq: 2.2 },
    ],
    ground: '#356b4a',
    groundTop: '#478a5e',
  },
  {
    // inspirisano: "Hang Low" — cev je dole, gradi naniže sa tavanice
    id: 'visi-nisko',
    name: 'Visi nisko',
    sub: 'Cev je dole. Spusti se sa tavanice pravo do nje.',
    decor: { sun: null, stars: 30 },
    required: 9,
    total: 20,
    platforms: [
      { x: -200, y: -40, w: 1680, h: 200 },  // tavanica (donja ivica y=160)
      { x: -200, y: 620, w: 1680, h: 300 },  // pod
    ],
    killY: 1050,
    pipe: { x: 640, y: 560, dir: 'up' },
    initial: {
      nodes: [[560, 176], [720, 176], [640, 280]],
      struts: [[0, 1], [0, 2], [1, 2]],
      fixed: [0, 1],                         // zakovani za tavanicu
    },
    sky: ['#2a2f3a', '#4a5260'],
    hills: [
      { color: '#333a47', y: 560, amp: 40, freq: 1.4 },
      { color: '#252b36', y: 610, amp: 28, freq: 2.0 },
    ],
    ground: '#1c2029',
    groundTop: '#2b313d',
  },
  {
    // inspirisano: vetroviti nivoi (WoG2) — vetar nosi konstrukciju
    id: 'vetrometina',
    name: 'Vetrometina',
    sub: 'Jak vetar nosi kulu — pusti ga da te odnese do cevi.',
    decor: { sun: null, clouds: 7, particles: 'leaves' },
    required: 10,
    total: 24,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
    ],
    killY: 1000,
    wind: 300,
    pipe: { x: 850, y: 250, dir: 'down' },
    initial: {
      nodes: [[300, 645], [420, 645], [360, 548]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#5a6072', '#9aa0b4'],
    hills: [
      { color: '#4a5064', y: 555, amp: 66, freq: 1.5 },
      { color: '#363b4d', y: 610, amp: 42, freq: 2.1 },
    ],
    ground: '#2a2e3c',
    groundTop: '#3c4152',
  },
  {
    // inspirisano: "Cog in the Machine" — fabrika: jaz, šiljci, fiksni oslonci
    id: 'zupcanik-u-masini',
    name: 'Zupčanik u mašini',
    sub: 'Most između oslonaca, iznad šiljaka i pored sečiva.',
    decor: {
      sun: { x: 160, y: 130, warm: false }, particles: 'embers', clouds: 2,
      props: [{ type: 'chimney', x: 1160, y: 560, s: 50 }, { type: 'gear', x: 110, y: 500, s: 65 }],
    },
    required: 11,
    total: 24,
    platforms: [
      { x: -200, y: 560, w: 500, h: 360 },   // leva obala (ivica x=300)
      { x: 980, y: 560, w: 500, h: 360 },    // desna obala (ivica x=980)
    ],
    killY: 760,
    pipe: { x: 1060, y: 435, dir: 'left' },
    hazards: [
      { x: 640, y: 470, r: 44 },             // sečivo na sredini mosta
      { x: 420, y: 648, r: 34 },             // red šiljaka na dnu jaza
      { x: 560, y: 648, r: 34 },
      { x: 720, y: 648, r: 34 },
      { x: 860, y: 648, r: 34 },
    ],
    initial: {
      nodes: [[220, 545], [300, 545], [260, 448], [1000, 545]],
      struts: [[0, 1], [0, 2], [1, 2]],
      fixed: [3],                            // fiksni oslonac na desnoj obali
    },
    sky: ['#6a5a4a', '#b0967a'],
    hills: [
      { color: '#4a4038', y: 520, amp: 55, freq: 1.4 },
      { color: '#332c26', y: 575, amp: 38, freq: 2.0 },
    ],
    ground: '#2c2620',
    groundTop: '#4a3e30',
  },
  {
    // inspirisano: "Fly Away Little Ones" — uvodni balon nivo (predah)
    id: 'prvi-let',
    name: 'Prvi let',
    sub: 'Baloni dižu sve! Zakači ih i poleti do cevi.',
    required: 6,
    total: 16,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
    ],
    killY: 1000,
    pipe: { x: 640, y: 150, dir: 'down' },
    balloons: [[380, 645], [500, 645], [880, 645]],
    initial: {
      nodes: [[570, 645], [710, 645], [640, 540]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#8fd0e8', '#d8f0c8'],
    hills: [
      { color: '#90c46e', y: 555, amp: 55, freq: 1.6 },
      { color: '#6fa851', y: 608, amp: 35, freq: 2.3 },
    ],
    ground: '#4a7a38',
    groundTop: '#5f9646',
    decor: { sun: { x: 1060, y: 120, warm: true }, clouds: 5 },
  },
  {
    // inspirisano: "Flying Machine" — leteći splav preko ponora
    id: 'leteca-masina',
    name: 'Leteća mašina',
    sub: 'Splav od greda + baloni + povetarac = let preko ponora.',
    required: 8,
    total: 18,
    platforms: [
      { x: -200, y: 600, w: 560, h: 320 },   // leva obala (ivica x=360)
      { x: 1000, y: 600, w: 480, h: 320 },   // desna obala
    ],
    killY: 880,
    wind: 120,
    pipe: { x: 1045, y: 330, dir: 'left' },
    balloons: [[60, 585], [110, 585], [160, 585], [210, 585]],
    initial: {
      nodes: [[230, 585], [340, 585], [285, 482]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#79b8dc', '#d8ecf4'],
    hills: [
      { color: '#6898b8', y: 540, amp: 55, freq: 1.4 },
      { color: '#4e7894', y: 592, amp: 38, freq: 2.1 },
    ],
    ground: '#3c5a70',
    groundTop: '#4e7590',
    decor: { sun: { x: 1050, y: 110, warm: true }, clouds: 6 },
  },
  {
    // inspirisano: "Ivy Towers" — obilazak prepusta
    id: 'brsljanove-kule',
    name: 'Bršljanove kule',
    sub: 'Polica ti je na putu — obiđi je pa se popni na nju.',
    required: 9,
    total: 20,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
      { x: 420, y: 300, w: 340, h: 56 },     // prepust (polica) iznad starta
    ],
    killY: 1000,
    pipe: { x: 590, y: 130, dir: 'down' },
    initial: {
      nodes: [[560, 645], [700, 645], [630, 540]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#a8c87a', '#e8e8b0'],
    hills: [
      { color: '#7fa055', y: 550, amp: 58, freq: 1.5 },
      { color: '#5f8040', y: 605, amp: 36, freq: 2.2 },
    ],
    ground: '#44652e',
    groundTop: '#587f3c',
    decor: { sun: { x: 1040, y: 130, warm: true }, clouds: 3, particles: 'leaves' },
  },
  {
    // inspirisano: "Chain" — viseći lanac između dva fiksna oslonca
    id: 'lanac',
    name: 'Lanac',
    sub: 'Razvuci lanac između oslonaca — cev čeka na sredini.',
    required: 10,
    total: 20,
    platforms: [
      { x: -200, y: 560, w: 480, h: 360 },   // leva litica (ivica x=280)
      { x: 1000, y: 560, w: 480, h: 360 },   // desna litica
    ],
    killY: 800,
    pipe: { x: 640, y: 420, dir: 'down' },
    initial: {
      nodes: [[100, 545], [210, 545], [155, 450], [272, 545], [1008, 545]],
      struts: [[0, 1], [0, 2], [1, 2], [1, 3]],
      fixed: [3, 4],                         // zakovani oslonci na obe litice
    },
    sky: ['#d09a6a', '#f0d8a8'],
    hills: [
      { color: '#a87848', y: 505, amp: 58, freq: 1.4 },
      { color: '#875c34', y: 560, amp: 40, freq: 2.0 },
    ],
    ground: '#6e4526',
    groundTop: '#8a5a32',
    decor: { sun: { x: 200, y: 160, warm: true }, clouds: 2, props: [{ type: 'ruin', x: 1140, y: 560, s: 58 }] },
  },
  {
    // inspirisano: "Misty's Long Bumpy Road" — nizak most preko trnja
    id: 'trnovit-put',
    name: 'Trnovit put',
    sub: 'Nisko i dugačko — most preko trnja, ispod tavanice.',
    required: 10,
    total: 22,
    platforms: [
      { x: -200, y: -40, w: 1680, h: 420 },  // tavanica (donja ivica y=380)
      { x: -200, y: 620, w: 1680, h: 300 },  // pod
    ],
    killY: 1000,
    pipe: { x: 1080, y: 520, dir: 'left' },
    hazards: [
      { x: 420, y: 615, r: 30 },
      { x: 540, y: 615, r: 30 },
      { x: 660, y: 615, r: 30 },
      { x: 780, y: 615, r: 30 },
      { x: 900, y: 615, r: 30 },
    ],
    initial: {
      nodes: [[160, 605], [280, 605], [220, 502]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#3a4a3a', '#5c6e50'],
    hills: [
      { color: '#2e402e', y: 540, amp: 45, freq: 1.5 },
      { color: '#243424', y: 590, amp: 30, freq: 2.2 },
    ],
    ground: '#1e2c1e',
    groundTop: '#2c402c',
    decor: { sun: null, stars: 12, particles: 'leaves' },
  },
  {
    // inspirisano: "Upper Shaft" — penjanje uz uski vertikalni šaht
    id: 'uspinjaca',
    name: 'Uspinjača',
    sub: 'Uzak šaht, sečivo na pola puta. Penji se pažljivo.',
    required: 11,
    total: 22,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },  // pod
      { x: 200, y: 100, w: 130, h: 560 },    // levi zid šahta
      { x: 640, y: 100, w: 130, h: 560 },    // desni zid šahta
    ],
    killY: 1000,
    pipe: { x: 485, y: 130, dir: 'down' },
    hazards: [
      { x: 350, y: 360, r: 36 },             // sečivo viri iz levog zida
    ],
    initial: {
      nodes: [[420, 645], [540, 645], [480, 548]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#4a4a5a', '#7a7a8a'],
    hills: [
      { color: '#3c3c4a', y: 545, amp: 48, freq: 1.4 },
      { color: '#30303c', y: 595, amp: 32, freq: 2.1 },
    ],
    ground: '#26262e',
    groundTop: '#383844',
    decor: {
      sun: null, particles: 'snow',
      props: [{ type: 'gear', x: 120, y: 590, s: 55 }, { type: 'gear', x: 1150, y: 570, s: 75 }],
    },
  },
  {
    // inspirisano: vetroviti WoG2 nivoi — baloni + jak vetar u leđa
    id: 'vetar-u-ledja',
    name: 'Vetar u leđa',
    sub: 'Digni se balonima i pusti vetar da te odnese do cevi.',
    required: 12,
    total: 24,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
    ],
    killY: 1000,
    wind: 260,
    pipe: { x: 1060, y: 230, dir: 'down' },
    balloons: [[100, 645], [440, 645], [520, 645]],
    initial: {
      nodes: [[200, 645], [320, 645], [260, 548]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#7ab8d8', '#d8e8c0'],
    hills: [
      { color: '#6ba06e', y: 552, amp: 62, freq: 1.5 },
      { color: '#4f8254', y: 606, amp: 40, freq: 2.2 },
    ],
    ground: '#3a6240',
    groundTop: '#4c7e52',
    decor: { sun: { x: 1040, y: 120, warm: true }, clouds: 7, particles: 'leaves' },
  },
  {
    // inspirisano: "Cog in the Machine" — gradnja uz čeoni vetar, sečiva iza leđa
    id: 'fabricka-oluja',
    name: 'Fabrička oluja',
    sub: 'Vetar ti duva u lice i gura kulu nazad — ka sečivima.',
    required: 12,
    total: 24,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
    ],
    killY: 1000,
    wind: -220,
    pipe: { x: 1010, y: 480, dir: 'left' },
    hazards: [
      { x: 150, y: 540, r: 44 },
      { x: 255, y: 635, r: 32 },
    ],
    initial: {
      nodes: [[380, 645], [500, 645], [440, 548]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#4a3a44', '#8a6a70'],
    hills: [
      { color: '#3c3038', y: 540, amp: 55, freq: 1.4 },
      { color: '#2e242c', y: 592, amp: 38, freq: 2.0 },
    ],
    ground: '#241c22',
    groundTop: '#362a32',
    decor: {
      sun: null, clouds: 4, particles: 'embers',
      props: [{ type: 'chimney', x: 1130, y: 660, s: 55 }, { type: 'gear', x: 80, y: 620, s: 60 }],
    },
  },
  {
    // inspirisano: "You Have to Explode the Head" — kroz procep sečiva, baloni za vrh
    id: 'poslednji-uzlet',
    name: 'Poslednji uzlet',
    sub: 'Provuci kulu između sečiva, pa je balonima diži do cevi.',
    required: 13,
    total: 24,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
    ],
    killY: 1000,
    pipe: { x: 640, y: 110, dir: 'down' },
    hazards: [
      { x: 450, y: 350, r: 48 },
      { x: 830, y: 350, r: 48 },
    ],
    balloons: [[240, 645], [1040, 645]],
    initial: {
      nodes: [[570, 645], [710, 645], [640, 545]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#f0a878', '#f8e0b8'],
    hills: [
      { color: '#c88858', y: 550, amp: 58, freq: 1.5 },
      { color: '#a06a40', y: 602, amp: 38, freq: 2.1 },
    ],
    ground: '#7a4c2c',
    groundTop: '#966038',
    decor: { sun: { x: 1080, y: 140, warm: true }, stars: 8, clouds: 4 },
  },
  {
    // veliko finale — oslonac + ponor + sečivo + vetar + baloni, sve zajedno
    id: 'veliko-finale',
    name: 'Veliko finale',
    sub: 'Ponor, sečivo, vetar i baloni — sve što znaš, odjednom.',
    required: 14,
    total: 26,
    platforms: [
      { x: -200, y: 600, w: 520, h: 320 },   // leva obala (ivica x=320)
      { x: 1020, y: 600, w: 460, h: 320 },   // desna obala
    ],
    killY: 820,
    wind: 120,
    pipe: { x: 1090, y: 330, dir: 'left' },
    hazards: [
      { x: 660, y: 500, r: 42 },             // sečivo lebdi na sredini ponora
    ],
    balloons: [[80, 585], [130, 585]],
    initial: {
      nodes: [[170, 585], [285, 585], [228, 488], [1030, 585]],
      struts: [[0, 1], [0, 2], [1, 2]],
      fixed: [3],                            // zakovani oslonac na desnoj obali
    },
    sky: ['#c05a4a', '#f0c080'],
    hills: [
      { color: '#94422e', y: 520, amp: 60, freq: 1.3 },
      { color: '#702e20', y: 575, amp: 42, freq: 2.0 },
    ],
    ground: '#4c1e14',
    groundTop: '#682e1e',
    decor: {
      sun: { x: 180, y: 120, warm: true }, clouds: 3, particles: 'embers',
      props: [{ type: 'ruin', x: 1160, y: 600, s: 60 }],
    },
  },
  {
    // voda iz WoG2 je polazna inspiracija; raspored i puzzle su originalni
    id: 'plutajuci-most',
    name: 'Plutajući most',
    sub: 'Ne bori se protiv vode — pretvori most u splav.',
    hint: 'Voda podiže čvorove i usporava pad. Široka, trouglasta konstrukcija pluta stabilnije.',
    required: 8,
    total: 18,
    platforms: [
      { x: -200, y: 600, w: 560, h: 320 },
      { x: 920, y: 530, w: 560, h: 390 },
    ],
    liquids: [{ type: 'water', x: 360, y: 470, w: 560, h: 250 }],
    killY: 980,
    pipe: { x: 1000, y: 410, dir: 'left' },
    initial: {
      nodes: [[190, 585], [320, 585], [255, 480]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#3b7f96', '#b7e0d2'],
    hills: [
      { color: '#3b7775', y: 515, amp: 55, freq: 1.5 },
      { color: '#28585c', y: 580, amp: 34, freq: 2.2 },
    ],
    ground: '#31594d',
    groundTop: '#4b8069',
    decor: {
      sun: { x: 1080, y: 110, warm: false }, clouds: 5,
      props: [{ type: 'roots', x: 90, y: 610, s: 48 }],
    },
  },
  {
    id: 'ventilacioni-kanal',
    name: 'Ventilacioni kanal',
    sub: 'Izgradi jedro i pusti vazduh da savije toranj ka cevi.',
    hint: 'Svetli pramenovi označavaju lokalnu vazdušnu struju. U njenoj zoni sila deluje i na konstrukciju.',
    required: 9,
    total: 20,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
      { x: 690, y: 420, w: 150, h: 240 },
    ],
    fans: [
      { x: 260, y: 90, w: 790, h: 520, fx: 560, fy: -540 },
    ],
    killY: 1000,
    pipe: { x: 1035, y: 245, dir: 'left' },
    initial: {
      nodes: [[180, 645], [320, 645], [250, 540]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#253645', '#617b86'],
    hills: [
      { color: '#293943', y: 535, amp: 46, freq: 1.4 },
      { color: '#1e2b33', y: 595, amp: 28, freq: 2.1 },
    ],
    ground: '#222b31',
    groundTop: '#43535b',
    decor: {
      sun: null, particles: 'snow',
      props: [{ type: 'pipes', x: 1080, y: 660, s: 64 }, { type: 'gear', x: 95, y: 570, s: 52 }],
    },
  },
  {
    id: 'cuvar-kapije',
    name: 'Čuvar kapije',
    sub: 'Prvo pritisni ploču, tek onda gradi kroz prolaz.',
    hint: 'Narandžasta ploča otvara kapiju. Spusti kuglicu ili čvor na nju da je aktiviraš.',
    required: 10,
    total: 21,
    platforms: [{ x: -200, y: 660, w: 1680, h: 260 }],
    switches: [{ id: 'ulaz', x: 405, y: 650, w: 110, latch: true }],
    gates: [{ x: 650, y: 260, w: 62, h: 400, toY: -170, switch: 'ulaz' }],
    killY: 1000,
    pipe: { x: 1030, y: 520, dir: 'left' },
    initial: {
      nodes: [[170, 645], [310, 645], [240, 540]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#4a423a', '#a58b68'],
    hills: [
      { color: '#3d3935', y: 525, amp: 48, freq: 1.5 },
      { color: '#2a2928', y: 590, amp: 32, freq: 2.2 },
    ],
    ground: '#292624',
    groundTop: '#51473e',
    decor: {
      sun: null, particles: 'embers',
      props: [{ type: 'pipes', x: 80, y: 660, s: 55 }, { type: 'chimney', x: 1170, y: 660, s: 48 }],
    },
  },
  {
    id: 'pokretni-oslonac',
    name: 'Pokretni oslonac',
    sub: 'Osloni most na platformu koja nikad ne miruje.',
    hint: 'Pokretna platforma može da nosi čvorove koji leže na njoj. Gradi kada priđe tvojoj obali.',
    required: 10,
    total: 23,
    platforms: [
      { x: -200, y: 600, w: 550, h: 320 },
      { x: 950, y: 560, w: 530, h: 360 },
    ],
    movers: [
      { x: 370, y: 535, w: 180, h: 28, toX: 735, toY: 535, period: 4.4 },
    ],
    killY: 880,
    pipe: { x: 1040, y: 455, dir: 'left' },
    initial: {
      nodes: [[185, 585], [320, 585], [252, 478]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#66558d', '#d9a9b7'],
    hills: [
      { color: '#5a527a', y: 515, amp: 58, freq: 1.3 },
      { color: '#403a60', y: 575, amp: 36, freq: 2.0 },
    ],
    ground: '#332d4d',
    groundTop: '#51486d',
    decor: {
      sun: { x: 1070, y: 110, warm: false }, clouds: 6,
      props: [{ type: 'tower', x: 1100, y: 570, s: 54 }, { type: 'tower', x: 1200, y: 590, s: 38 }],
    },
  },
  {
    id: 'crvena-dubina',
    name: 'Crvena dubina',
    sub: 'Platforme se pomeraju, a lava ne prašta nijedan pad.',
    hint: 'Lava uništava kuglice, balone i nevezane čvorove. Koristi pokretne platforme kao privremene oslonce.',
    required: 10,
    total: 24,
    platforms: [
      { x: -200, y: 590, w: 520, h: 330 },
      { x: 960, y: 590, w: 520, h: 330 },
    ],
    liquids: [{ type: 'lava', x: 320, y: 570, w: 640, h: 150 }],
    movers: [
      { x: 385, y: 510, w: 155, h: 26, toX: 500, toY: 455, period: 3.6 },
      { x: 700, y: 455, w: 155, h: 26, toX: 805, toY: 510, period: 3.6, phase: 0.5 },
    ],
    killY: 900,
    pipe: { x: 1045, y: 485, dir: 'left' },
    initial: {
      nodes: [[175, 575], [305, 575], [240, 470]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#321c25', '#8e3f35'],
    hills: [
      { color: '#421f26', y: 500, amp: 60, freq: 1.4 },
      { color: '#29161d', y: 560, amp: 40, freq: 2.0 },
    ],
    ground: '#291718',
    groundTop: '#5a2d25',
    decor: {
      sun: null, particles: 'embers',
      props: [{ type: 'reactor', x: 1120, y: 520, s: 78 }, { type: 'ruin', x: 70, y: 600, s: 52 }],
    },
  },
  {
    id: 'dva-kljuca',
    name: 'Dva ključa',
    sub: 'Dve ploče, dve kapije i premalo kuglica za rasipanje.',
    hint: 'Ove ploče nisu trajne: ostavi deo konstrukcije na svakoj da kapije ostanu otvorene.',
    required: 11,
    total: 26,
    platforms: [{ x: -200, y: 660, w: 1680, h: 260 }],
    switches: [
      { id: 'prva', x: 390, y: 650, w: 105 },
      { id: 'druga', x: 720, y: 650, w: 105 },
    ],
    gates: [
      { x: 560, y: 250, w: 58, h: 410, toY: -190, switch: 'prva' },
      { x: 890, y: 250, w: 58, h: 410, toY: -190, switch: 'druga' },
    ],
    killY: 1000,
    pipe: { x: 1080, y: 510, dir: 'left' },
    initial: {
      nodes: [[150, 645], [285, 645], [218, 540]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#283b4d', '#66808e'],
    hills: [
      { color: '#334956', y: 520, amp: 52, freq: 1.5 },
      { color: '#23343e', y: 588, amp: 30, freq: 2.2 },
    ],
    ground: '#252d33',
    groundTop: '#485761',
    decor: {
      sun: null, clouds: 5, particles: 'rain',
      props: [{ type: 'pipes', x: 1020, y: 660, s: 58 }, { type: 'tower', x: 1160, y: 640, s: 42 }],
    },
  },
  {
    id: 'suprotne-struje',
    name: 'Suprotne struje',
    sub: 'Nisko vetar pomaže, visoko te vraća nazad.',
    hint: 'Balonima biraj visinu leta: donja struja nosi udesno, gornja ulevo.',
    required: 11,
    total: 22,
    platforms: [
      { x: -200, y: 600, w: 560, h: 320 },
      { x: 1000, y: 600, w: 480, h: 320 },
    ],
    fans: [
      { x: 360, y: 380, w: 640, h: 250, fx: 900, fy: -160 },
      { x: 360, y: 105, w: 640, h: 275, fx: -680, fy: 0 },
    ],
    balloons: [[70, 585], [125, 585], [180, 585]],
    killY: 900,
    pipe: { x: 1070, y: 225, dir: 'left' },
    initial: {
      nodes: [[210, 585], [340, 585], [275, 480]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#24324d', '#718ba5'],
    hills: [
      { color: '#394d68', y: 515, amp: 58, freq: 1.4 },
      { color: '#293a50', y: 580, amp: 36, freq: 2.1 },
    ],
    ground: '#28364a',
    groundTop: '#425974',
    decor: { sun: null, clouds: 9, particles: 'rain' },
  },
  {
    id: 'lift-na-dugme',
    name: 'Lift na dugme',
    sub: 'Aktiviraj ploču i sačuvaj ravnotežu tokom uspona.',
    hint: 'Ploča pokreće lift. Najpre ukruti konstrukciju na platformi, pa pošalji kuglicu do prekidača.',
    required: 9,
    total: 20,
    platforms: [
      { x: -200, y: 660, w: 1680, h: 260 },
      { x: 760, y: 330, w: 160, h: 330 },
    ],
    switches: [{ id: 'lift', x: 245, y: 650, w: 105, latch: true }],
    movers: [
      { x: 420, y: 590, w: 220, h: 26, toX: 420, toY: 260, switch: 'lift', speed: 0.22 },
    ],
    killY: 1000,
    pipe: { x: 940, y: 220, dir: 'left' },
    initial: {
      nodes: [[460, 575], [600, 575], [530, 470]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#34374b', '#7b718a'],
    hills: [
      { color: '#414054', y: 515, amp: 50, freq: 1.4 },
      { color: '#2e2d3e', y: 585, amp: 31, freq: 2.0 },
    ],
    ground: '#292a35',
    groundTop: '#4c4e5e',
    decor: {
      sun: null, stars: 20,
      props: [{ type: 'tower', x: 1120, y: 640, s: 62 }, { type: 'gear', x: 90, y: 590, s: 60 }],
    },
  },
  {
    id: 'potopljena-brana',
    name: 'Potopljena brana',
    sub: 'Spusti se protiv uzgona i otvori prolaz na dnu.',
    hint: 'Voda te vraća nagore. Silazna pumpa u sredini pomaže da dosegneš prekidač na dnu.',
    required: 11,
    total: 24,
    platforms: [
      { x: -200, y: -40, w: 1680, h: 210 },
      { x: -200, y: 660, w: 1680, h: 260 },
    ],
    liquids: [{ type: 'water', x: 0, y: 250, w: 1280, h: 470 }],
    fans: [{ x: 340, y: 250, w: 270, h: 410, fx: 0, fy: 900 }],
    switches: [{ id: 'brana', x: 475, y: 650, w: 115, latch: true }],
    gates: [{ x: 700, y: 260, w: 60, h: 400, toY: -170, switch: 'brana' }],
    killY: 1050,
    pipe: { x: 1060, y: 520, dir: 'left' },
    initial: {
      nodes: [[220, 184], [360, 184], [290, 285]],
      struts: [[0, 1], [0, 2], [1, 2]],
      fixed: [0, 1],
    },
    sky: ['#102d3d', '#1e6570'],
    hills: [
      { color: '#174553', y: 500, amp: 48, freq: 1.4 },
      { color: '#10313c', y: 575, amp: 30, freq: 2.1 },
    ],
    ground: '#1d383b',
    groundTop: '#356067',
    decor: {
      sun: null, particles: 'bubbles',
      props: [{ type: 'roots', x: 90, y: 660, s: 62 }, { type: 'roots', x: 1160, y: 660, s: 70 }],
    },
  },
  {
    id: 'srce-postrojenja',
    name: 'Srce postrojenja',
    sub: 'Voda, lava, kapija, ventilator i baloni — pronađi redosled.',
    hint: 'Najpre plutaj do srednjeg ostrva i otvori kapiju. Zatim tempiraj platformu, vetar i balone iznad lave.',
    required: 13,
    total: 28,
    platforms: [
      { x: -200, y: 600, w: 520, h: 320 },
      { x: 560, y: 520, w: 210, h: 400 },
      { x: 1030, y: 600, w: 450, h: 320 },
    ],
    liquids: [
      { type: 'water', x: 320, y: 490, w: 240, h: 230 },
      { type: 'lava', x: 770, y: 560, w: 260, h: 160 },
    ],
    fans: [{ x: 760, y: 290, w: 300, h: 270, fx: 620, fy: -240 }],
    switches: [{ id: 'jezgro', x: 610, y: 510, w: 105, latch: true }],
    gates: [{ x: 820, y: 230, w: 60, h: 330, toY: -160, switch: 'jezgro' }],
    movers: [
      { x: 790, y: 500, w: 170, h: 26, toX: 870, toY: 430, period: 3.8 },
    ],
    balloons: [[80, 585], [135, 585]],
    killY: 900,
    pipe: { x: 1100, y: 280, dir: 'left' },
    initial: {
      nodes: [[160, 585], [290, 585], [225, 480]],
      struts: [[0, 1], [0, 2], [1, 2]],
    },
    sky: ['#2b1830', '#8b463b'],
    hills: [
      { color: '#41243a', y: 500, amp: 62, freq: 1.3 },
      { color: '#281724', y: 565, amp: 39, freq: 2.0 },
    ],
    ground: '#24191f',
    groundTop: '#5e3732',
    decor: {
      sun: null, particles: 'embers',
      props: [
        { type: 'reactor', x: 645, y: 420, s: 92 },
        { type: 'pipes', x: 1080, y: 610, s: 66 },
        { type: 'gear', x: 95, y: 560, s: 58 },
      ],
    },
  },
];

// Poglavlja — grupišu nivoe u izboru (kao World of Goo poglavlja).
export const CHAPTERS = [
  { name: 'Zelena brda', sub: 'Nauči da gradiš', from: 0, to: 7 },
  { name: 'Mašine i vetrovi', sub: 'Sečiva, oslonci, vetar i prvi let', from: 8, to: 15 },
  { name: 'Put u nebo', sub: 'Sve mehanike zajedno', from: 16, to: 22 },
  { name: 'Dubine i mehanizmi', sub: 'Voda, lava, kapije, ventilatori i pokretne platforme', from: 23, to: 32 },
];
