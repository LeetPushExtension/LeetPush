import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, fromUnixTime } from 'date-fns'
import { Submission } from '@/types/profileCalendar.interface'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a Unix timestamp to a date string
 * @param timestamp Unix timestamp
 * @returns Date string in the format 'yyyy-MM-dd'
 *
 * @example formatDate(1627680000) => '2021-07-31'
 **/
export const formatDate = (timestamp: number) =>
  format(fromUnixTime(timestamp), 'yyyy-MM-dd')

/**
 * Create a full array of submission data with 0 values for missing dates
 * @param submissionCalendar Submission calendar data
 * @returns Full array of submission data
 *
 * @example createFullSubmissionArray('{"1627680000": 1, "1627766400": 2}') => [
 *  { date: '2021-07-31', value: 1 },
 *  { date: '2021-08-01', value: 2 },
 *  ...
 *  ]
 */
export const createFullSubmissionArray = (
  submissionCalendar: string,
): Submission[] => {
  const submissionCalendarObj = JSON.parse(submissionCalendar)
  const submissionCalendarArray = Object.entries(submissionCalendarObj).map(
    ([key, value]) => {
      const date = formatDate(parseInt(key, 10))
      return { date, value }
    },
  )

  submissionCalendarArray.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const startDate = new Date(submissionCalendarArray[0].date)
  const endDate = new Date(
    submissionCalendarArray[submissionCalendarArray.length - 1].date,
  )

  const fullArray = []
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const currentDate = d.toISOString().split('T')[0]
    const existingSubmission = submissionCalendarArray.find(
      (item: any) => item.date === currentDate,
    )

    fullArray.push({
      date: currentDate,
      value: existingSubmission ? Number(existingSubmission.value) : 0,
    })
  }

  return fullArray
}
