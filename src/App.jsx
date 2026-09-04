import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmoothScroll, { useLenis, prefersReducedMotion } from './components/SmoothScroll'
import { AnimatedText, ScrubWords, CountUp, Marquee, Aurora, SpotlightCard } from './components/primitives'

gsap.registerPlugin(ScrollTrigger)

const CHECKOUT_URL = 'https://pay.cakto.com.br/3bz3bqh_1084552'
const TOTAL_FRAMES = 10

const STORY = [
  { eyebrow: '01 / A madrugada', title: 'São 3:17 da manhã.', body: 'E ele chora como se estivesse tentando te contar alguma coisa.' },
  { eyebrow: '02 / A pergunta', title: 'Você já tentou de tudo.', body: 'Fralda. Leite. Colo. Mais uma vez.' },
  { eyebrow: '03 / O medo', title: 'E ainda assim parece que nada resolve.', body: 'Isso não faz de você uma mãe ruim. Faz de você humana.' },
  { eyebrow: '04 / A pausa', title: 'Respira.', body: 'Você não precisa resolver tudo agora.' },
  { eyebrow: '05 / A linguagem', title: 'O choro não é um problema.', body: 'É a única fala que ele tem.' },
  { eyebrow: '06 / O vínculo', title: 'Ele não está te testando.', body: 'Ele está procurando o lugar seguro dele: você.' },
  { eyebrow: '07 / O porquê', title: 'Quando você entende o porquê,', body: 'o medo começa a perder força.' },
  { eyebrow: '08 / O chão', title: 'Você não precisa saber tudo.', body: 'Só precisa saber o que fazer agora.' },
  { eyebrow: '09 / A presença', title: 'Menos culpa. Mais presença.', body: 'Para atravessar as noites difíceis com um pouco mais de chão.' },
  { eyebrow: '10 / O manual', title: 'O manual que você precisava receber.', body: 'Antes da primeira noite em que se sentiu sem respostas.' },
]

const CHAPTERS = [
  { n: '01', page: 'pág. 04', tag: 'a linguagem que ninguém te ensinou', title: 'o choro traduzido', desc: 'os 6 choros e o que cada um significa. seu trabalho não é fazer o choro parar — é entender o que ele diz.' },
  { n: '02', page: 'pág. 08', tag: 'por que ele não dorme', title: 'sono sem mistério', desc: 'ciclos de 40 minutos, janelas de vigília e regressões. a engenharia do sono do bebê — e por que lutar contra ela não funciona.' },
  { n: '03', page: 'pág. 12', tag: '1 milhão de conexões por segundo', title: 'a cabeça do bebê', desc: 'psicologia do primeiro ano: vínculo, segurança e os comportamentos que parecem defeito — e são desenvolvimento.' },
  { n: '04', page: 'pág. 17', tag: 'o chão é o ginásio', title: 'corpo que aprende', desc: 'exercícios e estímulos mês a mês, do tummy time aos primeiros passos. sem acelerar: dando o chão certo.' },
  { n: '05', page: 'pág. 22', tag: 'o essencial, sem pânico', title: 'cuidados que salvam', desc: 'banho, cordão, febre e queda: o que é normal, o que precisa de atenção e o que é pronto-socorro.' },
  { n: '06', page: 'pág. 27', tag: 'a saúde de quem cuida', title: 'você também importa', desc: 'a saúde de quem cuida decide a do bebê. não existe prêmio pra quem aguenta sozinha.' },
]

function useFrameSources() {
  const getSource = (i, mobile) => `${import.meta.env.BASE_URL}${mobile ? 'hero-frames-mobile' : 'hero-frames'}/hero-${String(i + 1).padStart(2, '0')}.webp`
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return Array.from({ length: TOTAL_FRAMES }, (_, i) => getSource(i, mobile))
}

function ScrollHero() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const sources = useFrameSources()

  useEffect(() => {
    if (prefersReducedMotion()) return
    let mounted = true
    const initial = sources.slice(0, 3)
    let completed = 0

    const load = (src, priority = false) => {
      const img = new Image()
      if (priority) img.fetchPriority = 'high'
      img.decoding = 'async'
      img.onload = () => {
        if (!mounted) return
        completed += 1
        if (completed >= initial.length) setReady(true)
      }
      img.onerror = () => {
        if (!mounted) return
        if (priority) setFailed(true)
      }
      img.src = src
    }

    initial.forEach((src, i) => load(src, i === 0))
    const idle = window.requestIdleCallback ? window.requestIdleCallback(() => sources.slice(3).forEach((src) => load(src))) : window.setTimeout(() => sources.slice(3).forEach((src) => load(src)), 700)

    return () => {
      mounted = false
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
    }
  }, [sources])

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    const canvas = canvasRef.current
    const section = sectionRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const imgs = sources.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })
    let frame = 0
    let raf = 0

    const draw = () => {
      const img = imgs[frame]
      if (!img?.complete || !img.naturalWidth) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const width = Math.round(rect.width * dpr)
      const height = Math.round(rect.height * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      const cw = width
      const ch = height
      const ratio = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const iw = img.naturalWidth * ratio
      const ih = img.naturalHeight * ratio
      const driftX = (frame / (TOTAL_FRAMES - 1) - 0.5) * cw * 0.035
      const driftY = (frame / (TOTAL_FRAMES - 1) - 0.5) * ch * 0.025
      ctx.fillStyle = '#090807'
      ctx.fillRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - iw) / 2 + driftX, (ch - ih) / 2 + driftY, iw, ih)
    }

    const queueDraw = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    }

    queueDraw()
    const resize = () => queueDraw()
    window.addEventListener('resize', resize)

    const ctxGsap = gsap.context(() => {
      gsap.to({}, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=520%',
          scrub: 0.55,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.min(TOTAL_FRAMES - 1, Math.round(self.progress * (TOTAL_FRAMES - 1)))
            if (next !== frame) {
              frame = next
              setActive(next)
              queueDraw()
            }
          },
        },
      })
    }, section)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      ctxGsap.revert()
    }
  }, [ready, sources])

  const scene = STORY[active]
  const showStatic = prefersReducedMotion() || failed

  return (
    <section className={`scroll-hero ${ready ? 'is-ready' : ''}`} ref={sectionRef} id="top">
      <canvas className="scroll-hero__canvas" ref={canvasRef} aria-hidden="true" />
      <img className="scroll-hero__fallback" src={sources[9]} alt="Bebê descansando com segurança no colo de quem cuida" />
      <div className="scroll-hero__shade" aria-hidden="true" />
      <div className="scroll-hero__grain" aria-hidden="true" />
      <div className="scroll-hero__content">
        <p className="scroll-hero__eyebrow">{scene.eyebrow}</p>
        <div className="scroll-hero__copy" key={active}>
          <h1>{scene.title}</h1>
          <p>{scene.body}</p>
        </div>
        <div className={`scroll-hero__offer ${active >= 8 || showStatic ? 'is-visible' : ''}`}>
          <p><strong>O Manual do Bebê</strong> · do zero aos 12 meses</p>
          <a className="btn btn-primary" href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
            quero respirar mais tranquila <span>R$ 67</span>
          </a>
          <small>acesso imediato · leia no celular · sem culpa</small>
        </div>
      </div>
      <div className="scroll-hero__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${(active + 1) / TOTAL_FRAMES})` }} />
        <b>{String(active + 1).padStart(2, '0')} / {String(TOTAL_FRAMES).padStart(2, '0')}</b>
      </div>
      {!ready && <div className="scroll-hero__loading" aria-live="polite">preparando uma história para você…</div>}
    </section>
  )
}

