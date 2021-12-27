import { useMemo } from 'react'
import parse from 'url-parse'
import { Post as PostModel } from '../models/Post'

/*
  Renders YouTube video link.
*/
export default function YouTubeVideoContent(props: Props) {
  const {
    post,
  } = props

  // Build the embed url for the video. Assumes that the url is valid
  // and a Video ID is extractable.
  const embed = useMemo(() => {
    return `https://www.youtube-nocookie.com/embed/${extractVideoID(post.url)}`
  }, [
    post.url,
  ])

  return (
    <div className="mx-4 relative rounded overflow-hidden" style={{ paddingBottom: '56.25%' }}>
      <iframe 
        src={embed}
        className="w-full h-full absolute top-0 left-0"
        allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"
        scrolling="no"
        allowFullScreen>
      </iframe>
    </div>
  )
}

interface Props {
  post: PostModel
}

/*
  Returns a boolean indicating if a post can be rendered with
  this component.
*/
export function isApplicable(post: PostModel) {
  if (post.url && extractVideoID(post.url)) {
    return true
  }

  return false
}

/*
  Returns the YouTube Video ID from the URL or null.
*/
function extractVideoID(url: string) {
  const link = parse(url, true)

  if (link.host.endsWith('youtube.com') && link.pathname.startsWith('/watch')) {
    return link.query.v || null
  }

  if (link.host === 'youtu.be') {
    return link.pathname.substring(1)
  }

  return null
}
