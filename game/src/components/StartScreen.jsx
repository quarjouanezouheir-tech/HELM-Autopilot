import { useGameStore } from '../store/gameStore.js'
import './Overlay.css'

export default function StartScreen() {
  const startGame = useGameStore((s) => s.startGame)

  return (
    <div className="overlay">
      <div className="overlay-panel">
        <h1 className="overlay-title">Survivor Fusion</h1>
        <p className="overlay-subtitle">
          Survivez aux vagues, ramassez l'XP, montez de niveau. Déplacez-vous avec
          <strong> WASD / flèches</strong> ou le <strong>joystick tactile</strong>.
        </p>
        <button className="overlay-button" onClick={startGame}>
          Jouer
        </button>
      </div>
    </div>
  )
}
