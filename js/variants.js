/* ------------------------------------------------------------------
   Two ways to hold 30+ projects.

   A · Contact sheet  — two lanes of bare thumbnails drifting apart
   B · Gallery        — a black wall that zooms one shot open in place

   Both read from PROJECTS, so the winner can be lifted straight out.
   ------------------------------------------------------------------ */

(() => {
  "use strict";

  const PROJECTS = [
    { name: "Linear", url: "https://linear.app", img: "01-linear", tag: "Product", year: "2024", blurb: "Issue tracking and project planning rebuilt around speed and a keyboard-first flow." },
    { name: "Stripe", url: "https://stripe.com", img: "02-stripe", tag: "Payments", year: "2023", blurb: "Payment infrastructure: checkout, billing and financial tooling behind one API." },
    { name: "Vercel", url: "https://vercel.com", img: "03-vercel", tag: "Platform", year: "2024", blurb: "Frontend deploys at the edge, with previews, logs and analytics in one place." },
    { name: "Framer", url: "https://www.framer.com", img: "04-framer", tag: "Web design", year: "2022", blurb: "A design canvas that publishes real, responsive websites." },
    { name: "Raycast", url: "https://www.raycast.com", img: "05-raycast", tag: "Tooling", year: "2023", blurb: "A launcher that puts scripts, windows and the clipboard behind one keystroke." },
    { name: "Figma", url: "https://www.figma.com", img: "06-figma", tag: "Design", year: "2021", blurb: "Multiplayer design files, from first wireframe to production component." },
    { name: "Supabase", url: "https://supabase.com", img: "07-supabase", tag: "Platform", year: "2024", blurb: "Postgres, auth, storage and realtime behind one dashboard." },
    { name: "Notion", url: "https://www.notion.com", img: "08-notion", tag: "Workspace", year: "2022", blurb: "Docs, databases and wikis folding into a single workspace." },
    { name: "Resend", url: "https://resend.com", img: "09-resend", tag: "Email", year: "2024", blurb: "Transactional email for developers, with a clean API and readable logs." },
    { name: "Rive", url: "https://rive.app", img: "10-rive", tag: "Motion", year: "2023", blurb: "Interactive motion graphics that ship to web and native." },
    { name: "Mobbin", url: "https://mobbin.com", img: "11-mobbin", tag: "Reference", year: "2024", blurb: "A searchable library of shipped app and web screens." },
    { name: "Cal", url: "https://cal.com", img: "12-cal", tag: "Scheduling", year: "2022", blurb: "Open-source scheduling that plugs into any calendar." },
    { name: "Clerk", url: "https://clerk.com", img: "13-clerk", tag: "Auth", year: "2023", blurb: "Drop-in authentication: sessions, MFA, organisations and user management." },
    { name: "Neon", url: "https://neon.tech", img: "14-neon", tag: "Database", year: "2024", blurb: "Serverless Postgres with a branch for every preview environment." },
    { name: "PostHog", url: "https://posthog.com", img: "15-posthog", tag: "Analytics", year: "2023", blurb: "Product analytics, session replay and feature flags in one stack." },
    { name: "Arc", url: "https://arc.net", img: "16-arc", tag: "Browser", year: "2023", blurb: "A browser that reorganises tabs into spaces and profiles." },
    { name: "Retool", url: "https://retool.com", img: "17-retool", tag: "Internal tools", year: "2022", blurb: "Internal tools built from a drag-and-drop canvas sitting over your data." },
    { name: "tldraw", url: "https://tldraw.com", img: "18-tldraw", tag: "Canvas", year: "2024", blurb: "A canvas SDK for drawing, diagramming and infinite boards." },
    { name: "Mintlify", url: "https://mintlify.com", img: "19-mintlify", tag: "Docs", year: "2023", blurb: "Documentation sites that stay in sync with the codebase." },
    { name: "Plane", url: "https://plane.so", img: "20-plane", tag: "Tracker", year: "2024", blurb: "Open-source issue tracking with cycles, modules and saved views." },
    { name: "Dub", url: "https://dub.co", img: "21-dub", tag: "Links", year: "2024", blurb: "Link management with analytics, custom domains and campaign tracking." },
    { name: "Superhuman", url: "https://superhuman.com", img: "22-superhuman", tag: "Email", year: "2021", blurb: "An email client built for keyboard speed and inbox zero." },
    { name: "Attio", url: "https://attio.com", img: "23-attio", tag: "CRM", year: "2024", blurb: "A CRM that behaves like a flexible, relational database." },
    { name: "Pitch", url: "https://pitch.com", img: "24-pitch", tag: "Decks", year: "2023", blurb: "Collaborative decks with live data and shared templates." },
    { name: "Descript", url: "https://descript.com", img: "25-descript", tag: "Video", year: "2023", blurb: "Edit video by editing the transcript." },
    { name: "Cursor", url: "https://cursor.com", img: "26-cursor", tag: "Editor", year: "2024", blurb: "An editor with the model woven through the whole workflow." },
    { name: "Bolt", url: "https://bolt.new", img: "27-bolt", tag: "Builder", year: "2025", blurb: "Prompt a full-stack app into existence in the browser." },
    { name: "v0", url: "https://v0.app", img: "28-v0", tag: "Builder", year: "2025", blurb: "Generate interface components from a prompt, then refine them in code." },
    { name: "Ramp", url: "https://ramp.com", img: "29-ramp", tag: "Finance", year: "2024", blurb: "Corporate cards and spend management with the controls built in." },
    { name: "Cron", url: "https://cron.com", img: "30-cron", tag: "Calendar", year: "2023", blurb: "A calendar with keyboard navigation and clear time zones." },
  ];

  document
    .querySelectorAll("[data-count]")
    .forEach((el) => (el.textContent = `${PROJECTS.length} projects`));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const shot = (p) => `assets/sites/${p.img}.jpg`;
  const pad = (n) => String(n).padStart(2, "0");

  const arrow = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* ================================================================
     Ticker engine
     ================================================================ */

  const tickers = [];

  function makeTicker(host, { speed, dir = 1, start = 0, html }) {
    const track = document.createElement("div");
    track.className = "tick";
    track.innerHTML = `<ul class="tick__group">${html}</ul>`;

    const group = track.firstElementChild;
    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a").forEach((a) => (a.tabIndex = -1));
    track.append(clone);
    host.append(track);

    const t = { track, group, x: 0, w: 0, speed, dir, vel: 0, paused: false, visible: true, start, measured: false };
    tickers.push(t);

    const lane = host.closest(".lane");
    if (lane) {
      lane.addEventListener("pointerenter", () => (t.paused = true));
      lane.addEventListener("pointerleave", () => {
        t.paused = false;
        ensureLoop();
      });
    }

    measureTicker(t);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          t.visible = entry.isIntersecting;
          if (t.visible) ensureLoop();
        },
        { rootMargin: "120px 0px" }
      ).observe(host);
    }

    return t;
  }

  function measureTicker(t) {
    t.w = t.group.getBoundingClientRect().width;
    if (!t.measured && t.w) {
      /* The start offset only exists to de-phase the moving lanes; a
         scrollable (reduced-motion) lane has to begin at its first item. */
      t.x = reduce.matches ? 0 : -t.w * t.start;
      t.measured = true;
      t.track.style.transform = `translate3d(${t.x.toFixed(2)}px, 0, 0)`;
    }
  }

  let running = false;
  let previous = 0;

  function ensureLoop() {
    if (running || reduce.matches) return;
    running = true;
    previous = performance.now();
    requestAnimationFrame(frame);
  }

  function frame(now) {
    let dt = (now - previous) / 1000;
    previous = now;
    if (!(dt > 0)) dt = 0.016;
    dt = Math.min(dt, 0.05);

    let alive = false;

    for (const t of tickers) {
      if (!t.visible || !t.w) continue;
      if (reduce.matches) continue;

      const goal = t.paused ? 0 : t.speed;
      t.vel += (goal - t.vel) * (1 - Math.exp(-dt * 6));
      if (t.paused && t.vel < 0.05) t.vel = 0;
      if (t.vel > 0.05) alive = true;

      t.x -= t.vel * t.dir * dt;
      if (t.dir > 0) {
        while (t.x <= -t.w) t.x += t.w;
      } else {
        while (t.x >= 0) t.x -= t.w;
      }
      t.track.style.transform = `translate3d(${t.x.toFixed(2)}px, 0, 0)`;
    }

    if (alive) requestAnimationFrame(frame);
    else running = false;
  }

  /* ================================================================
     A · Contact sheet
     ================================================================ */

  const sheet = document.querySelector("[data-sheet]");

  if (sheet) {
    const lanes = Array.from(sheet.querySelectorAll("[data-lane]"));
    const half = Math.ceil(PROJECTS.length / 2);

    const tileHTML = (list) =>
      list
        .map(
          (p) => `
        <li class="tile">
          <a class="tile__link" href="${p.url}" target="_blank" rel="noopener">
            <span class="tile__shot"><img src="${shot(p)}" alt="" width="1200" height="750" loading="lazy" decoding="async" draggable="false"></span>
            <span class="tile__name">${p.name}<span class="tile__arrow">${arrow}</span></span>
          </a>
        </li>`
        )
        .join("");

    makeTicker(lanes[0], {
      speed: 34,
      dir: 1,
      start: 0,
      html: tileHTML(PROJECTS.slice(0, half)),
    });

    makeTicker(lanes[1], {
      speed: 25,
      dir: -1,
      start: 0.55,
      html: tileHTML(PROJECTS.slice(half)),
    });
  }

  /* ================================================================
     B · Gallery
     ================================================================ */

  const wall = document.querySelector("[data-wall]");

  if (wall) {
    const grid = wall.querySelector("[data-wall-grid]");
    const stage = wall.querySelector("[data-wall-stage]");
    const figure = wall.querySelector("[data-wall-img]");
    const elIndex = wall.querySelector("[data-wall-index]");
    const elTitle = wall.querySelector("[data-wall-title]");
    const elBlurb = wall.querySelector("[data-wall-blurb]");
    const elTags = wall.querySelector("[data-wall-tags]");
    const elVisit = wall.querySelector("[data-wall-visit]");
    const btnPrev = wall.querySelector("[data-wall-prev]");
    const btnNext = wall.querySelector("[data-wall-next]");
    const btnClose = wall.querySelector("[data-wall-close]");
    const total = PROJECTS.length;

    grid.innerHTML = PROJECTS.map(
      (p, i) => `
      <button class="wall__tile" type="button" data-i="${i}" aria-label="Preview ${p.name}">
        <img src="${shot(p)}" alt="" width="1200" height="750" loading="lazy" decoding="async" draggable="false">
      </button>`
    ).join("");

    const tiles = Array.from(grid.children);

    let current = -1;
    let currentTile = null;
    let closing = false;
    let swapTimer = 0;

    const content = (i) => {
      const p = PROJECTS[i];
      figure.src = shot(p);
      figure.alt = `${p.name} home page`;
      elIndex.textContent = pad(i + 1);
      elTitle.textContent = p.name;
      elBlurb.textContent = p.blurb;
      elTags.textContent = `${p.tag} · ${p.year}`;
      elVisit.href = p.url;
      elVisit.setAttribute("aria-label", `Visit ${p.name}`);
    };

    const insetFor = (tile) => {
      const box = wall.getBoundingClientRect();
      const t = tile.getBoundingClientRect();
      const left = t.left - box.left;
      const top = t.top - box.top;
      return `inset(${top.toFixed(1)}px ${(box.width - left - t.width).toFixed(1)}px ${(box.height - top - t.height).toFixed(1)}px ${left.toFixed(1)}px)`;
    };

    const finishClose = () => {
      if (!closing) return;
      closing = false;
      stage.classList.remove("is-open");
      stage.style.clipPath = "";
      current = -1;
      grid.removeAttribute("inert");
      grid.removeAttribute("aria-hidden");
      if (currentTile) currentTile.focus({ preventScroll: true });
      currentTile = null;
    };

    const open = (i) => {
      if (closing) return;
      i = (i + total) % total;
      const tile = tiles[i];

      /* already open — swap the contents rather than re-running the zoom */
      if (current >= 0) {
        if (i === current) return;
        window.clearTimeout(swapTimer);
        current = i;
        figure.classList.add("is-fading");
        swapTimer = window.setTimeout(() => {
          content(i);
          figure.classList.remove("is-fading");
        }, 130);
        return;
      }

      current = i;
      currentTile = tile;
      content(i);

      stage.style.transition = "none";
      stage.style.clipPath = insetFor(tile);
      stage.classList.add("is-open");
      grid.setAttribute("inert", "");
      grid.setAttribute("aria-hidden", "true");

      void stage.offsetWidth; /* commit the small clip before animating */
      stage.style.transition = "";

      requestAnimationFrame(() => {
        stage.style.clipPath = "inset(0px 0px 0px 0px)";
      });

      btnClose.focus({ preventScroll: true });
    };

    const close = () => {
      if (current < 0 || closing) return;
      closing = true;
      window.clearTimeout(swapTimer);
      figure.classList.remove("is-fading");

      if (reduce.matches || !currentTile) {
        finishClose();
        return;
      }

      const done = () => {
        stage.removeEventListener("transitionend", done);
        finishClose();
      };

      stage.style.clipPath = insetFor(currentTile);
      stage.addEventListener("transitionend", done);
      window.setTimeout(done, 900);
    };

    grid.addEventListener("click", (event) => {
      const tile = event.target.closest(".wall__tile");
      if (!tile) return;
      open(Number(tile.dataset.i));
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", () => open(current - 1));
    btnNext.addEventListener("click", () => open(current + 1));

    /* Escape and the arrow keys work wherever focus happens to be while
       the zoomed view is open. */
    document.addEventListener("keydown", (event) => {
      if (current < 0) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        open(current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        open(current + 1);
      }
    });
  }

  /* ================================================================
     Switcher
     ================================================================ */

  const links = Array.from(document.querySelectorAll("[data-switch]"));
  const sections = links
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) =>
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${entry.target.id}`
            )
          );
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((section) => io.observe(section));
  }

  /* ================================================================
     Housekeeping
     ================================================================ */

  const remeasure = () => tickers.forEach(measureTicker);
  window.addEventListener("resize", remeasure);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(remeasure);
  }
  if ("ResizeObserver" in window) {
    tickers.forEach((t) => new ResizeObserver(() => measureTicker(t)).observe(t.group));
  }

  if (!reduce.matches) ensureLoop();
})();
