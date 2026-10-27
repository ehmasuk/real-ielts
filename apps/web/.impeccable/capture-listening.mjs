import { spawn } from "node:child_process"
import { writeFileSync, mkdirSync } from "node:fs"

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const PORT = 9223
const PAGE_URL = "http://localhost:3000/listening"
const OUT = "F:\\sas\\real-ielts\\apps\\web\\.impeccable\\review"
mkdirSync(OUT, { recursive: true })

/* Verification harness: the backend rate-limits (429), so every API call
   is fulfilled from captured-real data. Book _ids are harness-local;
   test _ids are the live API's real IDs. Signed-in results are simulated
   to exercise every result state. Nothing here ships in the app. */
const TEST_IDS = {
  7: ["6a53dfd1641f3ea1e61053d4", "6a53dfdf641f3ea1e61053d5", "6a568646992ff60f3a4fe77f", "6a53dff1641f3ea1e61053d7"],
  8: ["6a53df72641f3ea1e61053cc", "6a53df7c641f3ea1e61053cd", "6a53df84641f3ea1e61053ce", "6a53df8d641f3ea1e61053cf"],
  9: ["6a53df21641f3ea1e61053c4", "6a53df2a641f3ea1e61053c5", "6a53df33641f3ea1e61053c6", "6a53df3e641f3ea1e61053c7"],
  10: ["6a53de53641f3ea1e61053bc", "6a53de6b641f3ea1e61053bd", "6a53de76641f3ea1e61053be", "6a53de80641f3ea1e61053bf"],
  11: ["6a53ddf7641f3ea1e61053b4", "6a53de01641f3ea1e61053b5", "6a53de0a641f3ea1e61053b6", "6a53de17641f3ea1e61053b7"],
  12: ["6a53dd82641f3ea1e61053ac", "6a53dd8f641f3ea1e61053ad", "6a53dd9a641f3ea1e61053ae", "6a53dda5641f3ea1e61053af"],
  13: ["6a53dd04641f3ea1e61053a4", "6a53dd0d641f3ea1e61053a5", "6a53dd18641f3ea1e61053a6", "6a53dd22641f3ea1e61053a7"],
  14: ["6a53dcb0641f3ea1e610539c", "6a53dcbc641f3ea1e610539d", "6a53dcda641f3ea1e610539f", "6a53dcc7641f3ea1e610539e"],
  15: ["6a53dbea641f3ea1e6105393", "6a53dbf5641f3ea1e6105394", "6a53dc01641f3ea1e6105395", "6a53dc0c641f3ea1e6105396"],
  16: ["6a4e5336386acc4ceab670b0", "6a4e577c386acc4ceab670b6", "6a4e672be2aca170e8ff2244", "6a4e6a1ae2aca170e8ff2245"],
  17: ["6a4803ec48e6d9eadc5b1d25", "6a48046048e6d9eadc5b1d28", "6a4804d848e6d9eadc5b1d2b", "6a48053b48e6d9eadc5b1d2e"],
  18: ["6a47f65f48e6d9eadc5b1d14", "6a47f68448e6d9eadc5b1d15", "6a47f6aa48e6d9eadc5b1d16", "6a47f6ce48e6d9eadc5b1d17"],
  19: ["6a46c01d0322e2a3d9f45bbe", "6a46c19b0322e2a3d9f45bbf", "6a46c23d0322e2a3d9f45bc0", "6a46c2c20322e2a3d9f45bc1"],
  20: ["6a44e26ab56b16d2035f1a2a", "6a450b59f8aa5c34b98c86c0", "6a450df7f8aa5c34b98c86c1", "6a4679e9e9cb7a75ac3fbc96"],
  21: ["6a4950b886fdf894f7f000e9", "6a495420609792bc9a018ff2", "6a49ffdbc479fc665c1ccf5a", "6a4a0002c479fc665c1ccf5b"],
}

const BOOKS = [21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7].map((n) => ({
  _id: `bk-${n}`, number: n, title: `Cambridge IELTS ${n}`, slug: `cambridge-${n}`,
}))

const TESTS = []
for (const [num, ids] of Object.entries(TEST_IDS)) {
  ids.forEach((id, i) => TESTS.push({ _id: id, bookId: `bk-${num}`, testNumber: i + 1, skill: "listening", status: "published" }))
}

const RESULTS = [
  { testId: TEST_IDS[21][0], partNum: 1, score: 8, total: 10 },
  { testId: TEST_IDS[21][0], partNum: 2, score: 9, total: 10 },
  { testId: TEST_IDS[21][0], partNum: 3, score: 7, total: 10 },
  { testId: TEST_IDS[21][0], partNum: 4, score: 8, total: 10 },
  { testId: TEST_IDS[20][1], partNum: 1, score: 6, total: 10 },
  { testId: TEST_IDS[20][1], partNum: 2, score: 7, total: 10 },
  { testId: TEST_IDS[18][3], partNum: 1, score: 5, total: 10 },
  { testId: TEST_IDS[18][3], partNum: 2, score: 6, total: 10 },
  { testId: TEST_IDS[18][3], partNum: 3, score: 5, total: 10 },
  { testId: TEST_IDS[18][3], partNum: 4, score: 5, total: 10 },
  { testId: TEST_IDS[16][0], partNum: 1, score: 10, total: 10 },
  { testId: TEST_IDS[16][0], partNum: 2, score: 9, total: 10 },
  { testId: TEST_IDS[16][0], partNum: 3, score: 8, total: 10 },
  { testId: TEST_IDS[16][0], partNum: 4, score: 10, total: 10 },
  { testId: TEST_IDS[14][2], partNum: 1, score: 4, total: 10 },
]
const FULL_RESULTS = [
  { testId: TEST_IDS[21][0], skill: "listening", totalScore: 32, totalMax: 40 },
  { testId: TEST_IDS[16][0], skill: "listening", totalScore: 37, totalMax: 40 },
  { testId: TEST_IDS[14][2], skill: "listening", totalScore: 18, totalMax: 40 },
]

