import axios from 'axios'

import { ProfileQuery } from '@/graphql/ProfileQuery'
import { DailyProblemQuery } from '@/graphql/DailyProblemQuery'
import { ProfileCalendarQuery } from '@/graphql/ProfileCalendarQuery'
import { ProfileData, ProfileDataI } from '@/types/profileData.interface'
import { DailyProblem, DailyProblemI } from '@/types/dailyProblem.interface'
import { ProfileCalendar, ProfileCalendarI } from '@/types/profileCalendar.interface'
import { createFullSubmissionArray } from '@/lib/utils'

export async function profileData(username: string): Promise<ProfileData> {
  try {
    const { data } = await axios.post<ProfileDataI>(
      'https://leetcode.com/graphql',
      {
        variables: { username },
        query: ProfileQuery,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (data.data.matchedUser === null) {
      throw new Error(`User not found: ${username}`)
    }

    return {
      allQuestionsCount: data.data.allQuestionsCount,
      acSubmissionNum: data.data.matchedUser.submitStatsGlobal.acSubmissionNum,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `LeetCode API error: ${error.response.status} ${error.response.statusText}`,
        )
      } else if (error.request) {
        throw new Error('No response received from LeetCode API')
      } else {
        throw new Error(`Error setting up request: ${error.message}`)
      }
    }
    if (error instanceof Error && error.message.startsWith('User not found:')) {
      throw error
    }
    throw new Error('An unexpected error occurred')
  }
}

export async function dailyProblem(): Promise<DailyProblem> {
  try {
    const { data } = await axios.post<DailyProblemI>(
      'https://leetcode.com/graphql',
      {
        query: DailyProblemQuery,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const { date, link, question } = data.data.activeDailyCodingChallengeQuestion
    return { date, link, question }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          'LeetCode API error:',
          error.response.status,
          error.response.statusText,
        )
        console.error('Response data:', error.response.data)
        throw new Error(
          `LeetCode API error: ${error.response.status} ${error.response.statusText}`,
        )
      } else if (error.request) {
        console.error('No response received from LeetCode API')
        throw new Error('No response received from LeetCode API')
      } else {
        console.error('Error setting up request:', error.message)
        throw new Error(`Error setting up request: ${error.message}`)
      }
    }
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred')
  }
}

export async function profileCalendar(username: string): Promise<ProfileCalendar> {
  try {
    const { data } = await axios.post<ProfileCalendarI>(
      'https://leetcode.com/graphql',
      {
        variables: { username },
        query: ProfileCalendarQuery,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (data.data.matchedUser === null) {
      throw new Error(`User not found: ${username}`)
    }

    const { streak, totalActiveDays, submissionCalendar } =
      data.data.matchedUser.userCalendar

    const fullSubmissionArray = createFullSubmissionArray(submissionCalendar)

    return {
      maxStreak: streak,
      totalActiveDays,
      fullSubmissionArray,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          'LeetCode API error:',
          error.response.status,
          error.response.statusText,
        )
        console.error('Response data:', error.response.data)
        throw new Error(
          `LeetCode API error: ${error.response.status} ${error.response.statusText}`,
        )
      } else if (error.request) {
        console.error('No response received from LeetCode API')
        throw new Error('No response received from LeetCode API')
      } else {
        console.error('Error setting up request:', error.message)
        throw new Error(`Error setting up request: ${error.message}`)
      }
    }
    if (error instanceof Error && error.message.startsWith('User not found:')) {
      throw error
    }
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred')
  }
}
