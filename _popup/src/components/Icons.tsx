const icons = [
  {
    name: 'github',
    src: 'github.svg',
    href: 'https://github.com/husamahmud/LeetPush',
  },
  {
    name: 'star',
    src: 'star.svg',
    href: 'https://chromewebstore.google.com/detail/leetpush/gmagfdabfjaipjgdfgddjgongeemkalf?hl=en-GB&authuser=0',
  },
  {
    name: 'bug',
    src: 'bug.svg',
    href: 'https://github.com/husamahmud/LeetPush/issues/new/choose',
  },
]

export default function Icons() {
  return (
    <>
      <div className="flex justify-end items-center gap-3 mb-4">
        {icons.map(icon => (
          <a href={icon.href}
             target="_blank"
             className="hover:scale-125 transition-transform"
             key={icon.name}
          >
            <img src={icon.src}
                 alt={icon.name}
                 width="26rem"
            />
          </a>
        ))}
      </div>
    </>
  )
}
