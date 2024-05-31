import { useEffect, useState } from 'react'

import { formatDate } from '../utils/formatDate.ts'
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from '../utils/localStorage.ts'
import { getDifficultyColor } from '../utils/getDifficultyColor.ts'
import { QuestionDataI, QDataI } from '@/utils/types.ts'

export default function Daily() {
  const [data, setData] = useState<QuestionDataI | null>(null)
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
        const res = await fetch(`${import.meta.env.VITE_LEETPUSH_API_URL}/daily`)
        if (!res.ok) {
          throw new Error('Failed to fetch the daily problem')
        }

        const json: QuestionDataI = await res.json()
        json.data.date = today
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

  const questionData: QDataI = data?.data

  return (
    <div>
      {error && <p className="text-red-500">{`Error: ${error}`}</p>}
      {data && !error && !isLoading && (
        <div className="flex flex-col mb-2">
          <p className="font-medium text-sm">Daily Problem</p>
          <div>
            <a
              href={`https://leetcode.com${questionData.link}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold underline mr-3 transition-colors duration-200 hover:text-blue-500"
              aria-label={`Read more about the daily problem: ${questionData.title}`}
            >
              {questionData.title}
            </a>
            <span
              className={`text-sm font-semibold px-1 py-1 ${getDifficultyColor(questionData.difficulty)} rounded-md`}
            >
                {questionData.difficulty}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
