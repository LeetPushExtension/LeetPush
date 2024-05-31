export function getColor(count: number) {
  if (count === 0) return '#ffffff14'
  if (count < 5) return '#016620'
  if (count < 10) return '#28c244'
  if (count < 15) return '#67BD72'
  return '#9be9a8'
}
