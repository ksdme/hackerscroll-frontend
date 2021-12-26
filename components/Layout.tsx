/*
  Layout shell component for a page.
*/
export default function Layout(props: Props) {
  const {
    children,
  } = props

  return (
    <div className="flex flex-col">
      <nav className="sticky top-0 flex justify-center py-4 border-b border-gray-200 backdrop-blur-sm bg-white/60">
        <div className="container">
          <div className="font-medium pl-4 md:pl-0">
            HackerScroll
          </div>
        </div>
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
