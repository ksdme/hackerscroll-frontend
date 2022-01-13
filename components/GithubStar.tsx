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
      className="
        flex text-sm rounded
        dark:text-white
        bg-white dark:bg-zinc-900
        border border-gray-300 dark:border-gray-700
      "
      href="https://github.com/ksdme/hackerscroll-frontend"
      target="_blank"
    >
      {
        (stars || stars === 0) && (
          <div className="
            px-2 py-1 rounded-l
            bg-gray-50 dark:bg-zinc-800
            border-r border-gray-300 dark:border-zinc-700
          ">
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
