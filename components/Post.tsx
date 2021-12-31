import { ChatIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ChevronUpIcon } from '@heroicons/react/outline'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { EyeOffIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
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

  // Control the collapse.
  const {
    render,
    getCollapseProps,
  } = useAnimatedCollapse(!expanded)

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

  return (
    <div className="flex flex-col">
      <div
        className="flex p-4 justify-between items-center flex-wrap md:flex-nowrap gap-y-4 cursor-pointer"
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
      </div>

      {
        render && (
          <div {...getCollapseProps()}>
            {/* Section divider. */}
            <div className="mx-4 md:mx-6 border-b" />

            <div className="px-4">
              <div className="flex flex-col gap-y-8 py-8">
                {
                  (isArticleApplicable(post) && <ArticleContent post={post} />)
                  || (isYouTubeApplicable(post) && <YouTubeVideoContent post={post} />)
                  || (<DefaultContent post={post} />)
                }

                <div className="flex justify-center gap-x-4">
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
              </div>
            </div>

            {/* Indicator of the end of content. */}
            <div className="w-full h-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
          </div>
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
