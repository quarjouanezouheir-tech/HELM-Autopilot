import { PROJECTILE } from '../engine/constants.js'

let nextProjectileId = 1

export function createProjectile(x, y, angle, damage) {
  return {
    id: nextProjectileId++,
    x,
    y,
    vx: Math.cos(angle) * PROJECTILE.SPEED,
    vy: Math.sin(angle) * PROJECTILE.SPEED,
    radius: PROJECTILE.RADIUS,
    damage,
    traveled: 0,
  }
}

export function updateProjectile(projectile, dt) {
  const dx = projectile.vx * dt
  const dy = projectile.vy * dt
  projectile.x += dx
  projectile.y += dy
  projectile.traveled += Math.hypot(dx, dy)
}

export function isProjectileExpired(projectile) {
  return projectile.traveled >= PROJECTILE.MAX_RANGE
}

export function drawProjectile(ctx, projectile, screenX, screenY) {
  ctx.save()
  ctx.translate(screenX, screenY)
  ctx.beginPath()
  ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2)
  ctx.fillStyle = '#ffe066'
  ctx.shadowColor = '#ffe066'
  ctx.shadowBlur = 8
  ctx.fill()
  ctx.restore()
}
