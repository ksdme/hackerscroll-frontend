/*
  Represents the post.
*/
export interface Post {
  id: number
  hn_id: number
  rank?: number
  by: string
  title: string
  url?: string
  text?: string
  date?: string
  Content?: Content
}

/*
  Represents the content of a parsed post.
*/
export interface Content {
  id: number
  direction?: string
  title?: string
  byline?: string
  content: string
  excerpt?: string
  length?: number
}
