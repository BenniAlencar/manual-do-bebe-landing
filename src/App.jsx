import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmoothScroll, { useLenis, prefersReducedMotion } from './components/SmoothScroll'
import {
  AnimatedText,
  ScrubWords,
  Parallax,
  CountUp,
  Marquee,
  Aurora,
  SpotlightCard,
} from './components/primitives'

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = [
  { n: '01', page: 'pág. 04', tag: 'a linguagem que ninguém te ensinou', title: 'o choro traduzido', desc: 'os 6 choros e o que cada um significa. seu trabalho não é fazer o choro parar — é entender o que ele diz.' },
  { n: '02', page: 'pág. 08', tag: 'por que ele não dorme', title: 'sono sem mistério', desc: 'ciclos de 40 minutos, janelas de vigília e regressões. a engenharia do sono do bebê — e por que lutar contra ela não funciona.' },
  { n: '03', page: 'pág. 12', tag: '1 milhão de conexões por segundo', title: 'a cabeça do bebê', desc: 'psicologia do primeiro ano: vínculo, segurança e os comportamentos que parecem defeito — e são desenvolvimento.' },
  { n: '04', page: 'pág. 17', tag: 'o chão é o ginásio', title: 'corpo que aprende', desc: 'exercícios e estímulos mês a mês, do tummy time aos primeiros passos. sem acelerar: dando o chão certo.' },
  { n: '05', page: 'pág. 22', tag: 'o essencial, sem pânico', title: 'cuidados que salvam', desc: 'banho, cordão, febre e queda: o que é normal, o que precisa de atenção e o que é pronto-socorro.' },
  { n: '06', page: 'pág. 27', tag: 'a saúde de quem cuida', title: 'você também importa', desc: 'a saúde de quem cuida decide a do bebê. não existe prêmio pra quem aguenta sozinha.' },
]

function Preloader({ onDone }) {
  const rootRef = useRef(null)
  const lenis = useLenis()

  useEffect(() => {
    lenis?.stop()
    if (prefersReducedMotion()) { onDone(); return }
    const num = rootRef.current.querySelector('.preloader-num')
    const counter = { v: 0 }
    const tl = gsap.timeline({ onComplete: () => { lenis?.start(); onDone() } })
    tl.to(counter, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { num.textContent = String(Math.round(counter.v)).padStart(3, '0') } })
      .to(rootRef.current, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '+=0.15')
    return () => { tl.kill(); lenis?.start() }
  }, [])

  return <div className="preloader" ref={rootRef} aria-hidden="true"><span className="preloader-brand">o manual do bebê</span><span className="preloader-num">000</span></div>
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
  return <header className="nav"><a className="nav-logo" href="#top" onClick={goTo('#top')}>manual<span>do bebê</span></a><nav aria-label="navegação principal"><a href="#capitulos" onClick={goTo('#capitulos')}>o que tem dentro</a><a href="#oferta" onClick={goTo('#oferta')} className="btn btn-primary btn-sm">quero o meu</a></nav></header>
}

function Hero() {
  const lenis = useLenis()
  const scrollToChapters = (e) => { e.preventDefault(); const target = document.querySelector('#capitulos'); if (lenis) lenis.scrollTo(target, { duration: 1.6 }); else target?.scrollIntoView({ behavior: 'smooth' }) }
  return <section id="top" className="hero"><Aurora /><p className="hero-eyebrow reveal-fade" style={{ '--d': '2.7s' }}>psicologia · comportamento · cuidados · exercícios</p><AnimatedText as="h1" delay={2.8} stagger={0.06}>o manual do bebê <em>que ninguém te entregou</em></AnimatedText><AnimatedText as="p" className="hero-sub" delay={3.1}>do zero aos 12 meses. entenda o <strong>porquê</strong> de cada comportamento — não só o como resolver. porque quando você entende o porquê, você para de entrar em pânico e começa a conduzir.</AnimatedText><div className="hero-cta reveal-fade" style={{ '--d': '3.3s' }}><a className="btn btn-primary" href="#oferta">quero o meu manual</a><a className="btn btn-ghost" href="#capitulos" onClick={scrollToChapters}>ver o que tem dentro</a></div><span className="hero-scroll" aria-hidden="true">role</span></section>
}

function Manifesto() { return <section className="manifesto" aria-label="manifesto"><ScrubWords className="manifesto-text">você não precisa ser perfeita. precisa estar <em>presente</em>. esse guia não existe pra te julgar nem pra te vender uma maternidade de instagram. existe porque ninguém te entrega o manual de instruções — e o bebê não vem com um.</ScrubWords></section> }

function Chapters() { return <section id="capitulos" className="chapters"><div className="section-head"><AnimatedText as="h2">o que tem dentro</AnimatedText><AnimatedText as="p">seis capítulos. o porquê antes do como. zero pânico, zero julgamento.</AnimatedText></div>{CHAPTERS.map((c) => <SpotlightCard className="chapter" key={c.n}><Parallax speed={0.22}><span className="chapter-num" aria-hidden="true">{c.n}</span></Parallax><div><span className="tag">{c.tag}</span><AnimatedText as="h3">{c.title}</AnimatedText><AnimatedText as="p">{c.desc}</AnimatedText><span className="page">{c.page}</span></div></SpotlightCard>)}</section> }

function Stats() { return <section className="stats-section" aria-label="números do primeiro ano"><div className="stats"><div className="stat"><b><CountUp to={1000000} /></b><span>conexões neurais por segundo no cérebro do bebê no primeiro ano</span></div><div className="stat"><b><CountUp to={6} /></b><span>capítulos: choro, sono, psicologia, exercícios, cuidados e você</span></div><div className="stat"><b><CountUp to={12} /></b><span>meses de desenvolvimento mapeados, com o que esperar em cada um</span></div><div className="stat"><b><CountUp to={40} suffix=" min" /></b><span>o ciclo de sono do bebê — acordar entre ciclos é normal, não falha</span></div></div></section> }

function NightSection() { return <section className="night" aria-label="feito pra ler de madrugada"><Parallax speed={0.3} className="night-glow"><div className="night-glow" /></Parallax><ScrubWords className="night-text">leia com o bebê dormindo no colo. com uma mão só. <em>às 3h da manhã.</em> foi feito pra isso.</ScrubWords></section> }

function CTA() { return <section id="oferta" className="cta"><Aurora /><AnimatedText as="h2">o bebê não vem com manual. <em>agora você tem um.</em></AnimatedText><AnimatedText as="p">guia prático, direto, feito pro mundo real — não pro instagram. leia no celular, no escuro, com uma mão só.</AnimatedText><a className="btn btn-primary btn-lg reveal-fade" style={{ '--d': '0.4s' }} href="#oferta">quero o meu manual</a></section> }

export default function App() {
  const [loaded, setLoaded] = useState(false)
  return <SmoothScroll><a className="skip-link" href="#capitulos">pular para o conteúdo</a>{!loaded && <Preloader onDone={() => setLoaded(true)} />}<ProgressBar /><div className="noise" aria-hidden="true" /><Nav /><main><Hero /><Marquee items={['o choro traduzido', 'sono sem mistério', 'a cabeça do bebê', 'corpo que aprende', 'cuidados que salvam', 'você também importa']} /><Manifesto /><Chapters /><Stats /><NightSection /><CTA /></main><footer className="footer"><span>⚙ Benni OS</span><a href="https://instagram.com/Bennialencar" rel="noopener noreferrer" target="_blank">@Bennialencar</a><span>feito pro mundo real, não pro instagram</span></footer></SmoothScroll>
}
