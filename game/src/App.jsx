import GameCanvas from './components/GameCanvas.jsx'
import HUD from './components/HUD.jsx'
import StartScreen from './components/StartScreen.jsx'
import GameOverScreen from './components/GameOverScreen.jsx'
import { useGameStore } from './store/gameStore.js'
import './App.css'

export default function App() {
  const status = useGameStore((s) => s.status)

  return (
    <div className="app-root">
      <GameCanvas />
      {status === 'playing' && <HUD />}
      {status === 'start' && <StartScreen />}
      {status === 'gameover' && <GameOverScreen />}
    </div>
  )
}
