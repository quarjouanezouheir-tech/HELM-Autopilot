export const PLAYER = {
  RADIUS: 16,
  SPEED: 220, // px/s
  BASE_HP: 100,
  BASE_DAMAGE: 10,
  BASE_ATTACK_COOLDOWN: 0.55, // secondes entre deux tirs auto
  INVULN_DURATION: 0.5, // i-frames après avoir pris un coup
}

export const PROJECTILE = {
  RADIUS: 5,
  SPEED: 520,
  MAX_RANGE: 900,
}

export const ENEMY = {
  RADIUS: 14,
  BASE_SPEED: 85,
  BASE_HP: 18,
  CONTACT_DAMAGE: 10,
  SPAWN_MARGIN: 80, // distance hors écran à laquelle les ennemis apparaissent
}

export const XP_GEM = {
  RADIUS: 6,
  VALUE: 4,
  MAGNET_RADIUS: 100,
  PICKUP_RADIUS: 20,
  MAGNET_SPEED: 380,
}

export const WAVE = {
  INTERVAL: 12, // secondes entre chaque montée en difficulté
  BASE_SPAWN_INTERVAL: 1.5,
  MIN_SPAWN_INTERVAL: 0.35,
  BASE_SPAWN_COUNT: 1,
}

export function xpToNextLevel(level) {
  return 8 + (level - 1) * 6
}
