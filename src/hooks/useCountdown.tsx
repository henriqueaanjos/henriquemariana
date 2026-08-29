import { useEffect, useState } from "react"

interface TimeRemaining {
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

export function calculateTimeRemaining(targetDate: Date | string): {
  months: number,
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
} {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate
  const now = new Date()
  const total = target.getTime() - now.getTime()

  if (total <= 0) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)

  // Precise calculation for months and days
  let months = 0
  let tempDate = new Date(now)

  while (true) {
    const nextMonth = new Date(tempDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    if (nextMonth <= target) {
      months++
      tempDate = nextMonth
    } else {
      break
    }
  }

  const remainingTime = target.getTime() - tempDate.getTime()
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24))

  return { months, days, hours, minutes, seconds, total }
}

export function useCountdown(targetDate: Date | string): TimeRemaining {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(targetDate))

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return timeRemaining
}