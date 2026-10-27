import { spawn } from "node:child_process"
import { writeFileSync } from "node:fs"

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const PORT = 9223
const PAGE_URL = "http://localhost:3000/listening"
const OUT = "F:\\sas\\real-ielts\\apps\\web\\.impeccable\\review"

const TEST_IDS = {
  21: ["6a4950b886fdf894f7f000e9", "6a495420609792bc9a018ff2", "6a49ffdbc479fc665c1ccf5a", "6a4a0002c479fc665c1ccf5b"],
  20: ["6a44e26ab56b16d2035f1a2a", "6a450b59f8aa5c34b98c86c0", "6a450df7f8aa5c34b98c86c1", "6a4679e9e9cb7a75ac3fbc96"],
}
const BOOKS = [21, 20].map((n) => ({ _id: `bk-${n}`, number: n, title: `Cambridge IELTS ${n}`, slug: `cambridge-${n}` }))
const TESTS = []
for (const [num, ids] of Object.entries(TEST_IDS)) ids.forEach((id, i) => TESTS.push({ _id: id, bookId: `bk-${num}`, testNumber: i + 1, skill: "listening", status: "published" }))
const JSON_HEADERS = [
  { name: "access-control-allow-origin", value: "http://localhost:3000" },
  { name: "access-control-allow-credentials", value: "true" },
  { name: "content-type", value: "application/json" },
]

const proc = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=C:\\Users\\amrre\\AppData\\Local\\Temp\\opencode\\chrome-cdp-probe",
  "--no-first-run", "about:blank",
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
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let id = 0
const pending = new Map()
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
  else if (msg.method === "Fetch.requestPaused") {
    const { requestId, request } = msg.params
    const url = request.url
    const body = (data) => send("Fetch.fulfillRequest", { requestId, responseCode: 200, responseHeaders: JSON_HEADERS, body: Buffer.from(JSON.stringify(data)).toString("base64") })
    if (url.includes("/api/books")) body(BOOKS)
    else if (url.includes("/api/tests/list")) body(TESTS)
    else if (url.includes("/api/tests/user-results")) body([])
    else if (url.includes("/api/tests/full-results")) body([])
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
await send("Fetch.enable", { patterns: [{ urlPattern: "*://localhost:8080/api/*", requestStage: "Response" }] })
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 4, mobile: true })
await send("Page.navigate", { url: PAGE_URL })
await wait(6000)

const report = await evalJs(`(() => {
  const idle = [...document.querySelectorAll('a')].find(a => /\\/listening\\/\\d+$/.test(a.getAttribute('href') || ''))
  const done = [...document.querySelectorAll('a')].find(a => /\\/part\\/\\d+\\/result$/.test(a.getAttribute('href') || ''))
  const rect = idle?.getBoundingClientRect()
  const paper = document.querySelector('.paper')
  return JSON.stringify({
    idleCls: idle ? idle.className.slice(0, 200) : null,
    idleBg: idle ? getComputedStyle(idle).backgroundColor : null,
    doneBg: done ? getComputedStyle(done).backgroundColor : null,
    idleRect: rect ? { top: Math.round(rect.top + window.scrollY), h: Math.round(rect.height) } : null,
    paperTop: paper ? Math.round(paper.getBoundingClientRect().top + window.scrollY) : null,
  })
})()`)
console.log(report)
const parsed = JSON.parse(report)

/* Clip: around the first book's register, 4x */
const clipTop = parsed.idleRect.top - 24
const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: clipTop, width: 390, height: 360, scale: 4 } })
writeFileSync(`${OUT}\\zoom-cells.png`, Buffer.from(shot.result.data, "base64"))

ws.close()
proc.kill()
console.log("DONE")
process.exit(0)
