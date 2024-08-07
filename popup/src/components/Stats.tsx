import { profileCalendar } from '@/lib/leetcode.api'

export default async function Stats() {
  const { maxStreak, totalActiveDays, fullSubmissionArray } =
    await profileCalendar('husamahmud')

  console.log('maxStreak:', maxStreak)
  console.log('totalActiveDays:', totalActiveDays)
  console.log('fullSubmissionArray:', fullSubmissionArray)

  return <h1>Stats</h1>
}
