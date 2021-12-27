import { ArrowsExpandIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { MinusCircleIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { Post as PostModel } from '../models/Post'
import { hnItemUrl } from '../utils/urls'
import Button from './Button'

/*
  Post Component.
*/
export default function Post(props: Props) {
  const {
    index,
    post,
  } = props

  const [
    expanded,
    setExpanded,
  ] = useState(false)

  // Toggle the expansion status of the story.
  const toggleExpansion = () => setExpanded(!expanded)

  return (
    <div className="flex flex-col p-4 gap-y-4 divide-y divide-gray-200">
      <div className="flex justify-between items-center flex-wrap gap-y-4 cursor-pointer" onClick={toggleExpansion}>
        <div className="flex gap-x-2">
          <div className="text-gray-400 text-base md:text-lg">
            {index}.
          </div>

          <div className="flex flex-col">
            <h3 className="text-base md:text-lg">
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
                ? MinusCircleIcon
                : ArrowsExpandIcon
            }
            label={
              expanded
                ? 'Collapse'
                : 'Expand'
            }
            onClick={toggleExpansion}
          />

          <Button
            icon={CheckCircleIcon}
            label="Read"
          />

          <Button
            icon={ExternalLinkIcon}
            onClick={() => window.open(hnItemUrl(post.hn_id))}
          />
        </div>
      </div>

      {
        expanded && (
          <div className="py-8 md:py-16">
            {
              // TODO: Check if YouTube link
              // TODO: Check if no content, just show the link
              post?.Content && (
                <ArticleContent
                  post={post}
                />
              )
            }

            <div className="flex justify-center gap-x-4">
              <Button
                icon={CheckCircleIcon}
                label="Mark Read"
              />

              <Button
                icon={CheckCircleIcon}
                label="Mark Read"
              />
            </div>
          </div>
        )
      }
    </div>
  )
}

interface Props {
  index?: number
  post: PostModel
}

/*
  Renders an article content.
*/
function ArticleContent(props: ArticleContentProps) {
  const {
    post,
  } = props

  return (
    <div
      className="
        w-full max-w-3xl break-words mx-auto prose prose-img:rounded prose-a:text-blue-500
        hover:prose-a:text-blue-600 tracking-wide md:leading-8 prose-code:font-monospace prose-code:before:hidden
        prose-code:after:hidden prose-code:bg-black prose-code:text-white prose-code:font-normal prose-code:rounded
        prose-code:px-1 prose-code:mx-1 prose-hr:my-6 md:prose-hr:my-8 prose-img:mx-auto
      "
    >
      <h2 className="pb-6 text-left md:text-center">
        {post.Content?.title}

        {
          post.Content?.byline && (
            <div className="pt-1 text-base font-normal">
              {post?.Content?.byline}
            </div>
          )
        }
      </h2>

      {
        post.Content?.content && (
          <div
            className="w-full"
            dangerouslySetInnerHTML={{
              __html: post.Content?.content,
            }}
          />
        )
      }
    </div>
  )
}

interface ArticleContentProps {
  post: PostModel
}

/*
  Renders YouTube video link.
*/
function YouTubeVideoContent() {
  return (
    <div className="relative rounded overflow-hidden" style={{ paddingBottom: '56.25%' }}>
      <iframe 
        className="w-full h-full absolute top-0 left-0"
        src="https://www.youtube-nocookie.com/embed/?list=PL590L5WQmH8fmto8QIHxA9oU7PLVa3ntk;&autoplay=0&enablejsapi=1&index=0&listType=playlist&loop=1&modestbranding=1"
        allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"
        scrolling="no"
        allowFullScreen>
      </iframe>
    </div>
  )
}
