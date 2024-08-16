import { LINKS } from '@/data/links.tsx'

export default function Links() {
  return (
    <div className="flex items-center justify-end gap-2">
      {LINKS.map(({ link, icon }) => (
        <a href={link}
           key={link}
           target="_blank"
           className="hover:scale-125 transition-transform duration-300 ease-in-out"
        >
          {icon}
        </a>
      ))}
    </div>
  )
}
