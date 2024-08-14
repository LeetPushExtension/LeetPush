import {
  DailyProblemI,
  UserStatsI,
  UserStreakI,
} from '@/types/leetpush.interface.ts'

/**
 * fetchDailyProblem - Fetch the daily problem from the LeetPush API
 * @returns The daily problem
 **/
export const fetchDailyProblem = async (): Promise<DailyProblemI> => {
  const response = await fetch(`https://leet-push-api-git-master-husamahmuds-projects.vercel.app/api/v2/daily`)
  if (!response.ok) throw new Error('Failed to fetch the daily problem')

  const data = await response.json()
  return data.data
}

/**
 * fetchUserStats - Fetch user stats from the LeetPush API
 * @param username - The username of the user to fetch stats for
 * @returns The user stats
 **/
export const fetchUserStats = async (username: string): Promise<UserStatsI> => {
  const response = await fetch(`https://leet-push-api-git-master-husamahmuds-projects.vercel.app/api/v2/${username}`)
  if (response.status === 404) throw new Error('User not found')
  else if (!response.ok) throw new Error('Failed to fetch user stats')

  const data = await response.json()
  return data.data
}

/**
 * fetchUserStreak - Fetch user streak from the LeetPush API
 * @param username - The username of the user to fetch streak for
 **/
export const fetchUserStreak = async (username: string): Promise<UserStreakI> => {
  const response = await fetch(`https://leet-push-api-git-master-husamahmuds-projects.vercel.app/api/v2/userProfileCalendar/${username}`)
  if (!response.ok) throw new Error('Failed to fetch user streak')

  return await response.json()
}
