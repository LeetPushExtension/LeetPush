export default function Footer() {
  return (
    <footer className="mt-3">
      <p className="text-center text-xs text-lp-greyer flex items-center justify-center">
        {new Date().getFullYear()} &copy; Created
        By <span className="font-semibold text-lp-grey flex items-center ml-1">
          Hüsam
          <a href="https://twitter.com/husamahmud"
             target="_blank"
             className="ml-1">
            <img src="twitter.svg"
                 width="12rem"
                 alt="twitter" />
          </a>
        </span>
      </p>
    </footer>
  );
}