const JSON_HEADERS = [
  { name: "access-control-allow-origin", value: "http://localhost:3000" },
  { name: "access-control-allow-credentials", value: "true" },
  { name: "content-type", value: "application/json" },
]
const fulfillJson = (requestId, data) =>
  send("Fetch.fulfillRequest", { requestId, responseCode: 200, responseHeaders: JSON_HEADERS, body: Buffer.from(JSON.stringify(data)).toString("base64") })

const proc = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=C:\\Users\\amrre\\AppData\\Local\\Temp\\opencode\\chrome-cdp-listening",
  "--no-first-run",
  "about:blank",
], { stdio: "ignore" })

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

let target = null
for (let i = 0; i < 50; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()
    target = list.find((t) => t.type === "page")
    if (target) break
  } catch {}
  await wait(300)
}
if (!target) { console.log("NO_DEBUG_TARGET"); proc.kill(); process.exit(1) }

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })

let id = 0
const pending = new Map()
let mockResults = true
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
  else if (msg.method === "Fetch.requestPaused") {
    const { requestId, request } = msg.params
    const url = request.url
    if (url.includes("/api/books")) fulfillJson(requestId, BOOKS)
    else if (url.includes("/api/tests/list")) fulfillJson(requestId, TESTS)
    else if (url.includes("/api/tests/user-results")) fulfillJson(requestId, mockResults ? RESULTS : [])
    else if (url.includes("/api/tests/full-results")) fulfillJson(requestId, mockResults ? FULL_RESULTS : [])
    else send("Fetch.continueRequest", { requestId })
  }
}
const send = (method, params = {}) => new Promise((res) => {
  const i = ++id
  pending.set(i, res)
  ws.send(JSON.stringify({ id: i, method, params }))
})
const evalJs = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true })
  return r.result?.result?.value
}

await send("Page.enable")
await send("Fetch.enable", { patterns: [
  { urlPattern: "*://localhost:8080/api/*", requestStage: "Response" },
] })

async function waitReady(timeoutMs = 25000) {
  const t0 = Date.now()
  while (Date.now() - t0 < timeoutMs) {
    const ready = await evalJs(`!!document.querySelector('a[href$="/listening/full"]')`)
    if (ready) return true
    await wait(300)
  }
  return false
}

async function capture({ width, height, mobile, scheme, name, results = true, scroll = 0, dsf = 1, fullPage = true, search = null }) {
  mockResults = results
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: dsf, mobile })
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] })
  await send("Page.navigate", { url: PAGE_URL })
  const ready = await waitReady()
  if (!ready) console.log(name, "TIMEOUT_WAITING_FOR_DATA")
  if (search !== null) {
    await evalJs(`(() => {
      const input = document.querySelector('input[aria-label="Search Cambridge books"]')
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
      setter.call(input, ${JSON.stringify(search)})
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })()`)
    await wait(700)
  }
  if (scroll > 0) {
    await evalJs(`window.scrollTo(0, ${scroll})`)
    await wait(500)
  }
  await wait(300)
  const info = await evalJs(`(() => {
    const vw = document.documentElement.clientWidth
    const sw = document.documentElement.scrollWidth
    const bad = []
    document.querySelectorAll('main *').forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.right > vw + 1 || r.left < -1) bad.push({ tag: el.tagName, cls: String(el.className).slice(0, 90), left: Math.round(r.left), right: Math.round(r.right) })
    })
    return JSON.stringify({ vw, sw, y: Math.round(window.scrollY), bad: bad.slice(0, 10) })
  })()`)
  console.log(name, info)
  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: fullPage })
  writeFileSync(`${OUT}\\${name}.png`, Buffer.from(shot.result.data, "base64"))
}

await capture({ width: 1440, height: 900, mobile: false, scheme: "light", name: "listening-desktop" })
await capture({ width: 390, height: 844, mobile: true, scheme: "light", name: "listening-mobile" })
await capture({ width: 1440, height: 900, mobile: false, scheme: "dark", name: "listening-desktop-dark" })
await capture({ width: 390, height: 844, mobile: true, scheme: "dark", name: "listening-mobile-dark" })
await capture({ width: 1440, height: 900, mobile: false, scheme: "light", name: "listening-desktop-guest", results: false })
await capture({ width: 1440, height: 900, mobile: false, scheme: "light", name: "listening-desktop-scrolled", scroll: 1400 })
await capture({ width: 390, height: 844, mobile: true, scheme: "light", name: "listening-mobile-top", dsf: 2, fullPage: false })
await capture({ width: 390, height: 844, mobile: true, scheme: "light", name: "listening-mobile-register", scroll: 900, dsf: 2, fullPage: false })
await capture({ width: 1440, height: 900, mobile: false, scheme: "light", name: "listening-desktop-search", search: "19" })
await capture({ width: 1440, height: 900, mobile: false, scheme: "light", name: "listening-desktop-empty", search: "zzz" })

ws.close()
proc.kill()
console.log("DONE")
process.exit(0)
