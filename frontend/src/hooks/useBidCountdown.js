import { useState, useEffect } from 'react'
import { timeUntil } from '@/utils/formatDate'

export function useBidCountdown(endsAt) {
  const [timeLeft, setTimeLeft] = useState(timeUntil(endsAt))
  const [isEnded, setIsEnded] = useState(new Date(endsAt) <= new Date())

  useEffect(() => {
    if (isEnded) return
    const interval = setInterval(() => {
      const ended = new Date(endsAt) <= new Date()
      setTimeLeft(timeUntil(endsAt))
      if (ended) {
        setIsEnded(true)
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [endsAt, isEnded])

  return { timeLeft, isEnded }
}
