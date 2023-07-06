import { useState, useEffect, useRef } from 'react';
import { RecordThread } from './Thread';
import { useWeb5Context } from '../../context/Web5Context';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Thread } from './Thread';
import {
  Offering,
  OrderStatus,
  Quote,
  Rfq,
  Status,
  TbDEXMessage,
  aliceProtocolDefinition,
} from '@tbd54566975/tbdex';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { generateUniqueId, getCurrentTimestamp } from '../FakeObjects';
dayjs.extend(relativeTime);

export function ThreadsPage() {
  const [threadMap, setThreadMap] = useState<{ [key: string]: RecordThread }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const { web5, profile } = useWeb5Context();

  // launches the search command pallete
  const handleDiscoverOfferings = () => {
    if (searchButtonRef.current) {
      const keydown = new KeyboardEvent('keydown', {
        key: 'k',
        code: 'KeyK',
        keyCode: 75,
        metaKey: true,
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      searchButtonRef.current.dispatchEvent(keydown);
    }
  };

  async function init() {
    let threads: { [key: string]: RecordThread } = {};

    const { records: rfqRecords } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: aliceProtocolDefinition.types.RFQ.schema,
        },
      },
    });

    rfqRecords?.forEach(async (rfqRecord) => {
      const rfqMsg = (await rfqRecord.data.json()) as TbDEXMessage<'rfq'>;
      if (rfqMsg.type === 'rfq') {
        const threadId = rfqMsg.threadId;
        threads[threadId] = { rfq: rfqRecord, orderStatuses: [] };
        console.log(rfqMsg);
        setThreadMap(threads);
      }
    });

    setLoading(false);
  }

  // TODO: optimize polling, currently every second
  // TODO: issue where rfqs come and go
  // TODO: may need to query right after rfq sends and user sent home
  useEffect(() => {
    const fetchData = async () => {
      await init();
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 mr-2 text-gray-800 animate-spin dark:text-gray-600 fill-indigo-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
    // Render a loading state or placeholder content
  }

  return (
    <div>
      <ul className="mt-7">
        {Object.keys(threadMap).length === 0 ? (
          <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-gray-400">
              No ongoing orders
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by requesting a quote from an offering.
            </p>
            <div className="mt-6">
              <button
                ref={searchButtonRef}
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleDiscoverOfferings}
              >
                <MagnifyingGlassIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Discover offerings
              </button>
            </div>
          </div>
        ) : (
          Object.keys(threadMap).map((id, index) => (
            <div className="flow-root pb-7" key={index}>
              <div className="overflow-hidden bg-neutral-900 shadow sm:rounded-lg rounded-md">
                <div className="px-4 py-6 sm:px-6">
                  <Thread
                    props={{ rfq: threadMap[id].rfq, orderStatuses: [] }}
                  ></Thread>
                </div>
              </div>
            </div>
          ))
        )}
      </ul>
    </div>
  );
}
