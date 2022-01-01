import axios from 'axios'
import { useQuery } from 'react-query'

/*
  Hook to fetch the star count for a given Github repo. The hook is
  forgiving and will return null if the data is not available for any
  reason.
*/
export default function useGithubStars(namespace: string, repo: string) {
  // https://docs.github.com/en/rest/reference/repos
  const url = `https://api.github.com/repos/${namespace}/${repo}`

  // Fetcher for querying.
  async function fetcher() {
    const response = await axios.get<Response>(url)
    return response?.data?.stargazers_count
  }

  const {
    data,
  } = useQuery(url, fetcher, {
    retry: 3,
    staleTime: 0,
    cacheTime: Infinity,
  })

  return data ?? null
}

interface Response {
  stargazers_count: number
}
