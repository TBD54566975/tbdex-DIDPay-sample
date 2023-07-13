import React, { Fragment, useState, useEffect } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { Offering } from '@tbd54566975/tbdex'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'
import { useWeb5Context } from '../../context/Web5Context'
import { fakeOfferings } from '../FakeObjects'
import { getOfferings } from '../../utils/Web5Utils'

export function OfferingsSearch() {
  const [pfiDid, setPfiDid] = useState('')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const { web5, profile } = useWeb5Context()

  const navigate = useNavigate()

  const handleComboboxChange = (offering: Offering) => {
    const selectedOffering = [offering]
    // TODO: this pfiDid should be hardcoded?
    navigate('/offerings', {
      state: { offerings: selectedOffering, pfiDid: pfiDid },
    })
    setOpen(false)
  }

  const handleInputChange = (event: { target: { value: any } }) => {
    const value = event.target.value
    setQuery(value)
    setPfiDid(value)
  }

  const handleEnter = async () => {
    // only query dwn if pfiDid starts with did:ion:
    if (/^did:ion:/.test(pfiDid)) {
      const offerings = await getOfferings(web5, pfiDid)
      if (offerings) {
        navigate('/offerings', {
          state: { offerings: offerings, pfiDid: pfiDid },
        })
      }
      setOpen(false)
    } else {
      console.log('hehe')
    }
  }

  //TODO: also need to handle searching for pfi by did
  const filteredOfferings =
    query === ''
      ? []
      : fakeOfferings.filter((offering: Offering) => {
        const baseCurrency = offering.baseCurrency.currencyCode
          .toLowerCase()
          .includes(query.toLowerCase())

        const quoteCurrency = offering.quoteCurrency.currencyCode
          .toLowerCase()
          .includes(query.toLowerCase())

        return baseCurrency || quoteCurrency
      })

  function getRate(
    unitPrice: string,
    quoteCurrency: string,
    baseCurrency: string
  ) {
    return `1 ${quoteCurrency} / ${unitPrice} ${baseCurrency}`
  }

  function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(' ')
  }

  useEffect(() => {
    const handleHotkey = (event: KeyboardEvent) => {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault()
        setOpen((prevOpen) => !prevOpen)
      }
    }

    document.addEventListener('keydown', handleHotkey)

    return () => {
      document.removeEventListener('keydown', handleHotkey)
    }
  }, [])

  return (
    <>
      <div className="flex flex-1 items-center ml-auto gap-x-6">
        <div className="relative flex">
          <input
            className="block rounded-md w-full py-1.5 pl-3 pr-12 bg-neutral-900 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            onClick={() => setOpen(true)}
            style={{ outline: 'none', boxShadow: 'none' }}
            readOnly
          />

          {/* <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <span className="hidden lg:inline-block">⌘K</span>
          </span> */}
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <kbd className="hidden lg:inline-block inline-flex items-center rounded border border-gray-500 px-1 font-sans text-xs text-gray-500">
              ⌘K
            </kbd>
          </span>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-full">
          <Transition.Root
            show={open}
            as={Fragment}
            afterLeave={() => setQuery('')}
            appear
          >
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className=" lg:ml-72 fixed inset-0 z-10 overflow-y-auto p-4 sm:my-8 sm:mt-24 mt-24 text-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-400 overflow-hidden rounded-xl bg-neutral-900 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                    <Combobox
                      onChange={(offering: Offering) =>
                        handleComboboxChange(offering)
                      }
                    >
                      <div className="relative">
                        <MagnifyingGlassIcon
                          className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <Combobox.Input
                          className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                          placeholder="Enter a DID..."
                          onChange={handleInputChange}
                          onKeyDown={(event) => {
                            // Listen for enter key
                            if (event.key === 'Enter') {
                              handleEnter()
                            }
                          }}
                        />
                      </div>

                      {filteredOfferings.length > 0 ? (
                        <Combobox.Options
                          static
                          className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-300"
                        >
                          {filteredOfferings.map((offering) => {
                            const rate = getRate(
                              offering.quoteUnitsPerBaseUnit,
                              offering.baseCurrency.currencyCode,
                              offering.quoteCurrency.currencyCode
                            )

                            return (
                              <Combobox.Option
                                key={offering.id}
                                value={offering}
                                className={({ active }) =>
                                  classNames(
                                    'cursor-default select-none px-4 py-2',
                                    active && 'bg-indigo-600 text-white'
                                  )
                                }
                              >
                                ({offering.description}) {rate}
                              </Combobox.Option>
                            )
                          })}
                        </Combobox.Options>
                      ) : (
                        <Combobox.Options
                          static
                          className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-300"
                        >
                          <Combobox.Option
                            key="no-options"
                            value=""
                            className="cursor-default select-none px-4 py-2 text-gray-500"
                            disabled
                          >
                            DID must begin with{' '}
                            <span className="text-indigo-600">did:ion:</span>...
                          </Combobox.Option>
                        </Combobox.Options>
                      )}
                    </Combobox>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      </div>
    </>
  )
}
