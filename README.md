# Portfolio

A small developer portfolio, built in plain HTML, CSS and vanilla JS.
Material 3 Expressive in spirit: white paper, soft black type, generous
space, and Apple's emoji as the only colour on the page.

Live at **https://abhinav-prabhakar.github.io/Portfolio/**

## Run it

Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 4173
# → http://127.0.0.1:4173
```

## What's here

```
index.html          hero + work strip
variants.html       three marquee directions, side by side (a lab page)
css/style.css       design tokens, layout, surfaces
css/variants.css    lab page only
js/main.js          globe turntable, ladder spring, marquee
js/variants.js      the three directions + their project list
assets/emoji/       Apple emoji rendered to transparent WebP
assets/sites/       placeholder screenshots for the strip
scripts/            asset + screenshot tooling (dev only)
```

`variants.html` is a comparison page for picking how the work is presented
once there are 30+ projects. It is `noindex` and can be deleted once a
direction is chosen.

## The two directions

- **A · Contact sheet** — two lanes of bare thumbnails drifting against each
  other. Full-bleed, no card chrome, name underneath. Highest density, lowest
  noise: the whole body of work is legible at a glance.
- **B · Gallery** — the same 30 shots on black, edge to edge, with no labels.
  Clicking one zooms the component itself (not the page) into a detail view:
  image on the left, title, notes and links on the right. Escape or the close
  button returns the wall.

Both render from the same `PROJECTS` array, so whichever wins can be lifted
out with its markup intact.

## Notes

- **Type:** Google Sans if installed, otherwise [Figtree](https://fonts.google.com/specimen/Figtree).
- **Globe:** three Apple globe renders (Americas → Europe–Africa →
  Asia–Australia) are crossfaded as the page scrolls, with a little motion
  blur and scroll easing. One full revolution over the first screenful of
  scroll.
- **Ladder:** a slow idle sway plus a damped spring that lifts and tilts it
  when the page moves.
- **Marquee:** JS-driven so it decelerates to a stop on hover and glides
  back up to speed. Keyboard focus pauses it and brings the focused card
  into view.
- **Reduced motion:** the globe, ladder and strips hold still; the strips
  stay scrollable and the focus rail drops its ambient advance.

## Placeholders

The screenshots are real sites that are not mine — swap the `assets/sites/*.jpg`
files, names and links when the real work is ready. `scripts/fetch-sites.sh`
regenerates them. In `variants.html` the project list lives in one array at the
top of `js/variants.js`.

Emoji renders can be rebuilt with `scripts/render-emoji.swift`.

## Deploying

GitHub Pages serves `main` from the repository root, so a push is a deploy.
`.nojekyll` keeps Pages from touching any underscored paths.
