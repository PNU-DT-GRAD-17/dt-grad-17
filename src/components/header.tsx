import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm text-white">
        <Link to="/" className="font-semibold tracking-wide">
          DT GRAD 17
        </Link>

        <div className="flex gap-6 text-neutral-300">
          <Link to="/designer" className="hover:text-white">
            Designers
          </Link>
          <Link to="/project" className="hover:text-white">
            Projects
          </Link>
          <Link to="/behind" className="hover:text-white">
            Behind
          </Link>
          <Link to="/guestbook" className="hover:text-white">
            Guestbook
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header