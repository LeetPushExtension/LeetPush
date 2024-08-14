import { Badge } from '@/components/ui/badge'

import { getDifficultyColor } from '@/lib/utils.ts'
import { DailyProblemI } from '@/types/leetpush.interface.ts'

export default function Daily({ data }: { data: DailyProblemI }) {
  return (
    <div>
      <div>
        <div className="flex flex-col">
          <p className="font-medium text-sm">Daily Problem</p>

          <div className="flex flex-col gap-3">
            <div>
              <a
                href={`https://leetcode.com${data.link}`}
                rel="noreferrer"
                className="text-sm font-semibold underline mr-3 transition-colors duration-200 hover:text-blue-500"
                aria-label={`Read more about the daily problem: ${data.question.title}`}
              >
                {data.question.title}
              </a>
              <span
                className={`text-sm font-semibold px-1 py-1 ${getDifficultyColor(data.question.difficulty as 'Easy' | 'Medium' | 'Hard')} rounded-md`}
              >
              {data.question.difficulty}
            </span>
            </div>

            <div className="flex gap-2">
              {data.question.topicTags.map((tag) => (
                <Badge key={tag.name}
                       className="rounded-lg text-lp-grey hover:bg-lp-greyer bg-lp-greyer font-normal">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
