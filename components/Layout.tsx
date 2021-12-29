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
        <nav className="sticky top-0 z-10 drop-shadow-sm backdrop-blur-sm bg-white/60">
          <div className="container flex justify-between py-4 px-4 md:px-0 mx-auto">
            <div className="font-medium md:pl-0">
              HackerScroll
            </div>

            <a className="hidden md:block" href="https://github.com/ksdme/hackerscroll-frontend" target="_blank">
              GitHub
            </a>
          </div>

          <div className="w-full h-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
        </nav>

        <main className="container mx-auto py-8">
          {children}
        </main>
      </div>

      <div className="hidden md:block">
        <div className="container flex justify-center md:justify-end mx-auto pb-16">
          <a href="https://twitter.com/ksdme" target="_blank">
            a <span className="text-blue-600">@ksdme</span> product
          </a>
        </div>
      </div>
    </Fragment>
  )
}

interface Props {
  children: React.ReactNode
}
