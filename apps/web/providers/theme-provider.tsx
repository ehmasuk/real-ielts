"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  themes: Theme[]
  systemTheme: ResolvedTheme | undefined
  forcedTheme: Theme | undefined
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
  themes: [],
  systemTheme: undefined,
  forcedTheme: undefined,
})

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function getStoredTheme(key: string, fallback: Theme): Theme {
  if (typeof window === "undefined") return fallback
  try {
    const stored = localStorage.getItem(key)
    if (stored === "light" || stored === "dark" || stored === "system") return stored
  } catch {}
  return fallback
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  root.style.colorScheme = theme
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const STORAGE_KEY = "theme"

  const [theme, setThemeState] = React.useState<Theme>(() => getStoredTheme(STORAGE_KEY, "system"))
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(() => getSystemTheme())

  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme

  React.useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? "dark" : "light")
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t)
  }, [])

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      themes: ["light", "dark", "system"] as Theme[],
      systemTheme: theme === "system" ? systemTheme : undefined,
      forcedTheme: undefined as Theme | undefined,
    }),
    [theme, resolvedTheme, setTheme, systemTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function useTheme() {
  return React.useContext(ThemeContext)
}

export { ThemeProvider, useTheme }
