# Manual do Bebê®· Landing (padrã´£o awwwards)

> **status:** `draft / proposed` · artefato local reversí´ıvel. NÃ£O testado em dispositivo, navegador real ou Lighthouse ainda. Todo efeito visual estÃ¡ `proposed` atÃ© mediÃ§Ã£o.

Landing page do produto **"O Manual do BebÃª · que ninguÃ©m te entregou"**, com o stack imersivo padrÃ£o awwwards 2026:

- **Lenis** · smooth scroll (~3 kB, MIT), sincronizado ao ticker do GSAP
- **GSAP 3.13 + ScrollTrigger + SplitText** · reveals por palavra/linha, parallax com scrub e contadores (todos os plugins sÃ£o free desde a aquisiÃ§Ã£o pela Webflow)
- **PadrÃ£o React Bits** · componentes AnimatedText (SplitText), Aurora, Marquee e SpotlightCard reimplementados em GSAP puro (sem dependÃªncia extra)

## Rodar

```bash
npm install
npm run dev
```

## Estrutura

```
index.html
src/
  main.jsx
  App.jsx              # seÃ§Ãµes: preloader, hero, manifesto, capÃ¬tulos, stats, 3am, CTA
  styles.css           # tokens, a11y, reduced-motion, mobile fallback
  components/
    SmoothScroll.jsx   # provider Lenis + sync ScrollTrigger
    primitives.jsx     # AnimatedText, ScrubWords, Parallax, CountUp, Marquee, Aurora, SpotlightCard
```

## DecisÃµes de motion

- Lenis roda no ticker do GSAP (`gsap.ticker.add(raf)`, `lagSmoothing(0)`) para um Ãnico loop de frame · evita drift entre smooth scroll e scrub.
- `prefers-reduced-motion`: Lenis desligado, SplitText/parallax/count-up desligados, marquee/aurora pausados via CSS, conteÃºdo 100% visÃ¬vel.
- `smoothTouch: false` · mobile mantÃ©m scroll nativo (Lenis sÃ³ suaviza wheel).
- Ãncoras do nav usam `lenis.scrollTo()` com fallback `scrollIntoView`.

## Checklist antes de publicar (evidÃªncia pendente)

- [ ] Testar em Chrome/Safari/Firefox + iOS/Android reais (frame rate, tearing)
- [ ] Lighthouse: contraste, ARIA, focus-visible, tap targets
- [ ] Medir bundle e LCP/CLS com animaÃ§Ãµes ligadas
- [ ] Substituir `href="#oferta"` do botÃ£o final pelo link de checkout real
- [ ] PreÃ§o/offer copy (nÃ£o inventado · definir com o negÃ³cio)
- [ ] i18n EN/ES (atualmente sÃ³ PT-BR)
- [ ] OG image + favicon

## Rollback

Projeto isolado: `rm -rf` da pasta restaura o estado anterior. Nenhum deploy, nenhuma escrita externa.
