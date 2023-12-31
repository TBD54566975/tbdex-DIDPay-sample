import { useState, useEffect, useRef } from 'react'
import { TbdexThread } from '../../tbdex-thread'
import { useWeb5Context } from '../../context/Web5Context'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ThreadItem } from './ThreadItem'
import { getThreads } from '../../utils/web5-utils'

export function ThreadsPage() {
  const [threads, setThreads] = useState<TbdexThread[]>([])
  const [initialized, setInitialized] = useState(true)
  const { web5 } = useWeb5Context()
  const searchButtonRef = useRef<HTMLButtonElement>(null)

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
      setThreads(threads)
    }
    init().then(() => {
      setInitialized(true)
    })
  }, [])

  if (!initialized) {
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
                  <ThreadItem
                    tbdexThread={thread}
                  ></ThreadItem>
                </div>
              </div>
            </div>
          ))
        )}
      </ul>
    </div>
  )
}
