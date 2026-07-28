import { useEffect, useRef } from 'react'
import './Joystick.css'

const BASE_RADIUS = 55
const KNOB_MAX_DIST = 40

// Joystick virtuel tactile. Écrit directement dans vectorRef (pas de state
// React) pour rester fluide à 60fps pendant le drag.
export default function Joystick({ vectorRef }) {
  const baseRef = useRef(null)
  const knobRef = useRef(null)
  const activePointerId = useRef(null)

  useEffect(() => {
    const base = baseRef.current
    const knob = knobRef.current
    if (!base || !knob) return

    function setKnob(dx, dy) {
      knob.style.transform = `translate(${dx}px, ${dy}px)`
    }

    function resetKnob() {
      setKnob(0, 0)
      vectorRef.current.x = 0
      vectorRef.current.y = 0
    }

    function onPointerDown(e) {
      activePointerId.current = e.pointerId
      base.setPointerCapture(e.pointerId)
      updateFromEvent(e)
    }

    function updateFromEvent(e) {
      const rect = base.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      let dx = e.clientX - cx
      let dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist > KNOB_MAX_DIST) {
        dx = (dx / dist) * KNOB_MAX_DIST
        dy = (dy / dist) * KNOB_MAX_DIST
      }
      setKnob(dx, dy)
      vectorRef.current.x = dx / KNOB_MAX_DIST
      vectorRef.current.y = dy / KNOB_MAX_DIST
    }

    function onPointerMove(e) {
      if (activePointerId.current !== e.pointerId) return
      updateFromEvent(e)
    }

    function onPointerUp(e) {
      if (activePointerId.current !== e.pointerId) return
      activePointerId.current = null
      resetKnob()
    }

    base.addEventListener('pointerdown', onPointerDown)
    base.addEventListener('pointermove', onPointerMove)
    base.addEventListener('pointerup', onPointerUp)
    base.addEventListener('pointercancel', onPointerUp)

    return () => {
      base.removeEventListener('pointerdown', onPointerDown)
      base.removeEventListener('pointermove', onPointerMove)
      base.removeEventListener('pointerup', onPointerUp)
      base.removeEventListener('pointercancel', onPointerUp)
    }
  }, [vectorRef])

  return (
    <div className="joystick-base" ref={baseRef} style={{ width: BASE_RADIUS * 2, height: BASE_RADIUS * 2 }}>
      <div className="joystick-knob" ref={knobRef} />
    </div>
  )
}
