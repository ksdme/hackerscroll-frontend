import { useState } from 'react'
import useCollapse from 'react-collapsed'

/*
  Hook to animate height collapse of an element. Duration of the enter animation
  is calculated based on the height of the element by default.
*/
export default function useAnimatedCollapse(
  collapsed = false,
  enterDuration = undefined,
  exitDuration = 250,
) {
  const [
    render,
    setRender,
  ] = useState(!collapsed)

  const {
    getCollapseProps,
  } = useCollapse({
    duration: collapsed
      ? exitDuration
      : enterDuration,
    isExpanded: !collapsed,
    onExpandStart: () => setRender(true),
    onExpandEnd: () => setRender(true),
    onCollapseStart: () => setRender(true),
    onCollapseEnd: () => setRender(false),
  })

  return {
    getCollapseProps,
    render,
  }
}
