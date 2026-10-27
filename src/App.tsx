import { MotionConfig } from 'motion/react'
import { HomePage } from '@/pages/HomePage'

export default function App() {
  return (
    // Rispetta "Riduci movimento" del sistema operativo per tutte le animazioni.
    <MotionConfig reducedMotion="user">
      <HomePage />
    </MotionConfig>
  )
}
