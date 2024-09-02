import { FaXTwitter, FaLinkedinIn } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="mt-3">
      <p className="flex items-center justify-center text-center text-xs text-lp-greyer">
        &copy; {new Date().getFullYear()}
        <span className="ml-1 flex items-center font-semibold text-lp-grey">
          Hüsam
          <a href="https://twitter.com/husamahmud" target="_blank" className="ml-1">
            <FaXTwitter size="16" />
          </a>
          <a
            href="https://www.linkedin.com/in/husamahmud/"
            target="_blank"
            className="ml-1">
            <FaLinkedinIn size="16" />
          </a>
        </span>
      </p>

      <span className="text-xs font-semibold text-lp-grey">v1.6.24</span>
    </footer>
  )
}
