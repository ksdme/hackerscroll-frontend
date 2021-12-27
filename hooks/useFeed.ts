import axios from 'axios'
import { useInfiniteQuery } from 'react-query'
import environment from '../environments/local'
import { Post } from '../models/Post'

/*
  Hook to fetch the top posts from the API.
*/
export default function useFeed(initialPage = 1) {
  const fetcher = ({ pageParam = initialPage }) => {
    return axios.get<FeedResponse>(environment.API_SERVER + '/api/top', {
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
