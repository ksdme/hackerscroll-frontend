import { useState } from 'react'
import useCollapse from 'react-collapsed'

/*
  Hook to animate height collapse of an element. Duration of the enter animation
  is calculated based on the height of the element by default.
*/
export default function useAnimatedCollapse(collapsed = false, options: Options = {}) {
  const {
    expandDuration = undefined,
    collapseDuration = 200,
    onCollapseStart = () => null,
    onCollapseEnd = () => null,
  } = options

  const [
    state,
    setState,
  ] = useState({
    expansionStarted: false,
    expansionEnded: false,
    collapseStarted: false,
    collapseEnded: false,
  })

  const {
    getCollapseProps,
  } = useCollapse({
    duration: collapsed
      ? collapseDuration
      : expandDuration,
    onExpandStart: () => setState({
      collapseEnded: false,
      collapseStarted: false,
      expansionEnded: false,
      expansionStarted: true,
    }),
    onExpandEnd: () => setState({
      collapseEnded: false,
      collapseStarted: false,
      expansionEnded: true,
      expansionStarted: false,
    }),
    onCollapseStart: () => {
      setState({
        collapseEnded: false,
        collapseStarted: true,
        expansionEnded: false,
        expansionStarted: false,
      })

      if (onCollapseStart) {
        onCollapseStart()
      }
    },
    onCollapseEnd: () => {
      setState({
        collapseEnded: true,
        collapseStarted: false,
        expansionEnded: false,
        expansionStarted: false,
      })

      if (onCollapseEnd) {
        onCollapseEnd()
      }
    },
    isExpanded: !collapsed,
  })

  return {
    getCollapseProps,
    state,
    render: state.expansionStarted || state.expansionEnded || state.collapseStarted,
  }
}

interface Options {
  collapseDuration?: number | undefined
  expandDuration?: number | undefined
  onCollapseStart?: (() => void)
  onCollapseEnd?: (() => void)
}
