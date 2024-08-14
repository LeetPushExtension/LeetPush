import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DayValueI, StreakI } from '@/types/leetpush.interface.ts'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getDifficultyColor(difficulty: 'Easy' | 'Medium' | 'Hard'): string {
  switch (difficulty) {
    case 'Easy':
      return 'bg-lp-green-dark bg-lp-green'
    case 'Medium':
      return 'bg-lp-yellow-dark bg-lp-yellow'
    case 'Hard':
      return 'bg-lp-red-dark bg-lp-red'
    default:
      return 'text-gray-500 bg-gray-100'
  }
}

export function streakEmoji(streakLength: number): string {
  if (streakLength === 1) return '🌱'
  else if (streakLength <= 5) return '🌿'
  else if (streakLength <= 10) return '🔥'
  else if (streakLength <= 20) return '🌟'
  else if (streakLength <= 30) return '💪'
  else if (streakLength <= 40) return '🚀'
  else if (streakLength <= 50) return '🎯'
  else if (streakLength <= 75) return '🏆'
  else if (streakLength <= 100) return '👑'
  else return '🐉'
}

export function getDayColor(count: number) {
  if (count === 0) return '#ffffff14'
  if (count < 5) return '#016620'
  if (count < 10) return '#28c244'
  if (count < 15) return '#67BD72'
  return '#9be9a8'
}

export function formatStreak(data: StreakI[]) {
  const result: { [key: string]: DayValueI[] } = {}

  data.forEach(entry => {
    const date = new Date(entry.date)
    const month = date.toLocaleString('default', { month: 'short' })
    const day = date.getDate()

    if (!result[month]) result[month] = []

    result[month].push({ day, value: entry.value })
  })

  return Object.keys(result).map(month => ({
    month,
    days: result[month],
  }))
}
