'use client'
import gsap from 'gsap'

// Global GSAP configuration
if (typeof window !== 'undefined') {
  // Set GSAP to be more forgiving with null targets
  gsap.config({
    nullTargetWarn: false, // Disable warnings for null targets
    trialWarn: false,      // Disable trial warnings
  })

  // Global error handler for GSAP
  const originalSet = gsap.set
  const originalTo = gsap.to
  const originalFrom = gsap.from
  const originalFromTo = gsap.fromTo

  // Wrap gsap.set with error handling
  gsap.set = function(targets, vars) {
    try {
      if (!targets || (Array.isArray(targets) && targets.length === 0)) {
        console.warn('GSAP: Skipping animation - no valid targets found')
        return
      }
      return originalSet.call(this, targets, vars)
    } catch (error) {
      console.warn('GSAP.set error caught:', error.message)
      return null
    }
  }

  // Wrap gsap.to with error handling
  gsap.to = function(targets, vars) {
    try {
      if (!targets || (Array.isArray(targets) && targets.length === 0)) {
        console.warn('GSAP: Skipping animation - no valid targets found')
        return gsap.timeline()
      }
      return originalTo.call(this, targets, vars)
    } catch (error) {
      console.warn('GSAP.to error caught:', error.message)
      return gsap.timeline()
    }
  }

  // Wrap gsap.from with error handling
  gsap.from = function(targets, vars) {
    try {
      if (!targets || (Array.isArray(targets) && targets.length === 0)) {
        console.warn('GSAP: Skipping animation - no valid targets found')
        return gsap.timeline()
      }
      return originalFrom.call(this, targets, vars)
    } catch (error) {
      console.warn('GSAP.from error caught:', error.message)
      return gsap.timeline()
    }
  }

  // Wrap gsap.fromTo with error handling
  gsap.fromTo = function(targets, fromVars, toVars) {
    try {
      if (!targets || (Array.isArray(targets) && targets.length === 0)) {
        console.warn('GSAP: Skipping animation - no valid targets found')
        return gsap.timeline()
      }
      return originalFromTo.call(this, targets, fromVars, toVars)
    } catch (error) {
      console.warn('GSAP.fromTo error caught:', error.message)
      return gsap.timeline()
    }
  }
}

export default gsap 