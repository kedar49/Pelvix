'use client'
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Avoid GSAP errors in production
    if (error.message?.includes('target null not found') || 
        error.message?.includes('GSAP')) {
      // Reset GSAP state if needed
      if (typeof window !== 'undefined' && window.gsap) {
        window.gsap.killTweensOf('*')
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '1rem',
          color: 'var(--text-light-blue)',
          background: 'var(--background-color-darker)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          margin: '1rem 0'
        }}>
          <h3>Oops! Something went wrong</h3>
          <p>Don't worry, this is just a minor hiccup. Try refreshing the page!</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: 'var(--text-light-blue)',
              color: 'var(--background-color)',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 