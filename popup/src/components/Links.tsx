import { LINKS } from "@/data/links.tsx";

export default function Links() {
  return (
    <div className="flex items-center justify-end gap-2">
      {LINKS.map(({ link, icon }) => (
        <a
          href={link}
          key={link}
          target="_blank"
          className="transition-transform duration-300 ease-in-out hover:scale-125"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
