/*
  Button Component.
*/
export default function Button(props: Props) {
  const {
    icon: Icon,
    label,
    onClick,
    disableEventPropagation = false,
  } = props

  return (
    <button
      className="
        flex items-center gap-x-2 px-2 py-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100
        border rounded text-sm md:text-base whitespace-nowrap bg-white
      "
      onClick={(event) => {
        if (disableEventPropagation) {
          event.stopPropagation()
        }

        if (onClick) {
          onClick()
        }
      }}
    >
      {
        Icon
          ? <Icon className="h-4" />
          : null
      }
      {label}
    </button>
  )
}

interface Props {
  icon?: React.ComponentType<{ className?: string }>
  label?: string
  onClick?: () => void
  disableEventPropagation?: boolean
}
