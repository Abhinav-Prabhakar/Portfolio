/* ------------------------------------------------------------------
   Selected work

   Two lanes of bare thumbnails drifting against each other. Every
   project that ships a screenshot in its README is here; where the
   README has a GIF, the tile plays it on hover.

   The lane is a JS track so it can ease to a stop under the pointer
   and glide back up, loop without a seam, and pause for keyboard
   focus while bringing the focused tile into view.
   ------------------------------------------------------------------ */

(() => {
  "use strict";

const PROJECTS = [
    {
      name: "Teacher",
      url: "https://teacher-ten-theta.vercel.app/",
      img: "teacher",
      ratio: 1600 / 1200,
      tags: ["AI", "Education"],
      blurb:
        "A voice-only AI tutor that draws while it explains. One spoken question becomes a complete illustrated lesson, stroke by stroke.",
    },
    {
      name: "Coding Club",
      url: "https://abhinav-prabhakar.github.io/CodingClub/",
      img: "codingclub",
      video: "codingclub",
      ratio: 1600 / 900,
      tags: ["Community", "Web"],
      blurb:
        "The college coding club rebuilt as a Windows XP desktop you can boot, log into and explore — events in a calendar, the team in an IM window, the leaderboard in Task Manager.",
    },
    {
      name: "Mantle",
      url: null,
      img: "mantle",
      video: "mantle",
      ratio: 1600 / 1000,
      tags: ["3D", "Engineering"],
      blurb:
        "A physics-first digital twin of an oil well: the 3D diorama dolly-zooms flat while the same live well crystallises into a blueprint — steam, pump and reservoir as one system.",
    },
    {
      name: "Pantry",
      url: "https://pantry-lac-mu.vercel.app/",
      img: "pantry",
      ratio: 1600 / 1000,
      tags: ["Health", "Data"],
      blurb:
        "Plan a week of food around your body, cook the whole thing in one afternoon, then follow all 49 nutrients down to the last microgram.",
    },
    {
      name: "JEE Tracker",
      url: "https://jeetracker-ten.vercel.app/",
      img: "jeetracker",
      ratio: 1440 / 1440,
      tags: ["Education", "Data"],
      blurb:
        "A quiet ledger of showing up: one hue, three subjects and a year of small squares for JEE prep.",
    },
    {
      name: "Chunky",
      url: "https://abhinav-prabhakar.github.io/Chunky/",
      img: "chunky",
      video: "chunky",
      ratio: 1554 / 1018,
      tags: ["Reading", "Education"],
      blurb:
        "RSVP word chunks, comprehension quizzes and stats that keep you honest. Read faster, then prove you understood it.",
    },
    {
      name: "Askēsis",
      url: "https://abhinav-prabhakar.github.io/Askesis/",
      img: "askesis",
      ratio: 1600 / 960,
      tags: ["Editorial", "Philosophy"],
      blurb:
        "A pocket library of philosophy set as one red poster and a single cream reading sheet. Six rooms, no feed, no autoplay.",
    },
    {
      name: "Cue",
      url: "https://abhinav-prabhakar.github.io/CueScreenWriter/",
      img: "cue",
      ratio: 1600 / 1000,
      tags: ["macOS", "Writing"],
      blurb:
        "A native Mac screenwriting app with a hand-built TextKit editor, a scene list that keeps score, and a desk lamp that follows the time of day.",
    },
    {
      name: "Gigwire",
      url: "https://abhinav-prabhakar.github.io/Gigwire/",
      img: "gigwire",
      ratio: 1440 / 1080,
      tags: ["Music", "Community"],
      blurb:
        "A handmade gig board for live music in India — rooms post the night, players send a one-sheet, everybody gets paid on the night.",
    },
    {
      name: "KeyChange",
      url: "https://abhinav-prabhakar.github.io/KeyChange/",
      img: "keychange",
      ratio: 1600 / 1111,
      tags: ["Music", "macOS"],
      blurb:
        "Turns any MIDI piano into a keyboard. Play a letter, hit it harder for bold, tap soft for italic, and let chords fire whole words.",
    },
    {
      name: "Folio",
      url: "https://abhinav-prabhakar.github.io/Folio/",
      img: "folio",
      video: "folio",
      ratio: 2,
      tags: ["Books", "Education"],
      blurb:
        "Six photo-real hardcovers a day from a library of 1,300+ summaries, then a quiet recall quiz on what actually stuck.",
    },
    {
      name: "Metro Live",
      url: "https://abhinav-prabhakar.github.io/ProjectMetro/",
      img: "metro",
      video: "metro",
      ratio: 1440 / 900,
      tags: ["3D", "Cities"],
      blurb:
        "A real-time 3D tracker for the whole Hyderabad Metro network — 57 stations, 57 sets in service, and a city that switches on at night.",
    },
    {
      name: "PAO",
      url: "https://abhinav-prabhakar.github.io/PAO/",
      img: "pao",
      ratio: 1440 / 1000,
      tags: ["Memory", "Web"],
      blurb:
        "Turn digits into frames. Six digits become a person, an action and an object, drawn in ASCII for pi, phone numbers and birthdays.",
    },
    {
      name: "Justice Leagues",
      url: "https://abhinav-prabhakar.github.io/JusticeLeagues/",
      img: "justice",
      ratio: 1440 / 1000,
      tags: ["Civic", "Community"],
      blurb:
        "A local-first civic newspaper for citywide leagues, neighbourhood chapters, volunteer shifts and Justice Points.",
    },
    {
      name: "GitCode",
      url: "https://abhinav-prabhakar.github.io/GitCode/",
      img: "gitcode",
      ratio: 1440 / 900,
      tags: ["Developer", "Education"],
      blurb:
        "LeetCode for Git: recover lost commits, untangle merges, rebase shared branches and bisect regressions in the browser.",
    },
    {
      name: "AnttiCP",
      url: "https://abhinav-prabhakar.github.io/AnttiCP/",
      img: "antti",
      ratio: 1440 / 1080,
      tags: ["Education", "Editorial"],
      blurb:
        "Antti Laaksonen's Guide to Competitive Programming rebuilt as a place you can read and touch — 300+ hand-built diagrams.",
    },
    {
      name: "Jury",
      url: "https://abhinav-prabhakar.github.io/Jury/",
      img: "jury",
      ratio: 1500 / 1414,
      tags: ["AI", "Editorial"],
      blurb:
        "An AI judging panel for hackathons, set as a warm-paper editorial landing page with cinematic plates and a verdict.",
    },
    {
      name: "MaxWell",
      url: "https://max-well-tau.vercel.app",
      img: "maxwell",
      ratio: 1200 / 750,
      tags: ["Health", "AI"],
      blurb:
        "Triage-first care navigation for rural clinics: symptoms in, an urgency level out, the nearest place that can help, and a doctor-ready handoff.",
    },
    {
      name: "Cockpit",
      url: "https://abhinav-prabhakar.github.io/Cockpit/",
      img: "cockpit",
      video: "cockpit",
      ratio: 1600 / 900,
      tags: ["3D", "Simulation"],
      blurb:
        "A photoreal 3D fire dispatch desk that runs in the browser — seven live screens, a working joystick, a city of units and a radio that never stops.",
    },
    {
      name: "Vera",
      url: "https://abhinav-prabhakar.github.io/Vera/",
      img: "vera",
      video: "vera",
      ratio: 1600 / 1000,
      tags: ["Hardware", "3D"],
      blurb:
        "A real-time digital twin of a hydroponic greenhouse: 42 simulated sensors, ten pieces of equipment you can drive, and an ESP8266 that takes over when the browser closes.",
    },
    {
      name: "Waterful",
      url: "https://github.com/Abhinav-Prabhakar/Waterful",
      img: "waterful",
      video: "waterful",
      ratio: 1600 / 764,
      tags: ["Health", "Web"],
      blurb:
        "A small Razor Pages app that counts your glasses, keeps the streak alive and quietly nudges you toward eight cups a day.",
    },
    {
      name: "10,000 Hours",
      url: "https://abhinav-prabhakar.github.io/10k/",
      img: "tenk",
      ratio: 1440 / 814,
      tags: ["Editorial", "Practice"],
      blurb:
        "A long-form argument with the ten-thousand-hour myth, set as a scroll that admits the first week is loud and continuing is the actual work.",
    },
    {
      name: "Cellular Analysis",
      url: "https://abhinav-prabhakar.github.io/CellularAnalysis/",
      img: "cellular",
      ratio: 1600 / 1616,
      tags: ["Engineering", "Education"],
      blurb:
        "Drag Eb/N₀ and watch QPSK, 16-QAM and 64-QAM constellations smear into noise, with BER curves and spectral efficiency reacting on the same page.",
    },
    {
      name: "Chessbook",
      url: "https://abhinav-prabhakar.github.io/chessbook-clone/",
      img: "chessbook",
      ratio: 1440 / 900,
      tags: ["Chess", "Learning"],
      blurb:
        "A local-first opening repertoire trainer — React, Express and SQLite on your own machine, with a move tree, drills and the landing page to match.",
    },
    {
      name: "CNP Department",
      url: "https://github.com/Abhinav-Prabhakar/CNPDepartment",
      img: "cnp",
      video: "cnp",
      ratio: 1600 / 1000,
      tags: ["Civic", "Community"],
      blurb:
        "One platform for a university's student-run clubs and GUIITAR projects — events, membership, funding and the paperwork in between.",
    },
    {
      name: "RakeMeter",
      url: "https://github.com/Abhinav-Prabhakar/RakeMeter",
      img: "rakemeeter",
      video: "rakemeeter",
      ratio: 1600 / 900,
      tags: ["Logistics", "Data"],
      blurb:
        "A coal rake gets seven free hours to unload. This meter runs in rupees, plans the wagons and audits the railway's demurrage bill.",
    },
    {
      name: "Habie",
      url: "https://abhinav-prabhakar.github.io/Habie/",
      img: "habie",
      video: "habie",
      ratio: 1600 / 1162,
      tags: ["Health", "Web"],
      blurb:
        "A habit tracker you grow like a garden: every habit is a plant, every logged day fills its ring, and a little 3D buddy cheers you on.",
    },
    {
      name: "Parlor",
      url: "https://abhinav-prabhakar.github.io/Parlor/",
      img: "parlor",
      ratio: 1600 / 1142,
      tags: ["Data", "Commerce"],
      blurb:
        "A payments dashboard with executive KPIs, a funnel that shows exactly where checkout leaks, and charts you can interrogate instead of admire.",
    },
    {
      name: "Brew",
      url: "https://github.com/Abhinav-Prabhakar/Brew",
      img: "brew",
      video: "brew",
      ratio: 1600 / 1000,
      tags: ["AI", "Simulation"],
      blurb:
        "A cosy café that happens to be an ML system — a live digital twin where a learned manager decides what to prep, what to charge and what to rescue.",
    },
    {
      name: "Cellar",
      url: "https://abhinav-prabhakar.github.io/Cellar/",
      img: "cellar",
      video: "cellar",
      ratio: 1440 / 2008,
      tags: ["CLI", "Developer"],
      blurb:
        "Sixteen Homebrew command-line upgrades, each explained with a picture instead of a man page, behind a tiny fuzzy finder.",
    },
    {
      name: "Dock",
      url: "https://github.com/Abhinav-Prabhakar/Dock",
      img: "dock",
      ratio: 1600 / 1000,
      tags: ["AI", "Logistics"],
      blurb:
        "Dynamic pricing for container ships: a trained policy quotes counter-offers, a hash-chained ledger records every booking, settlement runs on-chain.",
    },
    {
      name: "Warden",
      url: "https://warden-eight-theta.vercel.app",
      img: "warden",
      ratio: 1600 / 894,
      tags: ["Health", "AI"],
      blurb:
        "Voice-first hospital operations for the ward — ask for a bed, a handover or a status and get an answer without leaving the patient.",
    },
    {
      name: "CampusGenie",
      url: "https://campus-genie-ivory.vercel.app",
      img: "campusgenie",
      ratio: 1012 / 1082,
      tags: ["AI", "Education"],
      blurb:
        "A governed conversational front door to a whole campus: events, clubs, labs and alumni pathways, with the sources shown.",
    },
    {
      name: "Meridian",
      url: "https://meridian-delta-rose.vercel.app/",
      img: "meridian",
      ratio: 1600 / 910,
      tags: ["Productivity", "Web"],
      blurb:
        "A calendar operating system: pull events out of every chat app, see the team's timelines side by side and find the hour that actually works.",
    },
    {
      name: "LinkVault",
      url: "https://link-vault-omega.vercel.app/",
      img: "linkvault",
      ratio: 1600 / 884,
      tags: ["Tools", "Reading"],
      blurb:
        "A local-first vault for the links you swear you'll reread, with optional AI tagging so the pile turns back into a library.",
    },
    {
      name: "Papyrus",
      url: "https://github.com/Abhinav-Prabhakar/Papyrus",
      img: "papyrus",
      ratio: 1600 / 1038,
      tags: ["AI", "Education"],
      blurb:
        "Upload a PDF and get a quiz back in seconds — multiple choice, matching and short answer, charts and formulas included.",
    },
    {
      name: "Verge",
      url: "https://verge-sandy.vercel.app",
      img: "verge",
      ratio: 1600 / 886,
      tags: ["Civic", "Data"],
      blurb:
        "An AI-driven traffic operations platform: city-scale monitoring, incident detection and signal analytics in one console.",
    },
    {
      name: "ECE Definitions",
      url: "https://abhinav-prabhakar.github.io/ECEDefinitions/",
      img: "ece",
      ratio: 1440 / 1000,
      tags: ["Education", "Engineering"],
      blurb:
        "Circuit, signal and semiconductor definitions as one-liners you can drill in a spare minute.",
    },
    {
      name: "Software Definitions",
      url: "https://abhinav-prabhakar.github.io/SoftwareDefinitions/",
      img: "software",
      ratio: 1440 / 1000,
      tags: ["Education", "Reference"],
      blurb:
        "The vocabulary that shows up in every system-design round, reduced to one line each and drilled until it's automatic.",
    },
    {
      name: "Plumbing Definitions",
      url: "https://abhinav-prabhakar.github.io/PlumbingDefinitions/",
      img: "plumbing",
      ratio: 1440 / 1000,
      tags: ["Education", "Trade"],
      blurb:
        "Plumbing code one-liners — the numbers and terms a licensed job turns on, in plain language.",
    },
    {
      name: "Pharmacology Definitions",
      url: "https://abhinav-prabhakar.github.io/PharmacologyDefinitions/",
      img: "pharmacology",
      ratio: 1440 / 1000,
      tags: ["Education", "Health"],
      blurb:
        "Drug classes, mechanisms and side effects as one-line cards, built for the ten minutes before a quiz.",
    },
    {
      name: "Nursing Definitions",
      url: "https://abhinav-prabhakar.github.io/NursingDefinitions/",
      img: "nursing",
      ratio: 1440 / 1000,
      tags: ["Education", "Health"],
      blurb:
        "NCLEX terminology as one-liners, grouped the way the exam actually asks for it.",
    },
    {
      name: "NEC Definitions",
      url: "https://abhinav-prabhakar.github.io/NECDefinitions/",
      img: "nec",
      ratio: 1440 / 1000,
      tags: ["Education", "Trade"],
      blurb:
        "Electrical code definitions from the NEC, stripped to a sentence each and drilled until they stick.",
    },
    {
      name: "Medical Definitions",
      url: "https://abhinav-prabhakar.github.io/MedicalDefinitions/",
      img: "medical",
      ratio: 1440 / 1000,
      tags: ["Education", "Health"],
      blurb:
        "Medical terminology one-liners for the prefixes, procedures and findings you meet on the ward.",
    },
    {
      name: "Legal Definitions",
      url: "https://abhinav-prabhakar.github.io/LegalDefinitions/",
      img: "legal",
      ratio: 1440 / 1000,
      tags: ["Education", "Law"],
      blurb:
        "US law definitions as one-liners — the terms that decide an argument, without the casebook.",
    },
    {
      name: "HVAC Definitions",
      url: "https://abhinav-prabhakar.github.io/HVACDefinitions/",
      img: "hvac",
      ratio: 1440 / 1000,
      tags: ["Education", "Trade"],
      blurb:
        "HVAC one-liners for the load, the duct and the refrigerant, in language a tech actually uses.",
    },
    {
      name: "Anatomy Definitions",
      url: "https://abhinav-prabhakar.github.io/AnatomyDefinitions/",
      img: "anatomy",
      ratio: 1440 / 1000,
      tags: ["Education", "Health"],
      blurb:
        "Anatomy definitions as one-line cards, from planes and processes to the things they attach to.",
    },
  ];

  const shot = (p) => `assets/projects/${p.img}.jpg`;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  document
    .querySelectorAll("[data-count]")
    .forEach((el) => (el.textContent = `${PROJECTS.length} projects`));

  const arrow = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* README GIFs are re-encoded as muted MP4 loops. They stay unloaded
     until a pointer actually lands on the tile. */
  const hoverVideo = (p) =>
    p.video
      ? `<video class="hovervid" src="assets/projects/video/${p.video}.mp4" muted loop playsinline preload="none" poster="${shot(
          p
        )}" aria-hidden="true"></video>`
      : "";

  function bindHoverVideo(root, selector) {
    const hostFor = (target) =>
      target instanceof Element ? target.closest(selector) : null;

    root.addEventListener("pointerover", (event) => {
      const host = hostFor(event.target);
      if (!host) return;
      const video = host.querySelector(".hovervid");
      if (!video || reduce.matches) return;
      host.classList.add("is-playing");
      const played = video.play();
      if (played && played.catch) played.catch(() => {});
    });

    root.addEventListener("pointerout", (event) => {
      const host = hostFor(event.target);
      if (!host) return;
      if (
        event.relatedTarget instanceof Node &&
        host.contains(event.relatedTarget)
      )
        return;
      const video = host.querySelector(".hovervid");
      if (!video) return;
      host.classList.remove("is-playing");
      video.pause();
      video.currentTime = 0;
    });
  }

  const sheet = document.querySelector("[data-sheet]");
  if (!sheet) return;

  const hosts = Array.from(sheet.querySelectorAll("[data-lane]"));
  if (hosts.length !== 2) return;

  const tileHTML = (list) =>
    list
      .map((p) => {
        const inner = `
            <span class="tile__shot"><img src="${shot(
              p
            )}" alt="" width="1200" height="750" loading="lazy" decoding="async" draggable="false">${hoverVideo(
          p
        )}</span>
            <span class="tile__name">${p.name}${
          p.url ? `<span class="tile__arrow">${arrow}</span>` : ""
        }</span>`;
        const wrap = p.url
          ? `<a class="tile__link" href="${p.url}" target="_blank" rel="noopener" aria-label="${p.name} — opens in a new tab">${inner}</a>`
          : `<div class="tile__link">${inner}</div>`;

        return `
        <li class="tile">${wrap}</li>`;
      })
      .join("");

  const lanes = [];
  let running = false;
  let previous = 0;

  function frame(now) {
    let dt = (now - previous) / 1000;
    previous = now;
    if (!(dt > 0)) dt = 0.016;
    dt = Math.min(dt, 0.05);

    let alive = false;

    for (const t of lanes) {
      if (!t.visible || !t.w || reduce.matches) continue;

      const goal = t.paused ? 0 : t.speed;
      t.vel += (goal - t.vel) * (1 - Math.exp(-dt * 5));
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

  const nudge = () => {
    if (running || reduce.matches) return;
    running = true;
    previous = performance.now();
    requestAnimationFrame(frame);
  };

  function centerOn(t, tile) {
    if (!t.w) return;
    const view = t.host.getBoundingClientRect();
    const box = tile.getBoundingClientRect();
    t.x += view.left + view.width / 2 - (box.left + box.width / 2);
    t.track.style.transform = `translate3d(${t.x.toFixed(2)}px, 0, 0)`;
  }

  function makeLane(host, { speed, dir = 1, start = 0, html }) {
    const track = document.createElement("div");
    track.className = "tick";
    track.innerHTML = `<ul class="tick__group">${html}</ul>`;

    const group = track.firstElementChild;
    const clone = group.cloneNode(true);
    clone.classList.add("is-clone");
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a").forEach((a) => (a.tabIndex = -1));
    track.append(clone);
    host.append(track);

    const t = {
      host,
      track,
      group,
      x: 0,
      w: 0,
      speed,
      dir,
      vel: 0,
      paused: false,
      visible: true,
      start,
      measured: false,
    };
    lanes.push(t);

    const measure = () => {
      t.w = t.group.getBoundingClientRect().width;
      if (!t.measured && t.w) {
        /* The start offset only exists to de-phase the lanes; a
           scrollable (reduced-motion) lane begins at its first item. */
        t.x = reduce.matches ? 0 : -t.w * t.start;
        t.measured = true;
        t.track.style.transform = `translate3d(${t.x.toFixed(2)}px, 0, 0)`;
      }
    };

    host.addEventListener("pointerenter", () => {
      t.paused = true;
    });
    host.addEventListener("pointerleave", () => {
      t.paused = false;
      nudge();
    });

    /* Keyboard focus stops the lane and brings the tile into view. */
    host.addEventListener("focusin", (event) => {
      t.paused = true;
      const tile = event.target.closest(".tile");
      if (tile) centerOn(t, tile);
    });
    host.addEventListener("focusout", (event) => {
      if (host.contains(event.relatedTarget)) return;
      t.paused = false;
      nudge();
    });

    measure();

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          t.visible = entry.isIntersecting;
          if (t.visible) nudge();
        },
        { rootMargin: "140px 0px" }
      ).observe(host);
    }

    if ("ResizeObserver" in window) {
      new ResizeObserver(measure).observe(group);
    }

    return t;
  }

  const half = Math.ceil(PROJECTS.length / 2);

  makeLane(hosts[0], {
    speed: 34,
    dir: 1,
    start: 0,
    html: tileHTML(PROJECTS.slice(0, half)),
  });

  makeLane(hosts[1], {
    speed: 25,
    dir: -1,
    start: 0.55,
    html: tileHTML(PROJECTS.slice(half)),
  });

  bindHoverVideo(sheet, ".tile");

  const remeasure = () => {
    for (const t of lanes) {
      t.w = t.group.getBoundingClientRect().width;
    }
  };

  window.addEventListener("resize", remeasure);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(remeasure);
  }

  if (!reduce.matches) nudge();
})();
