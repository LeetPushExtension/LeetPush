import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { formatDate } from '../utils/formatDate.ts'
import { getDifficultyColor } from '../utils/getDifficultyColor.ts'
import { QuestionDataI, QDataI } from '@/utils/types.ts'

const fetchDailyProblem = async (): Promise<QuestionDataI> => {
  const res = await fetch(`${import.meta.env.VITE_LEETPUSH_API_URL}/daily`)
  if (!res.ok) {
    throw new Error('Failed to fetch the daily problem')
  }
  const data: QuestionDataI = await res.json()
  data.data.date = formatDate(new Date())
  return data
}

export default function Daily({ setLoading }: {
  setLoading: (loading: boolean) => void
}) {
  const {
    data,
    error,
    isLoading,
  } = useQuery<QuestionDataI, Error>('dailyProblem', fetchDailyProblem, {
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
    onSettled: () => setLoading(false),
  })

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  const questionData: QDataI = data?.data

  return (
    <div>
      {error && <p className="text-red-500">{`Error: ${error.message}`}</p>}
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
