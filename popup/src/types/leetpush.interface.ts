export interface DailyProblemI {
  date: string
  link: string
  question: {
    questionId: string
    questionFrontendId: string
    title: string
    titleSlug: string
    difficulty: string
    topicTags: {
      name: string
      slug: string
    }[]
    stats: string
  }
}

export interface UserStatsI {
  allQuestionsCount: {
    difficulty: string
    count: number
  }[]
  acSubmissionNum: {
    difficulty: string
    count: number
  }[]
}

export interface UserStreakI {
  maxStreak: number
  totalActiveDays: number
  fullSubmissionArray: {
    date: string
    value: number
  }[]
}

export interface StreakI {
  date: string
  value: number
}

export interface DayValueI {
  day: number;
  value: number;
}
