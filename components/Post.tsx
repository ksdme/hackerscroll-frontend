import { ChatIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ChevronUpIcon } from '@heroicons/react/outline'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { EyeOffIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import useAnimatedCollapse from '../hooks/useAnimatedCollapse'
import { Post as PostModel } from '../models/Post'
import { hnItemUrl } from '../utils/urls'
import ArticleContent, { isApplicable as isArticleApplicable } from './ArticleContent'
import Button from './Button'
import DefaultContent from './DefaultContent'
import YouTubeVideoContent, { isApplicable as isYouTubeApplicable } from './YouTubeContent'

/*
  Post Component.
*/
export default function Post(props: Props) {
  const {
    index,
    post,
    open = false,
    isRead,
    onToggleRead,
  } = props

  // Expansion
  const [
    expanded,
    setExpanded,
  ] = useState(open)

  const toggleExpansion = () => {
    setExpanded(!expanded)
  }

  // Wire up the open prop to expansion.
  useEffect(() => {
    setExpanded(open)
  }, [
    open,
  ])

  // Ref to the root HTML element for this component.
  const ref = useRef<HTMLDivElement>()

  // Control the collapse.
  const {
    getCollapseProps,
    state: collapseState,
    render: renderState,
  } = useAnimatedCollapse(!expanded, {
    onCollapseStart: () => {
      // Scroll back to the top of the post if it's not already there
      // while collapsing.
      if (ref.current.offsetTop < document.scrollingElement.scrollTop) {
        window.scrollTo({
          behavior: 'auto',
          top: ref.current.offsetTop + 1,
        })
      }
    }
  })

  // Action button to toggle the read status of the post.
  const ReadActionButton = ({ autoCollapse }: { autoCollapse: boolean }) => (
    <Button
      icon={
        isRead
          ? EyeOffIcon
          : CheckCircleIcon
      }
      label={
        isRead
          ? "Unread"
          : "Read"
      }
      onClick={() => {
        // In case the post is being set to read and the content is already
        // expanded, collapse it.
        if (autoCollapse && !isRead && expanded) {
          toggleExpansion()
        }

        onToggleRead(!isRead)
      }}
      disableEventPropagation
    />
  )

  // Action to open the post link in a new tab.
  const OpenLinkAction = () => (
    <Button
      icon={ExternalLinkIcon}
      onClick={() => window.open(post.url)}
      disableEventPropagation
    />
  )

  // Action to open the the HackerNews page of the post.
  const OpenThreadAction = () => (
    <Button
      icon={ChatIcon}
      onClick={() => window.open(hnItemUrl(post.hn_id))}
      disableEventPropagation
    />
  )

  // Action buttons related to a post.
  const ActionButtonPanel = () => (
    <div className="w-full md:w-auto flex justify-center gap-x-4">
      <Button
        icon={
          expanded
            ? ChevronUpIcon
            : ChevronDownIcon
        }
        label={
          expanded
            ? 'Collapse'
            : 'Expand'
        }
        onClick={toggleExpansion}
        disableEventPropagation
      />

      <ReadActionButton
        autoCollapse={false}
      />

      {
        post.url && (
          <OpenLinkAction />
        )
      }

      {
        post.url && (
          <OpenThreadAction />
        )
      }
    </div>
  )

  return (
    <div ref={ref} className="flex flex-col">
      <div
        className={clsx(
          'md:sticky top-0 z-10',
          'flex p-4 justify-between items-center flex-wrap',
          'md:flex-nowrap gap-y-4 backdrop-blur-sm bg-white/80 cursor-pointer', {
          'md:border-b': renderState,
        })}
        onClick={toggleExpansion}
      >
        <div className="flex gap-x-2">
          <div className="text-gray-400 text-base md:text-lg">
            {index}.
          </div>

          <div className="flex flex-col">
            <h3
              className={clsx("text-base md:text-lg", {
                'text-gray-400': isRead,
              })}
            >
              {post.title}
            </h3>

            <h4 className="pt-1 md:pt-0 text-sm text-gray-400">
              by {post.by}
            </h4>
          </div>
        </div>

        {/*
          Action button panel is not visible on mobiles by default. It's only displayed once
          it's exapnded by tapping on the headline.
        */}
        <div className="hidden md:block">
          <ActionButtonPanel />
        </div>
      </div>

      {
        renderState && (
          <React.Fragment>
            {/* Show the sticky post action button panel on mobiles */}
            <div className="md:hidden sticky top-0 z-10 backdrop-blur-sm bg-white/80 border-b py-4">
              <ActionButtonPanel />
            </div>

            <div {...getCollapseProps()} className={clsx({
              // Because there is a weird looking slide downwards when a story from the bottom of the
              // screen is collapsed because of the lack of space below, animate the content to fade out
              // to allieviate this.
              'animate-fade-out': collapseState.collapseStarted,
            })}>
              <div className="px-4">
                <div className="flex flex-col gap-y-8 py-8">
                  {
                    (isArticleApplicable(post) && <ArticleContent post={post} />)
                    || (isYouTubeApplicable(post) && <YouTubeVideoContent post={post} />)
                    || (<DefaultContent post={post} />)
                  }

                  <div className="flex justify-center gap-x-4">
                    <ReadActionButton
                      autoCollapse={true}
                    />

                    {
                      post.url && (
                        <OpenLinkAction />
                      )
                    }

                    {
                      post.url && (
                        <OpenThreadAction />
                      )
                    }
                  </div>
                </div>
              </div>

              {/* Indicator of the end of content. */}
              <div className="w-full h-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
            </div>
          </React.Fragment>
        )
      }
    </div>
  )
}

interface Props {
  index?: number
  post: PostModel
  open?: boolean
  isRead: boolean
  onToggleRead: (read: boolean) => void
}

/*
  Returns a boolean indicating if the post fits the smart filter.
*/
export function isSmart(post: PostModel) {
  return (
    isArticleApplicable(post)
    || isYouTubeApplicable(post)
  )
}
