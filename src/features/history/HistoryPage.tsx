import React, { Status } from '@tbd54566975/tbdex'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { useWeb5Context } from '../../context/Web5Context'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function HistoryPage() {
  const { web5, profile } = useWeb5Context()
  // TODO: complete this page

  return (
    <>
      <div className='text-white'>TODO</div>
    </>
  )
}
