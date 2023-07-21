import React, { useState, useEffect } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { DisplayVc } from './DisplayVc'
import { useWeb5Context } from '../../context/Web5Context'
import { getVcs } from '../../utils/web5-utils'

export function ManageVcPage() {
  const { web5, profile } = useWeb5Context()
  const [vcs, setVcs] = useState(undefined)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const init = async () => {
      const vcs = await getVcs(web5)
      setVcs(vcs)
      return vcs
    }
    init().then(() => {
      setInitialized(true)
    })
  }, [])

  if(!initialized) {
    return <></>
  }

  return (
    <div className="relative min-h-screen">
      {vcs.length > 0 ? (
        <DisplayVc vcs={vcs} displayWarning={false} />
      ) : (
        <div className="border-l-4 border-yellow-300 bg-neutral-950 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-400">
                No verifiable credentials found. Create one when requesting a quote 🥰
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
