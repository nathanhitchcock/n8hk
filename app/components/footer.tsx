import { ThemeToggle } from './theme-toggle'

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mb-8 mt-2">
      <ul className="text-muted mt-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-5">
        <li>
          <a
            className="group flex items-center transition-colors hover:text-strong"
            rel="noopener noreferrer"
            target="_blank"
            href="/rss"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">rss</p>
          </a>
        </li>
        <li>
          <a
            className="group flex items-center transition-colors hover:text-strong"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/nathanhitchcock"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">github</p>
          </a>
        </li>
      </ul>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-muted text-sm">
          © {new Date().getFullYear()} MIT License. Built to share ideas on systems,
          automation, and better work.
        </p>
        <ThemeToggle />
      </div>
    </footer>
  )
}
