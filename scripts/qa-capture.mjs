import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const chrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const port = 9337
const root = join(tmpdir(), 'codex-showroom-qa')
const profile = join(root, `profile-${Date.now()}`)
await mkdir(root, { recursive: true })

const browser = spawn(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--disable-features=Translate',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--window-size=1536,2304',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForTarget() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json())
      const page = pages.find((item) => item.type === 'page')
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl
    } catch {
      // Chrome is still starting.
    }
    await delay(100)
  }
  throw new Error('Chrome DevTools target did not become available')
}

const socket = new WebSocket(await waitForTarget())
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let id = 0
const pending = new Map()
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (!message.id || !pending.has(message.id)) return
  const { resolve, reject } = pending.get(message.id)
  pending.delete(message.id)
  if (message.error) reject(new Error(message.error.message))
  else resolve(message.result)
})

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = ++id
    pending.set(requestId, { resolve, reject })
    socket.send(JSON.stringify({ id: requestId, method, params }))
  })
}

async function capture(name, selector = null) {
  if (selector) {
    await send('Runtime.evaluate', {
      expression: `document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:'start'})`,
      awaitPromise: true,
    })
    await delay(900)
  }
  const { data } = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  })
  await writeFile(join(root, name), Buffer.from(data, 'base64'))
}

try {
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1536,
    height: 2304,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' })
  await delay(1800)
  await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true })
  await capture('showroom-top.png')
  await capture('showroom-work.png', '#trabalhos')
  await capture('showroom-faq.png', '#faq')
  console.log(root)
} finally {
  socket.close()
  browser.kill()
}
