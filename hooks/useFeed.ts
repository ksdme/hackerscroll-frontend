import axios from 'axios'
import { useInfiniteQuery } from 'react-query'
import { Post } from '../models/Post'

/*
  Hook to fetch the top posts from the API.
*/
export default function useFeed(initialPage = 1) {
  const fetcher = ({ pageParam = initialPage }) => {
    return axios.get<FeedResponse>(process.env.NEXT_PUBLIC_API_SERVER + '/top', {
      params: {
        page: pageParam,
      },
    })
  }

  return useInfiniteQuery('posts', fetcher, {
    cacheTime: 7.5 * 60 * 1000,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      if (lastPage.data?.items?.length) {
        return lastPage.data.page + 1
      }
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.data.page - 1
    },
  })
}

interface FeedResponse {
  page: number
  items: Post[]
}
