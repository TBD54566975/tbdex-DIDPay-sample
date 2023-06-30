import { ThreadManager } from '../threads/ThreadManager';
import { useWeb5Context } from '../../context/Web5Context';
import { Threads } from '../threads/Threads';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function HomePage() {
  const { web5, profile } = useWeb5Context();
  let threadManager: ThreadManager = new ThreadManager(web5);
  const keys = threadManager.getPendingStatusKeys();

  // TODO: some sort of polling to get order messages
  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        <div
          style={{
            color: 'var(--color-yellow)',
          }}
        ></div>
      </label>
      <ul className="mt-7">
        {keys.map((contextId, index) => {
          const threadData = threadManager.getThread(contextId);
          return (
            <div className="flow-root pb-7">
              <div className="overflow-hidden bg-neutral-900 shadow sm:rounded-lg rounded-md">
                <div className="px-4 py-6 sm:px-6">
                  <Threads threadData={threadData}></Threads>
                </div>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
