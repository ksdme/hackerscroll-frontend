import Script from 'next/script'
import { Fragment } from 'react'
import GithubStar from '../components/GithubStar'

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
        <nav className="bg-white">
          <div className="container flex justify-between items-center py-4 px-4 md:px-0 mx-auto">
            <div className="font-medium md:pl-0">
              HackerScroll
            </div>

            <GithubStar />
          </div>

          <div className="w-full h-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
        </nav>

        <main className="container mx-auto py-8">
          {children}
        </main>
      </div>

      <Script
        src="https://buttons.github.io/buttons.js"
        strategy="afterInteractive"
      />
    </Fragment>
  )
}

interface Props {
  children: React.ReactNode
}
