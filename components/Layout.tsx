import { Fragment } from 'react'

/*
  Layout shell component for a page.
*/
export default function Layout(props: Props) {
  const {
    children,
  } = props

  return (
    <Fragment>
      <div className="min-h-screen flex flex-col">
        <nav className="sticky top-0 z-10 drop-shadow-sm backdrop-blur-sm bg-white/80">
          <div className="container flex justify-between py-4 px-4 md:px-0 mx-auto">
            <div className="font-medium md:pl-0">
              HackerScroll
            </div>

            <a
              className="text-gray-400 md:text-gray-800"
              href="https://github.com/ksdme/hackerscroll-frontend"
              target="_blank"
            >
              GitHub
            </a>
          </div>

          <div className="w-full h-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
        </nav>

        <main className="container mx-auto py-8">
          {children}
        </main>
      </div>
    </Fragment>
  )
}

interface Props {
  children: React.ReactNode
}
