'use client'
import { useState, useRef, useEffect } from 'react'
import styles from './page.module.css'

export default function ContactMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.contactContainer} ref={menuRef}>
      <button 
        className={styles.contactButton}
        onClick={toggleMenu}
        aria-label="Contact menu"
        title="Get in touch"
      >
        <div className={styles.contactIcon}>
          <span className={styles.iconTop}>◢</span>
          <span className={styles.iconMiddle}>◆</span>
          <span className={styles.iconBottom}>◣</span>
        </div>
      </button>
      
      {isOpen && (
        <div className={styles.contactMenu}>
          <div className={styles.menuHeader}>
            <span className={styles.menuTitle}>Connect</span>
          </div>
          <div className={styles.menuItems}>
            <a 
              href="https://github.com/kedar49" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.menuItem}
              onClick={() => setIsOpen(false)}
            >
              <span className={styles.itemIcon}>⚡</span>
              <span className={styles.itemText}>GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/kedar49/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.menuItem}
              onClick={() => setIsOpen(false)}
            >
              <span className={styles.itemIcon}>💼</span>
              <span className={styles.itemText}>LinkedIn</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
} 