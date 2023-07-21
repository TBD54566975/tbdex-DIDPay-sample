import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { KycCredential } from '../../credential-manifests'
import '../../verifiable-credential'

type VcCardProps = {
  decodedVcs: any[]
  displayWarning: boolean
}

export function VcCard(props: VcCardProps) {
  return (
    <div>
      <div className="rounded-md">
        <verifiable-credential
          style={{
            display: 'block',
            maxWidth: '300px',
            margin: '1em auto',
            borderRadius: '1em',
            boxShadow: '0 1px 5px hsl(0, 0%, 10%)',
            fontFamily: 'sans-serif',
          }}
          cred={JSON.stringify(props.decodedVcs[0])}
          manifest={JSON.stringify(KycCredential)}
        />
      </div>

      {props.displayWarning ? (
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
                By continuing, you agree to use your VC to satisfy the offering
                requirements.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
