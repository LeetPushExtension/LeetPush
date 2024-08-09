import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { LINKS } from '@/data/links.tsx'

export default function Links() {
  return (
    <div className="flex items-center justify-end gap-2">
      {LINKS.map(({ name, link, icon }) => (
        <TooltipProvider key={name}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href={link}>{icon}</a>
            </TooltipTrigger>
            <TooltipContent>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}
