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
