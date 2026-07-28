import { XP_GEM } from '../engine/constants.js'

let nextGemId = 1

export function createXPGem(x, y, value = XP_GEM.VALUE) {
  return {
    id: nextGemId++,
    x,
    y,
    radius: XP_GEM.RADIUS,
    value,
  }
}

// Retourne true si la gemme doit être collectée ce tick.
export function updateXPGem(gem, player, dt) {
  const dx = player.x - gem.x
  const dy = player.y - gem.y
  const dist = Math.hypot(dx, dy)

  if (dist <= XP_GEM.PICKUP_RADIUS) {
    return true
  }

  if (dist <= XP_GEM.MAGNET_RADIUS) {
    gem.x += (dx / dist) * XP_GEM.MAGNET_SPEED * dt
    gem.y += (dy / dist) * XP_GEM.MAGNET_SPEED * dt
  }

  return false
}

export function drawXPGem(ctx, gem, screenX, screenY) {
  ctx.save()
  ctx.translate(screenX, screenY)
  ctx.rotate(Math.PI / 4)
  const s = gem.radius
  ctx.beginPath()
  ctx.rect(-s, -s, s * 2, s * 2)
  ctx.fillStyle = '#7ef7c4'
  ctx.shadowColor = '#7ef7c4'
  ctx.shadowBlur = 6
  ctx.fill()
  ctx.lineWidth = 1.5
  ctx.strokeStyle = '#1f8f66'
  ctx.stroke()
  ctx.restore()
}
