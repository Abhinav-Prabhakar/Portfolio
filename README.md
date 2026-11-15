# Portfolio

A small developer portfolio, built in plain HTML, CSS and vanilla JS.
Material 3 in spirit: white paper, soft black type, generous space, and
Apple's emoji as the only colour in the hero.

Live at **https://abhinav-prabhakar.github.io/Portfolio/**

## Run it

Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 4173
# → http://127.0.0.1:4173
```

## What's here

```
index.html          hero + selected work
intro.html          noindex review page with five name treatments
place.html          noindex review page: where the name and the JNTUH line sit
css/style.css       design tokens, layout, surfaces, the sheet
js/main.js          WebGL globe + ladder spring
js/work.js          the project list and the drifting lanes
assets/img/         the JNTUH crest and the two company marks
assets/emoji/       Apple emoji at the native 160 px strike
assets/projects/    37 stills + 12 hover loops
scripts/            asset + screenshot tooling (dev only)
```

## The work

Thirty-seven projects: every repository that ships a screenshot in its README,
private work included. Three rows of bare thumbnails fill one screen — each row
is a third of the sheet and the tile width comes from the row height at a 17:10
frame, so the whole sheet is visible at once on any window. The gutter between
tiles is deliberately narrower than the page gutter: the pictures carry the
section, not the space around them. Alternate rows drift against each other and loop without a seam. Hover
eases a row to a stop; where the README has a GIF, the tile plays it as a muted
MP4 loop. Keyboard focus stops the row and centres the focused tile. With
reduced motion the sheet becomes a static responsive grid.

Terminal-first tools are left out — this is the visual work.

The project list lives in `PROJECTS` at the top of `js/work.js`: name, live URL,
image, optional hover clip, aspect ratio and tags. A project without a URL
(Mantle is private with no public demo) still shows, but its tile is not a link.

## Adding a project

1. Put a still in `assets/projects/` at 1600px wide, JPEG, and add an entry to
   `PROJECTS`.
2. If the README has a GIF, convert it to a muted loop and drop it in
   `assets/projects/video/`:
   ```sh
   ffmpeg -i demo.gif -vf "scale='min(800,iw)':-2:flags=lanczos,fps=12" \
     -c:v libx264 -pix_fmt yuv420p -crf 28 -preset medium \
     -movflags +faststart -an assets/projects/video/name.mp4
   ```
3. Set `video: "name"` on the project. The still doubles as the poster.

## Notes

- **Type:** Google Sans if installed, otherwise [Figtree](https://fonts.google.com/specimen/Figtree).
  The greeting is [Caveat](https://fonts.google.com/specimen/Caveat) at 600.
- **Greeting:** “Hi, I’m Abhinav Prabhakar” in grey handwriting above the
  statement, with the JNTUH crest and “Studied at JNTUH, CSE AI/ML” beneath it
  as a footnote — same grey, 12.5 px, the crest at 17 px and 80% opacity. It
  sits inside the centred hero block, so it never pushes the sheet down.
- **Emoji:** the PNGs are Apple Color Emoji lifted from the font's 160 px
  strike, so they are the exact pixels macOS draws. They sit on the text
  baseline the way an inline emoji does: ink 0.97 em tall, foot 0.105 em below
  the baseline.
- **Globe:** a real sphere, not a crossfade. WebGL casts a ray per pixel and
  samples an equirectangular map rebuilt from the three Apple globe glyphs;
  the day/night shading is a screen-locked field baked from the same glyph, so
  the disc matches the emoji at rest and turns as one piece. It starts on the
  Americas at the glyph's 9.5° tilt and drifts about 0.17 rad/s, with scroll
  adding speed that eases back.
- **Globe assets:** `earth-apple.jpg` stores albedo as `sqrt(albedo / 1020)` so
  eight bits keep the highlights; `globe-shade.png` is the 128 px scalar
  shading field. `globe-americas.webp` is the still: it shows before the first
  WebGL frame, under reduced motion, and whenever WebGL is unavailable.
- **Ladder:** a slow idle sway (±5°, never quite repeating) plus a damped
  spring that lifts and tilts it when the page moves.
- **Lanes:** JS-driven so they ease to a stop under the pointer, glide back up,
  and pause for keyboard focus.
- **Reduced motion:** the globe holds a single frame, the ladder and lanes hold
  still; the sheet becomes a static grid and hover clips do not autoplay.
- **`intro.html`:** five name treatments (sweeping light, pencil and arrow,
  curtain, outline to ink, weight wave) kept as a noindex review page. Each
  row can be replayed.
- **Experience:** two roles — Founding Engineer at TrovoFi (Feb–Oct 2026) and
  Lead Software Engineer at Optern (Aug 2025–Feb 2026) — told with the company
  marks rather than prose. The two marks are threaded on a single 1px hairline
  beside the statement, level with its middle: a small timeline that echoes the
  ladder without becoming a diagram. Each mark sits on a paper ring so the line
  never touches it. Both stay in colour at 90% — the one small accent next to
  the globe. Below 900px there is no free column, so the pair drops to a static
  block under the statement and keeps the thread. Optern's supplied logo was
  the full lockup, so it is cropped to the mark alone; at 26px the wordmark
  turned to mush and unbalanced the pair.
- **Hackathons:** 3 gold, 1 silver and 1 bronze, as one quiet line under the
  project count. The counts are told as numbers rather than one medal per win:
  a numeral set beside a medal fights the 1/2/3 engraved on it, so the numeral
  leads and the medal becomes the accent. It is a fact about the work, not a
  boast — no switch, no second placement.
- **`place.html`:** the pencil-and-arrow name in four arrangements — above the
  statement, above it without an arrow, signed underneath, and signed
  underneath without an arrow — each with the JNTUH line beneath the name.
  The arrows are measured at runtime: they leave the last letter horizontally,
  bend once, and land on the rim of the thing they point at (the globe, or the
  full stop), so they keep their aim at any window width.

Emoji renders can be rebuilt with `scripts/render-emoji.swift`.

## Deploying

GitHub Pages serves `main` from the repository root, so a push is a deploy.
`.nojekyll` keeps Pages from touching any underscored paths.
