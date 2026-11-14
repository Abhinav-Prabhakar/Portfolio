// Pixel-accurate screenshots via the DevTools protocol.
// Usage: node scripts/shoot.mjs <url> <outdir> <width> <height> <scrollY,scrollY,...>
import { spawn } from "node:child_process";
import { mkdir, writeFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, outdir, ...nums] = process.argv.slice(2);
const width = Number(nums[0] || 1440);
const height = Number(nums[1] || 900);
const scrolls = (nums[2] || "0").split(",").map(Number);
const prefix = nums[3] || "shot";

const shell =
  process.env.HOME +
  "/Library/Caches/ms-playwright/chromium_headless_shell-1254/chrome-headless-shell-mac-arm64/chrome-headless-shell";

const profile = await mkdtemp(join(tmpdir(), "shoot-"));
const port = 9333 + Math.floor(Math.random() * 200);

const chrome = spawn(shell, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--no-default-browser-check",
  "--hide-scrollbars",
  "--force-color-profile=srgb",
  "about:blank",
]);

const wsUrl = await new Promise((resolve, reject) => {
  let buf = "";
  const timer = setTimeout(() => reject(new Error("devtools timeout")), 10000);
  chrome.stderr.on("data", (d) => {
    buf += d.toString();
    const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) {
      clearTimeout(timer);
      resolve(m[1]);
    }
  });
});

const info = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const target = info.find((t) => t.type === "page");
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
const problems = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.method === "Runtime.exceptionThrown") {
    const d = msg.params?.exceptionDetails;
    problems.push(`exception: ${d?.exception?.description || d?.text} @${d?.url}:${d?.lineNumber}`);
  }
  if (msg.method === "Log.entryAdded" && msg.params?.entry?.level === "error") {
    problems.push(`log: ${msg.params.entry.text} ${msg.params.entry.url || ""}`);
  }
  if (id && msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return r.result?.value;
};

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Emulation.setEmulatedMedia", {
  features: [
    {
      name: "prefers-reduced-motion",
      value: process.env.REDUCE ? "reduce" : "no-preference",
    },
  ],
});
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor: Number(process.env.DPR || 2),
  mobile: false,
});
if (process.env.INIT) {
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: process.env.INIT,
  });
}
await send("Page.navigate", { url });
await wait(1200);
await evaluate("document.fonts.ready.then(() => true)");
await wait(1600);

await mkdir(outdir, { recursive: true });

if (process.env.TAB) {
  for (let i = 0; i < Number(process.env.TAB); i++) {
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    await wait(120);
  }
  await wait(600);
}

if (process.env.EVAL) {
  const out = await evaluate(process.env.EVAL);
  console.log("eval", JSON.stringify(out));
}

for (const y of scrolls) {
  await evaluate(`window.scrollTo(0, ${y}); true`);
  await wait(1100);
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  const file = join(outdir, `${prefix}-${y}.png`);
  await writeFile(file, Buffer.from(shot.data, "base64"));
  console.log(file);
}

const metrics = await evaluate(
  `(() => {
    const box = (sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return {top: Math.round(r.top + scrollY), h: Math.round(r.height), w: Math.round(r.width)}; };
    return JSON.stringify({
      sw: document.documentElement.scrollWidth,
      sh: document.documentElement.scrollHeight,
      iw: innerWidth, ih: innerHeight,
      hero: box('.hero'), title: box('.hero__title'), sites: box('.sites'), marquee: box('.marquee')
    });
  })()`
);
console.log("metrics", metrics);

if (problems.length) {
  console.log("problems", JSON.stringify(problems, null, 2));
}

ws.close();
chrome.kill("SIGKILL");
