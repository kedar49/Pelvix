'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const themes = {
  blue: {
    name: 'blue',
    displayName: 'Ocean Blue',
    colors: {
      '--text-light-blue': '#4893f5',
      '--text-dark-blue': '#0b489d',
      '--background-color': '#050d41',
      '--background-color-darker': '#00052a',
      '--accent-color': '#4893f5',
      '--secondary-text': '#093c84',
      '--border-color': '#0b489d',
      '--table-stripe': '#032052'
    }
  },
  blackWhite: {
    name: 'blackWhite',
    displayName: 'Monochrome',
    colors: {
      '--text-light-blue': '#ffffff',
      '--text-dark-blue': '#666666',
      '--background-color': '#000000',
      '--background-color-darker': '#1a1a1a',
      '--accent-color': '#ffffff',
      '--secondary-text': '#999999',
      '--border-color': '#333333',
      '--table-stripe': '#2a2a2a'
    }
  },
  dark: {
    name: 'dark',
    displayName: 'Dark Gray',
    colors: {
      '--text-light-blue': '#e0e0e0',
      '--text-dark-blue': '#888888',
      '--background-color': '#1a1a1a',
      '--background-color-darker': '#0d0d0d',
      '--accent-color': '#cccccc',
      '--secondary-text': '#666666',
      '--border-color': '#444444',
      '--table-stripe': '#2d2d2d'
    }
  }
}

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('blackWhite') // Default to black/white

  // Apply theme to CSS variables
  useEffect(() => {
    const theme = themes[currentTheme]
    const root = document.documentElement
    
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
    
    // Store theme preference
    localStorage.setItem('pelvix-theme', currentTheme)
  }, [currentTheme])

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('pelvix-theme')
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const themeKeys = Object.keys(themes)
    const currentIndex = themeKeys.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themeKeys.length
    setCurrentTheme(themeKeys[nextIndex])
  }

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName)
    }
  }

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      currentThemeDisplay: themes[currentTheme]?.displayName || currentTheme,
      themes,
      toggleTheme,
      setTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 