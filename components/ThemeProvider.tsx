"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  applyThemeToDocument,
  type ColorTheme,
  DARK_MODE_STORAGE_KEY,
  isColorTheme,
  readStoredTheme,
  THEME_STORAGE_KEY,
} from "@/lib/themes"

type ThemeContextValue = {
  colorTheme: ColorTheme
  darkMode: boolean
  setColorTheme: (theme: ColorTheme) => void
  setDarkMode: (enabled: boolean) => void
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("default")
  const [darkMode, setDarkModeState] = useState(false)

  useEffect(() => {
    const stored = readStoredTheme()
    setColorThemeState(stored.colorTheme)
    setDarkModeState(stored.darkMode)
    applyThemeToDocument(stored.colorTheme, stored.darkMode)
  }, [])

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    applyThemeToDocument(
      theme,
      document.documentElement.classList.contains("dark")
    )
  }, [])

  const setDarkMode = useCallback((enabled: boolean) => {
    setDarkModeState(enabled)
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(enabled))
    const themeAttr = document.documentElement.getAttribute("data-theme")
    const theme = themeAttr && isColorTheme(themeAttr) ? themeAttr : "default"
    applyThemeToDocument(theme, enabled)
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode)
  }, [darkMode, setDarkMode])

  const value = useMemo(
    () => ({
      colorTheme,
      darkMode,
      setColorTheme,
      setDarkMode,
      toggleDarkMode,
    }),
    [colorTheme, darkMode, setColorTheme, setDarkMode, toggleDarkMode]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export { ThemeProvider, useTheme }
