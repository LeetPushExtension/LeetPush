export interface ProfileCalendar {
  maxStreak: number
  totalActiveDays: number
  fullSubmissionArray: Submission[]
}

export interface ProfileCalendarI {
  data: {
    matchedUser: {
      userCalendar: {
        streak: number
        totalActiveDays: number
        submissionCalendar: string
      }
    }
  }
}

export interface Submission {
  date: string
  value: number
}
