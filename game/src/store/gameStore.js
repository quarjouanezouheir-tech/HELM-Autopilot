import { create } from 'zustand'

// État réactif consommé par le HUD / les écrans (start, game over).
// La simulation frame-par-frame (positions des entités) vit dans GameEngine,
// en dehors de Zustand, pour ne pas déclencher un re-render React à 60fps.
export const useGameStore = create((set) => ({
  status: 'start', // 'start' | 'playing' | 'gameover'

  activeCharacter: 'wanderer', // placeholder : futur choix de personnage
  fusions: [], // placeholder : pouvoirs fusionnés actifs (max 3, système à venir)

  hp: 100,
  maxHp: 100,
  level: 1,
  xp: 0,
  xpToNext: 8,
  damage: 10,
  wave: 1,
  time: 0,
  kills: 0,

  startGame: () =>
    set({
      status: 'playing',
      hp: 100,
      maxHp: 100,
      level: 1,
      xp: 0,
      xpToNext: 8,
      damage: 10,
      wave: 1,
      time: 0,
      kills: 0,
    }),

  setHud: (partial) => set(partial),

  endGame: () => set({ status: 'gameover' }),
}))
