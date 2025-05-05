"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "system",
  setTheme: () => {},
})

export const ThemeProvider = ({
  children,
  attribute = "class",
  defaultTheme = "system",
  valueDark = "dark",
  valueLight = "light",
}: {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  valueDark?: string
  valueLight?: string
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialTheme = savedTheme || defaultTheme

    setTheme(initialTheme)

    if (initialTheme === "system") {
      document.documentElement.setAttribute(attribute, systemTheme === "dark" ? valueDark : valueLight)
    } else if (initialTheme === "dark") {
      document.documentElement.setAttribute(attribute, valueDark)
    } else {
      document.documentElement.setAttribute(attribute, valueLight)
    }
  }, [attribute, defaultTheme, valueDark, valueLight])

  useEffect(() => {
    localStorage.setItem("theme", theme)
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      document.documentElement.setAttribute(attribute, systemTheme === "dark" ? valueDark : valueLight)
    } else if (theme === "dark") {
      document.documentElement.setAttribute(attribute, valueDark)
    } else {
      document.documentElement.setAttribute(attribute, valueLight)
    }
  }, [theme, attribute, valueDark, valueLight])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
