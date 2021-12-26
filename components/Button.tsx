/*
  Button Component.
*/
export default function Button(props: Props) {
  const {
    icon: Icon,
    label,
    onClick,
  } = props

  return (
    <button
      className="flex items-center gap-x-2 px-3 py-1 text-gray-500 rounded hover:text-gray-800 hover:bg-gray-100 border"
      onClick={onClick}
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
}
