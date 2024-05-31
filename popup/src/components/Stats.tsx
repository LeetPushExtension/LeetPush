import { useEffect, useState } from 'react'

import Loader from './Loader.tsx'
import { UserStatsI, UStatsI } from '../utils/types.ts'


export default function FetchUserStats({ leetCodeUsername }: {
  leetCodeUsername: string
}) {
  const [userStats, setUserStats] = useState<UserStatsI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${import.meta.env.VITE_LEETPUSH_API_URL}/${leetCodeUsername}`)
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Too Many Requests, please try again later')
          } else {
            throw new Error('Failed to fetch user statistics')
          }
        }

        const data: UserStatsI = await response.json()
        if (!data.data.acSubmissionNum) {
          throw new Error('User not found. Please check the user details.')
        }

        setUserStats(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [leetCodeUsername])

  if (isLoading) return <Loader />
  if (error || !userStats) return <div className="text-lp-red font-semibold mb-4">{error}</div>

  const stats: UStatsI = userStats.data
  const easyPercentage: number = (stats.acSubmissionNum[1].count / stats.acSubmissionNum[0].count) * 100
  const mediumPercentage: number = (stats.acSubmissionNum[2].count / stats.acSubmissionNum[0].count) * 100
  const hardPercentage: number = (stats.acSubmissionNum[3].count / stats.acSubmissionNum[0].count) * 100

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-3">
        <p className="font-semibold text-base">
          <span className="text-lp-green mr-2">Easy</span>
          <span className="text-lp-white">{stats.acSubmissionNum[1].count}</span>
        </p>

        <p className="font-semibold text-base">
          <span className="text-lp-yellow mr-2">Medium</span>
          <span className="text-lp-white">{stats.acSubmissionNum[2].count}</span>
        </p>

        <p className="font-semibold text-base">
          <span className="text-lp-red mr-2">Hard</span>
          <span className="text-lp-white">{stats.acSubmissionNum[3].count}</span>
        </p>

        <p className="font-semibold text-base text-lp-greyer">
          Total <span className="text-lp-white underline">{stats.acSubmissionNum[0].count}</span>
        </p>
      </div>

      <div className="flex w-full h-2 rounded-xl overflow-hidden">
        <div className="bg-lp-green"
             style={{ width: `${easyPercentage}%` }} />
        <div className="bg-lp-yellow"
             style={{ width: `${mediumPercentage}%` }} />
        <div className="bg-lp-red"
             style={{ width: `${hardPercentage}%` }} />
      </div>
    </div>
  )
}
