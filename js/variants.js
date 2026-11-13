/* ------------------------------------------------------------------
   Three ways to hold 30+ projects.

   A · Contact sheet  — two lanes of bare thumbnails drifting apart
   B · Focus rail     — one project at a time, browsable by hand
   C · Index          — typographic lanes, thumbnail under the cursor

   All three read from PROJECTS, so the winner can be lifted straight
   out with its markup intact.
   ------------------------------------------------------------------ */

(() => {
  "use strict";

  const PROJECTS = [
    { name: "Linear", url: "https://linear.app", img: "01-linear", tag: "Product", year: "2024" },
    { name: "Stripe", url: "https://stripe.com", img: "02-stripe", tag: "Payments", year: "2023" },
    { name: "Vercel", url: "https://vercel.com", img: "03-vercel", tag: "Platform", year: "2024" },
    { name: "Framer", url: "https://www.framer.com", img: "04-framer", tag: "Web design", year: "2022" },
    { name: "Raycast", url: "https://www.raycast.com", img: "05-raycast", tag: "Tooling", year: "2023" },
    { name: "Figma", url: "https://www.figma.com", img: "06-figma", tag: "Design", year: "2021" },
    { name: "Supabase", url: "https://supabase.com", img: "07-supabase", tag: "Platform", year: "2024" },
    { name: "Notion", url: "https://www.notion.com", img: "08-notion", tag: "Workspace", year: "2022" },
    { name: "Resend", url: "https://resend.com", img: "09-resend", tag: "Email", year: "2024" },
    { name: "Rive", url: "https://rive.app", img: "10-rive", tag: "Motion", year: "2023" },
    { name: "Height", url: "https://height.app", img: "11-height", tag: "Product", year: "2023" },
    { name: "Cal", url: "https://cal.com", img: "12-cal", tag: "Scheduling", year: "2022" },
    { name: "Clerk", url: "https://clerk.com", img: "13-clerk", tag: "Auth", year: "2023" },
    { name: "Neon", url: "https://neon.tech", img: "14-neon", tag: "Database", year: "2024" },
    { name: "PostHog", url: "https://posthog.com", img: "15-posthog", tag: "Analytics", year: "2023" },
    { name: "Arc", url: "https://arc.net", img: "16-arc", tag: "Browser", year: "2023" },
    { name: "Retool", url: "https://retool.com", img: "17-retool", tag: "Internal tools", year: "2022" },
    { name: "tldraw", url: "https://tldraw.com", img: "18-tldraw", tag: "Canvas", year: "2024" },
    { name: "Mintlify", url: "https://mintlify.com", img: "19-mintlify", tag: "Docs", year: "2023" },
    { name: "Plane", url: "https://plane.so", img: "20-plane", tag: "Tracker", year: "2024" },
    { name: "Dub", url: "https://dub.co", img: "21-dub", tag: "Links", year: "2024" },
    { name: "Superhuman", url: "https://superhuman.com", img: "22-superhuman", tag: "Email", year: "2021" },
    { name: "Attio", url: "https://attio.com", img: "23-attio", tag: "CRM", year: "2024" },
    { name: "Pitch", url: "https://pitch.com", img: "24-pitch", tag: "Decks", year: "2023" },
    { name: "Descript", url: "https://descript.com", img: "25-descript", tag: "Video", year: "2023" },
    { name: "Cursor", url: "https://cursor.com", img: "26-cursor", tag: "Editor", year: "2024" },
    { name: "Bolt", url: "https://bolt.new", img: "27-bolt", tag: "Builder", year: "2025" },
    { name: "v0", url: "https://v0.app", img: "28-v0", tag: "Builder", year: "2025" },
    { name: "Perplexity", url: "https://perplexity.ai", img: "29-perplexity", tag: "Search", year: "2024" },
    { name: "Cron", url: "https://cron.com", img: "30-cron", tag: "Calendar", year: "2023" },
  ];

  document
    .querySelectorAll("[data-count]")
    .forEach((el) => (el.textContent = `${PROJECTS.length} projects`));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const shot = (p) => `assets/sites/${p.img}.jpg`;

  const arrow = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* ================================================================
     Ticker engine — shared by A and C
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

    const lane = host.closest(".lane, .index__row");
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

      if (reduce.matches) {
        if (t.track.style.transform) t.track.style.transform = "";
        continue;
      }

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
      speed: 30,
      dir: 1,
      start: 0,
      html: tileHTML(PROJECTS.slice(0, half)),
    });

    makeTicker(lanes[1], {
      speed: 22,
      dir: -1,
      start: 0.55,
      html: tileHTML(PROJECTS.slice(half)),
    });
  }

  /* ================================================================
     B · Focus rail
     ================================================================ */

  const rail = document.querySelector("[data-rail]");

  if (rail) {
    const scroller = rail.querySelector("[data-rail-scroller]");
    const now = rail.querySelector("[data-rail-now]");
    const fill = rail.querySelector("[data-rail-fill]");
    const pad = (n) => String(n).padStart(2, "0");
    const total = PROJECTS.length;

    scroller.innerHTML = PROJECTS.map(
      (p, i) => `
      <li class="rail__slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${total}">
        <a class="rail__card" href="${p.url}" target="_blank" rel="noopener">
          <span class="rail__shot"><img src="${shot(p)}" alt="" width="1200" height="750" loading="lazy" decoding="async" draggable="false"></span>
          <span class="rail__meta">
            <span class="rail__label">
              <span class="rail__name">${p.name}</span>
              <span class="rail__sub">${p.tag} · ${p.year}</span>
            </span>
            <span class="rail__go">${arrow}</span>
          </span>
        </a>
      </li>`
    ).join("");

    const slides = Array.from(scroller.children);
    let index = 0;
    let auto = !reduce.matches;
    let hovering = false;
    let visible = true;

    const leftOf = (slide) =>
      slide.getBoundingClientRect().left -
      scroller.getBoundingClientRect().left +
      scroller.scrollLeft;

    const goTo = (i, smooth = true) => {
      i = (i + total) % total;
      const slide = slides[i];
      scroller.scrollTo({
        left: leftOf(slide) - (scroller.clientWidth - slide.clientWidth) / 2,
        behavior: smooth && !reduce.matches ? "smooth" : "auto",
      });
    };

    const paint = (i) => {
      if (i === index && slides[i].classList.contains("is-active")) return;
      index = i;
      slides.forEach((s, n) => s.classList.toggle("is-active", n === i));
      if (now) now.textContent = pad(i + 1);
      if (fill) fill.style.width = `${((i + 1) / total) * 100}%`;
    };

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const center = scroller.scrollLeft + scroller.clientWidth / 2;
        let best = 0;
        let bestDistance = Infinity;
        slides.forEach((slide, i) => {
          const d = Math.abs(leftOf(slide) + slide.clientWidth / 2 - center);
          if (d < bestDistance) {
            bestDistance = d;
            best = i;
          }
        });
        paint(best);
      });
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });

    rail.querySelectorAll("[data-rail-prev], [data-rail-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        auto = false;
        goTo(index + (btn.hasAttribute("data-rail-prev") ? -1 : 1));
      });
    });

    /* Any deliberate input takes over from the ambient advance. */
    const takeOver = () => (auto = false);
    rail.addEventListener("pointerdown", takeOver);

    rail.addEventListener("focusin", () => {
      hovering = true;
    });
    rail.addEventListener("focusout", (e) => {
      if (!rail.contains(e.relatedTarget)) hovering = false;
    });
    if (fine.matches) {
      rail.addEventListener("pointerenter", () => (hovering = true));
      rail.addEventListener("pointerleave", () => (hovering = false));
    }

    scroller.addEventListener("keydown", (e) => {
      const keys = { ArrowLeft: -1, ArrowRight: 1, PageUp: -1, PageDown: 1 };
      if (e.key in keys) {
        e.preventDefault();
        takeOver();
        goTo(index + keys[e.key]);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        takeOver();
        goTo(e.key === "Home" ? 0 : total - 1);
      }
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(rail);
    }

    window.setInterval(() => {
      if (!auto || !visible || hovering) return;
      if (document.hidden) return;
      goTo(index + 1);
    }, 5200);

    paint(0);
    window.addEventListener("load", () => paint(0));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        paint(index);
      });
    }
  }

  /* ================================================================
     C · Index
     ================================================================ */

  const index = document.querySelector("[data-index]");

  if (index) {
    const rows = Array.from(index.querySelectorAll("[data-row]"));
    const preview = index.querySelector("[data-preview]");
    const previewImg = preview.querySelector("img");
    const perRow = Math.ceil(PROJECTS.length / rows.length);

    const nameHTML = (list) =>
      list
        .map(
          (p) => `
        <li class="index__item">
          <a class="index__name" href="${p.url}" target="_blank" rel="noopener" data-shot="${shot(p)}" data-name="${p.name}">${p.name}</a>
          <span class="index__dot" aria-hidden="true"></span>
        </li>`
        )
        .join("");

    rows.forEach((row, i) => {
      makeTicker(row, {
        speed: [26, 17, 31][i % 3],
        dir: i % 2 === 0 ? 1 : -1,
        start: [0, 0.35, 0.7][i % 3],
        html: nameHTML(PROJECTS.slice(i * perRow, (i + 1) * perRow)),
      });
    });

    /* ---- hover preview ---- */
    let pointerX = 0;
    let pointerY = 0;
    let active = null;

    const place = (x, y) => {
      const w = preview.offsetWidth || 200;
      const h = preview.offsetHeight || 125;
      let left = x + 24;
      let top = y - h - 18;

      if (top < 14) top = y + 30;
      if (left + w > window.innerWidth - 18) left = x - w - 24;

      left = clamp(left, 18, Math.max(18, window.innerWidth - w - 18));
      top = clamp(top, 18, Math.max(18, window.innerHeight - h - 18));
      preview.style.setProperty("--x", `${left}px`);
      preview.style.setProperty("--y", `${top}px`);
    };

    const show = (link, x, y) => {
      window.clearTimeout(hideTimer);
      if (active !== link) {
        active = link;
        previewImg.src = link.dataset.shot;
      }
      preview.classList.add("is-visible");
      place(x, y);
    };

    let hideTimer = 0;

    const hide = (delay) => {
      window.clearTimeout(hideTimer);
      if (delay) {
        hideTimer = window.setTimeout(() => hide(), 140);
        return;
      }
      active = null;
      preview.classList.remove("is-visible");
    };

    if (fine.matches) {
      index.addEventListener("pointermove", (e) => {
        pointerX = e.clientX;
        pointerY = e.clientY;
        const link = e.target.closest(".index__name");
        if (link) show(link, pointerX, pointerY);
        else hide(true);
      });

      index.addEventListener("pointerleave", () => hide());
    }

    index.addEventListener("focusin", (e) => {
      const link = e.target.closest(".index__name");
      if (!link) return;
      const box = link.getBoundingClientRect();
      active = null;
      show(link, box.right - 40, box.top + box.height / 2);
    });

    index.addEventListener("focusout", (e) => {
      if (!index.contains(e.relatedTarget)) hide();
    });

    if (reduce.matches) {
      index.querySelectorAll(".index__row").forEach((row) => {
        row.style.overflowX = "auto";
      });
    }
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