function ProgressBar() {
  const ref = useRef(null)
  useEffect(() => {
    const bar = ref.current
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress})` } })
    return () => st.kill()
  }, [])
  return <div className="progress" aria-hidden="true"><span ref={ref} /></div>
}

function Nav() {
  const lenis = useLenis()
  const goTo = (hash) => (e) => {
    e.preventDefault()
    const target = document.querySelector(hash)
    if (!target) return
    if (lenis) lenis.scrollTo(target, { duration: 1.4 })
    else target.scrollIntoView({ behavior: 'smooth' })
  }
  return <header className="nav"><a className="nav-logo" href="#top" onClick={goTo('#top')}>manual<span>do bebê</span></a><nav aria-label="navegação principal"><a href="#capitulos" onClick={goTo('#capitulos')}>o que tem dentro</a><a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">quero o meu · R$ 67</a></nav></header>
}

function Manifesto() {
  return <section className="manifesto" aria-label="manifesto"><ScrubWords className="manifesto-text">Quando um bebê nasce, nasce também alguém tentando ser mãe. Muitas vezes cansada. Insegura. Ouvindo opinião demais. Você não está errando porque está perdida. Está aprendendo uma linguagem que <em>ninguém te ensinou.</em></ScrubWords></section>
}

function Chapters() {
  return <section id="capitulos" className="chapters"><div className="section-head"><AnimatedText as="h2">um guia para as horas em que você mais precisa</AnimatedText><AnimatedText as="p">Seis capítulos para traduzir o que acontece com ele — e devolver um pouco de chão para você.</AnimatedText></div>{CHAPTERS.map((c) => <SpotlightCard className="chapter" key={c.n}><span className="chapter-num" aria-hidden="true">{c.n}</span><div><span className="tag">{c.tag}</span><AnimatedText as="h3">{c.title}</AnimatedText><AnimatedText as="p">{c.desc}</AnimatedText><span className="page">{c.page}</span></div></SpotlightCard>)}</section>
}

function Stats() {
  return <section className="stats-section" aria-label="o que existe dentro do manual"><div className="stats"><div className="stat"><b><CountUp to={6} /></b><span>capítulos para quando tudo parece informação demais</span></div><div className="stat"><b><CountUp to={12} /></b><span>meses de desenvolvimento mapeados, com o que esperar em cada fase</span></div><div className="stat"><b>1 mão</b><span>é tudo o que você precisa para ler no celular, entre uma mamada e outra</span></div><div className="stat"><b>R$ 67</b><span>acesso imediato para você parar de procurar respostas sozinha</span></div></div></section>
}

function CTA() {
  return <section id="oferta" className="cta"><Aurora /><AnimatedText as="h2">Hoje você talvez ainda não tenha todas as respostas. <em>Mas não precisa passar por isso sozinha.</em></AnimatedText><AnimatedText as="p">O Manual do Bebê reúne o que você precisa saber para entender os sinais dele e confiar mais em você.</AnimatedText><a className="btn btn-primary btn-lg" href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">quero o manual que eu precisava ter recebido <span>R$ 67</span></a><small className="cta__note">acesso imediato · leitura no celular · do zero aos 12 meses</small></section>
}

export default function App() {
  return <SmoothScroll><a className="skip-link" href="#capitulos">pular para o conteúdo</a><ProgressBar /><div className="noise" aria-hidden="true" /><Nav /><main><ScrollHero /><Marquee items={['o choro traduzido', 'sono sem mistério', 'a cabeça do bebê', 'corpo que aprende', 'cuidados que salvam', 'você também importa']} /><Manifesto /><Chapters /><Stats /><CTA /></main><footer className="footer"><span>⚙ Benni OS</span><a href="https://instagram.com/Bennialencar" rel="noopener noreferrer" target="_blank">@Bennialencar</a><span>feito para o mundo real, não para uma maternidade perfeita</span></footer></SmoothScroll>
}
