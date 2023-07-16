import React, { useState, useEffect } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { decodeJwt } from '../../utils/SsiUtils'
import '../credentials/VcCard'

type VcDropdownProps = {
  decodedVcs: any[];
  setCurrentVc: (vc: any) => void;
};

export type SelectVcFormData = {
  credential: string;
};

type VcFormProps = {
  vcs: any[];
  setCurrentVc: (vc: any) => void;
  onNext: () => void;
  onBack: () => void;
};

function VcDropdown(props: VcDropdownProps) {
  const [selectedVc, setSelectedVc] = useState(props.decodedVcs[0])

  const manifest = {
    'id': selectedVc.id,
    'spec_version': 'https://identity.foundation/credential-manifest/spec/v1.0.0/',
    'issuer': {
      'id': 'did:web:socrates-university.auth0lab.com',
      'name': 'Self-Issued',
      'styles': {
        'background': {
          'color': '#101010'
        },
        'text': {
          'color': '#ffec19'
        }
      }
    },
    'output_descriptors': [
      {
        'id': 'UniversityDegree',
        'schema': 'https://socrates-university.auth0lab.com/schema/UniversityDegree',
        'styles': {
          'background': {
            'color': '#101010'
          },
          'text': {
            'color': '#a6aebd'
          }
        },
        'display': {
          'fullName': {
            'givenName': {
              'path': [
                '$.credentialSubject.givenName',
                '$.payload.vc.credentialSubject.givenName',
              ],
              'schema': {
                'type': 'string'
              }
            },
            'familyName': {
              'path': [
                '$.credentialSubject.familyName',
                '$.payload.vc.credentialSubject.familyName',
              ],
              'schema': {
                'type': 'string'
              }
            },
          },   
          'birthDate': {
            'path': [
              '$.credentialSubject.birthDate',
              '$.payload.vc.credentialSubject.birthDate'
            ],
            'schema': {
              'type': 'string'
            }
          },
          'description': {
            'path': [
              '$.credentialSubject.streetAddress',
              '$.payload.vc.credentialSubject.address.streetAddress'
            ],
            'schema': {
              'type': 'string'
            },
          },
          'properties': [
            {
              'path': [
                '$.credentialSubject.dateOfIssue',
                '$.payload.vc.credentialSubject.address.locality'
              ],
              'schema': {
                'type': 'string'
              },
              'label': 'City'
            },
            {
              'path': [
                '$.credentialSubject.expiryDate',
                '$.payload.vc.credentialSubject.address.region'
              ],
              'schema': {
                'type': 'string'
              },
              'label': 'State'
            },
            {
              'path': [
                '$.credentialSubject.directedBy',
                '$.payload.vc.credentialSubject.address.postalCode'
              ],
              'schema': {
                'type': 'string'
              },
              'label': 'Postal Code'
            },
            {
              'path': [
                '$.credentialSubject.directedBy',
                '$.payload.vc.credentialSubject.address.country'
              ],
              'schema': {
                'type': 'string'
              },
              'label': 'Country'
            },
          ]
        }
      }
    ]
  }

  // TODO: instead of a dropdown make this a card
  // TODO: have a note that says: by continuing you agree.. bleh bleh

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
        }} cred={JSON.stringify(selectedVc)} manifest={JSON.stringify(manifest)} />
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
      console.log(decodedVc.payload)
      decodedVcs.push(decodedVc)
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
