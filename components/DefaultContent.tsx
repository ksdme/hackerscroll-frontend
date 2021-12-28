import { useMemo } from 'react'
import parse from 'url-parse'
import { Post } from '../models/Post'
import { hnItemUrl } from '../utils/urls'

/*
  The default content renderer.
*/
export default function DefaultContent(props: Props) {
  const {
    post,
  } = props

  const url = useMemo(() => {
    return parse(post.url ?? hnItemUrl(post.hn_id), true)
  }, [
    post.url,
    post.hn_id,
  ])

  return (
    <button
      className="w-full h-44 flex justify-center items-center"
      onClick={() => window.open(post.url ?? hnItemUrl(post.hn_id))}
    >
      {url.host}
    </button>
  )
}

interface Props {
  post: Post
}
