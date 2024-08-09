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


export function fillMissingDays(calendarData) {
  const sortedKeys = Object.keys(calendarData).sort()
  if (sortedKeys.length === 0) {
    return []
  }

  const startDate = new Date(sortedKeys[0])
  const endDate = new Date(sortedKeys[sortedKeys.length - 1])
  const daysArray = []
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split('T')[0]
    daysArray.push({
      date: key,
      count: calendarData[key] || 0,
    })
  }
  return daysArray
}
