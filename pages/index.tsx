import { ArrowSmDownIcon } from '@heroicons/react/solid'
import { ChevronDoubleDownIcon } from '@heroicons/react/solid'
import { LightBulbIcon } from '@heroicons/react/solid'
import { SparklesIcon } from '@heroicons/react/solid'
import Head from 'next/head'
import { Fragment, useMemo, useState } from 'react'
import TopBarProgressIndicator from 'react-topbar-progress-indicator'
import createPersistedState from 'use-persisted-state'
import Button from '../components/Button'
import Layout from '../components/Layout'
import Post, { isSmart } from '../components/Post'
import useFeed from '../hooks/useFeed'
import useReads from '../hooks/useReads'
import favicon from '../public/favicon.ico'

// Smart scroll setting needs to be persisted in localStorage.
const useSmartScrollState = createPersistedState('filter-smart-scroll')

/*
  Home page.
*/
export default function IndexPage() {
  const {
    data,
    isLoading,
    isFetching,
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

  const {
    get: getIsRead,
    toggle: toggleIsRead,
  } = useReads()

  // TODO: Use a context or subscription based system to manage this, so it
  // can support use cases like Collapse All.
  const [
    expandAll,
    setExpandAll,
  ] = useState(false)

  const [
    expandAllUnread,
    setExpandAllUnread,
  ] = useState(false)

  const [
    smartScroll,
    setSmartScroll,
  ] = useSmartScrollState(false)

  return (
    <Layout>
      <Head>
        <title>HackerScroll</title>
        <link rel="shortcut icon" href={favicon.src} type="image/x-icon" />
      </Head>

      {
        isFetching && (
          <TopBarProgressIndicator />
        )
      }

      {
        data && (
          <Fragment>
            <div className="flex gap-x-4 px-8 md:px-0 pb-8 overflow-x-scroll scrollbar-hide">
              <Button
                icon={LightBulbIcon}
                label="Expand Unread"
                onClick={() => setExpandAllUnread(true)}
              />

              <Button
                icon={SparklesIcon}
                label={
                  smartScroll
                    ? "Show Hidden Stories"
                    : "Enable Smart Scroll"
                }
                onClick={() => setSmartScroll(!smartScroll)}
              />
            </div>

            {
              !isLoading && (
                <div className="flex flex-col md:rounded border-y md:border-x border-gray-200 divide-y divide-gray-200">
                  {
                    items
                      ?.filter((item) => {
                        return smartScroll
                          ? isSmart(item)
                          : true
                      })
                      ?.map((item, index) => {
                        return (
                          <Post
                            key={item.id}
                            index={index+1}
                            post={item}
                            open={
                              expandAll
                              || (expandAllUnread && !getIsRead(item.id))
                            }
                            isRead={getIsRead(item.id)}
                            onToggleRead={() => toggleIsRead(item.id)}
                          />
                        )
                      })
                  }
                </div>
              )
            }

            {
              hasNextPage && !isLoading && (
                <div className="flex justify-center py-8">
                  <Button
                    icon={ArrowSmDownIcon}
                    label="Load More Stories"
                    onClick={fetchNextPage}
                  />
                </div>
              )
            }
          </Fragment>
        )
      }

      {
        !data && isLoading && (
          <div className="h-64 flex justify-center items-center">
            loading
          </div>
        )
      }
    </Layout>
  )
}
