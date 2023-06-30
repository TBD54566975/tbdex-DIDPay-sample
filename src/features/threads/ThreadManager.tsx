import { TbDEXMessage, OrderStatus, Status } from '@tbd54566975/tbdex';
import { Web5 } from '@tbd54566975/web5';
import { populateThreadMap } from '../FakeObjects';

export type ThreadData = {
  rfq?: TbDEXMessage<'rfq'>;
  quote?: TbDEXMessage<'quote'>;
  orderStatuses: TbDEXMessage<'orderStatus'>[];
};

export class ThreadManager {
  private threadMap: Map<string, ThreadData>;
  private aliceProtocolDefinition;

  constructor(web5: Web5) {
    this.threadMap = new Map<string, ThreadData>();
    this.threadMap = populateThreadMap(10);
    this.aliceProtocolDefinition = {
      protocol: 'https://tbd.website/protocols/tbdex',
      types: {
        RFQ: {
          schema: 'https://tbd.website/protocols/tbdex/RequestForQuote',
          dataFormats: ['application/json'],
        },
        Quote: {
          schema: 'https://tbd.website/protocols/tbdex/Quote',
          dataFormats: ['application/json'],
        },
        OrderStatus: {
          schema: 'https://tbd.website/protocols/tbdex/OrderStatus',
          dataFormats: ['application/json'],
        },
      },
      structure: {
        // alice sends RFQs, not receives them
        RFQ: {
          // whoever received the RFQ that Alice sent, can write back a Quote to Alice
          Quote: {
            $actions: [
              {
                who: 'recipient',
                of: 'RFQ',
                can: 'write',
              },
            ],
            // OrderStatus can be written to Alice's DWN by someone who wrote RFQ/Quote (i.e. PFI)
            OrderStatus: {
              $actions: [
                {
                  who: 'author',
                  of: 'RFQ/Quote',
                  can: 'write',
                },
              ],
            },
          },
        },
      },
    };
    // this.initializeAsync(web5);
  }

  private async initializeAsync(web5: Web5): Promise<void> {
    const records = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: this.aliceProtocolDefinition.protocol,
        },
        dateCreated: 'createdDescending',
      },
    });

    if (records.status.code !== 200) {
      console.error('Failed to query protocol', records.status);
      return;
    }

    if (Array.isArray(records)) {
      await Promise.all(
        records.map(async (record) => {
          const contextId = record.contextId;
          const tbdexMsg = await record.data.json();

          this.threadMap.set(contextId, tbdexMsg);
        })
      );
    } else {
      // Handle the case where records is not an array
      // throw an error, log a warning
    }
  }

  // TODO: rethink, dont rly like this
  public getCompletedOrFailedStatusKeys(): string[] {
    const keysWithCompletedOrFailed: string[] = [];
    const contextIds = Array.from(this.threadMap.keys());

    for (const contextId of contextIds) {
      const threadData = this.getThread(contextId);

      for (const statuses of threadData?.orderStatuses ?? []) {
        const orderStatus = statuses.body as OrderStatus;
        if (orderStatus.orderStatus !== Status.PENDING) {
          keysWithCompletedOrFailed.push(contextId);
        }
      }
    }

    return keysWithCompletedOrFailed;
  }

  // TODO: rethink, dont rly like this
  public getPendingStatusKeys(): string[] {
    const completed = this.getCompletedOrFailedStatusKeys();

    return Array.from(this.threadMap.keys()).filter(
      (key) => !completed.includes(key)
    );
  }

  public getThreadStatus(contextId: string) {
    const threadData = this.getThread(contextId);

    for (const message of threadData?.orderStatuses ?? []) {
      const orderStatus = message.body as OrderStatus;
      if (orderStatus.orderStatus !== Status.PENDING) {
        return orderStatus.orderStatus;
      }
    }
    return Status.PENDING;
  }

  // Useful for displaying threads in home page of DIDPay
  public getThread(contextId: string): ThreadData | undefined {
    return this.threadMap.get(contextId);
  }

  // TODO: or would it be better to query by schema (Quote, Rfq) even tho it's async?
  public getLatestThreadMessage(
    contextId: string
  ): TbDEXMessage<'rfq' | 'quote'> | undefined {
    const threadData = this.getThread(contextId);

    if (!threadData) {
      return undefined;
    }
    if (threadData.quote) {
      return threadData.quote;
    }
    if (threadData.rfq) {
      return threadData.rfq;
    }
    return undefined;
  }
}
