"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null
      if (savedTheme) {
        setTheme(savedTheme)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      const root = window.document.documentElement

      // Remove existing theme classes
      root.classList.remove("light", "dark")

      // Remove data-theme attribute
      root.removeAttribute("data-theme")

      let effectiveTheme: "light" | "dark"

      if (theme === "system") {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      } else {
        effectiveTheme = theme
      }

      // Add theme class and data attribute
      root.classList.add(effectiveTheme)
      root.setAttribute("data-theme", effectiveTheme)

      // Store theme preference
      localStorage.setItem("theme", theme)

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", effectiveTheme === "dark" ? "#121212" : "#ffffff")
      } else {
        const meta = document.createElement("meta")
        meta.name = "theme-color"
        meta.content = effectiveTheme === "dark" ? "#121212" : "#ffffff"
        document.head.appendChild(meta)
      }
    } catch (error) {
      console.error("Error setting theme:", error)
    }
  }, [theme, mounted])

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(mediaQuery.matches ? "dark" : "light")
      root.setAttribute("data-theme", mediaQuery.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (mounted) {
        setTheme(theme)
      }
    },
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  return context || initialState
}
