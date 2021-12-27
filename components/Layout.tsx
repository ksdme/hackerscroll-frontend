/*
  Layout shell component for a page.
*/
export default function Layout(props: Props) {
  const {
    children,
  } = props

  return (
    <div className="flex flex-col">
      <nav className="sticky top-0 z-10 drop-shadow backdrop-blur-sm bg-white/60">
        <div className="container py-4 mx-auto">
          <div className="font-medium pl-4 md:pl-0">
            HackerScroll
          </div>
        </div>

        <div className="w-full h-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
      </nav>

      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  )
}

interface Props {
  children: React.ReactNode
}
