import Link from 'next/link'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { LINKS } from '@/data/links'

export default function Links() {
  return (
    <div className="flex items-center justify-end gap-2">
      {LINKS.map(({ name, link, icon }) => (
        <TooltipProvider key={name}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={link}>{icon}</Link>
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
