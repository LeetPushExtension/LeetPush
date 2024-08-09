import { QuestionDataI } from '@/utils/types.ts'

export function saveToLocalStorage(data: QuestionDataI): void {
  localStorage.setItem('dailyProblem', JSON.stringify(data))
}

export function loadFromLocalStorage(): QuestionDataI | null {
  const data = localStorage.getItem('dailyProblem')
  return data ? JSON.parse(data) : null
}
