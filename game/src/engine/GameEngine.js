import { createPlayer, updatePlayerMovement } from '../entities/Player.js'
import { spawnEnemy, updateEnemy } from '../entities/Enemy.js'
import { createProjectile, updateProjectile, isProjectileExpired } from '../entities/Projectile.js'
import { createXPGem, updateXPGem } from '../entities/XPGem.js'
import { ENEMY, PLAYER, WAVE, xpToNextLevel } from './constants.js'

// Simulation pure JS (hors React) mise à jour à chaque frame par GameCanvas.
// Les positions des entités ne passent jamais par Zustand : seul un résumé
// HUD (hp, xp, level, wave, kills, time) est synchronisé, et seulement
// quand une valeur affichée change réellement.
export class GameEngine {
  constructor(onHudChange, onGameOver) {
    this.onHudChange = onHudChange
    this.onGameOver = onGameOver
    this.viewport = { width: 800, height: 600 }
    this.reset()
  }

  setViewport(width, height) {
    this.viewport.width = width
    this.viewport.height = height
  }

  reset() {
    this.player = createPlayer()
    this.enemies = []
    this.projectiles = []
    this.gems = []
    this.wave = 1
    this.time = 0
    this.kills = 0
    this.waveTimer = WAVE.INTERVAL
    this.spawnTimer = 0
    this.gameOver = false
    this._lastHud = null
    this._lastSecond = -1
    this.syncHud(true)
  }

  update(dt, input) {
    if (this.gameOver) return

    this.time += dt
    updatePlayerMovement(this.player, input, dt)

    this.updateWave(dt)
    this.updateSpawning(dt)
    this.updateEnemies(dt)
    this.updateAttack(dt)
    this.updateProjectiles(dt)
    this.updateGems(dt)

    if (this.player.hp <= 0 && !this.gameOver) {
      this.player.hp = 0
      this.gameOver = true
      this.syncHud(true)
      this.onGameOver({
        time: this.time,
        level: this.player.level,
        kills: this.kills,
        wave: this.wave,
      })
      return
    }

    this.syncHud(false)
  }

  updateWave(dt) {
    this.waveTimer -= dt
    if (this.waveTimer <= 0) {
      this.wave += 1
      this.waveTimer = WAVE.INTERVAL
    }
  }

  updateSpawning(dt) {
    this.spawnTimer -= dt
    if (this.spawnTimer > 0) return

    const spawnInterval = Math.max(
      WAVE.MIN_SPAWN_INTERVAL,
      WAVE.BASE_SPAWN_INTERVAL - (this.wave - 1) * 0.12,
    )
    const spawnCount = WAVE.BASE_SPAWN_COUNT + Math.floor((this.wave - 1) / 2)
    const spawnRadius =
      Math.hypot(this.viewport.width, this.viewport.height) / 2 + ENEMY.SPAWN_MARGIN

    for (let i = 0; i < spawnCount; i++) {
      this.enemies.push(spawnEnemy(this.player, this.wave, spawnRadius))
    }
    this.spawnTimer = spawnInterval
  }

  updateEnemies(dt) {
    for (const enemy of this.enemies) {
      updateEnemy(enemy, this.player, dt)

      const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y)
      if (dist <= enemy.radius + this.player.radius && this.player.invulnTimer <= 0) {
        this.player.hp = Math.max(0, this.player.hp - enemy.contactDamage)
        this.player.invulnTimer = PLAYER.INVULN_DURATION
      }
    }
  }

  updateAttack(dt) {
    this.player.attackTimer -= dt
    if (this.player.attackTimer > 0) return

    const target = this.findNearestEnemy()
    if (!target) return

    const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x)
    this.projectiles.push(createProjectile(this.player.x, this.player.y, angle, this.player.damage))
    this.player.attackTimer = this.player.attackCooldown
  }

  findNearestEnemy() {
    let nearest = null
    let nearestDist = Infinity
    for (const enemy of this.enemies) {
      const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = enemy
      }
    }
    return nearest
  }

  updateProjectiles(dt) {
    for (const projectile of this.projectiles) {
      updateProjectile(projectile, dt)
    }

    for (const projectile of this.projectiles) {
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0) continue
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
        if (dist <= projectile.radius + enemy.radius) {
          enemy.hp -= projectile.damage
          enemy.hitFlash = 0.15
          projectile.hit = true
          if (enemy.hp <= 0) {
            this.gems.push(createXPGem(enemy.x, enemy.y))
            this.kills += 1
          }
          break
        }
      }
    }

    this.enemies = this.enemies.filter((enemy) => enemy.hp > 0)
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.hit && !isProjectileExpired(projectile),
    )
  }

  updateGems(dt) {
    const remaining = []
    for (const gem of this.gems) {
      const collected = updateXPGem(gem, this.player, dt)
      if (collected) {
        this.grantXp(gem.value)
      } else {
        remaining.push(gem)
      }
    }
    this.gems = remaining
  }

  grantXp(amount) {
    this.player.xp += amount
    let needed = xpToNextLevel(this.player.level)
    while (this.player.xp >= needed) {
      this.player.xp -= needed
      this.player.level += 1
      this.player.damage += 3
      needed = xpToNextLevel(this.player.level)
    }
  }

  syncHud(force) {
    const second = Math.floor(this.time)
    const snapshot = {
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      level: this.player.level,
      xp: this.player.xp,
      xpToNext: xpToNextLevel(this.player.level),
      damage: this.player.damage,
      wave: this.wave,
      kills: this.kills,
      time: second,
    }

    const last = this._lastHud
    const changed =
      force ||
      !last ||
      last.hp !== snapshot.hp ||
      last.level !== snapshot.level ||
      last.xp !== snapshot.xp ||
      last.wave !== snapshot.wave ||
      last.kills !== snapshot.kills ||
      last.time !== snapshot.time

    if (changed) {
      this._lastHud = snapshot
      this.onHudChange(snapshot)
    }
  }

  getRenderState() {
    return {
      player: this.player,
      enemies: this.enemies,
      projectiles: this.projectiles,
      gems: this.gems,
    }
  }
}
