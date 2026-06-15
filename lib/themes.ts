export const THEME_STORAGE_KEY = "flycation-theme"
export const DARK_MODE_STORAGE_KEY = "flycation-dark-mode"

export const THEME_INIT_SCRIPT = `(function(){try{var d=localStorage.getItem("${DARK_MODE_STORAGE_KEY}")==="true";var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(d)document.documentElement.classList.add("dark");if(t&&t!=="default")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`

export const colorThemes = [
  { id: "default", label: "Default" },
  { id: "ocean", label: "Ocean" },
  { id: "forest", label: "Forest" },
  { id: "sunset", label: "Sunset" },
] as const

export type ColorTheme = (typeof colorThemes)[number]["id"]

export function isColorTheme(value: string): value is ColorTheme {
  return colorThemes.some((theme) => theme.id === value)
}

export function applyThemeToDocument(colorTheme: ColorTheme, darkMode: boolean) {
  const root = document.documentElement

  root.classList.toggle("dark", darkMode)

  if (colorTheme === "default") {
    root.removeAttribute("data-theme")
  } else {
    root.setAttribute("data-theme", colorTheme)
  }
}

export function readStoredTheme(): { colorTheme: ColorTheme; darkMode: boolean } {
  if (typeof window === "undefined") {
    return { colorTheme: "default", darkMode: false }
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) ?? "default"
  const colorTheme = isColorTheme(storedTheme) ? storedTheme : "default"
  const darkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY) === "true"

  return { colorTheme, darkMode }
}
