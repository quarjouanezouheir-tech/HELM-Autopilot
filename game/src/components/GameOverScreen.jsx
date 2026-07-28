import { useGameStore } from '../store/gameStore.js'
import './Overlay.css'

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function GameOverScreen() {
  const { level, kills, wave, time, startGame } = useGameStore((s) => ({
    level: s.level,
    kills: s.kills,
    wave: s.wave,
    time: s.time,
    startGame: s.startGame,
  }))

  return (
    <div className="overlay">
      <div className="overlay-panel">
        <h1 className="overlay-title">Game Over</h1>
        <div className="overlay-stats">
          <div><span>Temps survécu</span><strong>{formatTime(time)}</strong></div>
          <div><span>Niveau atteint</span><strong>{level}</strong></div>
          <div><span>Ennemis vaincus</span><strong>{kills}</strong></div>
          <div><span>Vague</span><strong>{wave}</strong></div>
        </div>
        <button className="overlay-button" onClick={startGame}>
          Recommencer
        </button>
      </div>
    </div>
  )
}
