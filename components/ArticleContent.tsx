import { Post as PostModel } from '../models/Post'

/*
  Renders an article content.
*/
export default function ArticleContent(props: ArticleContentProps) {
  const {
    post,
  } = props

  return (
    <div
      className="
        w-full max-w-3xl break-words mx-auto prose prose-img:rounded prose-a:text-blue-500
        hover:prose-a:text-blue-600 tracking-wide md:leading-8 prose-code:font-monospace prose-code:before:hidden
        prose-code:after:hidden prose-code:bg-gray-50 prose-code:text-black prose-code:font-normal prose-code:rounded
        prose-code:border prose-code:px-1 prose-code:mx-1 prose-hr:my-6 md:prose-hr:my-8 prose-img:mx-auto
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
  Returns a boolean indicating if ArticleContent component
  can render a post.
*/
export function isApplicable(post: PostModel) {
  if (post.Content && post.Content.content) {
    return true
  }

  return false
}
