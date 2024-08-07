export interface ProfileCalendar {
  maxStreak: number
  totalActiveDays: number
  fullSubmissionArray: SubmissionArray[]
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

export interface SubmissionArray {
  date: string
  value: number
}
