'use client'
import { memo, useState, useRef, useEffect, forwardRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './page.module.css'
import Markdown from 'markdown-to-jsx'
import { PreBlock, CodeBlock } from '@/app/utils/syntaxHighlighter'

//*=====HELPER COMPS=====

const DownloadButton = memo(({ imageUrl }) => {
    return (
        <div className={styles.downloadBtn}>
            <a
                href={imageUrl}
                download='generated @ pelvix.vercel.app'
                onClick={(e) => e.stopPropagation}>
                <p>⤓</p>
            </a>
        </div>
    )
})
DownloadButton.displayName = 'DownloadButton'

const TextMessageDisplay = memo(({ text }) => (
    <Markdown
        style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
        }}
        options={{
            overrides: {
                pre: PreBlock,
                hr: { component: 'hr' }
            }
        }}
        >{text || ''}</Markdown>
))
TextMessageDisplay.displayName = 'TextMessageDisplay'

const TypingSpinner = memo(() => {
    const loadingChars = ['\\', '|', '/', '—']
    const [charIndex, setCharIndex] = useState(0)
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCharIndex(prevIndex => (prevIndex + 1) % loadingChars.length)
        }, 90)
        return () => clearInterval(intervalId)
    }, [])
    return <div className={styles.TypingSpinner}>{loadingChars[charIndex]}</div>
})
TypingSpinner.displayName = 'TypingSpinner'


//*=====IMAGE REVEAL & ITS COMPS=====

const COL_NUM = 17
const ROW_NUM = 21
    
// Get theme-aware pixel colors
const getPixelColors = () => {
    if (typeof window === 'undefined') return ['#4893f5', '#0b489d', '#050d41', '#00052a']
    
    const root = document.documentElement
    const computedStyle = getComputedStyle(root)
    
    return [
        computedStyle.getPropertyValue('--text-light-blue').trim() || '#4893f5',
        computedStyle.getPropertyValue('--text-dark-blue').trim() || '#0b489d',
        computedStyle.getPropertyValue('--background-color').trim() || '#050d41',
        computedStyle.getPropertyValue('--background-color-darker').trim() || '#00052a'
    ]
}

const PixelGrid = memo(forwardRef(function PixelGrid(props, ref) {
    return (
        <div className={styles.pixelGrid} ref={ref}>
            {Array.from({ length: ROW_NUM * COL_NUM }).map((_, i) => (
                <div key={i} className={styles.pixelDiv} />
            ))}
        </div>
    )
}))
PixelGrid.displayName = 'PixelGrid'

