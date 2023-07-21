import { useState, useEffect } from 'react'
import { decodeJwt } from '../../utils/ssi-utils'
import { VcCard } from './VcCard'

type DisplayVcProps = {
  vcs: any[]
  displayWarning: boolean
}

export function DisplayVc(props: DisplayVcProps) {
  const [decodedVcs, setDecodedVcs] = useState(undefined)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const decodedVcs = []
    console.log('asdasdasds')
    for (const vc of props.vcs) {
      const decodedVc = decodeJwt(vc)
      decodedVcs.push(decodedVc['payload']['vc'])
    }
    setDecodedVcs(decodedVcs)
    setInitialized(true)
  }, [])

  if(!initialized) {
    return <></>
  }

  return (
    <>
      <div className="mt-8 mb-8 pl-8 pr-8">
        <div className="mt-8 pb-8">
          <VcCard decodedVcs={decodedVcs} displayWarning={props.displayWarning}/>
        </div>
      </div>
    </>
  )
}
