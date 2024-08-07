import { FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <p className="flex items-center justify-center space-x-3 text-center text-xs">
        <span className="text-neutral-500">&copy; {new Date().getFullYear()}</span>

        <span className="flex items-center space-x-1 font-semibold text-neutral-200">
          <span>Hüsam</span>

          <Link href="https://twitter.com/husamahmud" target="_blank">
            <FaXTwitter />
          </Link>
          <Link href="https://www.linkedin.com/in/husamahmud/" target="_blank">
            <FaLinkedin />
          </Link>
        </span>
      </p>

      <span className="text-xs font-semibold">v1.5.20</span>
    </footer>
  )
}
