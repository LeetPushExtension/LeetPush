export interface ProfileDataI {
  data: {
    allQuestionsCount: Array<{ difficulty: string; count: number }>
    matchedUser: {
      submitStatsGlobal: {
        acSubmissionNum: Array<{ difficulty: string; count: number }>
      }
    }
  }
}

export interface ProfileData {
  allQuestionsCount: Array<{ difficulty: string; count: number }>
  acSubmissionNum: Array<{ difficulty: string; count: number }>
}
