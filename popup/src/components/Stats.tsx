import { useEffect, useState } from 'react'
import Loader from './Loader.tsx'

interface UserStats {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export default function FetchUserStats({ leetCodeUsername }: {
  leetCodeUsername: string
}) {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${leetCodeUsername}/solved`)
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Too Many Requests, please try again later')
          } else {
            throw new Error('Failed to fetch user statistics')
          }
        }

        const data: UserStats = await response.json()
        if (data.errors && data.errors.length > 0) {
          data.errors.forEach(error => {
            if (error.path && error.path[0] === 'matchedUser') {
              throw new Error('User not found. Please check the user details.')
            }
          })
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

  const easyPercentage = (userStats.easySolved / userStats.solvedProblem) * 100
  const mediumPercentage = (userStats.mediumSolved / userStats.solvedProblem) * 100
  const hardPercentage = (userStats.hardSolved / userStats.solvedProblem) * 100

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-3">
        <p className="font-semibold">
          <span className="text-lp-green mr-2">Easy</span>
          <span className="text-lp-white">{userStats.easySolved}</span>
        </p>

        <p className="font-semibold">
          <span className="text-lp-yellow mr-2">Medium</span>
          <span className="text-lp-white">{userStats.mediumSolved}</span>
        </p>

        <p className="font-semibold">
          <span className="text-lp-red mr-2">Hard</span>
          <span className="text-lp-white">{userStats.hardSolved}</span>
        </p>

        <p className="font-semibold text-lp-greyer">
          Total <span className="text-lp-white underline">{userStats.solvedProblem}</span>
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
