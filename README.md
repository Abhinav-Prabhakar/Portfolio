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
css/style.css       design tokens, layout, surfaces, the sheet
js/main.js          globe turntable + ladder spring
js/work.js          the project list and the drifting lanes
assets/emoji/       Apple emoji rendered to transparent WebP
assets/projects/    47 stills + 13 hover loops
scripts/            asset + screenshot tooling (dev only)
```

## The work

Forty-seven projects: every repository that ships a screenshot in its README,
private work included. Two lanes of bare thumbnails drift against each other
and loop without a seam. Hover eases a lane to a stop; where the README has a
GIF, the tile plays it as a muted MP4 loop.
Keyboard focus stops the lane and centres the focused tile. With reduced motion
the sheet becomes a static responsive grid.

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
- **Globe:** three Apple globe renders (Americas → Europe–Africa →
  Asia–Australia) are crossfaded as the page scrolls, with a little motion
  blur and scroll easing. One full revolution over the first screenful.
- **Ladder:** a slow idle sway plus a damped spring that lifts and tilts it
  when the page moves.
- **Lanes:** JS-driven so they ease to a stop under the pointer, glide back up,
  and pause for keyboard focus.
- **Reduced motion:** the globe, ladder and lanes hold still; the sheet becomes
  a static grid and hover clips do not autoplay.

Emoji renders can be rebuilt with `scripts/render-emoji.swift`.

## Deploying

GitHub Pages serves `main` from the repository root, so a push is a deploy.
`.nojekyll` keeps Pages from touching any underscored paths.
