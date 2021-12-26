/*
  Layout shell component for a page.
*/
export default function Layout(props: Props) {
  const {
    children,
  } = props

  return (
    <div className="flex flex-col">
      <nav className="sticky top-0 flex justify-center py-4 border-b border-gray-200 backdrop-blur-sm bg-white/80">
        <div className="container">
          Hackers
        </div>
      </nav>

      <div className="flex justify-center py-8">
        <main className="container">
          {children}
        </main>
      </div>
    </div>
  )
}

interface Props {
  children: React.ReactNode
}
