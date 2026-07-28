import { useGameStore } from '../store/gameStore.js'
import './HUD.css'

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function HUD() {
  const { hp, maxHp, level, xp, xpToNext, wave, time, kills } = useGameStore((s) => s)

  const hpRatio = Math.max(0, hp / maxHp)
  const xpRatio = Math.min(1, xp / xpToNext)

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-bar hud-hp">
          <div className="hud-bar-fill" style={{ width: `${hpRatio * 100}%` }} />
          <span className="hud-bar-label">{Math.ceil(hp)} / {maxHp}</span>
        </div>
        <div className="hud-info">
          <span>⏱ {formatTime(time)}</span>
          <span>🌊 Vague {wave}</span>
          <span>💀 {kills}</span>
        </div>
      </div>
      <div className="hud-bottom">
        <div className="hud-level">Niv. {level}</div>
        <div className="hud-bar hud-xp">
          <div className="hud-bar-fill" style={{ width: `${xpRatio * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
