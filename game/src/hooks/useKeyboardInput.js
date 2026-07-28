import { useEffect, useRef } from 'react'

const KEY_MAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
}

// Retourne un ref { x, y } dans [-1, 1] mis à jour en direct par les
// événements clavier (WASD / flèches), sans re-render React.
export function useKeyboardInput() {
  const vectorRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const pressed = new Set()

    function recompute() {
      let x = 0
      let y = 0
      if (pressed.has('left')) x -= 1
      if (pressed.has('right')) x += 1
      if (pressed.has('up')) y -= 1
      if (pressed.has('down')) y += 1
      vectorRef.current.x = x
      vectorRef.current.y = y
    }

    function onKeyDown(e) {
      const dir = KEY_MAP[e.key]
      if (!dir) return
      pressed.add(dir)
      recompute()
    }

    function onKeyUp(e) {
      const dir = KEY_MAP[e.key]
      if (!dir) return
      pressed.delete(dir)
      recompute()
    }

    function onBlur() {
      pressed.clear()
      recompute()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return vectorRef
}
