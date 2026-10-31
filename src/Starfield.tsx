import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  base: number
  phase: number
  speed: number
  depth: number // 0.2 (lejos) – 1 (cerca): más cerca = más brillo y más parallax
}

// Campo de estrellas de fondo: titilan suavemente y se desplazan un poco con el scroll
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []
    let w = 0
    let h = 0
    let frame = 0

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = innerWidth
      h = innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round((w * h) / 4200)
      stars = Array.from({ length: count }, () => {
        const depth = 0.2 + Math.random() ** 2 * 0.8
        return {
          x: Math.random() * w,
          y: Math.random() * h * 1.6,
          r: 0.35 + depth * 1.1,
          base: 0.25 + depth * 0.6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.4,
          depth,
        }
      })
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const scroll = scrollY
      for (const s of stars) {
        // Parallax: las estrellas cercanas suben más rápido al hacer scroll
        const y = (((s.y - scroll * 0.08 * s.depth) % (h * 1.6)) + h * 1.6) % (h * 1.6)
        if (y > h) continue
        const twinkle = still ? 1 : 0.65 + 0.35 * Math.sin(t / 1000 * s.speed + s.phase)
        ctx.globalAlpha = s.base * twinkle
        ctx.fillStyle = s.depth > 0.85 ? '#dbe7ff' : '#ffffff'
        ctx.beginPath()
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
        // Las más cercanas llevan un pequeño halo
        if (s.depth > 0.85) {
          ctx.globalAlpha = s.base * twinkle * 0.18
          ctx.beginPath()
          ctx.arc(s.x, y, s.r * 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (t: number) => {
      draw(t)
      frame = requestAnimationFrame(loop)
    }

    resize()
    if (still) draw(0)
    else frame = requestAnimationFrame(loop)

    const onResize = () => {
      resize()
      if (still) draw(0)
    }
    const onScroll = () => still && draw(0)
    // Sin animar mientras la pestaña está oculta
    const onVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden && !still) frame = requestAnimationFrame(loop)
    }
    addEventListener('resize', onResize)
    addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('resize', onResize)
      removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} className="stars" aria-hidden="true" />
}
