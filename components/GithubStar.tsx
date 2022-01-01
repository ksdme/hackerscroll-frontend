import useGithubStars from '../hooks/useGithubStars'

/*
  Renders a GitHub link button for a repository with the number of
  stars.
*/
export default function GithubStar() {
  // Get the star count from the Public API.
  const stars = useGithubStars('ksdme', 'hackerscroll-frontend')

  return (
    <a
      className="flex text-sm rounded border border-gray-300 bg-white"
      href="https://github.com/ksdme/hackerscroll-frontend"
      target="_blank"
    >
      {
        (stars || stars === 0) && (
          <div className="bg-gray-50 px-2 py-1 rounded-l border-r border-gray-300">
            {stars}
          </div>
        )
      }

      <div className="px-2 py-1 rounded-r">
        GitHub
      </div>
    </a>
  )
}
