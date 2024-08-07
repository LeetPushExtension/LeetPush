export default function Footer() {
  return (
    <footer className="mt-3">
      <p className="text-center text-xs text-lp-greyer flex items-center justify-center">
        &copy; {new Date().getFullYear()} By <span className="font-semibold text-lp-grey flex items-center ml-1">
          Hüsam
          <a href="https://twitter.com/husamahmud"
             target="_blank"
             className="ml-1">
            <img src="twitter.svg"
                 width="17rem"
                 alt="twitter" />
          </a>
        <a href="https://www.linkedin.com/in/husamahmud/"
           target="_blank"
           className="ml-1">
            <img src="linkedin.svg"
                 width="17rem"
                 alt="linkedin" />
          </a>
        </span>
      </p>

      <span className='text-xs font-semibold text-lp-grey'>v1.5.19</span>
    </footer>
  );
}
