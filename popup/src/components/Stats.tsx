import { UserStatsI } from "@/types/leetpush.interface.ts";

export default function Stats({ data }: { data: UserStatsI }) {
  const { allQuestionsCount, acSubmissionNum } = data;

  const allQuestions = {
    all: allQuestionsCount[0].count,
    easy: allQuestionsCount[1].count,
    medium: allQuestionsCount[2].count,
    hard: allQuestionsCount[3].count,
  };

  const acSubmissions = {
    all: acSubmissionNum[0].count,
    easy: acSubmissionNum[1].count,
    medium: acSubmissionNum[2].count,
    hard: acSubmissionNum[3].count,
  };

  const easyPercentage: number = (acSubmissions.easy / allQuestions.easy) * 100;
  const mediumPercentage: number =
    (acSubmissions.medium / allQuestions.medium) * 100;
  const hardPercentage: number = (acSubmissions.hard / allQuestions.hard) * 100;

  return (
    <div className="px flex w-full gap-6">
      <div className="flex flex-col justify-between gap-2">
        <p className="flex justify-between">
          <span className="mr-2 text-lp-green">Easy</span>
          <span className="text-sm text-lp-greyer">
            <span className="mr-1 text-base font-semibold text-white">
              {acSubmissions.easy}
            </span>
            /{allQuestions.easy}
          </span>
        </p>

        <p className="flex justify-between">
          <span className="mr-2 text-lp-yellow">Medium</span>
          <span className="text-sm text-lp-greyer">
            <span className="mr-1 text-base font-semibold text-white">
              {acSubmissions.medium}
            </span>
            /{allQuestions.medium}
          </span>
        </p>

        <p className="flex justify-between">
          <span className="mr-2 text-lp-red">Hard</span>
          <span className="text-sm text-lp-greyer">
            <span className="mr-1 text-base font-semibold text-white">
              {acSubmissions.hard}
            </span>
            /{allQuestions.hard}
          </span>
        </p>
      </div>

      <div className="flex w-full flex-1 flex-col justify-between rounded-xl">
        <div className="overflow-hidden rounded-xl bg-lp-green-dark">
          <div
            className="h-2.5 bg-lp-green"
            style={{ width: `${easyPercentage}%` }}
          />
        </div>

        <div className="overflow-hidden rounded-xl bg-lp-yellow-dark">
          <div
            className="h-2.5 bg-lp-yellow"
            style={{ width: `${mediumPercentage}%` }}
          />
        </div>

        <div className="overflow-hidden rounded-xl bg-lp-red-dark">
          <div
            className="h-2.5 bg-lp-red"
            style={{ width: `${hardPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