export function ImageReveal({ status, imageUrl, onAnimComplete }) {
    const imageRef = useRef(null)
    const wrapperRef = useRef(null)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [isDownload, setIsDownload] = useState(false)
    const loadingAnim = useRef(null)
    const revealTl = useRef(null)
    const coverRef = useRef(null)

    const handleImageLoad = () => setIsImageLoaded(true)

    useGSAP(() => {
        // Add null checks for all refs
        if (!wrapperRef.current) {
            console.warn('GSAP: wrapperRef not found, skipping animation')
            return
        }

        const cover = coverRef.current
        if (cover) {
            gsap.set(cover, { opacity: 1 })
        }

        const pixels = gsap.utils.toArray(`.${styles.pixelDiv}`, wrapperRef.current)
        
        // Check if pixels were found
        if (!pixels || pixels.length === 0) {
            console.warn('GSAP: No pixel elements found, skipping animation')
            return
        }

        const cleanupAnimation = () => {
            if (loadingAnim.current) {
                loadingAnim.current.kill()
                loadingAnim.current = null
            }
            if (revealTl.current) {
                revealTl.current.kill()
                revealTl.current = null
            }
        }

        if (status === 'idle') {
            gsap.set(wrapperRef.current, {
                opacity: 0,
                visibility: 'hidden'
            })
            cleanupAnimation()
            setIsImageLoaded(false)
            return
        } else {
            gsap.set(wrapperRef.current, { visibility: 'visible', opacity: 1 })
        }

        if (status === 'loading' || (status === 'revealing' && !isImageLoaded)) {

            if (revealTl.current) {
                revealTl.current.kill()
                revealTl.current = null
            }

            if (!loadingAnim.current || !loadingAnim.current.isActive()) {
                if (loadingAnim.current) loadingAnim.current.kill()
                
                // Get theme colors with fallback
                const PIXEL_COLORS = getPixelColors()
                
                gsap.set(pixels, {
                    scale: 0.5,
                    autoAlpha: 1,
                    backgroundColor: PIXEL_COLORS[3] // background-color-darker
                })
                loadingAnim.current = gsap.to(pixels, {
                    backgroundColor: () => PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)],
                    duration: 0.1,
                    ease: 'none',
                    stagger: {
                        ease: 'power2.inOut',
                        amount: 1,
                        from: 'random',
                        repeat: -1,
                        repeatRefresh: true
                    }
                })
            }
        }

        if (status === 'revealing' && isImageLoaded) {

            if (loadingAnim.current) {
                loadingAnim.current.kill()
                loadingAnim.current = null
            }
            
            revealTl.current = gsap.timeline({
                onComplete: () => {
                    cleanupAnimation()
                    if (onAnimComplete) onAnimComplete()
                }
            })

            // Get theme colors with fallback
            const PIXEL_COLORS = getPixelColors()
            const darkerBg = PIXEL_COLORS[3] // background-color-darker

            gsap.set(pixels, { autoAlpha: 1 })
            if (cover) {
                gsap.set(cover, { opacity: 1, backgroundColor: darkerBg })
            }

            revealTl.current.to(pixels, {
                backgroundColor: darkerBg,
                scale: 1,
                duration: 1.2,
                ease: 'steps(3)',
                stagger: {
                    amount: 1,
                    ease: 'power2.out',
                    from: 'random'
                }
            }).to(pixels, {
                backgroundColor: darkerBg,
                autoAlpha: 0,
                duration: 0.1,
                ease: 'none',
                stagger: {
                    amount: 1,
                    from: 'random',
                    ease: 'power2.in'
                }
            }, '-=0.5')
            
            if (cover) {
                revealTl.current.to(cover, {
                    duration: 0.1,
                    opacity: 0
                }, '<')
            }
        }
    }, { scope: wrapperRef, dependencies: [status, isImageLoaded, imageUrl] })

    return (
        <div ref={wrapperRef} className={styles.imageWrapper} style={{ visibility: 'visible' }}>
            {imageUrl && (
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="generated @ pelvix.ai"
                    onLoad={handleImageLoad}
                    className={styles.generatedImage}
                />
            )}
            <div ref={coverRef} className={styles.imageCover}></div>
            <PixelGrid />
        </div>
    )
}

export default function MessageAnim({ message }) {
    const [displayedContent, setDisplayedContent] = useState('')
    const [isAnimationComplete, setIsAnimationComplete] = useState(false)

    useGSAP(() => {
        const isTextualMessage = !['text-loading', 'image-loading', 'image'].includes(message.type)
        const contentToAnimate = (isTextualMessage && typeof message.content === 'string' ? message.content : '')

        if (!contentToAnimate) {
            setDisplayedContent(message.type === 'text' ? message.content : '')
            return
        }

        const words = contentToAnimate.split(/(\s+)/)
        const elementsCount = words.filter(word => word.trim() !== '').length
        setDisplayedContent('')

        const ctx = gsap.context(() => {
            if (contentToAnimate) {
                gsap.to({ value: 0 }, {
                    value: words.length,
                    duration: elementsCount * 0.03,
                    ease: 'none',
                    onUpdate: function () {
                        const target = this.targets()[0]
                        if (target) {
                            setDisplayedContent(words.slice(0, Math.floor(target.value)).join(''))
                        }
                    },
                    onComplete: () => {
                        setDisplayedContent(contentToAnimate)
                    }
                })
            }
        })
        return () => ctx.revert()
    }, { dependencies: [message.id, message.content, message.type] })

    switch (message.type) {
        case 'text-loading':
            return <TypingSpinner />
        case 'image-loading':
        case 'image': {
            const status = message.type === 'image-loading' ? 'loading' : 'revealing'
            const imageUrl = message.type === 'image' ? message.content : null

            useEffect(() => {
                setIsAnimationComplete(false)
            }, [message.id])

            return (
                <div className={styles.responseContainer}>
                    <div className={styles.imageResponse}>
                        <ImageReveal
                            key={message.id}
                            status={status}
                            imageUrl={imageUrl}
                            onAnimComplete={() => setIsAnimationComplete(true)}
                        />
                    </div>
                    {isAnimationComplete && <DownloadButton imageUrl={imageUrl} />}
                </div>
            )
        }

        default:
            return <TextMessageDisplay text={displayedContent} />
    }
}
