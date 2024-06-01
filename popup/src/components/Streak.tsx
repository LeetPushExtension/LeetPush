import { useEffect, useRef, useState } from 'react'
import Loader from './Loader.tsx'
import { getColor } from '../utils/getColor.ts'
import { getStreakEmoji } from '../utils/getStreakEmoji.ts'

export default function Streak({ leetCodeUsername }: {
  leetCodeUsername: string
}) {
  const [userCalendar, setUserCalendar] = useState({})
  const [userStreak, setUserStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef(null)

  useEffect(() => {
    const fetchUserProfileCalendar = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch(`${import.meta.env.VITE_LEETPUSH_API_URL}/userProfileCalendar/${leetCodeUsername}`)
        if (!res.ok) {
          throw new Error('Failed to fetch user profile calendar')
        }

        const data = await res.json()
        setUserStreak(data.streak)
        setUserCalendar(data.submissionCalendar)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserProfileCalendar()
  }, [leetCodeUsername])

  const fillMissingDays = (calendarData) => {
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

  const daysArray = fillMissingDays(userCalendar)

  useEffect(() => {
    if (endRef.current && daysArray.length > 0) {
      endRef.current.scrollLeft = endRef.current.scrollWidth
    }
  }, [daysArray])

  if (isLoading) return <Loader />
  if (error || !userCalendar) return <div className="text-lp-red font-semibold mb-4">{error}</div>
  if (userStreak === 0) return (
    <div className="text-center font-semibold mb-3 text-sm">
      No submissions in the current year. Time to start coding!
    </div>
  )

  return (
    <div className="pt-2 pb-5 px-3 mx-auto bg-transparent">
      <p className="font-medium text-center text-sm mb-3">
        Your Current
        Streak: <span className="font-semibold underline">{userStreak}</span> {getStreakEmoji(userStreak)}
      </p>
      <div ref={endRef}
           className="grid grid-flow-col overflow-x-scroll grid-rows-7 scrollbar-hidden gap-1">
        {daysArray.map((day, index) => (
          <div key={index}
               className="h-[15px] w-[15px] m-auto rounded-[0.175rem]"
               style={{ backgroundColor: getColor(day.count) }}>
          </div>
        ))}
      </div>
    </div>
  )
}
