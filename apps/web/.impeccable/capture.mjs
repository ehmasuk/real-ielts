import { spawn } from "node:child_process"
import { writeFileSync, mkdirSync } from "node:fs"

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const PORT = 9223
const PAGE_URL = "http://localhost:3000"
const OUT = "F:\\sas\\real-ielts\\apps\\web\\.impeccable\\review"
mkdirSync(OUT, { recursive: true })

const proc = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=C:\\Users\\amrre\\AppData\\Local\\Temp\\opencode\\chrome-cdp",
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
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
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

async function capture({ width, height, mobile, scheme, name }) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile })
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] })
  await send("Page.navigate", { url: PAGE_URL })
  await wait(6000)
  const info = await evalJs(`(() => {
    const vw = document.documentElement.clientWidth
    const sw = document.documentElement.scrollWidth
    const bad = []
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.right > vw + 1 || r.left < -1) bad.push({ tag: el.tagName, cls: String(el.className).slice(0, 90), left: Math.round(r.left), right: Math.round(r.right) })
    })
    return JSON.stringify({ vw, sw, bad: bad.slice(0, 10) })
  })()`)
  console.log(name, info)
  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true })
  writeFileSync(`${OUT}\\${name}.png`, Buffer.from(shot.result.data, "base64"))
}

await capture({ width: 1440, height: 900, mobile: false, scheme: "light", name: "desktop" })
await capture({ width: 390, height: 844, mobile: true, scheme: "light", name: "mobile" })
await capture({ width: 1440, height: 900, mobile: false, scheme: "dark", name: "desktop-dark" })
await capture({ width: 390, height: 844, mobile: true, scheme: "dark", name: "mobile-dark" })

ws.close()
proc.kill()
console.log("DONE")
process.exit(0)
