import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { RfqContext } from '../../context/RfqContext'
import { decodeJwt } from '../../utils/SsiUtils'

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
      </Listbox>
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
