import React, { useState, useEffect, useRef } from 'react'
import { TbdexThread } from '../../utils/TbdexThread'
import { useWeb5Context } from '../../context/Web5Context'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Thread } from './Thread'
import { getThreads } from '../../utils/TbdexUtils'

export function ThreadsPage() {
  const [threads, setThreads] = useState<TbdexThread[]>([])
  const [loading, setLoading] = useState(true)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const { web5 } = useWeb5Context()

  // launches the search command pallete
  const handleDiscoverOfferings = () => {
    if (searchButtonRef.current) {
      const keydown = new KeyboardEvent('keydown', {
        key: 'k',
        code: 'KeyK',
        keyCode: 75,
        metaKey: true,
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      })
      searchButtonRef.current.dispatchEvent(keydown)
    }
  }

  useEffect(() => {
    const init = async () => {
      const threads = await getThreads(web5)
      // console.log('in threads page i see this map: ', threads[0].messageRecordMap)
      // console.log('this is what happens when i try to get quote: ', threads[0].messageRecordMap.get('quote'))
      setThreads(threads)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return <></>
  }

  return (
    <div>
      <ul className="mt-7">
        {threads.length === 0 ? (
          <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-gray-400">
              No ongoing orders
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by requesting a quote from an offering.
            </p>
            <div className="mt-6">
              <button
                ref={searchButtonRef}
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleDiscoverOfferings}
              >
                <MagnifyingGlassIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Discover offerings
              </button>
            </div>
          </div>
        ) : (
          threads.map((thread, index) => (
            <div className="flow-root pb-7" key={index}>
              <div className="overflow-hidden bg-neutral-900 shadow sm:rounded-lg rounded-md">
                <div className="px-4 py-6 sm:px-6">
                  <Thread
                    tbdexThread={thread}
                  ></Thread>
                </div>
              </div>
            </div>
          ))
        )}
      </ul>
    </div>
  )
}