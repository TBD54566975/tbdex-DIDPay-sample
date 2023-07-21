import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, ArrowPathIcon, UsersIcon, XMarkIcon, HomeIcon } from '@heroicons/react/24/outline'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { classNames } from '../../../utils/tailwind-utils'
import { useWeb5Context } from '../../../context/Web5Context'
import { OfferingsSearch } from '../../offerings/OfferingsSearch'
import { default as leftBracket } from '../../../assets/images/left-bracket-light.svg'
import { default as rightBracket } from '../../../assets/images/right-bracket-light.svg'

let navigation = [
  {
    name: 'Home',
    link: '/',
    icon: HomeIcon,
    current: true,
  },
  {
    name: 'Identity',
    link: '/verifiablecredentials',
    icon: UsersIcon,
    current: false,
  },
  {
    name: 'History',
    link: '/history',
    icon: ArrowPathIcon,
    current: false,
  },
]

export function RootPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentOption, setCurrentOption] = useState('')

  const { profile, web5 } = useWeb5Context()
  const location = useLocation()

  const handleSidebarItemClick = (index: number) => {
    const updatedNavigation = navigation.map((item, i) => ({
      ...item,
      current: i === index,
    }))
    navigation = updatedNavigation

    if (index === -1) {
      setCurrentOption('') // Set header to empty string
    } else {
      console.log(navigation[index].name)
      setCurrentOption(navigation[index].name)
    }

    setSidebarOpen(false)
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-950 px-6 pb-2 ring-1 ring-white/10">
                    <div
                      className="flex h-16 shrink-0 items-center "
                      style={{ filter: 'var(--color-primary-yellow-filter)' }}
                    >
                      <img
                        className="h-8 w-auto"
                        src={leftBracket}
                        alt="left bracket"
                      />
                      <Link
                        to="/"
                        onClick={() => handleSidebarItemClick(-1)}
                        style={{ fontSize: '22px' }}
                      >
                        <div>DIDPay</div>
                      </Link>
                      <img
                        className="h-8 w-auto"
                        src={rightBracket}
                        alt="right bracket"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul className="-mx-2 space-y-1">
                            {navigation.map((item, index) => (
                              <li key={item.name}>
                                <Link
                                  to={item.link}
                                  onClick={() => handleSidebarItemClick(index)}
                                  className={classNames(
                                    item.current
                                      ? 'bg-gray-800 text-white'
                                      : 'text-yellow-300 hover:text-yellow-100 hover:bg-gray-800',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-950 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src={leftBracket}
                alt="left bracket"
                style={{ filter: 'var(--color-primary-yellow-filter)' }}
              />
              <Link
                to="/"
                onClick={() => handleSidebarItemClick(-1)}
                style={{ fontSize: '22px' }}
              >
                <div
                  style={{
                    filter: 'var(--color-primary-yellow-filter)',
                  }}
                >
                  DIDPay
                </div>
              </Link>
              <img
                className="h-8 w-auto"
                src={rightBracket}
                alt="right bracket"
                style={{ filter: 'var(--color-primary-yellow-filter)' }}
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigation.map((item, index) => (
                      <li key={item.name}>
                        <Link
                          to={item.link}
                          onClick={() => handleSidebarItemClick(index)}
                          className={classNames(
                            item.current
                              ? 'bg-gray-800 text-white'
                              : 'text-yellow-300 hover:text-yellow-100 hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-neutral-950 px-4 py-4 shadow-sm sm:px-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="ml-auto lg:gap-x-6 lg:pl-64">
            {/* {navigation.find((item) => item.current)?.name} */}

            <OfferingsSearch></OfferingsSearch>
          </div>
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}
