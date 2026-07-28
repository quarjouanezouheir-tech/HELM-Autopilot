import { PLAYER } from '../engine/constants.js'

export function createPlayer() {
  return {
    x: 0,
    y: 0,
    radius: PLAYER.RADIUS,
    speed: PLAYER.SPEED,
    hp: PLAYER.BASE_HP,
    maxHp: PLAYER.BASE_HP,
    damage: PLAYER.BASE_DAMAGE,
    level: 1,
    xp: 0,
    attackCooldown: PLAYER.BASE_ATTACK_COOLDOWN,
    attackTimer: 0,
    invulnTimer: 0,
    facing: 0, // radians, pour orienter le sprite
  }
}

export function updatePlayerMovement(player, input, dt) {
  const { x: ix, y: iy } = input
  const mag = Math.hypot(ix, iy)
  if (mag > 0.001) {
    const nx = ix / mag
    const ny = iy / mag
    const clampedMag = Math.min(mag, 1)
    player.x += nx * player.speed * clampedMag * dt
    player.y += ny * player.speed * clampedMag * dt
    player.facing = Math.atan2(ny, nx)
  }
  if (player.invulnTimer > 0) {
    player.invulnTimer = Math.max(0, player.invulnTimer - dt)
  }
}

export function drawPlayer(ctx, player, screenX, screenY) {
  const flashing = player.invulnTimer > 0 && Math.floor(player.invulnTimer * 20) % 2 === 0
  ctx.save()
  ctx.translate(screenX, screenY)

  // Ombre au sol
  ctx.beginPath()
  ctx.ellipse(0, player.radius * 0.8, player.radius * 0.9, player.radius * 0.35, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fill()

  ctx.rotate(player.facing)

  // Corps
  ctx.beginPath()
  ctx.arc(0, 0, player.radius, 0, Math.PI * 2)
  ctx.fillStyle = flashing ? '#ffffff' : '#5ee3ff'
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = '#1c9fc9'
  ctx.stroke()

  // Indicateur de direction
  ctx.beginPath()
  ctx.moveTo(player.radius * 0.4, 0)
  ctx.lineTo(player.radius * 1.5, -player.radius * 0.5)
  ctx.lineTo(player.radius * 1.5, player.radius * 0.5)
  ctx.closePath()
  ctx.fillStyle = '#ffe066'
  ctx.fill()

  // Yeux (style anime)
  ctx.rotate(-player.facing)
  ctx.beginPath()
  ctx.arc(-4, -3, 2.4, 0, Math.PI * 2)
  ctx.arc(4, -3, 2.4, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1a2e'
  ctx.fill()

  ctx.restore()
}
