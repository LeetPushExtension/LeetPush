import { useEffect, useRef, useState } from 'react'
import Loader from './Loader.tsx'
import { getColor } from '../utils/getColor.ts'

export default function Streak({ leetCodeUsername }: {
  leetCodeUsername: string
}) {
  const [userCalendar, setUserCalendar] = useState({})
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

  return (
    <div className="pt-2 pb-5 px-3 mx-auto bg-transparent">
      <div ref={endRef}
           className="grid grid-flow-col overflow-scroll grid-rows-7 gap-1">
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
