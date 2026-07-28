import { ENEMY } from '../engine/constants.js'

let nextEnemyId = 1

export function spawnEnemy(player, wave, spawnRadius) {
  const angle = Math.random() * Math.PI * 2
  const x = player.x + Math.cos(angle) * spawnRadius
  const y = player.y + Math.sin(angle) * spawnRadius

  const hpScale = 1 + (wave - 1) * 0.18
  const speedScale = 1 + (wave - 1) * 0.05

  return {
    id: nextEnemyId++,
    x,
    y,
    radius: ENEMY.RADIUS,
    speed: ENEMY.BASE_SPEED * speedScale,
    hp: Math.round(ENEMY.BASE_HP * hpScale),
    maxHp: Math.round(ENEMY.BASE_HP * hpScale),
    contactDamage: ENEMY.CONTACT_DAMAGE,
    hitFlash: 0,
  }
}

export function updateEnemy(enemy, player, dt) {
  const dx = player.x - enemy.x
  const dy = player.y - enemy.y
  const dist = Math.hypot(dx, dy) || 1
  enemy.x += (dx / dist) * enemy.speed * dt
  enemy.y += (dy / dist) * enemy.speed * dt

  if (enemy.hitFlash > 0) {
    enemy.hitFlash = Math.max(0, enemy.hitFlash - dt)
  }
}

export function drawEnemy(ctx, enemy, screenX, screenY) {
  ctx.save()
  ctx.translate(screenX, screenY)

  ctx.beginPath()
  ctx.ellipse(0, enemy.radius * 0.75, enemy.radius * 0.85, enemy.radius * 0.3, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2)
  ctx.fillStyle = enemy.hitFlash > 0 ? '#ffffff' : '#ff5d7a'
  ctx.fill()
  ctx.lineWidth = 2.5
  ctx.strokeStyle = '#a8143a'
  ctx.stroke()

  // Barre de vie si endommagé
  if (enemy.hp < enemy.maxHp) {
    const w = enemy.radius * 2
    const ratio = Math.max(0, enemy.hp / enemy.maxHp)
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(-w / 2, -enemy.radius - 10, w, 4)
    ctx.fillStyle = '#4ade80'
    ctx.fillRect(-w / 2, -enemy.radius - 10, w * ratio, 4)
  }

  ctx.restore()
}
