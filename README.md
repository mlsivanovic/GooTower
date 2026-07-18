# 🫧 Goo Tower

Fizička puzla inspirisana igrom **World of Goo**, napisana u čistom (vanilla) JavaScriptu nad HTML5 Canvas-om. Prevlači lepljive goo kuglice i gradi klimave konstrukcije koje se njišu i uvijaju sve dok ne dosegneš gladnu cev na cilju.

🎮 **Igraj online:** [mlsivanovic.github.io/GooTower](https://mlsivanovic.github.io/GooTower/)

> Igra je **PWA** — može da se instalira na telefon/desktop i igra offline.

---

## ✨ Mogućnosti

- 🧩 **39 nivoa u 5 poglavlja** (*Zelena brda → Mašine i vetrovi → Put u nebo → Dubine i mehanizmi → Iznad oblaka*) — rastuća težina i originalne fizičke puzle inspirisane najboljim idejama žanra
- 🕸️ **Verlet fizika** — grede su namerno „meke" (elastičan solver) pa se konstrukcija ljulja i uvija kao u originalu
- 🫧 **Živa goo kuglica** — kuglice šetaju po gredama, trepću, prate kursor pogledom i cvile kad ih uhvatiš
- 🎈 **Baloni** — kače se kanapom i dižu konstrukciju; cev ih ne usisava, a šiljci ih buše (kao u originalu)
- 🌬️ **Vetar** — nosi konstrukciju, balone i kuglice u letu; vidljiv kroz lelujave pramenove i čestice
- 💧 **Voda i lava** — voda usporava pad i daje uzgon, dok lava trenutno uništava kuglice i čvorove
- 🔧 **Puzzle mehanizmi** — lokalni ventilatori, pritisne ploče, kapije, liftovi i pokretne platforme menjaju način na koji se svaki problem rešava
- ⚙️ **Sečiva i šiljci** — dodir uništava kuglicu, a pogođeni čvor otkida deo konstrukcije
- ⚓ **Fiksni oslonci** — zakovane tačke za viseće konstrukcije i mostove
- 🎯 **Cilj = cev** — kad konstrukcija stigne do cevi, ona se aktivira i usisava preostale slobodne kuglice; dovoljno njih = pobeda
- 🌄 **Živa pozadina** — oblaci, zvezde, kiša, mehurići, žar i nove siluete cevi, tornjeva, korenja i reaktora, po temi nivoa
- 🔊 **Proceduralni zvuk** (Web Audio) — nema audio fajlova, sve se sintetiše
- 💾 **Progres** — otključavanje nivoa redom i najbolji rezultat, čuvani u `localStorage`
- 📱 **Touch + miš** — jedan te isti drag & drop model radi na oba

## 🎮 Kontrole

| Akcija | Miš / Touch |
|--------|-------------|
| Uhvati kuglicu | pritisni i drži na kuglici |
| Zakači na konstrukciju | prevuci blizu postojećih čvorova i pusti |
| Baci u stranu | pusti dalje od konstrukcije |
| Zakači balon | prevuci balon blizu čvora i pusti (jedan kanap) |
| Skini balon | uhvati zakačen balon i odnesi ga |

Isprekidane linije u prevlačenju pokazuju gde će nova greda da nikne. Bela = ok, crvena = premalo oslonaca.

## 🚀 Lokalno pokretanje

Nema build koraka. Pošto se koristi service worker + ES moduli, igri treba HTTP server (ne `file://`):

```bash
git clone https://github.com/mlsivanovic/GooTower.git
cd GooTower
python3 -m http.server 8000
# pa otvori http://localhost:8000
```

> Na `localhost` se service worker namerno preskače da keš ne bi smetao razvoju.

## 🗂️ Struktura projekta

```
index.html        — DOM: canvas, HUD, ekrani
style.css         — stilovi
manifest.json     — PWA manifest
sw.js             — service worker (cache-first)
js/
  config.js       — konstante (fizika, goo, cev, boje)
  physics.js      — Verlet tačke + distance constraints (grede), kolizije
  goo.js          — goo kuglice: šetanje, padanje, kačenje
  levels.js       — definicije nivoa
  render.js       — sav canvas render (pozadina, cev, grede, kuglice, efekti)
  audio.js        — proceduralni Web Audio zvuk
  storage.js      — localStorage (otključani nivoi, rezultati)
  ui.js           — DOM sloj (ekrani, HUD, dugmad)
  game.js         — glavna petlja, unos, logika nivoa
```

## 🛠️ Tehnologije

- HTML5 Canvas 2D
- Vanilla JavaScript (ES moduli)
- Web Audio API (proceduralni zvuk)
- PWA (manifest + service worker)
- GitHub Pages + GitHub Actions (deploy)

---

*Inspirisano igrom World of Goo (2D Boy). Ovo je nezavisan hobi projekat i nije povezan sa originalnom igrom.*
