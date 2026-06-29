let accessToken: string | null = null
let listeners: Array<(token: string | null) => void> = []

export function setAccessToken(token: string | null) {
  accessToken = token
  listeners.forEach((fn) => fn(token))
}

export function getAccessToken() {
  return accessToken
}

export function onTokenChange(fn: (token: string | null) => void) {
  listeners.push(fn)
  return () => {
    listeners = listeners.filter((l) => l !== fn)
  }
}
