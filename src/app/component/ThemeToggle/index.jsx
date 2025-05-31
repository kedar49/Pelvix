'use client'
import { useTheme } from '@/app/context/ThemeContext'
import styles from './page.module.css'

export default function ThemeToggle() {
  const { currentTheme, currentThemeDisplay, toggleTheme } = useTheme()

  const getThemeIcon = (theme) => {
    switch(theme) {
      case 'blue': return '🌊'
      case 'blackWhite': return '🌙' 
      case 'dark': return '🖤'
      default: return '🎨'
    }
  }

  return (
    <div className={styles.themeToggleContainer}>
      <button 
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={`Current: ${currentThemeDisplay}. Click to change theme.`}
      >
        <span className={styles.toggleIcon}>{getThemeIcon(currentTheme)}</span>
      </button>
      <div className={styles.themeLabel}>
        {currentThemeDisplay}
      </div>
    </div>
  )
} 