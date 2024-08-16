import { useEffect, useRef } from 'react'

import { UserStreakI } from '@/types/leetpush.interface.ts'
import { formatStreak, getDayColor, streakEmoji } from '@/lib/utils.ts'

export default function Streak({ data }: { data: UserStreakI }) {
  const endRef = useRef<HTMLDivElement>(null)
  const streakArray = formatStreak(data.fullSubmissionArray)

  useEffect(() => {
    if (endRef.current && streakArray.length > 0) {
      endRef.current.scrollLeft = endRef.current.scrollWidth
    }
  }, [streakArray])

  return (
    <div className="">
      <p className="font-medium text-center text-sm mb-3">
        Your Max
        Streak: <span className="font-semibold underline">{data.maxStreak}</span> {streakEmoji(96)}
      </p>

      <div className="flex gap-4 overflow-x-scroll scrollbar-hidden"
           ref={endRef}>
        {streakArray.map((entry, i) => (
          <div key={i}
               className="flex-col flex justify-between gap-1 min-w-[91px] scrollbar-hidden">
            <div className="grid grid-cols-5 gap-y-1 gap-x-0.5">
              {entry.days.map((daysEntry, i) => (
                <div key={i}
                     className="h-[14px] w-[14px] rounded-[0.175rem] bg-red-700"
                     style={{ backgroundColor: getDayColor(daysEntry.value) }} />
              ))}
            </div>
            <p className="text-center text-lp-grey">{entry.month}</p>
          </div>
        ))}
      </div>
    </div>
  )
}


//res.map(entry => {
//   console.log(entry.month)
//
//   entry.days.map(dayEntry => {
//     console.log(dayEntry)
//   })
//
//   console.log('---')
// })
