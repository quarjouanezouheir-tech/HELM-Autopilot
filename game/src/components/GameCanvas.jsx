import { useEffect, useRef } from 'react'
import { GameEngine } from '../engine/GameEngine.js'
import { drawPlayer } from '../entities/Player.js'
import { drawEnemy } from '../entities/Enemy.js'
import { drawProjectile } from '../entities/Projectile.js'
import { drawXPGem } from '../entities/XPGem.js'
import { useGameStore } from '../store/gameStore.js'
import { useKeyboardInput } from '../hooks/useKeyboardInput.js'
import Joystick from './Joystick.jsx'

const GRID_SIZE = 100
const MAX_DT = 0.05 // évite les "sauts" si l'onglet perd le focus

export default function GameCanvas() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(null)
  const sizeRef = useRef({ width: window.innerWidth, height: window.innerHeight })

  const keyboardVectorRef = useKeyboardInput()
  const joystickVectorRef = useRef({ x: 0, y: 0 })

  const status = useGameStore((s) => s.status)
  const statusRef = useRef(status)
  statusRef.current = status

  const setHud = useGameStore((s) => s.setHud)
  const endGame = useGameStore((s) => s.endGame)

  if (!engineRef.current) {
    engineRef.current = new GameEngine(
      (snapshot) => setHud(snapshot),
      () => endGame(),
    )
  }

  // Réinitialise la simulation à chaque (re)lancement de partie.
  useEffect(() => {
    if (status === 'playing') {
      engineRef.current.reset()
    }
  }, [status])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = window.innerWidth
      const height = window.innerHeight
      sizeRef.current = { width, height }
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      engineRef.current.setViewport(width, height)
    }

    resize()
    window.addEventListener('resize', resize)

    function frame(now) {
      if (lastTimeRef.current === null) lastTimeRef.current = now
      const dt = Math.min(MAX_DT, (now - lastTimeRef.current) / 1000)
      lastTimeRef.current = now

      if (statusRef.current === 'playing') {
        const input = {
          x: keyboardVectorRef.current.x + joystickVectorRef.current.x,
          y: keyboardVectorRef.current.y + joystickVectorRef.current.y,
        }
        engineRef.current.update(dt, input)
      }

      render(ctx, engineRef.current, sizeRef.current)
      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="game-canvas" />
      <Joystick vectorRef={joystickVectorRef} />
    </>
  )
}

function render(ctx, engine, size) {
  const { width, height } = size
  const { player, enemies, projectiles, gems } = engine.getRenderState()
  const camX = player.x - width / 2
  const camY = player.y - height / 2

  ctx.fillStyle = '#151021'
  ctx.fillRect(0, 0, width, height)

  drawGrid(ctx, camX, camY, width, height)

  for (const gem of gems) {
    drawXPGem(ctx, gem, gem.x - camX, gem.y - camY)
  }
  for (const enemy of enemies) {
    drawEnemy(ctx, enemy, enemy.x - camX, enemy.y - camY)
  }
  for (const projectile of projectiles) {
    drawProjectile(ctx, projectile, projectile.x - camX, projectile.y - camY)
  }
  drawPlayer(ctx, player, player.x - camX, player.y - camY)
}

function drawGrid(ctx, camX, camY, width, height) {
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1

  const offsetX = -((camX % GRID_SIZE) + GRID_SIZE) % GRID_SIZE
  const offsetY = -((camY % GRID_SIZE) + GRID_SIZE) % GRID_SIZE

  ctx.beginPath()
  for (let x = offsetX; x < width; x += GRID_SIZE) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let y = offsetY; y < height; y += GRID_SIZE) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.stroke()
}
