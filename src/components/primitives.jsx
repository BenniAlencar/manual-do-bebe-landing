import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { prefersReducedMotion } from './SmoothScroll'

gsap.registerPlugin(ScrollTrigger, SplitText)

export function AnimatedText({ as: Tag = 'h2', className = '', children, delay = 0, stagger = 0.05 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (prefersReducedMotion()) return

    const split = new SplitText(el, { type: 'lines,words', linesClass: 'split-line' })

    const ctx = gsap.context(() => {
      gsap.from(split.words, {
        yPercent: 115,
        duration: 1.1,
        ease: 'power4.out',
        stagger,
        delay,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    }, el)

    return () => {
      ctx.revert()
      split.revert()
    }
  }, [delay, stagger])

  return (
    <Tag ref={ref} className={`anim-text ${className}`}>
      {children}
    </Tag>
  )
}

export function ScrubWords({ as: Tag = 'p', className = '', children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (prefersReducedMotion()) return

    const split = new SplitText(el, { type: 'words' })

    const ctx = gsap.context(() => {
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            end: 'bottom 40%',
            scrub: 0.6,
          },
        },
      )
    }, el)

    return () => {
      ctx.revert()
      split.revert()
    }
  }, [])

  return (
    <Tag ref={ref} className={`scrub-words ${className}`}>
      {children}
    </Tag>
  )
}

export function Parallax({ children, speed = 0.18, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [speed])

  return (
    <div ref={ref} className={`parallax ${className}`}>
      {children}
    </div>
  )
}

export function CountUp({ to, suffix = '', className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const fmt = (n) => n.toLocaleString('pt-BR')

    if (prefersReducedMotion()) {
      el.textContent = fmt(to) + suffix
      return
    }

    const counter = { v: 0 }
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        v: to,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => {
          el.textContent = fmt(Math.round(counter.v)) + suffix
        },
      })
    })

    return () => ctx.revert()
  }, [to, suffix])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}

export function Marquee({ items, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
            <i>Â·</i>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Aurora({ className = '' }) {
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      <span className="a1" />
      <span className="a2" />
      <span className="a3" />
    </div>
  )
}

export function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div ref={ref} className={`spotlight ${className}`}>
      {children}
    </div>
  )
}
