import React, { useState, useEffect, useContext} from 'react'
import { decodeJwt } from '../../utils/SsiUtils'
import { EllipsisHorizontalIcon, PlusIcon } from '@heroicons/react/20/solid'
import { RfqContext } from '../../context/RfqContext'
import { VcRender } from '../rfq/SelectVcForm'


export function VerifiableCredentialsPage() {
  const { vcs } = useContext(RfqContext)
  console.log(vcs)

  const [decodedVcs, setDecodedVcs] = useState(undefined)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const decodedVcs = []
    if (vcs) {
      for (const vc of vcs) {
        const decodedVc = decodeJwt(vc)
        decodedVcs.push(decodedVc['payload']['vc'])
      }
      setDecodedVcs(decodedVcs)
      setInitialized(true)
    }
    
  }, [])

  if(!initialized || decodedVcs.length < 1) {
    return <></>
  }

  return (
    <div className="relative min-h-screen">
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8 pl-5 pr-5">
        <VcRender decodedVcs={vcs} />
      </ul>
      <button
        type="button"
        className="fixed bottom-6 right-6 rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <PlusIcon className="h-8 w-8" aria-hidden="true" />
      </button>
    </div>
  )
}
