import { Badge } from '@/components/ui/badge'

import { getDifficultyColor } from '@/lib/utils.ts'
import { DailyProblemI } from '@/types/leetpush.interface.ts'

export default function Daily({ data }: { data: DailyProblemI }) {
  return (
    <div>
      <div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <p className="font-medium text-xs text-lp-grey">Daily
              Problem</p>
            <a
              target="_blank"
              href={`https://leetcode.com${data.link}`}
              rel="noreferrer"
              className="text-sm font-medium underline transition-colors duration-200 hover:text-blue-500"
              aria-label={`Read more about the daily problem: ${data.question.title}`}
            >
              {data.question.title}
            </a>
            <span
              className={`text-sm font-semibold px-1.5 py-0.5 ${getDifficultyColor(data.question.difficulty as 'Easy' | 'Medium' | 'Hard')} rounded-md`}
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
  )
}
