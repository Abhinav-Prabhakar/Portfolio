/* ------------------------------------------------------------------
   Hero motion
   · The globe is a 3-frame Apple emoji turntable (Americas → Europe–
     Africa → Asia–Australia). Scroll eases its angle, the frames
     crossfade, and a touch of motion blur hides the seams.
   · The ladder is a standing object: a slow idle sway plus a damped
     spring that lifts it when the page moves.
   ------------------------------------------------------------------ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $ = (selector, root = document) => root.querySelector(selector);
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const smoothstep = (x) => {
    x = clamp(x, 0, 1);
    return x * x * (3 - 2 * x);
  };

  const GLOBE_TURNS = 1;

  const globe = $("[data-globe]");
  const globeFrames = globe ? Array.from(globe.querySelectorAll("img")) : [];
  const ladder = $("[data-ladder] img");

  let heroVisible = true;
  let lastScrollY = window.scrollY;
  let scrollDelta = 0;

  let angle = 0;
  let prevShown = 0;
  let blur = 0;

  let lift = 0;
  let liftVel = 0;
  let tilt = 0;
  let tiltVel = 0;

  /* The hero is only ~1.3 screens tall, so the turn is normalised to the
     real scroll range — and capped, so it stays calm as the page grows. */
  const REVEAL_VIEWPORTS = 1.5;
  let turnDistance = 1;

  const measureTurnDistance = () => {
    const range = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    turnDistance = Math.max(
      1,
      Math.min(range * 0.92, window.innerHeight * REVEAL_VIEWPORTS)
    );
  };

  const targetTurns = () =>
    clamp(lastScrollY / turnDistance, 0, 1) * GLOBE_TURNS;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      scrollDelta += y - lastScrollY;
      lastScrollY = y;
    },
    { passive: true }
  );

  function paintGlobe(turns, blurPx) {
    if (globeFrames.length !== 3) return;

    const phase = ((turns % 1) + 1) % 1;
    const slot = phase * 3;
    const base = Math.floor(slot) % 3;
    const mix = smoothstep((slot - Math.floor(slot) - 0.14) / 0.72);

    const blendBlur = mix > 0.001 ? Math.sin(Math.PI * mix) * 0.55 : 0;
    const filterNow = blurPx + blendBlur;
    const filter = filterNow > 0.06 ? `blur(${filterNow.toFixed(2)}px)` : "";

    for (let i = 0; i < 3; i++) {
      const img = globeFrames[i];
      const opacity = i === base ? 1 - mix : i === (base + 1) % 3 ? mix : 0;
      const f = opacity > 0.001 ? filter : "";

      if (img.__opacity !== opacity) {
        img.style.opacity = opacity;
        img.__opacity = opacity;
      }
      if (img.__filter !== f) {
        img.style.filter = f;
        img.__filter = f;
      }
    }
  }

  function updateHero(dt, now) {
    const target = targetTurns();

    if (reduceMotion.matches) {
      angle = 0;
      prevShown = 0;
      blur = 0;
      scrollDelta = 0;
      paintGlobe(0, 0);
      if (ladder) ladder.style.transform = "";
      return;
    }

    /* scroll nudges the ladder; it springs back to standing */
    const delta = clamp(scrollDelta, -420, 420);
    scrollDelta = 0;

    liftVel += delta * 0.26;
    tiltVel += delta * 0.05;

    const stiffness = 95;
    const damping = 11;

    liftVel += (-stiffness * lift - damping * liftVel) * dt;
    lift = clamp(lift + liftVel * dt, -1.5, 7);

    tiltVel += (-stiffness * tilt - damping * tiltVel) * dt;
    tilt = clamp(tilt + tiltVel * dt, -1.6, 1.6);

    /* globe eases toward its scroll angle */
    angle += (target - angle) * (1 - Math.exp(-dt * 6));

    const shown = angle;
    const rate = Math.abs(shown - prevShown) / Math.max(dt, 0.001);
    const blurTarget = clamp((rate - 0.25) * 0.5, 0, 0.7);
    blur += (blurTarget - blur) * (1 - Math.exp(-dt * 12));

    paintGlobe(shown, blur);
    prevShown = shown;

    if (ladder) {
      const sway =
        0.85 * Math.sin(now * 0.00075) + 0.25 * Math.sin(now * 0.0019 + 1.7);
      const rotation = sway + tilt;
      const y = -lift * 0.01; // em, so it scales with the headline
      ladder.style.transform = `translate3d(0, ${y.toFixed(4)}em, 0) rotate(${rotation.toFixed(3)}deg)`;
    }
  }

  /* ---------------- loop ---------------- */

  let running = false;
  let previous = performance.now();

  function frame(now) {
    let dt = (now - previous) / 1000;
    previous = now;
    if (!(dt > 0)) dt = 0.016;
    dt = Math.min(dt, 0.05);

    updateHero(dt, now);

    if (heroVisible && !reduceMotion.matches) requestAnimationFrame(frame);
    else running = false;
  }

  function ensureLoop() {
    if (running || reduceMotion.matches) return;
    running = true;
    previous = performance.now();
    requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window) {
    const hero = $(".hero");
    if (hero) {
      new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        if (!heroVisible) {
          scrollDelta = 0;
          lastScrollY = window.scrollY;
        } else {
          ensureLoop();
        }
      }).observe(hero);
    }
  }

  measureTurnDistance();
  angle = targetTurns();
  prevShown = angle;
  paintGlobe(angle, 0);

  if (!reduceMotion.matches) ensureLoop();

  /* ---------------- housekeeping ---------------- */

  window.addEventListener("resize", measureTurnDistance);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measureTurnDistance);
  }
})();
