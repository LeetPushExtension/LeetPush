export interface DailyProblem {
  date: string
  link: string
  question: {
    questionId: string
    questionFrontendId: string
    title: string
    titleSlug: string
    difficulty: string
    topicTags: Array<{
      name: string
      slug: string
      translatedName: string | null
    }>
    stats: string
  }
}

export interface DailyProblemI {
  data: {
    activeDailyCodingChallengeQuestion: DailyProblem
  }
}
