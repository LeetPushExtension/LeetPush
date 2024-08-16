import Welcome from '@/components/Welcome.tsx'
import Daily from '@/components/Daily.tsx'
import Spinner from '@/components/ui/Spinner.tsx'
import Stats from '@/components/Stats.tsx'
import Streak from '@/components/Streak.tsx'

import {
  useDailyProblem,
  useUserStats,
  useUserStreak,
} from '@/hooks/leetpush.ts'
import {
  DailyProblemI,
  UserStatsI,
  UserStreakI,
} from '@/types/leetpush.interface.ts'
import { useContext } from 'react'
import { UserContext } from '@/context/userContext.tsx'

export default function LeetCode() {
  const { username } = useContext(UserContext)

  const {
    data: dailyProblemData,
    error: dailyProblemError,
    isLoading: isDailyProblemLoading,
  } = useDailyProblem()

  const {
    data: userStatsData,
    error: userStatsError,
    isLoading: isUserStatsLoading,
  } = useUserStats(username)

  const {
    data: userStreakData,
    error: userStreakError,
    isLoading: isUserStreakLoadin,
  } = useUserStreak(username)

  const isLoading = isDailyProblemLoading || isUserStatsLoading || isUserStreakLoadin
  const error = dailyProblemError || userStatsError || userStreakError
  const totalProblems = userStatsData?.acSubmissionNum[0]?.count

  return (
    <div className="space-y-4">
      {isLoading
        ? <Spinner />
        : error ? (
          <div className="flex justify-center text-red-700 font-semibold">
            <p>Error: {error.message}</p>
          </div>
        ) : (
          <div className="space-y-5">
            <Welcome username={username}
                     totalProblems={totalProblems} />
            <Stats data={userStatsData ?? {} as UserStatsI} />
            <Streak data={userStreakData ?? {} as UserStreakI} />
            <Daily data={dailyProblemData ?? {} as DailyProblemI} />
          </div>
        )}
    </div>
  )
}
