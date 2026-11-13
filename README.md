# Portfolio

A small developer portfolio, built in plain HTML, CSS and vanilla JS.
Material 3 Expressive in spirit: white paper, soft black type, generous
space, and Apple's emoji as the only colour on the page.

## Run it

Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 4173
# → http://127.0.0.1:4173
```

## What's here

```
index.html          hero + work strip
css/style.css       design tokens, layout, surfaces
js/main.js          globe turntable, ladder spring, marquee
assets/emoji/       Apple emoji rendered to transparent WebP
assets/sites/       placeholder screenshots for the strip
scripts/            asset + screenshot tooling (dev only)
```

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
- **Reduced motion:** the globe, ladder and strip hold still; the strip
  stays scrollable.

## Placeholders

The ten cards are real screenshots of sites that are not mine — swap the
`assets/sites/*.jpg` files, names and links in `index.html` when the real
work is ready. `scripts/fetch-sites.sh` regenerates them.

Emoji renders can be rebuilt with `scripts/render-emoji.swift`.
