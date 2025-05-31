'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import Markdown from 'markdown-to-jsx'
import styles from './page.module.css'
import { useGSAP } from '@gsap/react'

export default function RunningText({ speed, children }) {
    const containerRef = useRef(null)
    const wrapperRef = useRef(null)
    const instanceRef = useRef([])
    const tl = useRef(null)

    const N = 2

    useGSAP(() => {
        // Add null checks for all refs
        if (!containerRef.current || !wrapperRef.current) {
            console.warn('GSAP: RunningText refs not found, skipping animation')
            return
        }

        // Check if instances exist
        if (!instanceRef.current || instanceRef.current.length === 0) {
            console.warn('GSAP: RunningText instances not found, skipping animation')
            return
        }

        // Ensure the first instance exists before getting its width
        if (!instanceRef.current[0]) {
            console.warn('GSAP: First instance not found, skipping animation')
            return
        }

        try {
            const containerWidth = containerRef.current.offsetWidth;
            const instanceWidth = instanceRef.current[0].offsetWidth;

            // Position instances with null checks
            for (let i = 1; i < N; i++) {
                if (instanceRef.current[i]) {
                    gsap.set(instanceRef.current[i], {
                        position: 'absolute',
                        left: `${i / (N - 1) * 100}%`,
                    });
                }
            }

            gsap.set(containerRef.current, {
                left: '100%',
                opacity: 1,
            });

            // Main timeline
            const mainTl = gsap.timeline();
            
            mainTl.to(containerRef.current, {
                xPercent: -100,
                duration: 5,
                ease: 'none',
            });

            // Wrapper timeline
            const wrapperTl = gsap.timeline({
                repeat: -1
            });

            wrapperTl.to(wrapperRef.current, {
                xPercent: -100,
                duration: 5,
                ease: 'none',
            });

            mainTl.add(wrapperTl);

            // Store timeline reference for cleanup
            tl.current = mainTl;

        } catch (error) {
            console.warn('GSAP: Error in RunningText animation:', error)
        }

        // Cleanup function
        return () => {
            if (tl.current) {
                tl.current.kill()
                tl.current = null
            }
        }

    }, { dependencies: [children, speed] })

    return (
        <div ref={containerRef} className={styles.marqueeContainer}>
            <div ref={wrapperRef} className={styles.marqueeWrapper}>
                {Array.from({ length: N }).map((_, i) => (
                    <p
                        key={i}
                        ref={el => {
                            if (el) {
                                instanceRef.current[i] = el
                            }
                        }}
                        className={styles.textInstance}>
                        <Markdown>{children}</Markdown>
                    </p>
                ))}
            </div>
        </div>
    )
}