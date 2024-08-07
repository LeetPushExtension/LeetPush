import { IoLogoGithub } from 'react-icons/io'
import { FaBug, FaStar } from 'react-icons/fa'
import { SiBuymeacoffee } from 'react-icons/si'

export const LINKS = [
  {
    name: 'github',
    link: 'https://github.com/LeetPushExtension/LeetPush',
    icon: <IoLogoGithub size="25" />,
  },
  {
    name: 'star',
    link: 'https://chromewebstore.google.com/detail/leetpush/gmagfdabfjaipjgdfgddjgongeemkalf?hl=en-GB&authuser=0',
    icon: <FaStar size="25" />,
  },
  {
    name: 'bug',
    link: 'https://github.com/LeetPushExtension/LeetPush/issues/new/choose',
    icon: <FaBug size="25" />,
  },
  {
    name: 'buymeacoffee',
    link: 'https://www.buymeacoffee.com/husamahmud',
    icon: <SiBuymeacoffee size="25" />,
  },
]
