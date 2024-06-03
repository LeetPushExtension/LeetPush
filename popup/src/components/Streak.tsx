import { useEffect, useRef } from 'react'
import { useQuery } from 'react-query'

import {
  fillMissingDays,
  getDayColor,
  streakEmoji,
} from '../utils/streakHelper.ts'
import { SubmissionCalendar } from '../utils/types.ts'

async function fetchUserProfileCalendar(leetCodeUsername: string): Promise<SubmissionCalendar> {
  const res = await fetch(`${import.meta.env.VITE_LEETPUSH_API_URL}/userProfileCalendar/${leetCodeUsername}`)
  if (!res.ok) throw new Error('Failed to fetch user profile calendar')

  const data: SubmissionCalendar = await res.json()
  return data
}

export default function Streak({ leetCodeUsername, setLoading }: {
  leetCodeUsername: string
  setLoading: (loading: boolean) => void
}) {
  const endRef = useRef<HTMLDivElement>(null)
  const { data, error, isLoading } = useQuery<SubmissionCalendar, Error>(
    ['fetchUserProfileCalendar', leetCodeUsername],
    () => fetchUserProfileCalendar(leetCodeUsername),
    { onSettled: () => setLoading(false) },
  )

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  const userCalendar = data?.submissionCalendar || {}
  const userStreak = data?.streak || 0
  const daysArray = fillMissingDays(userCalendar)

  useEffect(() => {
    if (endRef.current && daysArray.length > 0) {
      endRef.current.scrollLeft = endRef.current.scrollWidth
    }
  }, [daysArray])

  if (isLoading) return null
  if (error || !userCalendar) return <div className="text-lp-red font-semibold mb-4">{error.message}</div>
  if (userStreak === 0) return (
    <div className="text-center font-semibold mb-3 text-sm">
      No submissions in the current year. Time to start coding!
    </div>
  )

  return (
    <div className="pt-2 pb-5 px-3 mx-auto bg-transparent">
      <p className="font-medium text-center text-sm mb-3">
        Your Current
        Streak: <span className="font-semibold underline">{userStreak}</span> {streakEmoji(userStreak)}
      </p>
      <div ref={endRef}
           className="grid grid-flow-col overflow-x-scroll grid-rows-7 scrollbar-hidden gap-1">
        {daysArray.map((day, index) => (
          <div key={index}
               className="h-[15px] w-[15px] m-auto rounded-[0.175rem]"
               style={{ backgroundColor: getDayColor(day.count) }}>
          </div>
        ))}
      </div>
    </div>
  )
}
