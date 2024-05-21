import { useEffect, useState } from 'react'

interface QuestionData {
  questionLink: string;
  questionTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  date: string;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function saveToLocalStorage(data: QuestionData): void {
  localStorage.setItem('dailyProblem', JSON.stringify(data))
}

function loadFromLocalStorage(): QuestionData | null {
  const data = localStorage.getItem('dailyProblem')
  return data ? JSON.parse(data) : null
}

function getDifficultyColor(difficulty: 'Easy' | 'Medium' | 'Hard'): string {
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

export default function Daily() {
  const [data, setData] = useState<QuestionData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDailyProblem = async () => {
      setIsLoading(true)
      setError(null)

      const today = formatDate(new Date())
      const cachedData = loadFromLocalStorage()

      if (cachedData && cachedData.date === today) {
        setData(cachedData)
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch(`https://alfa-leetcode-api.onrender.com/daily`)
        if (!res.ok) {
          throw new Error('Failed to fetch the daily problem')
        }

        const json: QuestionData = await res.json()
        json.date = today
        saveToLocalStorage(json)
        setData(json)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDailyProblem()
  }, [])

  return (
    <div>
      {error && <p className="text-red-500">{`Error: ${error}`}</p>}
      {data && !error && !isLoading && (
        <div className="flex flex-col mb-2">
          <p className="font-medium text-sm">Daily Problem</p>
          <div>
            <a
              href={data.questionLink}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold underline mr-3 transition-colors duration-200 hover:text-blue-500"
              aria-label={`Read more about the daily problem: ${data.questionTitle}`}
            >
              {data.questionTitle}
            </a>
            <span
              className={`text-sm font-semibold px-1 py-1 ${getDifficultyColor(data.difficulty)} rounded-md`}
            >
              {data.difficulty}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
