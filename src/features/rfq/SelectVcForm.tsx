import { useState, useEffect } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { decodeJwt } from '../../utils/SsiUtils'
import { KycCredential } from '../../credential-manifests'
import '../credentials/VcCard'

type VcDropdownProps = {
  decodedVcs: any[];
  setCurrentVc: (vc: any) => void;
}

export type SelectVcFormData = {
  credential: string;
}

type VcFormProps = {
  vcs: any[];
  setCurrentVc: (vc: any) => void;
  onNext: () => void;
  onBack: () => void;
}

function VcDropdown(props: VcDropdownProps) {
  const [selectedVc, setSelectedVc] = useState(props.decodedVcs[0])

  // TODO: instead of a dropdown make this a card
  // TODO: have a note that says: by continuing you agree.. bleh bleh
  // TODO: select credential manifest dynamically based on VC ID

  return (
    <div>
      <div className="rounded-md">
        <verifiable-credential style={{
          display: 'block',
          maxWidth: '300px',
          margin: '1em auto',
          borderRadius: '1em',
          boxShadow: '0 1px 5px hsl(0, 0%, 10%)',
          fontFamily: 'sans-serif'
        }} cred={JSON.stringify(selectedVc)} manifest={JSON.stringify(KycCredential)} />
      </div>

      <div className="border-l-4 border-yellow-300 bg-neutral-950 p-4 mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-400">
            By continuing, you agree to use your VC to satisfy the offering requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SelectVcForm(props: VcFormProps) {
  const [decodedVcs, setDecodedVcs] = useState(undefined)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const decodedVcs = []
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
          <VcDropdown
            decodedVcs={decodedVcs}
            setCurrentVc={props.setCurrentVc}
          ></VcDropdown>
        </div>
      </div>
    </>
  )
}
