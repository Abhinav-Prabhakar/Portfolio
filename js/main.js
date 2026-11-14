/* ------------------------------------------------------------------
   Hero motion

   · The globe is a real sphere, not a crossfade: an orthographic
     ray-sphere in WebGL. Its map is an equirectangular Earth
     reconstructed from Apple's own globe emoji pixels and palette,
     lit by a screen-locked shading pass baked from the same emoji, so
     it reads as the emoji at every angle. It turns on its own and
     picks up speed while the page scrolls.
   · The ladder is a standing object: a slow idle sway plus a damped
     spring that lifts it when the page moves.
   ------------------------------------------------------------------ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $ = (selector, root = document) => root.querySelector(selector);
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  /* the Americas face of Apple's 🌎 */
  const START_ANGLE = (-78.5 * Math.PI) / 180;

  /* ---------------- globe ---------------- */

  const VERT = `
    attribute vec2 p;
    void main() { gl_Position = vec4(p, 0.0, 1.0); }
  `;

  const FRAG = `
    precision mediump float;

    uniform sampler2D earth;
    uniform sampler2D shade;
    uniform vec2 spin;
    uniform vec2 size;

    const float PI = 3.14159265359;
    const float TAU = 6.28318530718;
    const float LO = -1.18;
    const float HI = 1.18;

    /* Apple's globe is tipped ~9.5° north; match it so the visible face
       sits exactly where the emoji's does */
    const float TILT_C = 0.986277;
    const float TILT_S = -0.165047;

    void main() {
      /* device pixels, then a -1..1 disc; 0.981 matches the margin the
         Apple glyph keeps inside its em square */
      vec2 v = ((gl_FragCoord.xy / size) * 2.0 - 1.0) / 0.981;
      float r2 = dot(v, v);

      /* antialiased silhouette: one device pixel of feather, computed in
         normalised units so no derivative extension is needed */
      float px = 2.0 / size.x;
      float mask = 1.0 - smoothstep(1.0 - px * 1.6, 1.0 + px * 0.55, r2);
      if (mask <= 0.002) discard;

      float z = sqrt(max(1.0 - r2, 0.0));
      float y1 = TILT_C * v.y - TILT_S * z;
      float z1 = TILT_S * v.y + TILT_C * z;

      float gx = spin.x * v.x + spin.y * z1;
      float gz = -spin.y * v.x + spin.x * z1;

      float lon = atan(gx, gz);
      float lat = asin(clamp(y1, -1.0, 1.0));
      vec2 uv = vec2(lon / TAU + 0.5, 0.5 - lat / PI);

      /* stored as sqrt(albedo / 1020), and the shade is a screen-locked
         field baked from the same emoji; 1020 / 255 folds into 4 */
      vec3 texel = texture2D(earth, uv).rgb;
      vec3 albedo = texel * texel * 4.0;
      float light = texture2D(shade, vec2((v.x - LO) / (HI - LO),
                                          (HI - v.y) / (HI - LO))).r;

      vec3 col = clamp(albedo * light, 0.0, 1.0);
      gl_FragColor = vec4(col * mask, mask);
    }
  `;

  function compile(gl, type, source) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error("shader: " + gl.getShaderInfoLog(sh));
    }
    return sh;
  }

  function texture(gl) {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  const canvas = $("[data-globe-canvas]");
  const fallback = $("[data-globe] img");

  if (canvas) {
    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
      }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
      });

    if (gl) {
      /* an old driver can refuse the shader; the still emoji stays in that
         case and the rest of the page is unaffected */
      let prog = null;
      try {
        prog = gl.createProgram();
        gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
      } catch (err) {
        prog = null;
      }

      if (prog && gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.useProgram(prog);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW
        );
        const loc = gl.getAttribLocation(prog, "p");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        const uSpin = gl.getUniformLocation(prog, "spin");
        const uSize = gl.getUniformLocation(prog, "size");
        gl.uniform1i(gl.getUniformLocation(prog, "earth"), 0);
        gl.uniform1i(gl.getUniformLocation(prog, "shade"), 1);

        let dpr = 1;
        let cssSize = 0;

        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          const next = Math.min(2, window.devicePixelRatio || 1);
          const side = Math.round(rect.width || 140);
          dpr = next;
          cssSize = side;
          if (canvas.width !== Math.round(side * next)) {
            canvas.width = Math.round(side * next);
            canvas.height = Math.round(side * next);
          }
          gl.viewport(0, 0, canvas.width, canvas.height);
        };

        let angle = START_ANGLE;
        let spin = 0;
        let scrollBoost = 0;
        let lastY = window.scrollY;
        let ready = false;
        let visible = true;
        let running = false;
        let previous = 0;

        const draw = () => {
          gl.clear(gl.COLOR_BUFFER_BIT);
          if (!ready) return;
          gl.uniform2f(uSpin, Math.cos(angle), Math.sin(angle));
          gl.uniform2f(uSize, canvas.width, canvas.height);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };

        const frame = (now) => {
          let dt = (now - previous) / 1000;
          previous = now;
          if (!(dt > 0)) dt = 0.016;
          dt = Math.min(dt, 0.05);

          const still = reduceMotion.matches;
          /* idle drift, plus energy from the scroll, always easing back */
          const idle = still ? 0 : 0.17;
          const goal = idle;
          spin += (goal - spin) * (1 - Math.exp(-dt * 4));
          scrollBoost *= Math.exp(-dt * 3.2);

          angle += (spin + scrollBoost) * dt;
          draw();

          if (visible && !still) requestAnimationFrame(frame);
          else running = false;
        };

        const start = () => {
          if (running) return;
          running = true;
          previous = performance.now();
          requestAnimationFrame(frame);
        };

        window.addEventListener(
          "scroll",
          () => {
            const y = window.scrollY;
            scrollBoost = clamp(scrollBoost + (y - lastY) * 0.0035, -6, 6);
            lastY = y;
            if (!reduceMotion.matches) start();
          },
          { passive: true }
        );

        window.addEventListener("resize", () => {
          resize();
          draw();
        });

        if ("ResizeObserver" in window) {
          new ResizeObserver(() => {
            resize();
            draw();
          }).observe(canvas);
        }

        if ("IntersectionObserver" in window) {
          new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
          }).observe(canvas);
        }

        Promise.all([
          loadImage("assets/emoji/earth-apple.jpg"),
          loadImage("assets/emoji/globe-shade.png"),
        ])
          .then(([earthImg, shadeImg]) => {
            /* texture() binds on the *active* unit, so set the unit first */
            gl.activeTexture(gl.TEXTURE0);
            const earthTex = texture(gl);
            gl.bindTexture(gl.TEXTURE_2D, earthTex);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              earthImg
            );

            gl.activeTexture(gl.TEXTURE1);
            const shadeTex = texture(gl);
            gl.bindTexture(gl.TEXTURE_2D, shadeTex);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              shadeImg
            );
            gl.activeTexture(gl.TEXTURE0);

            ready = true;
            canvas.classList.add("is-ready");
            if (fallback) fallback.classList.add("is-hidden");
            resize();
            draw();
            start();
          })
          .catch(() => {
            /* keep the still emoji */
          });
      }
    }
  }

  /* ---------------- ladder ---------------- */

  const ladder = $("[data-ladder] img");
  let lift = 0;
  let liftVel = 0;
  let tilt = 0;
  let tiltVel = 0;
  let scrollDelta = 0;
  let lastY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      scrollDelta += y - lastY;
      lastY = y;
      if (ladder && !reduceMotion.matches) startLadder();
    },
    { passive: true }
  );

  let ladderRunning = false;
  let ladderPrevious = 0;

  function ladderFrame(now) {
    let dt = (now - ladderPrevious) / 1000;
    ladderPrevious = now;
    if (!(dt > 0)) dt = 0.016;
    dt = Math.min(dt, 0.05);

    const delta = clamp(scrollDelta, -520, 520);
    scrollDelta = 0;

    liftVel += delta * 0.62;
    tiltVel += delta * 0.11;

    const stiffness = 85;
    const damping = 9;

    liftVel += (-stiffness * lift - damping * liftVel) * dt;
    lift = clamp(lift + liftVel * dt, -2, 14);

    tiltVel += (-stiffness * tilt - damping * tiltVel) * dt;
    tilt = clamp(tilt + tiltVel * dt, -4.6, 4.6);

    if (ladder) {
      /* a slow lean that never quite repeats, so the ladder reads as
         standing on the line rather than pasted onto it */
      const sway =
        3.5 * Math.sin(now * 0.00071) + 1.3 * Math.sin(now * 0.0019 + 1.7);
      const rotation = sway + tilt;
      const y = -lift * 0.01 - 0.006 * (1 + Math.sin(now * 0.0011 + 0.4));
      ladder.style.transform = `translate3d(0, ${y.toFixed(3)}em, 0) rotate(${rotation.toFixed(2)}deg)`;
    }

    if (!reduceMotion.matches) requestAnimationFrame(ladderFrame);
    else ladderRunning = false;
  }

  function startLadder() {
    if (ladderRunning) return;
    ladderRunning = true;
    ladderPrevious = performance.now();
    requestAnimationFrame(ladderFrame);
  }

  if (ladder && !reduceMotion.matches) startLadder();
})();
