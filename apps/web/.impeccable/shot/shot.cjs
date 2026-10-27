const puppeteer = require("puppeteer-core")

const OUT = __dirname + "\\..\\review\\"
const URL = "http://localhost:3000/"

const HIDE_OVERLAYS = `
  nextjs-portal { display: none !important; }
  [data-nextjs-dev-tools-button],
  [data-nextjs-dev-tools-panel],
  [data-nextjs-toolbar],
  #__next-dev-tools-overlay,
  [data-testid="tanstack-query-devtools"],
  .tsqd-parent-container { display: none !important; }
`

async function settle(page, ms) {
  await new Promise((r) => setTimeout(r, ms))
}

// Scroll through the whole page so whileInView (once) animations fire
// and settle at their final state, then return to the top.
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = 700
    const max = document.body.scrollHeight
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 420))
    }
    window.scrollTo(0, max)
    await new Promise((r) => setTimeout(r, 700))
    window.scrollTo(0, 0)
  })
  await settle(page, 900)
}

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
  })

  const page = await browser.newPage()

  const consoleIssues = []
  page.on("console", (msg) => {
    const text = msg.text()
    if (msg.type() === "error" || /hydrat|mismatch|script/i.test(text)) {
      consoleIssues.push(`[console.${msg.type()}] ${text.slice(0, 500)}`)
    }
  })
  page.on("pageerror", (err) => {
    consoleIssues.push(`[pageerror] ${String(err).slice(0, 500)}`)
  })

  // Desktop light, full page
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 })
  await page.addStyleTag({ content: HIDE_OVERLAYS })
  await settle(page, 3200)
  await scrollThrough(page)
  await page.screenshot({ path: OUT + "desktop.png", fullPage: true })
  await page.screenshot({ path: OUT + "hero-viewport.png" })

  // Mobile light, full page
  await page.setViewport({ width: 390, height: 844 })
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 })
  await page.addStyleTag({ content: HIDE_OVERLAYS })
  await settle(page, 3200)
  await scrollThrough(page)
  await page.screenshot({ path: OUT + "mobile.png", fullPage: true })

  // Desktop dark, full page
  await page.setViewport({ width: 1440, height: 900 })
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }])
  await page.evaluateOnNewDocument(() => localStorage.setItem("theme", "dark"))
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 })
  await page.addStyleTag({ content: HIDE_OVERLAYS })
  await settle(page, 3200)
  await scrollThrough(page)
  await page.screenshot({ path: OUT + "desktop-dark.png", fullPage: true })

  await browser.close()

  if (consoleIssues.length) {
    console.log("CONSOLE ISSUES:")
    for (const issue of consoleIssues) console.log("  " + issue)
  } else {
    console.log("no console errors/warnings captured")
  }
  console.log("captures done")
})().catch((e) => {
  console.error("CAPTURE FAILED:", e.message)
  process.exit(1)
})
