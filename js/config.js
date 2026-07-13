// Globalne konstante — sve vrednosti su u "world" pikselima (dizajn rezolucija 1280x720).

export const WORLD = { w: 1280, h: 720 };

// Fizika (Verlet integracija + distance constraints)
export const PHYS = {
  gravity: 1600,          // px/s^2
  substeps: 3,            // fizičkih podkoraka po frejmu
  iterations: 3,          // iteracija constraint solvera po podkoraku
  stiffness: 0.42,        // 0..1 — manja vrednost = elastičnije grede (goo osećaj)
  damping: 0.994,         // zadržavanje brzine (1 = bez prigušenja)
  groundFriction: 0.45,   // trenje pri kontaktu s podlogom (0..1, veće = lepljivije)
  maxSpeed: 40,           // limit pomeraja po podkoraku (anti-eksplozija)
};

// Goo kuglice
export const GOO = {
  radius: 13,
  attachReach: 145,       // dokle kuglica "vidi" čvorove za kačenje
  minStrut: 45,           // minimalna dužina grede
  maxLinks: 3,            // max novih greda pri kačenju
  minAttach: 2,           // potrebno čvorova u dometu da bi se zakačila
  crawlSpeed: 60,         // brzina šetanja po gredama px/s
  walkSpeed: 90,          // brzina hodanja po tlu ka konstrukciji
  grabRadius: 55,         // poluprečnik hvatanja pokazivačem
  reattachDist: 70,       // koliko blizu grede mora pasti da se vrati na konstrukciju
};

// Baloni — kače se jednom "kanap" gredom i vuku konstrukciju nagore.
// Ništa ne može da se zakači na balon; cev ih ne usisava; šiljci ih buše.
export const BALLOON = {
  radius: 16,
  lift: 4200,           // px/s^2 uzgon (≈2.6x gravitacija → 1 balon nosi ~2 čvora)
  stringLen: 90,        // dužina kanapa (rest dužina grede ka konstrukciji)
  windFactor: 1.5,      // vetar deluje jače na balone (veliki su i lagani)
  attachReach: 150,     // dokle balon "vidi" čvor za kačenje
};

// Tečnosti i lokalne sile za puzzle nivoe.
export const LIQUID = {
  waterLift: 2350,      // uzgon u vodi (veći od gravitacije, pa konstrukcija pluta)
  waterDrag: 0.90,      // prigušenje brzine po fizičkom podkoraku
};

export const MECHANISM = {
  gateSpeed: 1.5,       // deo punog hoda kapije u sekundi
  switchDepth: 34,      // koliko iznad ploče čvor/kuglica može da je aktivira
};

// Cev (cilj nivoa)
export const PIPE = {
  activateRadius: 100,    // čvor konstrukcije u ovom radijusu aktivira cev
  suckInterval: 0.30,     // pauza između usisavanja kuglica (s)
  suckDuration: 0.55,     // trajanje leta kuglice do cevi (s)
};

export const COLORS = {
  gooBody: '#2b2b30',
  gooDark: '#141417',
  strut: 'rgba(38, 38, 44, 0.92)',
  strutHighlight: 'rgba(255,255,255,0.12)',
  preview: 'rgba(255, 255, 255, 0.65)',
  previewBad: 'rgba(255, 90, 90, 0.5)',
  balloon: '#e2556a',
  balloonDark: '#a93247',
  previewBalloon: 'rgba(255, 150, 170, 0.75)',
};

export const STORAGE_KEY = 'goo-tower-save-v1';
