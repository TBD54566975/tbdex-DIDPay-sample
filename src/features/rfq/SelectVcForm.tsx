import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { RfqContext } from '../../context/RfqContext'
import { decodeJwt } from '../../utils/SsiUtils'
import '../credentials/VcCard'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

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

const c = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1'
  ],
  'type': [
    'VerifiableCredential',
    'UniversityDegree'
  ],
  'id': 'urn:credential:34502108-4540',
  'issuer': 'did:web:socrates-university.auth0lab.com',
  'issuanceDate': '2020-07-20T13:58:53Z',
  'credentialSubject': {
    'id': 'urn:university:eng:90312',
    'entitlementIdentifier': '90312',
    'name': 'Hanna Herwitz',
    'title': 'Electrical Engineer',
    'description': 'Hanna graduated with honors as an Electrical Engineer',
    'dateOfIssue': '2019-06-15',
    'expiryDate': '2025-03-01',
    'directedBy': 'Socrates',
    'location': 'United States'
  },
  'credentialStatus': {
    'id': 'https://socrates-university.auth0lab.com/vcs/credential/status/14',
    'type': 'CredentialStatusList2017'
  },
  'proof': {
    'type': 'Ed25519Signature2020',
    'created': '2020-07-20T13:58:53Z',
    'proofPurpose': 'assertionMethod',
    'verificationMethod': 'https://socrates-university.auth0lab.com/keys/1',
    'proofValue': 'z2ty8BNvrKCvAXGqJVXF8aZ1jK5o5uXFvhXJksUXhn61uSwJJmWdcntfqvZTLbWmQHpieyhdcrG43em37Jo8bswvR'
  }
}

const m = {
  'id': 'urn:credential:socrates-university.auth0lab.com',
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
        'title': {
          'path': [
            '$.credentialSubject.name',
            '$.vc.credentialSubject.name'
          ],
          'schema': {
            'type': 'string'
          }
        },
        'subtitle': {
          'path': [
            '$.credentialSubject.title',
            '$.vc.credentialSubject.title'
          ],
          'schema': {
            'type': 'string'
          }
        },
        'description': {
          'path': [
            '$.credentialSubject.description',
            '$.vc.credentialSubject.description'
          ],
          'schema': {
            'type': 'string'
          }
        },
        'properties': [
          {
            'path': [
              '$.credentialSubject.dateOfIssue',
              '$.vc.credentialSubject.dateOfIssue'
            ],
            'schema': {
              'type': 'string'
            },
            'label': 'Awarding Date'
          },
          {
            'path': [
              '$.credentialSubject.expiryDate',
              '$.vc.credentialSubject.expiryDate'
            ],
            'schema': {
              'type': 'string'
            },
            'label': 'Expiry Date'
          },
          {
            'path': [
              '$.credentialSubject.directedBy',
              '$.vc.credentialSubject.directedBy'
            ],
            'schema': {
              'type': 'string'
            },
            'label': 'Directed By'
          },
          {
            'path': [
              '$.credentialSubject.location',
              '$.vc.credentialSubject.location'
            ],
            'schema': {
              'type': 'string'
            },
            'label': 'Location'
          }
        ]
      }
    }
  ]
}



function VcDropdown(props: VcDropdownProps) {
  const [selectedVc, setSelectedVc] = useState(props.decodedVcs[0])

  const handleSelectItem = (vc) => {
    setSelectedVc(vc)
    props.setCurrentVc(vc)
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
        }} cred={JSON.stringify(c)} manifest={JSON.stringify(m)} />
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

      {/* 
      <Listbox value={selectedVc} onChange={handleSelectItem}>
        {({ open }) => {
          const selectedVcId = selectedVc.payload.vc.id
          return (
            <>
              <Listbox.Label className="block text-sm font-medium leading-6 text-white">
                {'Matching VCs'}
              </Listbox.Label>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-neutral-900 py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <span className="flex items-center">
                    <span
                      aria-label={'asdasda'}
                      className={classNames(
                        'bg-gray-200',
                        'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                      )}
                    />
                    <span className="ml-3 block truncate">
                      {selectedVcId}
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 w-full overflow-y-auto rounded-md bg-neutral-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {props.decodedVcs.map((vc, index) => {
                      const vcId = vc.payload.vc.id
          
                      return (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            classNames(
                              active ? 'bg-indigo-600 text-gray-300' : 'text-white',
                              'relative cursor-default select-none py-2 pl-3 pr-9'
                            )
                          }
                          value={vc}
                        >
                          {({ selected, active }) => (
                            <>
                              <div className="flex items-center">
                                <span
                                  className={classNames(
                                    'bg-gray-200',
                                    'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                                  )}
                                  aria-hidden="true"
                                />
                                <span
                                  className={classNames(
                                    selected ? 'font-semibold' : 'font-normal',
                                    'ml-3 block truncate'
                                  )}
                                >
                                  {vcId}
                                  <span className="sr-only">
                                    {' '}is{' '}
                                    {'adfkjsdfh'}
                                  </span>
                                </span>
                              </div>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? 'text-white' : 'text-indigo-600',
                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      )
                    })}
                  </Listbox.Options>

                </Transition>
              </div>
            </>
          )
          
        }}
      </Listbox> */}
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
