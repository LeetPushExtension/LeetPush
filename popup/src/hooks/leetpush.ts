import { useQuery } from '@tanstack/react-query'

import {
  fetchDailyProblem,
  fetchUserStats,
  fetchUserStreak,
} from '@/lib/leetpush.api.ts'
import {
  DailyProblemI,
  UserStatsI,
  UserStreakI,
} from '@/types/leetpush.interface.ts'

/**
 * useDailyProblem - Fetch the daily problem from the LeetPush API
 **/
export function useDailyProblem() {
  const {
    data,
    error,
    isLoading,
  } = useQuery<DailyProblemI, Error>({
    queryKey: ['dailyProblem'],
    queryFn: fetchDailyProblem,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  })

  return { data, error, isLoading }
}

/**
 * useUserStats - Fetch user stats from the LeetPush API
 * @param username - The username of the user to fetch stats for
 **/
export function useUserStats(username: string) {
  const {
    data,
    error,
    isLoading,
  } = useQuery<UserStatsI, Error>({
    queryKey: ['userStats', username],
    queryFn: () => fetchUserStats(username),
  })

  return { data, error, isLoading }
}

/**
 * useUserStreak - Fetch user streak from the LeetPush API
 * @param username - The username of the user to fetch streak for
 **/
export function useUserStreak(username: string) {
  const {
    data,
    error,
    isLoading,
  } = useQuery<UserStreakI, Error>({
    queryKey: ['userStreak', username],
    queryFn: () => fetchUserStreak(username),
  })

  return { data, error, isLoading }
}
