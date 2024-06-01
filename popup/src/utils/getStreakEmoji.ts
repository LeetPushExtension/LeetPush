export function getStreakEmoji(streakLength: number): string {
  if (streakLength === 1) return '🌱'
  else if (streakLength <= 5) return '🌿'
  else if (streakLength <= 10) return '🔥'
  else if (streakLength <= 20) return '🌟'
  else if (streakLength <= 30) return '💪'
  else if (streakLength <= 40) return '🚀'
  else if (streakLength <= 50) return '🎯'
  else if (streakLength <= 75) return '🏆'
  else if (streakLength <= 100) return '👑'
  else return '⚡️'
}
