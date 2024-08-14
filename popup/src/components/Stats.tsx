import { UserStatsI } from '@/types/leetpush.interface.ts'

export default function Stats({ data }: { data: UserStatsI }) {
  const { allQuestionsCount, acSubmissionNum } = data

  const allQuestions = {
    all: allQuestionsCount[0].count,
    easy: allQuestionsCount[1].count,
    medium: allQuestionsCount[2].count,
    hard: allQuestionsCount[3].count,
  }

  const acSubmissions = {
    all: acSubmissionNum[0].count,
    easy: acSubmissionNum[1].count,
    medium: acSubmissionNum[2].count,
    hard: acSubmissionNum[3].count,
  }

  const easyPercentage: number = (acSubmissions.easy / allQuestions.easy) * 100
  const mediumPercentage: number = (acSubmissions.medium / allQuestions.medium) * 100
  const hardPercentage: number = (acSubmissions.hard / allQuestions.hard) * 100

  return (
    <div className="flex gap-6 w-full px">
      <div className="flex justify-between flex-col gap-2">
        <p className="flex justify-between">
          <span className="text-lp-green mr-2">Easy</span>
          <span className="text-lp-greyer text-sm">
            <span className="text-white text-base font-semibold mr-1">{acSubmissions.easy}</span>/{allQuestions.easy}
          </span>
        </p>

        <p className="flex justify-between">
          <span className="text-lp-yellow mr-2">Medium</span>
          <span className="text-lp-greyer text-sm">
            <span className="text-white text-base font-semibold mr-1">{acSubmissions.medium}</span>/{allQuestions.medium}
          </span>
        </p>

        <p className="flex justify-between">
          <span className="text-lp-red mr-2">Hard</span>
          <span className="text-lp-greyer text-sm">
            <span className="text-white text-base font-semibold mr-1">{acSubmissions.hard}</span>/{allQuestions.hard}
          </span>
        </p>
      </div>

      <div className="flex w-full flex-1 flex-col rounded-xl justify-between">
        <div className="bg-lp-green-dark rounded-xl overflow-hidden">
          <div className="bg-lp-green h-2.5"
               style={{ width: `${easyPercentage}%` }} />
        </div>

        <div className="bg-lp-yellow-dark rounded-xl overflow-hidden">
          <div className="bg-lp-yellow h-2.5"
               style={{ width: `${mediumPercentage}%` }} />
        </div>

        <div className="bg-lp-red-dark rounded-xl overflow-hidden">
          <div className="bg-lp-red h-2.5"
               style={{ width: `${hardPercentage}%` }} />
        </div>
      </div>
    </div>
  )
}
