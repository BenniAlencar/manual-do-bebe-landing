import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext(null)
export const useLenis = () => useContext(LenisContext)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const instance = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1.1,
      smoothTouch: false,
    })

    instance.on('scroll', ScrollTrigger.update)

    const raf = (time) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    setLenis(instance)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(raf)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
