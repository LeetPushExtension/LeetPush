import { Badge } from "@/components/ui/badge";

import { getDifficultyColor } from "@/lib/utils.ts";
import { DailyProblemI } from "@/types/leetpush.interface.ts";

export default function Daily({ data }: { data: DailyProblemI }) {
  return (
    <div>
      <div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-lp-grey text-xs font-medium">Daily Problem</p>
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
              className={`px-1.5 py-0.5 text-sm font-semibold ${getDifficultyColor(data.question.difficulty as "Easy" | "Medium" | "Hard")} rounded-md`}
            >
              {data.question.difficulty}
            </span>
          </div>

          <div className="flex gap-2">
            {data.question.topicTags.map((tag) => (
              <Badge
                key={tag.name}
                className="bg-lp-greyer text-lp-grey hover:bg-lp-greyer rounded-lg font-normal"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
