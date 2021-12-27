import { ArrowSmDownIcon } from '@heroicons/react/solid'
import { LightBulbIcon } from '@heroicons/react/solid'
import { useMemo } from 'react'
import Button from '../components/Button'
import Layout from '../components/Layout'
import Post from '../components/Post'
import useFeed from '../hooks/useFeed'

/*
  Home page.
*/
export default function IndexPage() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useFeed()

  // Flatten the pages into items.
  const items = useMemo(() => {
    return data
      ?.pages
      ?.map((page) => page?.data?.items)
      ?.flat()
  }, [
    data,
  ])

  return (
    <Layout>
      <div className="flex gap-x-4 px-8 md:px-0 pb-8">
        <Button
          icon={LightBulbIcon}
          label="Expand All"
        />

        <Button
          icon={LightBulbIcon}
          label="Expand Unread"
        />
      </div>

      {
        !isLoading && data && (
          <div className="flex flex-col md:rounded border-y md:border-x border-gray-200 divide-y divide-gray-200">
            {items?.map((item, index) => {
              return (
                <Post
                  key={item.id}
                  index={index+1}
                  post={item}
                />
              )
            })}
          </div>
        )
      }

      {
        hasNextPage && (
          <div className="flex justify-center py-8">
            <Button
              icon={ArrowSmDownIcon}
              label="Load More Stories"
              onClick={fetchNextPage}
            />
          </div>
        )
      }
    </Layout>
  )
}
