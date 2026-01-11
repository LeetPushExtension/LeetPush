import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-3">
      <p className="text-lp-greyer flex items-center justify-center text-center text-xs">
        &copy; {new Date().getFullYear()}
        <span className="text-lp-grey ml-1 flex items-center font-semibold">
          Hüsam
          <a
            href="https://twitter.com/husamahmud"
            target="_blank"
            className="ml-1"
          >
            <FaXTwitter size="16" />
          </a>
          <a
            href="https://www.linkedin.com/in/husamahmud/"
            target="_blank"
            className="ml-1"
          >
            <FaLinkedinIn size="16" />
          </a>
        </span>
      </p>

      <span className="text-lp-grey text-xs font-semibold">v1.7.3</span>
    </footer>
  );
}
